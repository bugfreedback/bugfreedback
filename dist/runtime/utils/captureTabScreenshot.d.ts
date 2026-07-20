/**
 * Capture the current tab (preferred) via the Screen Capture API and return a PNG data URL.
 * Crops to the layout viewport when the frame includes browser chrome.
 * Stops all media tracks immediately after grabbing one frame.
 */
export declare function captureTabScreenshot(): Promise<string>;
