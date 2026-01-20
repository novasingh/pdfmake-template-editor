/**
 * Australian Tax Invoice Template
 * Compliant with ATO requirements for Tax Invoices
 */

import { DocumentSchema } from '../../types/editor';
import { Template, TEMPLATE_VERSION } from '../templateManager';

/**
 * Generate element IDs
 */
const genId = (type: string) => `${type}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Create the Australian Invoice Template Document
 */
const createInvoiceDocument = (): DocumentSchema => {
    // Generate all IDs upfront
    const headingId = genId('heading');
    const columnsId = genId('columns');
    const businessInfoId = genId('business-info');
    const clientInfoId = genId('client-info');
    const invoiceMetaId = genId('paragraph');
    const dividerId = genId('divider');
    const lineItemsTableId = genId('table');
    const totalsTableId = genId('table');
    const divider2Id = genId('divider');
    const bankDetailsHeadingId = genId('heading');
    const bankDetailsId = genId('paragraph');
    const footerNoteId = genId('paragraph');

    // Create text elements for table cells
    const textElements: Record<string, any> = {};

    // Line items header row
    const h1 = genId('paragraph'); textElements[h1] = { id: h1, type: 'paragraph', content: 'Description', style: { fontSize: 10, fontWeight: 'bold', color: '#ffffff' } };
    const h2 = genId('paragraph'); textElements[h2] = { id: h2, type: 'paragraph', content: 'Qty', style: { fontSize: 10, fontWeight: 'bold', color: '#ffffff', alignment: 'center' } };
    const h3 = genId('paragraph'); textElements[h3] = { id: h3, type: 'paragraph', content: 'Unit Price', style: { fontSize: 10, fontWeight: 'bold', color: '#ffffff', alignment: 'right' } };
    const h4 = genId('paragraph'); textElements[h4] = { id: h4, type: 'paragraph', content: 'Amount', style: { fontSize: 10, fontWeight: 'bold', color: '#ffffff', alignment: 'right' } };

    // Line items row 1
    const r1c1 = genId('paragraph'); textElements[r1c1] = { id: r1c1, type: 'paragraph', content: 'Professional Services', style: { fontSize: 10 } };
    const r1c2 = genId('paragraph'); textElements[r1c2] = { id: r1c2, type: 'paragraph', content: '1', style: { fontSize: 10, alignment: 'center' } };
    const r1c3 = genId('paragraph'); textElements[r1c3] = { id: r1c3, type: 'paragraph', content: '$500.00', style: { fontSize: 10, alignment: 'right' } };
    const r1c4 = genId('paragraph'); textElements[r1c4] = { id: r1c4, type: 'paragraph', content: '$500.00', style: { fontSize: 10, alignment: 'right' } };

    // Line items row 2
    const r2c1 = genId('paragraph'); textElements[r2c1] = { id: r2c1, type: 'paragraph', content: 'Consultation Fee', style: { fontSize: 10 } };
    const r2c2 = genId('paragraph'); textElements[r2c2] = { id: r2c2, type: 'paragraph', content: '2', style: { fontSize: 10, alignment: 'center' } };
    const r2c3 = genId('paragraph'); textElements[r2c3] = { id: r2c3, type: 'paragraph', content: '$150.00', style: { fontSize: 10, alignment: 'right' } };
    const r2c4 = genId('paragraph'); textElements[r2c4] = { id: r2c4, type: 'paragraph', content: '$300.00', style: { fontSize: 10, alignment: 'right' } };

    // Totals table
    const t1l = genId('paragraph'); textElements[t1l] = { id: t1l, type: 'paragraph', content: 'Subtotal:', style: { fontSize: 10, alignment: 'right' } };
    const t1v = genId('paragraph'); textElements[t1v] = { id: t1v, type: 'paragraph', content: '$800.00', style: { fontSize: 10, alignment: 'right' } };
    const t2l = genId('paragraph'); textElements[t2l] = { id: t2l, type: 'paragraph', content: 'GST (10%):', style: { fontSize: 10, alignment: 'right' } };
    const t2v = genId('paragraph'); textElements[t2v] = { id: t2v, type: 'paragraph', content: '$80.00', style: { fontSize: 10, alignment: 'right' } };
    const t3l = genId('paragraph'); textElements[t3l] = { id: t3l, type: 'paragraph', content: 'Total AUD:', style: { fontSize: 11, fontWeight: 'bold', alignment: 'right' } };
    const t3v = genId('paragraph'); textElements[t3v] = { id: t3v, type: 'paragraph', content: '$880.00', style: { fontSize: 11, fontWeight: 'bold', alignment: 'right' } };

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
            // TAX INVOICE Heading
            [headingId]: {
                id: headingId,
                type: 'heading',
                content: 'TAX INVOICE',
                style: {
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: '#1e293b',
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
                    { width: '50%', content: [businessInfoId, invoiceMetaId] }
                ],
                columnGap: 20,
                style: { margin: [0, 0, 0, 20] }
            },

            // Business Info
            [businessInfoId]: {
                id: businessInfoId,
                type: 'business-info',
                headingValue: 'YOUR BUSINESS NAME',
                headingStyle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
                content: 'ABN: 12 345 678 901\n123 Business Street\nSydney NSW 2000\nPhone: (02) 1234 5678\nEmail: accounts@business.com.au',
                style: { fontSize: 10, alignment: 'right', margin: [0, 0, 0, 10] }
            },

            // Invoice metadata (number, date, due date)
            [invoiceMetaId]: {
                id: invoiceMetaId,
                type: 'paragraph',
                content: 'Invoice #: INV-0001\nDate: 20/01/2026\nDue Date: 19/02/2026',
                style: { fontSize: 10, alignment: 'right', color: '#64748b' }
            },

            // Client Info
            [clientInfoId]: {
                id: clientInfoId,
                type: 'client-info',
                headingValue: 'BILL TO',
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

            // Line Items Table
            [lineItemsTableId]: {
                id: lineItemsTableId,
                type: 'table',
                rows: 3,
                cols: 4,
                headerRow: true,
                headerColor: '#1e293b',
                cellPadding: 8,
                borderWidth: 1,
                borderColor: '#e2e8f0',
                body: [
                    [{ content: [h1] }, { content: [h2] }, { content: [h3] }, { content: [h4] }],
                    [{ content: [r1c1] }, { content: [r1c2] }, { content: [r1c3] }, { content: [r1c4] }],
                    [{ content: [r2c1] }, { content: [r2c2] }, { content: [r2c3] }, { content: [r2c4] }]
                ],
                style: { margin: [0, 0, 0, 15] }
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
                style: { margin: [0, 0, 0, 20], alignment: 'right' }
            },

            // Divider 2
            [divider2Id]: {
                id: divider2Id,
                type: 'divider',
                thickness: 1,
                color: '#e2e8f0',
                width: '100%',
                lineStyle: 'solid',
                style: { margin: [0, 10, 0, 10] }
            },

            // Bank Details Heading
            [bankDetailsHeadingId]: {
                id: bankDetailsHeadingId,
                type: 'heading',
                content: 'Payment Details',
                style: { fontSize: 12, fontWeight: 'bold', color: '#1e293b', margin: [0, 0, 0, 5] }
            },

            // Bank Details
            [bankDetailsId]: {
                id: bankDetailsId,
                type: 'paragraph',
                content: 'Bank: Commonwealth Bank of Australia\nAccount Name: Your Business Pty Ltd\nBSB: 062-000\nAccount Number: 12345678\n\nPlease include invoice number as payment reference.',
                style: { fontSize: 10, color: '#475569', margin: [0, 0, 0, 20] }
            },

            // Footer Note
            [footerNoteId]: {
                id: footerNoteId,
                type: 'paragraph',
                content: 'Thank you for your business!',
                style: { fontSize: 11, alignment: 'center', color: '#64748b', margin: [0, 20, 0, 0] }
            },

            // All text elements for table cells
            ...textElements,
        },
        rootElementIds: [
            headingId,
            columnsId,
            dividerId,
            lineItemsTableId,
            totalsTableId,
            divider2Id,
            bankDetailsHeadingId,
            bankDetailsId,
            footerNoteId,
        ],
    };
};

/**
 * Australian Invoice Template
 */
export const invoiceTemplateAU: Template = {
    metadata: {
        id: 'invoice-au-standard',
        name: 'Australian Tax Invoice',
        description: 'ATO-compliant Tax Invoice template with ABN, GST calculation, and bank details.',
        version: TEMPLATE_VERSION,
        revision: 1,
        createdAt: '2026-01-20T00:00:00.000Z',
        updatedAt: '2026-01-20T00:00:00.000Z',
        category: 'invoice',
        locale: 'en-AU',
    },
    document: createInvoiceDocument(),
};
