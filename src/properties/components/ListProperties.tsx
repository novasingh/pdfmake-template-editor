import React from 'react';
import { ListElement } from '../../types/editor';

interface ListPropertiesProps {
    element: ListElement;
    onUpdate: (updates: Partial<ListElement>) => void;
    onStyleChange: (key: string, value: any) => void;
}

const ListProperties: React.FC<ListPropertiesProps> = ({ element, onUpdate, onStyleChange }) => {
    const handleItemChange = (index: number, value: string) => {
        const newItems = [...element.items];
        newItems[index] = value;
        onUpdate({ items: newItems });
    };

    const addItem = () => {
        onUpdate({ items: [...element.items, 'New item'] });
    };

    const removeItem = (index: number) => {
        onUpdate({ items: element.items.filter((_, i) => i !== index) });
    };

    return (
        <>
            <div className="prop-section border-top">
                <label className="section-label">List Settings</label>

                <div className="prop-grid">
                    <div className="prop-group">
                        <span>List Type</span>
                        <select
                            value={element.listType || 'unordered'}
                            onChange={(e) => onUpdate({ listType: e.target.value as any })}
                        >
                            <option value="unordered">Unordered (Bullets)</option>
                            <option value="ordered">Ordered (Numbers)</option>
                        </select>
                    </div>
                    <div className="prop-group">
                        <span>Bullet Style</span>
                        <select
                            value={element.bulletStyle || (element.listType === 'ordered' ? 'number' : 'disc')}
                            onChange={(e) => onUpdate({ bulletStyle: e.target.value as any })}
                        >
                            {element.listType === 'unordered' ? (
                                <>
                                    <option value="disc">Disc (•)</option>
                                    <option value="circle">Circle (○)</option>
                                    <option value="square">Square (■)</option>
                                </>
                            ) : (
                                <>
                                    <option value="number">Number (1, 2, 3)</option>
                                    <option value="letter">Letter (a, b, c)</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>
            </div>

            <div className="prop-section border-top">
                <label className="section-label">List Items</label>
                <div className="list-items-editor">
                    {element.items.map((item, index) => (
                        <div key={index} className="list-item-row" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => handleItemChange(index, e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button
                                className="icon-btn delete"
                                onClick={() => removeItem(index)}
                                style={{ padding: '4px 8px', color: '#ef4444' }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        className="header-btn secondary"
                        onClick={addItem}
                        style={{ width: '100%', marginTop: '8px' }}
                    >
                        + Add Item
                    </button>
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
            </div>
        </>
    );
};

export default ListProperties;
