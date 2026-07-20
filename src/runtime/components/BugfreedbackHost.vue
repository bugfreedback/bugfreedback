<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'
import {
  BUGFREEDBACK_LAUNCHER_EDGE_NUDGE_PX,
  BUGFREEDBACK_ROOT_ID,
} from '../constants'
import { useBugfreedbackWidget } from '../composables/useBugfreedbackWidget'
import BugfreedbackAnnotator from './BugfreedbackAnnotator.vue'

const {
  open,
  step,
  screenshotDataUrl,
  originalScreenshotDataUrl,
  title,
  description,
  email,
  errorMessage,
  isEnabled,
  start,
  close,
  includeScreenshot,
  setAnnotatedScreenshot,
  cancelAnnotate,
  clearScreenshot,
  submit,
} = useBugfreedbackWidget()

const config = useRuntimeConfig()
const ui = computed(() => (config.public.bugfreedback ?? {}) as {
  primaryColor?: string
  secondaryColor?: string
  primaryTextColor?: string
  modalBgColor?: string
  modalTextColor?: string
  annotateBgColor?: string
  annotateTextColor?: string
  buttonLayout?: 'horizontal' | 'vertical'
  position?: { edge?: 'left' | 'right' | 'top' | 'bottom', offsetX?: number, offsetY?: number }
  label?: string
})

const panelVisible = computed(
  () => open.value && step.value !== 'idle' && step.value !== 'capture',
)

const isAnnotateStep = computed(() => step.value === 'annotate')
const isFormStep = computed(() => step.value === 'form' || step.value === 'submitting')

const panelTitle = computed(() => {
  if (isAnnotateStep.value) {
    return 'Annotate Feedback Screenshot'
  }
  return ui.value.label ?? 'Feedback'
})

const launcherStyle = computed(() => {
  const edge = ui.value.position?.edge ?? 'right'
  const offsetX = ui.value.position?.offsetX ?? 0
  const offsetY = ui.value.position?.offsetY ?? 0
  const layout = ui.value.buttonLayout ?? 'vertical'
  const nudge = BUGFREEDBACK_LAUNCHER_EDGE_NUDGE_PX
  const primary = ui.value.primaryColor ?? 'var(--bugfreedback-primary, #3b82f6)'
  const text = ui.value.primaryTextColor ?? 'var(--bugfreedback-primary-text, #fff)'

  const base: Record<string, string> = {
    position: 'fixed',
    zIndex: '10050',
    backgroundColor: primary,
    color: text,
    padding: '0.55rem 1.1rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '700',
    letterSpacing: '0.04em',
    boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
  }

  if (layout === 'vertical' && (edge === 'left' || edge === 'right')) {
    base.top = offsetY ? `calc(50% + ${offsetY}px)` : '50%'
    if (edge === 'right') {
      base.right = '0px'
      base.transform = `translateX(${nudge + offsetX}px) translateY(-50%) rotate(-90deg)`
      base.borderRadius = '0.5rem 0.5rem 0 0'
    }
    else {
      base.left = '0px'
      base.transform = `translateX(${-nudge - offsetX}px) translateY(-50%) rotate(90deg)`
      base.borderRadius = '0.5rem 0.5rem 0 0'
    }
    return base
  }

  // Horizontal launcher along top/bottom (or edge fallback).
  const alongTop = edge === 'top' || edge === 'left'
  if (alongTop) {
    base.top = '0px'
    base.left = offsetX ? `calc(50% + ${offsetX}px)` : '50%'
    base.transform = `translateX(-50%) translateY(${-nudge + offsetY}px)`
    base.borderRadius = '0 0 0.5rem 0.5rem'
  }
  else {
    base.bottom = '0px'
    base.left = offsetX ? `calc(50% + ${offsetX}px)` : '50%'
    base.transform = `translateX(-50%) translateY(${nudge + offsetY}px)`
    base.borderRadius = '0.5rem 0.5rem 0 0'
  }
  return base
})

const panelStyle = computed(() => {
  if (isAnnotateStep.value) {
    return {
      backgroundColor: ui.value.annotateBgColor ?? 'var(--bugfreedback-annotate-bg, #3f3f46)',
      color: ui.value.annotateTextColor ?? 'var(--bugfreedback-annotate-text, #f4f4f5)',
    }
  }
  return {
    backgroundColor: ui.value.modalBgColor
      ?? ui.value.secondaryColor
      ?? 'var(--bugfreedback-modal-bg, #0f172a)',
    color: ui.value.modalTextColor ?? 'var(--bugfreedback-modal-text, #fff)',
  }
})
</script>

