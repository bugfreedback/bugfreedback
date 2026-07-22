import type { CaptureEnvironment, CaptureOs } from './detectCaptureEnvironment'

export type CapturePermissionPlacement = 'center-modal' | 'top-center-bar'

export type CapturePermissionGuide = {
  heading: string
  steps: string[]
  placement: CapturePermissionPlacement
  /** Percent from top/left for arrow target (browser permission UI). */
  target: { topPercent: number, leftPercent: number }
}

function chromiumGuide(os: CaptureOs): CapturePermissionGuide {
  const tabLabel = os === 'macos' ? 'Chrome Tab' : 'Tab'
  return {
    heading: 'Allow this tab to be shared',
    placement: 'center-modal',
    target: { topPercent: 42, leftPercent: 50 },
    steps: [
      'In the browser dialog that appears, choose **This tab** (or **' + tabLabel + '**).',
      'Click **Share** (macOS) or **Allow** (Windows/Linux).',
    ],
  }
}

function edgeGuide(os: CaptureOs): CapturePermissionGuide {
  const tabLabel = os === 'macos' ? 'Tab' : 'This tab'
  return {
    heading: 'Allow this tab to be shared',
    placement: 'center-modal',
    target: { topPercent: 42, leftPercent: 50 },
    steps: [
      'In the Microsoft Edge share window, select **' + tabLabel + '**.',
      'Click **Share** or **Allow** to continue.',
    ],
  }
}

function firefoxGuide(): CapturePermissionGuide {
  return {
    heading: 'Allow screen sharing for this tab',
    placement: 'center-modal',
    target: { topPercent: 40, leftPercent: 50 },
    steps: [
      'In the Firefox prompt, select **This Tab** (not the entire screen).',
      'Click **Allow** to share the tab.',
    ],
  }
}

function safariGuide(os: CaptureOs): CapturePermissionGuide {
  if (os === 'ios') {
    return {
      heading: 'Allow screen capture',
      placement: 'center-modal',
      target: { topPercent: 45, leftPercent: 50 },
      steps: [
        'Tap **Allow** when Safari asks to record the screen.',
        'Choose **This Tab** if you are prompted to pick a source.',
      ],
    }
  }

  return {
    heading: 'Allow Safari to share this tab',
    placement: 'center-modal',
    target: { topPercent: 42, leftPercent: 50 },
    steps: [
      'When the Safari dialog appears, select **This Tab**.',
      'Click **Allow** to continue.',
    ],
  }
}

function genericGuide(): CapturePermissionGuide {
  return {
    heading: 'Allow screen capture',
    placement: 'center-modal',
    target: { topPercent: 42, leftPercent: 50 },
    steps: [
      'Use the browser permission dialog to share **this tab** only.',
      'Confirm with **Allow**, **Share**, or the equivalent button in your browser.',
    ],
  }
}

export function resolveCapturePermissionGuide(env: CaptureEnvironment): CapturePermissionGuide {
  const { browser, os } = env

  if (browser === 'chrome') {
    return chromiumGuide(os)
  }
  if (browser === 'edge') {
    return edgeGuide(os)
  }
  if (browser === 'firefox') {
    return firefoxGuide()
  }
  if (browser === 'safari') {
    return safariGuide(os)
  }

  return genericGuide()
}
