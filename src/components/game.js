import React, { useState, useEffect } from 'react';
import Board from './board.js';
import { Chess } from 'chess.js';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const Game = () => {
  const [game, setGame] = useState(new Chess());
  const [squares, setSquares] = useState(Array(64).fill(null));
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);

  useEffect(() => {
    socket.on('move', (move) => {
      game.move(move); // Apply the received move
      updateBoard();   // Update the UI
      setIsWhiteTurn(!isWhiteTurn);
    });
  
    return () => socket.off('move');
  }, [game]); 

  const [selectedSquare, setSelectedSquare] = useState(null);

  const handleDrop = (targetIndex) => {
    if (selectedSquare !== null) {
      const from = game.SQUARES[selectedSquare];
      const to = game.SQUARES[targetIndex];

      if (game.move({ from, to })) {
        socket.emit('move', { from, to }); // Emit move to server
        setIsWhiteTurn(!isWhiteTurn);     // Update turn
        setSelectedSquare(null);          // Reset selection
      }
    } else {
      setSelectedSquare(targetIndex);     // Set initial selection
    }
  };

  return (
    <div className="game">
      <Board squares={squares} onDrop={handleDrop} />
    </div>
  );
};

socket.on('connect', () => {
  console.log('Connected to server');
});

export default Game;
