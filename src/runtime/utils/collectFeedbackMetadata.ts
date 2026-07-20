import { getFeedbackConsoleRing } from './feedbackConsoleRing'

export type FeedbackMetadata = {
  url: string
  path: string
  viewport: { width: number, height: number }
  devicePixelRatio: number
  language: string
  userAgent: string
  platform: string
  appVersion: string
  deployEnvironment: string
  userId: string | null
  username: string | null
  email: string | null
  capturedAt: string
  console: ReturnType<typeof getFeedbackConsoleRing>
}

export function collectFeedbackMetadata(options: {
  appVersion: string
  deployEnvironment: string
  user?: { id?: string, username?: string | null, email?: string | null } | null
}): FeedbackMetadata {
  const href = typeof window !== 'undefined' ? window.location.href : ''
  const path = typeof window !== 'undefined' ? window.location.pathname : ''

  return {
    url: href,
    path,
    viewport: {
      width: typeof window !== 'undefined' ? window.innerWidth : 0,
      height: typeof window !== 'undefined' ? window.innerHeight : 0,
    },
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    language: typeof navigator !== 'undefined' ? navigator.language : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    platform: typeof navigator !== 'undefined' ? navigator.platform : '',
    appVersion: options.appVersion,
    deployEnvironment: options.deployEnvironment,
    userId: options.user?.id ?? null,
    username: options.user?.username ?? null,
    email: options.user?.email ?? null,
    capturedAt: new Date().toISOString(),
    console: getFeedbackConsoleRing(),
  }
}
