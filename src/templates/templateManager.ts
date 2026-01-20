/**
 * Template Manager for pdfmake-template-editor
 * Handles saving, loading, importing, and exporting templates
 */

import { DocumentSchema, PageSettings, EditorElement } from '../types/editor';

export interface TemplateMetadata {
    id: string;
    name: string;
    description?: string;
    version: string; // Schema version
    revision: number; // Template version/revision count
    thumbnail?: string; // Base64 preview
    createdAt: string;
    updatedAt: string;
    category?: 'invoice' | 'quote' | 'compliance' | 'custom';
    locale?: 'en-AU' | 'en-US' | 'en-GB';
}

export interface Template {
    metadata: TemplateMetadata;
    document: DocumentSchema;
}

/**
 * Current template schema version for forward compatibility
 */
export const TEMPLATE_VERSION = '1.0.0';

/**
 * Generate a unique ID for templates
 */
export const generateTemplateId = (): string => {
    return `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a template object from the current document
 */
export const createTemplate = (
    document: DocumentSchema,
    name: string,
    options?: Partial<TemplateMetadata>
): Template => {
    const now = new Date().toISOString();

    return {
        metadata: {
            id: options?.id || generateTemplateId(),
            name,
            description: options?.description,
            version: TEMPLATE_VERSION,
            revision: options?.revision || 1,
            thumbnail: options?.thumbnail,
            createdAt: options?.createdAt || now,
            updatedAt: now,
            category: options?.category || 'custom',
            locale: options?.locale || 'en-AU',
        },
        document: JSON.parse(JSON.stringify(document)), // Deep clone
    };
};

/**
 * Serialize template to JSON string
 */
export const templateToJSON = (template: Template): string => {
    return JSON.stringify(template, null, 2);
};

/**
 * Parse JSON string to template
 */
export const parseTemplateJSON = (json: string): Template | null => {
    try {
        const parsed = JSON.parse(json);

        // Validate required fields
        if (!parsed.metadata?.id || !parsed.metadata?.name || !parsed.document) {
            console.error('Invalid template: missing required fields');
            return null;
        }

        // Validate document structure
        if (!parsed.document.page || !parsed.document.elements || !parsed.document.rootElementIds) {
            console.error('Invalid template: malformed document structure');
            return null;
        }

        return parsed as Template;
    } catch (error) {
        console.error('Failed to parse template JSON:', error);
        return null;
    }
};

/**
 * Download template as a JSON file
 */
export const downloadTemplateAsFile = (template: Template): void => {
    const json = templateToJSON(template);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.metadata.name.toLowerCase().replace(/\s+/g, '-')}.template.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Read a template file and parse it
 */
export const readTemplateFile = (file: File): Promise<Template | null> => {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target?.result as string;
            const template = parseTemplateJSON(content);
            resolve(template);
        };

        reader.onerror = () => {
            console.error('Failed to read template file');
            resolve(null);
        };

        reader.readAsText(file);
    });
};

/**
 * Local storage key for saved templates
 */
const TEMPLATES_STORAGE_KEY = 'pdfmake-editor-templates';

/**
 * Save template to local storage
 */
export const saveTemplateToStorage = (template: Template): void => {
    const templates = getTemplatesFromStorage();

    // Update if exists, otherwise add
    const existingIndex = templates.findIndex(t => t.metadata.id === template.metadata.id);
    if (existingIndex !== -1) {
        // Increment revision if we are overriding
        const existing = templates[existingIndex];
        template.metadata.revision = (existing.metadata.revision || 0) + 1;
        template.metadata.createdAt = existing.metadata.createdAt; // Keep original created at
        templates[existingIndex] = template;
    } else {
        templates.push(template);
    }

    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
};

/**
 * Get all templates from local storage
 */
export const getTemplatesFromStorage = (): Template[] => {
    try {
        const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

/**
 * Delete a template from local storage
 */
export const deleteTemplateFromStorage = (templateId: string): void => {
    const templates = getTemplatesFromStorage();
    const filtered = templates.filter(t => t.metadata.id !== templateId);
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(filtered));
};

/**
 * Get a single template by ID from storage
 */
export const getTemplateById = (templateId: string): Template | null => {
    const templates = getTemplatesFromStorage();
    return templates.find(t => t.metadata.id === templateId) || null;
};
