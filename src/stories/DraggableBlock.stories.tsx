import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DraggableBlock from '../sidebar/DraggableBlock';
import { DndContext } from '@dnd-kit/core';

// Wrapper to provide DnD context
const DraggableBlockContainer = (props: any) => (
    <DndContext>
        <div style={{ padding: '20px', width: '300px' }}>
            <DraggableBlock {...props} />
        </div>
    </DndContext>
);

const meta: Meta<typeof DraggableBlock> = {
    title: 'Components/DraggableBlock',
    component: DraggableBlock,
    decorators: [
        (Story: React.ComponentType, context: any) => (
            <DraggableBlockContainer {...context.args} />
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof DraggableBlock>;

export const Heading: Story = {
    args: {
        type: 'heading',
        label: 'Heading',
    },
};

export const Paragraph: Story = {
    args: {
        type: 'paragraph',
        label: 'Text Paragraph',
    },
};

export const Image: Story = {
    args: {
        type: 'image',
        label: 'Image',
    },
};

export const Table: Story = {
    args: {
        type: 'table',
        label: 'Table',
    },
};
