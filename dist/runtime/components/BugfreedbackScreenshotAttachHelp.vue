<script setup>
import { computed, ref } from "vue";
import { resolveScreenshotAttachHelpFromUserAgent } from "../utils/resolveScreenshotAttachHelp";
const open = ref(false);
const help = computed(() => {
  if (import.meta.server || typeof navigator === "undefined") {
    return resolveScreenshotAttachHelpFromUserAgent("");
  }
  return resolveScreenshotAttachHelpFromUserAgent(navigator.userAgent);
});
function renderStepSegments(step) {
  return step.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return { text: part.slice(2, -2), bold: true };
    }
    return { text: part, bold: false };
  });
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
.bf-attach-help{flex-shrink:0;position:relative}.bf-attach-help__trigger{min-width:2rem;padding-left:.45rem;padding-right:.45rem}.bf-attach-help__panel{background:rgba(15,23,42,.98);border:1px solid hsla(0,0%,100%,.15);border-radius:.65rem;box-shadow:0 16px 40px rgba(0,0,0,.35);color:#f8fafc;padding:.75rem .85rem;position:absolute;right:0;top:calc(100% + .35rem);width:min(18rem,calc(100vw - 2rem));z-index:2}.bf-attach-help__panel h3{font-size:.85rem;font-weight:700;line-height:1.35;margin:0 0 .45rem}.bf-attach-help__note{font-size:.75rem;line-height:1.45;margin:0 0 .5rem;opacity:.85}.bf-attach-help__steps{font-size:.75rem;line-height:1.5;margin:0;padding-left:1.15rem}.bf-attach-help__steps li+li{margin-top:.35rem}.bf-attach-help__close{margin-top:.55rem}
</style>
