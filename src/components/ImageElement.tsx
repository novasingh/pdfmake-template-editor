import React from 'react';
import DraggableElement from './DraggableElement';

interface ImageElementProps {
  id: string;
  left: number;
  top: number;
  src?: string;
  onUpdate: (id: string, updates: Record<string, any>) => void;
}

const ImageElement: React.FC<ImageElementProps> = ({ id, left, top, src, onUpdate }) => {
  return (
    <DraggableElement id={id} left={left} top={top} onMove={(i, offset) => onUpdate(id, { __clientOffset: offset })}>
      <img src={src || ''} alt="img" style={{ maxWidth: 200, maxHeight: 200 }} />
    </DraggableElement>
  );
};

export default ImageElement;
