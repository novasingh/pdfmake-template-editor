import React from 'react';
import Canvas from '../components/Canvas';
import { useEditorStore } from '../state/store';
import NodeRenderer from './NodeRenderer';

const CanvasWrapper: React.FC<{ section: 'header'|'content'|'footer' }> = ({ section }) => {
  const nodes = useEditorStore((s: any) => (section === 'header' ? s.header : section === 'footer' ? s.footer : s.content));

  return (
    <Canvas onDrop={(item, offset) => { /* for external drops */ }} className="canvas" >
      {nodes.map((n: any) => (
        <NodeRenderer key={n.id} node={n} section={section} />
      ))}
    </Canvas>
  );
};

export default CanvasWrapper;
