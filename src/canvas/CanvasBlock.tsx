import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditorElement, ColumnsElement } from '../types/editor';
import { useEditorStore } from '../store/useEditorStore';
import '../styles/CanvasBlock.css';
const ColumnContainer = React.lazy(() => import('./ColumnContainer'));
const TableContainer = React.lazy(() => import('./TableContainer'));

interface CanvasBlockProps {
    element: EditorElement;
}

const CanvasBlock: React.FC<CanvasBlockProps> = ({ element }) => {
    const {
        selectedElementId,
        selectElement,
        updateElement,
        removeElement,
        cloneElement
    } = useEditorStore();
    const [isEditing, setIsEditing] = React.useState(false);
    const [editValue, setEditValue] = React.useState('');

    // All hooks must be called before any conditional returns
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: element?.id ?? 'placeholder',
        disabled: isEditing || !element
    });

    // Early return after all hooks are called
    if (!element) return null;

    const isSelected = selectedElementId === element.id;

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        marginBottom: '8px',
        cursor: isEditing ? 'text' : 'pointer',
        position: 'relative',
        ...element.style as any,
        textAlign: (element.style as any).alignment,
        fontSize: element.style.fontSize ? `${element.style.fontSize}pt` : undefined,
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectElement(element.id);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        if (element.type === 'heading' || element.type === 'paragraph') {
            e.stopPropagation();
            setIsEditing(true);
            setEditValue((element as any).content || '');
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        updateElement(element.id, { content: editValue } as any);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && element.type === 'heading') {
            handleBlur();
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

    const renderContent = () => {
        const type = element.type as string;

        if (isEditing) {
            const inputStyle: React.CSSProperties = {
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                font: 'inherit',
                color: 'inherit',
                textAlign: 'inherit',
                fontWeight: 'inherit',
                resize: 'none',
                padding: 0,
                margin: 0,
            };

            return (
                <textarea
                    autoFocus
                    style={inputStyle}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    rows={type === 'heading' ? 1 : 3}
                />
            );
        }

        switch (type) {
            case 'heading':
                return <h1 style={{ margin: 0, fontWeight: 'inherit', textAlign: 'inherit', fontSize: 'inherit' }}>{(element as any).content}</h1>;
            case 'paragraph':
                return <p style={{ margin: 0, fontWeight: 'inherit', textAlign: 'inherit', fontSize: 'inherit' }}>{(element as any).content}</p>;
            /* ... rest of switch ... */
            case 'divider': {
                const div = element as any;
                return (
                    <div style={{
                        display: 'flex',
                        justifyContent: element.style.alignment === 'center' ? 'center' : element.style.alignment === 'right' ? 'flex-end' : 'flex-start'
                    }}>
                        <div style={{
                            width: div.width || '100%',
                            borderTop: `${div.thickness || 1}px ${div.lineStyle || 'solid'} ${div.color || '#e2e8f0'}`,
                            marginTop: '10px',
                            marginBottom: '10px'
                        }} />
                    </div>
                );
            }
            case 'image': {
                const img = element as any;
                return (
                    <div style={{
                        display: 'flex',
                        justifyContent: element.style.alignment === 'center' ? 'center' : element.style.alignment === 'right' ? 'flex-end' : 'flex-start'
                    }}>
                        <img
                            src={img.src}
                            alt="element"
                            style={{
                                width: img.width || '100%',
                                height: img.height || 'auto',
                                border: img.borderWidth ? `${img.borderWidth}px ${img.borderStyle || 'solid'} ${img.borderColor || '#000'}` : 'none',
                                borderRadius: img.borderRadius ? `${img.borderRadius}px` : '0',
                                maxWidth: '100%'
                            }}
                        />
                    </div>
                );
            }
            case 'columns':
                return (
                    <React.Suspense fallback={<div>Loading columns...</div>}>
                        <ColumnContainer element={element as ColumnsElement} />
                    </React.Suspense>
                );
            case 'table':
                return (
                    <React.Suspense fallback={<div>Loading table...</div>}>
                        <TableContainer element={element as any} />
                    </React.Suspense>
                );
            case 'client-info': {
                const info = element as any;
                const borderStyle = info.showLeftBorder
                    ? { borderLeft: `${info.borderWidth || 3}px solid ${info.borderColor || '#3b82f6'}`, paddingLeft: '10px' }
                    : { paddingLeft: '0px' };

                return (
                    <div style={{
                        ...borderStyle,
                        color: element.style.color || 'inherit',
                        textAlign: element.style.alignment || 'left',
                        whiteSpace: 'pre-line'
                    }}>
                        <div style={{
                            fontSize: `${info.headingStyle?.fontSize || 10}px`,
                            color: info.headingStyle?.color || '#64748b',
                            fontWeight: info.headingStyle?.fontWeight || 'bold',
                            textTransform: 'uppercase'
                        }}>
                            {info.headingValue || 'Bill To'}
                        </div>
                        <div style={{ fontWeight: 'bold' }}>{info.content || 'Client Name'}</div>
                        {!info.content && <div>Address Line 1</div>}
                    </div>
                );
            }
            case 'business-info': {
                const info = element as any;
                return (
                    <div style={{
                        textAlign: element.style.alignment || 'right',
                        color: element.style.color || 'inherit',
                        whiteSpace: 'pre-line'
                    }}>
                        <div style={{
                            fontSize: `${info.headingStyle?.fontSize || 10}px`,
                            color: info.headingStyle?.color || '#64748b',
                            fontWeight: info.headingStyle?.fontWeight || 'bold',
                        }}>
                            {info.headingValue || 'Your Business Name'}
                        </div>
                        <div style={{ fontWeight: 'normal' }}>{info.content || 'Address Line 1'}</div>
                        {!info.content && <div style={{ fontSize: '0.9em', opacity: 0.8 }}>contact@business.com</div>}
                    </div>
                );
            }
            case 'signature':
                return (
                    <div style={{ marginTop: '20px', borderTop: '1px solid #000', width: '200px', paddingTop: '5px' }}>
                        <div style={{ fontSize: '11px' }}>Authorized Signature</div>
                    </div>
                );
            default:
                return <div>Unsupported Block: {element.id} ({element.type})</div>;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`canvas-block ${isSelected ? 'selected' : ''}`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            {...attributes}
            {...listeners}
        >
            {isSelected && !isEditing && (
                <div className="block-actions-toolbar" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="block-action-btn"
                        onClick={() => cloneElement(element.id)}
                        title="Clone Block"
                    >
                        Clone
                    </button>
                    <button
                        className="block-action-btn delete"
                        onClick={() => removeElement(element.id)}
                        title="Delete Block"
                    >
                        Delete
                    </button>
                </div>
            )}
            {renderContent()}
        </div>
    );
};

export default CanvasBlock;
