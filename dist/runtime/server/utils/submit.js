import { z } from "zod";
export const BUGFREEDBACK_MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
const feedbackMetadataSchema = z.record(z.string(), z.unknown());
export const bugfreedbackSubmitSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(1e4).default(""),
  email: z.union([z.string().trim().email(), z.literal("")]).optional(),
  screenshotBase64: z.string().min(1).optional(),
  metadata: feedbackMetadataSchema.default({}),
  idempotencyKey: z.string().trim().min(8).max(64).optional()
});
export class BugfreedbackScreenshotDecodeError extends Error {
  statusCode;
  constructor(message, statusCode) {
    super(message);
    this.name = "BugfreedbackScreenshotDecodeError";
    this.statusCode = statusCode;
  }
}
export function decodeFeedbackScreenshotBase64(value) {
  const trimmed = value.trim();
  const dataUrlMatch = /^data:image\/png;base64,(.+)$/i.exec(trimmed);
  const raw = dataUrlMatch?.[1] ?? trimmed.replace(/^data:[^;]+;base64,/i, "");
  const buffer = Buffer.from(raw, "base64");
  if (buffer.length === 0) {
    throw new BugfreedbackScreenshotDecodeError("Screenshot payload is empty or invalid", 400);
  }
  if (buffer.length > BUGFREEDBACK_MAX_SCREENSHOT_BYTES) {
    throw new BugfreedbackScreenshotDecodeError(
      `Screenshot exceeds ${BUGFREEDBACK_MAX_SCREENSHOT_BYTES} byte limit`,
      413
    );
  }
  return buffer;
}
