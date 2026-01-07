import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    DocumentSchema,
    PageSettings,
    EditorElement,
    ElementType,
    BaseStyle
} from '../types/editor';

interface EditorState {
    document: DocumentSchema;
    selectedElementId: string | null;

    // Actions
    setPageSettings: (settings: Partial<PageSettings>) => void;
    setWatermark: (watermark: DocumentSchema['page']['watermark']) => void;

    addElement: (type: ElementType, parentId?: string, indexOrRow?: number, colIndex?: number) => void;
    updateElement: (id: string, updates: Partial<EditorElement>) => void;
    removeElement: (id: string) => void;
    reorderElements: (activeId: string, overId: string) => void;

    addTableRow: (tableId: string) => void;
    addTableColumn: (tableId: string) => void;
    cloneElement: (id: string) => void;
    selectElement: (id: string | null) => void;
    resetDocument: () => void;
    loadTemplate: (template: 'blank' | 'default') => void;
}

const DEFAULT_PAGE: PageSettings = {
    size: 'A4',
    width: 210,
    height: 297,
    margins: { top: 10, right: 10, bottom: 10, left: 10 },
    padding: 0,
};

export const useEditorStore = create<EditorState>()(
    persist(
        (set) => ({
            document: {
                page: DEFAULT_PAGE,
                elements: {},
                rootElementIds: [],
            },
            selectedElementId: null,

            setPageSettings: (settings) => set((state) => ({
                document: {
                    ...state.document,
                    page: { ...state.document.page, ...settings }
                }
            })),

            setWatermark: (watermark) => set((state) => ({
                document: {
                    ...state.document,
                    page: { ...state.document.page, watermark }
                }
            })),

            addElement: (type: ElementType, parentId?: string, indexOrRow?: number, colIndex?: number) => set((state) => {
                const id = `${type}-${Math.random().toString(36).substr(2, 9)}`;

                let newElement: EditorElement;

                const baseProps = { id, style: { fontSize: 12, margin: [0, 0, 0, 10] as [number, number, number, number] } };

                switch (type) {
                    case 'heading':
                        newElement = { ...baseProps, type: 'heading', content: 'New Heading', style: { ...baseProps.style, fontSize: 24, fontWeight: 'bold' } };
                        break;
                    case 'paragraph':
                        newElement = { ...baseProps, type: 'paragraph', content: 'New paragraph text...' };
                        break;
                    case 'divider':
                        newElement = {
                            ...baseProps,
                            type: 'divider',
                            color: '#e2e8f0',
                            thickness: 1,
                            width: '100%',
                            lineStyle: 'solid'
                        };
                        break;
                    case 'image':
                        newElement = {
                            ...baseProps,
                            type: 'image',
                            src: 'https://placehold.co/200x100',
                            width: 200,
                            borderWidth: 0,
                            borderColor: '#000000',
                            borderStyle: 'solid',
                            borderRadius: 0
                        };
                        break;
                    case 'columns':
                        newElement = {
                            ...baseProps, type: 'columns', columns: [
                                { width: '50%', content: [] },
                                { width: '50%', content: [] }
                            ]
                        };
                        break;
                    case 'table':
                        newElement = {
                            ...baseProps,
                            type: 'table',
                            rows: 2,
                            cols: 2,
                            headerRow: true,
                            body: [[{ content: [] }, { content: [] }], [{ content: [] }, { content: [] }]]
                        };
                        break;
                    case 'invoice-items':
                        newElement = {
                            ...baseProps,
                            type: 'table',
                            rows: 3,
                            cols: 4,
                            headerRow: true,
                            headerColor: '#1e293b',
                            body: [
                                [
                                    { content: ['h-desc'] }, // Placeholder-like IDs for logic
                                    { content: ['h-qty'] },
                                    { content: ['h-price'] },
                                    { content: ['h-total'] }
                                ],
                                [
                                    { content: ['r1-desc'] },
                                    { content: ['r1-qty'] },
                                    { content: ['r1-price'] },
                                    { content: ['r1-total'] }
                                ],
                                [
                                    { content: ['r2-desc'] },
                                    { content: ['r2-qty'] },
                                    { content: ['r2-price'] },
                                    { content: ['r2-total'] }
                                ]
                            ]
                        } as any;
                        break;
                    case 'invoice-summary':
                        newElement = {
                            ...baseProps,
                            type: 'table',
                            rows: 4,
                            cols: 2,
                            headerRow: false,
                            body: [
                                [{ content: ['s-sub-l'] }, { content: ['s-sub-v'] }],
                                [{ content: ['s-gst-l'] }, { content: ['s-gst-v'] }],
                                [{ content: ['s-disc-l'] }, { content: ['s-disc-v'] }],
                                [{ content: ['s-total-l'] }, { content: ['s-total-v'] }]
                            ],
                            borderColor: '#ffffff', // No borders by default
                            borderWidth: 0,
                        } as any;
                        break;
                    case 'price-table':
                        newElement = {
                            ...baseProps,
                            type: 'table',
                            rows: 4,
                            cols: 3,
                            headerRow: true,
                            headerColor: '#3b82f6',
                            body: Array.from({ length: 4 }, () =>
                                Array.from({ length: 3 }, () => ({ content: [] }))
                            )
                        } as any;
                        break;
                    case 'payment-terms':
                        newElement = {
                            ...baseProps,
                            type: 'paragraph',
                            content: 'Payment Terms: Please pay within 30 days of invoice date. Bank: XXXX, Account: XXXXXXXX'
                        } as any;
                        break;
                    case 'client-info':
                        newElement = {
                            ...baseProps,
                            type: 'client-info',
                            headingValue: 'BILL TO',
                            headingStyle: { fontSize: 10, fontWeight: 'bold', color: '#64748b' },
                            showLeftBorder: true,
                            borderWidth: 3,
                            borderColor: '#3b82f6',
                            style: { ...baseProps.style, fontSize: 11 }
                        } as any;
                        break;
                    case 'business-info':
                        newElement = {
                            ...baseProps,
                            type: 'business-info',
                            headingValue: 'YOUR BUSINESS',
                            headingStyle: { fontSize: 10, fontWeight: 'bold', color: '#64748b' },
                            style: { ...baseProps.style, alignment: 'right', fontSize: 11 }
                        } as any;
                        break;
                    case 'signature':
                        newElement = { ...baseProps, type: 'signature' };
                        break;
                    default:
                        // Default to paragraph if unknown
                        newElement = { ...baseProps, type: 'paragraph', content: '' };
                }

                const newElements: Record<string, EditorElement> = {
                    ...state.document.elements,
                };

                const createText = (content: string, bold = false) => {
                    const tid = `text-${Math.random().toString(36).substr(2, 9)}`;
                    newElements[tid] = {
                        id: tid,
                        type: 'paragraph',
                        content,
                        style: { fontSize: 10, fontWeight: bold ? 'bold' : 'normal', margin: [0, 0, 0, 0] }
                    } as any;
                    return tid;
                };

                switch (type) {
                    case 'invoice-items':
                        newElement = {
                            ...baseProps,
                            type: 'table',
                            rows: 3,
                            cols: 4,
                            headerRow: true,
                            headerColor: '#1e293b',
                            body: [
                                [
                                    { content: [createText('Description', true)] },
                                    { content: [createText('Qty', true)] },
                                    { content: [createText('Rate', true)] },
                                    { content: [createText('Amount', true)] }
                                ],
                                [
                                    { content: [createText('Sample Item')] },
                                    { content: [createText('1')] },
                                    { content: [createText('$0.00')] },
                                    { content: [createText('$0.00')] }
                                ],
                                [
                                    { content: [createText('Another Item')] },
                                    { content: [createText('2')] },
                                    { content: [createText('$0.00')] },
                                    { content: [createText('$0.00')] }
                                ]
                            ]
                        } as any;
                        break;
                    case 'invoice-summary':
                        newElement = {
                            ...baseProps,
                            type: 'table',
                            rows: 4,
                            cols: 2,
                            headerRow: false,
                            body: [
                                [{ content: [createText('Subtotal', true)] }, { content: [createText('$0.00')] }],
                                [{ content: [createText('GST (18%)', true)] }, { content: [createText('$0.00')] }],
                                [{ content: [createText('Discount', true)] }, { content: [createText('$0.00')] }],
                                [{ content: [createText('Total', true)] }, { content: [createText('$0.00', true)] }]
                            ],
                            borderColor: '#ffffff',
                            borderWidth: 0,
                            style: { ...baseProps.style, alignment: 'right' }
                        } as any;
                        break;
                    case 'price-table':
                        newElement = {
                            ...baseProps,
                            type: 'table',
                            rows: 3,
                            cols: 3,
                            headerRow: true,
                            headerColor: '#3b82f6',
                            body: [
                                [
                                    { content: [createText('Plan', true)] },
                                    { content: [createText('Features', true)] },
                                    { content: [createText('Price', true)] }
                                ],
                                [
                                    { content: [createText('Basic')] },
                                    { content: [createText('5 Projects')] },
                                    { content: [createText('$10/mo')] }
                                ],
                                [
                                    { content: [createText('Pro')] },
                                    { content: [createText('Unlimited')] },
                                    { content: [createText('$30/mo')] }
                                ]
                            ]
                        } as any;
                        break;
                }

                newElements[id] = newElement as any;
                let newRootIds = [...state.document.rootElementIds];
                let updatedElements = newElements;

                if (parentId && updatedElements[parentId]) {
                    const parent = { ...updatedElements[parentId] };
                    if (parent.type === 'columns' && typeof indexOrRow === 'number') {
                        parent.columns[indexOrRow].content.push(id);
                    } else if (parent.type === 'table' && typeof indexOrRow === 'number' && typeof colIndex === 'number') {
                        parent.body[indexOrRow][colIndex].content.push(id);
                    }
                    updatedElements[parentId] = parent as EditorElement;
                } else {
                    if (typeof indexOrRow === 'number') {
                        newRootIds.splice(indexOrRow, 0, id);
                    } else {
                        newRootIds.push(id);
                    }
                }

                return {
                    document: {
                        ...state.document,
                        elements: updatedElements,
                        rootElementIds: newRootIds,
                    },
                    selectedElementId: id,
                } as Partial<EditorState>;
            }),

            updateElement: (id, updates) => set((state) => ({
                document: {
                    ...state.document,
                    elements: {
                        ...state.document.elements,
                        [id]: { ...state.document.elements[id], ...updates } as any
                    }
                }
            }) as Partial<EditorState>),

            removeElement: (id) => set((state) => {
                const newElements = { ...state.document.elements };
                delete newElements[id];

                return {
                    document: {
                        ...state.document,
                        elements: newElements,
                        rootElementIds: state.document.rootElementIds.filter(rid => rid !== id),
                    },
                    selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
                };
            }),

            reorderElements: (activeId, overId) => set((state) => {
                const oldIndex = state.document.rootElementIds.indexOf(activeId);
                const newIndex = state.document.rootElementIds.indexOf(overId);

                const newRootIds = [...state.document.rootElementIds];
                newRootIds.splice(oldIndex, 1);
                newRootIds.splice(newIndex, 0, activeId);

                return {
                    document: {
                        ...state.document,
                        rootElementIds: newRootIds,
                    }
                };
            }),

            addTableRow: (tableId: string) => set((state) => {
                const elements = { ...state.document.elements };
                const table = elements[tableId];
                if (!table || table.type !== 'table') return state;

                const newRow = Array.from({ length: Number(table.cols) }, () => ({ content: [] }));
                elements[tableId] = {
                    ...table,
                    rows: Number(table.rows) + 1,
                    body: [...table.body, newRow]
                } as any;

                return {
                    document: {
                        ...state.document,
                        elements
                    }
                };
            }),

            addTableColumn: (tableId: string) => set((state) => {
                const elements = { ...state.document.elements };
                const table = elements[tableId];
                if (!table || table.type !== 'table') return state;

                const newBody = table.body.map(row => [...row, { content: [] }]);
                elements[tableId] = {
                    ...table,
                    cols: Number(table.cols) + 1,
                    body: newBody
                } as any;

                return {
                    document: {
                        ...state.document,
                        elements
                    }
                };
            }),

            cloneElement: (id: string) => set((state) => {
                const elements = { ...state.document.elements };
                const originalElement = elements[id];
                if (!originalElement) return state;

                const cloneRecursive = (elem: EditorElement): EditorElement => {
                    const newId = `${elem.type}-${Math.random().toString(36).substr(2, 9)}`;
                    const clone = { ...elem, id: newId };

                    if (clone.type === 'columns') {
                        clone.columns = clone.columns.map(col => ({
                            ...col,
                            content: col.content.map(childId => {
                                const child = elements[childId];
                                const childClone = cloneRecursive(child);
                                elements[childClone.id] = childClone;
                                return childClone.id;
                            })
                        }));
                    } else if (clone.type === 'table') {
                        clone.body = clone.body.map(row =>
                            row.map(cell => ({
                                ...cell,
                                content: cell.content.map(childId => {
                                    const child = elements[childId];
                                    const childClone = cloneRecursive(child);
                                    elements[childClone.id] = childClone;
                                    return childClone.id;
                                })
                            }))
                        );
                    }

                    return clone;
                };

                const elementClone = cloneRecursive(originalElement);
                elements[elementClone.id] = elementClone;

                const rootIds = [...state.document.rootElementIds];
                const index = rootIds.indexOf(id);
                if (index !== -1) {
                    rootIds.splice(index + 1, 0, elementClone.id);
                }

                return {
                    document: {
                        ...state.document,
                        elements,
                        rootElementIds: rootIds
                    },
                    selectedElementId: elementClone.id
                };
            }),

            selectElement: (id) => set({ selectedElementId: id }),

            resetDocument: () => set({
                document: {
                    page: DEFAULT_PAGE,
                    elements: {},
                    rootElementIds: [],
                },
                selectedElementId: null,
            }),

            loadTemplate: (template) => {
                if (template === 'blank') {
                    set({
                        document: {
                            page: DEFAULT_PAGE,
                            elements: {},
                            rootElementIds: [],
                        },
                        selectedElementId: null,
                    });
                } else if (template === 'default') {
                    const id1 = `heading-${Math.random().toString(36).substr(2, 9)}`;
                    const id2 = `paragraph-${Math.random().toString(36).substr(2, 9)}`;
                    const tableId = `table-${Math.random().toString(36).substr(2, 9)}`;

                    set({
                        document: {
                            page: DEFAULT_PAGE,
                            elements: {
                                [id1]: { id: id1, type: 'heading', content: 'Invoice', style: { fontSize: 32, fontWeight: 'bold', margin: [0, 0, 0, 20] } } as any,
                                [id2]: { id: id2, type: 'paragraph', content: 'Thank you for your business!', style: { fontSize: 12, margin: [0, 20, 0, 0] } } as any,
                                [tableId]: {
                                    id: tableId,
                                    type: 'table',
                                    rows: 2,
                                    cols: 2,
                                    headerRow: true,
                                    body: [
                                        [{ content: [] }, { content: [] }],
                                        [{ content: [] }, { content: [] }]
                                    ],
                                    style: { margin: [0, 0, 0, 10] }
                                } as any
                            },
                            rootElementIds: [id1, tableId, id2],
                        },
                        selectedElementId: null,
                    });
                }
            },
        }),
        {
            name: 'pdfmake-editor-storage',
        }
    )
);
