# Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enables widget + submit API |
| `primaryColor` | `string` | `#3b82f6` | Launcher / primary button color |
| `primaryTextColor` | `string` | `#ffffff` | Text on primary surfaces |
| `modalBgColor` | `string` | `#0f172a` | Feedback form modal background |
| `modalTextColor` | `string` | `#ffffff` | Feedback form modal text |
| `annotateBgColor` | `string` | `#3f3f46` | Annotate modal background |
| `annotateTextColor` | `string` | `#f4f4f5` | Annotate modal text |
| `secondaryColor` | `string` | `#1e293b` | Legacy fallback for modal background |
| `buttonLayout` | `'horizontal' \| 'vertical'` | `'vertical'` | Launcher orientation |
| `position.edge` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Edge the launcher hugs |
| `position.offsetX` | `number` | `0` | Pixel offset on X |
| `position.offsetY` | `number` | `0` | Pixel offset on Y |
| `auth` | `'required' \| 'optional' \| 'none'` | `'optional'` | Client auth gate |
| `label` | `string` | `'Feedback'` | Launcher label |
| `submitPath` | `string` | `/api/_bugfreedback/submit` | Nitro route |
| `storage` | object | `{ provider: 'none' }` | Screenshot storage adapter |
| `export` | object | webhook stub | Export adapter |

## Peer dependency

Hosts must provide **`@nuxt/ui`** (`>=3`). The module declares it via `moduleDependencies` and bundles Lucide icons used by the toolbar.

```bash
npm install @nuxt/ui
```

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@bugfreedback/bugfreedback'],
})
```

CSS variables applied on the document root:

- `--bugfreedback-primary`
- `--bugfreedback-secondary`
- `--bugfreedback-primary-text`
- `--bugfreedback-modal-bg`
- `--bugfreedback-modal-text`
- `--bugfreedback-annotate-bg`
- `--bugfreedback-annotate-text`
