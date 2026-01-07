import { DocumentSchema, EditorElement, BaseStyle } from '../types/editor';

/**
 * Maps our internal EditorElement style to pdfmake style properties
 */
const mapStyle = (style: BaseStyle) => {
    return {
        fontSize: style.fontSize,
        bold: style.fontWeight === 'bold' || style.fontWeight === '600' || style.fontWeight === '700',
        color: style.color,
        alignment: style.alignment,
        margin: style.margin,
    };
};

/**
 * Recursively maps our internal schema to pdfmake document definition
 */
export const exportToPdfMake = (doc: DocumentSchema): any => {
    const content = doc.rootElementIds.map(id => {
        const element = doc.elements[id];
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
                const pageWidth = 515; // Approx A4 width (595 - margins)
                let lineWidth = pageWidth;

                if (typeof div.width === 'string' && div.width.endsWith('%')) {
                    lineWidth = (pageWidth * parseFloat(div.width)) / 100;
                } else if (typeof div.width === 'number') {
                    lineWidth = div.width;
                }

                // Handle x1, x2 based on alignment
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
                    width: typeof img.width === 'string' && img.width.endsWith('%') ? 515 * (parseFloat(img.width) / 100) : (img.width || 150),
                    height: img.height === 'auto' ? undefined : img.height,
                    ...mapStyle(element.style),
                };
            }

            case 'columns':
                return {
                    columns: (element as any).columns.map((col: any) => ({
                        width: col.width,
                        stack: col.content.map((childId: string) => {
                            const child = doc.elements[childId];
                            // Recursive mapping for nested content
                            // (For now, top-level reordering is prioritized)
                            return child ? { text: (child as any).content, ...mapStyle(child.style) } : null;
                        }).filter(Boolean)
                    })),
                    ...mapStyle(element.style),
                };

            case 'table': {
                const table = element as any;
                return {
                    table: {
                        headerRows: table.headerRow ? 1 : 0,
                        body: table.body.map((row: any[], rIdx: number) =>
                            row.map(cell => {
                                const isHeader = table.headerRow && rIdx === 0;
                                return {
                                    stack: cell.content.map((childId: string) => {
                                        const child = doc.elements[childId];
                                        return child ? exportToPdfMake({ ...doc, rootElementIds: [childId] }).content[0] : null;
                                    }).filter(Boolean),
                                    fillColor: isHeader ? (table.headerColor || '#f8fafc') : undefined
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
                            hLineWidth: (): number => 0,
                            vLineWidth: (): number => 0,
                            hLineColor: (): string => 'white',
                            vLineColor: (): string => 'white',
                            paddingLeft: (): number => 0,
                            paddingRight: (): number => 0,
                            paddingTop: (): number => 0,
                            paddingBottom: (): number => 0,
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

            default:
                return null;
        }
    }).filter(Boolean);

    const definition: any = {
        pageSize: doc.page.size,
        pageMargins: [
            doc.page.margins.left,
            doc.page.margins.top,
            doc.page.margins.right,
            doc.page.margins.bottom
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

            // 2. Watermark
            if (doc.page.watermark) {
                const wm = doc.page.watermark;
                const opacity = wm.opacity ?? 0.1;
                const pos = wm.position || 'center';

                // Calculate position offsets
                let x = pageSize.width / 2;
                let y = pageSize.height / 2;
                let alignment = 'center';

                if (pos.includes('left')) x = doc.page.margins.left;
                if (pos.includes('right')) x = pageSize.width - doc.page.margins.right;
                if (pos.includes('top')) y = doc.page.margins.top;
                if (pos.includes('bottom')) y = pageSize.height - doc.page.margins.bottom;

                if (pos.includes('left')) alignment = 'left';
                if (pos.includes('right')) alignment = 'right';

                if (wm.type === 'text') {
                    bg.push({
                        text: wm.textValue,
                        fontSize: wm.fontSize || 60,
                        color: wm.color || 'black',
                        opacity: opacity,
                        bold: wm.fontWeight === 'bold',
                        alignment: alignment as any,
                        margin: [
                            pos.includes('left') ? 20 : 0,
                            pos.includes('top') ? 20 : pos.includes('bottom') ? 0 : y - (wm.fontSize || 60) / 2,
                            pos.includes('right') ? 20 : 0,
                            pos.includes('bottom') ? 20 : 0
                        ]
                    });
                } else if (wm.type === 'image' && wm.imageUrl) {
                    bg.push({
                        image: wm.imageUrl,
                        width: wm.width || 200,
                        height: wm.height || 200,
                        opacity: opacity,
                        absolutePosition: {
                            x: pos.includes('left') ? doc.page.margins.left : pos.includes('right') ? pageSize.width - (wm.width || 200) - doc.page.margins.right : (pageSize.width - (wm.width || 200)) / 2,
                            y: pos.includes('top') ? doc.page.margins.top : pos.includes('bottom') ? pageSize.height - (wm.height || 200) - doc.page.margins.bottom : (pageSize.height - (wm.height || 200)) / 2
                        }
                    });
                }
            }

            return bg;
        }
    };

    return definition;
};
