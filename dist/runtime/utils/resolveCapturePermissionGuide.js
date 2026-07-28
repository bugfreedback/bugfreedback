const SUPPORTED_OS = /* @__PURE__ */ new Set(["windows", "linux", "macos"]);
const SUPPORTED_BROWSERS = /* @__PURE__ */ new Set(["chrome", "edge", "firefox", "safari"]);
function isSupportedEnv(env) {
  return SUPPORTED_OS.has(env.os) && SUPPORTED_BROWSERS.has(env.browser) && (env.browser !== "safari" || env.os === "macos");
}
function guideKey(env) {
  if (!isSupportedEnv(env)) {
    return null;
  }
  return `${env.browser}:${env.os}`;
}
function defaultGuide() {
  return {
    heading: "Allow screen capture",
    isDefault: true,
    showTarget: true,
    target: { topPercent: 16, leftPercent: 50 },
    card: { topPercent: 8, leftPercent: 50, anchor: "center" },
    arrow: "down",
    steps: [
      "Use the browser permission dialog to share **this tab** only.",
      "Confirm with **Allow**, **Share**, or the equivalent button in your browser."
    ]
  };
}
function firefoxGuide(os) {
  const isWindows = os === "windows";
  const isLinux = os === "linux";
  const isMacos = os === "macos";
  const usesCenterPortal = isLinux || isMacos;
  let steps;
  if (isMacos) {
    steps = [
      "Look below the address bar for the Firefox permission prompt.",
      "In the share dialog, choose **This Tab** instead of **Share this Window**.",
      "Click **Share** in the middle of the window to continue."
    ];
  } else if (isLinux) {
    steps = [
      "Look below the address bar for the Firefox permission prompt.",
      "If shown, select **Use operating system settings**, then click **Allow**.",
      "In the system dialog, choose the browser window and confirm with **Share** or **Allow**."
    ];
  } else {
    steps = [
      "Look below the address bar for the Firefox permission prompt.",
      "Select **This Tab**, then click **Allow**."
    ];
  }
  return {
    heading: "Allow screen sharing for this tab",
    isDefault: false,
    showTarget: !isWindows,
    target: usesCenterPortal ? { topPercent: 43, leftPercent: 50 } : { topPercent: 11, leftPercent: 40 },
    card: { topPercent: 8, leftPercent: 50, anchor: "center" },
    arrow: "left",
    steps
  };
}
function chromiumCenterGuide(os, browserLabel) {
  const shareLabel = os === "macos" ? "Share" : "Allow";
  const tabHint = os === "macos" && browserLabel === "Chrome" ? "Chrome Tab" : "This tab";
  const steps = os === "macos" && browserLabel === "Chrome" ? [
    `In the ${browserLabel} share dialog, choose **${tabHint}**.`,
    `Click **${shareLabel}** to continue.`,
    "If macOS asks for **Screen Recording** access, enable it for Chrome in System Settings, then try again."
  ] : [
    `In the ${browserLabel} share dialog, choose **${tabHint}**.`,
    `Click **${shareLabel}** to continue.`
  ];
  return {
    heading: "Allow this tab to be shared",
    isDefault: false,
    showTarget: true,
    target: { topPercent: 43, leftPercent: 50 },
    card: { topPercent: 58, leftPercent: 50, anchor: "center" },
    arrow: "up",
    steps
  };
}
function safariMacGuide() {
  return {
    heading: "Allow Safari to share this window",
    isDefault: false,
    showTarget: true,
    target: { topPercent: 42, leftPercent: 50 },
    card: { topPercent: 57, leftPercent: 50, anchor: "center" },
    arrow: "up",
    steps: [
      "When Safari asks what to share, choose **Window** instead of the entire screen.",
      "Hover the browser window and click **Share This Window**, or select it in the system picker.",
      "Click **Allow** or **Share** to continue."
    ]
  };
}
const GUIDE_BY_KEY = {
  "firefox:windows": firefoxGuide("windows"),
  "firefox:linux": firefoxGuide("linux"),
  "firefox:macos": firefoxGuide("macos"),
  "chrome:windows": chromiumCenterGuide("windows", "Chrome"),
  "chrome:linux": chromiumCenterGuide("linux", "Chrome"),
  "chrome:macos": chromiumCenterGuide("macos", "Chrome"),
  "edge:windows": chromiumCenterGuide("windows", "Edge"),
  "edge:linux": chromiumCenterGuide("linux", "Edge"),
  "edge:macos": chromiumCenterGuide("macos", "Edge"),
  "safari:macos": safariMacGuide()
};
export function resolveCapturePermissionGuide(env) {
  const key = guideKey(env);
  if (!key) {
    return defaultGuide();
  }
  return GUIDE_BY_KEY[key] ?? defaultGuide();
}
export function __guideKeysForTests() {
  return Object.keys(GUIDE_BY_KEY);
}
