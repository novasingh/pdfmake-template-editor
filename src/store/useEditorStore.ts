import { create } from 'zustand';
import { parseCurrency } from '../utils/formatUtils';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import {
    DocumentSchema,
    PageSettings,
    EditorElement,
    BaseElement,
    ElementType,
    BaseStyle,
    TableElement,
    TableCell
} from '../types/editor';
import { MODULE_REGISTRY } from '../templates/modules';
import { getElementDefaults } from './elementDefaults';
import { calculateInvoiceTotals } from './storeUtils';

export interface DialogOptions {
    type: 'alert' | 'confirm' | 'prompt';
    title?: string;
    message: string;
    defaultValue?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: (value?: string) => void;
    onCancel?: () => void;
}

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
    moveElement: (elementId: string, targetParentId: string | null, targetIndex?: number, targetColIndex?: number) => void;

    addTableRow: (tableId: string) => void;
    removeTableRow: (tableId: string, rowIndex: number) => void;
    addTableColumn: (tableId: string) => void;
    removeTableColumn: (tableId: string, colIndex: number) => void;
    updateTableCell: (tableId: string, rowIndex: number, colIndex: number, updates: Partial<TableCell>) => void;
    mergeTableCells: (tableId: string, rowIndex: number, colIndex: number, rowSpan: number, colSpan: number) => void;
    updateTableWidths: (tableId: string, widths: (number | string)[]) => void;
    cloneElement: (id: string) => void;
    selectElement: (id: string | null) => void;
    resetDocument: () => void;
    loadTemplate: (template: 'blank' | 'default') => void;
    loadDocument: (document: DocumentSchema) => void;

    // Variables & Modules
    variables: Record<string, string>;
    setVariables: (vars: Record<string, string>) => void;
    insertModule: (moduleName: string) => void;

    // Clipboard & Movement
    clipboard: string | null; // Store ID to clone from, or serialised element
    copyElement: (id: string) => void;
    pasteElement: () => void;
    moveElementUpDown: (id: string, direction: 'up' | 'down') => void;

    // Zoom
    canvasZoom: number;
    setCanvasZoom: (zoom: number) => void;

    // Dialog State
    dialog: DialogOptions | null;
    showDialog: (options: DialogOptions) => void;
    closeDialog: () => void;

    // UI State
    propertiesPanelOpen: boolean;
    propertiesPanelUserOverride: 'open' | 'close' | null;
    togglePropertiesPanel: (open?: boolean) => void;
}

const DEFAULT_PAGE: PageSettings = {
    size: 'A4',
    width: 210,
    height: 297,
    margins: { top: 10, right: 10, bottom: 10, left: 10 },
    padding: 0,
};

