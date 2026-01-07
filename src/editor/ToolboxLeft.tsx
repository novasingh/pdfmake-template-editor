import React from 'react';
import { useEditorStore } from '../state/store';

const ToolboxLeft: React.FC = () => {
  const selection = useEditorStore((s: any) => s.selection);
  const select = useEditorStore((s: any) => s.selectNode);

  return (
    <div style={{ width: 180, borderRight: '1px solid #eee', padding: 8 }}>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => select('content')}>Content</button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => select('header')}>Header</button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => select('footer')}>Footer</button>
      </div>
      <div style={{ marginTop: 24 }}>
        <strong>Selection</strong>
        <div>{selection?.section || 'none'}</div>
        <div>{selection?.nodeId || ''}</div>
      </div>
    </div>
  );
};

export default ToolboxLeft;
