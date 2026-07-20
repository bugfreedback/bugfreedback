export function createWebhookExportAdapter(options) {
  const url = options.url.trim();
  if (!url) {
    throw new Error("Webhook export URL is not configured");
  }
  return {
    async create(input) {
      const fetchImpl = options.fetchImpl ?? fetch;
      const response = await fetchImpl(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options.headers
        },
        body: JSON.stringify({
          title: input.title,
          description: input.description,
          email: input.email,
          screenshotUrl: input.screenshotUrl,
          metadata: input.metadata,
          labels: input.labels
        })
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(
          `Webhook export failed (${response.status}): ${detail.slice(0, 400) || response.statusText}`
        );
      }
      let id = "ok";
      let resultUrl;
      try {
        const payload = await response.json();
        if (payload.id != null) {
          id = String(payload.id);
        }
        if (typeof payload.url === "string") {
          resultUrl = payload.url;
        }
      } catch {
      }
      return { id, url: resultUrl };
    }
  };
}
