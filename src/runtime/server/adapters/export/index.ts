import type { BugfreedbackExportOptions } from '../../../../types'
import { createAsanaExportAdapter } from './asana'
import { createGithubExportAdapter } from './github'
import { createIftttExportAdapter } from './ifttt'
import { createJiraExportAdapter } from './jira'
import { createLinearExportAdapter } from './linear'
import { createNotionExportAdapter } from './notion'
import { createSlackExportAdapter } from './slack'
import { createTrelloExportAdapter } from './trello'
import { createWebhookExportAdapter } from './webhook'
import type { ExportAdapter } from './types'

export function createExportAdapter(options: BugfreedbackExportOptions): ExportAdapter {
  switch (options.provider) {
    case 'github':
      return createGithubExportAdapter(options)
    case 'webhook':
      return createWebhookExportAdapter(options)
    case 'linear':
      return createLinearExportAdapter(options)
    case 'slack':
      return createSlackExportAdapter(options)
    case 'notion':
      return createNotionExportAdapter(options)
    case 'jira':
      return createJiraExportAdapter(options)
    case 'asana':
      return createAsanaExportAdapter(options)
    case 'trello':
      return createTrelloExportAdapter(options)
    case 'ifttt':
      return createIftttExportAdapter(options)
    default: {
      const neverProvider: never = options
      throw new Error(`Unsupported export provider: ${(neverProvider as { provider: string }).provider}`)
    }
  }
}

export type { ExportAdapter, ExportCreateInput, ExportCreateResult } from './types'
export { buildGithubIssueBody } from './github'
