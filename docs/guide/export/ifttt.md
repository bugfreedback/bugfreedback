# IFTTT export

Triggers an [IFTTT Maker Webhook](https://ifttt.com/maker_webhooks) event with feedback fields as JSON payload ingredients.

## Prerequisites

1. IFTTT account with Maker Webhooks service enabled
2. **Event name** — e.g. `feedback_received`
3. **Webhook key** — from [Maker Webhooks settings](https://ifttt.com/maker_webhooks/settings)

## Configuration

```ts
export default defineNuxtConfig({
  bugfreedback: {
    export: {
      provider: 'ifttt',
      eventName: process.env.BUGFREEDBACK_IFTTT_EVENT_NAME || 'feedback_received',
      webhookKey: process.env.BUGFREEDBACK_IFTTT_WEBHOOK_KEY || '',
    },
  },
})
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `BUGFREEDBACK_IFTTT_EVENT_NAME` | Event name |
| `BUGFREEDBACK_IFTTT_WEBHOOK_KEY` | Maker webhook key |

## Request

`POST https://maker.ifttt.com/trigger/{eventName}/with/key/{webhookKey}`

Body:

```json
{
  "value1": "Feedback title",
  "value2": "Description text",
  "value3": "https://screenshot-url or metadata JSON"
}
```

Mapping:

- `value1` — title
- `value2` — description
- `value3` — screenshot URL if present, else stringified metadata

Returns `{ id: 'ifttt-ok' }` on success.

## Example IFTTT applet

1. **If** Webhooks → Receive a web request → Event name: `feedback_received`
2. **Then** Email / Slack / Google Sheets — use `Value1`, `Value2`, `Value3`

## Full config

```ts
bugfreedback: {
  storage: { provider: 'none' },
  export: {
    provider: 'ifttt',
    eventName: 'bugfreedback_submit',
    webhookKey: process.env.BUGFREEDBACK_IFTTT_WEBHOOK_KEY!,
  },
}
```

::: tip
For richer payloads, prefer [Webhook](./webhook.md) and handle IFTTT or other automations in your own receiver.
:::
