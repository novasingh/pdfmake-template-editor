import { EditorElement } from '../types/editor';

/**
 * Generate a random short ID
 */
const genId = (type: string) => `${type}-${Math.random().toString(36).substr(2, 9)}`;

export interface ModuleDefinition {
    elements: Record<string, EditorElement>;
    rootIds: string[];
}

/**
 * Australian Business Header Module
 * Includes Business Name, ABN, and Contact Details in a right-aligned format
 */
export const AU_BUSINESS_HEADER = (): ModuleDefinition => {
    const abnId = genId('abn-field');
    const businessId = genId('business-info');

    return {
        elements: {
            [abnId]: {
                id: abnId,
                type: 'abn-field',
                abnValue: '12 345 678 901',
                label: 'ABN:',
                format: 'XX XXX XXX XXX',
                style: { alignment: 'right', fontSize: 10, margin: [0, 0, 0, 5] }
            },
            [businessId]: {
                id: businessId,
                type: 'business-info',
                headingValue: 'YOUR BUSINESS NAME',
                headingStyle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
                content: '123 Business Street\nSydney NSW 2000\nPhone: (02) 1234 5678\nEmail: accounts@business.com.au',
                style: { fontSize: 10, alignment: 'right', margin: [0, 0, 0, 20] }
            }
        },
        rootIds: [businessId, abnId]
    };
};

/**
 * Australian Bank Details Module
 */
export const AU_BANK_DETAILS = (): ModuleDefinition => {
    const headingId = genId('heading');
    const detailsId = genId('bank-details');

    return {
        elements: {
            [headingId]: {
                id: headingId,
                type: 'heading',
                content: 'Payment Details',
                style: { fontSize: 12, fontWeight: 'bold', color: '#1e293b', margin: [0, 10, 0, 5] }
            },
            [detailsId]: {
                id: detailsId,
                type: 'bank-details',
                bankName: 'Commonwealth Bank of Australia',
                accountName: 'Your Business Pty Ltd',
                bsb: '062-000',
                accountNumber: '12345678',
                style: { margin: [0, 0, 0, 15] }
            }
        },
        rootIds: [headingId, detailsId]
    };
};

/**
 * Australian Tax Table Module (Subtotal, GST, Total)
 */
export const AU_TAX_SUMMARY = (): ModuleDefinition => {
    const tableId = genId('table');
    const t1l = genId('paragraph');
    const t1v = genId('paragraph');
    const t2l = genId('paragraph');
    const t2v = genId('paragraph');
    const t3l = genId('paragraph');
    const t3v = genId('paragraph');

    return {
        elements: {
            [t1l]: { id: t1l, type: 'paragraph', content: 'Subtotal:', style: { fontSize: 10, alignment: 'right' } } as any,
            [t1v]: { id: t1v, type: 'paragraph', content: '$0.00', role: 'summary-subtotal', style: { fontSize: 10, alignment: 'right' } } as any,
            [t2l]: { id: t2l, type: 'paragraph', content: 'GST (10%):', style: { fontSize: 10, alignment: 'right' } } as any,
            [t2v]: { id: t2v, type: 'paragraph', content: '$0.00', role: 'summary-gst', style: { fontSize: 10, alignment: 'right' } } as any,
            [t3l]: { id: t3l, type: 'paragraph', content: 'Total AUD:', style: { fontSize: 11, fontWeight: 'bold', alignment: 'right' } } as any,
            [t3v]: { id: t3v, type: 'paragraph', content: '$0.00', role: 'summary-total', style: { fontSize: 11, fontWeight: 'bold', alignment: 'right' } } as any,
            [tableId]: {
                id: tableId,
                type: 'table',
                rows: 3,
                cols: 2,
                headerRow: false,
                cellPadding: 5,
                borderWidth: 0,
                borderColor: '#ffffff',
                widths: ['*', 100],
                body: [
                    [{ content: [t1l] }, { content: [t1v] }],
                    [{ content: [t2l] }, { content: [t2v] }],
                    [{ content: [t3l] }, { content: [t3v] }]
                ],
                style: { margin: [0, 10, 0, 10], alignment: 'right' }
            }
        },
        rootIds: [tableId]
    };
};

export const MODULE_REGISTRY = {
    'AU_BUSINESS_HEADER': AU_BUSINESS_HEADER,
    'AU_BANK_DETAILS': AU_BANK_DETAILS,
    'AU_TAX_SUMMARY': AU_TAX_SUMMARY
};
