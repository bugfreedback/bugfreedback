import { describe, expect, it } from 'vitest'
import { resolveScreenshotAttachHelp } from '../src/runtime/utils/resolveScreenshotAttachHelp'

describe('resolveScreenshotAttachHelp', () => {
  it('returns iPhone screenshot steps', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    const help = resolveScreenshotAttachHelp(ua)
    expect(help.heading).toMatch(/iPhone/i)
    expect(help.steps.join(' ')).toMatch(/Volume Up/)
    expect(help.note).toMatch(/cannot capture/)
  })

  it('returns Samsung-specific Android steps', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    const help = resolveScreenshotAttachHelp(ua)
    expect(help.heading).toMatch(/Samsung/i)
    expect(help.steps.join(' ')).toMatch(/Power/)
    expect(help.steps.join(' ')).toMatch(/Palm swipe|Volume Down/)
  })

  it('returns Pixel-specific Android steps', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    const help = resolveScreenshotAttachHelp(ua)
    expect(help.heading).toMatch(/Pixel/i)
    expect(help.steps.join(' ')).toMatch(/Volume Down/)
  })

  it('returns generic Android fallback for unknown OEMs', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 12; Unknown Device) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36'
    const help = resolveScreenshotAttachHelp(ua)
    expect(help.heading).toMatch(/Android/i)
    expect(help.steps.join(' ')).toMatch(/Power/)
  })
})
