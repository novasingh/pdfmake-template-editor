import React from 'react';
import { TableElement, TableCell } from '../types/editor';
import { useEditorStore } from '../store/useEditorStore';
import CanvasBlock from './CanvasBlock';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import '../styles/TableContainer.css';

interface DroppableTableCellProps {
    cell: TableCell;
    rowIndex: number;
    colIndex: number;
    parentElement: TableElement;
}

const DroppableTableCell: React.FC<DroppableTableCellProps> = ({ cell, rowIndex, colIndex, parentElement }) => {
    const { document: doc, updateTableWidths } = useEditorStore();
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

    const [isResizing, setIsResizing] = React.useState(false);

    const handleResizeStart = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
        const startX = e.pageX;
        const currentWidths = parentElement.widths || Array(parentElement.cols).fill('*');
        const startWidth = (e.currentTarget.parentElement as HTMLElement).offsetWidth;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const diff = moveEvent.pageX - startX;
            const newWidthPx = Math.max(20, startWidth + diff);
            const newWidthPt = newWidthPx * 0.75; // Convert px to pt (72/96)
            const newWidths = [...currentWidths];
            newWidths[colIndex] = newWidthPt;
            updateTableWidths(parentElement.id, newWidths);
        };

        const onMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    return (
        <td
            ref={setNodeRef}
            rowSpan={cell.rowSpan}
            colSpan={cell.colSpan}
            style={{
                padding: `${parentElement.cellPadding ?? 5}pt`,
                border: `${parentElement.borderWidth ?? 1}pt solid ${parentElement.borderColor || '#e2e8f0'}`,
                backgroundColor: cell.backgroundColor || (isHeader ? (parentElement.headerColor || '#f8fafc') :
                    (isOver ? '#eff6ff' :
                        (parentElement.alternateRowColor && rowIndex % 2 !== 0 ? parentElement.alternateRowColor : 'transparent'))),
                minWidth: '20px',
                verticalAlign: 'top',
                position: 'relative'
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

            {/* Column Resize Handle */}
            <div
                className={`col-resize-handle ${isResizing ? 'active' : ''}`}
                onMouseDown={handleResizeStart}
            />
        </td>
    );
};

interface TableContainerProps {
    element: TableElement;
}

const TableContainer: React.FC<TableContainerProps> = ({ element }) => {
    const { addTableRow, removeTableRow, addTableColumn, removeTableColumn } = useEditorStore();

    return (
        <div className="table-container-wrapper">
            {/* Column Management Controls */}
            <div className="col-controls">
                {Array.from({ length: element.cols }).map((_, cIdx) => {
                    const widthPt = element.widths?.[cIdx];
                    const widthPx = typeof widthPt === 'number' ? widthPt * 1.333333 : 0;

                    return (
                        <div key={cIdx} style={{
                            display: 'flex',
                            gap: '2px',
                            flex: widthPt === '*' ? '1' : 'none',
                            width: widthPx > 0 ? `${widthPx}px` : 'auto',
                            justifyContent: 'center'
                        }}>
                            <button className="table-btn delete" onClick={() => removeTableColumn(element.id, cIdx)} title="Remove Column">-</button>
                            <button className="table-btn" onClick={() => addTableColumn(element.id)} title="Add Column Right">+</button>
                        </div>
                    );
                })}
            </div>

            <table className="table-managed" style={{
                borderCollapse: 'collapse',
                border: `${element.borderWidth ?? 1}pt solid ${element.borderColor || '#e2e8f0'}`,
            }}>
                <tbody>
                    {element.body.map((row, rIdx) => (
                        <tr key={rIdx} className="tr-wrapper">
                            {/* Row Management Controls */}
                            <td style={{ width: '0', padding: '0', border: 'none', position: 'relative' }}>
                                <div className="row-controls" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                                    <button className="table-btn delete" onClick={() => removeTableRow(element.id, rIdx)} title="Remove Row">-</button>
                                    <button className="table-btn" onClick={() => addTableRow(element.id)} title="Add Row Below">+</button>
                                </div>
                            </td>

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
        </div>
    );
};

export default TableContainer;
