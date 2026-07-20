/**
 * When window/screen capture includes browser chrome, shift the crop window up by
 * this many CSS pixels (scaled by DPR) so bottom chrome is excluded and the top
 * of the page is not clipped.
 */
export declare const VIEWPORT_CROP_BOTTOM_INSET_PX = 3;
/**
 * Compute a source crop that keeps the page viewport and drops browser chrome
 * when the capture is larger than the layout viewport (window / screen shares).
 *
 * Heuristic: browser chrome sits above the page content; horizontal overflow is centered.
 * Tries device-pixel and CSS-pixel viewport sizes and picks the first that fits.
 * Applies a small upward shift (`VIEWPORT_CROP_BOTTOM_INSET_PX`) to drop bottom chrome.
 */
export declare function resolveViewportCropRect(options: {
    captureWidth: number;
    captureHeight: number;
    viewportWidth: number;
    viewportHeight: number;
    devicePixelRatio: number;
    bottomInsetPx?: number;
}): {
    sx: number;
    sy: number;
    sw: number;
    sh: number;
};
