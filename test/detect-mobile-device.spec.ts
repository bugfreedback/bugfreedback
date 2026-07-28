import { describe, expect, it } from 'vitest'
import {
  detectAndroidDeviceFamily,
  detectMobileDeviceProfile,
  detectMobileFormFactor,
} from '../src/runtime/utils/detectMobileDevice'

describe('detectMobileDevice', () => {
  it('detects Samsung Galaxy phones', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    expect(detectAndroidDeviceFamily(ua)).toBe('samsung')
    expect(detectMobileFormFactor(ua, 'android')).toBe('phone')
  })

  it('detects Google Pixel phones', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    expect(detectAndroidDeviceFamily(ua)).toBe('pixel')
  })

  it('detects OnePlus devices', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 12; IN2023) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36'
    expect(detectAndroidDeviceFamily(ua)).toBe('oneplus')
  })

  it('detects Xiaomi / Redmi devices', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 13; Redmi Note 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    expect(detectAndroidDeviceFamily(ua)).toBe('xiaomi')
  })

  it('detects Android tablets without Mobile token', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 13; SM-X900) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    expect(detectMobileFormFactor(ua, 'android')).toBe('tablet')
    expect(detectAndroidDeviceFamily(ua)).toBe('samsung')
  })

  it('detects iPhone vs iPad profiles', () => {
    const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    const ipad = 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'

    expect(detectMobileDeviceProfile(iphone, 'ios')).toMatchObject({
      formFactor: 'phone',
      iosHint: 'iphone',
    })
    expect(detectMobileDeviceProfile(ipad, 'ios')).toMatchObject({
      formFactor: 'tablet',
      iosHint: 'ipad',
    })
  })
})
