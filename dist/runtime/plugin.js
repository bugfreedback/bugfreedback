import { defineNuxtPlugin, useRuntimeConfig } from "#imports";
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const ui = config.public.bugfreedback;
  if (import.meta.client && typeof document !== "undefined" && ui) {
    const root = document.documentElement;
    if (ui.primaryColor) {
      root.style.setProperty("--bugfreedback-primary", ui.primaryColor);
    }
    if (ui.secondaryColor) {
      root.style.setProperty("--bugfreedback-secondary", ui.secondaryColor);
    }
    if (ui.primaryTextColor) {
      root.style.setProperty("--bugfreedback-primary-text", ui.primaryTextColor);
    }
  }
});
