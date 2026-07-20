import { createAsanaExportAdapter } from "../adapters/export/asana.js";
import { createGithubExportAdapter } from "../adapters/export/github.js";
import { createIftttExportAdapter } from "../adapters/export/ifttt.js";
import { createJiraExportAdapter } from "../adapters/export/jira.js";
import { createLinearExportAdapter } from "../adapters/export/linear.js";
import { createNotionExportAdapter } from "../adapters/export/notion.js";
import { createSlackExportAdapter } from "../adapters/export/slack.js";
import { createTrelloExportAdapter } from "../adapters/export/trello.js";
import { createWebhookExportAdapter } from "../adapters/export/webhook.js";
import { createGcsStorageAdapter } from "../adapters/storage/gcs.js";
import { createS3StorageAdapter } from "../adapters/storage/s3.js";
import { DEFAULT_OBJECT_PREFIX } from "../adapters/storage/index.js";
function env(name) {
  return String(process.env[name] ?? "").trim();
}
export function resolveStorageOptions(options) {
  const base = options ?? { provider: "none" };
  if (base.provider === "gcs") {
    return {
      ...base,
      bucket: base.bucket || env("FEEDBACK_GCS_BUCKET") || env("BUGFREEDBACK_GCS_BUCKET"),
      objectPrefix: base.objectPrefix || DEFAULT_OBJECT_PREFIX
    };
  }
  if (base.provider === "s3") {
    return {
      ...base,
      bucket: base.bucket || env("BUGFREEDBACK_S3_BUCKET") || env("AWS_S3_BUCKET"),
      region: base.region || env("BUGFREEDBACK_S3_REGION") || env("AWS_REGION") || void 0,
      endpoint: base.endpoint || env("BUGFREEDBACK_S3_ENDPOINT") || void 0,
      publicBaseUrl: base.publicBaseUrl || env("BUGFREEDBACK_S3_PUBLIC_BASE_URL") || void 0,
      accessKeyId: base.accessKeyId || env("BUGFREEDBACK_S3_ACCESS_KEY_ID") || env("AWS_ACCESS_KEY_ID") || void 0,
      secretAccessKey: base.secretAccessKey || env("BUGFREEDBACK_S3_SECRET_ACCESS_KEY") || env("AWS_SECRET_ACCESS_KEY") || void 0
    };
  }
  return base;
}
export function resolveExportOptions(options) {
  if (!options) {
    return null;
  }
  if (options.provider === "github") {
    return {
      ...options,
      token: options.token || env("GITHUB_FEEDBACK_TOKEN") || env("BUGFREEDBACK_GITHUB_TOKEN"),
      owner: options.owner || env("GITHUB_FEEDBACK_OWNER") || env("BUGFREEDBACK_GITHUB_OWNER"),
      repo: options.repo || env("GITHUB_FEEDBACK_REPO") || env("BUGFREEDBACK_GITHUB_REPO")
    };
  }
  if (options.provider === "webhook") {
    return {
      ...options,
      url: options.url || env("BUGFREEDBACK_WEBHOOK_URL")
    };
  }
  if (options.provider === "linear") {
    return {
      ...options,
      apiKey: options.apiKey || env("BUGFREEDBACK_LINEAR_API_KEY"),
      teamId: options.teamId || env("BUGFREEDBACK_LINEAR_TEAM_ID")
    };
  }
  if (options.provider === "slack") {
    return {
      ...options,
      webhookUrl: options.webhookUrl || env("BUGFREEDBACK_SLACK_WEBHOOK_URL")
    };
  }
  if (options.provider === "notion") {
    return {
      ...options,
      token: options.token || env("BUGFREEDBACK_NOTION_TOKEN"),
      databaseId: options.databaseId || env("BUGFREEDBACK_NOTION_DATABASE_ID")
    };
  }
  if (options.provider === "jira") {
    return {
      ...options,
      baseUrl: options.baseUrl || env("BUGFREEDBACK_JIRA_BASE_URL"),
      email: options.email || env("BUGFREEDBACK_JIRA_EMAIL"),
      apiToken: options.apiToken || env("BUGFREEDBACK_JIRA_API_TOKEN"),
      projectKey: options.projectKey || env("BUGFREEDBACK_JIRA_PROJECT_KEY")
    };
  }
  if (options.provider === "asana") {
    return {
      ...options,
      token: options.token || env("BUGFREEDBACK_ASANA_TOKEN"),
      projectGid: options.projectGid || env("BUGFREEDBACK_ASANA_PROJECT_GID")
    };
  }
  if (options.provider === "trello") {
    return {
      ...options,
      apiKey: options.apiKey || env("BUGFREEDBACK_TRELLO_API_KEY"),
      token: options.token || env("BUGFREEDBACK_TRELLO_TOKEN"),
      listId: options.listId || env("BUGFREEDBACK_TRELLO_LIST_ID")
    };
  }
  if (options.provider === "ifttt") {
    return {
      ...options,
      eventName: options.eventName || env("BUGFREEDBACK_IFTTT_EVENT_NAME"),
      webhookKey: options.webhookKey || env("BUGFREEDBACK_IFTTT_WEBHOOK_KEY")
    };
  }
  return options;
}
export function createResolvedStorageAdapter(options) {
  const resolved = resolveStorageOptions(options);
  if (resolved.provider === "none") {
    return null;
  }
  if (resolved.provider === "gcs") {
    return createGcsStorageAdapter({ bucket: resolved.bucket });
  }
  if (resolved.provider === "s3") {
    return createS3StorageAdapter(resolved);
  }
  return null;
}
export function createResolvedExportAdapter(options) {
  const resolved = resolveExportOptions(options);
  if (!resolved) {
    throw new Error("Feedback export is not configured");
  }
  switch (resolved.provider) {
    case "github":
      return createGithubExportAdapter(resolved);
    case "webhook":
      return createWebhookExportAdapter(resolved);
    case "linear":
      return createLinearExportAdapter(resolved);
    case "slack":
      return createSlackExportAdapter(resolved);
    case "notion":
      return createNotionExportAdapter(resolved);
    case "jira":
      return createJiraExportAdapter(resolved);
    case "asana":
      return createAsanaExportAdapter(resolved);
    case "trello":
      return createTrelloExportAdapter(resolved);
    case "ifttt":
      return createIftttExportAdapter(resolved);
    default: {
      const neverProvider = resolved;
      throw new Error(`Unsupported export provider: ${neverProvider.provider}`);
    }
  }
}
