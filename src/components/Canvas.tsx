import React from 'react';
import { useDrop } from 'react-dnd';

interface CanvasProps {
  children: React.ReactNode;
  onDrop: (item: any, offset: any) => void;
  className?: string;
}

const Canvas: React.FC<CanvasProps> = ({ children, onDrop, className }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'element',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      onDrop(item, offset);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={className}
      style={{
        width: '100%',
        height: '600px',
        border: '1px solid black',
        position: 'relative',
        backgroundColor: isOver ? 'lightblue' : 'white',
      }}
    >
      {children}
    </div>
  );
};

export default Canvas;