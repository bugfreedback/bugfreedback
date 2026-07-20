import { BUGFREEDBACK_ROOT_ID } from '../constants'

export const BUGFREEDBACK_HOST_SELECTOR = `#${BUGFREEDBACK_ROOT_ID}`

type ClosestElement = {
  closest?: (selector: string) => unknown
  matches?: (selector: string) => boolean
}

function elementMatchesFeedback(node: EventTarget | null): boolean {
  if (node == null || typeof node !== 'object') {
    return false
  }

  const element = node as ClosestElement
  if (typeof element.matches === 'function' && element.matches(BUGFREEDBACK_HOST_SELECTOR)) {
    return true
  }
  if (typeof element.closest !== 'function') {
    return false
  }

  return Boolean(element.closest(BUGFREEDBACK_HOST_SELECTOR))
}

/**
 * Returns true when the interaction is inside the first-party feedback widget.
 */
export function isBugfreedbackWidgetInteraction(
  target: EventTarget | null,
  event?: Event | null,
): boolean {
  if (event && typeof event.composedPath === 'function') {
    try {
      if (event.composedPath().some(node => elementMatchesFeedback(node))) {
        return true
      }
    }
    catch {
      // Fall through to target-based detection.
    }
  }

  return elementMatchesFeedback(target)
}
