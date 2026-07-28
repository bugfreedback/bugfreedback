import type { CaptureBrowser, CaptureEnvironment, CaptureOs } from './detectCaptureEnvironment'
import { detectCaptureEnvironment } from './detectCaptureEnvironment'

export type CaptureMethod = 'display-media' | 'file-attach'

export type CaptureSupportEntry = {
  /** `${browser}:${os}` when fully classified. */
  key: string | null
  method: CaptureMethod
  /** True when a screen-share permission overlay applies. */
  permissionGuide: boolean
  /** True when OEM/OS attach help (?) is offered. */
  attachHelp: boolean
}

const DESKTOP_OS = new Set<CaptureOs>(['windows', 'linux', 'macos'])
const MOBILE_OS = new Set<CaptureOs>(['ios', 'android'])
const SUPPORTED_BROWSERS = new Set<CaptureBrowser>(['chrome', 'edge', 'firefox', 'safari'])

function supportKey(env: CaptureEnvironment): string | null {
  if (!SUPPORTED_BROWSERS.has(env.browser)) {
    return null
  }
  if (env.browser === 'safari' && env.os !== 'macos' && env.os !== 'ios') {
    return null
  }
  if (env.browser === 'edge' && MOBILE_OS.has(env.os)) {
    return null
  }
  if (!DESKTOP_OS.has(env.os) && !MOBILE_OS.has(env.os)) {
    return null
  }
  return `${env.browser}:${env.os}`
}

/**
 * Mobile/tablet platforms cannot use getDisplayMedia reliably; use file attach instead.
 */
export function usesScreenshotFileAttach(os: CaptureOs): boolean {
  return os === 'ios' || os === 'android'
}

export function isDisplayMediaCaptureSupported(userAgent: string): boolean {
  const env = detectCaptureEnvironment(userAgent)
  return DESKTOP_OS.has(env.os) && SUPPORTED_BROWSERS.has(env.browser)
    && (env.browser !== 'safari' || env.os === 'macos')
    && env.browser !== 'unknown'
}

export function resolveCaptureSupport(env: CaptureEnvironment): CaptureSupportEntry {
  const key = supportKey(env)

  if (usesScreenshotFileAttach(env.os)) {
    return {
      key,
      method: 'file-attach',
      permissionGuide: false,
      attachHelp: key !== null,
    }
  }

  if (DESKTOP_OS.has(env.os) && key) {
    return {
      key,
      method: 'display-media',
      permissionGuide: true,
      attachHelp: false,
    }
  }

  return {
    key: null,
    method: 'display-media',
    permissionGuide: false,
    attachHelp: false,
  }
}

/** Inventory for tests — one entry per supported browser/OS pair. */
export function __captureSupportKeysForTests(): Array<{ key: string, method: CaptureMethod }> {
  const keys: Array<{ key: string, method: CaptureMethod }> = [
    { key: 'chrome:windows', method: 'display-media' },
    { key: 'chrome:linux', method: 'display-media' },
    { key: 'chrome:macos', method: 'display-media' },
    { key: 'chrome:ios', method: 'file-attach' },
    { key: 'chrome:android', method: 'file-attach' },
    { key: 'edge:windows', method: 'display-media' },
    { key: 'edge:linux', method: 'display-media' },
    { key: 'edge:macos', method: 'display-media' },
    { key: 'firefox:windows', method: 'display-media' },
    { key: 'firefox:linux', method: 'display-media' },
    { key: 'firefox:macos', method: 'display-media' },
    { key: 'firefox:ios', method: 'file-attach' },
    { key: 'firefox:android', method: 'file-attach' },
    { key: 'safari:macos', method: 'display-media' },
    { key: 'safari:ios', method: 'file-attach' },
  ]
  return keys
}

export function resolveCaptureSupportFromUserAgent(userAgent: string): CaptureSupportEntry {
  return resolveCaptureSupport(detectCaptureEnvironment(userAgent))
}
