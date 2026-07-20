export type BugfreedbackReporter = {
    id?: string;
    username?: string | null;
    email?: string | null;
};
export type BugfreedbackAuthProvider = {
    getToken: () => string | null | undefined;
    getUser?: () => BugfreedbackReporter | null | undefined;
};
/**
 * Host apps call this from a Nuxt plugin to supply JWT / session accessors.
 *
 * @example
 * ```ts
 * export default defineNuxtPlugin(() => {
 *   const auth = useAuth()
 *   provideBugfreedbackAuth({
 *     getToken: () => auth.getToken(),
 *     getUser: () => auth.user.value,
 *   })
 * })
 * ```
 */
export declare function provideBugfreedbackAuth(provider: BugfreedbackAuthProvider): void;
export declare function useBugfreedbackAuth(): BugfreedbackAuthProvider;
