import React from 'react';
import { EditorElement, Alignment } from '../../types/editor';

interface ImagePropertiesProps {
    element: EditorElement;
    onUpdate: (updates: Partial<EditorElement>) => void;
    onStyleChange: (key: string, value: any) => void;
}

const ImageProperties: React.FC<ImagePropertiesProps> = ({ element, onUpdate, onStyleChange }) => {
    return (
        <>
            <div className="prop-section">
                <label>Image Source (URL or Base64)</label>
                <textarea
                    value={(element as any).src || ''}
                    onChange={(e) => onUpdate({ src: e.target.value } as any)}
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
                        onChange={(e) => onUpdate({ width: e.target.value } as any)}
                        placeholder="e.g. 200, 50%"
                    />
                </div>
                <div className="prop-group">
                    <span>Height</span>
                    <input
                        type="text"
                        value={(element as any).height || ''}
                        onChange={(e) => onUpdate({ height: e.target.value } as any)}
                        placeholder="e.g. 100"
                    />
                </div>
            </div>

            <div className="prop-section">
                <label>Border Thickness (px)</label>
                <input
                    type="number"
                    value={(element as any).borderWidth || 0}
                    onChange={(e) => onUpdate({ borderWidth: parseInt(e.target.value, 10) } as any)}
                />
            </div>

            <div className="prop-section">
                <label>Border Style</label>
                <select
                    value={(element as any).borderStyle || 'solid'}
                    onChange={(e) => onUpdate({ borderStyle: e.target.value } as any)}
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
                    onChange={(e) => onUpdate({ borderColor: e.target.value } as any)}
                />
            </div>

            <div className="prop-section">
                <label>Border Radius (px)</label>
                <input
                    type="number"
                    value={(element as any).borderRadius || 0}
                    onChange={(e) => onUpdate({ borderRadius: parseInt(e.target.value, 10) } as any)}
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

export default ImageProperties;
