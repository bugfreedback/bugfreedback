<script setup lang="ts">
import { computed } from 'vue'
import { BUGFREEDBACK_CAPTURE_GUIDE_ROOT_ID } from '../constants'
import { detectCaptureEnvironment } from '../utils/detectCaptureEnvironment'
import { resolveCapturePermissionGuide } from '../utils/resolveCapturePermissionGuide'

const guide = computed(() => {
  if (import.meta.server || typeof navigator === 'undefined') {
    return resolveCapturePermissionGuide({ os: 'unknown', browser: 'unknown' })
  }
  return resolveCapturePermissionGuide(detectCaptureEnvironment(navigator.userAgent))
})

const targetStyle = computed(() => ({
  top: `${guide.value.target.topPercent}%`,
  left: `${guide.value.target.leftPercent}%`,
}))

const layoutClass = computed(() => `bf-capture-guide__layout--${guide.value.placement}`)

function renderStepSegments(step: string): { text: string, bold: boolean }[] {
  return step.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return { text: part.slice(2, -2), bold: true }
    }
    return { text: part, bold: false }
  })
}
</script>

<template>
  <Teleport to="body">
    <div
      :id="BUGFREEDBACK_CAPTURE_GUIDE_ROOT_ID"
      class="bf-capture-guide"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bf-capture-guide-title"
    >
      <div
        class="bf-capture-guide__scrim"
        aria-hidden="true"
      />

      <div
        class="bf-capture-guide__layout"
        :class="layoutClass"
      >
        <div
          class="bf-capture-guide__target"
          :style="targetStyle"
          aria-hidden="true"
        >
          <span class="bf-capture-guide__target-ring" />
        </div>

        <div class="bf-capture-guide__card">
          <span
            class="bf-capture-guide__card-arrow"
            aria-hidden="true"
          />
          <h2 id="bf-capture-guide-title">
            {{ guide.heading }}
          </h2>
          <ol class="bf-capture-guide__steps">
            <li
              v-for="(step, index) in guide.steps"
              :key="index"
            >
              <span
                v-for="(segment, segmentIndex) in renderStepSegments(step)"
                :key="segmentIndex"
              >
                <strong v-if="segment.bold">{{ segment.text }}</strong>
                <template v-else>{{ segment.text }}</template>
              </span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.bf-capture-guide {
  position: fixed;
  inset: 0;
  z-index: 10060;
  pointer-events: none;
}

.bf-capture-guide__scrim {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.62);
  backdrop-filter: blur(1px);
}

.bf-capture-guide__layout {
  position: absolute;
  inset: 0;
}

.bf-capture-guide__layout--center-modal .bf-capture-guide__card {
  position: absolute;
  left: 50%;
  bottom: 10%;
  transform: translateX(-50%);
  max-width: min(24rem, calc(100vw - 2rem));
}

.bf-capture-guide__layout--top-center-bar .bf-capture-guide__card {
  position: absolute;
  left: 50%;
  top: 22%;
  transform: translateX(-50%);
  max-width: min(24rem, calc(100vw - 2rem));
}

.bf-capture-guide__target {
  position: absolute;
  transform: translate(-50%, -50%);
}

.bf-capture-guide__target-ring {
  display: block;
  width: 6rem;
  height: 3.5rem;
  border: 2px dashed rgba(255, 255, 255, 0.9);
  border-radius: 0.65rem;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.25);
}

.bf-capture-guide__layout--center-modal .bf-capture-guide__target-ring {
  width: 7rem;
  height: 4rem;
}

.bf-capture-guide__card {
  position: relative;
  padding: 1rem 1.15rem;
  border-radius: 0.75rem;
  background: #f8fafc;
  color: #0f172a;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
  pointer-events: auto;
}

.bf-capture-guide__card-arrow {
  position: absolute;
  left: 50%;
  top: -0.75rem;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 0.65rem solid transparent;
  border-right: 0.65rem solid transparent;
  border-bottom: 0.75rem solid #f8fafc;
}

.bf-capture-guide__layout--top-center-bar .bf-capture-guide__card-arrow {
  top: auto;
  bottom: -0.75rem;
  border-bottom: none;
  border-top: 0.75rem solid #f8fafc;
}

.bf-capture-guide__layout--top-center-bar .bf-capture-guide__target {
  top: 8% !important;
}

.bf-capture-guide__card h2 {
  margin: 0 0 0.65rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.35;
}

.bf-capture-guide__steps {
  margin: 0;
  padding-left: 1.2rem;
  font-size: 0.875rem;
  line-height: 1.55;
  color: #334155;
}

.bf-capture-guide__steps li + li {
  margin-top: 0.35rem;
}
</style>
