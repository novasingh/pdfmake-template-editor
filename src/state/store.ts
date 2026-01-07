import { create } from 'zustand';
import { EditorState, defaultState, BaseNode } from '../core/schema';

export interface EditorStore extends EditorState {
  setStatePartial: (patch: Partial<EditorState>) => void;
  addNode: (section: 'header'|'content'|'footer', node: BaseNode) => void;
  updateNode: (section: 'header'|'content'|'footer', id: string, updates: Partial<BaseNode>) => void;
  removeNode: (section: 'header'|'content'|'footer', id: string) => void;
  selectNode: (section: 'header'|'content'|'footer', id?: string) => void;
}

export const useEditorStore = create<EditorStore>((set: any, get: any) => ({
  ...defaultState,
  setStatePartial: (patch: Partial<EditorState>) => set((s: any) => ({ ...s, ...patch })),
  addNode: (section: 'header'|'content'|'footer', node: BaseNode) => set((s: any) => ({ ...s, [section]: [...(s as any)[section], node] })),
  updateNode: (section: 'header'|'content'|'footer', id: string, updates: Partial<BaseNode>) => set((s: any) => ({
    ...s,
    [section]: (s as any)[section].map((n: BaseNode) => n.id === id ? { ...n, ...updates } : n)
  })),
  removeNode: (section: 'header'|'content'|'footer', id: string) => set((s: any) => ({
    ...s,
    [section]: (s as any)[section].filter((n: BaseNode) => n.id !== id)
  })),
  selectNode: (section: 'header'|'content'|'footer', id?: string) => set((s: any) => ({ selection: { section, nodeId: id } })),
}));

export default useEditorStore;
