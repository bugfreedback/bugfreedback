import type { ExportAdapter, ExportCreateInput, ExportCreateResult } from './types'

export type WebhookExportAdapterOptions = {
  url: string
  headers?: Record<string, string>
  fetchImpl?: typeof fetch
}

export function createWebhookExportAdapter(options: WebhookExportAdapterOptions): ExportAdapter {
  const url = options.url.trim()
  if (!url) {
    throw new Error('Webhook export URL is not configured')
  }

  return {
    async create(input: ExportCreateInput): Promise<ExportCreateResult> {
      const fetchImpl = options.fetchImpl ?? fetch
      const response = await fetchImpl(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify({
          title: input.title,
          description: input.description,
          email: input.email,
          screenshotUrl: input.screenshotUrl,
          metadata: input.metadata,
          labels: input.labels,
        }),
      })

      if (!response.ok) {
        const detail = await response.text().catch(() => '')
        throw new Error(
          `Webhook export failed (${response.status}): ${detail.slice(0, 400) || response.statusText}`,
        )
      }

      let id = 'ok'
      let resultUrl: string | undefined
      try {
        const payload = (await response.json()) as { id?: string | number, url?: string }
        if (payload.id != null) {
          id = String(payload.id)
        }
        if (typeof payload.url === 'string') {
          resultUrl = payload.url
        }
      }
      catch {
        // Non-JSON responses are fine for webhooks.
      }

      return { id, url: resultUrl }
    },
  }
}
