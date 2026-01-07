import React from 'react';
import { EditorElement, FontWeight, Alignment } from '../../types/editor';

interface TextPropertiesProps {
    element: EditorElement;
    onUpdate: (updates: Partial<EditorElement>) => void;
    onStyleChange: (key: string, value: any) => void;
}

const TextProperties: React.FC<TextPropertiesProps> = ({ element, onUpdate, onStyleChange }) => {
    return (
        <>
            <div className="prop-section">
                <label>Content</label>
                <textarea
                    value={(element as any).content}
                    onChange={(e) => onUpdate({ content: e.target.value } as any)}
                    rows={3}
                />
            </div>

            <div className="prop-section">
                <label>Font Size (pt)</label>
                <input
                    type="number"
                    value={element.style.fontSize || 12}
                    onChange={(e) => onStyleChange('fontSize', parseInt(e.target.value, 10))}
                />
            </div>

            <div className="prop-section">
                <label>Font Weight</label>
                <select
                    value={element.style.fontWeight || 'normal'}
                    onChange={(e) => onStyleChange('fontWeight', e.target.value as FontWeight)}
                >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="600">Semibold</option>
                    <option value="700">Extra Bold</option>
                </select>
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

            <div className="prop-section">
                <label>Color</label>
                <input
                    type="color"
                    value={element.style.color || '#000000'}
                    onChange={(e) => onStyleChange('color', e.target.value)}
                />
            </div>
        </>
    );
};

export default TextProperties;
