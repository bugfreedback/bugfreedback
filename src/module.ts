import {
  addComponentsDir,
  addImportsDir,
  addPlugin,
  addServerHandler,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import type { ModuleOptions } from './types'
import {
  BUGFREEDBACK_DEFAULT_ANNOTATE_BG,
  BUGFREEDBACK_DEFAULT_ANNOTATE_TEXT,
  BUGFREEDBACK_DEFAULT_MODAL_BG,
  BUGFREEDBACK_DEFAULT_MODAL_TEXT,
  BUGFREEDBACK_DEFAULT_PRIMARY,
  BUGFREEDBACK_DEFAULT_PRIMARY_TEXT,
  BUGFREEDBACK_DEFAULT_SECONDARY,
  BUGFREEDBACK_ICON_NAMES,
} from './runtime/constants'

export type {
  ModuleOptions,
  BugfreedbackAuthMode,
  BugfreedbackButtonLayout,
  BugfreedbackEdge,
  BugfreedbackExportOptions,
  BugfreedbackExportProvider,
  BugfreedbackPositionOptions,
  BugfreedbackStorageOptions,
  BugfreedbackStorageProvider,
} from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@bugfreedback/bugfreedback',
    configKey: 'bugfreedback',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  // Ensure Nuxt UI (and its icon stack) is available so UButton / UIcon work.
  moduleDependencies: {
    '@nuxt/ui': {
      version: '>=3.0.0',
    },
  },
  defaults: {
    enabled: true,
    primaryColor: BUGFREEDBACK_DEFAULT_PRIMARY,
    secondaryColor: BUGFREEDBACK_DEFAULT_SECONDARY,
    primaryTextColor: BUGFREEDBACK_DEFAULT_PRIMARY_TEXT,
    modalBgColor: BUGFREEDBACK_DEFAULT_MODAL_BG,
    modalTextColor: BUGFREEDBACK_DEFAULT_MODAL_TEXT,
    annotateBgColor: BUGFREEDBACK_DEFAULT_ANNOTATE_BG,
    annotateTextColor: BUGFREEDBACK_DEFAULT_ANNOTATE_TEXT,
    buttonLayout: 'vertical',
    position: {
      edge: 'right',
      offsetX: 0,
      offsetY: 0,
    },
    auth: 'optional',
    label: 'Feedback',
    submitPath: '/api/_bugfreedback/submit',
    storage: {
      provider: 'none',
    },
    export: {
      provider: 'webhook',
      url: '',
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const modalBgColor = options.modalBgColor || options.secondaryColor || BUGFREEDBACK_DEFAULT_MODAL_BG

    nuxt.options.runtimeConfig.public.bugfreedback = {
      enabled: options.enabled,
      primaryColor: options.primaryColor,
      secondaryColor: options.secondaryColor,
      primaryTextColor: options.primaryTextColor,
      modalBgColor,
      modalTextColor: options.modalTextColor,
      annotateBgColor: options.annotateBgColor,
      annotateTextColor: options.annotateTextColor,
      buttonLayout: options.buttonLayout,
      position: options.position,
      auth: options.auth,
      label: options.label,
      submitPath: options.submitPath,
    }

    // Private secrets / adapter config — never expose to client.
    // Cast: Nuxt infers export shape from defaults (`webhook` + `url`); options allow all providers.
    nuxt.options.runtimeConfig.bugfreedback = {
      ...(nuxt.options.runtimeConfig.bugfreedback as Record<string, unknown> | undefined),
      storage: options.storage,
      export: options.export,
    } as typeof nuxt.options.runtimeConfig.bugfreedback

    // Bundle Lucide icons used by the widget so they render offline / during SSR.
    const iconOptions = nuxt.options as { icon?: {
      clientBundle?: { icons?: string[], scan?: boolean }
    } }
    iconOptions.icon ||= {}
    iconOptions.icon.clientBundle ||= {}
    const existing = iconOptions.icon.clientBundle.icons ?? []
    iconOptions.icon.clientBundle.icons = Array.from(new Set([
      ...existing,
      ...BUGFREEDBACK_ICON_NAMES,
    ]))

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      pathPrefix: false,
    })

    addImportsDir(resolver.resolve('./runtime/composables'))

    addPlugin(resolver.resolve('./runtime/plugin'))
    addPlugin(resolver.resolve('./runtime/plugins/console-ring.client'))

    addServerHandler({
      route: options.submitPath,
      method: 'post',
      handler: resolver.resolve('./runtime/server/api/submit.post'),
    })
  },
})
