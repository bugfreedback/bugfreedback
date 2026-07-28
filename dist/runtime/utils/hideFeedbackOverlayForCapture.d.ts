/** Wait for two animation frames so CSS visibility updates paint before capture. */
export declare function waitForNextPaints(frames?: number): Promise<void>;
/** Immediately hide the teleported capture-permission guide (lives outside #bugfreedback-root). */
export declare function hideCaptureGuideElement(doc?: Document): void;
/**
 * Hide the capture guide and wait for the browser to paint without it before grabbing a frame.
 */
export declare function awaitCaptureGuideDismissed(options?: {
    doc?: Document;
    paintFrames?: number;
}): Promise<void>;
/**
 * Temporarily hide the feedback widget root so screen capture does not include
 * the launcher or panel. Restores prior inline styles afterward.
 */
export declare function withFeedbackOverlayHidden<T>(action: () => Promise<T>, options?: {
    rootId?: string;
    doc?: Document;
}): Promise<T>;
