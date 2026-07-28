export declare const BUGFREEDBACK_ACCEPTED_IMAGE_MIME_TYPES: readonly ["image/png", "image/jpeg", "image/webp", "image/gif"];
export declare const BUGFREEDBACK_ACCEPTED_IMAGE_EXTENSIONS = ".png,.jpg,.jpeg,.webp,.gif";
export declare class BugfreedbackImageFileError extends Error {
    constructor(message: string);
}
/**
 * Read an image file, normalize to PNG data URL, and enforce size limits.
 * Uses canvas when available (browser); tests pass `encodePng` for Node.
 */
export declare function readImageFileAsDataUrl(file: File, options?: {
    maxBytes?: number;
    encodePng?: (dataUrl: string) => Promise<string>;
}): Promise<string>;
/** Estimate decoded byte length from a base64 data URL (no DOM). */
export declare function estimateDataUrlBytes(dataUrl: string): number;
