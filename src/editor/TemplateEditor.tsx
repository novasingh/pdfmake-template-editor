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
    const { document: doc, reorderElements, addElement, selectedElementId, selectElement } = useEditorStore();
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

        // Handle dropping a NEW element from the sidebar
        if (active.data.current?.isSidebarItem) {
            const type = active.data.current.type;
            const overData = over.data.current;

            if (overData?.isColumnContainer) {
                addElement(type, overData.parentId, overData.colIndex);
            } else if (overData?.isTableCell) {
                // We'll need to update addElement to handle table nesting
                addElement(type, overData.parentId, overData.rowIndex, overData.colIndex);
            } else {
                // Calculate the drop position based on where the element is dropped
                const overId = over.id as string;
                
                // If dropped on an existing element, determine if above or below center
                if (overId !== 'page-canvas' && doc.rootElementIds.includes(overId)) {
                    const overIndex = doc.rootElementIds.indexOf(overId);
                    
                    // Check if we're dropping in the lower half of the element
                    // If delta.y is positive (dragging downward) and we're over an element,
                    // or if over.rect exists we can use it to determine position
                    const overRect = over.rect;
                    const isBelow = overRect && event.activatorEvent instanceof MouseEvent
                        ? (event.activatorEvent as MouseEvent).clientY > (overRect.top + overRect.height / 2)
                        : delta.y > 0;
                    
                    if (isBelow) {
                        // Insert after this element
                        addElement(type, undefined, overIndex + 1);
                    } else {
                        // Insert before this element
                        addElement(type, undefined, overIndex);
                    }
                } else {
                    // Dropped on the canvas itself - add to the end
                    addElement(type);
                }
            }
        }
        // Handle reordering existing elements
        else if (active.id !== over.id) {
            // Reordering logic for nested elements would go here
            reorderElements(active.id as string, over.id as string);
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
