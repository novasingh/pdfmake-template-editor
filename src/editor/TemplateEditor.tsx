import React from 'react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    pointerWithin,
    rectIntersection,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
    CollisionDetection,
    getFirstCollision,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';

import Sidebar from '../sidebar/Sidebar';
import PageCanvas from '../canvas/PageCanvas';
import PropertiesPanel from '../properties/PropertiesPanel';
import EditorHeader from './EditorHeader';
import { useEditorStore } from '../store/useEditorStore';

import '../styles/TemplateEditor.css';

export interface TemplateEditorProps {
    // Add props if needed
}

const TemplateEditor: React.FC<TemplateEditorProps> = () => {
    const { document: doc, reorderElements, addElement, moveElement, selectedElementId, selectElement } = useEditorStore();
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [isPropertiesOpen, setIsPropertiesOpen] = React.useState(true);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);

    // Initial state based on screen size
    React.useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setIsSidebarOpen(false);
                setIsPropertiesOpen(false);
            } else {
                setIsSidebarOpen(true);
                setIsPropertiesOpen(true);
            }
        };

        handleResize(); // Run once on mount
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-open properties on selection (for mobile)
    React.useEffect(() => {
        if (selectedElementId && isMobile) {
            setIsPropertiesOpen(true);
            setIsSidebarOpen(false);
        } else if (!selectedElementId && isMobile) {
            setIsPropertiesOpen(false);
        }
    }, [selectedElementId, isMobile]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Custom collision detection that prioritizes containers (columns/tables) when pointer is inside them
    const customCollisionDetection: CollisionDetection = React.useCallback((args) => {
        // First, use pointerWithin to detect if we're inside a container (column or table cell)
        const pointerCollisions = pointerWithin(args);
        
        // Check if any of the pointer collisions are column containers or table cells
        const containerCollisions = pointerCollisions.filter(collision => {
            const id = collision.id as string;
            return id.includes('-col-') || id.includes('-cell-');
        });

        // If we're inside a container (column or table cell), prioritize that
        if (containerCollisions.length > 0) {
            return containerCollisions;
        }

        // Next, check for collisions with sortable root elements using closestCenter
        const closestCenterCollisions = closestCenter(args);
        
        // Filter to get only collisions with root-level elements
        const sortableCollisions = closestCenterCollisions.filter(collision => {
            const id = collision.id as string;
            return id !== 'page-canvas' && doc.rootElementIds.includes(id);
        });

        // If we have sortable element collisions, use those
        if (sortableCollisions.length > 0) {
            return sortableCollisions;
        }

        // If pointer is over the canvas, return that
        if (pointerCollisions.length > 0) {
            return pointerCollisions;
        }

        // Final fallback to rectIntersection
        return rectIntersection(args);
    }, [doc.rootElementIds]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over, delta } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;
        const overData = over.data.current;

        // Handle dropping a NEW element from the sidebar
        if (active.data.current?.isSidebarItem) {
            const type = active.data.current.type;

            if (overData?.isColumnContainer) {
                addElement(type, overData.parentId, overData.colIndex);
            } else if (overData?.isTableCell) {
                addElement(type, overData.parentId, overData.rowIndex, overData.colIndex);
            } else {
                // Calculate the drop position based on where the element is dropped
                if (overId !== 'page-canvas' && doc.rootElementIds.includes(overId)) {
                    const overIndex = doc.rootElementIds.indexOf(overId);
                    
                    const overRect = over.rect;
                    const isBelow = overRect && event.activatorEvent instanceof MouseEvent
                        ? (event.activatorEvent as MouseEvent).clientY > (overRect.top + overRect.height / 2)
                        : delta.y > 0;
                    
                    if (isBelow) {
                        addElement(type, undefined, overIndex + 1);
                    } else {
                        addElement(type, undefined, overIndex);
                    }
                } else {
                    addElement(type);
                }
            }
        }
        // Handle moving/reordering EXISTING elements
        else if (activeId !== overId) {
            // Moving to a column container
            if (overData?.isColumnContainer) {
                moveElement(activeId, overData.parentId, overData.colIndex);
            }
            // Moving to a table cell
            else if (overData?.isTableCell) {
                moveElement(activeId, overData.parentId, overData.rowIndex, overData.colIndex);
            }
            // Moving to root level (canvas or another root element)
            else if (overId === 'page-canvas') {
                // Move to end of root
                moveElement(activeId, null);
            }
            else if (doc.rootElementIds.includes(overId)) {
                // Reorder within root elements
                const overIndex = doc.rootElementIds.indexOf(overId);
                const activeInRoot = doc.rootElementIds.includes(activeId);
                
                if (activeInRoot) {
                    // Simple reorder within root
                    reorderElements(activeId, overId);
                } else {
                    // Moving from container to root
                    const overRect = over.rect;
                    const isBelow = overRect && event.activatorEvent instanceof MouseEvent
                        ? (event.activatorEvent as MouseEvent).clientY > (overRect.top + overRect.height / 2)
                        : delta.y > 0;
                    
                    moveElement(activeId, null, isBelow ? overIndex + 1 : overIndex);
                }
            }
        }

        setActiveId(null);
        if (isMobile) setIsSidebarOpen(false);
    };

    const renderDragOverlay = () => {
        if (!activeId) return null;

        if (activeId.startsWith('sidebar-')) {
            const type = activeId.replace('sidebar-', '');
            return <div className="drag-overlay-item">{type.toUpperCase()}</div>;
        }

        const element = doc.elements[activeId];
        if (!element) return null;

        return <div className="drag-overlay-item">{element.type.toUpperCase()}</div>;
    };

    return (
        <div className={`template-editor-wrapper ${isMobile ? 'mobile' : ''}`}>
            <EditorHeader
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                onToggleProperties={() => setIsPropertiesOpen(!isPropertiesOpen)}
            />

            <DndContext
                sensors={sensors}
                collisionDetection={customCollisionDetection}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="editor-main-layout">
                    <div className={`sidebar-container ${isSidebarOpen ? 'open' : 'hidden'}`}>
                        <Sidebar />
                        {isMobile && isSidebarOpen && <div className="panel-overlay" onClick={() => setIsSidebarOpen(false)} />}
                    </div>

                    <div className="canvas-wrapper-outer" onClick={() => {
                        if (isMobile) {
                            setIsSidebarOpen(false);
                            setIsPropertiesOpen(false);
                        }
                    }}>
                        <PageCanvas />
                    </div>

                    <div className={`properties-container ${isPropertiesOpen ? 'open' : 'hidden'}`}>
                        <PropertiesPanel />
                        {isMobile && isPropertiesOpen && <div className="panel-overlay" onClick={() => setIsPropertiesOpen(false)} />}
                    </div>
                </div>

                <DragOverlay>
                    {renderDragOverlay()}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default TemplateEditor;
