/**
 * Scale a PNG/JPEG data URL by `scale` (e.g. 0.75) using canvas drawImage.
 * Returns the original string when scale is ~1 or the image cannot be decoded.
 */
export async function scaleImageDataUrl(
  dataUrl: string,
  scale: number,
): Promise<string> {
  if (!(scale > 0) || Math.abs(scale - 1) < 0.001) {
    return dataUrl
  }

  const img = new Image()
  img.src = dataUrl
  await img.decode()

  const width = Math.max(1, Math.round(img.naturalWidth * scale))
  const height = Math.max(1, Math.round(img.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return dataUrl
  }
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, width, height)
  return canvas.toDataURL('image/png')
}

/** Pure size helper for tests (no DOM). */
export function scaleDimensions(
  width: number,
  height: number,
  scale: number,
): { width: number, height: number } {
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}
