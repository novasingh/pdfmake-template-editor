import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { ColumnsElement, Column } from '../types/editor';
import { useEditorStore } from '../store/useEditorStore';
import CanvasBlock from './CanvasBlock';

interface DroppableColumnProps {
    column: Column;
    columnIndex: number;
    parentElement: ColumnsElement;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ column, columnIndex, parentElement }) => {
    const { document: doc } = useEditorStore();
    const dropId = `${parentElement.id}-col-${columnIndex}`;
    
    const { setNodeRef, isOver } = useDroppable({
        id: dropId,
        data: {
            parentId: parentElement.id,
            colIndex: columnIndex,
            isColumnContainer: true,
        }
    });

    const columnBorderStyle = parentElement.showColumnBorders
        ? `${parentElement.columnBorderWidth ?? 1}px solid ${parentElement.columnBorderColor ?? '#e2e8f0'}`
        : isOver 
            ? '1px dashed #3b82f6' 
            : '1px dashed #e2e8f0';

    return (
        <div
            ref={setNodeRef}
            style={{
                flex: `0 0 calc(${column.width} - ${((parentElement.columnGap ?? 10) * (parentElement.columns.length - 1)) / parentElement.columns.length}px)`,
                width: column.width,
                border: columnBorderStyle,
                padding: '4px',
                minHeight: '40px',
                backgroundColor: isOver ? '#eff6ff' : 'transparent',
                textAlign: parentElement.style.alignment ?? 'left',
                boxSizing: 'border-box',
            }}
        >
            <SortableContext
                items={column.content.filter(id => doc.elements[id])}
                strategy={verticalListSortingStrategy}
            >
                {column.content
                    .filter((childId) => doc.elements[childId])
                    .map((childId) => (
                        <CanvasBlock key={childId} element={doc.elements[childId]} />
                    ))}
            </SortableContext>

            {column.content.filter(id => doc.elements[id]).length === 0 && !isOver && (
                <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', paddingTop: '10px' }}>
                    Drop here
                </div>
            )}
        </div>
    );
};

interface ColumnContainerProps {
    element: ColumnsElement;
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({ element }) => {
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        gap: `${element.columnGap ?? 10}px`,
        width: '100%',
        minHeight: '50px',
        padding: element.style.padding 
            ? `${element.style.padding[1]}px ${element.style.padding[2]}px ${element.style.padding[3]}px ${element.style.padding[0]}px`
            : '0',
        margin: element.style.margin
            ? `${element.style.margin[1]}px ${element.style.margin[2]}px ${element.style.margin[3]}px ${element.style.margin[0]}px`
            : '0',
        border: element.borderWidth && element.borderStyle !== 'none'
            ? `${element.borderWidth}px ${element.borderStyle ?? 'solid'} ${element.borderColor ?? '#e2e8f0'}`
            : 'none',
        borderRadius: `${element.borderRadius ?? 0}px`,
        backgroundColor: element.backgroundColor ?? 'transparent',
        alignItems: element.verticalAlign === 'middle' 
            ? 'center' 
            : element.verticalAlign === 'bottom' 
                ? 'flex-end' 
                : 'flex-start',
        boxSizing: 'border-box',
    };

    return (
        <div style={containerStyle}>
            {element.columns.map((col, idx) => (
                <DroppableColumn
                    key={`${element.id}-col-${idx}`}
                    column={col}
                    columnIndex={idx}
                    parentElement={element}
                />
            ))}
        </div>
    );
};

export default ColumnContainer;
