export type CaptureOs = 'macos' | 'windows' | 'linux' | 'ios' | 'android' | 'unknown';
export type CaptureBrowser = 'chrome' | 'edge' | 'firefox' | 'safari' | 'unknown';
export type CaptureEnvironment = {
    os: CaptureOs;
    browser: CaptureBrowser;
};
export declare function detectCaptureOs(userAgent: string): CaptureOs;
export declare function detectCaptureBrowser(userAgent: string): CaptureBrowser;
export declare function detectCaptureEnvironment(userAgent: string): CaptureEnvironment;
