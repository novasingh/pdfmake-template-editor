import React from 'react';
import { TableElement } from '../types/editor';
import { useEditorStore } from '../store/useEditorStore';
import CanvasBlock from './CanvasBlock';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface TableContainerProps {
    element: TableElement;
}

const TableContainer: React.FC<TableContainerProps> = ({ element }) => {
    const { document: doc } = useEditorStore();

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
                            const dropId = `${element.id}-cell-${rIdx}-${cIdx}`;
                            const { setNodeRef, isOver } = useDroppable({
                                id: dropId,
                                data: {
                                    parentId: element.id,
                                    rowIndex: rIdx,
                                    colIndex: cIdx,
                                    isTableCell: true,
                                }
                            });

                            const isHeader = element.headerRow && rIdx === 0;

                            return (
                                <td
                                    key={dropId}
                                    ref={setNodeRef}
                                    style={{
                                        padding: `${element.cellPadding ?? 8}px`,
                                        border: `${element.borderWidth ?? 1}px solid ${element.borderColor || '#e2e8f0'}`,
                                        backgroundColor: isHeader ? (element.headerColor || '#f8fafc') : (isOver ? '#eff6ff' : 'transparent'),
                                        minWidth: '20px',
                                        verticalAlign: 'top',
                                    }}
                                >
                                    <SortableContext items={cell.content} strategy={verticalListSortingStrategy}>
                                        {cell.content.map((childId) => (
                                            <CanvasBlock key={childId} element={doc.elements[childId]} />
                                        ))}
                                    </SortableContext>
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TableContainer;
