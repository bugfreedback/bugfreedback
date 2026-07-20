import { describe, expect, it } from 'vitest'
import {
  BUGFREEDBACK_MAX_SCREENSHOT_BYTES,
  BugfreedbackScreenshotDecodeError,
  bugfreedbackSubmitSchema,
  decodeFeedbackScreenshotBase64,
} from '../src/runtime/server/utils/submit'
import { buildScreenshotObjectKey } from '../src/runtime/server/adapters/storage'
import { buildS3PublicUrl } from '../src/runtime/server/adapters/storage/s3'

describe('bugfreedback submit schema', () => {
  it('accepts a valid payload with screenshot', () => {
    const parsed = bugfreedbackSubmitSchema.safeParse({
      title: 'Bug',
      description: 'Details',
      email: 'tester@example.com',
      screenshotBase64: 'aaaa',
      metadata: { path: '/' },
    })
    expect(parsed.success).toBe(true)
  })

  it('accepts a payload without a screenshot', () => {
    const parsed = bugfreedbackSubmitSchema.safeParse({
      title: 'Bug',
      description: 'Details',
      email: 'tester@example.com',
      metadata: { path: '/' },
    })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.screenshotBase64).toBeUndefined()
    }
  })

  it('rejects an empty title', () => {
    const parsed = bugfreedbackSubmitSchema.safeParse({
      title: '  ',
      screenshotBase64: 'aaaa',
    })
    expect(parsed.success).toBe(false)
  })

  it('decodes a PNG data URL', () => {
    const png = Buffer.from('png-bytes')
    const dataUrl = `data:image/png;base64,${png.toString('base64')}`
    expect(decodeFeedbackScreenshotBase64(dataUrl).equals(png)).toBe(true)
  })

  it('rejects oversized screenshots', () => {
    const huge = Buffer.alloc(BUGFREEDBACK_MAX_SCREENSHOT_BYTES + 1, 1).toString('base64')
    expect(() => decodeFeedbackScreenshotBase64(huge)).toThrow(BugfreedbackScreenshotDecodeError)
  })
})

describe('storage helpers', () => {
  it('builds object keys under the feedback prefix', () => {
    const key = buildScreenshotObjectKey('feedback/')
    expect(key.startsWith('feedback/')).toBe(true)
    expect(key.endsWith('.png')).toBe(true)
  })

  it('builds S3 public URLs', () => {
    expect(buildS3PublicUrl({
      bucket: 'shots',
      region: 'us-west-2',
    }, 'feedback/a.png')).toBe('https://shots.s3.us-west-2.amazonaws.com/feedback/a.png')

    expect(buildS3PublicUrl({
      bucket: 'shots',
      publicBaseUrl: 'https://cdn.example.com',
    }, 'feedback/a.png')).toBe('https://cdn.example.com/feedback/a.png')
  })
})
