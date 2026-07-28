import { detectCaptureEnvironment } from "./detectCaptureEnvironment.js";
const DESKTOP_OS = /* @__PURE__ */ new Set(["windows", "linux", "macos"]);
const MOBILE_OS = /* @__PURE__ */ new Set(["ios", "android"]);
const SUPPORTED_BROWSERS = /* @__PURE__ */ new Set(["chrome", "edge", "firefox", "safari"]);
function supportKey(env) {
  if (!SUPPORTED_BROWSERS.has(env.browser)) {
    return null;
  }
  if (env.browser === "safari" && env.os !== "macos" && env.os !== "ios") {
    return null;
  }
  if (env.browser === "edge" && MOBILE_OS.has(env.os)) {
    return null;
  }
  if (!DESKTOP_OS.has(env.os) && !MOBILE_OS.has(env.os)) {
    return null;
  }
  return `${env.browser}:${env.os}`;
}
export function usesScreenshotFileAttach(os) {
  return os === "ios" || os === "android";
}
export function isDisplayMediaCaptureSupported(userAgent) {
  const env = detectCaptureEnvironment(userAgent);
  return DESKTOP_OS.has(env.os) && SUPPORTED_BROWSERS.has(env.browser) && (env.browser !== "safari" || env.os === "macos") && env.browser !== "unknown";
}
export function resolveCaptureSupport(env) {
  const key = supportKey(env);
  if (usesScreenshotFileAttach(env.os)) {
    return {
      key,
      method: "file-attach",
      permissionGuide: false,
      attachHelp: key !== null
    };
  }
  if (DESKTOP_OS.has(env.os) && key) {
    return {
      key,
      method: "display-media",
      permissionGuide: true,
      attachHelp: false
    };
  }
  return {
    key: null,
    method: "display-media",
    permissionGuide: false,
    attachHelp: false
  };
}
export function __captureSupportKeysForTests() {
  const keys = [
    { key: "chrome:windows", method: "display-media" },
    { key: "chrome:linux", method: "display-media" },
    { key: "chrome:macos", method: "display-media" },
    { key: "chrome:ios", method: "file-attach" },
    { key: "chrome:android", method: "file-attach" },
    { key: "edge:windows", method: "display-media" },
    { key: "edge:linux", method: "display-media" },
    { key: "edge:macos", method: "display-media" },
    { key: "firefox:windows", method: "display-media" },
    { key: "firefox:linux", method: "display-media" },
    { key: "firefox:macos", method: "display-media" },
    { key: "firefox:ios", method: "file-attach" },
    { key: "firefox:android", method: "file-attach" },
    { key: "safari:macos", method: "display-media" },
    { key: "safari:ios", method: "file-attach" }
  ];
  return keys;
}
export function resolveCaptureSupportFromUserAgent(userAgent) {
  return resolveCaptureSupport(detectCaptureEnvironment(userAgent));
}
