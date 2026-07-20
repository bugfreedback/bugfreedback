export function createAsanaExportAdapter(options) {
  const token = options.token.trim();
  const projectGid = options.projectGid.trim();
  if (!token || !projectGid) {
    throw new Error("Asana export token/projectGid is not configured");
  }
  return {
    async create(input) {
      const notes = [
        input.description,
        input.email ? `Reporter: ${input.email}` : "",
        input.screenshotUrl ? `Screenshot: ${input.screenshotUrl}` : "",
        `Metadata:
${JSON.stringify(input.metadata, null, 2)}`
      ].filter(Boolean).join("\n\n");
      const fetchImpl = options.fetchImpl ?? fetch;
      const response = await fetchImpl("https://app.asana.com/api/1.0/tasks", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: {
            name: input.title.trim(),
            notes,
            projects: [projectGid],
            workspace: options.workspaceGid
          }
        })
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`Asana export failed (${response.status}): ${detail.slice(0, 400)}`);
      }
      const payload = await response.json();
      if (!payload.data?.gid) {
        throw new Error("Asana export returned an unexpected payload");
      }
      return { id: payload.data.gid, url: payload.data.permalink_url };
    }
  };
}
