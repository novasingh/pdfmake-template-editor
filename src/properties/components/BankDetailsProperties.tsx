import React from 'react';
import { BankDetailsElement } from '../../types/editor';

interface BankDetailsPropertiesProps {
    element: BankDetailsElement;
    onUpdate: (updates: Partial<BankDetailsElement>) => void;
    onStyleChange: (key: string, value: any) => void;
}

const BankDetailsProperties: React.FC<BankDetailsPropertiesProps> = ({ element, onUpdate, onStyleChange }) => {
    const handleMarginChange = (index: number, value: string) => {
        const margins = [...(element.style.margin || [0, 0, 0, 0])];
        margins[index] = parseInt(value, 10) || 0;
        onStyleChange('margin', margins);
    };

    const handlePaddingChange = (index: number, value: string) => {
        const padding = [...(element.style.padding || [0, 0, 0, 0])];
        padding[index] = parseInt(value, 10) || 0;
        onStyleChange('padding', padding);
    };

    return (
        <div className="prop-section">
            <div className="prop-group">
                <label>Bank Name</label>
                <input
                    type="text"
                    value={element.bankName || ''}
                    onChange={(e) => onUpdate({ bankName: e.target.value })}
                />
            </div>

            <div className="prop-group">
                <label>Account Name</label>
                <input
                    type="text"
                    value={element.accountName || ''}
                    onChange={(e) => onUpdate({ accountName: e.target.value })}
                />
            </div>

            <div className="prop-grid">
                <div className="prop-group">
                    <label>BSB</label>
                    <input
                        type="text"
                        className="secure-input"
                        value={element.bsb || ''}
                        onChange={(e) => onUpdate({ bsb: e.target.value })}
                        placeholder="000-000"
                    />
                </div>
                <div className="prop-group">
                    <label>Account Number</label>
                    <input
                        type="text"
                        className="secure-input"
                        value={element.accountNumber || ''}
                        onChange={(e) => onUpdate({ accountNumber: e.target.value })}
                    />
                </div>
            </div>

            <div className="prop-grid">
                <div className="prop-group">
                    <label>Alignment</label>
                    <select
                        value={element.style.alignment || 'left'}
                        onChange={(e) => onStyleChange('alignment', e.target.value)}
                    >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>
                <div className="prop-group">
                    <label>Font Size</label>
                    <input
                        type="number"
                        value={element.style.fontSize || 11}
                        onChange={(e) => onStyleChange('fontSize', parseInt(e.target.value))}
                    />
                </div>
            </div>

            <div className="prop-section border-top">
                <label className="section-label">Colors & Styling</label>
                <div className="prop-grid">
                    <div className="prop-group">
                        <label>Text Color</label>
                        <input
                            type="color"
                            value={element.style.color || '#475569'}
                            onChange={(e) => onStyleChange('color', e.target.value)}
                        />
                    </div>
                    <div className="prop-group">
                        <label>Background</label>
                        <input
                            type="color"
                            value={element.style.background || '#f8fafc'}
                            onChange={(e) => onStyleChange('background', e.target.value)}
                        />
                    </div>
                </div>
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
        </div>
    );
};

export default BankDetailsProperties;
