import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { ColumnsElement } from '../types/editor';
import { useEditorStore } from '../store/useEditorStore';
import CanvasBlock from './CanvasBlock';

interface ColumnContainerProps {
    element: ColumnsElement;
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({ element }) => {
    const { document: doc } = useEditorStore();

    return (
        <div style={{ display: 'flex', gap: '10px', width: '100%', minHeight: '50px' }}>
            {element.columns.map((col, idx) => {
                const dropId = `${element.id}-col-${idx}`;
                const { setNodeRef, isOver } = useDroppable({
                    id: dropId,
                    data: {
                        parentId: element.id,
                        colIndex: idx,
                        isColumnContainer: true,
                    }
                });

                return (
                    <div
                        key={dropId}
                        ref={setNodeRef}
                        style={{
                            flex: `0 0 ${col.width}`,
                            width: col.width,
                            border: isOver ? '1px dashed #3b82f6' : '1px dashed #e2e8f0',
                            padding: '4px',
                            minHeight: '40px',
                            backgroundColor: isOver ? '#eff6ff' : 'transparent',
                        }}
                    >
                        <SortableContext
                            items={col.content}
                            strategy={verticalListSortingStrategy}
                        >
                            {col.content.map((childId) => (
                                <CanvasBlock key={childId} element={doc.elements[childId]} />
                            ))}
                        </SortableContext>

                        {col.content.length === 0 && !isOver && (
                            <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', paddingTop: '10px' }}>
                                Drop here
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ColumnContainer;
