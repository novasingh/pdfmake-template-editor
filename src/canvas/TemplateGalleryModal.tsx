import React from 'react';
import { getTemplatesFromStorage, deleteTemplateFromStorage, Template } from '../templates/templateManager';
import { useEditorStore } from '../store/useEditorStore';
import '../styles/TemplateGallery.css';

interface TemplateGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({ isOpen, onClose }) => {
    const { loadDocument } = useEditorStore();
    const [templates, setTemplates] = React.useState<Template[]>([]);

    React.useEffect(() => {
        if (isOpen) {
            setTemplates(getTemplatesFromStorage());
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleLoad = (template: Template) => {
        if (confirm(`Load template "${template.metadata.name}"? This will replace your current work.`)) {
            loadDocument(template.document);
            onClose();
        }
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this template from your browser?')) {
            deleteTemplateFromStorage(id);
            setTemplates(getTemplatesFromStorage());
        }
    };

    return (
        <div className="gallery-overlay" onClick={onClose}>
            <div className="gallery-modal" onClick={e => e.stopPropagation()}>
                <div className="gallery-header">
                    <h2>Template Gallery</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="gallery-content">
                    {templates.length === 0 ? (
                        <div className="no-templates">
                            <p>No saved templates found in your browser.</p>
                            <p>Save your current work as a template to see it here!</p>
                        </div>
                    ) : (
                        <div className="template-grid">
                            {templates.map(template => (
                                <div
                                    key={template.metadata.id}
                                    className="template-card"
                                    onClick={() => handleLoad(template)}
                                >
                                    <div className="template-preview">
                                        {template.metadata.thumbnail ? (
                                            <img src={template.metadata.thumbnail} alt={template.metadata.name} />
                                        ) : (
                                            <div className="preview-placeholder">No Preview</div>
                                        )}
                                        <div className="revision-badge">Rev {template.metadata.revision}</div>
                                    </div>
                                    <div className="template-info">
                                        <div className="template-name">{template.metadata.name}</div>
                                        <div className="template-meta">
                                            {new Date(template.metadata.updatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <button
                                        className="delete-card-btn"
                                        onClick={(e) => handleDelete(e, template.metadata.id)}
                                        title="Delete Template"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TemplateGalleryModal;
