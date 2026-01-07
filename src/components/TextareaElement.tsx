import React from 'react';
import DraggableElement from './DraggableElement';

interface TextareaElementProps {
  id: string;
  left: number;
  top: number;
  text?: string;
  onUpdate: (id: string, updates: Record<string, any>) => void;
}

const TextareaElement: React.FC<TextareaElementProps> = ({ id, left, top, text = '', onUpdate }) => {
  return (
    <DraggableElement id={id} left={left} top={top} onMove={(i, offset) => onUpdate(id, { __clientOffset: offset })}>
      <textarea
        value={text}
        onChange={(e) => onUpdate(id, { text: e.target.value })}
        style={{ minWidth: 200, minHeight: 100 }}
      />
    </DraggableElement>
  );
};

export default TextareaElement;
