import { z } from 'zod';
/** Max decoded PNG size accepted from the client (~5 MiB). */
export declare const BUGFREEDBACK_MAX_SCREENSHOT_BYTES: number;
export declare const bugfreedbackSubmitSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodDefault<z.ZodString>;
    email: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
    screenshotBase64: z.ZodOptional<z.ZodString>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    idempotencyKey: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    metadata: Record<string, unknown>;
    description: string;
    email?: string | undefined;
    screenshotBase64?: string | undefined;
    idempotencyKey?: string | undefined;
}, {
    title: string;
    metadata?: Record<string, unknown> | undefined;
    description?: string | undefined;
    email?: string | undefined;
    screenshotBase64?: string | undefined;
    idempotencyKey?: string | undefined;
}>;
export type FeedbackPayload = {
    title: string;
    description: string;
    email?: string;
    metadata: Record<string, unknown>;
};
export declare class BugfreedbackScreenshotDecodeError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare function decodeFeedbackScreenshotBase64(value: string): Buffer;
