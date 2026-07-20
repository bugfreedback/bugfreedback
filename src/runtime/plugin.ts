import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import type { Plugin } from 'nuxt/app'

/**
 * Registers CSS variables from public module config.
 */
export default defineNuxtPlugin((): void => {
  const config = useRuntimeConfig()
  const ui = config.public.bugfreedback as {
    primaryColor?: string
    secondaryColor?: string
    primaryTextColor?: string
  } | undefined

  if (import.meta.client && typeof document !== 'undefined' && ui) {
    const root = document.documentElement
    if (ui.primaryColor) {
      root.style.setProperty('--bugfreedback-primary', ui.primaryColor)
    }
    if (ui.secondaryColor) {
      root.style.setProperty('--bugfreedback-secondary', ui.secondaryColor)
    }
    if (ui.primaryTextColor) {
      root.style.setProperty('--bugfreedback-primary-text', ui.primaryTextColor)
    }
  }
}) satisfies Plugin
