import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import type { Plugin } from 'nuxt/app'
import { pushFeedbackConsoleEntry } from '../utils/feedbackConsoleRing'

/**
 * Ring-buffer recent console output for feedback metadata when the widget is enabled.
 */
export default defineNuxtPlugin((): void => {
  const config = useRuntimeConfig()
  const enabled = Boolean((config.public.bugfreedback as { enabled?: boolean } | undefined)?.enabled)
  if (!enabled) {
    return
  }

  const levels = ['log', 'info', 'warn', 'error'] as const
  for (const level of levels) {
    const original = console[level].bind(console)
    console[level] = (...args: unknown[]) => {
      try {
        pushFeedbackConsoleEntry(level, args)
      }
      catch {
        // Never break logging.
      }
      original(...args)
    }
  }
}) satisfies Plugin
