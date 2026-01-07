import React, { useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { exportToPdfMake } from '../exporters/pdfmakeMapper';
import './JsonPreviewModal.css';

interface JsonPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const JsonPreviewModal: React.FC<JsonPreviewModalProps> = ({ isOpen, onClose }) => {
    const { document: doc } = useEditorStore();
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

    if (!isOpen) return null;

    const pdfMakeJson = exportToPdfMake(doc);
    const jsonString = JSON.stringify(pdfMakeJson, null, 2);

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonString);
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>PDFMake JSON Preview</h3>
                    <div className="modal-actions">
                        <button className="copy-btn" onClick={handleCopy}>
                            {copyStatus === 'copied' ? 'Copied!' : 'Copy JSON'}
                        </button>
                        <button className="close-btn" onClick={onClose}>&times;</button>
                    </div>
                </div>
                <div className="modal-body">
                    <pre><code>{jsonString}</code></pre>
                </div>
            </div>
        </div>
    );
};

export default JsonPreviewModal;
