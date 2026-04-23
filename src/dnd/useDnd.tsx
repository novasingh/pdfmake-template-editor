/**
 * useDnd.tsx — Custom drag-and-drop library (no external dependencies)
 * Replaces: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, @dnd-kit/modifiers
 *
 * Approach: Pointer Events API for drag tracking, elementFromPoint for hit-testing.
 */
import React from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DragData {
    [key: string]: unknown;
}

export interface DragStartEvent {
    active: { id: string; data: DragData };
}

export interface DragEndEvent {
    active: { id: string; data: DragData };
    over: { id: string; data: DragData; rect: DOMRect } | null;
    delta: { x: number; y: number };
    activatorEvent: PointerEvent | null;
}

interface DropTargetEntry {
    id: string;
    data: DragData;
    el: HTMLElement;
}

interface DraggableEntry {
    id: string;
    data: DragData;
    el: HTMLElement;
}

interface DndContextValue {
    activeId: string | null;
    activeData: DragData;
    overTarget: DropTargetEntry | null;
    registerDroppable: (entry: DropTargetEntry) => void;
    unregisterDroppable: (id: string) => void;
    registerDraggable: (entry: DraggableEntry) => void;
    unregisterDraggable: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const DndContext = React.createContext<DndContextValue>({
    activeId: null,
    activeData: {},
    overTarget: null,
    registerDroppable: () => {},
    unregisterDroppable: () => {},
    registerDraggable: () => {},
    unregisterDraggable: () => {},
});

// ---------------------------------------------------------------------------
// DndProvider
// ---------------------------------------------------------------------------

interface DndProviderProps {
    children: React.ReactNode;
    onDragStart?: (event: DragStartEvent) => void;
    onDragEnd?: (event: DragEndEvent) => void;
    /** Minimum distance in px before drag starts (default: 5) */
    activationDistance?: number;
}

export const DndProvider: React.FC<DndProviderProps> = ({
    children,
    onDragStart,
    onDragEnd,
    activationDistance = 5,
}) => {
    const droppables = React.useRef<Map<string, DropTargetEntry>>(new Map());
    const draggables = React.useRef<Map<string, DraggableEntry>>(new Map());

    const [activeId, setActiveId] = React.useState<string | null>(null);
    const [activeData, setActiveData] = React.useState<DragData>({});
    const [overTarget, setOverTarget] = React.useState<DropTargetEntry | null>(null);

    // Internal drag-session refs (avoid stale closures in pointer handlers)
    const session = React.useRef<{
        draggableId: string;
        draggableData: DragData;
        startX: number;
        startY: number;
        currentX: number;
        currentY: number;
        started: boolean;
        activatorEvent: PointerEvent | null;
        ghostEl: HTMLElement | null;
    } | null>(null);

    const registerDroppable = React.useCallback((entry: DropTargetEntry) => {
        droppables.current.set(entry.id, entry);
    }, []);

    const unregisterDroppable = React.useCallback((id: string) => {
        droppables.current.delete(id);
    }, []);

    const registerDraggable = React.useCallback((entry: DraggableEntry) => {
        draggables.current.set(entry.id, entry);
    }, []);

    const unregisterDraggable = React.useCallback((id: string) => {
        draggables.current.delete(id);
    }, []);

    // Find the best drop target under a point using elementFromPoint + DOM walk
    const findDropTarget = React.useCallback(
        (x: number, y: number): DropTargetEntry | null => {
            // Temporarily hide the ghost so it doesn't block hit-testing
            const ghost = session.current?.ghostEl;
            if (ghost) ghost.style.pointerEvents = 'none';

            let best: DropTargetEntry | null = null;
            let bestPriority = -1;

            // Check every registered droppable's bounding rect
            droppables.current.forEach((entry) => {
                const rect = entry.el.getBoundingClientRect();
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    // Prioritise column cells and table cells over the root canvas
                    const priority = entry.id.includes('-col-') || entry.id.includes('-cell-') ? 2 : 1;
                    if (priority > bestPriority) {
                        bestPriority = priority;
                        best = entry;
                    }
                }
            });

            if (ghost) ghost.style.pointerEvents = 'none';
            return best;
        },
        []
    );

