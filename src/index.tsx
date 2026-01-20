import TemplateEditor from './editor/TemplateEditor';
import { useEditorStore } from './store/useEditorStore';
import { exportToPdfMake } from './exporters/pdfmakeMapper';
import { LocalizationProvider, useLocalization } from './hooks/useLocalization';

export {
  TemplateEditor,
  useEditorStore,
  exportToPdfMake,
  LocalizationProvider,
  useLocalization
};

export type {
  DocumentSchema,
  EditorElement,
  TableElement,
  TableCell,
  ElementType,
  BaseStyle
} from './types/editor';