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
                <label className="section-label">Spacing & Layout</label>
                <div className="prop-group">
                    <span>Margin (Top/Bottom)</span>
                    <div className="prop-grid">
                        <input
                            type="number"
                            placeholder="Top"
                            value={element.style.margin?.[1] ?? 0}
                            onChange={(e) => {
                                const m = element.style.margin || [0, 0, 0, 0];
                                onStyleChange('margin', [m[0], parseInt(e.target.value, 10), m[2], m[3]]);
                            }}
                        />
                        <input
                            type="number"
                            placeholder="Bottom"
                            value={element.style.margin?.[3] ?? 0}
                            onChange={(e) => {
                                const m = element.style.margin || [0, 0, 0, 0];
                                onStyleChange('margin', [m[0], m[1], m[2], parseInt(e.target.value, 10)]);
                            }}
                        />
                    </div>
                </div>

                <div className="prop-group">
                    <span>Padding (All sides)</span>
                    <input
                        type="number"
                        value={element.style.padding?.[0] ?? 0}
                        onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            onStyleChange('padding', [val, val, val, val]);
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default TextProperties;
