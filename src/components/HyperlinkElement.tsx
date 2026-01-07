import React from 'react';
import DraggableElement from './DraggableElement';

interface HyperlinkElementProps {
  id: string;
  left: number;
  top: number;
  text?: string;
  url?: string;
  onUpdate: (id: string, updates: Record<string, any>) => void;
}

const HyperlinkElement: React.FC<HyperlinkElementProps> = ({ id, left, top, text, url, onUpdate }) => {
  const edit = () => {
    const newUrl = window.prompt('Enter URL', url || '') || url;
    const newText = window.prompt('Text', text || '') || text;
    onUpdate(id, { url: newUrl, text: newText });
  };

  return (
    <DraggableElement id={id} left={left} top={top} onMove={(i, offset) => onUpdate(id, { __clientOffset: offset })}>
      <a href={url} onDoubleClick={(e) => { e.preventDefault(); edit(); }} target="_blank" rel="noreferrer">{text || 'Link'}</a>
    </DraggableElement>
  );
};

export default HyperlinkElement;
