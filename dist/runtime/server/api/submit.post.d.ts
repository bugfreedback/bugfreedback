/**
 * Hosts may set event.context.bugfreedbackReporter after their own auth middleware.
 */
export type BugfreedbackEventReporter = {
    id?: string;
    username?: string | null;
    email?: string | null;
};
declare const _default: import("h3").EventHandler<import("h3").EventHandlerRequest, Promise<{
    ok: boolean;
    id: string;
    url: string | null;
    screenshotUrl: string | null;
}>>;
export default _default;
