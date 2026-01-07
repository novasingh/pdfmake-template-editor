import React from 'react';
import { EditorElement, Alignment } from '../../types/editor';

interface TablePropertiesProps {
    element: EditorElement;
    onUpdate: (updates: Partial<EditorElement>) => void;
    onAddRow: (id: string) => void;
    onAddCol: (id: string) => void;
    onStyleChange: (key: string, value: any) => void;
}

const TableProperties: React.FC<TablePropertiesProps> = ({ element, onUpdate, onAddRow, onAddCol, onStyleChange }) => {
    return (
        <>
            <div className="checkbox-row">
                <input
                    type="checkbox"
                    id="headerRow"
                    checked={(element as any).headerRow}
                    onChange={(e) => onUpdate({ headerRow: e.target.checked } as any)}
                />
                <label htmlFor="headerRow">Has Header Row</label>
            </div>

            {(element as any).headerRow && (
                <div className="prop-section">
                    <label>Header Color</label>
                    <input
                        type="color"
                        value={(element as any).headerColor || '#f8fafc'}
                        onChange={(e) => onUpdate({ headerColor: e.target.value } as any)}
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
                <label>Structure</label>
                <div className="prop-grid">
                    <button
                        className="secondary-btn"
                        onClick={() => onAddRow(element.id)}
                    >
                        + Add Row
                    </button>
                    <button
                        className="secondary-btn"
                        onClick={() => onAddCol(element.id)}
                    >
                        + Add Col
                    </button>
                </div>
            </div>
        </>
    );
};

export default TableProperties;
