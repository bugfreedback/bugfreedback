export const FEEDBACK_CONSOLE_RING_MAX = 40;
const ring = [];
function serializeArg(arg) {
  if (typeof arg === "string") {
    return arg;
  }
  try {
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
}
export function pushFeedbackConsoleEntry(level, args) {
  ring.push({
    level,
    message: args.map(serializeArg).join(" ").slice(0, 500),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
  while (ring.length > FEEDBACK_CONSOLE_RING_MAX) {
    ring.shift();
  }
}
export function getFeedbackConsoleRing() {
  return [...ring];
}
export function clearFeedbackConsoleRing() {
  ring.length = 0;
}
