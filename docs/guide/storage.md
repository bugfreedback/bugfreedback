# Storage adapters

Screenshots are optional. When enabled, the module uploads PNG data to your bucket and passes a **public HTTPS URL** to the export adapter (GitHub Issues, Slack, etc.).

## GCS

Uses [`@google-cloud/storage`](https://cloud.google.com/storage/docs) with Application Default Credentials (Workload Identity on GCP, or `GOOGLE_APPLICATION_CREDENTIALS` locally).

### `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  bugfreedback: {
    storage: {
      provider: 'gcs',
      bucket: 'my-app-feedback-screenshots',
      objectPrefix: 'feedback/', // optional, default feedback/
    },
  },
})
```

### Environment variables

| Variable | Purpose |
|----------|---------|
| `BUGFREEDBACK_GCS_BUCKET` | Bucket name (overrides config when empty) |
| `FEEDBACK_GCS_BUCKET` | Legacy Wayfarer alias |

### Bucket setup

- Grant the runtime service account **Storage Object Creator** on the bucket
- Make uploaded objects **publicly readable** (or serve via a public CDN URL) so issue trackers can embed images
- Do not use short-lived signed URLs for issue bodies — they expire before triage

---

## S3

Works with AWS S3, Cloudflare R2, MinIO, and other S3-compatible APIs via `@aws-sdk/client-s3`.

### AWS S3

```ts
export default defineNuxtConfig({
  bugfreedback: {
    storage: {
      provider: 's3',
      bucket: 'my-app-feedback',
      region: 'us-east-1',
      publicBaseUrl: 'https://my-app-feedback.s3.amazonaws.com',
      objectPrefix: 'feedback/',
      accessKeyId: process.env.BUGFREEDBACK_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.BUGFREEDBACK_S3_SECRET_ACCESS_KEY,
    },
  },
})
```

### Cloudflare R2

```ts
storage: {
  provider: 's3',
  bucket: 'feedback-screenshots',
  endpoint: 'https://<account-id>.r2.cloudflarestorage.com',
  region: 'auto',
  forcePathStyle: true,
  publicBaseUrl: 'https://cdn.example.com/feedback',
  accessKeyId: process.env.BUGFREEDBACK_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.BUGFREEDBACK_S3_SECRET_ACCESS_KEY,
}
```

### Environment variables

| Variable | Purpose |
|----------|---------|
| `BUGFREEDBACK_S3_BUCKET` | Bucket name |
| `BUGFREEDBACK_S3_REGION` | AWS region |
| `BUGFREEDBACK_S3_ENDPOINT` | Custom endpoint (R2, MinIO) |
| `BUGFREEDBACK_S3_PUBLIC_BASE_URL` | CDN / public URL prefix |
| `BUGFREEDBACK_S3_ACCESS_KEY_ID` | Access key |
| `BUGFREEDBACK_S3_SECRET_ACCESS_KEY` | Secret key |
| `AWS_*` | Fallback aliases |

---

## none

Disable server-side screenshot uploads. The form and annotate UI still work; screenshot bytes are not persisted.

```ts
bugfreedback: {
  storage: { provider: 'none' },
}
```

Submissions **with** a screenshot attachment return **503** when storage is `none`. Text-only feedback still exports normally.

Use `none` in the [playground](./demo.md) or when screenshots are not required.
