export const FEEDBACK_CONSOLE_RING_MAX = 40

export type FeedbackConsoleEntry = {
  level: 'log' | 'info' | 'warn' | 'error'
  message: string
  timestamp: string
}

const ring: FeedbackConsoleEntry[] = []

function serializeArg(arg: unknown): string {
  if (typeof arg === 'string') {
    return arg
  }
  try {
    return JSON.stringify(arg)
  }
  catch {
    return String(arg)
  }
}

export function pushFeedbackConsoleEntry(
  level: FeedbackConsoleEntry['level'],
  args: unknown[],
): void {
  ring.push({
    level,
    message: args.map(serializeArg).join(' ').slice(0, 500),
    timestamp: new Date().toISOString(),
  })
  while (ring.length > FEEDBACK_CONSOLE_RING_MAX) {
    ring.shift()
  }
}

export function getFeedbackConsoleRing(): FeedbackConsoleEntry[] {
  return [...ring]
}

/** Test helper — clears the in-memory ring. */
export function clearFeedbackConsoleRing(): void {
  ring.length = 0
}
