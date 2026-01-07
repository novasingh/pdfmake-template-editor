import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Sidebar from '../sidebar/Sidebar';
import { DndContext } from '@dnd-kit/core';

// Wrap Sidebar in DndContext because it uses draggable logic
const SidebarWrapper = () => (
    <DndContext>
        <div style={{ width: '300px', height: '100vh', borderRight: '1px solid #e2e8f0' }}>
            <Sidebar />
        </div>
    </DndContext>
);

const meta: Meta<typeof Sidebar> = {
    title: 'Editor/Sidebar',
    component: SidebarWrapper, // Use wrapper as the component
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};
