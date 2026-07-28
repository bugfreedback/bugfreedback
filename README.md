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

See the [getting started guide](https://bugfreedback.github.io/bugfreedback/guide/getting-started) for theming and the full adapter catalog.

## Integration

### Submit API

The module registers `POST /api/_bugfreedback/submit` (override with `submitPath`). The widget uploads an optional screenshot to your configured storage adapter, then routes the report through your export adapter (GitHub Issue, Linear, Slack, custom webhook, etc.).

| Concern | Guide |
|---------|--------|
| Storage (GCS / S3) | [Storage](https://bugfreedback.github.io/bugfreedback/guide/storage) |
| Export providers | [Adapters overview](https://bugfreedback.github.io/bugfreedback/guide/adapters) |
| All module options | [Configuration](https://bugfreedback.github.io/bugfreedback/guide/configuration) |

### Runtime secrets

Adapter credentials can be set in `nuxt.config.ts` **or** injected at runtime via environment variables (useful for containers and CI/CD where secrets should not be baked into the build):

| Variable | Used for |
|----------|----------|
| `NUXT_BUGFREEDBACK_EXPORT_TOKEN` | GitHub export token (highest precedence) |
| `GITHUB_FEEDBACK_TOKEN` / `BUGFREEDBACK_GITHUB_TOKEN` | GitHub export token (fallbacks) |
| `NUXT_BUGFREEDBACK_STORAGE_BUCKET` | GCS screenshot bucket (highest precedence) |
| `FEEDBACK_GCS_BUCKET` / `BUGFREEDBACK_GCS_BUCKET` | GCS screenshot bucket (fallbacks) |
| `BUGFREEDBACK_*` | Per-provider export/storage overrides — see each [export guide](https://bugfreedback.github.io/bugfreedback/guide/adapters) |

Leave `token` / `bucket` empty in config when relying on runtime injection; the submit handler resolves secrets from `process.env` on each request.

### Auth hooks

bugfreedback does **not** validate JWTs itself. Host apps wire their own auth:

**Client** — set `auth: 'required'` and provide a token accessor:

```ts
export default defineNuxtPlugin(() => {
  provideBugfreedbackAuth({
    getToken: () => myAuth.getToken(),
    getUser: () => myAuth.user.value,
  })
})
```

The widget sends `Authorization: Bearer <token>` when a token is available.

**Server** — add Nitro middleware on the submit route that validates the Bearer token and sets reporter context:

```ts
// event.context.bugfreedbackReporter = { id, username, email }
```

With `auth: 'required'`, the submit handler returns `401` when neither a Bearer header nor `bugfreedbackReporter` is present. Token signature/expiry validation is the host's responsibility.

### Webhook export

For `export.provider: 'webhook'`, configure outbound auth headers so your receiver can verify requests:

```ts
export: {
  provider: 'webhook',
  url: process.env.BUGFREEDBACK_WEBHOOK_URL || '',
  headers: {
    Authorization: `Bearer ${process.env.BUGFREEDBACK_WEBHOOK_SECRET}`,
  },
},
```

See the [webhook export guide](https://bugfreedback.github.io/bugfreedback/guide/export/webhook) for payload format and response expectations.

### Screenshots on mobile and tablet

Mobile browsers (iOS and Android) do **not** support tab capture via `getDisplayMedia()`. On those platforms the widget shows **Attach a screenshot** instead of **Take a screenshot**, opens the device file picker, and runs the same annotate → submit flow.

A **(?)** help button next to attach explains how to take a system screenshot on the detected device (iPhone, iPad, Samsung, Pixel, OnePlus, Xiaomi, and other major Android OEMs).

| Platform | Screenshot method |
|----------|-------------------|
| Desktop (Windows, macOS, Linux) | **Take a screenshot** — tab capture + permission overlay |
| iOS / Android (phone or tablet) | **Attach a screenshot** — system screenshot + file picker |

## Development

```bash
npm install
npm run dev:prepare
npm run dev          # playground
npm test
npm run docs:dev     # VitePress site
```

Maintainers: see [RELEASING.md](./RELEASING.md) for version bumps and npm publish.

Docs & demo: `npm run docs:dev` · `npm run dev` (playground at http://localhost:3000)

## License

MIT
