import React from 'react';
import { DndProvider, DragOverlay, DragStartEvent, DragEndEvent } from '../dnd/useDnd';

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

    // Sensors handled internally by DndProvider (5px activation distance)

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over, delta, activatorEvent } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeId = active.id;
        const overId = over.id;
        // Our useDroppable stores data directly (not .current)
        const overData = over.data;

        // Handle dropping a NEW element from the sidebar
        if (active.data?.isSidebarItem) {
            const type = active.data.type as string;
            const isModule = active.data.isModule as boolean;
            const moduleName = active.data.moduleName as string | undefined;

            if (isModule && moduleName) {
                insertModule(moduleName);
                setActiveId(null);
                return;
            }

            if (overData?.isColumnContainer) {
                addElement(type as any, overData.parentId as string, overData.colIndex as number);
            } else if (overData?.isTableCell) {
                addElement(type as any, overData.parentId as string, overData.rowIndex as number, overData.colIndex as number);
            } else {
                if (overId !== 'page-canvas' && doc.rootElementIds.includes(overId)) {
                    const overIndex = doc.rootElementIds.indexOf(overId);
                    const isBelow = over.rect && activatorEvent
                        ? activatorEvent.clientY > (over.rect.top + over.rect.height / 2)
                        : delta.y > 0;
                    addElement(type as any, undefined, isBelow ? overIndex + 1 : overIndex);
                } else {
                    addElement(type as any);
                }
            }
        }

        // Handle moving/reordering EXISTING elements
        if (activeId !== overId) {
            if (overData?.isColumnContainer) {
                moveElement(activeId, overData.parentId as string, overData.colIndex as number);
            } else if (overData?.isTableCell) {
                moveElement(activeId, overData.parentId as string, overData.rowIndex as number, overData.colIndex as number);
            } else if (overId === 'page-canvas') {
                moveElement(activeId, null);
            } else if (doc.rootElementIds.includes(overId)) {
                const overIndex = doc.rootElementIds.indexOf(overId);
                const activeInRoot = doc.rootElementIds.includes(activeId);

                if (activeInRoot) {
                    reorderElements(activeId, overId);
                } else {
                    const isBelow = over.rect && activatorEvent
                        ? activatorEvent.clientY > (over.rect.top + over.rect.height / 2)
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
            const type = activeId.replace('sidebar-module-', '').replace('sidebar-', '');
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
                    hideButtons={config?.hideHeaderButtons}
                />

                <DndProvider
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    activationDistance={5}
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
                </DndProvider>
                <CustomDialog />
            </div>
        </LocalizationProvider>
    );
};

export default TemplateEditor;
