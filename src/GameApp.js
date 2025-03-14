import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const initialBoard = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"]
];

const ChessBoardContainer = styled.div`
  border: solid;
  text-align: center;
`;

const ChessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 50px);
  grid-template-rows: repeat(8, 50px);
  gap: 0;
  margin: 20px auto;
`;

const Square = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  cursor: pointer;
  border: 1px solid #000;
  position: relative;
  background-color: ${({ light }) => (light ? "#f0d9b5" : "#b58863")};
  &.selected {
    background-color: yellow;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

const StartButton = styled.button`
  padding: 5px 10px;
  background-color: #b600ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
`;

const ChessBoard = () => {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const [board, setBoard] = useState(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [message, setMessage] = useState("");
  const [moved, setMoved] = useState("");
  const [gameStart, setStart] = useState(false);
  const [srError, setSrError] = useState(false);

  const startGame = async () => {
    setBoard(initialBoard);
    setSelectedSquare(null);
    setMessage("");
    setStart(true);
    alert("Game Started !!");
    var url = apiUrl + "/chess-game/game/start";
    var payload = {
      player1Id: "1",
      player2Id: sessionStorage.getItem("uid"),
    };
    try {
      const response = await axios.post(url, payload);
      sessionStorage.setItem("gid", response.data.id);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const makeMove = async (move) => {
    var url = apiUrl + "/chess-game/game/move";
    var payload = {
      gameId: sessionStorage.getItem("gid"),
      move: move,
      player: "1VS" + sessionStorage.getItem("uid"),
    };
    try {
      const response = await axios.post(url, payload);
      if (response.data.status === "finished") {
        alert("Checkmate !!");
      }
    } catch (error) {
      setStart(false);
      setSrError(true);
      alert(error.response.data.error);
    }
  };

  const handleSquareClick = (row, col) => {
    if (!srError) {
      if (gameStart) {
        const piece = board[row][col];
        var move = moved + piece + row + col;
        if (selectedSquare) {
          makeMove(move);
          const [selectedRow, selectedCol] = selectedSquare;
          const newBoard = [...board];
          newBoard[row][col] = board[selectedRow][selectedCol];
          newBoard[selectedRow][selectedCol] = "";
          setBoard(newBoard);
          setSelectedSquare(null);
          setMessage("Move made!");
          setMoved("");
        } else if (piece) {
          setSelectedSquare([row, col]);
          setMessage(`Selected ${piece}`);
          setMoved(move);
        }
      } else {
        alert("Start the game first!");
      }
    } else {
      alert("Refresh your screen!");
    }
  };

  const renderPiece = (piece) => {
    if (!piece) return null;
    const pieceSymbols = {
      p: "♟", P: "♙", r: "♜", R: "♖", n: "♞", N: "♘", b: "♝", B: "♗", q: "♛", Q: "♕", k: "♚", K: "♔",
    };
    return <span>{pieceSymbols[piece]}</span>;
  };

  return (
    <ChessBoardContainer>
      <h1>Chess Game</h1>
      <ChessGrid>
        {board.map((row, rowIndex) => (
          row.map((col, colIndex) => (
            <Square
              key={`${rowIndex}-${colIndex}`}
              light={(rowIndex + colIndex) % 2 === 0}
              className={selectedSquare?.[0] === rowIndex && selectedSquare?.[1] === colIndex ? "selected" : ""}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              {renderPiece(col)}
            </Square>
          ))
        ))}
      </ChessGrid>
      <p>{message}</p>
      <StartButton onClick={startGame}>Start Game</StartButton>
    </ChessBoardContainer>
  );
};

export default ChessBoard;
