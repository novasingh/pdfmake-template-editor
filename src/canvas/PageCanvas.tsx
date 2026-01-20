import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { A4_DIMENSIONS, mmToPt } from '../utils/dimensions';
import '../styles/PageCanvas.css';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import CanvasBlock from './CanvasBlock';

const PageCanvas: React.FC = () => {
    const { document: doc, selectElement, canvasZoom, setCanvasZoom } = useEditorStore();
    const { page, rootElementIds, elements } = doc;

    const { setNodeRef: setCanvasRef } = useDroppable({
        id: 'page-canvas',
        data: { isCanvas: true }
    });


    const canvasStyle: React.CSSProperties = {
        width: `${A4_DIMENSIONS.widthPt}pt`,
        minWidth: `${A4_DIMENSIONS.widthPt}pt`,
        maxWidth: `${A4_DIMENSIONS.widthPt}pt`,
        height: `${A4_DIMENSIONS.heightPt}pt`,
        minHeight: `${A4_DIMENSIONS.heightPt}pt`,
        maxHeight: `${A4_DIMENSIONS.heightPt}pt`,
        padding: `${mmToPt(page.padding)}pt`,
        backgroundColor: page.backgroundColor || 'white',
        boxShadow: '0 0 20px rgba(0,0,0,0.15)',
        position: 'relative',
        margin: '0 auto',
        overflow: 'hidden',
        cursor: 'default',
        transform: `scale(${canvasZoom})`,
        transformOrigin: 'top center',
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxSizing: 'border-box',
    };

    const marginGuideStyle: React.CSSProperties = {
        position: 'absolute',
        top: `${mmToPt(page.margins.top)}pt`,
        right: `${mmToPt(page.margins.right)}pt`,
        bottom: `${mmToPt(page.margins.bottom)}pt`,
        left: `${mmToPt(page.margins.left)}pt`,
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
                    top: `${mmToPt(page.padding)}pt`, left: `${mmToPt(page.padding)}pt`,
                    right: `${mmToPt(page.padding)}pt`, bottom: `${mmToPt(page.padding)}pt`,
                    display: 'flex',
                    ...posStyle,
                    opacity: watermark.opacity ?? 0.1,
                    pointerEvents: 'none',
                    zIndex: 1,
                }}>
                    <div style={{
                        transform: watermark.position === 'center' ? 'rotate(-45deg)' : 'none',
                        fontSize: `${watermark.fontSize || 60}pt`,
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
                    top: `${mmToPt(page.padding)}pt`, left: `${mmToPt(page.padding)}pt`,
                    right: `${mmToPt(page.padding)}pt`, bottom: `${mmToPt(page.padding)}pt`,
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
                className="page-workspace"
                style={canvasStyle}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Margin Guides */}
                <div style={marginGuideStyle} />

                {/* Watermark */}
                {renderWatermark()}

                <div
                    ref={setCanvasRef}
                    className="content-area"
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        height: '100%',
                        paddingTop: `${mmToPt(page.margins.top)}pt`,
                        paddingRight: `${mmToPt(page.margins.right)}pt`,
                        paddingBottom: `${mmToPt(page.margins.bottom)}pt`,
                        paddingLeft: `${mmToPt(page.margins.left)}pt`,
                        boxSizing: 'border-box'
                    }}
                >
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

            {/* Floating Zoom Controls */}
            <div className="canvas-zoom-controls">
                <button
                    onClick={() => setCanvasZoom(canvasZoom - 0.1)}
                    title="Zoom Out"
                    disabled={canvasZoom <= 0.25}
                >−</button>
                <div className="zoom-percentage" onClick={() => setCanvasZoom(1)}>
                    {Math.round(canvasZoom * 100)}%
                </div>
                <button
                    onClick={() => setCanvasZoom(canvasZoom + 0.1)}
                    title="Zoom In"
                    disabled={canvasZoom >= 2}
                >+</button>
            </div>
        </div>
    );
};

export default PageCanvas;
