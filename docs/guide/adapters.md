# Adapters overview

bugfreedback separates **screenshot storage** from **export** (where feedback tickets land). Configure both in `nuxt.config.ts`; secrets can also come from environment variables (see each guide).

## Storage

Upload annotated screenshots to object storage so export adapters can embed durable HTTPS URLs.

| Provider | Guide |
|----------|--------|
| Google Cloud Storage | [GCS / storage](./storage.md#gcs) |
| S3-compatible (AWS, R2, MinIO) | [S3 storage](./storage.md#s3) |
| Disabled | [No storage](./storage.md#none) |

## Export

Route each submission to one export destination:

| Provider | Creates | Guide |
|----------|---------|--------|
| `github` | GitHub Issue | [GitHub](./export/github.md) |
| `linear` | Linear issue | [Linear](./export/linear.md) |
| `jira` | Jira issue | [Jira](./export/jira.md) |
| `notion` | Notion database page | [Notion](./export/notion.md) |
| `slack` | Slack message (incoming webhook) | [Slack](./export/slack.md) |
| `asana` | Asana task | [Asana](./export/asana.md) |
| `trello` | Trello card | [Trello](./export/trello.md) |
| `webhook` | HTTP POST to your URL | [Webhook](./export/webhook.md) |
| `ifttt` | IFTTT Maker Webhook trigger | [IFTTT](./export/ifttt.md) |

## Typical production stack

```ts
// nuxt.config.ts — GitHub Issues + GCS screenshots (Wayfarer-style)
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@bugfreedback/bugfreedback'],
  bugfreedback: {
    enabled: true,
    storage: {
      provider: 'gcs',
      bucket: process.env.BUGFREEDBACK_GCS_BUCKET || '',
      objectPrefix: 'feedback/',
    },
    export: {
      provider: 'github',
      token: process.env.BUGFREEDBACK_GITHUB_TOKEN || '',
      owner: 'your-org',
      repo: 'your-app',
      labels: ['feedback', 'from:widget'],
    },
  },
})
```

See [Demo site](./demo.md) to run the playground and [Configuration](./configuration.md) for theme and auth options.
