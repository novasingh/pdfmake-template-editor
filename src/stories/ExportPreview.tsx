import React from 'react';
import { exportToPdfMake } from '../exporters/pdfmakeMapper';
import { useEditorStore } from '../store/useEditorStore';

const ExportPreview: React.FC = () => {
    const { document: doc } = useEditorStore();
    const pdfDefinition = exportToPdfMake(doc);

    return (
        <div style={{ padding: '20px', backgroundColor: '#1e1e1e', color: '#d4d4d4', height: '100vh', overflow: 'auto' }}>
            <h3 style={{ color: '#569cd6' }}>PDFMake Definition Export</h3>
            <pre style={{ fontSize: '12px' }}>
                {JSON.stringify(pdfDefinition, null, 2)}
            </pre>
        </div>
    );
};

export default ExportPreview;
