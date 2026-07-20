# bugfreedback

Nuxt feedback widget with screen capture, annotation, pluggable screenshot storage (GCS / S3), and modular export adapters (GitHub, Linear, Jira, Notion, Slack, Asana, Trello, Webhook, IFTTT).

- **Package:** [`@bugfreedback/bugfreedback`](https://www.npmjs.com/package/@bugfreedback/bugfreedback)
- **Docs:** [https://bugfreedback.github.io/bugfreedback/](https://bugfreedback.github.io/bugfreedback/)
- **Repo:** [bugfreedback/bugfreedback](https://github.com/bugfreedback/bugfreedback)

## Quick start

```bash
npm install @bugfreedback/bugfreedback
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@bugfreedback/bugfreedback'],
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

## Development

```bash
npm install
npm run dev:prepare
npm run dev          # playground
npm test
npm run docs:dev     # VitePress site
```

## Versioning & releases

Versions are managed by CI:

1. Conventional Commits on `main`
2. **release-please** opens a Release PR and creates a GitHub Release
3. **publish** workflow sets `package.json` version from the release tag (not committed) and publishes to npm

Authors never hand-edit the package version.

## License

MIT
