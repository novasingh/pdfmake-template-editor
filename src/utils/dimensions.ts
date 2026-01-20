/**
 * Dimension utilities for mm -> pt conversion
 * pdfmake uses points (1 inch = 72 points)
 * A4: 595.28 x 841.89 points
 */

const PPI = 72; // PDF points per inch (not screen pixels)
const MM_PER_INCH = 25.4;

/**
 * Convert mm to points (for pdfmake compatibility)
 */
export const mmToPt = (mm: number): number => {
    return (mm * PPI) / MM_PER_INCH;
};

/**
 * Convert mm to pixels (for screen display at 96 PPI)
 * This is used for the canvas to match the visual size of the PDF
 */
export const mmToPx = (mm: number): number => {
    return (mm * 96) / MM_PER_INCH;
};

export const pxToMm = (px: number): number => {
    return (px * MM_PER_INCH) / 96;
};

/**
 * A4 dimensions in points (matching pdfmake exactly)
 */
export const A4_DIMENSIONS = {
    widthMm: 210,
    heightMm: 297,
    // Use points for canvas dimensions for true WYSIWYG with PDF
    widthPt: 595.28,
    heightPt: 808.89,
    // Legacy pixel values for reference
    widthPx: mmToPx(210),
    heightPx: mmToPx(297),
};
