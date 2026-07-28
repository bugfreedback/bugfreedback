import { describe, expect, it } from 'vitest'
import {
  __captureSupportKeysForTests,
  isDisplayMediaCaptureSupported,
  resolveCaptureSupport,
  usesScreenshotFileAttach,
} from '../src/runtime/utils/captureSupportMatrix'
import { detectCaptureEnvironment } from '../src/runtime/utils/detectCaptureEnvironment'

describe('captureSupportMatrix', () => {
  it('lists display-media for desktop and file-attach for mobile', () => {
    const keys = __captureSupportKeysForTests().map(entry => `${entry.key}:${entry.method}`).sort()
    expect(keys).toEqual([
      'chrome:android:file-attach',
      'chrome:ios:file-attach',
      'chrome:linux:display-media',
      'chrome:macos:display-media',
      'chrome:windows:display-media',
      'edge:linux:display-media',
      'edge:macos:display-media',
      'edge:windows:display-media',
      'firefox:android:file-attach',
      'firefox:ios:file-attach',
      'firefox:linux:display-media',
      'firefox:macos:display-media',
      'firefox:windows:display-media',
      'safari:ios:file-attach',
      'safari:macos:display-media',
    ])
  })

  it('uses file attach on iOS and Android', () => {
    expect(usesScreenshotFileAttach('ios')).toBe(true)
    expect(usesScreenshotFileAttach('android')).toBe(true)
    expect(usesScreenshotFileAttach('macos')).toBe(false)
  })

  it('resolves Android Chrome as file-attach with attach help', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    const env = detectCaptureEnvironment(ua)
    expect(resolveCaptureSupport(env)).toMatchObject({
      key: 'chrome:android',
      method: 'file-attach',
      permissionGuide: false,
      attachHelp: true,
    })
    expect(isDisplayMediaCaptureSupported(ua)).toBe(false)
  })

  it('resolves desktop Chrome as display-media with permission guide', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    const env = detectCaptureEnvironment(ua)
    expect(resolveCaptureSupport(env)).toMatchObject({
      key: 'chrome:windows',
      method: 'display-media',
      permissionGuide: true,
      attachHelp: false,
    })
    expect(isDisplayMediaCaptureSupported(ua)).toBe(true)
  })
})
