export type NodeType = 'text' | 'textarea' | 'image' | 'table' | 'hyperlink' | 'hr';

export interface BaseNode {
  id: string;
  type: NodeType;
  left?: number;
  top?: number;
  styleId?: string;
  props?: Record<string, any>;
}

export interface PageConfig {
  size?: 'A4' | 'LETTER' | { width: number; height: number };
  margins?: [number, number, number, number];
  background?: { color?: string; imageId?: string };
  watermark?: { text?: string; imageId?: string; position?: 'top' | 'center' | 'bottom'; opacity?: number; rotation?: number };
}

export interface EditorState {
  page: PageConfig;
  header: BaseNode[];
  content: BaseNode[];
  footer: BaseNode[];
  assets: Record<string, { type: 'image'; dataUrl: string }>;
  styles: Record<string, Record<string, any>>;
  selection?: { nodeId?: string; section?: 'header' | 'content' | 'footer' };
}

export const defaultState: EditorState = {
  page: { size: 'A4', margins: [40, 60, 40, 60] },
  header: [],
  content: [],
  footer: [],
  assets: {},
  styles: {},
};

export default EditorState;
