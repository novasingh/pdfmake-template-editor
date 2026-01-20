import { useCallback } from 'react';
import { exportToPdfMake } from '../exporters/pdfmakeMapper';
import { useEditorStore } from '../store/useEditorStore';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DocumentSchema } from '../types/editor';

// Initialize fonts if needed (singleton pattern safe)
if (pdfFonts && (pdfFonts as any).pdfMake) {
    (pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;
}

export const usePDFExport = () => {
    const exportPDF = useCallback((doc: DocumentSchema, filename: string = 'document.pdf') => {
        const { variables } = useEditorStore.getState();
        try {
            const docDefinition = exportToPdfMake(doc, variables);
            (pdfMake as any).createPdf(docDefinition).download(filename);
        } catch (error) {
            console.error('PDF Generation failed:', error);
            alert('Could not generate PDF. Please check the console for details.');
        }
    }, []);

    return { exportPDF };
};
