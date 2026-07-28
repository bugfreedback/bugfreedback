import type { CaptureEnvironment } from './detectCaptureEnvironment.js';
export type CaptureArrowDirection = 'up' | 'down' | 'left' | 'right';
export type CaptureCardAnchor = 'center' | 'left' | 'right';
export type CapturePermissionGuide = {
    heading: string;
    steps: string[];
    /** True when falling back to generic top-center instructions. */
    isDefault: boolean;
    /** When false, the dashed target ring is hidden (e.g. Firefox on Windows). */
    showTarget: boolean;
    target: {
        topPercent: number;
        leftPercent: number;
    };
    card: {
        topPercent: number;
        leftPercent: number;
        anchor: CaptureCardAnchor;
    };
    arrow: CaptureArrowDirection;
};
export declare function resolveCapturePermissionGuide(env: CaptureEnvironment): CapturePermissionGuide;
/** Exposed for unit tests. */
export declare function __guideKeysForTests(): string[];