export const useEditorStore = create<EditorState>()(
    temporal(
        persist(
            (set, get) => ({
                document: {
                    page: DEFAULT_PAGE,
                    elements: {},
                    rootElementIds: [],
                },
                selectedElementId: null,
                variables: {},
                clipboard: null,
                canvasZoom: 1,
                dialog: null,
                propertiesPanelOpen: false,
                propertiesPanelUserOverride: null,

                togglePropertiesPanel: (open) => set((state) => {
                    const isOpen = typeof open === 'boolean' ? open : !state.propertiesPanelOpen;
                    return {
                        propertiesPanelOpen: isOpen,
                        propertiesPanelUserOverride: isOpen ? 'open' : 'close',
                    };
                }),

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
                    let newElement = getElementDefaults(type) as EditorElement;
                    const id = newElement.id;

                    const newElements: Record<string, EditorElement> = {
                        ...state.document.elements,
                    };

                    const createText = (content: string, bold = false, role?: BaseElement['role']) => {
                        const tid = `text-${Math.random().toString(36).substr(2, 9)}`;
                        newElements[tid] = {
                            id: tid,
                            type: 'paragraph',
                            content,
                            role,
                            style: { fontSize: 10, fontWeight: bold ? 'bold' : 'normal', margin: [0, 0, 0, 0] }
                        } as any;
                        return tid;
                    };

                    // Specialized composite blocks
                    switch (type) {
                        case 'invoice-items':
                            newElement = {
                                ...newElement,
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
                                        { content: [createText('1', false, 'item-qty')] },
                                        { content: [createText('$0.00', false, 'item-rate')] },
                                        { content: [createText('$0.00', false, 'item-amount')] }
                                    ],
                                    [
                                        { content: [createText('Another Item')] },
                                        { content: [createText('2', false, 'item-qty')] },
                                        { content: [createText('$0.00', false, 'item-rate')] },
                                        { content: [createText('$0.00', false, 'item-amount')] }
                                    ]
                                ]
                            } as any;
                            break;
                        case 'invoice-summary':
                            newElement = {
                                ...newElement,
                                type: 'table',
                                rows: 4,
                                cols: 2,
                                headerRow: false,
                                body: [
                                    [{ content: [createText('Subtotal', true)] }, { content: [createText('$0.00', false, 'summary-subtotal')] }],
                                    [{ content: [createText('GST (10%)', true)] }, { content: [createText('$0.00', false, 'summary-gst')] }],
                                    [{ content: [createText('Discount', true)] }, { content: [createText('$0.00', false, 'summary-discount')] }],
                                    [{ content: [createText('Total', true)] }, { content: [createText('$0.00', true, 'summary-total')] }]
                                ],
                                borderColor: '#ffffff',
                                borderWidth: 0,
                                style: { ...newElement.style, alignment: 'right' }
                            } as any;
                            break;
                        case 'price-table':
                            newElement = {
                                ...newElement,
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

                    newElements[id] = newElement;
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
                        propertiesPanelOpen: true,
                    } as Partial<EditorState>;
                }),

                updateElement: (id, updates) => set((state) => {
                    const elements = {
                        ...state.document.elements,
                        [id]: { ...state.document.elements[id], ...updates } as EditorElement
                    };

                    const nextElements = calculateInvoiceTotals(elements, id);

                    return {
                        document: {
                            ...state.document,
                            elements: nextElements
                        }
                    };
                }),

                removeElement: (id) => set((state) => {
                    const newElements = { ...state.document.elements };

                    // Remove the element from any column's content array
                    Object.values(newElements).forEach((el) => {
                        if (el.type === 'columns') {
                            const columnsEl = el as any;
                            columnsEl.columns = columnsEl.columns.map((col: any) => ({
                                ...col,
                                content: col.content.filter((contentId: string) => contentId !== id)
                            }));
                        }
                        // Also clean up table cells if needed
                        if (el.type === 'table') {
                            const tableEl = el as any;
                            tableEl.body = tableEl.body.map((row: any[]) =>
                                row.map((cell: any) => ({
                                    ...cell,
                                    content: cell.content.filter((contentId: string) => contentId !== id)
                                }))
                            );
                        }
                    });

                    // Remove from parent container

                    delete newElements[id];

                    const isDeselected = state.selectedElementId === id;
                    let panelOpen = state.propertiesPanelOpen;
                    if (isDeselected && state.propertiesPanelUserOverride !== 'open') {
                        panelOpen = false;
                    }

                    return {
                        document: {
                            ...state.document,
                            elements: newElements,
                            rootElementIds: state.document.rootElementIds.filter(rid => rid !== id)
                        },
                        selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
                        propertiesPanelOpen: panelOpen
                    };
                }),

                reorderElements: (activeId, overId) => set((state) => {
                    const doc = state.document;

                    // Try root elements
                    const oldRootIndex = doc.rootElementIds.indexOf(activeId);
                    const newRootIndex = doc.rootElementIds.indexOf(overId);
                    if (oldRootIndex !== -1 && newRootIndex !== -1) {
                        const newRootIds = [...doc.rootElementIds];
                        newRootIds.splice(oldRootIndex, 1);
                        newRootIds.splice(newRootIndex, 0, activeId);
                        return { document: { ...doc, rootElementIds: newRootIds } };
                    }

                    return state;
                }),

                moveElement: (elementId, targetParentId, targetIndex, targetColIndex) => set((state) => {
                    const newElements = { ...state.document.elements };
                    let newRootIds = [...state.document.rootElementIds];

                    // Helper function to remove element from its current location
                    const removeFromCurrentLocation = () => {
                        // Remove from root if present
                        const rootIdx = newRootIds.indexOf(elementId);
                        if (rootIdx !== -1) {
                            newRootIds.splice(rootIdx, 1);
                            return;
                        }

                        // Remove from columns
                        Object.values(newElements).forEach((el) => {
                            if (el.type === 'columns') {
                                const columnsEl = el as any;
                                columnsEl.columns = columnsEl.columns.map((col: any) => ({
                                    ...col,
                                    content: col.content.filter((id: string) => id !== elementId)
                                }));
                            }
                            // Remove from table cells
                            if (el.type === 'table') {
                                const tableEl = el as any;
                                tableEl.body = tableEl.body.map((row: any[]) =>
                                    row.map((cell: any) => ({
                                        ...cell,
                                        content: cell.content.filter((id: string) => id !== elementId)
                                    }))
                                );
                            }
                        });
                    };

                    // Remove from current location first
                    removeFromCurrentLocation();

                    // Add to new location
                    if (targetParentId && newElements[targetParentId]) {
                        const parent = newElements[targetParentId];

                        if (parent.type === 'columns' && typeof targetIndex === 'number') {
                            // Add to column
                            const columnsEl = parent as any;
                            if (columnsEl.columns[targetIndex]) {
                                columnsEl.columns[targetIndex].content.push(elementId);
                            }
                        } else if (parent.type === 'table' && typeof targetIndex === 'number' && typeof targetColIndex === 'number') {
                            // Add to table cell
                            const tableEl = parent as any;
                            if (tableEl.body[targetIndex] && tableEl.body[targetIndex][targetColIndex]) {
                                tableEl.body[targetIndex][targetColIndex].content.push(elementId);
                            }
                        }
                    } else {
                        // Add to root
                        if (typeof targetIndex === 'number' && targetIndex >= 0) {
                            newRootIds.splice(targetIndex, 0, elementId);
                        } else {
                            newRootIds.push(elementId);
                        }
                    }

                    return {
                        document: {
                            ...state.document,
                            elements: newElements,
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

                removeTableRow: (tableId: string, rowIndex: number) => set((state) => {
                    const elements = { ...state.document.elements };
                    const table = elements[tableId] as TableElement;
                    if (!table || table.type !== 'table') return state;

                    // Clone body and remove row
                    const newBody = [...table.body];
                    const [removedRow] = newBody.splice(rowIndex, 1);

                    // Collect IDs of elements that were only in this row to delete them
                    // Note: In this simple implementation, we assume elements are owned by cells.
                    // In a more robust system, we'd check if they exist elsewhere.
                    const idsToRemove: string[] = [];
                    removedRow.forEach((cell: TableCell) => {
                        idsToRemove.push(...cell.content);
                    });

                    // Delete child elements
                    idsToRemove.forEach(id => delete elements[id]);

                    elements[tableId] = {
                        ...table,
                        rows: Math.max(0, table.rows - 1),
                        body: newBody
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
                    const table = elements[tableId] as TableElement;
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

                removeTableColumn: (tableId: string, colIndex: number) => set((state) => {
                    const elements = { ...state.document.elements };
                    const table = elements[tableId] as TableElement;
                    if (!table || table.type !== 'table') return state;

                    const idsToRemove: string[] = [];
                    const newBody = table.body.map((row: TableCell[]) => {
                        const newRow = [...row];
                        const [removedCell] = newRow.splice(colIndex, 1);
                        idsToRemove.push(...removedCell.content);
                        return newRow;
                    });

                    idsToRemove.forEach(id => delete elements[id]);

                    elements[tableId] = {
                        ...table,
                        cols: Math.max(0, table.cols - 1),
                        body: newBody
                    } as any;

                    return {
                        document: {
                            ...state.document,
                            elements
                        }
                    };
                }),

                updateTableCell: (tableId, rowIndex, colIndex, updates: Partial<TableCell>) => set((state) => {
                    const elements = { ...state.document.elements };
                    const table = elements[tableId] as TableElement;
                    if (!table || table.type !== 'table') return state;

                    const newBody = [...table.body];
                    newBody[rowIndex] = [...newBody[rowIndex]];
                    newBody[rowIndex][colIndex] = { ...newBody[rowIndex][colIndex], ...updates };

                    elements[tableId] = {
                        ...table,
                        body: newBody
                    } as any;

                    return {
                        document: {
                            ...state.document,
                            elements
                        }
                    };
                }),

                mergeTableCells: (tableId, rowIndex, colIndex, rowSpan, colSpan) => set((state) => {
                    const elements = { ...state.document.elements };
                    const table = elements[tableId] as TableElement;
                    if (!table || table.type !== 'table') return state;

                    const newBody = [...table.body];

                    // Set span on the target cell
                    newBody[rowIndex] = [...newBody[rowIndex]];
                    newBody[rowIndex][colIndex] = {
                        ...newBody[rowIndex][colIndex],
                        rowSpan,
                        colSpan
                    };

                    // Clear content of "covered" cells? 
                    // Actually, the renderer will skip them, but it's cleaner to handle it here if needed.
                    // For now, setting the span is enough as the renderer handles the "isCovered" logic.

                    elements[tableId] = {
                        ...table,
                        body: newBody
                    } as any;

                    return {
                        document: {
                            ...state.document,
                            elements
                        }
                    };
                }),

                updateTableWidths: (tableId, widths) => set((state) => {
                    const elements = { ...state.document.elements };
                    const table = elements[tableId] as TableElement;
                    if (!table || table.type !== 'table') return state;

                    elements[tableId] = {
                        ...table,
                        widths
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

                selectElement: (id) => set((state) => {
                    let panelOpen = state.propertiesPanelOpen;

                    // Only force open if selecting a NEW/different element
                    if (id && id !== state.selectedElementId) {
                        panelOpen = true;
                    } else if (!id) {
                        // If deselecting, respect manual override
                        if (state.propertiesPanelUserOverride === 'open') {
                            panelOpen = true;
                        } else {
                            panelOpen = false;
                        }
                    }

                    return {
                        selectedElementId: id,
                        propertiesPanelOpen: panelOpen
                    };
                }),

                resetDocument: () => set({
                    document: {
                        page: DEFAULT_PAGE,
                        elements: {},
                        rootElementIds: [],
                    },
                    selectedElementId: null,
                    propertiesPanelOpen: false,
                    propertiesPanelUserOverride: null,
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
                            propertiesPanelOpen: false,
                            propertiesPanelUserOverride: null,
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
                            propertiesPanelOpen: false,
                            propertiesPanelUserOverride: null,
                        });
                    }
                },

                loadDocument: (document) => set({
                    document: JSON.parse(JSON.stringify(document)),
                    selectedElementId: null,
                    propertiesPanelOpen: false,
                    propertiesPanelUserOverride: null,
                }),

                setVariables: (vars: Record<string, string>) => set((state) => ({
                    variables: { ...state.variables, ...vars }
                })),

                setCanvasZoom: (zoom: number) => set({ canvasZoom: Math.max(0.25, Math.min(2, zoom)) }),

                insertModule: (moduleName: string) => set((state) => {
                    const moduleFunc = MODULE_REGISTRY[moduleName as keyof typeof MODULE_REGISTRY];
                    if (!moduleFunc) {
                        console.error(`Module ${moduleName} not found in registry.`);
                        return state;
                    }

                    const moduleDef = moduleFunc();
                    const newElements = { ...state.document.elements, ...moduleDef.elements };
                    const newRootIds = [...state.document.rootElementIds, ...moduleDef.rootIds];

                    return {
                        document: {
                            ...state.document,
                            elements: newElements,
                            rootElementIds: newRootIds
                        }
                    };
                }),

                copyElement: (id: string) => set({ clipboard: id }),

                pasteElement: () => {
                    const { clipboard, cloneElement } = get();
                    if (clipboard) cloneElement(clipboard);
                },

                moveElementUpDown: (id, direction) => set((state) => {
                    const rootIds = [...state.document.rootElementIds];
                    const index = rootIds.indexOf(id);
                    if (index === -1) return state;

                    const newIndex = direction === 'up' ? index - 1 : index + 1;
                    if (newIndex < 0 || newIndex >= rootIds.length) return state;

                    [rootIds[index], rootIds[newIndex]] = [rootIds[newIndex], rootIds[index]];

                    return {
                        document: {
                            ...state.document,
                            rootElementIds: rootIds
                        }
                    };
                }),

                showDialog: (options: DialogOptions) => set({ dialog: options }),
                closeDialog: () => set({ dialog: null }),
            }),
            {
                name: 'pdfmake-editor-storage',
                partialize: (state) => ({
                    document: state.document,
                    variables: state.variables,
                    selectedElementId: state.selectedElementId
                })
            }
        ),
        {
            partialize: (state) => ({
                document: state.document,
                variables: state.variables
            }),
            limit: 50
        }
    )
);
