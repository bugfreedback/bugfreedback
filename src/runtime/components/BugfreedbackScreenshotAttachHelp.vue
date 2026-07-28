<script setup lang="ts">
import { computed, ref } from 'vue'
import { resolveScreenshotAttachHelpFromUserAgent } from '../utils/resolveScreenshotAttachHelp'

const open = ref(false)

const help = computed(() => {
  if (import.meta.server || typeof navigator === 'undefined') {
    return resolveScreenshotAttachHelpFromUserAgent('')
  }
  return resolveScreenshotAttachHelpFromUserAgent(navigator.userAgent)
})

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
  <div class="bf-attach-help">
    <UButton
      color="neutral"
      variant="soft"
      size="xs"
      icon="i-lucide-circle-help"
      aria-label="How to take a screenshot on this device"
      :aria-expanded="open"
      class="bf-attach-help__trigger"
      @click="open = !open"
    />
    <div
      v-if="open"
      class="bf-attach-help__panel"
      role="dialog"
      aria-labelledby="bf-attach-help-title"
    >
      <h3 id="bf-attach-help-title">
        {{ help.heading }}
      </h3>
      <p
        v-if="help.note"
        class="bf-attach-help__note"
      >
        {{ help.note }}
      </p>
      <ol class="bf-attach-help__steps">
        <li
          v-for="(step, index) in help.steps"
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
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        class="bf-attach-help__close"
        @click="open = false"
      >
        Close
      </UButton>
    </div>
  </div>
</template>

<style scoped>
.bf-attach-help {
  position: relative;
  flex-shrink: 0;
}
.bf-attach-help__trigger {
  min-width: 2rem;
  padding-left: 0.45rem;
  padding-right: 0.45rem;
}
.bf-attach-help__panel {
  position: absolute;
  top: calc(100% + 0.35rem);
  right: 0;
  z-index: 2;
  width: min(18rem, calc(100vw - 2rem));
  padding: 0.75rem 0.85rem;
  border-radius: 0.65rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(15, 23, 42, 0.98);
  color: #f8fafc;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
}
.bf-attach-help__panel h3 {
  margin: 0 0 0.45rem;
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1.35;
}
.bf-attach-help__note {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  line-height: 1.45;
  opacity: 0.85;
}
.bf-attach-help__steps {
  margin: 0;
  padding-left: 1.15rem;
  font-size: 0.75rem;
  line-height: 1.5;
}
.bf-attach-help__steps li + li {
  margin-top: 0.35rem;
}
.bf-attach-help__close {
  margin-top: 0.55rem;
}
</style>
