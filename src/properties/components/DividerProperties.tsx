import React from 'react';
import { EditorElement, Alignment } from '../../types/editor';

interface DividerPropertiesProps {
    element: EditorElement;
    onUpdate: (updates: Partial<EditorElement>) => void;
    onStyleChange: (key: string, value: any) => void;
}

const DividerProperties: React.FC<DividerPropertiesProps> = ({ element, onUpdate, onStyleChange }) => {
    return (
        <>
            <div className="prop-section">
                <label>Thickness (px)</label>
                <input
                    type="number"
                    value={(element as any).thickness || 1}
                    onChange={(e) => onUpdate({ thickness: parseInt(e.target.value, 10) } as any)}
                />
            </div>

            <div className="prop-section">
                <label>Width (%)</label>
                <input
                    type="text"
                    value={(element as any).width || '100%'}
                    onChange={(e) => onUpdate({ width: e.target.value } as any)}
                />
            </div>

            <div className="prop-section">
                <label>Line Style</label>
                <select
                    value={(element as any).lineStyle || 'solid'}
                    onChange={(e) => onUpdate({ lineStyle: e.target.value } as any)}
                >
                    <option value="solid">None</option>
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                </select>
            </div>

            <div className="prop-section">
                <label>Line Color</label>
                <input
                    type="color"
                    value={(element as any).color || '#e2e8f0'}
                    onChange={(e) => onUpdate({ color: e.target.value } as any)}
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
        </>
    );
};

export default DividerProperties;
