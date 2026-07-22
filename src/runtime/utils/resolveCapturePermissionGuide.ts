import type { CaptureEnvironment, CaptureOs } from './detectCaptureEnvironment'

export type CaptureArrowDirection = 'up' | 'down' | 'left' | 'right'

export type CaptureCardAnchor = 'center' | 'left' | 'right'

export type CapturePermissionGuide = {
  heading: string
  steps: string[]
  /** True when falling back to generic top-center instructions. */
  isDefault: boolean
  /** When false, the dashed target ring is hidden (e.g. Firefox on Windows). */
  showTarget: boolean
  target: { topPercent: number, leftPercent: number }
  card: { topPercent: number, leftPercent: number, anchor: CaptureCardAnchor }
  arrow: CaptureArrowDirection
}

type SupportedOs = 'windows' | 'linux' | 'macos'
type SupportedBrowser = 'chrome' | 'edge' | 'firefox' | 'safari'

const SUPPORTED_OS = new Set<SupportedOs>(['windows', 'linux', 'macos'])
const SUPPORTED_BROWSERS = new Set<SupportedBrowser>(['chrome', 'edge', 'firefox', 'safari'])

function isSupportedEnv(env: CaptureEnvironment): env is { os: SupportedOs, browser: SupportedBrowser } {
  return SUPPORTED_OS.has(env.os as SupportedOs)
    && SUPPORTED_BROWSERS.has(env.browser as SupportedBrowser)
    && (env.browser !== 'safari' || env.os === 'macos')
}

function guideKey(env: CaptureEnvironment): string | null {
  if (!isSupportedEnv(env)) {
    return null
  }
  return `${env.browser}:${env.os}`
}

function defaultGuide(): CapturePermissionGuide {
  return {
    heading: 'Allow screen capture',
    isDefault: true,
    showTarget: true,
    target: { topPercent: 16, leftPercent: 50 },
    card: { topPercent: 8, leftPercent: 50, anchor: 'center' },
    arrow: 'down',
    steps: [
      'Use the browser permission dialog to share **this tab** only.',
      'Confirm with **Allow**, **Share**, or the equivalent button in your browser.',
    ],
  }
}

/** Firefox doorhanger sits below the address bar; Linux/macOS also show a center share picker. */
function firefoxGuide(os: SupportedOs): CapturePermissionGuide {
  const isWindows = os === 'windows'
  const isLinux = os === 'linux'
  const isMacos = os === 'macos'
  const usesCenterPortal = isLinux || isMacos

  let steps: string[]
  if (isMacos) {
    steps = [
      'Look below the address bar for the Firefox permission prompt.',
      'In the share dialog, choose **This Tab** instead of **Share this Window**.',
      'Click **Share** in the middle of the window to continue.',
    ]
  }
  else if (isLinux) {
    steps = [
      'Look below the address bar for the Firefox permission prompt.',
      'If shown, select **Use operating system settings**, then click **Allow**.',
      'In the system dialog, choose the browser window and confirm with **Share** or **Allow**.',
    ]
  }
  else {
    steps = [
      'Look below the address bar for the Firefox permission prompt.',
      'Select **This Tab**, then click **Allow**.',
    ]
  }

  return {
    heading: 'Allow screen sharing for this tab',
    isDefault: false,
    showTarget: !isWindows,
    target: usesCenterPortal
      ? { topPercent: 43, leftPercent: 50 }
      : { topPercent: 11, leftPercent: 40 },
    card: { topPercent: 8, leftPercent: 50, anchor: 'center' },
    arrow: 'left',
    steps,
  }
}

function chromiumCenterGuide(os: CaptureOs, browserLabel: 'Chrome' | 'Edge'): CapturePermissionGuide {
  const shareLabel = os === 'macos' ? 'Share' : 'Allow'
  const tabHint = os === 'macos' && browserLabel === 'Chrome' ? 'Chrome Tab' : 'This tab'
  const steps = os === 'macos' && browserLabel === 'Chrome'
    ? [
        `In the ${browserLabel} share dialog, choose **${tabHint}**.`,
        `Click **${shareLabel}** to continue.`,
        'If macOS asks for **Screen Recording** access, enable it for Chrome in System Settings, then try again.',
      ]
    : [
        `In the ${browserLabel} share dialog, choose **${tabHint}**.`,
        `Click **${shareLabel}** to continue.`,
      ]

  return {
    heading: 'Allow this tab to be shared',
    isDefault: false,
    showTarget: true,
    target: { topPercent: 43, leftPercent: 50 },
    card: { topPercent: 58, leftPercent: 50, anchor: 'center' },
    arrow: 'up',
    steps,
  }
}

function safariMacGuide(): CapturePermissionGuide {
  return {
    heading: 'Allow Safari to share this window',
    isDefault: false,
    showTarget: true,
    target: { topPercent: 42, leftPercent: 50 },
    card: { topPercent: 57, leftPercent: 50, anchor: 'center' },
    arrow: 'up',
    steps: [
      'When Safari asks what to share, choose **Window** instead of the entire screen.',
      'Hover the browser window and click **Share This Window**, or select it in the system picker.',
      'Click **Allow** or **Share** to continue.',
    ],
  }
}

const GUIDE_BY_KEY: Record<string, CapturePermissionGuide> = {
  'firefox:windows': firefoxGuide('windows'),
  'firefox:linux': firefoxGuide('linux'),
  'firefox:macos': firefoxGuide('macos'),
  'chrome:windows': chromiumCenterGuide('windows', 'Chrome'),
  'chrome:linux': chromiumCenterGuide('linux', 'Chrome'),
  'chrome:macos': chromiumCenterGuide('macos', 'Chrome'),
  'edge:windows': chromiumCenterGuide('windows', 'Edge'),
  'edge:linux': chromiumCenterGuide('linux', 'Edge'),
  'edge:macos': chromiumCenterGuide('macos', 'Edge'),
  'safari:macos': safariMacGuide(),
}

export function resolveCapturePermissionGuide(env: CaptureEnvironment): CapturePermissionGuide {
  const key = guideKey(env)
  if (!key) {
    return defaultGuide()
  }
  return GUIDE_BY_KEY[key] ?? defaultGuide()
}

/** Exposed for unit tests. */
export function __guideKeysForTests(): string[] {
  return Object.keys(GUIDE_BY_KEY)
}
