import { defineNuxtPlugin, useRuntimeConfig } from "#imports";
import { pushFeedbackConsoleEntry } from "../utils/feedbackConsoleRing.js";
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const enabled = Boolean(config.public.bugfreedback?.enabled);
  if (!enabled) {
    return;
  }
  const levels = ["log", "info", "warn", "error"];
  for (const level of levels) {
    const original = console[level].bind(console);
    console[level] = (...args) => {
      try {
        pushFeedbackConsoleEntry(level, args);
      } catch {
      }
      original(...args);
    };
  }
});
