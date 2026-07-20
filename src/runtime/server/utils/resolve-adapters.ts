import type { BugfreedbackExportOptions, BugfreedbackStorageOptions } from '../../../types'
import { createAsanaExportAdapter } from '../adapters/export/asana'
import { createGithubExportAdapter } from '../adapters/export/github'
import { createIftttExportAdapter } from '../adapters/export/ifttt'
import { createJiraExportAdapter } from '../adapters/export/jira'
import { createLinearExportAdapter } from '../adapters/export/linear'
import { createNotionExportAdapter } from '../adapters/export/notion'
import { createSlackExportAdapter } from '../adapters/export/slack'
import { createTrelloExportAdapter } from '../adapters/export/trello'
import { createWebhookExportAdapter } from '../adapters/export/webhook'
import type { ExportAdapter } from '../adapters/export/types'
import { createGcsStorageAdapter } from '../adapters/storage/gcs'
import { createS3StorageAdapter } from '../adapters/storage/s3'
import type { StorageAdapter } from '../adapters/storage/types'
import { DEFAULT_OBJECT_PREFIX } from '../adapters/storage'

function env(name: string): string {
  return String(process.env[name] ?? '').trim()
}

/** Apply host env overrides so secrets can be injected at runtime (Cloud Run, etc.). */
export function resolveStorageOptions(
  options: BugfreedbackStorageOptions | undefined,
): BugfreedbackStorageOptions {
  const base = options ?? { provider: 'none' as const }
  if (base.provider === 'gcs') {
    return {
      ...base,
      bucket: base.bucket || env('FEEDBACK_GCS_BUCKET') || env('BUGFREEDBACK_GCS_BUCKET'),
      objectPrefix: base.objectPrefix || DEFAULT_OBJECT_PREFIX,
    }
  }
  if (base.provider === 's3') {
    return {
      ...base,
      bucket: base.bucket || env('BUGFREEDBACK_S3_BUCKET') || env('AWS_S3_BUCKET'),
      region: base.region || env('BUGFREEDBACK_S3_REGION') || env('AWS_REGION') || undefined,
      endpoint: base.endpoint || env('BUGFREEDBACK_S3_ENDPOINT') || undefined,
      publicBaseUrl: base.publicBaseUrl || env('BUGFREEDBACK_S3_PUBLIC_BASE_URL') || undefined,
      accessKeyId: base.accessKeyId || env('BUGFREEDBACK_S3_ACCESS_KEY_ID') || env('AWS_ACCESS_KEY_ID') || undefined,
      secretAccessKey: base.secretAccessKey || env('BUGFREEDBACK_S3_SECRET_ACCESS_KEY') || env('AWS_SECRET_ACCESS_KEY') || undefined,
    }
  }
  return base
}

export function resolveExportOptions(
  options: BugfreedbackExportOptions | undefined,
): BugfreedbackExportOptions | null {
  if (!options) {
    return null
  }
  if (options.provider === 'github') {
    return {
      ...options,
      token: options.token || env('GITHUB_FEEDBACK_TOKEN') || env('BUGFREEDBACK_GITHUB_TOKEN'),
      owner: options.owner || env('GITHUB_FEEDBACK_OWNER') || env('BUGFREEDBACK_GITHUB_OWNER'),
      repo: options.repo || env('GITHUB_FEEDBACK_REPO') || env('BUGFREEDBACK_GITHUB_REPO'),
    }
  }
  if (options.provider === 'webhook') {
    return {
      ...options,
      url: options.url || env('BUGFREEDBACK_WEBHOOK_URL'),
    }
  }
  if (options.provider === 'linear') {
    return {
      ...options,
      apiKey: options.apiKey || env('BUGFREEDBACK_LINEAR_API_KEY'),
      teamId: options.teamId || env('BUGFREEDBACK_LINEAR_TEAM_ID'),
    }
  }
  if (options.provider === 'slack') {
    return {
      ...options,
      webhookUrl: options.webhookUrl || env('BUGFREEDBACK_SLACK_WEBHOOK_URL'),
    }
  }
  if (options.provider === 'notion') {
    return {
      ...options,
      token: options.token || env('BUGFREEDBACK_NOTION_TOKEN'),
      databaseId: options.databaseId || env('BUGFREEDBACK_NOTION_DATABASE_ID'),
    }
  }
  if (options.provider === 'jira') {
    return {
      ...options,
      baseUrl: options.baseUrl || env('BUGFREEDBACK_JIRA_BASE_URL'),
      email: options.email || env('BUGFREEDBACK_JIRA_EMAIL'),
      apiToken: options.apiToken || env('BUGFREEDBACK_JIRA_API_TOKEN'),
      projectKey: options.projectKey || env('BUGFREEDBACK_JIRA_PROJECT_KEY'),
    }
  }
  if (options.provider === 'asana') {
    return {
      ...options,
      token: options.token || env('BUGFREEDBACK_ASANA_TOKEN'),
      projectGid: options.projectGid || env('BUGFREEDBACK_ASANA_PROJECT_GID'),
    }
  }
  if (options.provider === 'trello') {
    return {
      ...options,
      apiKey: options.apiKey || env('BUGFREEDBACK_TRELLO_API_KEY'),
      token: options.token || env('BUGFREEDBACK_TRELLO_TOKEN'),
      listId: options.listId || env('BUGFREEDBACK_TRELLO_LIST_ID'),
    }
  }
  if (options.provider === 'ifttt') {
    return {
      ...options,
      eventName: options.eventName || env('BUGFREEDBACK_IFTTT_EVENT_NAME'),
      webhookKey: options.webhookKey || env('BUGFREEDBACK_IFTTT_WEBHOOK_KEY'),
    }
  }
  return options
}

export function createResolvedStorageAdapter(
  options: BugfreedbackStorageOptions | undefined,
): StorageAdapter | null {
  const resolved = resolveStorageOptions(options)
  if (resolved.provider === 'none') {
    return null
  }
  if (resolved.provider === 'gcs') {
    return createGcsStorageAdapter({ bucket: resolved.bucket })
  }
  if (resolved.provider === 's3') {
    return createS3StorageAdapter(resolved)
  }
  return null
}

export function createResolvedExportAdapter(
  options: BugfreedbackExportOptions | undefined,
): ExportAdapter {
  const resolved = resolveExportOptions(options)
  if (!resolved) {
    throw new Error('Feedback export is not configured')
  }
  switch (resolved.provider) {
    case 'github':
      return createGithubExportAdapter(resolved)
    case 'webhook':
      return createWebhookExportAdapter(resolved)
    case 'linear':
      return createLinearExportAdapter(resolved)
    case 'slack':
      return createSlackExportAdapter(resolved)
    case 'notion':
      return createNotionExportAdapter(resolved)
    case 'jira':
      return createJiraExportAdapter(resolved)
    case 'asana':
      return createAsanaExportAdapter(resolved)
    case 'trello':
      return createTrelloExportAdapter(resolved)
    case 'ifttt':
      return createIftttExportAdapter(resolved)
    default: {
      const neverProvider: never = resolved
      throw new Error(`Unsupported export provider: ${(neverProvider as { provider: string }).provider}`)
    }
  }
}
