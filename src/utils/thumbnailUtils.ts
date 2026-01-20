import { toPng } from 'html-to-image';

/**
 * Capture a thumbnail of the editor canvas
 * @param elementId The ID of the canvas element to capture
 * @returns Base64 encoded PNG image
 */
export const captureThumbnail = async (elementId: string = 'page-canvas'): Promise<string | undefined> => {
    const element = document.getElementById(elementId);
    if (!element) return undefined;

    try {
        // Capture as PNG
        // We use a slightly lower quality/scale to keep metadata small
        const dataUrl = await toPng(element, {
            quality: 0.8,
            pixelRatio: 0.5, // 50% scale for thumbnail
            skipFonts: true, // Speeds up capture significantly
            filter: (node) => {
                // Filter out UI elements if any are inside the canvas
                if (node instanceof HTMLElement && node.classList.contains('block-actions-toolbar')) {
                    return false;
                }
                return true;
            }
        });

        return dataUrl;
    } catch (error) {
        console.error('Thumbnail capture failed:', error);
        return undefined;
    }
};
