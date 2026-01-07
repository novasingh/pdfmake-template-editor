import React from 'react';
import { useEditorStore } from '../state/store';

const PropertiesPanel: React.FC = () => {
  const selection = useEditorStore((s: any) => s.selection);
  const header = useEditorStore((s: any) => s.header);
  const content = useEditorStore((s: any) => s.content);
  const footer = useEditorStore((s: any) => s.footer);
  const updateNode = useEditorStore((s: any) => s.updateNode);

  if (!selection?.nodeId) return <div style={{ width: 260, padding: 8 }}>No selection</div>;

  const list = selection.section === 'header' ? header : selection.section === 'footer' ? footer : content;
  const node = list.find((n: any) => n.id === selection.nodeId);
  if (!node) return <div style={{ width: 260, padding: 8 }}>Not found</div>;

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => updateNode(selection.section!, node.id, { props: { ...(node.props||{}), text: e.target.value } });

  return (
    <div style={{ width: 260, borderLeft: '1px solid #eee', padding: 8 }}>
      <div><strong>Properties</strong></div>
      <div style={{ marginTop: 8 }}>
        <label>Text</label>
        <input value={node.props?.text || ''} onChange={onChangeText} style={{ width: '100%' }} />
      </div>
    </div>
  );
};

export default PropertiesPanel;
