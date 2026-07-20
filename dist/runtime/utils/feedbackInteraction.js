import { BUGFREEDBACK_ROOT_ID } from "../constants.js";
export const BUGFREEDBACK_HOST_SELECTOR = `#${BUGFREEDBACK_ROOT_ID}`;
function elementMatchesFeedback(node) {
  if (node == null || typeof node !== "object") {
    return false;
  }
  const element = node;
  if (typeof element.matches === "function" && element.matches(BUGFREEDBACK_HOST_SELECTOR)) {
    return true;
  }
  if (typeof element.closest !== "function") {
    return false;
  }
  return Boolean(element.closest(BUGFREEDBACK_HOST_SELECTOR));
}
export function isBugfreedbackWidgetInteraction(target, event) {
  if (event && typeof event.composedPath === "function") {
    try {
      if (event.composedPath().some((node) => elementMatchesFeedback(node))) {
        return true;
      }
    } catch {
    }
  }
  return elementMatchesFeedback(target);
}
