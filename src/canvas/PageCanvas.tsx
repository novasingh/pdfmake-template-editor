import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { A4_DIMENSIONS, mmToPx } from '../utils/dimensions';
import '../styles/PageCanvas.css';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import CanvasBlock from './CanvasBlock';

const PageCanvas: React.FC = () => {
    const { document: doc, selectElement } = useEditorStore();
    const { page, rootElementIds, elements } = doc;

    const { setNodeRef } = useDroppable({
        id: 'page-canvas',
        data: {
            isCanvas: true,
        }
    });

    const canvasStyle: React.CSSProperties = {
        width: A4_DIMENSIONS.widthPx,
        height: A4_DIMENSIONS.heightPx,
        padding: mmToPx(page.padding),
        backgroundColor: page.backgroundColor || 'white',
        boxShadow: '0 0 20px rgba(0,0,0,0.15)',
        position: 'relative',
        margin: '0 auto',
        overflow: 'hidden',
        cursor: 'default',
    };

    const marginGuideStyle: React.CSSProperties = {
        position: 'absolute',
        top: mmToPx(page.margins.top),
        right: mmToPx(page.margins.right),
        bottom: mmToPx(page.margins.bottom),
        left: mmToPx(page.margins.left),
        border: '1px dashed #cbd5e1',
        pointerEvents: 'none',
    };

    const getWatermarkPosition = (pos: string | undefined): React.CSSProperties => {
        switch (pos) {
            case 'top-left': return { alignItems: 'flex-start', justifyContent: 'flex-start' };
            case 'top-center': return { alignItems: 'flex-start', justifyContent: 'center' };
            case 'top-right': return { alignItems: 'flex-start', justifyContent: 'flex-end' };
            case 'center-left': return { alignItems: 'center', justifyContent: 'flex-start' };
            case 'center': case 'center-center': return { alignItems: 'center', justifyContent: 'center' };
            case 'center-right': return { alignItems: 'center', justifyContent: 'flex-end' };
            case 'bottom-left': return { alignItems: 'flex-end', justifyContent: 'flex-start' };
            case 'bottom-center': return { alignItems: 'flex-end', justifyContent: 'center' };
            case 'bottom-right': return { alignItems: 'flex-end', justifyContent: 'flex-end' };
            default: return { alignItems: 'center', justifyContent: 'center' };
        }
    };

    const renderWatermark = () => {
        const { watermark } = page;
        if (!watermark) return null;

        const posStyle = getWatermarkPosition(watermark.position);

        if (watermark.type === 'text') {
            return (
                <div style={{
                    position: 'absolute',
                    top: mmToPx(page.padding), left: mmToPx(page.padding),
                    right: mmToPx(page.padding), bottom: mmToPx(page.padding),
                    display: 'flex',
                    ...posStyle,
                    opacity: watermark.opacity ?? 0.1,
                    pointerEvents: 'none',
                    zIndex: 1,
                }}>
                    <div style={{
                        transform: watermark.position === 'center' ? 'rotate(-45deg)' : 'none',
                        fontSize: `${watermark.fontSize || 60}px`,
                        fontWeight: watermark.fontWeight || 'bold',
                        color: watermark.color || '#000',
                        fontFamily: watermark.fontFamily || 'sans-serif',
                        whiteSpace: 'nowrap',
                    }}>
                        {watermark.textValue}
                    </div>
                </div>
            );
        }

        if (watermark.type === 'image' && watermark.imageUrl) {
            return (
                <div style={{
                    position: 'absolute',
                    top: mmToPx(page.padding), left: mmToPx(page.padding),
                    right: mmToPx(page.padding), bottom: mmToPx(page.padding),
                    display: 'flex',
                    ...posStyle,
                    opacity: watermark.opacity ?? 0.1,
                    pointerEvents: 'none',
                    zIndex: 1,
                }}>
                    <img
                        src={watermark.imageUrl}
                        alt="watermark"
                        style={{
                            width: watermark.width || 'auto',
                            height: watermark.height || 'auto',
                            border: watermark.borderWidth ? `${watermark.borderWidth}px solid ${watermark.borderColor || '#000'}` : 'none',
                            borderRadius: watermark.borderRadius ? `${watermark.borderRadius}px` : '0',
                        }}
                    />
                </div>
            );
        }

        return null;
    };

    return (
        <div className="canvas-container" onClick={() => selectElement(null)}>
            <div
                ref={setNodeRef}
                className="page-workspace"
                style={canvasStyle}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Margin Guides */}
                <div style={marginGuideStyle} />

                {/* Watermark */}
                {renderWatermark()}

                {/* Droppable Content Area */}
                <div className="content-area" style={{
                    height: '100%',
                    position: 'relative',
                    zIndex: 2,
                    paddingTop: mmToPx(page.margins.top),
                    paddingRight: mmToPx(page.margins.right),
                    paddingBottom: mmToPx(page.margins.bottom),
                    paddingLeft: mmToPx(page.margins.left),
                    boxSizing: 'border-box'
                }}>
                    <SortableContext
                        items={rootElementIds}
                        strategy={verticalListSortingStrategy}
                    >
                        {rootElementIds.map((id) => (
                            <CanvasBlock key={id} element={elements[id]} />
                        ))}
                    </SortableContext>
                </div>
            </div>
        </div>
    );
};

export default PageCanvas;
