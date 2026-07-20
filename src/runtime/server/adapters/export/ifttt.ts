import type { ExportAdapter, ExportCreateInput, ExportCreateResult } from './types'

export type IftttExportAdapterOptions = {
  eventName: string
  webhookKey: string
  fetchImpl?: typeof fetch
}

export function createIftttExportAdapter(options: IftttExportAdapterOptions): ExportAdapter {
  const eventName = options.eventName.trim()
  const webhookKey = options.webhookKey.trim()
  if (!eventName || !webhookKey) {
    throw new Error('IFTTT export eventName/webhookKey is not configured')
  }

  return {
    async create(input: ExportCreateInput): Promise<ExportCreateResult> {
      const fetchImpl = options.fetchImpl ?? fetch
      const url = `https://maker.ifttt.com/trigger/${encodeURIComponent(eventName)}/with/key/${encodeURIComponent(webhookKey)}`
      const response = await fetchImpl(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value1: input.title,
          value2: input.description,
          value3: input.screenshotUrl ?? input.email ?? '',
        }),
      })

      if (!response.ok) {
        const detail = await response.text().catch(() => '')
        throw new Error(`IFTTT export failed (${response.status}): ${detail.slice(0, 400)}`)
      }

      return { id: 'ifttt-ok' }
    },
  }
}
