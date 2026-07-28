function normalizeUa(userAgent) {
  return userAgent.toLowerCase();
}
export function detectCaptureOs(userAgent) {
  const ua = normalizeUa(userAgent);
  if (/iphone|ipad|ipod/.test(ua)) {
    return "ios";
  }
  if (/android/.test(ua)) {
    return "android";
  }
  if (/mac os x|macintosh/.test(ua)) {
    return "macos";
  }
  if (/windows/.test(ua)) {
    return "windows";
  }
  if (/linux|cros/.test(ua)) {
    return "linux";
  }
  return "unknown";
}
export function detectCaptureBrowser(userAgent) {
  const ua = normalizeUa(userAgent);
  if (/edg\//.test(ua) || / edg\//.test(ua)) {
    return "edge";
  }
  if (/firefox\//.test(ua) || /fxios\//.test(ua)) {
    return "firefox";
  }
  if (/chrome\//.test(ua) || /crios\//.test(ua)) {
    return "chrome";
  }
  if (/safari\//.test(ua) && !/chrome\//.test(ua) && !/chromium/.test(ua)) {
    return "safari";
  }
  return "unknown";
}
export function detectCaptureEnvironment(userAgent) {
  return {
    os: detectCaptureOs(userAgent),
    browser: detectCaptureBrowser(userAgent)
  };
}