    // Create the drag ghost element
    const createGhost = (label: string, x: number, y: number): HTMLElement => {
        const el = document.createElement('div');
        el.style.cssText = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            z-index: 9999;
            pointer-events: none;
            background: #3b82f6;
            color: #fff;
            padding: 6px 14px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            font-family: sans-serif;
            box-shadow: 0 8px 32px rgba(59,130,246,0.35);
            opacity: 0.93;
            transform: translate(-50%, -50%) rotate(2deg);
            transition: transform 0.1s ease;
            white-space: nowrap;
            letter-spacing: 0.03em;
        `;
        el.textContent = label;
        document.body.appendChild(el);
        return el;
    };

    // Global pointer-down listener registered on draggable elements
    const handlePointerDown = React.useCallback(
        (draggableId: string, draggableData: DragData, e: PointerEvent) => {
            if (e.button !== 0) return; // left click only
            e.stopPropagation();

            session.current = {
                draggableId,
                draggableData,
                startX: e.clientX,
                startY: e.clientY,
                currentX: e.clientX,
                currentY: e.clientY,
                started: false,
                activatorEvent: null,
                ghostEl: null,
            };
        },
        []
    );

    React.useEffect(() => {
        const onPointerMove = (e: PointerEvent) => {
            const s = session.current;
            if (!s) return;

            const dx = e.clientX - s.startX;
            const dy = e.clientY - s.startY;
            s.currentX = e.clientX;
            s.currentY = e.clientY;

            if (!s.started) {
                if (Math.hypot(dx, dy) < activationDistance) return;
                // Activation threshold crossed — begin drag
                s.started = true;
                s.activatorEvent = e;

                // Create ghost
                const label = (s.draggableData.type as string | undefined)?.toUpperCase() ?? s.draggableId;
                s.ghostEl = createGhost(label, e.clientX, e.clientY);

                setActiveId(s.draggableId);
                setActiveData(s.draggableData);
                onDragStart?.({ active: { id: s.draggableId, data: s.draggableData } });
            }

            if (!s.started) return;

            // Move ghost
            if (s.ghostEl) {
                s.ghostEl.style.left = `${e.clientX}px`;
                s.ghostEl.style.top = `${e.clientY}px`;
            }

            // Hit-test drop targets
            const target = findDropTarget(e.clientX, e.clientY);
            setOverTarget(target);
        };

        const onPointerUp = (e: PointerEvent) => {
            const s = session.current;
            if (!s) return;

            if (s.ghostEl) {
                document.body.removeChild(s.ghostEl);
                s.ghostEl = null;
            }

            if (s.started) {
                const target = findDropTarget(e.clientX, e.clientY);

                onDragEnd?.({
                    active: { id: s.draggableId, data: s.draggableData },
                    over: target
                        ? {
                              id: target.id,
                              data: target.data,
                              rect: target.el.getBoundingClientRect(),
                          }
                        : null,
                    delta: {
                        x: e.clientX - s.startX,
                        y: e.clientY - s.startY,
                    },
                    activatorEvent: s.activatorEvent,
                });
            }

            session.current = null;
            setActiveId(null);
            setActiveData({});
            setOverTarget(null);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);

        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
        };
    }, [activationDistance, findDropTarget, onDragStart, onDragEnd]);

    const ctx = React.useMemo<DndContextValue>(
        () => ({
            activeId,
            activeData,
            overTarget,
            registerDroppable,
            unregisterDroppable,
            registerDraggable,
            unregisterDraggable,
        }),
        [activeId, activeData, overTarget, registerDroppable, unregisterDroppable, registerDraggable, unregisterDraggable]
    );

    return (
        <DndContext.Provider value={ctx}>
            {/* Expose handlePointerDown to child hooks via a secondary context */}
            <PointerDownContext.Provider value={handlePointerDown}>
                {children}
            </PointerDownContext.Provider>
        </DndContext.Provider>
    );
};

// ---------------------------------------------------------------------------
// Internal pointer-down context (so hooks can register without prop drilling)
// ---------------------------------------------------------------------------

type PointerDownHandler = (id: string, data: DragData, e: PointerEvent) => void;
const PointerDownContext = React.createContext<PointerDownHandler>(() => {});

// ---------------------------------------------------------------------------
// DragOverlay
// ---------------------------------------------------------------------------

interface DragOverlayProps {
    children?: React.ReactNode;
}

/**
 * Renders children while a drag is active.
 * The floating ghost is already handled by DndProvider — this is for custom overlay UI.
 */
export const DragOverlay: React.FC<DragOverlayProps> = ({ children }) => {
    const { activeId } = React.useContext(DndContext);
    if (!activeId || !children) return null;
    // Render inline; DndProvider's ghost already handles the visual floating element
    return <>{children}</>;
};

// ---------------------------------------------------------------------------
// useDraggable
// ---------------------------------------------------------------------------

interface UseDraggableOptions {
    id: string;
    data?: DragData;
    disabled?: boolean;
}

interface UseDraggableResult {
    ref: React.RefCallback<HTMLElement>;
    isDragging: boolean;
    listeners: {
        onPointerDown: (e: React.PointerEvent) => void;
    };
    attributes: {
        'data-draggable-id': string;
        style: React.CSSProperties;
    };
}

export function useDraggable({ id, data = {}, disabled = false }: UseDraggableOptions): UseDraggableResult {
    const { activeId, registerDraggable, unregisterDraggable } = React.useContext(DndContext);
    const handlePointerDown = React.useContext(PointerDownContext);
    const elRef = React.useRef<HTMLElement | null>(null);

    const setRef = React.useCallback(
        (el: HTMLElement | null) => {
            if (elRef.current && elRef.current !== el) {
                unregisterDraggable(id);
            }
            elRef.current = el;
            if (el) {
                registerDraggable({ id, data, el });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id, registerDraggable, unregisterDraggable]
    );

    // Update data in registry when it changes
    React.useEffect(() => {
        if (elRef.current) {
            registerDraggable({ id, data, el: elRef.current });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, JSON.stringify(data)]);

    const onPointerDown = React.useCallback(
        (e: React.PointerEvent) => {
            if (disabled) return;
            handlePointerDown(id, data, e.nativeEvent);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [disabled, id, JSON.stringify(data), handlePointerDown]
    );

    return {
        ref: setRef,
        isDragging: activeId === id,
        listeners: { onPointerDown },
        attributes: {
            'data-draggable-id': id,
            style: { cursor: disabled ? 'default' : 'grab', touchAction: 'none', userSelect: 'none' },
        },
    };
}

// ---------------------------------------------------------------------------
// useDroppable
// ---------------------------------------------------------------------------

interface UseDroppableOptions {
    id: string;
    data?: DragData;
}

interface UseDroppableResult {
    ref: React.RefCallback<HTMLElement>;
    isOver: boolean;
}

export function useDroppable({ id, data = {} }: UseDroppableOptions): UseDroppableResult {
    const { overTarget, registerDroppable, unregisterDroppable } = React.useContext(DndContext);
    const elRef = React.useRef<HTMLElement | null>(null);

    const setRef = React.useCallback(
        (el: HTMLElement | null) => {
            if (elRef.current && elRef.current !== el) {
                unregisterDroppable(id);
            }
            elRef.current = el;
            if (el) {
                registerDroppable({ id, data, el });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id, registerDroppable, unregisterDroppable]
    );

    // Update data in registry when it changes
    React.useEffect(() => {
        if (elRef.current) {
            registerDroppable({ id, data, el: elRef.current });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, JSON.stringify(data)]);

    return {
        ref: setRef,
        isOver: overTarget?.id === id,
    };
}

// ---------------------------------------------------------------------------
// useSortable  (draggable + droppable + translate-while-over)
// ---------------------------------------------------------------------------

interface UseSortableOptions {
    id: string;
    data?: DragData;
    disabled?: boolean;
}

interface UseSortableResult {
    ref: React.RefCallback<HTMLElement>;
    isDragging: boolean;
    isOver: boolean;
    transform: string | undefined;
    transition: string | undefined;
    listeners: {
        onPointerDown: (e: React.PointerEvent) => void;
    };
    attributes: {
        'data-draggable-id': string;
        style: React.CSSProperties;
    };
    setNodeRef: React.RefCallback<HTMLElement>;
}

export function useSortable({ id, data = {}, disabled = false }: UseSortableOptions): UseSortableResult {
    const draggable = useDraggable({ id, data, disabled });
    const droppable = useDroppable({ id, data });
    const { activeId } = React.useContext(DndContext);

    // Combine both refs
    const combinedRef = React.useCallback(
        (el: HTMLElement | null) => {
            draggable.ref(el);
            droppable.ref(el);
        },
        [draggable.ref, droppable.ref]
    );

    const isDragging = activeId === id;

    return {
        ref: combinedRef,
        setNodeRef: combinedRef,
        isDragging,
        isOver: droppable.isOver,
        // When something else is dragged over this item, nudge it slightly
        transform: droppable.isOver && !isDragging
            ? 'translateY(4px)'
            : undefined,
        transition: 'transform 150ms ease',
        listeners: draggable.listeners,
        attributes: draggable.attributes,
    };
}
