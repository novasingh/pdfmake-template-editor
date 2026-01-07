import React from 'react';
import ToolboxLeft from './ToolboxLeft';
import ToolboxTop from './ToolboxTop';
import PropertiesPanel from './PropertiesPanel';
import CanvasWrapper from './CanvasWrapper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const EditorShell: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
        <ToolboxLeft />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <ToolboxTop />
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <div style={{ flex: 1, padding: 12 }}>
              <CanvasWrapper section={'content'} />
            </div>
            <PropertiesPanel />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default EditorShell;
