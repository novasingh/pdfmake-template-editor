import React from 'react';
import { useEditorStore } from '../state/store';

const ToolboxTop: React.FC = () => {
  const addNode = useEditorStore((s: any) => s.addNode);

  const addText = () => {
    const id = `n_${Date.now()}`;
    addNode('content', { id, type: 'text', left: 50, top: 80, props: { text: 'Text' } });
  };
  const addTextarea = () => {
    const id = `n_${Date.now()}`;
    addNode('content', { id, type: 'textarea', left: 50, top: 80, props: { text: 'Multiline' } });
  };
  const addImage = () => {
    const src = window.prompt('Image URL or dataURL') || '';
    const id = `n_${Date.now()}`;
    addNode('content', { id, type: 'image', left: 50, top: 80, props: { src } });
  };
  const addTable = () => {
    const id = `n_${Date.now()}`;
    const body = [[{ text: 'A' }, { text: 'B' }], [{ text: 'C' }, { text: 'D' }]];
    addNode('content', { id, type: 'table', left: 50, top: 80, props: { body, widths: ['*', 80] } });
  };
  const addLink = () => {
    const id = `n_${Date.now()}`;
    const url = window.prompt('Link URL', 'https://') || '';
    addNode('content', { id, type: 'hyperlink', left: 50, top: 80, props: { text: 'Link', url } });
  };
  const addHr = () => {
    const id = `n_${Date.now()}`;
    addNode('content', { id, type: 'hr', left: 50, top: 80, props: { width: 400, thickness: 1 } });
  };

  return (
    <div style={{ display: 'flex', gap: 8, padding: 8, borderBottom: '1px solid #eee' }}>
      <button onClick={addText}>Text</button>
      <button onClick={addTextarea}>TextArea</button>
      <button onClick={addImage}>Image</button>
      <button onClick={addTable}>Table</button>
      <button onClick={addLink}>Link</button>
      <button onClick={addHr}>Horizontal Line</button>
    </div>
  );
};

export default ToolboxTop;
