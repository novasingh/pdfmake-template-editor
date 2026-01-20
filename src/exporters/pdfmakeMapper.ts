import { DocumentSchema, EditorElement, BaseStyle } from '../types/editor';

/**
 * Constants for conversion
 */
const MM_TO_PT = 2.83465;

/**
 * Maps our internal EditorElement style to pdfmake style properties
 */
const mapStyle = (style: BaseStyle) => {
    return {
        fontSize: style.fontSize,
        bold: style.fontWeight === 'bold' || style.fontWeight === '600' || style.fontWeight === '700',
        color: style.color,
        background: style.background,
        alignment: style.alignment,
        margin: style.margin,
    };
};

/**
 * Recursively maps our internal schema to pdfmake document definition
 */
export const exportToPdfMake = (doc: DocumentSchema, variables: Record<string, string> = {}): any => {
    // Helper to calculate available width (A4 is ~595pt wide)
    const getPageWidth = () => {
        const sizes: Record<string, [number, number]> = {
            'A4': [595.28, 841.89]
        };
        const [w] = sizes[doc.page.size as string] || [595.28, 841.89];
        return w - (doc.page.margins.left + doc.page.margins.right) * MM_TO_PT;
    };

    const pageWidth = getPageWidth();

    const mapElement = (elementId: string): any => {
        const element = doc.elements[elementId];
        if (!element) return null;

        switch (element.type) {
            case 'heading':
            case 'paragraph':
                return {
                    text: (element as any).content,
                    ...mapStyle(element.style),
                    fontSize: element.type === 'heading' ? (element.style.fontSize || 24) : (element.style.fontSize || 12),
                };

            case 'divider': {
                const div = element as any;
                let lineWidth = pageWidth;

                if (typeof div.width === 'string' && div.width.endsWith('%')) {
                    lineWidth = (pageWidth * parseFloat(div.width)) / 100;
                } else if (typeof div.width === 'number') {
                    lineWidth = div.width;
                }

                let x1 = 0;
                const align = element.style.alignment;
                if (align === 'center') x1 = (pageWidth - lineWidth) / 2;
                else if (align === 'right') x1 = pageWidth - lineWidth;

                return {
                    canvas: [
                        {
                            type: 'line',
                            x1, y1: 5,
                            x2: x1 + lineWidth, y2: 5,
                            lineWidth: div.thickness || 1,
                            lineColor: div.color || '#e2e8f0',
                            dash: div.lineStyle === 'dashed' ? { length: 5 } : div.lineStyle === 'dotted' ? { length: 1, space: 2 } : undefined
                        }
                    ],
                    margin: element.style.margin || [0, 5, 0, 5],
                };
            }

            case 'image': {
                const img = element as any;
                return {
                    image: img.src,
                    width: typeof img.width === 'string' && img.width.endsWith('%') ? pageWidth * (parseFloat(img.width) / 100) : (img.width || 150),
                    height: img.height === 'auto' ? undefined : img.height,
                    ...mapStyle(element.style),
                };
            }

            case 'columns': {
                const cols = element as any;
                const columnGap = cols.columnGap ?? 10;

                const columnsContent = {
                    columns: cols.columns.map((col: any) => ({
                        width: col.width,
                        stack: col.content.map(mapElement).filter(Boolean)
                    })),
                    columnGap: columnGap,
                    ...mapStyle(element.style),
                };

                // If the columns element has border or background, wrap it in a table for visual effect
                if ((cols.borderWidth && cols.borderStyle !== 'none') ||
                    (cols.backgroundColor && cols.backgroundColor !== 'transparent')) {
                    return {
                        table: {
                            widths: ['*'],
                            body: [[columnsContent]]
                        },
                        layout: {
                            hLineWidth: () => cols.borderWidth ?? 0,
                            vLineWidth: () => cols.borderWidth ?? 0,
                            hLineColor: () => cols.borderColor || '#e2e8f0',
                            vLineColor: () => cols.borderColor || '#e2e8f0',
                            paddingLeft: () => cols.style.padding?.[0] ?? 0,
                            paddingRight: () => cols.style.padding?.[2] ?? 0,
                            paddingTop: () => cols.style.padding?.[1] ?? 0,
                            paddingBottom: () => cols.style.padding?.[3] ?? 0,
                            fillColor: () => cols.backgroundColor !== 'transparent' ? cols.backgroundColor : undefined,
                        },
                        margin: cols.style.margin || undefined,
                    };
                }

                return columnsContent;
            }

            case 'table': {
                const table = element as any;
                const colsCount = table.body[0]?.length || 0;
                return {
                    table: {
                        headerRows: table.headerRow ? 1 : 0,
                        widths: table.widths || Array(colsCount).fill('*'),
                        heights: table.heights,
                        body: table.body.map((row: any[], rIdx: number) =>
                            row.map((cell: any) => {
                                const isHeader = table.headerRow && rIdx === 0;
                                const fillColor = cell.backgroundColor || (isHeader ? (table.headerColor || '#f8fafc') : (table.alternateRowColor && rIdx % 2 !== 0 ? table.alternateRowColor : undefined));

                                return {
                                    stack: (cell.content || []).map(mapElement).filter(Boolean),
                                    fillColor,
                                    rowSpan: cell.rowSpan,
                                    colSpan: cell.colSpan,
                                };
                            })
                        )
                    },
                    layout: {
                        hLineWidth: () => table.borderWidth ?? 1,
                        vLineWidth: () => table.borderWidth ?? 1,
                        hLineColor: () => table.borderColor || '#e2e8f0',
                        vLineColor: () => table.borderColor || '#e2e8f0',
                        paddingLeft: () => table.cellPadding ?? 5,
                        paddingRight: () => table.cellPadding ?? 5,
                        paddingTop: () => table.cellPadding ?? 5,
                        paddingBottom: () => table.cellPadding ?? 5,
                    },
                    ...mapStyle(element.style),
                };
            }

            case 'client-info': {
                const info = element as any;
                const stack: any[] = [
                    {
                        text: info.headingValue || 'BILL TO',
                        fontSize: info.headingStyle?.fontSize || 10,
                        color: info.headingStyle?.color || '#64748b',
                        bold: info.headingStyle?.fontWeight === 'bold',
                        margin: [0, 0, 0, 2]
                    },
                    { text: info.content || 'Client Name', bold: true },
                ];
                if (!info.content) stack.push({ text: 'Address Line 1' });

                if (info.showLeftBorder) {
                    return {
                        table: {
                            widths: ['*'],
                            body: [[{ stack, border: [true, false, false, false], padding: [10, 2, 0, 2] }]]
                        },
                        layout: {
                            hLineWidth: () => 0,
                            vLineWidth: (i: number) => (i === 0 ? (info.borderWidth || 3) : 0),
                            hLineColor: () => 'white',
                            vLineColor: () => info.borderColor || '#3b82f6',
                            paddingLeft: () => 0,
                            paddingRight: () => 0,
                            paddingTop: () => 0,
                            paddingBottom: () => 0,
                        },
                        ...mapStyle(element.style),
                    };
                }

                return {
                    stack,
                    ...mapStyle(element.style),
                };
            }

            case 'business-info': {
                const info = element as any;
                const stack: any[] = [
                    {
                        text: info.headingValue || 'Your Business Name',
                        fontSize: info.headingStyle?.fontSize || 10,
                        color: info.headingStyle?.color || '#64748b',
                        bold: info.headingStyle?.fontWeight === 'bold',
                        margin: [0, 0, 0, 2]
                    },
                    { text: info.content || 'Address Line 1' },
                ];
                if (!info.content) stack.push({ text: 'contact@business.com', fontSize: (element.style.fontSize || 11) * 0.9 });

                return {
                    stack,
                    ...mapStyle(element.style),
                };
            }

            case 'signature':
                return {
                    stack: [
                        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 1 }] },
                        { text: 'Authorized Signature', fontSize: 10, margin: [0, 5, 0, 0] }
                    ],
                    ...mapStyle(element.style),
                    margin: [0, 20, 0, 0],
                };

            case 'date-field': {
                const df = element as any;
                const dateText = df.showLabel !== false ? `${df.label || 'Date'}: ${df.dateValue || ''}` : (df.dateValue || '');
                return {
                    text: dateText,
                    ...mapStyle(element.style),
                };
            }

            case 'auto-number': {
                const an = element as any;
                const value = (an.startValue || 1).toString().padStart(an.paddingDigits || 0, '0');
                const numberText = `${an.prefix || ''}${value}${an.suffix || ''}`;
                return {
                    stack: [
                        an.label ? { text: an.label, fontSize: (element.style.fontSize || 11) * 0.8, color: '#64748b' } : null,
                        { text: numberText, ...mapStyle(element.style) }
                    ].filter(Boolean)
                };
            }

            case 'variable': {
                const v = element as any;
                const value = variables[v.variableName] || v.placeholder || `{${v.variableName}}`;
                const varText = v.label ? `${v.label} ${value}` : value;
                return {
                    text: varText,
                    ...mapStyle(element.style),
                };
            }

            case 'qrcode': {
                const qr = element as any;
                return {
                    qr: qr.data || ' ',
                    fit: qr.size || 100,
                    eccLevel: qr.errorLevel || 'M',
                    ...mapStyle(element.style),
                };
            }

            case 'barcode': {
                const bc = element as any;
                return {
                    barcode: bc.data || ' ',
                    width: bc.width || 100,
                    height: bc.height || 40,
                    type: bc.barcodeType || 'Code128',
                    displayValue: bc.displayValue ?? true,
                    ...mapStyle(element.style),
                };
            }

            case 'list': {
                const le = element as any;
                const listProp = le.listType === 'ordered' ? 'ol' : 'ul';
                const marker = le.bulletStyle === 'number' ? 'decimal' :
                    le.bulletStyle === 'letter' ? 'lower-alpha' :
                        le.bulletStyle;

                return {
                    [listProp]: le.items,
                    type: marker,
                    ...mapStyle(element.style),
                };
            }

            case 'abn-field': {
                const abn = element as any;
                return {
                    text: [
                        { text: abn.label ? `${abn.label} ` : '', ...mapStyle(element.style) },
                        { text: abn.abnValue || '00 000 000 000', ...mapStyle(element.style), bold: true, fontSize: (element.style.fontSize || 12) }
                    ],
                    ...mapStyle(element.style)
                };
            }

            case 'bank-details': {
                const bd = element as any;
                return {
                    stack: [
                        { text: bd.bankName || 'Bank Name', bold: true },
                        { text: `Account: ${bd.accountName || ''}` },
                        { text: `BSB: ${bd.bsb || ''} | Acc: ${bd.accountNumber || ''}` }
                    ],
                    fillColor: '#f8fafc',
                    ...mapStyle(element.style)
                };
            }

            default:
                return null;
        }
    };

    const content = doc.rootElementIds.map(mapElement).filter(Boolean);

    const definition: any = {
        pageSize: doc.page.size,
        pageMargins: [
            doc.page.margins.left * MM_TO_PT,
            doc.page.margins.top * MM_TO_PT,
            doc.page.margins.right * MM_TO_PT,
            doc.page.margins.bottom * MM_TO_PT
        ],
        content,
        background: (currentPage: number, pageSize: any) => {
            const bg: any[] = [];

            // 1. Page Background Color
            if (doc.page.backgroundColor && doc.page.backgroundColor !== '#ffffff') {
                bg.push({
                    canvas: [
                        {
                            type: 'rect',
                            x: 0, y: 0,
                            w: pageSize.width,
                            h: pageSize.height,
                            color: doc.page.backgroundColor
                        }
                    ]
                });
            }

            // 2. Watermark Implementation
            if (doc.page.watermark) {
                const wm = doc.page.watermark;
                const opacity = wm.opacity ?? 0.1;

                if (wm.type === 'text') {
                    bg.push({
                        text: wm.textValue,
                        fontSize: (wm.fontSize || 60) * 1.5,
                        color: wm.color || 'black',
                        opacity: opacity,
                        bold: wm.fontWeight === 'bold',
                        alignment: 'center',
                        margin: [0, (pageSize.height / 2) - ((wm.fontSize || 60) / 2), 0, 0],
                        // Rotation isn't directly supported in text inside background but we can use canvas if needed.
                        // However, pdfmake's top-level watermark is better for simple rotation.
                    });
                } else if (wm.type === 'image' && wm.imageUrl) {
                    bg.push({
                        image: wm.imageUrl,
                        width: wm.width || 200,
                        height: wm.height || 200,
                        opacity: opacity,
                        absolutePosition: {
                            x: (pageSize.width - (wm.width || 200)) / 2,
                            y: (pageSize.height - (wm.height || 200)) / 2
                        }
                    });
                }
            }

            return bg;
        },
        // Native watermark for centered, rotated text
        watermark: doc.page.watermark?.type === 'text' ? {
            text: doc.page.watermark.textValue,
            color: doc.page.watermark.color || 'black',
            opacity: doc.page.watermark.opacity ?? 0.1,
            bold: doc.page.watermark.fontWeight === 'bold',
            fontSize: doc.page.watermark.fontSize || 60,
        } : undefined,
    };

    // Remove text watermark from background if using native watermark
    if (definition.watermark && definition.background) {
        const originalBg = definition.background;
        definition.background = (currentPage: number, pageSize: any) => {
            return originalBg(currentPage, pageSize).filter((item: any) => !item.text);
        };
    }

    return definition;
};
