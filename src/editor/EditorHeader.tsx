import React, { useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { useFullscreen } from '../hooks/useFullscreen';
import { usePDFExport } from '../hooks/usePDFExport';
import JsonPreviewModal from '../canvas/JsonPreviewModal';
import '../styles/EditorHeader.css';

interface EditorHeaderProps {
    onToggleSidebar: () => void;
    onToggleProperties: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ onToggleSidebar, onToggleProperties }) => {
    const { document: doc, loadTemplate } = useEditorStore();
    const [isJsonOpen, setIsJsonOpen] = useState(false);
    const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

    // Custom hooks
    const { isFullscreen, toggleFullscreen } = useFullscreen();
    const { exportPDF } = usePDFExport();

    const handlePrint = () => {
        exportPDF(doc, `Template_${new Date().getTime()}.pdf`);
    };

    const handleLoadTemplate = (type: 'blank' | 'default') => {
        if (confirm(`Are you sure you want to load a ${type} template? This will clear your current work.`)) {
            loadTemplate(type);
        }
        setShowTemplateDropdown(false);
    };

    return (
        <header className="editor-header">
            <div className="header-left">
                <div className="template-dropdown-container">
                    <button
                        className="header-btn secondary"
                        onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                    >
                        <span>New Template</span>
                    </button>

                    {showTemplateDropdown && (
                        <div className="template-dropdown">
                            <div className="dropdown-item" onClick={() => handleLoadTemplate('blank')}>
                                <div className="item-info">
                                    <span className="item-title">Blank Template</span>
                                    <span className="item-desc">Start from scratch</span>
                                </div>
                            </div>
                            <div className="dropdown-item" onClick={() => handleLoadTemplate('default')}>
                                <div className="item-info">
                                    <span className="item-title">Default Template</span>
                                    <span className="item-desc">Sample invoice structure</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="header-center">
                <div className="doc-title-container">
                    <span className="doc-status-dot" />
                    <span className="doc-title">Untitled Template</span>
                </div>
            </div>

            <div className="header-right">
                <div className="header-divider" />
                <div className="action-group">
                    <button
                        className={`header-btn secondary ${isFullscreen ? 'active' : ''}`}
                        onClick={toggleFullscreen}
                        title="Toggle Fullscreen"
                    >
                        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    </button>
                    <button
                        className="header-btn secondary"
                        onClick={() => setIsJsonOpen(true)}
                    >
                        JSON
                    </button>
                    <button
                        className="header-btn primary"
                        onClick={handlePrint}
                    >
                        <span>Print PDF</span>
                    </button>
                </div>
            </div>

            <JsonPreviewModal isOpen={isJsonOpen} onClose={() => setIsJsonOpen(false)} />
        </header>
    );
};

export default EditorHeader;
