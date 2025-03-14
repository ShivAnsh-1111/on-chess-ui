import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("https://ui-server.vercel.app");

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

  const playerWhite = sessionStorage.getItem("username") || "Player 1";
  const playerBlack = sessionStorage.getItem("Player2") || "Player 2";

  useEffect(() => {
    socket.on("move", (move) => {
      console.log("Received move from server:", move);
      try {
        const updatedGame = new Chess(game.fen());
        if (updatedGame.move(move)) {
          setGame(updatedGame);
          setFen(updatedGame.fen());
          setIsWhiteTurn(!isWhiteTurn);
        }
      } catch (error) {
        console.error("Error processing move:", error);
      }
    });

    return () => socket.off("move");
  }, [game]);

  useEffect(() => {
    if (!isGameStarted) return;

    const timer = setInterval(() => {
      if (isWhiteTurn) {
        setWhiteTime((prev) => Math.max(prev - 1, 0));
      } else {
        setBlackTime((prev) => Math.max(prev - 1, 0));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isWhiteTurn, isGameStarted]);

  useEffect(() => {
    const handleResize = () => {
      setBoardSize(Math.min(window.innerWidth * 0.75, 500)); // Responsive sizing
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleMove = (sourceSquare, targetSquare) => {
    if (!isGameStarted) return false;

    const move = { from: sourceSquare, to: targetSquare };
    try {
      const updatedGame = new Chess(game.fen());
      if (updatedGame.move(move)) {
        socket.emit("move", move);
        setGame(updatedGame);
        setFen(updatedGame.fen());
        setIsWhiteTurn(!isWhiteTurn);
        return true;
      }
    } catch (error) {
      console.error("Error making move:", error);
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
        <button style={styles.startButton} onClick={() => setIsGameStarted(true)}>
          Start Game
        </button>
      )}
    </div>
  );
};

// Inline styles
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
    flexDirection: "column", // Stack name & time
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
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
    flexDirection: "column", // Stack name & time
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
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

socket.on("connect", () => {
  console.log("Connected to server");
});

export default Game;
