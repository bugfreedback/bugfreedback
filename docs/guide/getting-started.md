# Getting started

Install the Nuxt module:

```bash
npm install @bugfreedback/bugfreedback
```

Register it in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@bugfreedback/bugfreedback'],
  bugfreedback: {
    enabled: true,
    primaryColor: '#3b82f6',
    secondaryColor: '#1e293b',
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
  runtimeConfig: {
    // Prefer overriding private adapter secrets via runtimeConfig / env:
    // NUXT_BUGFREEDBACK_*  (see Nuxt runtimeConfig docs)
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
