import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import TemplateEditor from '../editor/TemplateEditor';
import { useEditorStore } from '../store/useEditorStore';

const MetaData: Meta<typeof TemplateEditor> = {
    title: 'Australian Compliance/Demos',
    component: TemplateEditor,
};

export default MetaData;

type Story = StoryObj<typeof TemplateEditor>;

/**
 * Demo: Dynamic Data Injection
 * Shows how setVariables can be used to populate fields from external data.
 */
export const DataInjectionDemo: Story = {
    render: () => {
        const { setVariables, loadTemplate } = useEditorStore();

        const handleInject = () => {
            setVariables({
                customerName: 'Global Solutions Pty Ltd',
                invoiceNumber: 'TAX-2026-99',
                abn: '98 765 432 109'
            });
        };

        return (
            <div style={{ height: '90vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => loadTemplate('default')}
                        style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Load Default Template
                    </button>
                    <button
                        onClick={handleInject}
                        style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Inject Dynamic Data
                    </button>
                    <span style={{ alignSelf: 'center', fontSize: '13px', color: '#64748b' }}>
                        Click "Inject Dynamic Data" to populate variable fields.
                    </span>
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                    <TemplateEditor />
                </div>
            </div>
        );
    }
};

/**
 * Demo: Programmatic Module Insertion
 * Shows how insertModule can be used to build a document structure.
 */
export const ModuleInsertionDemo: Story = {
    render: () => {
        const { insertModule, resetDocument } = useEditorStore();

        return (
            <div style={{ height: '90vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => resetDocument()}
                        style={{ padding: '8px 16px', background: '#64748b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Reset Canvas
                    </button>
                    <button
                        onClick={() => insertModule('AU_BUSINESS_HEADER')}
                        style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        + Add AU Header
                    </button>
                    <button
                        onClick={() => insertModule('AU_BANK_DETAILS')}
                        style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        + Add Bank Details
                    </button>
                    <button
                        onClick={() => insertModule('AU_TAX_SUMMARY')}
                        style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        + Add Tax Summary
                    </button>
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                    <TemplateEditor />
                </div>
            </div>
        );
    }
};
