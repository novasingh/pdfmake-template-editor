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
            rowSpan={cell.rowSpan}
            colSpan={cell.colSpan}
            style={{
                padding: `${parentElement.cellPadding ?? 8}px`,
                border: `${parentElement.borderWidth ?? 1}px solid ${parentElement.borderColor || '#e2e8f0'}`,
                backgroundColor: cell.backgroundColor || (isHeader ? (parentElement.headerColor || '#f8fafc') :
                    (isOver ? '#eff6ff' :
                        (parentElement.alternateRowColor && rowIndex % 2 !== 0 ? parentElement.alternateRowColor : 'transparent'))),
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
                        {row.map((cell, cIdx) => {
                            // Check if this cell is covered by a previous rowSpan/colSpan merge
                            let isCovered = false;
                            for (let r = 0; r <= rIdx; r++) {
                                for (let c = 0; c <= (r === rIdx ? cIdx - 1 : element.cols - 1); c++) {
                                    const prevCell = element.body[r][c];
                                    if (prevCell.rowSpan && prevCell.rowSpan > 1) {
                                        if (rIdx >= r && rIdx < r + prevCell.rowSpan && cIdx === c) {
                                            isCovered = true;
                                        }
                                    }
                                    if (prevCell.colSpan && prevCell.colSpan > 1) {
                                        if (rIdx === r && cIdx >= c && cIdx < c + prevCell.colSpan) {
                                            isCovered = true;
                                        }
                                    }
                                    // Complex case: both rowSpan and colSpan
                                    if (prevCell.rowSpan && prevCell.colSpan && (prevCell.rowSpan > 1 || prevCell.colSpan > 1)) {
                                        if (rIdx >= r && rIdx < r + prevCell.rowSpan &&
                                            cIdx >= c && cIdx < c + prevCell.colSpan &&
                                            (rIdx !== r || cIdx !== c)) {
                                            isCovered = true;
                                        }
                                    }
                                }
                            }

                            if (isCovered) return null;

                            return (
                                <DroppableTableCell
                                    key={`${element.id}-cell-${rIdx}-${cIdx}`}
                                    cell={cell}
                                    rowIndex={rIdx}
                                    colIndex={cIdx}
                                    parentElement={element}
                                />
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TableContainer;
