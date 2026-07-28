import { BUGFREEDBACK_MAX_SCREENSHOT_BYTES } from '../constants'

export const BUGFREEDBACK_ACCEPTED_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
] as const

export const BUGFREEDBACK_ACCEPTED_IMAGE_EXTENSIONS = '.png,.jpg,.jpeg,.webp,.gif'

export class BugfreedbackImageFileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BugfreedbackImageFileError'
  }
}

function isAcceptedImageMime(type: string): boolean {
  return BUGFREEDBACK_ACCEPTED_IMAGE_MIME_TYPES.includes(
    type.toLowerCase() as (typeof BUGFREEDBACK_ACCEPTED_IMAGE_MIME_TYPES)[number],
  )
}

/**
 * Read an image file, normalize to PNG data URL, and enforce size limits.
 * Uses canvas when available (browser); tests pass `encodePng` for Node.
 */
export async function readImageFileAsDataUrl(
  file: File,
  options?: {
    maxBytes?: number
    encodePng?: (dataUrl: string) => Promise<string>
  },
): Promise<string> {
  const maxBytes = options?.maxBytes ?? BUGFREEDBACK_MAX_SCREENSHOT_BYTES

  if (!isAcceptedImageMime(file.type)) {
    throw new BugfreedbackImageFileError(
      'Please choose a PNG, JPEG, WebP, or GIF image.',
    )
  }

  if (file.size > maxBytes) {
    throw new BugfreedbackImageFileError(
      `Image exceeds ${Math.round(maxBytes / (1024 * 1024))} MiB limit.`,
    )
  }

  const objectUrl = URL.createObjectURL(file)
  try {
    const dataUrl = await loadObjectUrlAsDataUrl(objectUrl, file.type)
    const encodePng = options?.encodePng ?? encodeDataUrlAsPng
    const pngDataUrl = await encodePng(dataUrl)

    const decodedSize = estimateDataUrlBytes(pngDataUrl)
    if (decodedSize > maxBytes) {
      throw new BugfreedbackImageFileError(
        `Image exceeds ${Math.round(maxBytes / (1024 * 1024))} MiB limit after processing.`,
      )
    }

    return pngDataUrl
  }
  finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function loadObjectUrlAsDataUrl(objectUrl: string, mimeType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new BugfreedbackImageFileError('Could not process the selected image.'))
        return
      }
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL(mimeType === 'image/jpeg' ? 'image/jpeg' : 'image/png'))
    }
    img.onerror = () => reject(new BugfreedbackImageFileError('Could not read the selected image.'))
    img.src = objectUrl
  })
}

async function encodeDataUrlAsPng(dataUrl: string): Promise<string> {
  const img = new Image()
  img.src = dataUrl
  await img.decode()
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return dataUrl
  }
  ctx.drawImage(img, 0, 0)
  return canvas.toDataURL('image/png')
}

/** Estimate decoded byte length from a base64 data URL (no DOM). */
export function estimateDataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.replace(/^data:[^;]+;base64,/, '')
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0
  return Math.floor((base64.length * 3) / 4) - padding
}
