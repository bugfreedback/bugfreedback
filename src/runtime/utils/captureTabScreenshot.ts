import { resolveViewportCropRect } from './resolveViewportCropRect'
import { waitForNextPaints } from './hideFeedbackOverlayForCapture'

export type CaptureTabScreenshotOptions = {
  /** Called after the user grants display-media permission and before the frame is grabbed. */
  onPermissionGranted?: () => void | Promise<void>
}

/**
 * Capture the current tab (preferred) via the Screen Capture API and return a PNG data URL.
 * Crops to the layout viewport when the frame includes browser chrome.
 * Stops all media tracks immediately after grabbing one frame.
 */
export async function captureTabScreenshot(options?: CaptureTabScreenshotOptions): Promise<string> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getDisplayMedia) {
    throw new Error('Screen capture is not supported in this browser')
  }

  const stream = await navigator.mediaDevices.getDisplayMedia({
    audio: false,
    video: {
      // Prefer a browser tab surface when the picker supports it.
      displaySurface: 'browser',
    } as MediaTrackConstraints,
    // Chromium: prefer the current tab when the picker supports it.
    preferCurrentTab: true,
    selfBrowserSurface: 'include',
    surfaceSwitching: 'exclude',
    systemAudio: 'exclude',
  } as MediaStreamConstraints & {
    preferCurrentTab?: boolean
    selfBrowserSurface?: 'include' | 'exclude'
    surfaceSwitching?: 'include' | 'exclude'
    systemAudio?: 'include' | 'exclude'
  })

  await options?.onPermissionGranted?.()
  await waitForNextPaints(3)

  try {
    const track = stream.getVideoTracks()[0]
    if (!track) {
      throw new Error('No video track available from screen capture')
    }

    const video = document.createElement('video')
    video.playsInline = true
    video.muted = true
    video.srcObject = stream

    await video.play()
    await waitForVideoFrame(video)

    const width = video.videoWidth
    const height = video.videoHeight
    if (!width || !height) {
      throw new Error('Screen capture produced an empty frame')
    }

    const crop = resolveViewportCropRect({
      captureWidth: width,
      captureHeight: height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
    })

    const canvas = document.createElement('canvas')
    canvas.width = crop.sw
    canvas.height = crop.sh
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not create canvas context for screenshot')
    }
    ctx.drawImage(
      video,
      crop.sx,
      crop.sy,
      crop.sw,
      crop.sh,
      0,
      0,
      crop.sw,
      crop.sh,
    )

    return canvas.toDataURL('image/png')
  }
  finally {
    for (const mediaTrack of stream.getTracks()) {
      mediaTrack.stop()
    }
  }
}

function waitForVideoFrame(video: HTMLVideoElement): Promise<void> {
  if (video.videoWidth > 0 && video.videoHeight > 0) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const onLoaded = () => {
      cleanup()
      resolve()
    }
    const onError = () => {
      cleanup()
      reject(new Error('Failed to load screen capture video'))
    }
    const cleanup = () => {
      video.removeEventListener('loadeddata', onLoaded)
      video.removeEventListener('error', onError)
    }
    video.addEventListener('loadeddata', onLoaded)
    video.addEventListener('error', onError)
  })
}
