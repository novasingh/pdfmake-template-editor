import React from 'react';
import { ABNFieldElement } from '../../types/editor';

interface ABNPropertiesProps {
    element: ABNFieldElement;
    onUpdate: (updates: Partial<ABNFieldElement>) => void;
    onStyleChange: (key: string, value: any) => void;
}

const ABNProperties: React.FC<ABNPropertiesProps> = ({ element, onUpdate, onStyleChange }) => {
    const handleMarginChange = (index: number, value: string) => {
        const margins = [...(element.style.margin || [0, 0, 0, 0])];
        margins[index] = parseInt(value, 10) || 0;
        onStyleChange('margin', margins);
    };

    return (
        <div className="prop-section">
            <div className="prop-group">
                <label>ABN Value</label>
                <input
                    type="text"
                    value={element.abnValue || ''}
                    onChange={(e) => onUpdate({ abnValue: e.target.value })}
                    placeholder="00 000 000 000"
                />
            </div>

            <div className="prop-group">
                <label>Label</label>
                <input
                    type="text"
                    value={element.label || ''}
                    onChange={(e) => onUpdate({ label: e.target.value })}
                />
            </div>

            <div className="prop-group">
                <label>Format</label>
                <select
                    value={element.format || 'XX XXX XXX XXX'}
                    onChange={(e) => onUpdate({ format: e.target.value as any })}
                >
                    <option value="XX XXX XXX XXX">XX XXX XXX XXX</option>
                    <option value="XXXXXXXXXXX">XXXXXXXXXXX</option>
                </select>
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
                        value={element.style.fontSize || 12}
                        onChange={(e) => onStyleChange('fontSize', parseInt(e.target.value))}
                    />
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

            {/* Spacing & Layout */}
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
        </div>
    );
};

export default ABNProperties;
