import { createError, defineEventHandler, getHeader, readBody } from "h3";
import { useRuntimeConfig } from "#imports";
import {
  buildScreenshotObjectKey,
  resolveObjectPrefix
} from "../adapters/storage/index.js";
import {
  createResolvedExportAdapter,
  createResolvedStorageAdapter,
  resolveStorageOptions
} from "../utils/resolve-adapters.js";
import {
  BugfreedbackScreenshotDecodeError,
  bugfreedbackSubmitSchema,
  decodeFeedbackScreenshotBase64
} from "../utils/submit.js";
export default defineEventHandler(async (event) => {
  const runtime = useRuntimeConfig(event);
  const publicConfig = runtime.public.bugfreedback ?? {};
  const privateConfig = runtime.bugfreedback ?? {};
  if (!publicConfig.enabled) {
    throw createError({ statusCode: 404, message: "Feedback is not available" });
  }
  const authMode = publicConfig.auth ?? "optional";
  const authHeader = getHeader(event, "authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const reporter = event.context.bugfreedbackReporter;
  if (authMode === "required" && !bearer && !reporter) {
    throw createError({ statusCode: 401, message: "Authentication required" });
  }
  const storageOptions = resolveStorageOptions(privateConfig.storage);
  const exportOptions = privateConfig.export;
  if (!exportOptions) {
    throw createError({
      statusCode: 503,
      message: "Feedback export is not configured"
    });
  }
  const body = await readBody(event);
  const parsed = bugfreedbackSubmitSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.issues[0]?.message ?? "Invalid request body"
    });
  }
  const hasScreenshot = Boolean(parsed.data.screenshotBase64?.trim());
  const storage = createResolvedStorageAdapter(storageOptions);
  if (hasScreenshot && !storage) {
    throw createError({
      statusCode: 503,
      message: "Feedback storage is not configured for screenshots"
    });
  }
  const metadata = {
    ...parsed.data.metadata,
    userId: reporter?.id ?? parsed.data.metadata.userId ?? null,
    username: reporter?.username ?? parsed.data.metadata.username ?? null,
    submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
    idempotencyKey: parsed.data.idempotencyKey ?? null
  };
  let screenshotUrl;
  if (hasScreenshot && parsed.data.screenshotBase64 && storage) {
    let screenshot;
    try {
      screenshot = decodeFeedbackScreenshotBase64(parsed.data.screenshotBase64);
    } catch (error) {
      if (error instanceof BugfreedbackScreenshotDecodeError) {
        throw createError({ statusCode: error.statusCode, message: error.message });
      }
      throw error;
    }
    try {
      const objectKey = buildScreenshotObjectKey(resolveObjectPrefix(storageOptions));
      const uploaded = await storage.upload({
        data: screenshot,
        contentType: "image/png",
        objectKey
      });
      screenshotUrl = uploaded.publicUrl;
    } catch (error) {
      console.error("[bugfreedback] storage upload failed", error);
      throw createError({
        statusCode: 503,
        message: "Failed to upload feedback screenshot"
      });
    }
  }
  try {
    const exporter = createResolvedExportAdapter(exportOptions);
    const result = await exporter.create({
      title: parsed.data.title,
      description: parsed.data.description,
      email: parsed.data.email || reporter?.email || void 0,
      screenshotUrl,
      metadata,
      labels: ["feedback"]
    });
    return {
      ok: true,
      id: result.id,
      url: result.url ?? null,
      screenshotUrl: screenshotUrl ?? null
    };
  } catch (error) {
    console.error("[bugfreedback] export failed", error);
    throw createError({
      statusCode: 503,
      message: error instanceof Error ? error.message : "Failed to export feedback"
    });
  }
});
