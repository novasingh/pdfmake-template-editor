/**
 * Australian Quote Template
 * Professional quote/proposal template for Australian businesses
 */

import { DocumentSchema } from '../../types/editor';
import { Template, TEMPLATE_VERSION } from '../templateManager';

/**
 * Generate element IDs
 */
const genId = (type: string) => `${type}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Create the Australian Quote Template Document
 */
const createQuoteDocument = (): DocumentSchema => {
    // Generate all IDs upfront
    const headingId = genId('heading');
    const columnsId = genId('columns');
    const businessInfoId = genId('business-info');
    const clientInfoId = genId('client-info');
    const quoteMetaId = genId('paragraph');
    const dividerId = genId('divider');
    const scopeHeadingId = genId('heading');
    const scopeId = genId('paragraph');
    const divider2Id = genId('divider');
    const pricingTableId = genId('table');
    const totalsTableId = genId('table');
    const divider3Id = genId('divider');
    const termsHeadingId = genId('heading');
    const termsId = genId('paragraph');
    const signatureColumnsId = genId('columns');
    const signatureId = genId('signature');
    const dateFieldId = genId('paragraph');

    // Create text elements for table cells
    const textElements: Record<string, any> = {};

    // Pricing table header row
    const h1 = genId('paragraph'); textElements[h1] = { id: h1, type: 'paragraph', content: 'Item', style: { fontSize: 10, fontWeight: 'bold', color: '#ffffff' } };
    const h2 = genId('paragraph'); textElements[h2] = { id: h2, type: 'paragraph', content: 'Description', style: { fontSize: 10, fontWeight: 'bold', color: '#ffffff' } };
    const h3 = genId('paragraph'); textElements[h3] = { id: h3, type: 'paragraph', content: 'Price', style: { fontSize: 10, fontWeight: 'bold', color: '#ffffff', alignment: 'right' } };

    // Pricing row 1
    const r1c1 = genId('paragraph'); textElements[r1c1] = { id: r1c1, type: 'paragraph', content: 'Phase 1', style: { fontSize: 10, fontWeight: 'bold' } };
    const r1c2 = genId('paragraph'); textElements[r1c2] = { id: r1c2, type: 'paragraph', content: 'Initial consultation and requirements gathering', style: { fontSize: 10 } };
    const r1c3 = genId('paragraph'); textElements[r1c3] = { id: r1c3, type: 'paragraph', content: '$500.00', style: { fontSize: 10, alignment: 'right' } };

    // Pricing row 2
    const r2c1 = genId('paragraph'); textElements[r2c1] = { id: r2c1, type: 'paragraph', content: 'Phase 2', style: { fontSize: 10, fontWeight: 'bold' } };
    const r2c2 = genId('paragraph'); textElements[r2c2] = { id: r2c2, type: 'paragraph', content: 'Development and implementation', style: { fontSize: 10 } };
    const r2c3 = genId('paragraph'); textElements[r2c3] = { id: r2c3, type: 'paragraph', content: '$2,500.00', style: { fontSize: 10, alignment: 'right' } };

    // Pricing row 3
    const r3c1 = genId('paragraph'); textElements[r3c1] = { id: r3c1, type: 'paragraph', content: 'Phase 3', style: { fontSize: 10, fontWeight: 'bold' } };
    const r3c2 = genId('paragraph'); textElements[r3c2] = { id: r3c2, type: 'paragraph', content: 'Testing, training, and handover', style: { fontSize: 10 } };
    const r3c3 = genId('paragraph'); textElements[r3c3] = { id: r3c3, type: 'paragraph', content: '$1,000.00', style: { fontSize: 10, alignment: 'right' } };

    // Totals table
    const t1l = genId('paragraph'); textElements[t1l] = { id: t1l, type: 'paragraph', content: 'Subtotal:', style: { fontSize: 10, alignment: 'right' } };
    const t1v = genId('paragraph'); textElements[t1v] = { id: t1v, type: 'paragraph', content: '$4,000.00', style: { fontSize: 10, alignment: 'right' } };
    const t2l = genId('paragraph'); textElements[t2l] = { id: t2l, type: 'paragraph', content: 'GST (10%):', style: { fontSize: 10, alignment: 'right' } };
    const t2v = genId('paragraph'); textElements[t2v] = { id: t2v, type: 'paragraph', content: '$400.00', style: { fontSize: 10, alignment: 'right' } };
    const t3l = genId('paragraph'); textElements[t3l] = { id: t3l, type: 'paragraph', content: 'Total AUD:', style: { fontSize: 11, fontWeight: 'bold', alignment: 'right' } };
    const t3v = genId('paragraph'); textElements[t3v] = { id: t3v, type: 'paragraph', content: '$4,400.00', style: { fontSize: 11, fontWeight: 'bold', alignment: 'right' } };

    return {
        page: {
            size: 'A4',
            width: 210,
            height: 297,
            margins: { top: 15, right: 15, bottom: 15, left: 15 },
            padding: 0,
            backgroundColor: '#ffffff',
        },
        elements: {
            // QUOTE Heading
            [headingId]: {
                id: headingId,
                type: 'heading',
                content: 'QUOTE',
                style: {
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: '#3b82f6',
                    alignment: 'right',
                    margin: [0, 0, 0, 20]
                }
            },

            // Two-column layout for business/client info
            [columnsId]: {
                id: columnsId,
                type: 'columns',
                columns: [
                    { width: '50%', content: [clientInfoId] },
                    { width: '50%', content: [businessInfoId, quoteMetaId] }
                ],
                columnGap: 20,
                style: { margin: [0, 0, 0, 15] }
            },

            // Business Info
            [businessInfoId]: {
                id: businessInfoId,
                type: 'business-info',
                headingValue: 'YOUR BUSINESS NAME',
                headingStyle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
                content: 'ABN: 12 345 678 901\n123 Business Street\nSydney NSW 2000\nPhone: (02) 1234 5678',
                style: { fontSize: 10, alignment: 'right', margin: [0, 0, 0, 10] }
            },

            // Quote metadata
            [quoteMetaId]: {
                id: quoteMetaId,
                type: 'paragraph',
                content: 'Quote #: Q-0001\nDate: 20/01/2026\nValid Until: 19/02/2026',
                style: { fontSize: 10, alignment: 'right', color: '#64748b' }
            },

            // Client Info
            [clientInfoId]: {
                id: clientInfoId,
                type: 'client-info',
                headingValue: 'PREPARED FOR',
                headingStyle: { fontSize: 10, fontWeight: 'bold', color: '#64748b' },
                content: 'Customer Name\nCustomer Company Pty Ltd\n456 Customer Street\nMelbourne VIC 3000',
                showLeftBorder: true,
                borderWidth: 3,
                borderColor: '#3b82f6',
                style: { fontSize: 11, margin: [0, 0, 0, 10] }
            },

            // Divider
            [dividerId]: {
                id: dividerId,
                type: 'divider',
                thickness: 1,
                color: '#e2e8f0',
                width: '100%',
                lineStyle: 'solid',
                style: { margin: [0, 10, 0, 10] }
            },

            // Scope Heading
            [scopeHeadingId]: {
                id: scopeHeadingId,
                type: 'heading',
                content: 'Scope of Work',
                style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', margin: [0, 0, 0, 8] }
            },

            // Scope Description
            [scopeId]: {
                id: scopeId,
                type: 'paragraph',
                content: 'This quote covers the following services:\n\n• Initial consultation to understand your requirements\n• Custom solution development and implementation\n• Comprehensive testing and quality assurance\n• User training and documentation\n• 30-day post-launch support',
                style: { fontSize: 10, color: '#475569', margin: [0, 0, 0, 15] }
            },

            // Divider 2
            [divider2Id]: {
                id: divider2Id,
                type: 'divider',
                thickness: 1,
                color: '#e2e8f0',
                width: '100%',
                lineStyle: 'solid',
                style: { margin: [0, 5, 0, 10] }
            },

            // Pricing Table
            [pricingTableId]: {
                id: pricingTableId,
                type: 'table',
                rows: 4,
                cols: 3,
                headerRow: true,
                headerColor: '#3b82f6',
                cellPadding: 8,
                borderWidth: 1,
                borderColor: '#e2e8f0',
                body: [
                    [{ content: [h1] }, { content: [h2] }, { content: [h3] }],
                    [{ content: [r1c1] }, { content: [r1c2] }, { content: [r1c3] }],
                    [{ content: [r2c1] }, { content: [r2c2] }, { content: [r2c3] }],
                    [{ content: [r3c1] }, { content: [r3c2] }, { content: [r3c3] }]
                ],
                style: { margin: [0, 0, 0, 10] }
            },

            // Totals Table
            [totalsTableId]: {
                id: totalsTableId,
                type: 'table',
                rows: 3,
                cols: 2,
                headerRow: false,
                cellPadding: 5,
                borderWidth: 0,
                borderColor: '#ffffff',
                body: [
                    [{ content: [t1l] }, { content: [t1v] }],
                    [{ content: [t2l] }, { content: [t2v] }],
                    [{ content: [t3l] }, { content: [t3v] }]
                ],
                style: { margin: [0, 0, 0, 15], alignment: 'right' }
            },

            // Divider 3
            [divider3Id]: {
                id: divider3Id,
                type: 'divider',
                thickness: 1,
                color: '#e2e8f0',
                width: '100%',
                lineStyle: 'solid',
                style: { margin: [0, 5, 0, 10] }
            },

            // Terms Heading
            [termsHeadingId]: {
                id: termsHeadingId,
                type: 'heading',
                content: 'Terms & Conditions',
                style: { fontSize: 12, fontWeight: 'bold', color: '#1e293b', margin: [0, 0, 0, 5] }
            },

            // Terms
            [termsId]: {
                id: termsId,
                type: 'paragraph',
                content: '1. This quote is valid for 30 days from the date of issue.\n2. A 50% deposit is required to commence work.\n3. Balance is due upon project completion.\n4. All prices are in Australian Dollars (AUD) and include GST.\n5. Any changes to scope may result in additional charges.',
                style: { fontSize: 9, color: '#64748b', margin: [0, 0, 0, 20] }
            },

            // Signature Columns
            [signatureColumnsId]: {
                id: signatureColumnsId,
                type: 'columns',
                columns: [
                    { width: '50%', content: [signatureId] },
                    { width: '50%', content: [dateFieldId] }
                ],
                columnGap: 40,
                style: { margin: [0, 20, 0, 0] }
            },

            // Signature
            [signatureId]: {
                id: signatureId,
                type: 'signature',
                style: { margin: [0, 0, 0, 0] }
            },

            // Date Field
            [dateFieldId]: {
                id: dateFieldId,
                type: 'paragraph',
                content: 'Date: _______________',
                style: { fontSize: 11, margin: [0, 25, 0, 0] }
            },

            // All text elements for table cells
            ...textElements,
        },
        rootElementIds: [
            headingId,
            columnsId,
            dividerId,
            scopeHeadingId,
            scopeId,
            divider2Id,
            pricingTableId,
            totalsTableId,
            divider3Id,
            termsHeadingId,
            termsId,
            signatureColumnsId,
        ],
    };
};

/**
 * Australian Quote Template
 */
export const quoteTemplateAU: Template = {
    metadata: {
        id: 'quote-au-standard',
        name: 'Australian Quote',
        description: 'Professional quote template with scope, pricing, terms, and acceptance signature.',
        version: TEMPLATE_VERSION,
        revision: 1,
        createdAt: '2026-01-20T00:00:00.000Z',
        updatedAt: '2026-01-20T00:00:00.000Z',
        category: 'quote',
        locale: 'en-AU',
    },
    document: createQuoteDocument(),
};
