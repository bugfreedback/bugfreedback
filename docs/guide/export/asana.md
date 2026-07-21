# Asana export

Creates an **Asana task** in the configured project.

## Prerequisites

1. [Personal access token](https://app.asana.com/0/developer-console) or OAuth token with task create scope
2. **Project GID** — from project URL or API (`GET /projects`)
3. Optional **workspace GID** if required by your token

## Configuration

```ts
export default defineNuxtConfig({
  bugfreedback: {
    export: {
      provider: 'asana',
      token: process.env.BUGFREEDBACK_ASANA_TOKEN || '',
      projectGid: process.env.BUGFREEDBACK_ASANA_PROJECT_GID || '',
      workspaceGid: process.env.BUGFREEDBACK_ASANA_WORKSPACE_GID, // optional
    },
  },
})
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `BUGFREEDBACK_ASANA_TOKEN` | PAT |
| `BUGFREEDBACK_ASANA_PROJECT_GID` | Project GID |
| `BUGFREEDBACK_ASANA_WORKSPACE_GID` | Workspace GID (optional) |

## Task content

- **Name** — feedback title
- **Notes** — description, screenshot URL, reporter, metadata
- **Projects** — `[projectGid]`

Returns `{ id, url }` with Asana task permalink.

## Example

```ts
export: {
  provider: 'asana',
  token: process.env.BUGFREEDBACK_ASANA_TOKEN!,
  projectGid: '1200123456789012',
}
```
