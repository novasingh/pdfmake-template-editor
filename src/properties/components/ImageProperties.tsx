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

export default ImageProperties;
