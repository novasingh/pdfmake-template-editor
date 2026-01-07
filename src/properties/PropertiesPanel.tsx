import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { FontWeight, Alignment } from '../types/editor';
import './PropertiesPanel.css';

const PropertiesPanel: React.FC = () => {
    const {
        selectedElementId,
        document: doc,
        updateElement,
        addTableRow,
        addTableColumn
    } = useEditorStore();

    const element = selectedElementId ? doc.elements[selectedElementId] : null;

    if (!element) {
        return (
            <div className="properties-panel empty">
                <p>Select an element on the canvas to edit its properties.</p>
            </div>
        );
    }

    const handleStyleChange = (key: string, value: any) => {
        updateElement(element.id, {
            style: { ...element.style, [key]: value }
        });
    };

    const handleContentChange = (content: string) => {
        if (element.type === 'heading' || element.type === 'paragraph') {
            updateElement(element.id, { content } as any);
        }
    };

    return (
        <div className="properties-panel">
            <div className="panel-header">
                <h2>{element.type.toUpperCase()} Properties</h2>
            </div>

            <div className="panel-content">
                {(element.type === 'heading' || element.type === 'paragraph') && (
                    <>
                        <div className="prop-section">
                            <label>Content</label>
                            <textarea
                                value={(element as any).content}
                                onChange={(e) => handleContentChange(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="prop-section">
                            <label>Font Size (pt)</label>
                            <input
                                type="number"
                                value={element.style.fontSize || 12}
                                onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value, 10))}
                            />
                        </div>

                        <div className="prop-section">
                            <label>Font Weight</label>
                            <select
                                value={element.style.fontWeight || 'normal'}
                                onChange={(e) => handleStyleChange('fontWeight', e.target.value as FontWeight)}
                            >
                                <option value="normal">Normal</option>
                                <option value="bold">Bold</option>
                                <option value="600">Semibold</option>
                                <option value="700">Extra Bold</option>
                            </select>
                        </div>
                    </>
                )}

                {element.type === 'divider' && (
                    <>
                        <div className="prop-section">
                            <label>Thickness (px)</label>
                            <input
                                type="number"
                                value={(element as any).thickness || 1}
                                onChange={(e) => updateElement(element.id, { thickness: parseInt(e.target.value, 10) } as any)}
                            />
                        </div>

                        <div className="prop-section">
                            <label>Width (%)</label>
                            <input
                                type="text"
                                value={(element as any).width || '100%'}
                                onChange={(e) => updateElement(element.id, { width: e.target.value } as any)}
                            />
                        </div>

                        <div className="prop-section">
                            <label>Line Style</label>
                            <select
                                value={(element as any).lineStyle || 'solid'}
                                onChange={(e) => updateElement(element.id, { lineStyle: e.target.value } as any)}
                            >
                                <option value="solid">None</option>
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                            </select>
                        </div>

                        <div className="prop-section">
                            <label>Line Color</label>
                            <input
                                type="color"
                                value={(element as any).color || '#e2e8f0'}
                                onChange={(e) => updateElement(element.id, { color: e.target.value } as any)}
                            />
                        </div>
                    </>
                )}

                {element.type === 'image' && (
                    <>
                        <div className="prop-section">
                            <label>Image Source (URL or Base64)</label>
                            <textarea
                                value={(element as any).src || ''}
                                onChange={(e) => updateElement(element.id, { src: e.target.value } as any)}
                                rows={4}
                                placeholder="Paste image URL or Base64 code here..."
                            />
                        </div>

                        <div className="prop-grid">
                            <div className="prop-group">
                                <span>Width</span>
                                <input
                                    type="text"
                                    value={(element as any).width || ''}
                                    onChange={(e) => updateElement(element.id, { width: e.target.value } as any)}
                                    placeholder="e.g. 200, 50%"
                                />
                            </div>
                            <div className="prop-group">
                                <span>Height</span>
                                <input
                                    type="text"
                                    value={(element as any).height || ''}
                                    onChange={(e) => updateElement(element.id, { height: e.target.value } as any)}
                                    placeholder="e.g. 100"
                                />
                            </div>
                        </div>

                        <div className="prop-section">
                            <label>Border Thickness (px)</label>
                            <input
                                type="number"
                                value={(element as any).borderWidth || 0}
                                onChange={(e) => updateElement(element.id, { borderWidth: parseInt(e.target.value, 10) } as any)}
                            />
                        </div>

                        <div className="prop-section">
                            <label>Border Style</label>
                            <select
                                value={(element as any).borderStyle || 'solid'}
                                onChange={(e) => updateElement(element.id, { borderStyle: e.target.value } as any)}
                            >
                                <option value="none">None</option>
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                            </select>
                        </div>

                        <div className="prop-section">
                            <label>Border Color</label>
                            <input
                                type="color"
                                value={(element as any).borderColor || '#000000'}
                                onChange={(e) => updateElement(element.id, { borderColor: e.target.value } as any)}
                            />
                        </div>

                        <div className="prop-section">
                            <label>Border Radius (px)</label>
                            <input
                                type="number"
                                value={(element as any).borderRadius || 0}
                                onChange={(e) => updateElement(element.id, { borderRadius: parseInt(e.target.value, 10) } as any)}
                            />
                        </div>
                    </>
                )}

                {(element.type === 'client-info' || element.type === 'business-info' || element.type === 'signature') && (
                    <>
                        <div className="prop-section border-top">
                            <label className="section-label">Heading Typography</label>

                            <div className="prop-group">
                                <span>Heading Text</span>
                                <input
                                    type="text"
                                    value={(element as any).headingValue || ''}
                                    onChange={(e) => updateElement(element.id, { headingValue: e.target.value } as any)}
                                    placeholder="e.g. BILL TO, FROM..."
                                />
                            </div>

                            <div className="prop-grid">
                                <div className="prop-group">
                                    <span>Font Size</span>
                                    <input
                                        type="number"
                                        value={(element as any).headingStyle?.fontSize || 10}
                                        onChange={(e) => updateElement(element.id, {
                                            headingStyle: { ...((element as any).headingStyle || {}), fontSize: parseInt(e.target.value, 10) }
                                        } as any)}
                                    />
                                </div>
                                <div className="prop-group">
                                    <span>Color</span>
                                    <input
                                        type="color"
                                        value={(element as any).headingStyle?.color || '#64748b'}
                                        onChange={(e) => updateElement(element.id, {
                                            headingStyle: { ...((element as any).headingStyle || {}), color: e.target.value }
                                        } as any)}
                                    />
                                </div>
                            </div>

                            <div className="checkbox-row">
                                <input
                                    type="checkbox"
                                    id="boldHeading"
                                    checked={(element as any).headingStyle?.fontWeight === 'bold'}
                                    onChange={(e) => updateElement(element.id, {
                                        headingStyle: { ...((element as any).headingStyle || {}), fontWeight: e.target.checked ? 'bold' : 'normal' }
                                    } as any)}
                                />
                                <label htmlFor="boldHeading">Bold Heading</label>
                            </div>
                        </div>

                        <div className="prop-section">
                            <label>Content (Optional Override)</label>
                            <textarea
                                value={(element as any).content || ''}
                                onChange={(e) => updateElement(element.id, { content: e.target.value } as any)}
                                rows={6}
                                placeholder="Leave empty for default..."
                            />
                        </div>

                        <div className="prop-grid">
                            <div className="prop-group">
                                <span>Font Size (pt)</span>
                                <input
                                    type="number"
                                    value={element.style.fontSize || 11}
                                    onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value, 10))}
                                />
                            </div>
                            <div className="prop-group">
                                <span>Text Color</span>
                                <input
                                    type="color"
                                    value={element.style.color || '#000000'}
                                    onChange={(e) => handleStyleChange('color', e.target.value)}
                                />
                            </div>
                        </div>

                        {element.type === 'client-info' && (
                            <div className="branding-section border-top">
                                <div className="checkbox-row">
                                    <input
                                        type="checkbox"
                                        id="showLeftBorder"
                                        checked={(element as any).showLeftBorder}
                                        onChange={(e) => updateElement(element.id, { showLeftBorder: e.target.checked } as any)}
                                    />
                                    <label htmlFor="showLeftBorder">Show Left Border</label>
                                </div>

                                {(element as any).showLeftBorder && (
                                    <div className="prop-grid" style={{ marginTop: '12px' }}>
                                        <div className="prop-group">
                                            <span>Thickness (px)</span>
                                            <input
                                                type="number"
                                                value={(element as any).borderWidth || 3}
                                                onChange={(e) => updateElement(element.id, { borderWidth: parseInt(e.target.value, 10) } as any)}
                                            />
                                        </div>
                                        <div className="prop-group">
                                            <span>Border Color</span>
                                            <input
                                                type="color"
                                                value={(element as any).borderColor || '#3b82f6'}
                                                onChange={(e) => updateElement(element.id, { borderColor: e.target.value } as any)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {(element.type === 'heading' || element.type === 'paragraph' || element.type === 'divider' || element.type === 'image' || element.type === 'table') && (
                    <div className="prop-section">
                        <label>Alignment</label>
                        <div className="alignment-toggle">
                            {(['left', 'center', 'right', 'justify'] as Alignment[]).map((align) => (
                                <button
                                    key={align}
                                    className={element.style.alignment === align ? 'active' : ''}
                                    onClick={() => handleStyleChange('alignment', align)}
                                >
                                    {align[0].toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                )}


                {(element.type === 'heading' || element.type === 'paragraph') && (
                    <div className="prop-section">
                        <label>Color</label>
                        <input
                            type="color"
                            value={element.style.color || '#000000'}
                            onChange={(e) => handleStyleChange('color', e.target.value)}
                        />
                    </div>
                )}

                {element.type === 'table' && (
                    <>
                        <div className="checkbox-row">
                            <input
                                type="checkbox"
                                id="headerRow"
                                checked={(element as any).headerRow}
                                onChange={(e) => updateElement(element.id, { headerRow: e.target.checked } as any)}
                            />
                            <label htmlFor="headerRow">Has Header Row</label>
                        </div>

                        {(element as any).headerRow && (
                            <div className="prop-section">
                                <label>Header Color</label>
                                <input
                                    type="color"
                                    value={(element as any).headerColor || '#f8fafc'}
                                    onChange={(e) => updateElement(element.id, { headerColor: e.target.value } as any)}
                                />
                            </div>
                        )}

                        <div className="prop-section">
                            <label>Border Thickness (px)</label>
                            <input
                                type="number"
                                value={(element as any).borderWidth ?? 1}
                                onChange={(e) => updateElement(element.id, { borderWidth: parseInt(e.target.value, 10) } as any)}
                            />
                        </div>

                        <div className="prop-section">
                            <label>Border Color</label>
                            <input
                                type="color"
                                value={(element as any).borderColor || '#e2e8f0'}
                                onChange={(e) => updateElement(element.id, { borderColor: e.target.value } as any)}
                            />
                        </div>

                        <div className="prop-section">
                            <label>Cell Padding (px)</label>
                            <input
                                type="number"
                                value={(element as any).cellPadding ?? 5}
                                onChange={(e) => updateElement(element.id, { cellPadding: parseInt(e.target.value, 10) } as any)}
                            />
                        </div>

                        <div className="prop-section">
                            <label>Structure</label>
                            <div className="prop-grid">
                                <button
                                    className="secondary-btn"
                                    onClick={() => addTableRow(element.id)}
                                >
                                    + Add Row
                                </button>
                                <button
                                    className="secondary-btn"
                                    onClick={() => addTableColumn(element.id)}
                                >
                                    + Add Col
                                </button>
                            </div>
                        </div>
                    </>
                )}

                <button
                    className="delete-btn"
                    onClick={() => {
                        const { removeElement } = useEditorStore.getState();
                        removeElement(element.id);
                    }}
                >
                    Delete Block
                </button>
            </div>
        </div>
    );
};

export default PropertiesPanel;
