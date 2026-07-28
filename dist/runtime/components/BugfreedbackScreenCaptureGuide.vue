<script setup>
import { computed } from "vue";
import { BUGFREEDBACK_CAPTURE_GUIDE_ROOT_ID } from "../constants";
import { detectCaptureEnvironment } from "../utils/detectCaptureEnvironment";
import { resolveCapturePermissionGuide } from "../utils/resolveCapturePermissionGuide";
const guide = computed(() => {
  if (import.meta.server || typeof navigator === "undefined") {
    return resolveCapturePermissionGuide({ os: "unknown", browser: "unknown" });
  }
  return resolveCapturePermissionGuide(detectCaptureEnvironment(navigator.userAgent));
});
const targetStyle = computed(() => ({
  top: `${guide.value.target.topPercent}%`,
  left: `${guide.value.target.leftPercent}%`
}));
function cardTransform(anchor) {
  if (anchor === "left") {
    return "translate(0, -50%)";
  }
  if (anchor === "right") {
    return "translate(-100%, -50%)";
  }
  return "translate(-50%, 0)";
}
const cardStyle = computed(() => ({
  top: `${guide.value.card.topPercent}%`,
  left: `${guide.value.card.leftPercent}%`,
  transform: cardTransform(guide.value.card.anchor)
}));
const arrowClass = computed(
  () => `bf-capture-guide__card-arrow--${guide.value.arrow}`
);
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

      <div class="bf-capture-guide__layout">
        <div
          v-if="guide.showTarget"
          class="bf-capture-guide__target"
          :class="{ 'bf-capture-guide__target--default': guide.isDefault }"
          :style="targetStyle"
          aria-hidden="true"
        >
          <span class="bf-capture-guide__target-ring" />
        </div>

        <div
          class="bf-capture-guide__card"
          :style="cardStyle"
        >
          <span
            class="bf-capture-guide__card-arrow"
            :class="arrowClass"
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
.bf-capture-guide{inset:0;pointer-events:none;position:fixed;z-index:10060}.bf-capture-guide__scrim{backdrop-filter:blur(1px);background:rgba(15,23,42,.62)}.bf-capture-guide__layout,.bf-capture-guide__scrim{inset:0;position:absolute}.bf-capture-guide__target{position:absolute;transform:translate(-50%,-50%)}.bf-capture-guide__target-ring{border:2px dashed hsla(0,0%,100%,.9);border-radius:.55rem;box-shadow:0 0 0 4px rgba(14,165,233,.25);display:block;height:3rem;width:5.5rem}.bf-capture-guide__target--default .bf-capture-guide__target-ring{height:2.5rem;opacity:.75;width:4.5rem}.bf-capture-guide__card{background:#f8fafc;border-radius:.75rem;box-shadow:0 20px 45px rgba(0,0,0,.35);color:#0f172a;max-width:min(22rem,calc(100vw - 2rem));padding:1rem 1.15rem;pointer-events:auto;position:absolute}.bf-capture-guide__card-arrow{height:0;position:absolute;width:0}.bf-capture-guide__card-arrow--up{border-bottom:.75rem solid #f8fafc;top:-.75rem}.bf-capture-guide__card-arrow--down,.bf-capture-guide__card-arrow--up{border-left:.65rem solid transparent;border-right:.65rem solid transparent;left:50%;transform:translateX(-50%)}.bf-capture-guide__card-arrow--down{border-top:.75rem solid #f8fafc;bottom:-.75rem}.bf-capture-guide__card-arrow--left{border-right:.75rem solid #f8fafc;left:-.75rem}.bf-capture-guide__card-arrow--left,.bf-capture-guide__card-arrow--right{border-bottom:.65rem solid transparent;border-top:.65rem solid transparent;top:50%;transform:translateY(-50%)}.bf-capture-guide__card-arrow--right{border-left:.75rem solid #f8fafc;right:-.75rem}.bf-capture-guide__card h2{font-size:1rem;font-weight:700;line-height:1.35;margin:0 0 .65rem}.bf-capture-guide__steps{color:#334155;font-size:.875rem;line-height:1.55;margin:0;padding-left:1.2rem}.bf-capture-guide__steps li+li{margin-top:.35rem}
</style>
