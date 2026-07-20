import { BUGFREEDBACK_ROOT_ID } from '../constants'

/** Wait for two animation frames so CSS visibility updates paint before capture. */
export function waitForNextPaints(frames: number = 2): Promise<void> {
  return new Promise((resolve) => {
    const schedule
      = typeof requestAnimationFrame === 'function'
        ? (cb: () => void) => {
            requestAnimationFrame(() => cb())
          }
        : (cb: () => void) => {
            setTimeout(cb, 0)
          }

    const step = (remaining: number) => {
      if (remaining <= 0) {
        resolve()
        return
      }
      schedule(() => step(remaining - 1))
    }
    step(frames)
  })
}

/**
 * Temporarily hide the feedback widget root so screen capture does not include
 * the launcher or panel. Restores prior inline styles afterward.
 */
export async function withFeedbackOverlayHidden<T>(
  action: () => Promise<T>,
  options?: { rootId?: string, doc?: Document },
): Promise<T> {
  const doc = options?.doc ?? (typeof document !== 'undefined' ? document : undefined)
  const rootId = options?.rootId ?? BUGFREEDBACK_ROOT_ID
  const root = doc?.getElementById(rootId) ?? null

  const previous = root
    ? {
        visibility: root.style.visibility,
        opacity: root.style.opacity,
        pointerEvents: root.style.pointerEvents,
      }
    : null

  if (root) {
    root.style.visibility = 'hidden'
    root.style.opacity = '0'
    root.style.pointerEvents = 'none'
    root.setAttribute('data-feedback-capture-hidden', 'true')
  }

  try {
    await waitForNextPaints(2)
    return await action()
  }
  finally {
    if (root && previous) {
      root.style.visibility = previous.visibility
      root.style.opacity = previous.opacity
      root.style.pointerEvents = previous.pointerEvents
      root.removeAttribute('data-feedback-capture-hidden')
    }
  }
}
