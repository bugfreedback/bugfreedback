# Slack export

Posts a **Block Kit message** to a Slack channel via an [Incoming Webhook](https://api.slack.com/messaging/webhooks).

## Prerequisites

1. Create an Incoming Webhook in your Slack workspace ([app settings](https://api.slack.com/apps))
2. Copy the webhook URL (`https://hooks.slack.com/services/…`)
3. Optional: screenshot public URL — [Storage](../storage.md) — rendered as an `image` block

## Configuration

```ts
export default defineNuxtConfig({
  bugfreedback: {
    export: {
      provider: 'slack',
      webhookUrl: process.env.BUGFREEDBACK_SLACK_WEBHOOK_URL || '',
      channel: '#feedback', // optional override
    },
  },
})
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `BUGFREEDBACK_SLACK_WEBHOOK_URL` | Incoming webhook URL |

## Message format

Blocks include:

- **Header** — feedback title
- **Section** — description (mrkdwn)
- **Image** — screenshot (when URL present)
- **Context** — reporter email

Returns `{ id: 'slack-ok' }` on success (Slack webhooks do not return a permalink).

## Example

```ts
export: {
  provider: 'slack',
  webhookUrl: 'https://hooks.slack.com/services/T000/B000/XXXXXXXX',
  channel: '#product-feedback',
}
```

::: tip
For threaded replies or rich workflows, use the [Webhook](./webhook.md) adapter to POST into your own Slack bot endpoint instead.
:::
