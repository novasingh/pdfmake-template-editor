import React from 'react';
import DraggableElement from './DraggableElement';

interface TableElementProps {
  id: string;
  left: number;
  top: number;
  rows?: number;
  cols?: number;
  onUpdate: (id: string, updates: Record<string, any>) => void;
}

const TableElement: React.FC<TableElementProps> = ({ id, left, top, rows = 2, cols = 2, onUpdate }) => {
  const body = Array.from({ length: rows }).map(() => Array.from({ length: cols }).map(() => ''));
  return (
    <DraggableElement id={id} left={left} top={top} onMove={(i, offset) => onUpdate(id, { __clientOffset: offset })}>
      <table style={{ borderCollapse: 'collapse', border: '1px solid #ccc' }}>
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri}>
              {r.map((c, ci) => (
                <td key={ci} style={{ border: '1px solid #ddd', padding: 6, minWidth: 50, minHeight: 24 }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </DraggableElement>
  );
};

export default TableElement;
