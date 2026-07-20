export function buildGithubIssueBody(input) {
  const lines = [
    "## Description",
    input.description.trim() || "_No description provided._",
    ""
  ];
  if (input.screenshotUrl?.trim()) {
    lines.push("## Screenshot", `![Feedback screenshot](${input.screenshotUrl})`, "");
  } else {
    lines.push("## Screenshot", "_No screenshot attached._", "");
  }
  lines.push("## Reporter");
  if (input.email?.trim()) {
    lines.push(`- Email: ${input.email.trim()}`);
  } else {
    lines.push("- Email: _not provided_");
  }
  lines.push("", "## Environment", "```json", JSON.stringify(input.metadata, null, 2), "```", "");
  return lines.join("\n");
}
export function createGithubExportAdapter(options) {
  const token = options.token.trim();
  const owner = options.owner.trim();
  const repo = options.repo.trim();
  if (!token) {
    throw new Error("GitHub export token is not configured");
  }
  if (!owner || !repo) {
    throw new Error("GitHub export owner/repo is not configured");
  }
  return {
    async create(input) {
      const fetchImpl = options.fetchImpl ?? fetch;
      const labels = (input.labels ?? options.labels ?? ["feedback"]).filter(Boolean);
      const response = await fetchImpl(
        `https://api.github.com/repos/${owner}/${repo}/issues`,
        {
          method: "POST",
          headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "bugfreedback"
          },
          body: JSON.stringify({
            title: input.title.trim(),
            body: buildGithubIssueBody(input),
            labels
          })
        }
      );
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(
          `GitHub issue create failed (${response.status}): ${detail.slice(0, 400) || response.statusText}`
        );
      }
      const payload = await response.json();
      if (typeof payload.number !== "number" || typeof payload.html_url !== "string") {
        throw new TypeError("GitHub issue create returned an unexpected payload");
      }
      return {
        id: String(payload.number),
        url: payload.html_url
      };
    }
  };
}
