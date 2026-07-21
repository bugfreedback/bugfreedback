# Trello export

Creates a **Trello card** on the configured list.

## Prerequisites

1. [Trello Power-Up API key](https://trello.com/power-ups/admin)
2. User **token** (authorize via OAuth / token link)
3. **List ID** — ID of the list where cards should be created

## Configuration

```ts
export default defineNuxtConfig({
  bugfreedback: {
    export: {
      provider: 'trello',
      apiKey: process.env.BUGFREEDBACK_TRELLO_API_KEY || '',
      token: process.env.BUGFREEDBACK_TRELLO_TOKEN || '',
      listId: process.env.BUGFREEDBACK_TRELLO_LIST_ID || '',
    },
  },
})
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `BUGFREEDBACK_TRELLO_API_KEY` | Power-Up API key |
| `BUGFREEDBACK_TRELLO_TOKEN` | User token |
| `BUGFREEDBACK_TRELLO_LIST_ID` | Target list ID |

## Card content

- **Name** — feedback title
- **Description** — description, screenshot URL, reporter, metadata

Returns `{ id, url }` with the card short URL.

## Example

```ts
export: {
  provider: 'trello',
  apiKey: process.env.BUGFREEDBACK_TRELLO_API_KEY!,
  token: process.env.BUGFREEDBACK_TRELLO_TOKEN!,
  listId: '5f8a9b0c1d2e3f4a5b6c7d8e',
}
```

Generate a token: `https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&key=YOUR_API_KEY`
