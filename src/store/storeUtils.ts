import { EditorElement, TableElement } from '../types/editor';
import { formatCurrency, parseCurrency } from '../utils/formatUtils';

/**
 * Recalculates invoice totals if a specific element (qty, rate) was updated.
 * Returns the updated elements object.
 */
export const calculateInvoiceTotals = (elements: Record<string, EditorElement>, updatedId: string): Record<string, EditorElement> => {
    const nextElements = { ...elements };
    const updatedElement = nextElements[updatedId];

    if (!updatedElement || (updatedElement.role !== 'item-qty' && updatedElement.role !== 'item-rate')) {
        return nextElements;
    }

    // Find the table row this element belongs to
    let tableId: string | null = null;
    let rowIndex: number | null = null;

    Object.entries(nextElements).forEach(([tid, el]) => {
        if (el.type === 'table') {
            const table = el as TableElement;
            table.body.forEach((row, rIdx) => {
                row.forEach(cell => {
                    if (cell.content.includes(updatedId)) {
                        tableId = tid;
                        rowIndex = rIdx;
                    }
                });
            });
        }
    });

    if (tableId && rowIndex !== null) {
        const table = nextElements[tableId] as TableElement;
        const row = table.body[rowIndex];

        let qtyValue = 0;
        let rateValue = 0;
        let amountElementId: string | null = null;

        row.forEach(cell => {
            cell.content.forEach(cid => {
                const child = nextElements[cid];
                if (child.role === 'item-qty') {
                    qtyValue = parseFloat((child as any).content) || 0;
                } else if (child.role === 'item-rate') {
                    const val = (child as any).content || '0';
                    rateValue = parseFloat(val.replace(/[^0-9.-]/g, '')) || 0;
                } else if (child.role === 'item-amount') {
                    amountElementId = cid;
                }
            });
        });

        if (amountElementId) {
            const total = qtyValue * rateValue;
            const amountEl = nextElements[amountElementId] as any;
            nextElements[amountElementId] = {
                ...amountEl,
                content: formatCurrency(total)
            };
        }

        // Now trigger summary calculation
        let subtotal = 0;
        Object.values(nextElements).forEach(el => {
            if (el.role === 'item-amount') {
                const val = (el as any).content || '0';
                subtotal += parseCurrency(val);
            }
        });

        const gst = subtotal * 0.10;
        const grandTotal = subtotal + gst;

        Object.entries(nextElements).forEach(([id, el]) => {
            if (el.role === 'summary-subtotal') {
                nextElements[id] = { ...el, content: formatCurrency(subtotal) } as any;
            } else if (el.role === 'summary-gst') {
                nextElements[id] = { ...el, content: formatCurrency(gst) } as any;
            } else if (el.role === 'summary-total') {
                nextElements[id] = { ...el, content: formatCurrency(grandTotal) } as any;
            }
        });
    }

    return nextElements;
};
