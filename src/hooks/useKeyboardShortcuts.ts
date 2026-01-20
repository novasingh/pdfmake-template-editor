import { useEffect } from 'react';
import { useEditorStore } from '../store/useEditorStore';

export const useKeyboardShortcuts = () => {
    const {
        selectedElementId,
        removeElement,
        cloneElement,
        selectElement,
        copyElement,
        pasteElement,
        moveElementUpDown
    } = useEditorStore();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Don't trigger shortcuts if user is typing in an input or textarea
            const target = event.target as HTMLElement;
            const isInput = target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable;

            if (isInput) return;

            // Delete / Backspace: Delete selected element
            if ((event.key === 'Delete' || event.key === 'Backspace') && selectedElementId) {
                event.preventDefault();
                removeElement(selectedElementId);
            }

            // Ctrl+D / Cmd+D: Duplicate selected element
            if ((event.ctrlKey || event.metaKey) && event.key === 'd' && selectedElementId) {
                event.preventDefault();
                cloneElement(selectedElementId);
            }

            // Ctrl+C / Cmd+C: Copy
            if ((event.ctrlKey || event.metaKey) && event.key === 'c' && selectedElementId) {
                event.preventDefault();
                copyElement(selectedElementId);
            }

            // Ctrl+V / Cmd+V: Paste
            if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
                event.preventDefault();
                pasteElement();
            }

            // Arrow keys: Move element up/down
            if (event.key === 'ArrowUp' && selectedElementId) {
                event.preventDefault();
                moveElementUpDown(selectedElementId, 'up');
            }
            if (event.key === 'ArrowDown' && selectedElementId) {
                event.preventDefault();
                moveElementUpDown(selectedElementId, 'down');
            }

            // Escape: Deselect
            if (event.key === 'Escape') {
                event.preventDefault();
                selectElement(null);
            }

            // Ctrl+Z / Cmd+Z: Undo
            if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
                event.preventDefault();
                (useEditorStore as any).temporal.getState().undo();
            }

            // Ctrl+Y / Ctrl+Shift+Z / Cmd+Shift+Z: Redo
            const isRedo = ((event.ctrlKey || event.metaKey) && event.key === 'y') ||
                ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z');

            if (isRedo) {
                event.preventDefault();
                (useEditorStore as any).temporal.getState().redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElementId, removeElement, cloneElement, selectElement, copyElement, pasteElement, moveElementUpDown]);
};
