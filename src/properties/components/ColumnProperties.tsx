import React, { useState, useEffect } from 'react';
import { ColumnsElement, Column, Alignment } from '../../types/editor';

interface ColumnPropertiesProps {
    element: ColumnsElement;
    onUpdate: (updates: Partial<ColumnsElement>) => void;
    onStyleChange: (key: string, value: any) => void;
}

const ColumnProperties: React.FC<ColumnPropertiesProps> = ({ element, onUpdate, onStyleChange }) => {
    const [equalWidth, setEqualWidth] = useState(true);

    // Detect if all columns have equal width on mount
    useEffect(() => {
        if (element.columns.length > 0) {
            const firstWidth = element.columns[0].width;
            const allEqual = element.columns.every(col => col.width === firstWidth);
            setEqualWidth(allEqual);
        }
    }, [element.id]);

    const columnCount = element.columns.length;

    const handleColumnCountChange = (newCount: number) => {
        if (newCount < 1 || newCount > 6) return;

        const currentCount = element.columns.length;
        let newColumns: Column[] = [...element.columns];

        if (newCount > currentCount) {
            // Add new columns
            const widthPercent = equalWidth ? `${(100 / newCount).toFixed(2)}%` : '100px';
            for (let i = currentCount; i < newCount; i++) {
                newColumns.push({ width: widthPercent, content: [] });
            }
            // Redistribute widths if equal
            if (equalWidth) {
                newColumns = newColumns.map(col => ({
                    ...col,
                    width: `${(100 / newCount).toFixed(2)}%`
                }));
            }
        } else {
            // Remove columns from the end
            newColumns = newColumns.slice(0, newCount);
            // Redistribute widths if equal
            if (equalWidth) {
                newColumns = newColumns.map(col => ({
                    ...col,
                    width: `${(100 / newCount).toFixed(2)}%`
                }));
            }
        }

        onUpdate({ columns: newColumns });
    };

    const handleEqualWidthToggle = (checked: boolean) => {
        setEqualWidth(checked);
        if (checked) {
            // Distribute width equally
            const equalWidthValue = `${(100 / columnCount).toFixed(2)}%`;
            const newColumns = element.columns.map(col => ({
                ...col,
                width: equalWidthValue
            }));
            onUpdate({ columns: newColumns });
        }
    };

    const handleIndividualWidthChange = (index: number, value: string) => {
        const newColumns = element.columns.map((col, i) => {
            if (i === index) {
                return { ...col, width: value };
            }
            return col;
        });
        onUpdate({ columns: newColumns });
    };

    const handleEqualWidthValueChange = (value: string) => {
        const newColumns = element.columns.map(col => ({
            ...col,
            width: `${(100 / columnCount).toFixed(2)}%`
        }));
        onUpdate({ columns: newColumns });
    };

    return (
        <>
            {/* Column Count */}
            <div className="prop-section">
                <label>Number of Columns</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="number"
                        min={1}
                        max={6}
                        value={columnCount}
                        onChange={(e) => handleColumnCountChange(parseInt(e.target.value, 10) || 2)}
                        style={{ width: '80px' }}
                    />
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                        (1-6 columns)
                    </span>
                </div>
            </div>

            {/* Equal Width Toggle */}
            <div className="prop-section">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        checked={equalWidth}
                        onChange={(e) => handleEqualWidthToggle(e.target.checked)}
                    />
                    Equal width for all columns
                </label>
            </div>

            {/* Width Configuration */}
            <div className="prop-section">
                <label>Column Widths</label>
                {equalWidth ? (
                    <div style={{ padding: '8px', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                            Each column: {(100 / columnCount).toFixed(1)}%
                        </span>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {element.columns.map((col, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '12px', color: '#64748b', width: '70px' }}>
                                    Column {idx + 1}:
                                </span>
                                <input
                                    type="text"
                                    value={col.width}
                                    onChange={(e) => handleIndividualWidthChange(idx, e.target.value)}
                                    placeholder="e.g., 50% or 200px"
                                    style={{ flex: 1 }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Gap Between Columns */}
            <div className="prop-section">
                <label>Column Gap (px)</label>
                <input
                    type="number"
                    min={0}
                    max={100}
                    value={element.columnGap ?? 10}
                    onChange={(e) => onUpdate({ columnGap: parseInt(e.target.value, 10) || 0 })}
                />
            </div>

            {/* Margin */}
            <div className="prop-section">
                <label>Margin (px)</label>
                <div className="spacing-grid">
                    <div>
                        <span>Top</span>
                        <input
                            type="number"
                            value={element.style.margin?.[1] ?? 0}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                const current = element.style.margin || [0, 0, 0, 0];
                                onStyleChange('margin', [current[0], val, current[2], current[3]]);
                            }}
                        />
                    </div>
                    <div>
                        <span>Right</span>
                        <input
                            type="number"
                            value={element.style.margin?.[2] ?? 0}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                const current = element.style.margin || [0, 0, 0, 0];
                                onStyleChange('margin', [current[0], current[1], val, current[3]]);
                            }}
                        />
                    </div>
                    <div>
                        <span>Bottom</span>
                        <input
                            type="number"
                            value={element.style.margin?.[3] ?? 0}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                const current = element.style.margin || [0, 0, 0, 0];
                                onStyleChange('margin', [current[0], current[1], current[2], val]);
                            }}
                        />
                    </div>
                    <div>
                        <span>Left</span>
                        <input
                            type="number"
                            value={element.style.margin?.[0] ?? 0}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                const current = element.style.margin || [0, 0, 0, 0];
                                onStyleChange('margin', [val, current[1], current[2], current[3]]);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Padding */}
            <div className="prop-section">
                <label>Padding (px)</label>
                <div className="spacing-grid">
                    <div>
                        <span>Top</span>
                        <input
                            type="number"
                            value={element.style.padding?.[1] ?? 0}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                const current = element.style.padding || [0, 0, 0, 0];
                                onStyleChange('padding', [current[0], val, current[2], current[3]]);
                            }}
                        />
                    </div>
                    <div>
                        <span>Right</span>
                        <input
                            type="number"
                            value={element.style.padding?.[2] ?? 0}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                const current = element.style.padding || [0, 0, 0, 0];
                                onStyleChange('padding', [current[0], current[1], val, current[3]]);
                            }}
                        />
                    </div>
                    <div>
                        <span>Bottom</span>
                        <input
                            type="number"
                            value={element.style.padding?.[3] ?? 0}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                const current = element.style.padding || [0, 0, 0, 0];
                                onStyleChange('padding', [current[0], current[1], current[2], val]);
                            }}
                        />
                    </div>
                    <div>
                        <span>Left</span>
                        <input
                            type="number"
                            value={element.style.padding?.[0] ?? 0}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                const current = element.style.padding || [0, 0, 0, 0];
                                onStyleChange('padding', [val, current[1], current[2], current[3]]);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Border Width */}
            <div className="prop-section">
                <label>Border Width (px)</label>
                <input
                    type="number"
                    min={0}
                    max={20}
                    value={element.borderWidth ?? 0}
                    onChange={(e) => onUpdate({ borderWidth: parseInt(e.target.value, 10) || 0 })}
                />
            </div>

            {/* Border Color */}
            <div className="prop-section">
                <label>Border Color</label>
                <input
                    type="color"
                    value={element.borderColor ?? '#e2e8f0'}
                    onChange={(e) => onUpdate({ borderColor: e.target.value })}
                />
            </div>

            {/* Border Style */}
            <div className="prop-section">
                <label>Border Style</label>
                <select
                    value={element.borderStyle ?? 'solid'}
                    onChange={(e) => onUpdate({ borderStyle: e.target.value as 'solid' | 'dashed' | 'dotted' })}
                >
                    <option value="none">None</option>
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                </select>
            </div>

            {/* Border Radius */}
            <div className="prop-section">
                <label>Border Radius (px)</label>
                <input
                    type="number"
                    min={0}
                    max={50}
                    value={element.borderRadius ?? 0}
                    onChange={(e) => onUpdate({ borderRadius: parseInt(e.target.value, 10) || 0 })}
                />
            </div>

            {/* Background Color */}
            <div className="prop-section">
                <label>Background Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="color"
                        value={element.backgroundColor ?? '#ffffff'}
                        onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                    />
                    <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                            type="checkbox"
                            checked={!element.backgroundColor || element.backgroundColor === 'transparent'}
                            onChange={(e) => onUpdate({ backgroundColor: e.target.checked ? 'transparent' : '#ffffff' })}
                        />
                        Transparent
                    </label>
                </div>
            </div>

            {/* Alignment */}
            <div className="prop-section">
                <label>Vertical Alignment</label>
                <select
                    value={element.verticalAlign ?? 'top'}
                    onChange={(e) => onUpdate({ verticalAlign: e.target.value as 'top' | 'middle' | 'bottom' })}
                >
                    <option value="top">Top</option>
                    <option value="middle">Middle</option>
                    <option value="bottom">Bottom</option>
                </select>
            </div>

            {/* Content Alignment */}
            <div className="prop-section">
                <label>Content Alignment</label>
                <div className="alignment-toggle">
                    {(['left', 'center', 'right'] as Alignment[]).map((align) => (
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

            {/* Show Column Borders */}
            <div className="prop-section">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        checked={element.showColumnBorders ?? false}
                        onChange={(e) => onUpdate({ showColumnBorders: e.target.checked })}
                    />
                    Show individual column borders
                </label>
            </div>

            {element.showColumnBorders && (
                <>
                    <div className="prop-section">
                        <label>Column Border Width (px)</label>
                        <input
                            type="number"
                            min={0}
                            max={10}
                            value={element.columnBorderWidth ?? 1}
                            onChange={(e) => onUpdate({ columnBorderWidth: parseInt(e.target.value, 10) || 0 })}
                        />
                    </div>
                    <div className="prop-section">
                        <label>Column Border Color</label>
                        <input
                            type="color"
                            value={element.columnBorderColor ?? '#e2e8f0'}
                            onChange={(e) => onUpdate({ columnBorderColor: e.target.value })}
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default ColumnProperties;
