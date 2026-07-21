# Getting started

Install the module and its peer dependency:

```bash
npm install @bugfreedback/bugfreedback @nuxt/ui
```

Register it in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@bugfreedback/bugfreedback'],
  bugfreedback: {
    enabled: true,
    primaryColor: '#3b82f6',
    primaryTextColor: '#ffffff',
    modalBgColor: '#0f172a',
    modalTextColor: '#ffffff',
    buttonLayout: 'vertical',
    position: { edge: 'right', offsetX: 0, offsetY: 0 },
    auth: 'optional',
    storage: {
      provider: 'gcs',
      bucket: process.env.BUGFREEDBACK_GCS_BUCKET || '',
    },
    export: {
      provider: 'github',
      token: process.env.BUGFREEDBACK_GITHUB_TOKEN || '',
      owner: 'your-org',
      repo: 'your-repo',
    },
  },
})
```

Mount the host component once in your default layout:

```vue
<template>
  <div>
    <slot />
    <BugfreedbackHost />
  </div>
</template>
```

## Try the demo

Run the included playground to see the widget and capture screenshots for your own docs:

```bash
git clone https://github.com/bugfreedback/bugfreedback.git
cd bugfreedback
npm install
npm run dev
```

Open `http://localhost:3000` and click **Feedback** on the right edge. See [Demo site](./demo.md) for screenshot checklist.

![Feedback launcher on the demo app](/screenshots/launcher.png)

## Choose an export provider

Each destination has a dedicated guide with credentials, env vars, and full config examples:

| Provider | Guide |
|----------|--------|
| GitHub Issues | [GitHub export](./export/github.md) |
| Linear | [Linear export](./export/linear.md) |
| Slack | [Slack export](./export/slack.md) |
| Custom HTTP | [Webhook export](./export/webhook.md) |
| All providers | [Adapters overview](./adapters.md) |

## Auth (optional)

When `auth: 'required'`, provide a token accessor from a Nuxt plugin:

```ts
export default defineNuxtPlugin(() => {
  const auth = useAuth() // your app's auth composable
  provideBugfreedbackAuth({
    getToken: () => auth.getToken(),
    getUser: () => auth.user.value,
  })
})
```

On the server, you may also set `event.context.bugfreedbackReporter` from your own middleware.

## Widget flow

1. **Form** — title, description, optional screenshot
2. **Annotate** — pen, shapes, text, redact (when screenshot attached)
3. **Submit** — uploads screenshot (if configured) and calls export adapter

![Feedback form modal](/screenshots/form.png)

![Annotate screenshot step](/screenshots/annotate.png)

![Text tool with edit panel](/screenshots/annotate-text.png)

See [Configuration](./configuration.md) for colors, layout, and auth modes.
