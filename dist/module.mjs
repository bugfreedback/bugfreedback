import { defineNuxtModule, createResolver, addComponentsDir, addImportsDir, addPlugin, addServerHandler } from '@nuxt/kit';
import { BUGFREEDBACK_DEFAULT_PRIMARY_TEXT, BUGFREEDBACK_DEFAULT_SECONDARY, BUGFREEDBACK_DEFAULT_PRIMARY } from '../dist/runtime/constants.js';

const module$1 = defineNuxtModule({
  meta: {
    name: "@bugfreedback/bugfreedback",
    configKey: "bugfreedback",
    compatibility: {
      nuxt: ">=3.0.0"
    }
  },
  defaults: {
    enabled: true,
    primaryColor: BUGFREEDBACK_DEFAULT_PRIMARY,
    secondaryColor: BUGFREEDBACK_DEFAULT_SECONDARY,
    primaryTextColor: BUGFREEDBACK_DEFAULT_PRIMARY_TEXT,
    buttonLayout: "vertical",
    position: {
      edge: "right",
      offsetX: 0,
      offsetY: 0
    },
    auth: "optional",
    label: "Feedback",
    submitPath: "/api/_bugfreedback/submit",
    storage: {
      provider: "none"
    },
    export: {
      provider: "webhook",
      url: ""
    }
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    nuxt.options.runtimeConfig.public.bugfreedback = {
      enabled: options.enabled,
      primaryColor: options.primaryColor,
      secondaryColor: options.secondaryColor,
      primaryTextColor: options.primaryTextColor,
      buttonLayout: options.buttonLayout,
      position: options.position,
      auth: options.auth,
      label: options.label,
      submitPath: options.submitPath
    };
    nuxt.options.runtimeConfig.bugfreedback = {
      ...nuxt.options.runtimeConfig.bugfreedback,
      storage: options.storage,
      export: options.export
    };
    addComponentsDir({
      path: resolver.resolve("./runtime/components"),
      pathPrefix: false
    });
    addImportsDir(resolver.resolve("./runtime/composables"));
    addPlugin(resolver.resolve("./runtime/plugin"));
    addPlugin(resolver.resolve("./runtime/plugins/console-ring.client"));
    addServerHandler({
      route: options.submitPath,
      method: "post",
      handler: resolver.resolve("./runtime/server/api/submit.post")
    });
  }
});

export { module$1 as default };
