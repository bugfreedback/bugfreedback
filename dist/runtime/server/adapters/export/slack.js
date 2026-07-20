export function createSlackExportAdapter(options) {
  const webhookUrl = options.webhookUrl.trim();
  if (!webhookUrl) {
    throw new Error("Slack webhook URL is not configured");
  }
  return {
    async create(input) {
      const blocks = [
        {
          type: "header",
          text: { type: "plain_text", text: input.title.slice(0, 150) }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: input.description.trim() || "_No description_"
          }
        }
      ];
      if (input.screenshotUrl) {
        blocks.push({
          type: "image",
          image_url: input.screenshotUrl,
          alt_text: "Feedback screenshot"
        });
      }
      if (input.email) {
        blocks.push({
          type: "context",
          elements: [{ type: "mrkdwn", text: `Reporter: ${input.email}` }]
        });
      }
      const fetchImpl = options.fetchImpl ?? fetch;
      const response = await fetchImpl(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: options.channel,
          text: input.title,
          blocks
        })
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`Slack export failed (${response.status}): ${detail.slice(0, 400)}`);
      }
      return { id: "slack-ok" };
    }
  };
}
