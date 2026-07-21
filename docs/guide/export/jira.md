# Jira export

Creates a **Jira Cloud issue** via REST API (`POST /rest/api/3/issue`).

## Prerequisites

1. Atlassian account with access to the project
2. [API token](https://id.atlassian.com/manage-profile/security/api-tokens) for the bot user email
3. **Project key** (e.g. `ENG`, `SUPPORT`)
4. Public screenshot URL for image embeds — [Storage](../storage.md)

## Configuration

```ts
export default defineNuxtConfig({
  bugfreedback: {
    export: {
      provider: 'jira',
      baseUrl: 'https://your-org.atlassian.net',
      email: process.env.BUGFREEDBACK_JIRA_EMAIL || '',
      apiToken: process.env.BUGFREEDBACK_JIRA_API_TOKEN || '',
      projectKey: 'ENG',
      issueType: 'Bug', // optional, default Bug
    },
  },
})
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `BUGFREEDBACK_JIRA_BASE_URL` | e.g. `https://your-org.atlassian.net` |
| `BUGFREEDBACK_JIRA_EMAIL` | Atlassian account email |
| `BUGFREEDBACK_JIRA_API_TOKEN` | API token |
| `BUGFREEDBACK_JIRA_PROJECT_KEY` | Project key |

## Issue content

- **Summary** — feedback title
- **Description** — Atlassian Document Format (ADF) with description, screenshot, reporter, metadata
- **Project** — `projectKey`
- **Issue type** — `issueType` (default `Bug`)

Returns `{ id, url }` where `id` is the issue key (e.g. `ENG-42`) and `url` is the browse link.

## Example

```ts
export: {
  provider: 'jira',
  baseUrl: process.env.BUGFREEDBACK_JIRA_BASE_URL!,
  email: 'bot@example.com',
  apiToken: process.env.BUGFREEDBACK_JIRA_API_TOKEN!,
  projectKey: 'SUPPORT',
  issueType: 'Task',
}
```
