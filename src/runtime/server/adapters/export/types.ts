import type { FeedbackPayload } from '../../utils/submit'

export type ExportCreateInput = FeedbackPayload & {
  screenshotUrl?: string
  labels?: string[]
}

export type ExportCreateResult = {
  id: string
  url?: string
}

export interface ExportAdapter {
  create(input: ExportCreateInput): Promise<ExportCreateResult>
}