<template>
  <Teleport
    v-if="isEnabled"
    to="body"
  >
    <div
      :id="BUGFREEDBACK_ROOT_ID"
      class="bf-root"
    >
      <button
        v-show="!open"
        type="button"
        class="bf-launcher"
        :style="launcherStyle"
        :aria-label="`Open ${ui.label ?? 'Feedback'}`"
        @click="start"
      >
        {{ ui.label ?? 'Feedback' }}
      </button>

      <div
        v-if="panelVisible"
        class="bf-panel"
        :class="{ 'bf-panel--annotate': isAnnotateStep, 'bf-panel--form': !isAnnotateStep }"
        :style="panelStyle"
        role="dialog"
        aria-modal="true"
        :aria-label="panelTitle"
      >
        <div class="bf-panel__header">
          <h2>{{ panelTitle }}</h2>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            size="sm"
            aria-label="Close feedback"
            @click="isAnnotateStep ? cancelAnnotate() : close()"
          />
        </div>

        <div
          class="bf-panel__body"
          :class="{ 'bf-panel__body--annotate': isAnnotateStep }"
        >
          <BugfreedbackAnnotator
            v-if="step === 'annotate' && originalScreenshotDataUrl"
            :image-data-url="originalScreenshotDataUrl"
            @continue="setAnnotatedScreenshot"
            @cancel="cancelAnnotate"
          />

          <template v-else-if="isFormStep">
            <div class="bf-form-block">
              <UButton
                v-if="!screenshotDataUrl"
                color="primary"
                variant="soft"
                icon="i-lucide-camera"
                class="w-full justify-center"
                :disabled="step === 'submitting'"
                @click="includeScreenshot"
              >
                Include screenshot
              </UButton>
              <div
                v-else
                class="bf-screenshot"
              >
                <img
                  :src="screenshotDataUrl"
                  alt="Annotated feedback screenshot"
                >
                <div class="bf-screenshot__actions">
                  <UButton
                    color="neutral"
                    variant="soft"
                    size="xs"
                    class="flex-1 justify-center"
                    :disabled="step === 'submitting'"
                    @click="includeScreenshot"
                  >
                    Replace screenshot
                  </UButton>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    :disabled="step === 'submitting'"
                    @click="clearScreenshot"
                  >
                    Remove
                  </UButton>
                </div>
              </div>
            </div>

            <label class="bf-field">
              <span>Email</span>
              <input
                v-model="email"
                type="email"
                :disabled="step === 'submitting'"
              >
            </label>
            <label class="bf-field">
              <span>Title <em>*</em></span>
              <input
                v-model="title"
                type="text"
                placeholder="Short summary"
                :disabled="step === 'submitting'"
              >
            </label>
            <label class="bf-field">
              <span>Description</span>
              <textarea
                v-model="description"
                rows="4"
                placeholder="What happened? What did you expect?"
                :disabled="step === 'submitting'"
              />
            </label>
            <p
              v-if="errorMessage"
              class="bf-error"
            >
              {{ errorMessage }}
            </p>
          </template>

          <template v-else-if="step === 'error'">
            <p class="bf-error">
              {{ errorMessage || 'Something went wrong.' }}
            </p>
          </template>
        </div>

        <div
          v-if="isFormStep || step === 'error'"
          class="bf-panel__footer"
        >
          <UButton
            v-if="step === 'form'"
            color="primary"
            @click="submit"
          >
            Submit
          </UButton>
          <UButton
            v-else-if="step === 'submitting'"
            color="primary"
            loading
            disabled
          >
            Submitting…
          </UButton>
          <template v-else-if="step === 'error'">
            <UButton
              color="neutral"
              variant="soft"
              @click="close"
            >
              Close
            </UButton>
            <UButton
              color="primary"
              @click="start"
            >
              Try again
            </UButton>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.bf-root {
  pointer-events: none;
}
.bf-launcher,
.bf-panel {
  pointer-events: auto;
}
.bf-panel {
  position: fixed;
  z-index: 10051;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.35);
}
.bf-panel--form {
  right: 1rem;
  bottom: 1rem;
  width: min(28rem, calc(100vw - 2rem));
  max-height: calc(100dvh - 2rem);
}
.bf-panel--annotate {
  top: 50%;
  left: 50%;
  width: 75vw;
  height: 75vh;
  max-width: 75vw;
  max-height: 75vh;
  transform: translate(-50%, -50%);
  border-color: rgba(0, 0, 0, 0.1);
}
.bf-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}
.bf-panel__header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}
.bf-panel__body {
  flex: 1;
  min-height: 0;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.875rem;
}
.bf-panel__body--annotate {
  overflow: hidden;
}
.bf-panel__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}
.bf-icon-btn {
  border: none;
  background: transparent;
  color: inherit;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.8;
}
.bf-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.bf-field span {
  font-weight: 700;
}
.bf-field em {
  font-style: normal;
  opacity: 0.7;
}
.bf-field input,
.bf-field textarea {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.25);
  color: inherit;
  padding: 0.5rem 0.65rem;
  font: inherit;
}
.bf-btn {
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  padding: 0.45rem 0.85rem;
  font: inherit;
  cursor: pointer;
}
.bf-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.bf-btn--block {
  width: 100%;
}
.bf-btn--primary {
  background: var(--bugfreedback-primary, #3b82f6);
  color: var(--bugfreedback-primary-text, #fff);
  border-color: transparent;
}
.bf-btn--ghost {
  background: transparent;
}
.bf-screenshot img {
  width: 100%;
  max-height: 12rem;
  object-fit: contain;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.4);
}
.bf-screenshot__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.bf-error {
  color: #f87171;
  margin: 0;
  font-size: 0.8rem;
}
</style>
