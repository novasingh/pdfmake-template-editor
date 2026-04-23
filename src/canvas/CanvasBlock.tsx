import React from 'react';
import { useSortable } from '../dnd/useDnd';
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
    const variables = useEditorStore(state => state.variables);

    // All hooks must be called before any conditional returns
    const {
        setNodeRef,
        transform,
        transition,
        isDragging,
        listeners,
        attributes,
    } = useSortable({
        id: element?.id ?? 'placeholder',
        data: {},
        disabled: isEditing || !element,
    });

    // Early return after all hooks are called
    if (!element) return null;

    const isSelected = selectedElementId === element.id;

    const mapMargins = (m?: [number, number, number, number]) => {
        if (!m) return undefined;
        // pdfmake: [left, top, right, bottom]
        // css: [top, right, bottom, left]
        return `${m[1]}pt ${m[2]}pt ${m[3]}pt ${m[0]}pt`;
    };

    const style: React.CSSProperties = {
        transform: transform,
        transition,
        opacity: isDragging ? 0.5 : (element.style.opacity ?? 1),
        padding: mapMargins(element.style.padding),
        margin: mapMargins(element.style.margin),
        backgroundColor: element.style.background || 'transparent',
        cursor: isEditing ? 'text' : 'pointer',
        position: 'relative',
        color: element.style.color,
        textAlign: element.style.alignment as any,
        fontSize: element.style.fontSize ? `${element.style.fontSize}pt` : undefined,
        fontWeight: element.style.fontWeight as any,
        lineHeight: element.style.lineHeight,
        letterSpacing: element.style.characterSpacing ? `${element.style.characterSpacing}pt` : undefined,
        textDecoration: element.style.decoration === 'lineThrough' ? 'line-through' : element.style.decoration,
        textDecorationStyle: element.style.decorationStyle as any,
        textDecorationColor: element.style.decorationColor,
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
                            borderTop: `${div.thickness || 1}pt ${div.lineStyle || 'solid'} ${div.color || '#e2e8f0'}`,
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
                                border: img.borderWidth ? `${img.borderWidth}pt ${img.borderStyle || 'solid'} ${img.borderColor || '#000'}` : 'none',
                                borderRadius: img.borderRadius ? `${img.borderRadius}pt` : '0',
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
                    ? { borderLeft: `${info.borderWidth || 3}pt solid ${info.borderColor || '#3b82f6'}`, paddingLeft: `${info.borderPadding ?? 10}pt` }
                    : { paddingLeft: '0pt' };

                return (
                    <div style={{
                        ...borderStyle,
                        color: element.style.color || 'inherit',
                        textAlign: element.style.alignment || 'left',
                        whiteSpace: 'pre-line'
                    }}>
                        <div style={{
                            fontSize: `${info.headingStyle?.fontSize || 10}pt`,
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
                            fontSize: `${info.headingStyle?.fontSize || 10}pt`,
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
                    <div style={{ borderTop: '1pt solid #000', width: '150pt', paddingTop: '5pt' }}>
                        <div style={{ fontSize: '11pt' }}>Authorized Signature</div>
                    </div>
                );
            case 'date-field': {
                const df = element as any;
                return (
                    <div style={{ fontSize: 'inherit', fontWeight: 'inherit', textAlign: 'inherit' }}>
                        {df.showLabel !== false && <span>{df.label || 'Date'}: </span>}
                        {df.dateValue || 'DD/MM/YYYY'}
                    </div>
                );
            }
            case 'auto-number': {
                const an = element as any;
                const value = an.startValue || 1;
                const paddedValue = value.toString().padStart(an.paddingDigits || 0, '0');
                return (
                    <div style={{ fontSize: 'inherit', fontWeight: 'inherit', textAlign: 'inherit' }}>
                        {an.label && <div style={{ fontSize: '0.8em', opacity: 0.7 }}>{an.label}</div>}
                        <span>{an.prefix}{paddedValue}{an.suffix}</span>
                    </div>
                );
            }
            case 'variable': {
                const v = element as any;
                const injectedValue = variables[v.variableName];
                return (
                    <div style={{ fontSize: 'inherit', fontWeight: 'inherit', textAlign: 'inherit' }}>
                        {v.label && <span>{v.label} </span>}
                        <span style={{
                            background: injectedValue ? '#ecfdf5' : '#f1f5f9',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            border: injectedValue ? '1px solid #10b981' : '1px dashed #cbd5e1',
                            color: injectedValue ? '#065f46' : '#475569'
                        }}>
                            {injectedValue || v.placeholder || `{${v.variableName}}`}
                        </span>
                    </div>
                );
            }
            case 'qrcode': {
                const qr = element as any;
                return (
                    <div style={{
                        display: 'flex',
                        justifyContent: element.style.alignment === 'center' ? 'center' : element.style.alignment === 'right' ? 'flex-end' : 'flex-start'
                    }}>
                        <div style={{
                            width: `${qr.size || 100}pt`,
                            height: `${qr.size || 100}pt`,
                            background: '#f8fafc',
                            border: '1pt solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10pt',
                            color: '#94a3b8'
                        }}>
                            QR CODE
                        </div>
                    </div>
                );
            }
            case 'barcode': {
                const bc = element as any;
                return (
                    <div style={{
                        display: 'flex',
                        justifyContent: element.style.alignment === 'center' ? 'center' : element.style.alignment === 'right' ? 'flex-end' : 'flex-start'
                    }}>
                        <div style={{
                            width: `${bc.width || 120}pt`,
                            height: `${bc.height || 40}pt`,
                            background: '#f8fafc',
                            border: '1pt solid #e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10pt',
                            color: '#94a3b8'
                        }}>
                            <div>|| ||| | || ||</div>
                            {bc.displayValue !== false && <div style={{ fontSize: '8pt' }}>{bc.data || '12345678'}</div>}
                        </div>
                    </div>
                );
            }
            case 'list': {
                const le = element as any;
                const ListTag = le.listType === 'ordered' ? 'ol' : 'ul';
                const listStyle = le.bulletStyle === 'number' ? 'decimal' :
                    le.bulletStyle === 'letter' ? 'lower-alpha' :
                        le.bulletStyle || 'disc';

                return (
                    <ListTag style={{
                        margin: 0,
                        padding: 0,
                        paddingLeft: '22px',
                        listStyleType: listStyle,
                        listStylePosition: 'outside',
                        textAlign: 'inherit',
                        fontSize: 'inherit',
                    }}>
                        {(le.items || []).map((item: string, i: number) => (
                            <li key={i} style={{
                                display: 'list-item',
                                marginBottom: '2px',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                            }}>
                                {item}
                            </li>
                        ))}
                    </ListTag>
                );
            }
            case 'abn-field': {
                const abn = element as any;
                return (
                    <div style={{ fontSize: 'inherit', fontWeight: 'inherit', textAlign: 'inherit' }}>
                        {abn.label && <span style={{ marginRight: '5px' }}>{abn.label}</span>}
                        <span style={{ fontWeight: 'bold' }}>{abn.abnValue || '00 000 000 000'}</span>
                    </div>
                );
            }
            case 'bank-details': {
                const bd = element as any;
                const fontSize = element.style.fontSize ? `${element.style.fontSize}pt` : '10pt';
                const color = element.style.color || '#374151';
                const labelColor = '#6b7280';

                // Build lines array — each entry is one line
                const lines: React.ReactNode[] = [];

                if (bd.bankName) lines.push(
                    <span key="bank">
                        <span style={{ color: labelColor }}>Bank: </span>
                        <strong>{bd.bankName}</strong>
                    </span>
                );
                if (bd.accountName) lines.push(
                    <span key="acct">
                        <span style={{ color: labelColor }}>Account Name: </span>
                        {bd.accountName}
                    </span>
                );
                if (bd.bsb) lines.push(
                    <span key="bsb">
                        <span style={{ color: labelColor }}>BSB: </span>
                        {bd.bsb}
                    </span>
                );
                if (bd.accountNumber) lines.push(
                    <span key="accnum">
                        <span style={{ color: labelColor }}>Account Number: </span>
                        {bd.accountNumber}
                    </span>
                );

                if (lines.length === 0) lines.push(
                    <span key="empty" style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                        Bank Name · Account Name · BSB · Account Number
                    </span>
                );

                return (
                    <div style={{
                        display: 'block',
                        fontSize,
                        textAlign: element.style.alignment as any || 'left',
                        color,
                        background: element.style.background || '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        padding: '8px 10px',
                    }}>
                        {/* Each line separated by <br /> — 100% CSS-reset-proof */}
                        {lines.map((line, i) => (
                            <span key={i} style={{ display: 'block', lineHeight: 1.8 }}>
                                {line}
                            </span>
                        ))}
                        {bd.note && (
                            <span style={{
                                display: 'block',
                                marginTop: '6px',
                                paddingTop: '6px',
                                borderTop: '1px solid #e2e8f0',
                                color: labelColor,
                                lineHeight: 1.8,
                            }}>
                                {bd.note}
                            </span>
                        )}
                    </div>
                );
            }
            default:
                return <div>Unsupported Block: {element.id} ({element.type})</div>;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={{ ...style, ...attributes.style }}
            className={`canvas-block ${isSelected ? 'selected' : ''}`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            data-draggable-id={attributes['data-draggable-id']}
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
