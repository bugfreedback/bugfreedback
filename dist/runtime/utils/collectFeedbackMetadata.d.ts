import { getFeedbackConsoleRing } from './feedbackConsoleRing.js';
export type FeedbackMetadata = {
    url: string;
    path: string;
    viewport: {
        width: number;
        height: number;
    };
    devicePixelRatio: number;
    language: string;
    userAgent: string;
    platform: string;
    appVersion: string;
    deployEnvironment: string;
    userId: string | null;
    username: string | null;
    email: string | null;
    capturedAt: string;
    console: ReturnType<typeof getFeedbackConsoleRing>;
};
export declare function collectFeedbackMetadata(options: {
    appVersion: string;
    deployEnvironment: string;
    user?: {
        id?: string;
        username?: string | null;
        email?: string | null;
    } | null;
}): FeedbackMetadata;
