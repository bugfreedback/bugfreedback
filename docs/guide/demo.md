# Local demo

Try bugfreedback in a minimal Nuxt app before wiring it into your project. The repository includes a **playground** that loads the module from source so you can exercise the full widget flow locally.

## Run the playground

Clone the repo and start the dev server:

```bash
git clone https://github.com/bugfreedback/bugfreedback.git
cd bugfreedback
npm install
npm run dev
```

Open `http://localhost:3000` (or the port Nuxt prints). Click **Feedback** on the right edge to walk through:

1. **Form** — title, description, optional email
2. **Capture** — attach a screenshot of the current tab (browser permission required)
3. **Annotate** — pen, shapes, text, redaction
4. **Submit** — sends to the configured export adapter

## Default playground config

The playground (`playground/nuxt.config.ts`) uses settings suited for local evaluation:

| Setting | Value | Effect |
|---------|-------|--------|
| `auth` | `'none'` | No login required |
| `storage.provider` | `'none'` | Screenshots are not uploaded to cloud storage |
| `export.provider` | `'webhook'` | POSTs to a stub URL unless you override it |

To test a real export destination, set env vars or edit `playground/nuxt.config.ts` — see the [export guides](./export/webhook.md) for your provider.

## Test annotate without screen capture

Some environments block the Screen Capture API (headless browsers, restricted CI). Use these query params after `npm run dev`:

| URL | Opens |
|-----|--------|
| `/?demo=annotate` | Annotate step with a synthetic dashboard image |
| `/?demo=annotate-text` | Same, with the Text tool and edit panel active |

Example: `http://localhost:3000/?demo=annotate-text`

## Customize for your stack

Copy patterns from the playground into your app:

- **Theming** — `primaryColor`, `modalBgColor`, `buttonLayout`, `position` — see [Configuration](./configuration.md)
- **Storage + export** — combine [Storage](./storage.md) with any [export provider](./adapters.md)
- **Auth** — switch `auth` to `'required'` or `'optional'` and add `provideBugfreedbackAuth` — see [Getting started](./getting-started.md#auth-optional)

When testing webhooks locally, point `BUGFREEDBACK_WEBHOOK_URL` at [webhook.site](https://webhook.site) or your own tunnel — see [Webhook export](./export/webhook.md#local-testing).
