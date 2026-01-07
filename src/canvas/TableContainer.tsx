import React from 'react';
import { TableElement, TableCell } from '../types/editor';
import { useEditorStore } from '../store/useEditorStore';
import CanvasBlock from './CanvasBlock';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface DroppableTableCellProps {
    cell: TableCell;
    rowIndex: number;
    colIndex: number;
    parentElement: TableElement;
}

const DroppableTableCell: React.FC<DroppableTableCellProps> = ({ cell, rowIndex, colIndex, parentElement }) => {
    const { document: doc } = useEditorStore();
    const dropId = `${parentElement.id}-cell-${rowIndex}-${colIndex}`;
    
    const { setNodeRef, isOver } = useDroppable({
        id: dropId,
        data: {
            parentId: parentElement.id,
            rowIndex: rowIndex,
            colIndex: colIndex,
            isTableCell: true,
        }
    });

    const isHeader = parentElement.headerRow && rowIndex === 0;

    return (
        <td
            ref={setNodeRef}
            style={{
                padding: `${parentElement.cellPadding ?? 8}px`,
                border: `${parentElement.borderWidth ?? 1}px solid ${parentElement.borderColor || '#e2e8f0'}`,
                backgroundColor: isHeader ? (parentElement.headerColor || '#f8fafc') : (isOver ? '#eff6ff' : 'transparent'),
                minWidth: '20px',
                verticalAlign: 'top',
            }}
        >
            <SortableContext 
                items={cell.content.filter(id => doc.elements[id])} 
                strategy={verticalListSortingStrategy}
            >
                {cell.content
                    .filter((childId) => doc.elements[childId])
                    .map((childId) => (
                        <CanvasBlock key={childId} element={doc.elements[childId]} />
                    ))}
            </SortableContext>
        </td>
    );
};

interface TableContainerProps {
    element: TableElement;
}

const TableContainer: React.FC<TableContainerProps> = ({ element }) => {
    return (
        <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: `${element.borderWidth ?? 1}px solid ${element.borderColor || '#e2e8f0'}`,
        }}>
            <tbody>
                {element.body.map((row, rIdx) => (
                    <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                            <DroppableTableCell
                                key={`${element.id}-cell-${rIdx}-${cIdx}`}
                                cell={cell}
                                rowIndex={rIdx}
                                colIndex={cIdx}
                                parentElement={element}
                            />
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TableContainer;
