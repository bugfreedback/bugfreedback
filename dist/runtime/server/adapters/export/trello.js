export function createTrelloExportAdapter(options) {
  const apiKey = options.apiKey.trim();
  const token = options.token.trim();
  const listId = options.listId.trim();
  if (!apiKey || !token || !listId) {
    throw new Error("Trello export apiKey/token/listId is not configured");
  }
  return {
    async create(input) {
      const desc = [
        input.description,
        input.email ? `Reporter: ${input.email}` : "",
        input.screenshotUrl ? `Screenshot: ${input.screenshotUrl}` : "",
        `\`\`\`
${JSON.stringify(input.metadata, null, 2)}
\`\`\``
      ].filter(Boolean).join("\n\n");
      const params = new URLSearchParams({
        key: apiKey,
        token,
        idList: listId,
        name: input.title.trim(),
        desc
      });
      const fetchImpl = options.fetchImpl ?? fetch;
      const response = await fetchImpl(`https://api.trello.com/1/cards?${params.toString()}`, {
        method: "POST"
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`Trello export failed (${response.status}): ${detail.slice(0, 400)}`);
      }
      const payload = await response.json();
      if (!payload.id) {
        throw new Error("Trello export returned an unexpected payload");
      }
      return { id: payload.id, url: payload.shortUrl ?? payload.url };
    }
  };
}
