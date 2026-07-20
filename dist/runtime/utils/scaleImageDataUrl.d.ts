/**
 * Scale a PNG/JPEG data URL by `scale` (e.g. 0.75) using canvas drawImage.
 * Returns the original string when scale is ~1 or the image cannot be decoded.
 */
export declare function scaleImageDataUrl(dataUrl: string, scale: number): Promise<string>;
/** Pure size helper for tests (no DOM). */
export declare function scaleDimensions(width: number, height: number, scale: number): {
    width: number;
    height: number;
};
