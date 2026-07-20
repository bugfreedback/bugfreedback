/**
 * When window/screen capture includes browser chrome, shift the crop window up by
 * this many CSS pixels (scaled by DPR) so bottom chrome is excluded and the top
 * of the page is not clipped.
 */
export const VIEWPORT_CROP_BOTTOM_INSET_PX = 3

/**
 * Compute a source crop that keeps the page viewport and drops browser chrome
 * when the capture is larger than the layout viewport (window / screen shares).
 *
 * Heuristic: browser chrome sits above the page content; horizontal overflow is centered.
 * Tries device-pixel and CSS-pixel viewport sizes and picks the first that fits.
 * Applies a small upward shift (`VIEWPORT_CROP_BOTTOM_INSET_PX`) to drop bottom chrome.
 */
export function resolveViewportCropRect(options: {
  captureWidth: number
  captureHeight: number
  viewportWidth: number
  viewportHeight: number
  devicePixelRatio: number
  bottomInsetPx?: number
}): { sx: number, sy: number, sw: number, sh: number } {
  const captureWidth = Math.max(0, Math.round(options.captureWidth))
  const captureHeight = Math.max(0, Math.round(options.captureHeight))
  if (captureWidth === 0 || captureHeight === 0) {
    return { sx: 0, sy: 0, sw: captureWidth, sh: captureHeight }
  }

  const dpr = options.devicePixelRatio > 0 ? options.devicePixelRatio : 1
  const bottomInsetCss = options.bottomInsetPx ?? VIEWPORT_CROP_BOTTOM_INSET_PX
  const targets = [
    {
      w: Math.round(options.viewportWidth * dpr),
      h: Math.round(options.viewportHeight * dpr),
      inset: Math.round(bottomInsetCss * dpr),
    },
    {
      w: Math.round(options.viewportWidth),
      h: Math.round(options.viewportHeight),
      inset: Math.round(bottomInsetCss),
    },
  ]

  for (const target of targets) {
    if (target.w <= 0 || target.h <= 0) {
      continue
    }
    if (target.w > captureWidth + 2 || target.h > captureHeight + 2) {
      continue
    }

    const nearExactWidth = Math.abs(captureWidth - target.w) <= 2
    const nearExactHeight = Math.abs(captureHeight - target.h) <= 2
    if (nearExactWidth && nearExactHeight) {
      // Still nudge up slightly when dimensions match but OS chrome peeks in.
      const inset = Math.min(target.inset, Math.max(0, captureHeight - 1))
      const sh = Math.max(1, captureHeight - inset)
      return { sx: 0, sy: 0, sw: captureWidth, sh }
    }

    const sw = Math.min(target.w, captureWidth)
    const sh = Math.min(target.h, captureHeight)
    const sx = Math.max(0, Math.round((captureWidth - sw) / 2))
    // Bottom-align content under top chrome, then shift up to drop bottom chrome
    // and recover a few pixels at the top of the page.
    const inset = Math.min(target.inset, Math.max(0, captureHeight - sh))
    const sy = Math.max(0, captureHeight - sh - inset)
    return { sx, sy, sw, sh }
  }

  return { sx: 0, sy: 0, sw: captureWidth, sh: captureHeight }
}
