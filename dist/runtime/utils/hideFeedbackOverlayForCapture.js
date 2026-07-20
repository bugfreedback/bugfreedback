import { BUGFREEDBACK_ROOT_ID } from "../constants.js";
export function waitForNextPaints(frames = 2) {
  return new Promise((resolve) => {
    const schedule = typeof requestAnimationFrame === "function" ? (cb) => {
      requestAnimationFrame(() => cb());
    } : (cb) => {
      setTimeout(cb, 0);
    };
    const step = (remaining) => {
      if (remaining <= 0) {
        resolve();
        return;
      }
      schedule(() => step(remaining - 1));
    };
    step(frames);
  });
}
export async function withFeedbackOverlayHidden(action, options) {
  const doc = options?.doc ?? (typeof document !== "undefined" ? document : void 0);
  const rootId = options?.rootId ?? BUGFREEDBACK_ROOT_ID;
  const root = doc?.getElementById(rootId) ?? null;
  const previous = root ? {
    visibility: root.style.visibility,
    opacity: root.style.opacity,
    pointerEvents: root.style.pointerEvents
  } : null;
  if (root) {
    root.style.visibility = "hidden";
    root.style.opacity = "0";
    root.style.pointerEvents = "none";
    root.setAttribute("data-feedback-capture-hidden", "true");
  }
  try {
    await waitForNextPaints(2);
    return await action();
  } finally {
    if (root && previous) {
      root.style.visibility = previous.visibility;
      root.style.opacity = previous.opacity;
      root.style.pointerEvents = previous.pointerEvents;
      root.removeAttribute("data-feedback-capture-hidden");
    }
  }
}
