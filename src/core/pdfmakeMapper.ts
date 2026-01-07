import { EditorState, BaseNode } from './schema';

function mapNodeToPdfmake(node: BaseNode) {
  const p = node.props || {};
  switch (node.type) {
    case 'text':
      return { text: p.text || '', absolutePosition: { x: node.left || 0, y: node.top || 0 }, ...p.style };
    case 'textarea':
      return { text: p.text || '', absolutePosition: { x: node.left || 0, y: node.top || 0 }, ...p.style };
    case 'hyperlink':
      return { text: p.text || '', link: p.url || '', absolutePosition: { x: node.left || 0, y: node.top || 0 } };
    case 'image':
      // image src is expected to be dataURL
      return { image: p.src || '', absolutePosition: { x: node.left || 0, y: node.top || 0 }, width: p.width };
    case 'table':
      return { table: { widths: p.widths || [], body: p.body || [] }, absolutePosition: { x: node.left || 0, y: node.top || 0 } };
    case 'hr':
      return { canvas: [ { type: 'line', x1: 0, y1: 0, x2: p.width || 400, y2: 0, lineWidth: p.thickness || 1 } ], absolutePosition: { x: node.left || 0, y: node.top || 0 } };
    default:
      return null;
  }
}

export function mapEditorStateToDoc(state: EditorState) {
  const doc: any = {};
  // page
  if (state.page?.size) doc.pageSize = state.page.size;
  if (state.page?.margins) doc.pageMargins = state.page.margins;

  // background/watermark support (simple): if text watermark provided create background fn
  if (state.page?.watermark?.text) {
    const wm = state.page.watermark;
    doc.background = () => ({ text: wm.text, opacity: wm.opacity ?? 0.08, alignment: wm.position === 'top' ? 'left' : 'center', fontSize: 72, rotation: wm.rotation || 0 });
  }

  // header/footer (simple stack of mapped nodes)
  if (state.header && state.header.length) {
    doc.header = state.header.map(n => mapNodeToPdfmake(n)).filter(Boolean);
  }
  if (state.footer && state.footer.length) {
    doc.footer = state.footer.map(n => mapNodeToPdfmake(n)).filter(Boolean);
  }

  // content
  const content = (state.content || []).map(n => mapNodeToPdfmake(n)).filter(Boolean);
  doc.content = content;

  // images/styles can be embedded by caller if needed
  return doc;
}

export default mapEditorStateToDoc;
