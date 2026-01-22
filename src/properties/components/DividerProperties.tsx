import React from 'react';
import { EditorElement, Alignment } from '../../types/editor';

interface DividerPropertiesProps {
    element: EditorElement;
    onUpdate: (updates: Partial<EditorElement>) => void;
    onStyleChange: (key: string, value: any) => void;
}

const DividerProperties: React.FC<DividerPropertiesProps> = ({ element, onUpdate, onStyleChange }) => {
    return (
        <>
            <div className="prop-section">
                <label>Thickness (px)</label>
                <input
                    type="number"
                    value={(element as any).thickness || 1}
                    onChange={(e) => onUpdate({ thickness: parseInt(e.target.value, 10) } as any)}
                />
            </div>

            <div className="prop-section">
                <label>Width (%)</label>
                <input
                    type="text"
                    value={(element as any).width || '100%'}
                    onChange={(e) => onUpdate({ width: e.target.value } as any)}
                />
            </div>

            <div className="prop-section">
                <label>Line Style</label>
                <select
                    value={(element as any).lineStyle || 'solid'}
                    onChange={(e) => onUpdate({ lineStyle: e.target.value } as any)}
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
                    onChange={(e) => onUpdate({ color: e.target.value } as any)}
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

export default DividerProperties;
