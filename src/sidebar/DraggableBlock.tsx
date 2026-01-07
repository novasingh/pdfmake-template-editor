import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ElementType } from '../types/editor';

interface DraggableBlockProps {
    type: ElementType;
    label: string;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({ type, label }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidebar-${type}`,
        data: {
            type,
            isSidebarItem: true,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`draggable-block-preview ${isDragging ? 'dragging' : ''}`}
            {...listeners}
            {...attributes}
        >
            {label}
        </div>
    );
};

export default DraggableBlock;
