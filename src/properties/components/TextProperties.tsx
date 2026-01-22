import React from 'react';
import { EditorElement, FontWeight, Alignment } from '../../types/editor';

interface TextPropertiesProps {
    element: EditorElement;
    onUpdate: (updates: Partial<EditorElement>) => void;
    onStyleChange: (key: string, value: any) => void;
}

const TextProperties: React.FC<TextPropertiesProps> = ({ element, onUpdate, onStyleChange }) => {
    return (
        <>
            <div className="prop-section">
                <label>Content</label>
                <textarea
                    value={(element as any).content}
                    onChange={(e) => onUpdate({ content: e.target.value } as any)}
                    rows={3}
                />
            </div>

            <div className="prop-section">
                <label>Font Size (pt)</label>
                <input
                    type="number"
                    value={element.style.fontSize || 12}
                    onChange={(e) => onStyleChange('fontSize', parseInt(e.target.value, 10))}
                />
            </div>

            <div className="prop-section">
                <label>Font Weight</label>
                <select
                    value={element.style.fontWeight || 'normal'}
                    onChange={(e) => onStyleChange('fontWeight', e.target.value as FontWeight)}
                >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="600">Semibold</option>
                    <option value="700">Extra Bold</option>
                </select>
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
                <label>Color</label>
                <input
                    type="color"
                    value={element.style.color || '#000000'}
                    onChange={(e) => onStyleChange('color', e.target.value)}
                />
            </div>

            <div className="prop-section">
                <label>Data Role (Auto-calc)</label>
                <select
                    value={element.role || ''}
                    onChange={(e) => onUpdate({ role: e.target.value as any })}
                >
                    <option value="">None</option>
                    <option value="item-qty">Qty (Quantity)</option>
                    <option value="item-rate">Rate (Price)</option>
                    <option value="item-amount">Amount (Row Total)</option>
                    <option value="summary-subtotal">Summary: Subtotal</option>
                    <option value="summary-gst">Summary: GST (10%)</option>
                    <option value="summary-total">Summary: Total</option>
                </select>
            </div>

            <div className="prop-section border-top">
                <label className="section-label">Typography & Style</label>
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
                    <div className="prop-group">
                        <label>Line Height</label>
                        <input
                            type="number"
                            step="0.1"
                            value={element.style.lineHeight ?? 1}
                            onChange={(e) => onStyleChange('lineHeight', parseFloat(e.target.value))}
                        />
                    </div>
                </div>

                <div className="prop-grid">
                    <div className="prop-group">
                        <label>Decoration</label>
                        <select
                            value={element.style.decoration || 'none'}
                            onChange={(e) => onStyleChange('decoration', e.target.value)}
                        >
                            <option value="none">None</option>
                            <option value="underline">Underline</option>
                            <option value="lineThrough">Line Through</option>
                            <option value="overline">Overline</option>
                        </select>
                    </div>
                    <div className="prop-group">
                        <label>Char Spacing</label>
                        <input
                            type="number"
                            step="0.5"
                            value={element.style.characterSpacing ?? 0}
                            onChange={(e) => onStyleChange('characterSpacing', parseFloat(e.target.value))}
                        />
                    </div>
                </div>
            </div>

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

export default TextProperties;
