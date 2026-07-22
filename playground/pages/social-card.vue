<template>
  <div class="og-card">
    <div class="og-card__panel">
      <div class="og-card__brand">
        <img
          src="/logo.png"
          alt=""
          class="og-card__logo"
          width="44"
          height="44"
        >
        <span class="og-card__name">bugfreedback</span>
      </div>
      <h1 class="og-card__title">
        Feedback for Nuxt
      </h1>
      <p class="og-card__tagline">
        Capture, annotate, and route feedback to GitHub, Linear, Slack, and more.
      </p>
      <ul class="og-card__features">
        <li>Screenshot capture + annotation</li>
        <li>Self-hosted storage (GCS / S3)</li>
        <li>MIT-licensed — no vendor portal</li>
      </ul>
    </div>

    <BugfreedbackHost v-if="launcherReady" />
  </div>
</template>

<script setup lang="ts">
import { BUGFREEDBACK_LAUNCHER_EDGE_NUDGE_PX } from '../../src/runtime/constants'

type BugfreedbackUiConfig = {
  buttonLayout?: 'horizontal' | 'vertical'
  position?: { edge?: 'left' | 'right' | 'top' | 'bottom', offsetX?: number, offsetY?: number }
}

definePageMeta({
  layout: false,
})

const launcherReady = ref(false)
const config = useRuntimeConfig()
const bugfreedback = config.public.bugfreedback as BugfreedbackUiConfig

// Apply before BugfreedbackHost mounts so the launcher renders horizontally at the bottom.
bugfreedback.buttonLayout = 'horizontal'
bugfreedback.position = {
  edge: 'bottom',
  offsetX: 0,
  // Counter the edge nudge so the full tab stays inside the 630px capture frame.
  offsetY: -BUGFREEDBACK_LAUNCHER_EDGE_NUDGE_PX,
}
launcherReady.value = true

useHead({
  style: [
    {
      innerHTML: `
        html, body, #__nuxt {
          width: 1200px !important;
          height: 630px !important;
          min-height: 630px !important;
          overflow: hidden !important;
        }
        #nuxt-devtools-container,
        .nuxt-devtools-icon,
        .nuxt-devtools-nuxt-button,
        [data-nuxt-devtools] {
          display: none !important;
        }
        #bugfreedback-root .bf-launcher {
          left: auto !important;
          /* ~one button width inset from the right edge */
          right: 6.25rem !important;
          transform: translateY(0) !important;
        }
      `,
    },
  ],
})
</script>

<style scoped>
.og-card {
  box-sizing: border-box;
  width: 1200px;
  height: 630px;
  margin: 0 auto;
  padding: 3.5rem 4rem 5rem;
  overflow: hidden;
  position: relative;
  background:
    radial-gradient(circle at 14% 18%, rgba(14, 165, 233, 0.22), transparent 46%),
    radial-gradient(circle at 86% 82%, rgba(251, 191, 36, 0.18), transparent 42%),
    linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%);
}

.og-card__panel {
  max-width: 34rem;
}

.og-card__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.og-card__logo {
  display: block;
  width: 2.75rem;
  height: 2.75rem;
  object-fit: contain;
  flex-shrink: 0;
}

.og-card__name {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0f172a;
}

.og-card__title {
  margin: 0 0 0.85rem;
  font-size: 3.25rem;
  line-height: 1.05;
  letter-spacing: -0.04em;
  color: #0f172a;
}

.og-card__tagline {
  margin: 0 0 1.5rem;
  font-size: 1.35rem;
  line-height: 1.45;
  color: #334155;
  max-width: 32rem;
}

.og-card__features {
  margin: 0;
  padding-left: 1.35rem;
  font-size: 1.05rem;
  line-height: 1.7;
  color: #475569;
}
</style>
