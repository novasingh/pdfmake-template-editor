/**
 * Dimension utilities for mm -> px conversion
 * Assuming standard 96 PPI for web displays
 */

const PPI = 96;
const MM_PER_INCH = 25.4;

export const mmToPx = (mm: number): number => {
    return (mm * PPI) / MM_PER_INCH;
};

export const pxToMm = (px: number): number => {
    return (px * MM_PER_INCH) / PPI;
};

export const A4_DIMENSIONS = {
    widthMm: 210,
    heightMm: 297,
    widthPx: mmToPx(210),
    heightPx: mmToPx(297),
};
