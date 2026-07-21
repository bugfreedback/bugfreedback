# Notion export

Creates a **page** in a Notion database with feedback fields.

## Prerequisites

1. [Notion integration](https://www.notion.so/my-integrations) with access to the target database
2. **Database ID** — share the database with the integration, copy ID from the URL
3. Database should have at least a **title** property (default name `Name`)

## Configuration

```ts
export default defineNuxtConfig({
  bugfreedback: {
    export: {
      provider: 'notion',
      token: process.env.BUGFREEDBACK_NOTION_TOKEN || '',
      databaseId: process.env.BUGFREEDBACK_NOTION_DATABASE_ID || '',
    },
  },
})
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `BUGFREEDBACK_NOTION_TOKEN` | Integration secret (`secret_…`) |
| `BUGFREEDBACK_NOTION_DATABASE_ID` | Database UUID |

## Page properties

The adapter sets:

- **Title** — feedback title
- **Page body** — description, screenshot URL, reporter email, metadata JSON

Returns `{ id, url }` with the Notion page URL.

## Example

```ts
bugfreedback: {
  storage: { provider: 'none' }, // or gcs/s3 for screenshots
  export: {
    provider: 'notion',
    token: process.env.BUGFREEDBACK_NOTION_TOKEN!,
    databaseId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
}
```

Share the database with your integration under **Connections** in Notion.
