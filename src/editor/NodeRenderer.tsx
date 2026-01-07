import React from 'react';
import TextElement from '../components/TextElement';
import ImageElement from '../components/ImageElement';
import HyperlinkElement from '../components/HyperlinkElement';
import TableElement from '../components/TableElement';
import TextareaElement from '../components/TextareaElement';
import { BaseNode } from '../core/schema';
import { useEditorStore } from '../state/store';

interface NodeRendererProps {
  node: BaseNode;
  section: 'header'|'content'|'footer';
}

const NodeRenderer: React.FC<NodeRendererProps> = ({ node, section }) => {
  const updateNode = useEditorStore((s: any) => s.updateNode);
  const handleMove = useEditorStore((s: any) => s.updateNode);

  const commonProps = { id: node.id as string, left: node.left || 0, top: node.top || 0 };

  switch (node.type) {
    case 'text':
      return <TextElement {...commonProps} text={node.props?.text} onUpdate={(id, u) => updateNode(section, id, u)} onMove={(id, offset) => handleMove(section, id, { left: offset ? offset.x : undefined, top: offset ? offset.y : undefined })} />;
    case 'image':
      return <ImageElement {...commonProps} src={node.props?.src} onUpdate={(id, u) => updateNode(section, id, u)} />;
    case 'hyperlink':
      return <HyperlinkElement {...commonProps} text={node.props?.text} url={node.props?.url} onUpdate={(id, u) => updateNode(section, id, u)} />;
    case 'table':
      return <TableElement {...commonProps} rows={node.props?.rows} cols={node.props?.cols} onUpdate={(id, u) => updateNode(section, id, u)} />;
    case 'textarea':
      return <TextareaElement {...commonProps} text={node.props?.text} onUpdate={(id, u) => updateNode(section, id, u)} />;
    case 'hr':
      return <div style={{ position: 'absolute', left: node.left, top: node.top, width: node.props?.width || 400, height: 2, background: '#ccc' }} />;
    default:
      return null;
  }
};

export default NodeRenderer;
