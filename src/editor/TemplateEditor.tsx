import React from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
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

import './TemplateEditor.css';

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

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

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
                addElement(type);
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
                collisionDetection={closestCorners}
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
