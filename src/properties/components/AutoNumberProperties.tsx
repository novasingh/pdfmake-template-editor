import React from 'react';
import { AutoNumberElement } from '../../types/editor';

interface AutoNumberPropertiesProps {
    element: AutoNumberElement;
    onUpdate: (updates: Partial<AutoNumberElement>) => void;
    onStyleChange: (key: string, value: any) => void;
}

const AutoNumberProperties: React.FC<AutoNumberPropertiesProps> = ({ element, onUpdate, onStyleChange }) => {
    return (
        <>
            <div className="prop-section border-top">
                <label className="section-label">Number Settings</label>

                <div className="prop-group">
                    <span>Label</span>
                    <input
                        type="text"
                        value={element.label || ''}
                        onChange={(e) => onUpdate({ label: e.target.value })}
                        placeholder="e.g. Invoice Number..."
                    />
                </div>

                <div className="prop-grid">
                    <div className="prop-group">
                        <span>Prefix</span>
                        <input
                            type="text"
                            value={element.prefix || ''}
                            onChange={(e) => onUpdate({ prefix: e.target.value })}
                            placeholder="e.g. INV-"
                        />
                    </div>
                    <div className="prop-group">
                        <span>Suffix</span>
                        <input
                            type="text"
                            value={element.suffix || ''}
                            onChange={(e) => onUpdate({ suffix: e.target.value })}
                            placeholder="e.g. /2024"
                        />
                    </div>
                </div>

                <div className="prop-grid">
                    <div className="prop-group">
                        <span>Start Value</span>
                        <input
                            type="number"
                            value={element.startValue || 1}
                            onChange={(e) => onUpdate({ startValue: parseInt(e.target.value, 10) })}
                        />
                    </div>
                    <div className="prop-group">
                        <span>Padding</span>
                        <input
                            type="number"
                            value={element.paddingDigits || 0}
                            onChange={(e) => onUpdate({ paddingDigits: parseInt(e.target.value, 10) })}
                            placeholder="e.g. 4 for 0001"
                        />
                    </div>
                </div>
            </div>

            <div className="prop-section border-top">
                <label className="section-label">Typography</label>
                <div className="prop-grid">
                    <div className="prop-group">
                        <span>Font Size (pt)</span>
                        <input
                            type="number"
                            value={element.style.fontSize || 11}
                            onChange={(e) => onStyleChange('fontSize', parseInt(e.target.value, 10))}
                        />
                    </div>
                    <div className="prop-group">
                        <span>Text Color</span>
                        <input
                            type="color"
                            value={element.style.color || '#000000'}
                            onChange={(e) => onStyleChange('color', e.target.value)}
                        />
                    </div>
                </div>

                <div className="checkbox-row">
                    <input
                        type="checkbox"
                        id="boldNum"
                        checked={element.style.fontWeight === 'bold'}
                        onChange={(e) => onStyleChange('fontWeight', e.target.checked ? 'bold' : 'normal')}
                    />
                    <label htmlFor="boldNum">Bold Text</label>
                </div>

                <div className="prop-group">
                    <span>Alignment</span>
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
        </>
    );
};

export default AutoNumberProperties;
