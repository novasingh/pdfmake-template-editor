import React, { useState, useRef } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { useFullscreen } from '../hooks/useFullscreen';
import { usePDFExport } from '../hooks/usePDFExport';
import { useLocalization } from '../hooks/useLocalization';
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
    onSave?: () => void;
    onExport?: () => void;
    hideButtons?: {
        template?: boolean;
        save?: boolean;
        undo?: boolean;
        redo?: boolean;
        help?: boolean;
        fullscreen?: boolean;
        exportPdf?: boolean;
        json?: boolean;
    };
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
    onToggleSidebar,
    onToggleProperties,
    isSidebarOpen,
    isPropertiesOpen,
    onSave,
    onExport,
    hideButtons = {}
}) => {
    const { t } = useLocalization();
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
        onExport?.();
    };

    const handleLoadTemplate = (type: 'blank' | 'default') => {
        showDialog({
            type: 'confirm',
            title: t('Load Template', 'Load Template'),
            message: t('Are you sure you want to load a blank template? This will clear your current work.', 'Are you sure you want to load a blank template? This will clear your current work.'),
            confirmLabel: t('Load', 'Load'),
            onConfirm: () => {
                loadTemplate(type);
            }
        });
        setShowTemplateDropdown(false);
    };

    const handleLoadPrebuiltTemplate = (template: Template) => {
        showDialog({
            type: 'confirm',
            title: t('Load Pre-built Template', 'Load Pre-built Template'),
            message: `${t('Load', 'Load')} "${template.metadata.name}"? ${t('This will replace your current work.', 'This will replace your current work.')}`,
            confirmLabel: t('Load', 'Load'),
            onConfirm: () => {
                loadDocument(template.document);
            }
        });
        setShowTemplateDropdown(false);
    };

    const handleSaveAsTemplate = async () => {
        showDialog({
            type: 'prompt',
            title: t('Save Template', 'Save Template'),
            message: t('Enter template name:', 'Enter template name:'),
            defaultValue: t('My Template', 'My Template'),
            confirmLabel: t('Save', 'Save'),
            onConfirm: async (name) => {
                if (name) {
                    const thumbnail = await captureThumbnail('page-canvas');
                    const template = createTemplate(doc, name, { thumbnail });
                    saveTemplateToStorage(template);
                    showDialog({
                        type: 'alert',
                        title: t('Success', 'Success'),
                        message: `${t('Template', 'Template')} "${name}" ${t('saved to browser storage!', 'saved to browser storage!')}`
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
                title: t('Import Template', 'Import Template'),
                message: `${t('Load', 'Load')} template "${template.metadata.name}"? ${t('This will replace your current work.', 'This will replace your current work.')}`,
                confirmLabel: t('Import', 'Import'),
                onConfirm: () => {
                    loadDocument(template.document);
                    setShowTemplateDropdown(false);
                }
            });
        } else {
            showDialog({
                type: 'alert',
                title: t('Error', 'Error'),
                message: t('Failed to load template. Please check the file format.', 'Failed to load template. Please check the file format.')
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
                    title={t('Toggle Sidebar', 'Toggle Sidebar')}
                >
                    <span>☰</span>
                </button>

                <div className="header-divider" />

                {!hideButtons.template && (
                    <div className="template-dropdown-container">
                        <button
                            className="header-btn secondary"
                            onClick={() => {
                                setShowTemplateDropdown(!showTemplateDropdown);
                                setShowSaveDropdown(false);
                            }}
                        >
                            <span>{t('Templates', 'Templates')}</span>
                        </button>

                        {showTemplateDropdown && (
                            <div className="template-dropdown">
                                <div className="dropdown-section-title">{t('New', 'New')}</div>
                                <div className="dropdown-item" onClick={() => handleLoadTemplate('blank')}>
                                    <div className="item-info">
                                        <span className="item-title">{t('Blank Template', 'Blank Template')}</span>
                                        <span className="item-desc">{t('Start from scratch', 'Start from scratch')}</span>
                                    </div>
                                </div>

                                <div className="dropdown-section-title">{t('Pre-built (Australian)', 'Pre-built (Australian)')}</div>
                                <div className="dropdown-item" onClick={() => handleLoadPrebuiltTemplate(invoiceTemplateAU)}>
                                    <div className="item-info">
                                        <span className="item-title">📄 {t('Tax Invoice', 'Tax Invoice')}</span>
                                        <span className="item-desc">{t('ATO-compliant with GST', 'ATO-compliant with GST')}</span>
                                    </div>
                                </div>
                                <div className="dropdown-item" onClick={() => handleLoadPrebuiltTemplate(quoteTemplateAU)}>
                                    <div className="item-info">
                                        <span className="item-title">💼 {t('Quote / Proposal', 'Quote / Proposal')}</span>
                                        <span className="item-desc">{t('With terms & signature', 'With terms & signature')}</span>
                                    </div>
                                </div>
                                <div className="dropdown-item" onClick={() => handleLoadPrebuiltTemplate(complianceTemplate)}>
                                    <div className="item-info">
                                        <span className="item-title">✅ {t('Compliance Certificate', 'Compliance Certificate')}</span>
                                        <span className="item-desc">{t('Official document template', 'Official document template')}</span>
                                    </div>
                                </div>

                                <div className="dropdown-section-title">{t('Import / Browse', 'Import / Browse')}</div>
                                <div className="dropdown-item" onClick={() => {
                                    setIsGalleryOpen(true);
                                    setShowTemplateDropdown(false);
                                }}>
                                    <div className="item-info">
                                        <span className="item-title">🗂️ {t('Browser Gallery', 'Browser Gallery')}</span>
                                        <span className="item-desc">{t('Browse your saved templates', 'Browse your saved templates')}</span>
                                    </div>
                                </div>
                                <div className="dropdown-item" onClick={handleImportJSON}>
                                    <div className="item-info">
                                        <span className="item-title">📁 {t('Import from JSON', 'Import from JSON')}</span>
                                        <span className="item-desc">{t('Load a saved template file', 'Load a saved template file')}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!hideButtons.save && (
                    <div className="template-dropdown-container">
                        <button
                            className="header-btn secondary"
                            onClick={() => {
                                if (onSave) {
                                    onSave();
                                } else {
                                    setShowSaveDropdown(!showSaveDropdown);
                                    setShowTemplateDropdown(false);
                                }
                            }}
                        >
                            <span>{t('Save', 'Save')}</span>
                        </button>

                        {showSaveDropdown && (
                            <div className="template-dropdown">
                                <div className="dropdown-item" onClick={handleSaveAsTemplate}>
                                    <div className="item-info">
                                        <span className="item-title">💾 {t('Save to Browser', 'Save to Browser')}</span>
                                        <span className="item-desc">{t('Store in local storage', 'Store in local storage')}</span>
                                    </div>
                                </div>
                                <div className="dropdown-item" onClick={handleExportJSON}>
                                    <div className="item-info">
                                        <span className="item-title">📥 {t('Export as JSON', 'Export as JSON')}</span>
                                        <span className="item-desc">{t('Download template file', 'Download template file')}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="header-divider" />
                <div className="action-group">
                    {!hideButtons.undo && (
                        <button
                            className="header-btn secondary"
                            onClick={() => (useEditorStore as any).temporal.getState().undo()}
                            title={`${t('Undo', 'Undo')} (Ctrl+Z)`}
                        >
                            <span>{t('Undo', 'Undo')}</span>
                        </button>
                    )}
                    {!hideButtons.redo && (
                        <button
                            className="header-btn secondary"
                            onClick={() => (useEditorStore as any).temporal.getState().redo()}
                            title={`${t('Redo', 'Redo')} (Ctrl+Y)`}
                        >
                            <span>{t('Redo', 'Redo')}</span>
                        </button>
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
                    <span className="doc-title">{t('Untitled Template', 'Untitled Template')}</span>
                </div>
            </div>

            <div className="header-right">
                <div className="header-divider" />
                <div className="action-group">
                    {!hideButtons.help && (
                        <button
                            className="header-btn secondary"
                            onClick={() => showDialog({
                                type: 'alert',
                                title: `⌨️ ${t('Keyboard Shortcuts', 'Keyboard Shortcuts')}`,
                                message: `
• ${t('Delete / Backspace', 'Delete / Backspace')} : ${t('Remove selected element', 'Remove selected element')}
• Ctrl + D : ${t('Duplicate element', 'Duplicate element')}
• Ctrl + C : ${t('Copy element', 'Copy element')}
• Ctrl + V : ${t('Paste element', 'Paste element')}
• Ctrl + Z : ${t('Undo', 'Undo')}
• Ctrl + Y : ${t('Redo', 'Redo')}
• ${t('Arrow Up/Down', 'Arrow Up/Down')} : ${t('Move element', 'Move element')}
• ${t('Escape', 'Escape')} : ${t('Deselect', 'Deselect')}
                                `,
                            })}
                        >
                            <span>{t('Help', 'Help')}</span>
                        </button>
                    )}
                    {!hideButtons.fullscreen && (
                        <button
                            className={`header-btn secondary ${isFullscreen ? 'active' : ''}`}
                            onClick={toggleFullscreen}
                            title={t('Toggle Fullscreen', 'Toggle Fullscreen')}
                        >
                            {isFullscreen ? t('Exit Fullscreen', 'Exit Fullscreen') : t('Fullscreen', 'Fullscreen')}
                        </button>
                    )}
                    {!hideButtons.json && (
                        <button
                            className="header-btn secondary"
                            onClick={() => setIsJsonOpen(true)}
                        >
                            {t('JSON', 'JSON')}
                        </button>
                    )}
                    {!hideButtons.exportPdf && (
                        <button
                            className="header-btn primary"
                            onClick={handlePrint}
                        >
                            <span>{t('Print PDF', 'Print PDF')}</span>
                        </button>
                    )}

                    <div className="header-divider" />

                    <button
                        className={`header-btn icon-only ${isPropertiesOpen ? 'active' : ''}`}
                        onClick={onToggleProperties}
                        title={t('Toggle Properties', 'Toggle Properties')}
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

