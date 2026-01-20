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
    CollisionDetection,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import Sidebar from '../sidebar/Sidebar';
import PageCanvas from '../canvas/PageCanvas';
import PropertiesPanel from '../properties/PropertiesPanel';
import EditorHeader from './EditorHeader';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useEditorStore } from '../store/useEditorStore';
import { LocalizationProvider } from '../hooks/useLocalization';
import CustomDialog from '../components/CustomDialog';

import '../styles/TemplateEditor.css';

import {
    TemplateEditorProps,
    DocumentSchema,
} from '../types/editor';

const TemplateEditor: React.FC<TemplateEditorProps> = ({
    initialData,
    config,
    onChange,
    onSave,
    onExport,
    locale = 'en'
}) => {
    const {
        document: doc,
        reorderElements,
        addElement,
        insertModule,
        moveElement,
        selectedElementId,
        selectElement,
        propertiesPanelOpen,
        togglePropertiesPanel,
        loadDocument
    } = useEditorStore();

    useKeyboardShortcuts();
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(window.innerWidth >= 1200);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1200);
    const prevMobileRef = React.useRef(window.innerWidth < 1200);
    const [sidebarWidth, setSidebarWidth] = React.useState(280);
    const [propertiesWidth, setPropertiesWidth] = React.useState(320);
    const [isTooSmall, setIsTooSmall] = React.useState(window.innerWidth < 1024);

    // Initial load from props
    React.useEffect(() => {
        if (initialData) {
            loadDocument(initialData);
        }
    }, [initialData, loadDocument]);

    // Handle onChange callback
    React.useEffect(() => {
        if (onChange) {
            onChange(doc);
        }
    }, [doc, onChange]);

    // Apply theme configuration
    const themeStyles = React.useMemo(() => {
        if (!config?.theme) return {};
        const { theme } = config;
        return {
            '--brand-primary': theme.primaryColor,
            '--brand-primary-hover': theme.accentColor || theme.primaryColor,
            '--radius-rich': theme.borderRadius,
            '--font-family': theme.fontFamily,
        } as React.CSSProperties;
    }, [config?.theme]);

    // Initial state based on screen size
    React.useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsTooSmall(width < 1024);
            const mobile = width < 1200;

            // Only reset panel visibility when switching between mobile and desktop modes
            if (mobile !== prevMobileRef.current) {
                setIsMobile(mobile);
                if (mobile) {
                    setIsSidebarOpen(false);
                    togglePropertiesPanel(false);
                } else {
                    setIsSidebarOpen(true);
                }
                prevMobileRef.current = mobile;
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSidebarResize = React.useCallback((e: MouseEvent) => {
        const newWidth = e.clientX;
        if (newWidth > 200 && newWidth < 600) {
            setSidebarWidth(newWidth);
        }
    }, []);

    const handlePropertiesResize = React.useCallback((e: MouseEvent) => {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth > 250 && newWidth < 600) {
            setPropertiesWidth(newWidth);
        }
    }, []);

    const stopResizing = React.useCallback(() => {
        window.removeEventListener('mousemove', handleSidebarResize);
        window.removeEventListener('mousemove', handlePropertiesResize);
        window.removeEventListener('mouseup', stopResizing);
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    }, [handleSidebarResize, handlePropertiesResize]);

    const startSidebarResize = () => {
        window.addEventListener('mousemove', handleSidebarResize);
        window.addEventListener('mouseup', stopResizing);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    const startPropertiesResize = () => {
        window.addEventListener('mousemove', handlePropertiesResize);
        window.addEventListener('mouseup', stopResizing);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

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
            const isModule = active.data.current.isModule;
            const moduleName = active.data.current.moduleName;

            if (isModule && moduleName) {
                insertModule(moduleName);
                setActiveId(null);
                return;
            }

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
        if (activeId !== overId) {
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

    if (isTooSmall) {
        return (
            <div className="resolution-warning">
                <div className="warning-content">
                    <span className="warning-icon">⚠️</span>
                    <h1>Resolution Not Supported</h1>
                    <p>This app does not support small device resolutions. Please use a screen wider than 1024px.</p>
                </div>
            </div>
        );
    }

    return (
        <LocalizationProvider locale={locale} labels={config?.labels}>
            <div
                className={`template-editor-wrapper ${isMobile ? 'mobile' : ''}`}
                style={themeStyles}
            >
                <EditorHeader
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onToggleProperties={() => togglePropertiesPanel()}
                    isSidebarOpen={isSidebarOpen}
                    isPropertiesOpen={propertiesPanelOpen}
                    onSave={() => onSave?.(doc)}
                    onExport={() => onExport?.(doc)}
                />

                <DndContext
                    sensors={sensors}
                    collisionDetection={customCollisionDetection}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="editor-main-layout">
                        <div
                            className={`sidebar-container ${isSidebarOpen ? 'open' : 'hidden'}`}
                            style={!isMobile ? {
                                width: `${sidebarWidth}px`,
                                marginLeft: isSidebarOpen ? 0 : `-${sidebarWidth}px`
                            } : {}}
                        >
                            <Sidebar />
                            {isMobile && isSidebarOpen && <div className="panel-overlay" onClick={() => setIsSidebarOpen(false)} />}
                        </div>

                        {!isMobile && isSidebarOpen && (
                            <div className="resizer sidebar-resizer" onMouseDown={startSidebarResize} />
                        )}

                        <div className="canvas-wrapper-outer" onClick={() => {
                            if (isMobile) {
                                setIsSidebarOpen(false);
                                togglePropertiesPanel(false);
                            }
                        }}>
                            <PageCanvas />
                        </div>

                        {!isMobile && propertiesPanelOpen && (
                            <div className="resizer properties-resizer" onMouseDown={startPropertiesResize} />
                        )}

                        <div
                            className={`properties-container ${propertiesPanelOpen ? 'open' : 'hidden'}`}
                            style={!isMobile ? {
                                width: `${propertiesWidth}px`,
                                marginRight: propertiesPanelOpen ? 0 : `-${propertiesWidth}px`
                            } : {}}
                        >
                            <PropertiesPanel />
                            {isMobile && propertiesPanelOpen && <div className="panel-overlay" onClick={() => togglePropertiesPanel(false)} />}
                        </div>
                    </div>

                    <DragOverlay>
                        {renderDragOverlay()}
                    </DragOverlay>
                </DndContext>
                <CustomDialog />
            </div>
        </LocalizationProvider>
    );
};

export default TemplateEditor;
