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
    const updateBoard = () => {
      const board = game.board();
      const flatBoard = board.flat().map((piece) => (piece ? `${piece.color}${piece.type}` : null));
      setSquares(flatBoard);
    };

    updateBoard();
    socket.on('move', (move) => {
      game.move(move);
      updateBoard();
      setIsWhiteTurn(!isWhiteTurn);
    });

    return () => socket.off('move');
  }, [game, isWhiteTurn]);

  const handleDrop = (index) => {
    const from = game.SQUARES.find((sq, idx) => idx === index);
    const to = game.SQUARES.find((sq, idx) => idx === index);

    if (game.move({ from, to })) {
      socket.emit('move', { from, to });
      setIsWhiteTurn(!isWhiteTurn);
    }
  };

  return (
    <div className="game">
      <Board squares={squares} onDrop={handleDrop} />
    </div>
  );
};

export default Game;
