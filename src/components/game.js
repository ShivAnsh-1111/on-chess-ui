import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import io from "socket.io-client";

const socket = io("https://ui-server.vercel.app");

const Game = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);

  const playerWhite = "Player 1 (White)";
  const playerBlack = "Player 2 (Black)";

  useEffect(() => {
    socket.on("move", (move) => {
      console.log("Received move from server:", move);
      try {
        if (game.move(move)) {
          setFen(game.fen());
          setIsWhiteTurn(!isWhiteTurn);
          setGame(new Chess(game.fen()));
        } else {
          console.error("Invalid move received from server:", move);
        }
      } catch (error) {
        console.error("Error processing move:", error);
      }
    });

    return () => socket.off("move");
  }, [game]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isWhiteTurn) {
        setWhiteTime((prev) => Math.max(prev - 1, 0));
      } else {
        setBlackTime((prev) => Math.max(prev - 1, 0));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isWhiteTurn]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleMove = (sourceSquare, targetSquare) => {
    const move = { from: sourceSquare, to: targetSquare };
    try {
      if (game.move(move)) {
        socket.emit("move", move);
        setFen(game.fen());
        setIsWhiteTurn(!isWhiteTurn);
        setGame(new Chess(game.fen()));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error making move:", error);
    }
  };

  return (
    <div className="game-container" style={{ textAlign: "center", width: "75%", margin: "0 auto" }}>
      <div className="player-info">
        <h2>{playerBlack}</h2>
        <p>Time: {formatTime(blackTime)}</p>
      </div>
      <Chessboard position={fen} onPieceDrop={handleMove} orientation={"white"} boardWidth={window.innerWidth * 0.75} />
      <div className="player-info">
        <h2>{playerWhite}</h2>
        <p>Time: {formatTime(whiteTime)}</p>
      </div>
    </div>
  );
};

socket.on("connect", () => {
  console.log("Connected to server");
});

export default Game;
