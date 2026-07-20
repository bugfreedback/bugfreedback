import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import type { Plugin } from 'nuxt/app'

type PublicUi = {
  primaryColor?: string
  secondaryColor?: string
  primaryTextColor?: string
  modalBgColor?: string
  modalTextColor?: string
  annotateBgColor?: string
  annotateTextColor?: string
}

/**
 * Registers CSS variables from public module config.
 */
export default defineNuxtPlugin((): void => {
  const config = useRuntimeConfig()
  const ui = config.public.bugfreedback as PublicUi | undefined

  if (import.meta.client && typeof document !== 'undefined' && ui) {
    const root = document.documentElement
    const pairs: Array<[string, string | undefined]> = [
      ['--bugfreedback-primary', ui.primaryColor],
      ['--bugfreedback-secondary', ui.secondaryColor],
      ['--bugfreedback-primary-text', ui.primaryTextColor],
      ['--bugfreedback-modal-bg', ui.modalBgColor || ui.secondaryColor],
      ['--bugfreedback-modal-text', ui.modalTextColor],
      ['--bugfreedback-annotate-bg', ui.annotateBgColor],
      ['--bugfreedback-annotate-text', ui.annotateTextColor],
    ]
    for (const [name, value] of pairs) {
      if (value) {
        root.style.setProperty(name, value)
      }
    }
  }
}) satisfies Plugin
