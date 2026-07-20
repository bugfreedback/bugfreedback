import type { ExportAdapter, ExportCreateInput, ExportCreateResult } from './types'

export type JiraExportAdapterOptions = {
  baseUrl: string
  email: string
  apiToken: string
  projectKey: string
  issueType?: string
  fetchImpl?: typeof fetch
}

export function createJiraExportAdapter(options: JiraExportAdapterOptions): ExportAdapter {
  const baseUrl = options.baseUrl.replace(/\/$/, '')
  const email = options.email.trim()
  const apiToken = options.apiToken.trim()
  const projectKey = options.projectKey.trim()
  if (!baseUrl || !email || !apiToken || !projectKey) {
    throw new Error('Jira export baseUrl/email/apiToken/projectKey is not configured')
  }

  return {
    async create(input: ExportCreateInput): Promise<ExportCreateResult> {
      const description = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: input.description || 'No description' }],
          },
          ...(input.screenshotUrl
            ? [{
                type: 'paragraph',
                content: [{ type: 'text', text: `Screenshot: ${input.screenshotUrl}` }],
              }]
            : []),
        ],
      }

      const auth = Buffer.from(`${email}:${apiToken}`).toString('base64')
      const fetchImpl = options.fetchImpl ?? fetch
      const response = await fetchImpl(`${baseUrl}/rest/api/3/issue`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            project: { key: projectKey },
            summary: input.title.trim(),
            description,
            issuetype: { name: options.issueType ?? 'Task' },
          },
        }),
      })

      if (!response.ok) {
        const detail = await response.text().catch(() => '')
        throw new Error(`Jira export failed (${response.status}): ${detail.slice(0, 400)}`)
      }

      const payload = (await response.json()) as { id?: string, key?: string }
      if (!payload.id && !payload.key) {
        throw new Error('Jira export returned an unexpected payload')
      }
      const key = payload.key ?? payload.id!
      return {
        id: key,
        url: `${baseUrl}/browse/${key}`,
      }
    },
  }
}
