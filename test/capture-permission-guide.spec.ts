import { describe, expect, it } from 'vitest'
import {
  detectCaptureBrowser,
  detectCaptureEnvironment,
  detectCaptureOs,
} from '../src/runtime/utils/detectCaptureEnvironment'
import {
  __guideKeysForTests,
  resolveCapturePermissionGuide,
} from '../src/runtime/utils/resolveCapturePermissionGuide'

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

  it('detects iOS Safari as ios + safari', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    expect(detectCaptureOs(ua)).toBe('ios')
    expect(detectCaptureBrowser(ua)).toBe('safari')
  })
})

describe('resolveCapturePermissionGuide', () => {
  it('covers all supported browser and OS combinations', () => {
    expect(__guideKeysForTests().sort()).toEqual([
      'chrome:linux',
      'chrome:macos',
      'chrome:windows',
      'edge:linux',
      'edge:macos',
      'edge:windows',
      'firefox:linux',
      'firefox:macos',
      'firefox:windows',
      'safari:macos',
    ])
  })

  it('returns Chrome center-modal guidance with an upward arrow on Windows', () => {
    const guide = resolveCapturePermissionGuide({ os: 'windows', browser: 'chrome' })
    expect(guide.isDefault).toBe(false)
    expect(guide.arrow).toBe('up')
    expect(guide.target.leftPercent).toBe(50)
    expect(guide.steps.join(' ')).toMatch(/Chrome/)
    expect(guide.steps.join(' ')).toMatch(/Allow/)
  })

  it('returns Firefox Windows guidance with a centered card and no target ring', () => {
    const guide = resolveCapturePermissionGuide({ os: 'windows', browser: 'firefox' })
    expect(guide.isDefault).toBe(false)
    expect(guide.showTarget).toBe(false)
    expect(guide.arrow).toBe('left')
    expect(guide.card.topPercent).toBe(8)
    expect(guide.card.leftPercent).toBe(50)
    expect(guide.card.anchor).toBe('center')
    expect(guide.steps.join(' ')).toMatch(/address bar/)
  })

  it('returns Chrome macOS guidance with Chrome Tab and Share labels', () => {
    const guide = resolveCapturePermissionGuide({ os: 'macos', browser: 'chrome' })
    expect(guide.target.topPercent).toBe(43)
    expect(guide.card.topPercent).toBe(58)
    expect(guide.steps.join(' ')).toMatch(/Chrome Tab/)
    expect(guide.steps.join(' ')).toMatch(/Share/)
    expect(guide.steps.join(' ')).toMatch(/Screen Recording/)
    expect(guide.steps).toHaveLength(3)
  })

  it('returns Firefox Linux guidance with a top-centered card and center portal target', () => {
    const guide = resolveCapturePermissionGuide({ os: 'linux', browser: 'firefox' })
    expect(guide.showTarget).toBe(true)
    expect(guide.card.topPercent).toBe(8)
    expect(guide.card.leftPercent).toBe(50)
    expect(guide.target.topPercent).toBe(43)
    expect(guide.target.leftPercent).toBe(50)
    expect(guide.arrow).toBe('left')
    expect(guide.steps.join(' ')).toMatch(/operating system settings/)
    expect(guide.steps).toHaveLength(3)
  })

  it('returns Firefox macOS guidance with a top-centered card and center target ring', () => {
    const guide = resolveCapturePermissionGuide({ os: 'macos', browser: 'firefox' })
    expect(guide.showTarget).toBe(true)
    expect(guide.card.topPercent).toBe(8)
    expect(guide.card.leftPercent).toBe(50)
    expect(guide.target.topPercent).toBe(43)
    expect(guide.target.leftPercent).toBe(50)
    expect(guide.arrow).toBe('left')
    expect(guide.steps.join(' ')).toMatch(/Share this Window/)
    expect(guide.steps).toHaveLength(3)
    expect(guide.steps[2]).toMatch(/Share/)
  })

  it('returns Edge-specific copy on Linux', () => {
    const guide = resolveCapturePermissionGuide({ os: 'linux', browser: 'edge' })
    expect(guide.steps.join(' ')).toMatch(/Edge/)
    expect(guide.arrow).toBe('up')
  })

  it('returns Safari macOS guidance for window sharing with a center target ring', () => {
    const guide = resolveCapturePermissionGuide({ os: 'macos', browser: 'safari' })
    expect(guide.isDefault).toBe(false)
    expect(guide.heading).toMatch(/window/i)
    expect(guide.target.leftPercent).toBe(50)
    expect(guide.steps.join(' ')).toMatch(/Window/)
    expect(guide.steps.join(' ')).toMatch(/Share This Window/)
    expect(guide.steps).toHaveLength(3)
    expect(guide.steps.join(' ')).not.toMatch(/This Tab/)
  })

  it('uses default top-center instructions for Safari on iOS', () => {
    const guide = resolveCapturePermissionGuide({ os: 'ios', browser: 'safari' })
    expect(guide.isDefault).toBe(true)
    expect(guide.arrow).toBe('down')
    expect(guide.card.topPercent).toBeLessThan(guide.target.topPercent)
  })

  it('uses default top-center instructions for unknown browsers', () => {
    const guide = resolveCapturePermissionGuide({ os: 'unknown', browser: 'unknown' })
    expect(guide.isDefault).toBe(true)
    expect(guide.card.topPercent).toBe(8)
    expect(guide.card.leftPercent).toBe(50)
    expect(guide.arrow).toBe('down')
  })
})
