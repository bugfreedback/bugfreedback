import type { Plugin } from 'nuxt/app';
/**
 * Registers CSS variables from public module config.
 */
declare const _default: Plugin<Record<string, unknown>> & import("#app").ObjectPlugin<Record<string, unknown>>;
export default _default;
