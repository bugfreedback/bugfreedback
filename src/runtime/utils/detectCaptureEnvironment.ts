export type CaptureOs = 'macos' | 'windows' | 'linux' | 'ios' | 'android' | 'unknown'
export type CaptureBrowser = 'chrome' | 'edge' | 'firefox' | 'safari' | 'unknown'

export type CaptureEnvironment = {
  os: CaptureOs
  browser: CaptureBrowser
}

function normalizeUa(userAgent: string): string {
  return userAgent.toLowerCase()
}

export function detectCaptureOs(userAgent: string): CaptureOs {
  const ua = normalizeUa(userAgent)
  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios'
  }
  if (/android/.test(ua)) {
    return 'android'
  }
  if (/mac os x|macintosh/.test(ua)) {
    return 'macos'
  }
  if (/windows/.test(ua)) {
    return 'windows'
  }
  if (/linux|cros/.test(ua)) {
    return 'linux'
  }
  return 'unknown'
}

export function detectCaptureBrowser(userAgent: string): CaptureBrowser {
  const ua = normalizeUa(userAgent)

  // Order matters: Edge and Chrome both include "safari" in UA.
  if (/edg\//.test(ua) || / edg\//.test(ua)) {
    return 'edge'
  }
  if (/firefox\//.test(ua)) {
    return 'firefox'
  }
  if (/chrome\//.test(ua) || /crios\//.test(ua)) {
    return 'chrome'
  }
  if (/safari\//.test(ua) && !/chrome\//.test(ua) && !/chromium/.test(ua)) {
    return 'safari'
  }

  return 'unknown'
}

export function detectCaptureEnvironment(userAgent: string): CaptureEnvironment {
  return {
    os: detectCaptureOs(userAgent),
    browser: detectCaptureBrowser(userAgent),
  }
}
