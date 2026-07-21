# Webhook export

POSTs a JSON payload to any HTTPS endpoint — useful for custom backends, Zapier, Make, or your own Slack/Discord bot.

## Configuration

```ts
export default defineNuxtConfig({
  bugfreedback: {
    export: {
      provider: 'webhook',
      url: process.env.BUGFREEDBACK_WEBHOOK_URL || 'https://hooks.example.com/feedback',
      headers: {
        'Authorization': `Bearer ${process.env.BUGFREEDBACK_WEBHOOK_SECRET}`,
        'X-Custom-Source': 'bugfreedback',
      },
    },
  },
})
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `BUGFREEDBACK_WEBHOOK_URL` | POST destination |

## Request format

`POST` with `Content-Type: application/json`:

```json
{
  "title": "Button does nothing",
  "description": "Clicking save on settings page has no effect",
  "email": "user@example.com",
  "screenshotUrl": "https://cdn.example.com/feedback/abc.png",
  "metadata": {
    "path": "/settings",
    "userAgent": "Mozilla/5.0 …",
    "appVersion": "1.2.3"
  }
}
```

## Response format

Your endpoint should return JSON with optional fields:

```json
{
  "id": "ticket-123",
  "url": "https://your-system.example/tickets/123"
}
```

If omitted, the adapter synthesizes an id from the response.

## Local testing (playground default)

The playground uses a disabled stub URL. Point at [webhook.site](https://webhook.site) or a local tunnel:

```bash
# .env
BUGFREEDBACK_WEBHOOK_URL=https://webhook.site/your-uuid
```

```ts
export: {
  provider: 'webhook',
  url: process.env.BUGFREEDBACK_WEBHOOK_URL || '',
}
```

## Example: forward to internal API

```ts
export: {
  provider: 'webhook',
  url: 'https://api.internal.example/v1/feedback',
  headers: {
    Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`,
  },
}
```

Your API receives the payload and can create tickets in any system.
