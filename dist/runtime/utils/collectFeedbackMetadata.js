import { getFeedbackConsoleRing } from "./feedbackConsoleRing.js";
export function collectFeedbackMetadata(options) {
  const href = typeof window !== "undefined" ? window.location.href : "";
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  return {
    url: href,
    path,
    viewport: {
      width: typeof window !== "undefined" ? window.innerWidth : 0,
      height: typeof window !== "undefined" ? window.innerHeight : 0
    },
    devicePixelRatio: typeof window !== "undefined" ? window.devicePixelRatio : 1,
    language: typeof navigator !== "undefined" ? navigator.language : "",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    platform: typeof navigator !== "undefined" ? navigator.platform : "",
    appVersion: options.appVersion,
    deployEnvironment: options.deployEnvironment,
    userId: options.user?.id ?? null,
    username: options.user?.username ?? null,
    email: options.user?.email ?? null,
    capturedAt: (/* @__PURE__ */ new Date()).toISOString(),
    console: getFeedbackConsoleRing()
  };
}
