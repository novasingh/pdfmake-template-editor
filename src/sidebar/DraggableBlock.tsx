import React from 'react';
import { useDraggable } from '../dnd/useDnd';
import { ElementType } from '../types/editor';

interface DraggableBlockProps {
    type: ElementType;
    label: string;
    moduleName?: string;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({ type, label, moduleName }) => {
    const { ref, attributes, listeners, isDragging } = useDraggable({
        id: moduleName ? `sidebar-module-${moduleName}` : `sidebar-${type}`,
        data: {
            type,
            moduleName,
            isSidebarItem: true,
            isModule: !!moduleName,
        },
    });

    return (
        <div
            ref={ref}
            className={`draggable-block-preview ${isDragging ? 'dragging' : ''}`}
            {...listeners}
            {...attributes}
        >
            {label}
        </div>
    );
};

export default DraggableBlock;
