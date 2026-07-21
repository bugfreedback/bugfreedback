# bugfreedback

Nuxt feedback widget with screen capture, annotation, pluggable screenshot storage (GCS / S3), and modular export adapters (GitHub, Linear, Jira, Notion, Slack, Asana, Trello, Webhook, IFTTT).

- **Package:** [`@bugfreedback/bugfreedback`](https://www.npmjs.com/package/@bugfreedback/bugfreedback)
- **Docs:** [https://bugfreedback.github.io/bugfreedback/](https://bugfreedback.github.io/bugfreedback/)
- **Repo:** [bugfreedback/bugfreedback](https://github.com/bugfreedback/bugfreedback)

## Quick start

Install the module and its peer dependency:

```bash
npm install @bugfreedback/bugfreedback @nuxt/ui
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@bugfreedback/bugfreedback'],
  bugfreedback: {
    enabled: true,
    storage: { provider: 'gcs', bucket: process.env.BUGFREEDBACK_GCS_BUCKET! },
    export: {
      provider: 'github',
      token: process.env.BUGFREEDBACK_GITHUB_TOKEN!,
      owner: 'your-org',
      repo: 'your-repo',
    },
  },
})
```

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <slot />
    <BugfreedbackHost />
  </div>
</template>
```

See the [getting started guide](https://bugfreedback.github.io/bugfreedback/guide/getting-started) for auth, theming, and adapter configuration.

## Development

```bash
npm install
npm run dev:prepare
npm run dev          # playground
npm test
npm run docs:dev     # VitePress site
```

Maintainers: see [RELEASING.md](./RELEASING.md) for version bumps and npm publish.

## License

MIT
