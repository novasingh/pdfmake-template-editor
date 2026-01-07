import React, { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import PropertiesPanel from '../properties/PropertiesPanel';
import { useEditorStore } from '../store/useEditorStore';

const meta: Meta<typeof PropertiesPanel> = {
    title: 'Editor/PropertiesPanel',
    component: PropertiesPanel,
    decorators: [
        (Story: React.ComponentType) => (
            <div style={{ width: '300px', height: '500px', border: '1px solid #e2e8f0', background: 'white' }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof PropertiesPanel>;

// Helper to set store state for stories
const StoreSetter = ({ element }: { element: any }) => {
    const { addElement, document: doc, selectElement, updateElement } = useEditorStore();

    useEffect(() => {
        // Reset and setup
        // This is a naive way to mock state, ideally we'd use a mock store provider
        // specific to Storybook, but this works for simple visualization.
        if (element) {
            // We can't easily clear the real store without affecting other stories if they run in parallel context, 
            // but Storybook renders usually isolate fairly well.
            // For now, let's just ensure we have an element to select.

            // Check if element exists or add new one
            const id = 'test-id';
            if (!doc.elements[id]) {
                // Manually inject for testing if addElement is complex
                // Or better, just use the component's internal handling if possible.
                // Let's rely on adding a dummy element.
                useEditorStore.setState(state => ({
                    document: {
                        ...state.document,
                        elements: {
                            [id]: { ...element, id }
                        }
                    },
                    selectedElementId: id
                }));
            } else {
                updateElement(id, element);
                selectElement(id);
            }
        } else {
            useEditorStore.setState({ selectedElementId: null });
        }
    }, [element]);

    return null;
};

export const EmptyState: Story = {
    render: () => {
        return (
            <>
                <StoreSetter element={null} />
                <PropertiesPanel />
            </>
        );
    },
};

export const ParagraphSelected: Story = {
    render: () => {
        const element = {
            type: 'paragraph',
            content: 'Sample text content',
            style: {
                fontSize: 12,
                alignment: 'left',
                color: '#000000'
            }
        };
        return (
            <>
                <StoreSetter element={element} />
                <PropertiesPanel />
            </>
        );
    },
};

export const ImageSelected: Story = {
    render: () => {
        const element = {
            type: 'image',
            src: '',
            width: '100%',
            height: '200',
            style: { alignment: 'center' }
        };
        return (
            <>
                <StoreSetter element={element} />
                <PropertiesPanel />
            </>
        );
    },
};

export const DividerSelected: Story = {
    render: () => {
        const element = {
            type: 'divider',
            thickness: 2,
            width: '100%',
            lineStyle: 'solid',
            color: '#e2e8f0',
            style: {}
        };
        return (
            <>
                <StoreSetter element={element} />
                <PropertiesPanel />
            </>
        );
    },
};
