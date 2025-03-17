import React, { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND_URL;
const wsUrl = process.env.REACT_APP_WS_URL;

const Game = () => {
    const navigate = useNavigate();
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    
    useEffect(() => {
      if (!isAuthenticated) {
        navigate("/");
      }
    }, [isAuthenticated, navigate]);

    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState("start");
    const [isWhiteTurn, setIsWhiteTurn] = useState(true);
    const [whiteTime, setWhiteTime] = useState(600);
    const [blackTime, setBlackTime] = useState(600);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [boardSize, setBoardSize] = useState(window.innerWidth * 0.5);
    const [client, setClient] = useState(null);

    const playerWhite = sessionStorage.getItem("username") || "Player 1";
    const playerBlack = sessionStorage.getItem("Player2") || "Player 2";

    const startGame = async () => {
      //setBoard(initialBoard);
      //setSelectedSquare(null);
      //setMessage("");
      //setStart(true);
      setIsGameStarted(true)
      alert("Game Started !!");
      var url = apiUrl + "/chess-game/game/start";
      var payload = {
        player1Id: sessionStorage.getItem("uid"),
        player2Id: "1",
      };
      try {
        const response = await axios.post(url, payload);
        sessionStorage.setItem("gid", response.data.id);
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
      }
      console.log("gid: ",sessionStorage.getItem("gid"));
    };

    // 🔹 Initialize WebSocket with SockJS
    useEffect(() => {
        const socket = new SockJS(wsUrl);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            reconnectDelay: 5000, // Auto-reconnect
        });

        stompClient.onConnect = () => {
            console.log("✅ Connected to WebSocket");

            // Subscribe to game moves
            stompClient.subscribe("/topic/game", (message) => {
                const move = JSON.parse(message.body);
                console.log("📩 Received move:", move);

                const updatedGame = new Chess(game.fen());
                if (updatedGame.move(move)) {
                    setGame(updatedGame);
                    setFen(updatedGame.fen());
                    setIsWhiteTurn((prev) => !prev);
                }
            });

            // Notify backend that a player has joined
            stompClient.publish({
                destination: "/app/game.join",
                body: JSON.stringify({ player: playerWhite }),
            });
        };

        stompClient.activate();
        setClient(stompClient);

        return () => stompClient.deactivate();
    }, []);

    // ⏳ Handle game timer
    useEffect(() => {
      if (!isGameStarted) return;

      const timer = setInterval(() => {
        setWhiteTime((prev) => (isWhiteTurn ? Math.max(prev - 1, 0) : prev));
        setBlackTime((prev) => (!isWhiteTurn ? Math.max(prev - 1, 0) : prev));
      }, 1000);

      return () => clearInterval(timer);
    }, [isWhiteTurn, isGameStarted]);

    // 🎯 Resize board dynamically
    useEffect(() => {
      const handleResize = () => {
        setBoardSize(Math.min(window.innerWidth * 0.75, 500));
      };

      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ⏳ Format timer display
    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // ♟ Handle piece movement
    const handleMove = (sourceSquare, targetSquare) => {
        if (!isGameStarted) return false;
        
        const move = { from: sourceSquare, to: targetSquare };

        try {
            const updatedGame = new Chess(game.fen());
            if (updatedGame.move(move)) {
                if (client && client.connected) {
                    client.publish({
                        destination: "/app/move",
                        body: JSON.stringify(move),
                    });
                } else {
                    console.warn("⚠️ STOMP Client not connected.");
                }

                setGame(updatedGame);
                setFen(updatedGame.fen());
                setIsWhiteTurn(!isWhiteTurn);
                return true;
            }
        } catch (error) {
            console.error("❌ Error making move:", error);
        }
        return false;
    };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h5>Online Chess Game</h5>
      </div>

      <div style={styles.playerContainer2}>
        <div style={styles.playerBox2}>
          <h3>{playerBlack}</h3>
          <h3>Time: {formatTime(blackTime)}</h3>
        </div>
      </div>

      <Chessboard position={fen} onPieceDrop={handleMove} boardWidth={boardSize} />

      <div style={styles.playerContainer1}>
        <div style={styles.playerBox1}>
          <h3>{playerWhite}</h3>
          <h3>Time: {formatTime(whiteTime)}</h3>
        </div>
      </div>

      {!isGameStarted && (
        <button style={styles.startButton} onClick={startGame}>
          Start Game
        </button>
      )}
    </div>
  );
};

// 🎨 Styles
const styles = {
  container: {
    textAlign: "center",
    margin: "0 auto",
    maxWidth: "600px",
    padding: "20px",
  },
  header: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  playerContainer1: {
    display: "flex",
    justifyContent: "right",
    marginBottom: "10px",
  },
  playerBox1: {
    backgroundColor: "rgb(111 211 75)",
    color: "white",
    padding: "5px",
    borderRadius: "8px",
    width: "150px",
    height: "50px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "10px",
    textAlign: "center",
    fontFamily: "system-ui",
  },
  playerContainer2: {
    display: "flex",
    justifyContent: "left",
    marginBottom: "10px",
  },
  playerBox2: {
    backgroundColor: "#5513A6",
    color: "white",
    padding: "5px",
    borderRadius: "8px",
    width: "150px",
    height: "50px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "10px",
    textAlign: "center",
    fontFamily: "system-ui",
  },
  startButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default Game;
