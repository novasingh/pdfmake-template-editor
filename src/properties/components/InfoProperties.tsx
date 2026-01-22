import React from 'react';
import { EditorElement } from '../../types/editor';

interface InfoPropertiesProps {
    element: EditorElement;
    onUpdate: (updates: Partial<EditorElement>) => void;
    onStyleChange: (key: string, value: any) => void;
}

const InfoProperties: React.FC<InfoPropertiesProps> = ({ element, onUpdate, onStyleChange }) => {
    return (
        <>
            <div className="prop-section border-top">
                <label className="section-label">Heading Typography</label>

                <div className="prop-group">
                    <span>Heading Text</span>
                    <input
                        type="text"
                        value={(element as any).headingValue || ''}
                        onChange={(e) => onUpdate({ headingValue: e.target.value } as any)}
                        placeholder="e.g. BILL TO, FROM..."
                    />
                </div>

                <div className="prop-grid">
                    <div className="prop-group">
                        <span>Font Size</span>
                        <input
                            type="number"
                            value={(element as any).headingStyle?.fontSize || 10}
                            onChange={(e) => onUpdate({
                                headingStyle: { ...((element as any).headingStyle || {}), fontSize: parseInt(e.target.value, 10) }
                            } as any)}
                        />
                    </div>
                    <div className="prop-group">
                        <span>Color</span>
                        <input
                            type="color"
                            value={(element as any).headingStyle?.color || '#64748b'}
                            onChange={(e) => onUpdate({
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
                        onChange={(e) => onUpdate({
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
                    onChange={(e) => onUpdate({ content: e.target.value } as any)}
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
                        onChange={(e) => onStyleChange('fontSize', parseInt(e.target.value, 10))}
                    />
                </div>
                <div className="prop-group">
                    <span>Text Color</span>
                    <input
                        type="color"
                        value={element.style.color || '#000000'}
                        onChange={(e) => onStyleChange('color', e.target.value)}
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
                            onChange={(e) => onUpdate({ showLeftBorder: e.target.checked } as any)}
                        />
                        <label htmlFor="showLeftBorder">Show Left Border</label>
                    </div>

                    {(element as any).showLeftBorder && (
                        <div style={{ marginTop: '12px' }}>
                            <div className="prop-grid">
                                <div className="prop-group">
                                    <span>Thickness (pt)</span>
                                    <input
                                        type="number"
                                        value={(element as any).borderWidth || 3}
                                        onChange={(e) => onUpdate({ borderWidth: parseInt(e.target.value, 10) } as any)}
                                    />
                                </div>
                                <div className="prop-group">
                                    <span>Border Color</span>
                                    <input
                                        type="color"
                                        value={(element as any).borderColor || '#3b82f6'}
                                        onChange={(e) => onUpdate({ borderColor: e.target.value } as any)}
                                    />
                                </div>
                            </div>
                            <div className="prop-group" style={{ marginTop: '12px' }}>
                                <span>Internal Spacing (pt)</span>
                                <input
                                    type="number"
                                    value={(element as any).borderPadding ?? 10}
                                    onChange={(e) => onUpdate({ borderPadding: parseInt(e.target.value, 10) } as any)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
            {/* Styling */}
            <div className="prop-section border-top">
                <label className="section-label">Styling</label>
                <div className="prop-grid">
                    <div className="prop-group">
                        <label>Opacity</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="1"
                            value={element.style.opacity ?? 1}
                            onChange={(e) => onStyleChange('opacity', parseFloat(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            {/* Margin & Padding */}
            <div className="prop-section border-top">
                <label className="section-label">Spacing & Layout</label>
                <div className="prop-group">
                    <label>Margin (px)</label>
                    <div className="prop-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {[0, 1, 2, 3].map((idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontSize: '9px', width: '12px', color: 'var(--text-rich-muted)' }}>
                                    {['L', 'T', 'R', 'B'][idx]}
                                </span>
                                <input
                                    type="number"
                                    value={element.style.margin?.[idx] ?? 0}
                                    onChange={(e) => {
                                        const m = [...(element.style.margin || [0, 0, 0, 0])];
                                        m[idx] = parseInt(e.target.value, 10) || 0;
                                        onStyleChange('margin', m);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="prop-group">
                    <label>Padding (px)</label>
                    <div className="prop-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {[0, 1, 2, 3].map((idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontSize: '9px', width: '12px', color: 'var(--text-rich-muted)' }}>
                                    {['L', 'T', 'R', 'B'][idx]}
                                </span>
                                <input
                                    type="number"
                                    value={element.style.padding?.[idx] ?? 0}
                                    onChange={(e) => {
                                        const p = [...(element.style.padding || [0, 0, 0, 0])];
                                        p[idx] = parseInt(e.target.value, 10) || 0;
                                        onStyleChange('padding', p);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default InfoProperties;
