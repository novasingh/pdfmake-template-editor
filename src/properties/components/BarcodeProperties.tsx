import React from 'react';
import { BarcodeElement } from '../../types/editor';

interface BarcodePropertiesProps {
    element: BarcodeElement;
    onUpdate: (updates: Partial<BarcodeElement>) => void;
    onStyleChange: (key: string, value: any) => void;
}

const BarcodeProperties: React.FC<BarcodePropertiesProps> = ({ element, onUpdate, onStyleChange }) => {
    return (
        <>
            <div className="prop-section border-top">
                <label className="section-label">Barcode Settings</label>

                <div className="prop-group">
                    <span>Data (Value)</span>
                    <input
                        type="text"
                        value={element.data || ''}
                        onChange={(e) => onUpdate({ data: e.target.value })}
                        placeholder="12345678"
                    />
                </div>

                <div className="prop-group">
                    <span>Barcode Type</span>
                    <select
                        value={element.barcodeType || 'Code128'}
                        onChange={(e) => onUpdate({ barcodeType: e.target.value as any })}
                    >
                        <option value="Code128">Code 128 (Standard)</option>
                        <option value="Code39">Code 39</option>
                        <option value="EAN13">EAN-13 (Retail)</option>
                        <option value="UPC">UPC</option>
                    </select>
                </div>

                <div className="prop-grid">
                    <div className="prop-group">
                        <span>Width (pt)</span>
                        <input
                            type="number"
                            value={element.width || 100}
                            onChange={(e) => onUpdate({ width: parseInt(e.target.value, 10) })}
                        />
                    </div>
                    <div className="prop-group">
                        <span>Height (pt)</span>
                        <input
                            type="number"
                            value={element.height || 40}
                            onChange={(e) => onUpdate({ height: parseInt(e.target.value, 10) })}
                        />
                    </div>
                </div>

                <div className="prop-group checkbox">
                    <input
                        type="checkbox"
                        checked={element.displayValue ?? true}
                        onChange={(e) => onUpdate({ displayValue: e.target.checked })}
                        id="show-barcode-val"
                    />
                    <label htmlFor="show-barcode-val">Display value text</label>
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

export default BarcodeProperties;
