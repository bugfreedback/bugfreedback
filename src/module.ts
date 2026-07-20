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
  BUGFREEDBACK_DEFAULT_PRIMARY,
  BUGFREEDBACK_DEFAULT_PRIMARY_TEXT,
  BUGFREEDBACK_DEFAULT_SECONDARY,
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
  defaults: {
    enabled: true,
    primaryColor: BUGFREEDBACK_DEFAULT_PRIMARY,
    secondaryColor: BUGFREEDBACK_DEFAULT_SECONDARY,
    primaryTextColor: BUGFREEDBACK_DEFAULT_PRIMARY_TEXT,
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

    nuxt.options.runtimeConfig.public.bugfreedback = {
      enabled: options.enabled,
      primaryColor: options.primaryColor,
      secondaryColor: options.secondaryColor,
      primaryTextColor: options.primaryTextColor,
      buttonLayout: options.buttonLayout,
      position: options.position,
      auth: options.auth,
      label: options.label,
      submitPath: options.submitPath,
    }

    // Private secrets / adapter config — never expose to client.
    nuxt.options.runtimeConfig.bugfreedback = {
      ...(nuxt.options.runtimeConfig.bugfreedback as Record<string, unknown> | undefined),
      storage: options.storage,
      export: options.export,
    }

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      pathPrefix: false,
    })

    addImportsDir(resolver.resolve('./runtime/composables'))
    addImportsDir(resolver.resolve('./runtime/utils'))

    addPlugin(resolver.resolve('./runtime/plugin'))
    addPlugin(resolver.resolve('./runtime/plugins/console-ring.client'))

    addServerHandler({
      route: options.submitPath,
      method: 'post',
      handler: resolver.resolve('./runtime/server/api/submit.post'),
    })
  },
})
