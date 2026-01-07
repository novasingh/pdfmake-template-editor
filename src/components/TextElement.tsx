import React from 'react';
import DraggableElement from './DraggableElement';

interface TextElementProps {
  id: string;
  left: number;
  top: number;
  text?: string;
  onUpdate: (id: string, updates: Record<string, any>) => void;
  onMove?: (id: string, offset: { x: number; y: number } | null) => void;
}

const TextElement: React.FC<TextElementProps> = ({ id, left, top, text, onUpdate, onMove }) => {
  return (
    <DraggableElement id={id} left={left} top={top} onMove={onMove}>
      <div
        contentEditable
        onBlur={(e) => onUpdate(id, { text: (e.target as HTMLElement).textContent || '' })}
        style={{ border: '1px solid gray', padding: '5px', minWidth: '100px' }}
      >
        {text || ''}
      </div>
    </DraggableElement>
  );
};

export default TextElement;