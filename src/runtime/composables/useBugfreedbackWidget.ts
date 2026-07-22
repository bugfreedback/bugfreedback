import { computed, useRuntimeConfig, useState } from '#imports'
import { nextTick } from 'vue'
import { $fetch } from 'ofetch'
import { nanoid } from 'nanoid'
import { BUGFREEDBACK_ANNOTATE_SCALE } from '../constants'
import { collectFeedbackMetadata } from '../utils/collectFeedbackMetadata'
import { captureTabScreenshot } from '../utils/captureTabScreenshot'
import { waitForNextPaints, withFeedbackOverlayHidden } from '../utils/hideFeedbackOverlayForCapture'
import { scaleImageDataUrl } from '../utils/scaleImageDataUrl'
import { useBugfreedbackAuth } from './useBugfreedbackAuth'

export type BugfreedbackWidgetStep = 'idle' | 'form' | 'capture' | 'annotate' | 'submitting' | 'error'

type PublicBugfreedbackConfig = {
  enabled?: boolean
  auth?: 'required' | 'optional' | 'none'
  submitPath?: string
}

export function useBugfreedbackWidget() {
  const config = useRuntimeConfig()
  const auth = useBugfreedbackAuth()
  const publicConfig = computed(
    () => (config.public.bugfreedback ?? {}) as PublicBugfreedbackConfig,
  )

  const open = useState('bugfreedback-open', () => false)
  const step = useState<BugfreedbackWidgetStep>('bugfreedback-step', () => 'idle')
  const screenshotDataUrl = useState<string | null>('bugfreedback-screenshot', () => null)
  const originalScreenshotDataUrl = useState<string | null>('bugfreedback-original-screenshot', () => null)
  const title = useState('bugfreedback-title', () => '')
  const description = useState('bugfreedback-description', () => '')
  const email = useState('bugfreedback-email', () => '')
  const errorMessage = useState<string | null>('bugfreedback-error', () => null)
  const successMessage = useState<string | null>('bugfreedback-success', () => null)
  const captureGuideVisible = useState('bugfreedback-capture-guide-visible', () => false)

  const isEnabled = computed(() => Boolean(publicConfig.value.enabled))
  const authMode = computed(() => publicConfig.value.auth ?? 'optional')
  const submitPath = computed(() => publicConfig.value.submitPath ?? '/api/_bugfreedback/submit')

  function requireAuthIfNeeded(): boolean {
    if (authMode.value === 'none' || authMode.value === 'optional') {
      return true
    }
    return Boolean(auth.getToken())
  }

  function resetFormFields() {
    title.value = ''
    description.value = ''
    email.value = auth.getUser?.()?.email ?? ''
    errorMessage.value = null
    successMessage.value = null
  }

  function close() {
    open.value = false
    step.value = 'idle'
    screenshotDataUrl.value = null
    originalScreenshotDataUrl.value = null
    captureGuideVisible.value = false
    resetFormFields()
  }

  function start() {
    if (!isEnabled.value) {
      return
    }
    if (authMode.value === 'required' && !auth.getToken()) {
      errorMessage.value = 'Sign in to send feedback.'
      open.value = true
      step.value = 'error'
      return
    }

    resetFormFields()
    screenshotDataUrl.value = null
    originalScreenshotDataUrl.value = null
    open.value = true
    step.value = 'form'
  }

  async function includeScreenshot() {
    if (authMode.value === 'required' && !auth.getToken()) {
      errorMessage.value = 'Sign in to send feedback.'
      step.value = 'error'
      return
    }

    errorMessage.value = null
    step.value = 'capture'
    originalScreenshotDataUrl.value = null
    captureGuideVisible.value = true

    if (import.meta.client) {
      await nextTick()
      await waitForNextPaints(2)
    }

    try {
      const rawDataUrl = await withFeedbackOverlayHidden(() =>
        captureTabScreenshot({
          onPermissionGranted: async () => {
            captureGuideVisible.value = false
          },
        }),
      )
      const dataUrl = await scaleImageDataUrl(rawDataUrl, BUGFREEDBACK_ANNOTATE_SCALE)
      originalScreenshotDataUrl.value = dataUrl
      step.value = 'annotate'
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Screen capture failed'
      if (
        /NotAllowedError|Permission denied|denied/i.test(message)
        || (error as { name?: string })?.name === 'NotAllowedError'
      ) {
        errorMessage.value = 'Screen capture was cancelled or denied. Please allow sharing this tab and try again.'
      }
      else {
        errorMessage.value = message
      }
      step.value = 'form'
    }
    finally {
      captureGuideVisible.value = false
    }
  }

  function setAnnotatedScreenshot(dataUrl: string) {
    screenshotDataUrl.value = dataUrl
    originalScreenshotDataUrl.value = null
    step.value = 'form'
  }

  function cancelAnnotate() {
    originalScreenshotDataUrl.value = null
    step.value = 'form'
  }

  function clearScreenshot() {
    screenshotDataUrl.value = null
    originalScreenshotDataUrl.value = null
  }

  async function submit() {
    if (!requireAuthIfNeeded() && authMode.value === 'required') {
      errorMessage.value = 'Sign in to send feedback.'
      step.value = 'error'
      return
    }
    if (!title.value.trim()) {
      errorMessage.value = 'Title is required.'
      return
    }

    step.value = 'submitting'
    errorMessage.value = null

    const user = auth.getUser?.() ?? null
    const metadata = collectFeedbackMetadata({
      appVersion: String((config.public as { appVersion?: string }).appVersion ?? ''),
      deployEnvironment: String((config.public as { deployEnvironment?: string }).deployEnvironment ?? ''),
      user,
    })

    const headers: Record<string, string> = {}
    const token = auth.getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      await $fetch(submitPath.value, {
        method: 'POST',
        headers,
        body: {
          title: title.value.trim(),
          description: description.value.trim(),
          email: email.value.trim() || undefined,
          screenshotBase64: screenshotDataUrl.value || undefined,
          metadata,
          idempotencyKey: nanoid(16),
        },
      })

      const thanks = 'Your feedback was submitted.'
      open.value = false
      step.value = 'idle'
      screenshotDataUrl.value = null
      originalScreenshotDataUrl.value = null
      title.value = ''
      description.value = ''
      email.value = auth.getUser?.()?.email ?? ''
      errorMessage.value = null
      successMessage.value = thanks
      if (import.meta.client) {
        window.setTimeout(() => {
          successMessage.value = null
        }, 4000)
      }
    }
    catch (error: unknown) {
      const fetchError = error as { data?: { message?: string }, message?: string, statusMessage?: string }
      errorMessage.value
        = fetchError.data?.message
          || fetchError.statusMessage
          || fetchError.message
          || 'Failed to submit feedback'
      step.value = 'error'
    }
  }

  return {
    open,
    step,
    screenshotDataUrl,
    originalScreenshotDataUrl,
    title,
    description,
    email,
    errorMessage,
    successMessage,
    captureGuideVisible,
    isEnabled,
    start,
    close,
    includeScreenshot,
    setAnnotatedScreenshot,
    cancelAnnotate,
    clearScreenshot,
    submit,
  }
}
