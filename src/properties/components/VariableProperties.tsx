import React from 'react';
import { VariableElement } from '../../types/editor';

interface VariablePropertiesProps {
    element: VariableElement;
    onUpdate: (updates: Partial<VariableElement>) => void;
    onStyleChange: (key: string, value: any) => void;
}

const PREDEFINED_VARIABLES = [
    { label: 'Customer Name', value: 'customerName' },
    { label: 'Customer Address', value: 'customerAddress' },
    { label: 'Company Name', value: 'companyName' },
    { label: 'Company ABN', value: 'companyABN' },
    { label: 'Invoice Number', value: 'invoiceNumber' },
    { label: 'Invoice Date', value: 'invoiceDate' },
    { label: 'Due Date', value: 'dueDate' },
    { label: 'Total Amount', value: 'totalAmount' },
];

const VariableProperties: React.FC<VariablePropertiesProps> = ({ element, onUpdate, onStyleChange }) => {
    return (
        <>
            <div className="prop-section border-top">
                <label className="section-label">Variable Settings</label>

                <div className="prop-group">
                    <span>Label (Optional)</span>
                    <input
                        type="text"
                        value={element.label || ''}
                        onChange={(e) => onUpdate({ label: e.target.value })}
                        placeholder="e.g. Customer:"
                    />
                </div>

                <div className="prop-group">
                    <span>Variable Name</span>
                    <select
                        value={element.variableName || ''}
                        onChange={(e) => onUpdate({ variableName: e.target.value })}
                    >
                        <option value="">Select a variable...</option>
                        {PREDEFINED_VARIABLES.map((v) => (
                            <option key={v.value} value={v.value}>
                                {v.label} ({`{${v.value}}`})
                            </option>
                        ))}
                        <option value="custom">Custom Variable...</option>
                    </select>
                </div>

                {element.variableName === 'custom' && (
                    <div className="prop-group">
                        <span>Custom Variable Name</span>
                        <input
                            type="text"
                            value={element.variableName === 'custom' ? '' : element.variableName}
                            onChange={(e) => onUpdate({ variableName: e.target.value })}
                            placeholder="e.g. myCustomVar"
                        />
                    </div>
                )}

                <div className="prop-group">
                    <span>Placeholder</span>
                    <input
                        type="text"
                        value={element.placeholder || ''}
                        onChange={(e) => onUpdate({ placeholder: e.target.value })}
                        placeholder="e.g. [Add Name]"
                    />
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
                        id="boldVar"
                        checked={element.style.fontWeight === 'bold'}
                        onChange={(e) => onStyleChange('fontWeight', e.target.checked ? 'bold' : 'normal')}
                    />
                    <label htmlFor="boldVar">Bold Text</label>
                </div>
            </div>
        </>
    );
};

export default VariableProperties;
