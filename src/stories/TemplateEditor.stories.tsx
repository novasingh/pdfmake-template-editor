import React, { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TemplateEditor from '../editor/TemplateEditor';
import { useEditorStore } from '../store/useEditorStore';
import ExportPreview from './ExportPreview';

const meta: Meta<typeof TemplateEditor> = {
    title: 'Editor/TemplateEditor',
    component: TemplateEditor,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof TemplateEditor>;

export const Default: Story = {
    render: () => {
        return <TemplateEditor />;
    }
};

export const InvoiceTemplate: Story = {
    render: () => {
        const { setPageSettings } = useEditorStore();

        useEffect(() => {
            setPageSettings({ padding: 10 });
        }, []);

        return <TemplateEditor />;
    },
};
