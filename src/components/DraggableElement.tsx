import React from 'react';
import { useDrag } from 'react-dnd';

interface DraggableElementProps {
  id: string;
  left: number;
  top: number;
  children: React.ReactNode;
  onMove?: (id: string, clientOffset: { x: number; y: number } | null) => void;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ id, left, top, children, onMove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'element',
    item: { id, left, top },
    end: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      if (onMove) onMove(item.id as string, offset as { x: number; y: number } | null);
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
      }}
    >
      {/* drag handle prevents contentEditable/inputs from blocking drag */}
      <div ref={drag as any} style={{ position: 'absolute', left: -8, top: -8, width: 16, height: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 2, cursor: 'grab' }} />
      <div style={{ opacity: isDragging ? 0.5 : 1, cursor: 'default' }}>{children}</div>
    </div>
  );
};

export default DraggableElement;