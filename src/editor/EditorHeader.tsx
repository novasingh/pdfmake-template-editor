import React, { useState, useRef } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { useFullscreen } from '../hooks/useFullscreen';
import { usePDFExport } from '../hooks/usePDFExport';
import JsonPreviewModal from '../canvas/JsonPreviewModal';
import {
    invoiceTemplateAU,
    quoteTemplateAU,
    complianceTemplate,
    createTemplate,
    downloadTemplateAsFile,
    readTemplateFile,
    saveTemplateToStorage,
    Template,
} from '../templates';
import { captureThumbnail } from '../utils/thumbnailUtils';
import TemplateGalleryModal from '../canvas/TemplateGalleryModal';
import '../styles/EditorHeader.css';

interface EditorHeaderProps {
    onToggleSidebar: () => void;
    onToggleProperties: () => void;
    isSidebarOpen?: boolean;
    isPropertiesOpen?: boolean;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
    onToggleSidebar,
    onToggleProperties,
    isSidebarOpen,
    isPropertiesOpen
}) => {
    const { document: doc, loadTemplate, loadDocument, showDialog } = useEditorStore();
    const [isJsonOpen, setIsJsonOpen] = useState(false);
    const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
    const [showSaveDropdown, setShowSaveDropdown] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Custom hooks
    const { isFullscreen, toggleFullscreen } = useFullscreen();
    const { exportPDF } = usePDFExport();

    const handlePrint = () => {
        exportPDF(doc, `Template_${new Date().getTime()}.pdf`);
    };

    const handleLoadTemplate = (type: 'blank' | 'default') => {
        showDialog({
            type: 'confirm',
            title: 'Load Template',
            message: `Are you sure you want to load a ${type} template? This will clear your current work.`,
            confirmLabel: 'Load',
            onConfirm: () => {
                loadTemplate(type);
            }
        });
        setShowTemplateDropdown(false);
    };

    const handleLoadPrebuiltTemplate = (template: Template) => {
        showDialog({
            type: 'confirm',
            title: 'Load Pre-built Template',
            message: `Load "${template.metadata.name}"? This will replace your current work.`,
            confirmLabel: 'Load',
            onConfirm: () => {
                loadDocument(template.document);
            }
        });
        setShowTemplateDropdown(false);
    };

    const handleSaveAsTemplate = async () => {
        showDialog({
            type: 'prompt',
            title: 'Save Template',
            message: 'Enter template name:',
            defaultValue: 'My Template',
            confirmLabel: 'Save',
            onConfirm: async (name) => {
                if (name) {
                    const thumbnail = await captureThumbnail('page-canvas');
                    const template = createTemplate(doc, name, { thumbnail });
                    saveTemplateToStorage(template);
                    showDialog({
                        type: 'alert',
                        title: 'Success',
                        message: `Template "${name}" saved to browser storage!`
                    });
                }
            }
        });
        setShowSaveDropdown(false);
    };

    const handleExportJSON = async () => {
        const thumbnail = await captureThumbnail('page-canvas');
        const template = createTemplate(doc, 'Exported Template', { thumbnail });
        downloadTemplateAsFile(template);
        setShowSaveDropdown(false);
    };

    const handleImportJSON = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const template = await readTemplateFile(file);
        if (template) {
            showDialog({
                type: 'confirm',
                title: 'Import Template',
                message: `Load template "${template.metadata.name}"? This will replace your current work.`,
                confirmLabel: 'Import',
                onConfirm: () => {
                    loadDocument(template.document);
                    setShowTemplateDropdown(false);
                }
            });
        } else {
            showDialog({
                type: 'alert',
                title: 'Error',
                message: 'Failed to load template. Please check the file format.'
            });
        }

        // Reset input
        e.target.value = '';
        setShowTemplateDropdown(false);
    };

    return (
        <header className="editor-header">
            <div className="header-left">
                <button
                    className={`header-btn icon-only ${isSidebarOpen ? 'active' : ''}`}
                    onClick={onToggleSidebar}
                    title="Toggle Sidebar"
                >
                    <span>☰</span>
                </button>

                <div className="header-divider" />
                <div className="action-group">
                    <button
                        className="header-btn secondary"
                        onClick={() => (useEditorStore as any).temporal.getState().undo()}
                        title="Undo (Ctrl+Z)"
                    >
                        <span>↩ Undo</span>
                    </button>
                    <button
                        className="header-btn secondary"
                        onClick={() => (useEditorStore as any).temporal.getState().redo()}
                        title="Redo (Ctrl+Y)"
                    >
                        <span>↪ Redo</span>
                    </button>
                </div>

                <div className="header-divider" />

                <div className="template-dropdown-container">
                    <button
                        className="header-btn secondary"
                        onClick={() => {
                            setShowTemplateDropdown(!showTemplateDropdown);
                            setShowSaveDropdown(false);
                        }}
                    >
                        <span>Templates</span>
                    </button>

                    {showTemplateDropdown && (
                        <div className="template-dropdown">
                            <div className="dropdown-section-title">New</div>
                            <div className="dropdown-item" onClick={() => handleLoadTemplate('blank')}>
                                <div className="item-info">
                                    <span className="item-title">Blank Template</span>
                                    <span className="item-desc">Start from scratch</span>
                                </div>
                            </div>

                            <div className="dropdown-section-title">Pre-built (Australian)</div>
                            <div className="dropdown-item" onClick={() => handleLoadPrebuiltTemplate(invoiceTemplateAU)}>
                                <div className="item-info">
                                    <span className="item-title">📄 Tax Invoice</span>
                                    <span className="item-desc">ATO-compliant with GST</span>
                                </div>
                            </div>
                            <div className="dropdown-item" onClick={() => handleLoadPrebuiltTemplate(quoteTemplateAU)}>
                                <div className="item-info">
                                    <span className="item-title">💼 Quote / Proposal</span>
                                    <span className="item-desc">With terms & signature</span>
                                </div>
                            </div>
                            <div className="dropdown-item" onClick={() => handleLoadPrebuiltTemplate(complianceTemplate)}>
                                <div className="item-info">
                                    <span className="item-title">✅ Compliance Certificate</span>
                                    <span className="item-desc">Official document template</span>
                                </div>
                            </div>

                            <div className="dropdown-section-title">Import / Browse</div>
                            <div className="dropdown-item" onClick={() => {
                                setIsGalleryOpen(true);
                                setShowTemplateDropdown(false);
                            }}>
                                <div className="item-info">
                                    <span className="item-title">🗂️ Browser Gallery</span>
                                    <span className="item-desc">Browse your saved templates</span>
                                </div>
                            </div>
                            <div className="dropdown-item" onClick={handleImportJSON}>
                                <div className="item-info">
                                    <span className="item-title">📁 Import from JSON</span>
                                    <span className="item-desc">Load a saved template file</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="template-dropdown-container">
                    <button
                        className="header-btn secondary"
                        onClick={() => {
                            setShowSaveDropdown(!showSaveDropdown);
                            setShowTemplateDropdown(false);
                        }}
                    >
                        <span>Save</span>
                    </button>

                    {showSaveDropdown && (
                        <div className="template-dropdown">
                            <div className="dropdown-item" onClick={handleSaveAsTemplate}>
                                <div className="item-info">
                                    <span className="item-title">💾 Save to Browser</span>
                                    <span className="item-desc">Store in local storage</span>
                                </div>
                            </div>
                            <div className="dropdown-item" onClick={handleExportJSON}>
                                <div className="item-info">
                                    <span className="item-title">📥 Export as JSON</span>
                                    <span className="item-desc">Download template file</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Hidden file input for import */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
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
                        className="header-btn secondary"
                        onClick={() => showDialog({
                            type: 'alert',
                            title: '⌨️ Keyboard Shortcuts',
                            message: `
• Delete / Backspace : Remove selected element
• Ctrl + D : Duplicate element
• Ctrl + C : Copy element
• Ctrl + V : Paste element
• Ctrl + Z : Undo
• Ctrl + Y : Redo
• Arrow Up/Down : Move element
• Escape : Deselect
                            `,
                        })}
                    >
                        <span>Help</span>
                    </button>
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

                    <div className="header-divider" />

                    <button
                        className={`header-btn icon-only ${isPropertiesOpen ? 'active' : ''}`}
                        onClick={onToggleProperties}
                        title="Toggle Properties"
                    >
                        <span>⚙</span>
                    </button>
                </div>
            </div>

            <JsonPreviewModal isOpen={isJsonOpen} onClose={() => setIsJsonOpen(false)} />
            <TemplateGalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />
        </header>
    );
};

export default EditorHeader;

