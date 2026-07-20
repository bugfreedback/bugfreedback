import { describe, expect, it } from 'vitest'
import { collectFeedbackMetadata } from '../src/runtime/utils/collectFeedbackMetadata'
import {
  clearFeedbackConsoleRing,
  getFeedbackConsoleRing,
  pushFeedbackConsoleEntry,
} from '../src/runtime/utils/feedbackConsoleRing'
import {
  BUGFREEDBACK_HOST_SELECTOR,
  BUGFREEDBACK_ROOT_ID,
} from '../src/runtime/constants'
import { isBugfreedbackWidgetInteraction } from '../src/runtime/utils/feedbackInteraction'
import { buildS3PublicUrl } from '../src/runtime/server/adapters/storage/s3'
import { scaleDimensions } from '../src/runtime/utils/scaleImageDataUrl'
import { resolveViewportCropRect } from '../src/runtime/utils/resolveViewportCropRect'

describe('feedbackConsoleRing', () => {
  it('stores recent console entries', () => {
    clearFeedbackConsoleRing()
    pushFeedbackConsoleEntry('warn', ['hello', { a: 1 }])
    const entries = getFeedbackConsoleRing()
    expect(entries).toHaveLength(1)
    expect(entries[0]?.level).toBe('warn')
    expect(entries[0]?.message).toContain('hello')
  })
})

describe('collectFeedbackMetadata', () => {
  it('includes app version, deploy env, and user fields', () => {
    const meta = collectFeedbackMetadata({
      appVersion: '0.1.0',
      deployEnvironment: 'stage',
      user: { id: 'u1', username: 'chrono', email: 'a@b.c' },
    })
    expect(meta.appVersion).toBe('0.1.0')
    expect(meta.deployEnvironment).toBe('stage')
    expect(meta.userId).toBe('u1')
    expect(meta.username).toBe('chrono')
    expect(meta.email).toBe('a@b.c')
  })
})

describe('feedbackInteraction', () => {
  it('exposes the root selector', () => {
    expect(BUGFREEDBACK_HOST_SELECTOR).toBe(`#${BUGFREEDBACK_ROOT_ID}`)
  })

  it('detects interactions inside the host', () => {
    const host = { matches: (sel: string) => sel === BUGFREEDBACK_HOST_SELECTOR }
    expect(isBugfreedbackWidgetInteraction(host as unknown as EventTarget)).toBe(true)
    expect(isBugfreedbackWidgetInteraction(null)).toBe(false)
  })
})

describe('scaleDimensions', () => {
  it('scales while preserving aspect ratio', () => {
    expect(scaleDimensions(800, 600, 0.5)).toEqual({ width: 400, height: 300 })
  })
})

describe('resolveViewportCropRect', () => {
  it('returns a crop rect within capture bounds', () => {
    const crop = resolveViewportCropRect({
      captureWidth: 1920,
      captureHeight: 1080,
      viewportWidth: 1280,
      viewportHeight: 720,
      devicePixelRatio: 1,
    })
    expect(crop.sx).toBeGreaterThanOrEqual(0)
    expect(crop.sy).toBeGreaterThanOrEqual(0)
    expect(crop.sw).toBeGreaterThan(0)
    expect(crop.sh).toBeGreaterThan(0)
    expect(crop.sx + crop.sw).toBeLessThanOrEqual(1920)
    expect(crop.sy + crop.sh).toBeLessThanOrEqual(1080)
  })
})

describe('buildS3PublicUrl', () => {
  it('prefers publicBaseUrl when set', () => {
    expect(buildS3PublicUrl({
      bucket: 'shots',
      publicBaseUrl: 'https://cdn.example.com/',
    }, 'feedback/a.png')).toBe('https://cdn.example.com/feedback/a.png')
  })
})
