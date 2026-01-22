import React from 'react';
import { QRCodeElement } from '../../types/editor';

interface QRCodePropertiesProps {
    element: QRCodeElement;
    onUpdate: (updates: Partial<QRCodeElement>) => void;
    onStyleChange: (key: string, value: any) => void;
}

const QRCodeProperties: React.FC<QRCodePropertiesProps> = ({ element, onUpdate, onStyleChange }) => {
    return (
        <>
            <div className="prop-section border-top">
                <label className="section-label">QR Code Settings</label>

                <div className="prop-group">
                    <span>Data (URL or Text)</span>
                    <textarea
                        value={element.data || ''}
                        onChange={(e) => onUpdate({ data: e.target.value })}
                        rows={3}
                        placeholder="https://example.com/pay"
                    />
                </div>

                <div className="prop-grid">
                    <div className="prop-group">
                        <span>Size (pt)</span>
                        <input
                            type="number"
                            value={element.size || 100}
                            onChange={(e) => onUpdate({ size: parseInt(e.target.value, 10) })}
                        />
                    </div>
                    <div className="prop-group">
                        <span>Error Correction</span>
                        <select
                            value={element.errorLevel || 'M'}
                            onChange={(e) => onUpdate({ errorLevel: e.target.value as any })}
                        >
                            <option value="L">L (7% recovery)</option>
                            <option value="M">M (15% recovery)</option>
                            <option value="Q">Q (25% recovery)</option>
                            <option value="H">H (30% recovery)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="prop-section border-top">
                <label className="section-label">Alignment</label>
                <div className="prop-group">
                    <select
                        value={element.style.alignment || 'left'}
                        onChange={(e) => onStyleChange('alignment', e.target.value)}
                    >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
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
            </div>
        </>
    );
};

export default QRCodeProperties;
