import type { MobileDeviceProfile } from './detectMobileDevice.js';
export type ScreenshotAttachHelp = {
    heading: string;
    steps: string[];
    note?: string;
};
export declare function resolveScreenshotAttachHelp(userAgent: string, profile?: MobileDeviceProfile): ScreenshotAttachHelp;
export declare function resolveScreenshotAttachHelpFromUserAgent(userAgent: string): ScreenshotAttachHelp;
