import React from 'react';
import { EditorElement, Alignment, TableElement, TableCell } from '../../types/editor';

interface TablePropertiesProps {
    element: EditorElement;
    onUpdate: (updates: Partial<EditorElement>) => void;
    onAddRow: (id: string) => void;
    onAddCol: (id: string) => void;
    onRemoveRow?: (id: string, index: number) => void;
    onRemoveCol?: (id: string, index: number) => void;
    onUpdateCell?: (id: string, row: number, col: number, updates: Partial<TableCell>) => void;
    onStyleChange: (key: string, value: any) => void;
}

const TableProperties: React.FC<TablePropertiesProps> = ({
    element, onUpdate, onAddRow, onAddCol, onRemoveRow, onRemoveCol, onUpdateCell, onStyleChange
}) => {
    const table = element as TableElement;
    const [selectedCell, setSelectedCell] = React.useState<{ r: number, c: number } | null>(null);

    return (
        <>
            <div className="checkbox-row">
                <input
                    type="checkbox"
                    id="headerRow"
                    checked={table.headerRow}
                    onChange={(e) => onUpdate({ headerRow: e.target.checked })}
                />
                <label htmlFor="headerRow">Has Header Row</label>
            </div>

            <div className="checkbox-row">
                <input
                    type="checkbox"
                    id="stripeRows"
                    checked={!!table.alternateRowColor}
                    onChange={(e) => onUpdate({ alternateRowColor: e.target.checked ? '#f8fafc' : undefined })}
                />
                <label htmlFor="stripeRows">Stripe Rows</label>
            </div>

            {table.alternateRowColor && (
                <div className="prop-section">
                    <label>Stripe Color</label>
                    <input
                        type="color"
                        value={table.alternateRowColor}
                        onChange={(e) => onUpdate({ alternateRowColor: e.target.value })}
                    />
                </div>
            )}

            {table.headerRow && (
                <div className="prop-section">
                    <label>Header Color</label>
                    <input
                        type="color"
                        value={table.headerColor || '#f8fafc'}
                        onChange={(e) => onUpdate({ headerColor: e.target.value })}
                    />
                </div>
            )}

            <div className="prop-section">
                <label>Border Thickness (px)</label>
                <input
                    type="number"
                    value={(element as any).borderWidth ?? 1}
                    onChange={(e) => onUpdate({ borderWidth: parseInt(e.target.value, 10) } as any)}
                />
            </div>

            <div className="prop-section">
                <label>Border Color</label>
                <input
                    type="color"
                    value={(element as any).borderColor || '#e2e8f0'}
                    onChange={(e) => onUpdate({ borderColor: e.target.value } as any)}
                />
            </div>

            <div className="prop-section">
                <label>Cell Padding (px)</label>
                <input
                    type="number"
                    value={(element as any).cellPadding ?? 5}
                    onChange={(e) => onUpdate({ cellPadding: parseInt(e.target.value, 10) } as any)}
                />
            </div>

            <div className="prop-section">
                <label>Alignment</label>
                <div className="alignment-toggle">
                    {(['left', 'center', 'right', 'justify'] as Alignment[]).map((align) => (
                        <button
                            key={align}
                            className={element.style.alignment === align ? 'active' : ''}
                            onClick={() => onStyleChange('alignment', align)}
                        >
                            {align[0].toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="prop-section">
                <label>Column Widths</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {Array.from({ length: table.cols }).map((_, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', width: '40px' }}>Col {i + 1}:</span>
                            <input
                                type="text"
                                value={table.widths?.[i] ?? '*'}
                                placeholder="*, auto, or px"
                                onChange={(e) => {
                                    const newWidths = [...(table.widths || Array(table.cols).fill('*'))];
                                    const val = e.target.value;
                                    newWidths[i] = isNaN(Number(val)) ? val : Number(val);
                                    onUpdate({ widths: newWidths });
                                }}
                                style={{ flex: 1 }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="prop-section">
                <label>Manage Structure</label>
                <div className="prop-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button className="secondary-btn" onClick={() => onAddRow(element.id)}>+ Row</button>
                    <button className="secondary-btn" onClick={() => onAddCol(element.id)}>+ Col</button>
                    <select
                        onChange={(e) => {
                            if (e.target.value !== '' && onRemoveRow) {
                                onRemoveRow(element.id, parseInt(e.target.value));
                                e.target.value = '';
                            }
                        }}
                        style={{ fontSize: '11px' }}
                    >
                        <option value="">- Remove Row -</option>
                        {Array.from({ length: table.rows }).map((_, i) => (
                            <option key={i} value={i}>Row {i + 1}</option>
                        ))}
                    </select>
                    <select
                        onChange={(e) => {
                            if (e.target.value !== '' && onRemoveCol) {
                                onRemoveCol(element.id, parseInt(e.target.value));
                                e.target.value = '';
                            }
                        }}
                        style={{ fontSize: '11px' }}
                    >
                        <option value="">- Remove Col -</option>
                        {Array.from({ length: table.cols }).map((_, i) => (
                            <option key={i} value={i}>Col {i + 1}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="prop-section">
                <label>Cell Properties</label>
                <div className="mini-table-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${table.cols}, 1fr)`,
                    gap: '2px',
                    margin: '8px 0',
                    border: '1px solid #e2e8f0',
                    padding: '2px'
                }}>
                    {table.body.map((row, r) =>
                        row.map((_, c) => (
                            <div
                                key={`${r}-${c}`}
                                onClick={() => setSelectedCell({ r, c })}
                                style={{
                                    height: '20px',
                                    backgroundColor: selectedCell?.r === r && selectedCell?.c === c ? '#3b82f6' : '#f8fafc',
                                    border: '1px solid #cbd5e1',
                                    cursor: 'pointer'
                                }}
                                title={`Cell ${r + 1},${c + 1}`}
                            />
                        ))
                    )}
                </div>

                {selectedCell && (
                    <div className="cell-controls" style={{ padding: '8px', background: '#f8fafc', borderRadius: '4px' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold' }}>
                            Editing Cell ({selectedCell.r + 1}, {selectedCell.c + 1})
                        </p>

                        <div className="prop-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <div>
                                <label style={{ fontSize: '11px' }}>Row Span</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={table.body[selectedCell.r][selectedCell.c].rowSpan || 1}
                                    onChange={(e) => onUpdateCell?.(table.id, selectedCell.r, selectedCell.c, { rowSpan: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '11px' }}>Col Span</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={table.body[selectedCell.r][selectedCell.c].colSpan || 1}
                                    onChange={(e) => onUpdateCell?.(table.id, selectedCell.r, selectedCell.c, { colSpan: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '8px' }}>
                            <label style={{ fontSize: '11px' }}>Cell BG Color</label>
                            <input
                                type="color"
                                value={table.body[selectedCell.r][selectedCell.c].backgroundColor || '#ffffff'}
                                onChange={(e) => onUpdateCell?.(table.id, selectedCell.r, selectedCell.c, { backgroundColor: e.target.value })}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default TableProperties;
