/**
 * Pre-built Templates Index
 * Export all template presets for easy consumption
 */

export { invoiceTemplateAU } from './presets/invoice-au';
export { quoteTemplateAU } from './presets/quote-au';
export { complianceTemplate } from './presets/compliance';

// Re-export template manager utilities
export {
    createTemplate,
    templateToJSON,
    parseTemplateJSON,
    downloadTemplateAsFile,
    readTemplateFile,
    saveTemplateToStorage,
    getTemplatesFromStorage,
    deleteTemplateFromStorage,
    getTemplateById,
    TEMPLATE_VERSION,
    type Template,
    type TemplateMetadata,
} from './templateManager';
