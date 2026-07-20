import type { ExportAdapter, ExportCreateInput, ExportCreateResult } from './types'

export type LinearExportAdapterOptions = {
  apiKey: string
  teamId: string
  labelIds?: string[]
  fetchImpl?: typeof fetch
}

export function createLinearExportAdapter(options: LinearExportAdapterOptions): ExportAdapter {
  const apiKey = options.apiKey.trim()
  const teamId = options.teamId.trim()
  if (!apiKey || !teamId) {
    throw new Error('Linear export apiKey/teamId is not configured')
  }

  return {
    async create(input: ExportCreateInput): Promise<ExportCreateResult> {
      const description = [
        input.description,
        input.screenshotUrl ? `\n\n![screenshot](${input.screenshotUrl})` : '',
        `\n\n\`\`\`json\n${JSON.stringify(input.metadata, null, 2)}\n\`\`\``,
      ].join('')

      const fetchImpl = options.fetchImpl ?? fetch
      const response = await fetchImpl('https://api.linear.app/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey,
        },
        body: JSON.stringify({
          query: `mutation IssueCreate($input: IssueCreateInput!) {
            issueCreate(input: $input) {
              success
              issue { id identifier url }
            }
          }`,
          variables: {
            input: {
              teamId,
              title: input.title.trim(),
              description,
              labelIds: options.labelIds,
            },
          },
        }),
      })

      if (!response.ok) {
        const detail = await response.text().catch(() => '')
        throw new Error(`Linear export failed (${response.status}): ${detail.slice(0, 400)}`)
      }

      const payload = (await response.json()) as {
        data?: { issueCreate?: { success?: boolean, issue?: { id?: string, url?: string } } }
        errors?: Array<{ message?: string }>
      }
      const issue = payload.data?.issueCreate?.issue
      if (!payload.data?.issueCreate?.success || !issue?.id) {
        throw new Error(payload.errors?.[0]?.message ?? 'Linear export returned an unexpected payload')
      }

      return { id: issue.id, url: issue.url }
    },
  }
}
