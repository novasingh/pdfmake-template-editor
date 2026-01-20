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

            <div className="prop-group border-top">
                <label className="section-label">Spacing & Layout</label>
                <div className="spacing-grid">
                    <div>
                        <span>Top</span>
                        <input
                            type="number"
                            value={element.style.margin?.[1] || 0}
                            onChange={(e) => handleMarginChange(1, e.target.value)}
                        />
                    </div>
                    <div>
                        <span>Bottom</span>
                        <input
                            type="number"
                            value={element.style.margin?.[3] || 0}
                            onChange={(e) => handleMarginChange(3, e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ABNProperties;
