import React from 'react';
import { useDrop } from 'react-dnd';

const Square = ({ value, onDrop, index }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'piece',
    drop: () => onDrop(index),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className={`square ${isOver ? 'highlight' : ''}`}>
      {value}
    </div>
  );
};

export default Square;
