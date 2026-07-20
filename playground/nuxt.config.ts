export default defineNuxtConfig({
  modules: ['@nuxt/ui', '../src/module'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-01-01',
  bugfreedback: {
    enabled: true,
    primaryColor: '#0ea5e9',
    primaryTextColor: '#ffffff',
    modalBgColor: '#0f172a',
    modalTextColor: '#ffffff',
    annotateBgColor: '#3f3f46',
    annotateTextColor: '#f4f4f5',
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
