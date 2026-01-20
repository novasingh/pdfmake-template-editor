import TemplateEditor from './editor/TemplateEditor';
import { useEditorStore } from './store/useEditorStore';
import { exportToPdfMake } from './exporters/pdfmakeMapper';

export {
  TemplateEditor,
  useEditorStore,
  exportToPdfMake
};

export type {
  DocumentSchema,
  EditorElement,
  TableElement,
  TableCell,
  ElementType,
  BaseStyle
} from './types/editor';

export default TemplateEditor;