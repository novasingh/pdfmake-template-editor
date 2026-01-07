import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EditorHeader from '../editor/EditorHeader';

const meta: Meta<typeof EditorHeader> = {
    title: 'Editor/EditorHeader',
    component: EditorHeader,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof EditorHeader>;

export const Default: Story = {
    args: {
        onToggleSidebar: () => console.log('Toggle Sidebar'),
        onToggleProperties: () => console.log('Toggle Properties'),
    },
};
