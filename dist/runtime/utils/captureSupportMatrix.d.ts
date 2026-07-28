import type { CaptureEnvironment, CaptureOs } from './detectCaptureEnvironment.js';
export type CaptureMethod = 'display-media' | 'file-attach';
export type CaptureSupportEntry = {
    /** `${browser}:${os}` when fully classified. */
    key: string | null;
    method: CaptureMethod;
    /** True when a screen-share permission overlay applies. */
    permissionGuide: boolean;
    /** True when OEM/OS attach help (?) is offered. */
    attachHelp: boolean;
};
/**
 * Mobile/tablet platforms cannot use getDisplayMedia reliably; use file attach instead.
 */
export declare function usesScreenshotFileAttach(os: CaptureOs): boolean;
export declare function isDisplayMediaCaptureSupported(userAgent: string): boolean;
export declare function resolveCaptureSupport(env: CaptureEnvironment): CaptureSupportEntry;
/** Inventory for tests — one entry per supported browser/OS pair. */
export declare function __captureSupportKeysForTests(): Array<{
    key: string;
    method: CaptureMethod;
}>;
export declare function resolveCaptureSupportFromUserAgent(userAgent: string): CaptureSupportEntry;
