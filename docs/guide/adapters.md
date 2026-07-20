# Adapters

## Storage

### GCS

```ts
storage: {
  provider: 'gcs',
  bucket: 'my-feedback-screenshots',
  objectPrefix: 'feedback/',
}
```

Uses Application Default Credentials (`@google-cloud/storage`). Bucket objects should be publicly readable so issue trackers can embed screenshots.

### S3 / S3-compatible

```ts
storage: {
  provider: 's3',
  bucket: 'my-feedback-screenshots',
  region: 'us-east-1',
  endpoint: 'https://minio.example.com', // optional
  forcePathStyle: true,
  publicBaseUrl: 'https://cdn.example.com',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}
```

Works with AWS S3, Cloudflare R2, MinIO, and other S3-compatible APIs.

### none

Disable screenshot uploads (`storage: { provider: 'none' }`). Submissions without screenshots still work; screenshot submissions return 503.

## Export

| Provider | Key options |
|----------|-------------|
| `github` | `token`, `owner`, `repo`, `labels?` |
| `linear` | `apiKey`, `teamId`, `labelIds?` |
| `jira` | `baseUrl`, `email`, `apiToken`, `projectKey`, `issueType?` |
| `notion` | `token`, `databaseId` |
| `slack` | `webhookUrl`, `channel?` |
| `asana` | `token`, `projectGid`, `workspaceGid?` |
| `trello` | `apiKey`, `token`, `listId` |
| `webhook` | `url`, `headers?` |
| `ifttt` | `eventName`, `webhookKey` |

Each integration is a separate adapter behind a shared `ExportAdapter` interface.
