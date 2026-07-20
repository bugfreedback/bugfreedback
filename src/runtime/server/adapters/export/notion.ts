import type { ExportAdapter, ExportCreateInput, ExportCreateResult } from './types'

export type NotionExportAdapterOptions = {
  token: string
  databaseId: string
  fetchImpl?: typeof fetch
}

export function createNotionExportAdapter(options: NotionExportAdapterOptions): ExportAdapter {
  const token = options.token.trim()
  const databaseId = options.databaseId.trim()
  if (!token || !databaseId) {
    throw new Error('Notion export token/databaseId is not configured')
  }

  return {
    async create(input: ExportCreateInput): Promise<ExportCreateResult> {
      const children: unknown[] = [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: input.description.slice(0, 2000) || ' ' } }],
          },
        },
      ]
      if (input.screenshotUrl) {
        children.push({
          object: 'block',
          type: 'image',
          image: { type: 'external', external: { url: input.screenshotUrl } },
        })
      }

      const fetchImpl = options.fetchImpl ?? fetch
      const response = await fetchImpl('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          parent: { database_id: databaseId },
          properties: {
            Name: {
              title: [{ text: { content: input.title.slice(0, 200) } }],
            },
          },
          children,
        }),
      })

      if (!response.ok) {
        const detail = await response.text().catch(() => '')
        throw new Error(`Notion export failed (${response.status}): ${detail.slice(0, 400)}`)
      }

      const payload = (await response.json()) as { id?: string, url?: string }
      if (!payload.id) {
        throw new Error('Notion export returned an unexpected payload')
      }
      return { id: payload.id, url: payload.url }
    },
  }
}
