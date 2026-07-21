# GitHub export

Creates a **GitHub Issue** in the configured repository with markdown body, optional screenshot embed, reporter email, and JSON metadata.

## Prerequisites

1. [Fine-grained](https://github.com/settings/tokens?type=beta) or classic PAT with **Issues: Read and write** on the target repo
2. (Recommended) GCS or S3 storage for screenshot URLs — see [Storage](../storage.md)

## Configuration

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@bugfreedback/bugfreedback'],
  bugfreedback: {
    enabled: true,
    storage: {
      provider: 'gcs',
      bucket: process.env.BUGFREEDBACK_GCS_BUCKET || '',
    },
    export: {
      provider: 'github',
      token: process.env.BUGFREEDBACK_GITHUB_TOKEN || '',
      owner: 'your-org',
      repo: 'your-app',
      labels: ['feedback', 'bug'],
    },
  },
})
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `BUGFREEDBACK_GITHUB_TOKEN` | PAT with issue write access |
| `BUGFREEDBACK_GITHUB_OWNER` | Org or user (overrides `owner` when empty) |
| `BUGFREEDBACK_GITHUB_REPO` | Repository name |
| `GITHUB_FEEDBACK_*` | Alternate names for the `BUGFREEDBACK_GITHUB_*` variables above |

## Issue body format

The adapter posts to `POST /repos/{owner}/{repo}/issues` with:

- **Title** — user-provided feedback title
- **Body** — markdown sections: Description, Screenshot (`![…](url)`), Reporter email, Environment (metadata JSON)
- **Labels** — optional array from config

Returns `{ id, url }` where `url` is the issue HTML URL.

## Production example with auth

Use this pattern when feedback should only be available outside production and reporters must be signed in:

```ts
bugfreedback: {
  enabled: process.env.NUXT_PUBLIC_DEPLOY_ENVIRONMENT !== 'production',
  primaryColor: '#3b82f6',
  modalBgColor: 'rgba(15, 23, 42, 0.98)',
  storage: {
    provider: 'gcs',
    bucket: process.env.FEEDBACK_GCS_BUCKET || '',
  },
  export: {
    provider: 'github',
    token: process.env.GITHUB_FEEDBACK_TOKEN || '',
    owner: process.env.GITHUB_FEEDBACK_OWNER || 'your-org',
    repo: process.env.GITHUB_FEEDBACK_REPO || 'your-app',
    labels: ['feedback'],
  },
  auth: 'required',
}
```

Pair with a client auth plugin (`provideBugfreedbackAuth`) and server middleware — see [Getting started](../getting-started.md#auth-optional).
