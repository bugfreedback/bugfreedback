export declare const FEEDBACK_CONSOLE_RING_MAX = 40;
export type FeedbackConsoleEntry = {
    level: 'log' | 'info' | 'warn' | 'error';
    message: string;
    timestamp: string;
};
export declare function pushFeedbackConsoleEntry(level: FeedbackConsoleEntry['level'], args: unknown[]): void;
export declare function getFeedbackConsoleRing(): FeedbackConsoleEntry[];
/** Test helper — clears the in-memory ring. */
export declare function clearFeedbackConsoleRing(): void;
