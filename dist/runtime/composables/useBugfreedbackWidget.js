import { computed, useRuntimeConfig, useState } from "#imports";
import { $fetch } from "ofetch";
import { nanoid } from "nanoid";
import { BUGFREEDBACK_ANNOTATE_SCALE } from "../constants.js";
import { collectFeedbackMetadata } from "../utils/collectFeedbackMetadata.js";
import { captureTabScreenshot } from "../utils/captureTabScreenshot.js";
import { withFeedbackOverlayHidden } from "../utils/hideFeedbackOverlayForCapture.js";
import { scaleImageDataUrl } from "../utils/scaleImageDataUrl.js";
import { useBugfreedbackAuth } from "./useBugfreedbackAuth.js";
export function useBugfreedbackWidget() {
  const config = useRuntimeConfig();
  const auth = useBugfreedbackAuth();
  const publicConfig = computed(
    () => config.public.bugfreedback ?? {}
  );
  const open = useState("bugfreedback-open", () => false);
  const step = useState("bugfreedback-step", () => "idle");
  const screenshotDataUrl = useState("bugfreedback-screenshot", () => null);
  const originalScreenshotDataUrl = useState("bugfreedback-original-screenshot", () => null);
  const title = useState("bugfreedback-title", () => "");
  const description = useState("bugfreedback-description", () => "");
  const email = useState("bugfreedback-email", () => "");
  const errorMessage = useState("bugfreedback-error", () => null);
  const successMessage = useState("bugfreedback-success", () => null);
  const isEnabled = computed(() => Boolean(publicConfig.value.enabled));
  const authMode = computed(() => publicConfig.value.auth ?? "optional");
  const submitPath = computed(() => publicConfig.value.submitPath ?? "/api/_bugfreedback/submit");
  function requireAuthIfNeeded() {
    if (authMode.value === "none" || authMode.value === "optional") {
      if (authMode.value === "required" && !auth.getToken()) {
        return false;
      }
      return true;
    }
    if (!auth.getToken()) {
      return false;
    }
    return true;
  }
  function resetFormFields() {
    title.value = "";
    description.value = "";
    email.value = auth.getUser?.()?.email ?? "";
    errorMessage.value = null;
    successMessage.value = null;
  }
  function close() {
    open.value = false;
    step.value = "idle";
    screenshotDataUrl.value = null;
    originalScreenshotDataUrl.value = null;
    resetFormFields();
  }
  function start() {
    if (!isEnabled.value) {
      return;
    }
    if (authMode.value === "required" && !auth.getToken()) {
      errorMessage.value = "Sign in to send feedback.";
      open.value = true;
      step.value = "error";
      return;
    }
    resetFormFields();
    screenshotDataUrl.value = null;
    originalScreenshotDataUrl.value = null;
    open.value = true;
    step.value = "form";
  }
  async function includeScreenshot() {
    if (authMode.value === "required" && !auth.getToken()) {
      errorMessage.value = "Sign in to send feedback.";
      step.value = "error";
      return;
    }
    errorMessage.value = null;
    step.value = "capture";
    originalScreenshotDataUrl.value = null;
    try {
      const rawDataUrl = await withFeedbackOverlayHidden(() => captureTabScreenshot());
      const dataUrl = await scaleImageDataUrl(rawDataUrl, BUGFREEDBACK_ANNOTATE_SCALE);
      originalScreenshotDataUrl.value = dataUrl;
      step.value = "annotate";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Screen capture failed";
      if (/NotAllowedError|Permission denied|denied/i.test(message) || error?.name === "NotAllowedError") {
        errorMessage.value = "Screen capture was cancelled or denied. Please allow sharing this tab and try again.";
      } else {
        errorMessage.value = message;
      }
      step.value = "form";
    }
  }
  function setAnnotatedScreenshot(dataUrl) {
    screenshotDataUrl.value = dataUrl;
    originalScreenshotDataUrl.value = null;
    step.value = "form";
  }
  function cancelAnnotate() {
    originalScreenshotDataUrl.value = null;
    step.value = "form";
  }
  function clearScreenshot() {
    screenshotDataUrl.value = null;
    originalScreenshotDataUrl.value = null;
  }
  async function submit() {
    if (!requireAuthIfNeeded() && authMode.value === "required") {
      errorMessage.value = "Sign in to send feedback.";
      step.value = "error";
      return;
    }
    if (!title.value.trim()) {
      errorMessage.value = "Title is required.";
      return;
    }
    step.value = "submitting";
    errorMessage.value = null;
    const user = auth.getUser?.() ?? null;
    const metadata = collectFeedbackMetadata({
      appVersion: String(config.public.appVersion ?? ""),
      deployEnvironment: String(config.public.deployEnvironment ?? ""),
      user
    });
    const headers = {};
    const token = auth.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    try {
      await $fetch(submitPath.value, {
        method: "POST",
        headers,
        body: {
          title: title.value.trim(),
          description: description.value.trim(),
          email: email.value.trim() || void 0,
          screenshotBase64: screenshotDataUrl.value || void 0,
          metadata,
          idempotencyKey: nanoid(16)
        }
      });
      const thanks = "Your feedback was submitted.";
      open.value = false;
      step.value = "idle";
      screenshotDataUrl.value = null;
      originalScreenshotDataUrl.value = null;
      title.value = "";
      description.value = "";
      email.value = auth.getUser?.()?.email ?? "";
      errorMessage.value = null;
      successMessage.value = thanks;
      if (import.meta.client) {
        window.setTimeout(() => {
          successMessage.value = null;
        }, 4e3);
      }
    } catch (error) {
      const fetchError = error;
      errorMessage.value = fetchError.data?.message || fetchError.statusMessage || fetchError.message || "Failed to submit feedback";
      step.value = "error";
    }
  }
  return {
    open,
    step,
    screenshotDataUrl,
    originalScreenshotDataUrl,
    title,
    description,
    email,
    errorMessage,
    successMessage,
    isEnabled,
    start,
    close,
    includeScreenshot,
    setAnnotatedScreenshot,
    cancelAnnotate,
    clearScreenshot,
    submit
  };
}
