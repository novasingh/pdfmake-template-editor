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
                        value={element.bsb || ''}
                        onChange={(e) => onUpdate({ bsb: e.target.value })}
                        placeholder="000-000"
                    />
                </div>
                <div className="prop-group">
                    <label>Account Number</label>
                    <input
                        type="text"
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
                <label className="section-label">Colors & Border</label>
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
            </div>

            <div className="prop-group border-top">
                <label className="section-label">Spacing & Layout</label>
                <div className="spacing-grid">
                    <div>
                        <span>Margin Top</span>
                        <input
                            type="number"
                            value={element.style.margin?.[1] || 0}
                            onChange={(e) => handleMarginChange(1, e.target.value)}
                        />
                    </div>
                    <div>
                        <span>Margin Bottom</span>
                        <input
                            type="number"
                            value={element.style.margin?.[3] || 0}
                            onChange={(e) => handleMarginChange(3, e.target.value)}
                        />
                    </div>
                    <div>
                        <span>Padding (All)</span>
                        <input
                            type="number"
                            value={element.style.padding?.[0] || 0}
                            onChange={(e) => onStyleChange('padding', [parseInt(e.target.value), parseInt(e.target.value), parseInt(e.target.value), parseInt(e.target.value)])}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankDetailsProperties;
