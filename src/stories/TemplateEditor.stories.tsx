import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TemplateEditor from '../editor/TemplateEditor';
import { invoiceTemplateAU, quoteTemplateAU, complianceTemplate } from '../templates';

const meta: Meta<typeof TemplateEditor> = {
    title: 'Editor/TemplateEditor',
    component: TemplateEditor,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof TemplateEditor>;

/**
 * The default, empty state of the editor.
 * Users can start building their template from scratch.
 */
export const Default: Story = {};

/**
 * A pre-populated Invoice template.
 * Demonstrates complex layouts with tables, business information, and totals.
 */
export const InvoiceTemplate: Story = {
    args: {
        initialData: invoiceTemplateAU.document,
    }
};

/**
 * A Quote/Proposal template.
 * Highlights the use of price tables and client data fields.
 */
export const QuoteTemplate: Story = {
    args: {
        initialData: quoteTemplateAU.document,
    }
};

/**
 * A Compliance/Certificate template.
 * Shows branding, signatures, and formal document structures.
 */
export const ComplianceTemplate: Story = {
    args: {
        initialData: complianceTemplate.document,
    }
};

/**
 * demonstrating deep UI customization.
 * Custom brand colors, sharp corners, and a specific layout font.
 */
export const ThemedEditor: Story = {
    args: {
        initialData: invoiceTemplateAU.document,
        config: {
            theme: {
                primaryColor: '#0f172a', // Slate 900
                accentColor: '#3b82f6',  // Blue 500
                borderRadius: '2px',
                fontFamily: 'Inter, sans-serif'
            }
        }
    }
};

/**
 * Demonstrates string overrides for internationalization or custom terminology.
 * In this example, we translate key UI elements to Japanese.
 */
export const JapaneseLocalization: Story = {
    args: {
        initialData: invoiceTemplateAU.document,
        locale: 'ja',
        config: {
            labels: {
                'Blocks': 'ブロック',
                'Page Properties': 'ページ設定',
                'Standard Blocks': '基本ブロック',
                'Business Blocks': 'ビジネスモジュール',
                'Save': '保存',
                'Heading': '見出し',
                'Paragraph': '段落',
                'Table': '表',
                'Columns': 'カラム',
                'Image': '画像'
            }
        }
    }
};

/**
 * Integration example showing how to handle save and export events.
 * Check the Actions panel or console for output.
 */
export const EventHandling: Story = {
    args: {
        onSave: (doc) => {
            console.log('Document saved to backend:', doc);
            alert('Template saved! Check console for schema.');
        },
        onExport: (doc) => {
            console.log('Exporting PDF for schema:', doc);
            alert('Exporting PDF... (Check console)');
        },
        onChange: (doc) => {
            // This triggers on every change, useful for auto-save indicators
            console.log('Document state updated');
        }
    }
};

/**
 * Demonstrates the use of hideHeaderButtons to create a cleaner, more focused UI.
 * In this example, we hide almost everything except for Save and PDF Export.
 */
export const MinimalistHeader: Story = {
    args: {
        initialData: invoiceTemplateAU.document,
        config: {
            hideHeaderButtons: {
                template: true,
                undo: true,
                redo: true,
                help: true,
                fullscreen: true,
                json: true
            }
        }
    }
};
