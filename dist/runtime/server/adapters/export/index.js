import { createAsanaExportAdapter } from "./asana.js";
import { createGithubExportAdapter } from "./github.js";
import { createIftttExportAdapter } from "./ifttt.js";
import { createJiraExportAdapter } from "./jira.js";
import { createLinearExportAdapter } from "./linear.js";
import { createNotionExportAdapter } from "./notion.js";
import { createSlackExportAdapter } from "./slack.js";
import { createTrelloExportAdapter } from "./trello.js";
import { createWebhookExportAdapter } from "./webhook.js";
export function createExportAdapter(options) {
  switch (options.provider) {
    case "github":
      return createGithubExportAdapter(options);
    case "webhook":
      return createWebhookExportAdapter(options);
    case "linear":
      return createLinearExportAdapter(options);
    case "slack":
      return createSlackExportAdapter(options);
    case "notion":
      return createNotionExportAdapter(options);
    case "jira":
      return createJiraExportAdapter(options);
    case "asana":
      return createAsanaExportAdapter(options);
    case "trello":
      return createTrelloExportAdapter(options);
    case "ifttt":
      return createIftttExportAdapter(options);
    default: {
      const neverProvider = options;
      throw new Error(`Unsupported export provider: ${neverProvider.provider}`);
    }
  }
}
export { buildGithubIssueBody } from "./github.js";
