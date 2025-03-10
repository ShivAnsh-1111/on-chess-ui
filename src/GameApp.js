import React, { useState, useEffect } from "react";
import "./ChessBoard.css";  // Ensure this CSS file is correct
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

// Initial chess board setup with pieces
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

// Helper to determine piece color
const isWhite = (piece) => piece === piece.toUpperCase();


const ChessBoard = () => {
  const [board, setBoard] = useState(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [message, setMessage] = useState("");
  const [moved, setMoved] = useState("");
  const [gameStart, setStart] = useState(false);
  const [srError, setSrError] = useState(false);
  
  const startGame=async()=>{
    setBoard(initialBoard);
    setSelectedSquare(null);
    setMessage("");
    setStart(true);
    alert('Game Started !!');
    var url = apiUrl+'/chess-game/game/start';
    var payload = {
      player1Id: '1' ,
      player2Id: sessionStorage.getItem("uid"),
    };
    try {
      console.log('payload',payload);
      const response = await axios.post(url,payload);
      console.log('game id:',response.data.id);
      sessionStorage.setItem('gid',response.data.id);
      } catch(error){
      console.error('Error:', error.response ? error.response.data : error.message);
      }
      
  }
  const makeMove=async(move)=>{
    var url = apiUrl+'/chess-game/game/move';
    var payload = {
      gameId:sessionStorage.getItem("gid"),
      move: move ,
      player: '1VS'+sessionStorage.getItem("uid"),
    };
  
    try {
    console.log('payload',payload);
    const response = await axios.post(url,payload);
    console.log(response.data);
      if(response.data.status == 'finished'){
        
        alert('Checkmate !!');
      }
    } catch(error){
      setStart(false);
      setSrError(true);
    console.error('Error:', error.response ? error.response.data : error.message);
    alert(error.response.data.error);
    }
    
  };

  const handleSquareClick = (row, col) => {
    if(!srError){
    if(gameStart){
    const piece = board[row][col];
    var move = moved+piece+row+col;
    console.log(move);
    console.log('selectedSquare:',selectedSquare);
    
    if (selectedSquare) {
      makeMove(move);
      // Make move logic here (simplified for now)
      const [selectedRow, selectedCol] = selectedSquare;
      const newBoard = [...board];
      newBoard[row][col] = board[selectedRow][selectedCol];
      newBoard[selectedRow][selectedCol] = "";

      setBoard(newBoard);
      setSelectedSquare(null);
      setMessage("Move made!");
      setMoved('');
    } else if (piece) {
      // Select a piece if there's one on the clicked square
      setSelectedSquare([row, col]);
      setMessage(`Selected ${piece}`);
      setMoved(move);
      console.log(`Selected ${piece}`);
    }
    } else {
      alert('Start the game first !');
    }
  } else {
    alert('Refresh your screen !!');
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
    <div style={{border: "solid"}}>
      <h1>Chess Game</h1>
      <div className="chess-board">
        {board.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((col, colIndex) => (
              <div
                key={colIndex}
                className={`square ${((rowIndex + colIndex) % 2 === 0) ? "light" : "dark"} ${selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex ? "selected" : ""}`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {renderPiece(col)}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p>{message}</p>
      <div>
        <button
                onClick={startGame}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#B600FF",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Start Game
              </button>
      </div>
    </div>
  );
};

export default ChessBoard;
