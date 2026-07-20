export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: '2025-01-01',
  bugfreedback: {
    enabled: true,
    primaryColor: '#0ea5e9',
    secondaryColor: '#0f172a',
    buttonLayout: 'vertical',
    position: {
      edge: 'right',
      offsetX: 0,
      offsetY: 0,
    },
    auth: 'none',
    label: 'Feedback',
    storage: {
      provider: 'none',
    },
    export: {
      provider: 'webhook',
      url: process.env.BUGFREEDBACK_WEBHOOK_URL || 'http://127.0.0.1:9/disabled',
    },
  },
})
