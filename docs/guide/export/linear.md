# Linear export

Creates a **Linear issue** via the GraphQL API in the configured team.

## Prerequisites

1. [Linear API key](https://linear.app/settings/account/security) with issue create permission
2. **Team ID** (UUID) — open team settings → copy from URL or use Linear API
3. Public screenshot URL if attaching images — [Storage](../storage.md)

## Configuration

```ts
export default defineNuxtConfig({
  bugfreedback: {
    export: {
      provider: 'linear',
      apiKey: process.env.BUGFREEDBACK_LINEAR_API_KEY || '',
      teamId: process.env.BUGFREEDBACK_LINEAR_TEAM_ID || '',
      labelIds: ['optional-label-uuid'], // optional
    },
  },
})
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `BUGFREEDBACK_LINEAR_API_KEY` | Personal API key |
| `BUGFREEDBACK_LINEAR_TEAM_ID` | Team UUID |

## What gets created

- **Title** — feedback title
- **Description** — markdown/plain text with description, screenshot link, reporter email, metadata
- **Team** — `teamId`
- **Labels** — optional `labelIds`

Returns `{ id, url }` with the Linear issue URL.

## Example with storage

```ts
bugfreedback: {
  storage: {
    provider: 's3',
    bucket: 'feedback-screenshots',
    publicBaseUrl: 'https://cdn.example.com',
  },
  export: {
    provider: 'linear',
    apiKey: process.env.BUGFREEDBACK_LINEAR_API_KEY!,
    teamId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  },
}
```
