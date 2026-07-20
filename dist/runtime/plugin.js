import { defineNuxtPlugin, useRuntimeConfig } from "#imports";
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const ui = config.public.bugfreedback;
  if (import.meta.client && typeof document !== "undefined" && ui) {
    const root = document.documentElement;
    const pairs = [
      ["--bugfreedback-primary", ui.primaryColor],
      ["--bugfreedback-secondary", ui.secondaryColor],
      ["--bugfreedback-primary-text", ui.primaryTextColor],
      ["--bugfreedback-modal-bg", ui.modalBgColor || ui.secondaryColor],
      ["--bugfreedback-modal-text", ui.modalTextColor],
      ["--bugfreedback-annotate-bg", ui.annotateBgColor],
      ["--bugfreedback-annotate-text", ui.annotateTextColor]
    ];
    for (const [name, value] of pairs) {
      if (value) {
        root.style.setProperty(name, value);
      }
    }
  }
});
