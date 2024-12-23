import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Square from './square.js';

const Board = ({ squares, onDrop }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board">
        {squares.map((square, i) => (
          <Square key={i} index={i} value={square} onDrop={onDrop} />
        ))}
      </div>
    </DndProvider>
  );
};

export default Board;