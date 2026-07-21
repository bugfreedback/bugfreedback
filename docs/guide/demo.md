# Demo site (playground)

The repo includes a **playground** Nuxt app for trying the widget and capturing documentation screenshots.

## Run locally

From the repository root:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The playground loads the module from `../src/module` (not npm), so you always exercise the latest source.

Default playground config (`playground/nuxt.config.ts`):

- `auth: 'none'` — no login required
- `storage: { provider: 'none' }` — screenshots stay client-side unless you change config
- `export: { provider: 'webhook', url: '…' }` — stub endpoint; submissions fail gracefully unless you point at a real webhook

## Suggested screenshots

Capture these for docs (save under `docs/public/screenshots/` — tracked with Git LFS):

| File | What to capture |
|------|-----------------|
| `launcher.png` | Full page showing the mid-right Feedback launcher |
| `form.png` | Feedback form modal (title, description, screenshot toggle) |
| `annotate.png` | Annotate step with toolbar + canvas |
| `annotate-text.png` | Text tool selected — 50/50 toolbar with edit panel |

### Manual flow

1. Open `http://localhost:3000` (or whichever port Nuxt picks)
2. Click **Feedback** → capture `launcher.png` and `form.png`
3. Click **Include screenshot** and allow tab sharing → capture `annotate.png` and `annotate-text.png`

### Demo URLs (no screen capture required)

When the Screen Capture API is unavailable (headless browsers, some CI), open these URLs after `npm run dev`:

| URL | Result |
|-----|--------|
| `/?demo=annotate` | Opens annotate step with a synthetic dashboard image |
| `/?demo=annotate-text` | Same, plus Text tool with the edit panel visible |

Example: `http://localhost:3000/?demo=annotate-text`

### Tips

- Use a 1280×800 or 1440×900 viewport for consistent docs layout
- Dark modal theme matches the default playground (`modalBgColor: #0f172a`)
- Hide browser extensions / devtools for clean captures
- After adding images, verify with `npm run docs:dev` (base path `/bugfreedback/`)

## Wiring images in VitePress

```md
![Feedback launcher](/screenshots/launcher.png)
```

Paths are relative to `docs/public/` and prefixed with the site `base` on GitHub Pages.
