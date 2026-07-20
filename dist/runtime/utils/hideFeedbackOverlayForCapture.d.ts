/** Wait for two animation frames so CSS visibility updates paint before capture. */
export declare function waitForNextPaints(frames?: number): Promise<void>;
/**
 * Temporarily hide the feedback widget root so screen capture does not include
 * the launcher or panel. Restores prior inline styles afterward.
 */
export declare function withFeedbackOverlayHidden<T>(action: () => Promise<T>, options?: {
    rootId?: string;
    doc?: Document;
}): Promise<T>;
