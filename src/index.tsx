import React from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import TemplateEditor from './editor/TemplateEditor';

const PdfEditor: React.FC = () => {
  // Keep pdfMake vfs loading for image preview/export if consumer needs it.
  React.useEffect(() => {
    import('pdfmake/build/vfs_fonts').then(pdfFonts => {
      try {
        // @ts-ignore
        (pdfMake as any).vfs = pdfFonts.default?.pdfMake?.vfs || pdfFonts.pdfMake?.vfs || {};
      } catch (e) {
        // ignore
      }
    }).catch(() => { });
  }, []);

  return <TemplateEditor />;
};

export default PdfEditor;