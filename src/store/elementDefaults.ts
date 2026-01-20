import { ElementType, EditorElement, BaseStyle } from '../types/editor';

const genId = (type: string) => `${type}-${Math.random().toString(36).substr(2, 9)}`;

export const getElementDefaults = (type: ElementType): Partial<EditorElement> => {
    const id = genId(type);
    const baseStyle: BaseStyle = { fontSize: 12, margin: [0, 0, 0, 10] };

    switch (type) {
        case 'heading':
            return {
                id,
                type: 'heading',
                content: 'New Heading',
                style: { ...baseStyle, fontSize: 24, fontWeight: 'bold' }
            } as any;
        case 'paragraph':
            return {
                id,
                type: 'paragraph',
                content: 'New paragraph text...',
                style: baseStyle
            } as any;
        case 'divider':
            return {
                id,
                type: 'divider',
                color: '#e2e8f0',
                thickness: 1,
                width: '100%',
                lineStyle: 'solid',
                style: baseStyle
            } as any;
        case 'image':
            return {
                id,
                type: 'image',
                src: 'https://placehold.co/200x100',
                width: 200,
                borderWidth: 0,
                borderColor: '#000000',
                borderStyle: 'solid',
                borderRadius: 0,
                style: baseStyle
            } as any;
        case 'columns':
            return {
                id,
                type: 'columns',
                columns: [
                    { width: '50%', content: [] },
                    { width: '50%', content: [] }
                ],
                columnGap: 10,
                borderWidth: 0,
                borderColor: '#e2e8f0',
                borderStyle: 'none',
                borderRadius: 0,
                backgroundColor: 'transparent',
                verticalAlign: 'top',
                showColumnBorders: false,
                columnBorderWidth: 1,
                columnBorderColor: '#e2e8f0',
                style: baseStyle
            } as any;
        case 'table':
            return {
                id,
                type: 'table',
                rows: 2,
                cols: 2,
                headerRow: true,
                body: [[{ content: [] }, { content: [] }], [{ content: [] }, { content: [] }]],
                style: baseStyle
            } as any;
        case 'client-info':
            return {
                id,
                type: 'client-info',
                headingValue: 'BILL TO',
                headingStyle: { fontSize: 10, fontWeight: 'bold', color: '#64748b' },
                showLeftBorder: true,
                borderWidth: 3,
                borderColor: '#3b82f6',
                borderPadding: 10,
                style: { ...baseStyle, fontSize: 11 }
            } as any;
        case 'business-info':
            return {
                id,
                type: 'business-info',
                headingValue: 'YOUR BUSINESS',
                headingStyle: { fontSize: 10, fontWeight: 'bold', color: '#64748b' },
                style: { ...baseStyle, alignment: 'right', fontSize: 11 }
            } as any;
        case 'signature':
            return { id, type: 'signature', style: { ...baseStyle, margin: [0, 20, 0, 0] } } as any;
        case 'date-field':
            return {
                id,
                type: 'date-field',
                label: 'Date',
                dateValue: new Date().toISOString().split('T')[0],
                dateFormat: 'DD/MM/YYYY',
                showLabel: true,
                style: baseStyle
            } as any;
        case 'auto-number':
            return {
                id,
                type: 'auto-number',
                label: 'Invoice No.',
                prefix: 'INV-',
                suffix: '',
                startValue: 1,
                paddingDigits: 4,
                style: baseStyle
            } as any;
        case 'variable':
            return {
                id,
                type: 'variable',
                variableName: 'customerName',
                placeholder: '[Select Name]',
                label: 'Customer Name:',
                style: baseStyle
            } as any;
        case 'qrcode':
            return {
                id,
                type: 'qrcode',
                data: 'https://example.com',
                size: 100,
                errorLevel: 'M',
                style: baseStyle
            } as any;
        case 'barcode':
            return {
                id,
                type: 'barcode',
                data: '12345678',
                barcodeType: 'Code128',
                width: 100,
                height: 40,
                displayValue: true,
                style: baseStyle
            } as any;
        case 'list':
            return {
                id,
                type: 'list',
                listType: 'unordered',
                items: ['Item 1', 'Item 2', 'Item 3'],
                bulletStyle: 'disc',
                style: baseStyle
            } as any;
        case 'abn-field':
            return {
                id,
                type: 'abn-field',
                abnValue: '',
                label: 'ABN:',
                format: 'XX XXX XXX XXX',
                style: baseStyle
            } as any;
        case 'bank-details':
            return {
                id,
                type: 'bank-details',
                bankName: '',
                accountName: '',
                bsb: '',
                accountNumber: '',
                style: baseStyle
            } as any;
        default:
            return { id, type: 'paragraph', content: '', style: baseStyle } as any;
    }
};
