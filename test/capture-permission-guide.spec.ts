import { describe, expect, it } from 'vitest'
import {
  detectCaptureBrowser,
  detectCaptureEnvironment,
  detectCaptureOs,
} from '../src/runtime/utils/detectCaptureEnvironment'
import { resolveCapturePermissionGuide } from '../src/runtime/utils/resolveCapturePermissionGuide'

describe('detectCaptureEnvironment', () => {
  it('detects Chrome on macOS', () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    expect(detectCaptureEnvironment(ua)).toEqual({ os: 'macos', browser: 'chrome' })
  })

  it('detects Edge on Windows', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
    expect(detectCaptureEnvironment(ua)).toEqual({ os: 'windows', browser: 'edge' })
  })

  it('detects Firefox on Linux', () => {
    const ua = 'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0'
    expect(detectCaptureEnvironment(ua)).toEqual({ os: 'linux', browser: 'firefox' })
  })

  it('detects Safari on macOS', () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
    expect(detectCaptureEnvironment(ua)).toEqual({ os: 'macos', browser: 'safari' })
  })

  it('detects iOS Safari', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    expect(detectCaptureOs(ua)).toBe('ios')
    expect(detectCaptureBrowser(ua)).toBe('safari')
  })
})

describe('resolveCapturePermissionGuide', () => {
  it('returns Chrome-specific copy on macOS', () => {
    const guide = resolveCapturePermissionGuide({ os: 'macos', browser: 'chrome' })
    expect(guide.placement).toBe('center-modal')
    expect(guide.steps.join(' ')).toMatch(/Share/)
    expect(guide.steps.join(' ')).toMatch(/Chrome Tab|This tab/i)
  })

  it('returns Firefox-specific copy', () => {
    const guide = resolveCapturePermissionGuide({ os: 'linux', browser: 'firefox' })
    expect(guide.steps.join(' ')).toMatch(/Firefox/)
    expect(guide.steps.join(' ')).toMatch(/Allow/)
  })

  it('returns Edge-specific copy on Windows', () => {
    const guide = resolveCapturePermissionGuide({ os: 'windows', browser: 'edge' })
    expect(guide.steps.join(' ')).toMatch(/Edge/)
  })

  it('falls back to generic instructions for unknown browsers', () => {
    const guide = resolveCapturePermissionGuide({ os: 'unknown', browser: 'unknown' })
    expect(guide.heading).toBe('Allow screen capture')
    expect(guide.steps.length).toBeGreaterThan(0)
  })
})
