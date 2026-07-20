# Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enables widget + submit API |
| `primaryColor` | `string` | `#3b82f6` | Launcher / primary button color |
| `secondaryColor` | `string` | `#1e293b` | Form panel background |
| `primaryTextColor` | `string` | `#ffffff` | Text on primary surfaces |
| `buttonLayout` | `'horizontal' \| 'vertical'` | `'vertical'` | Launcher orientation |
| `position.edge` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Edge the launcher hugs |
| `position.offsetX` | `number` | `0` | Pixel offset on X |
| `position.offsetY` | `number` | `0` | Pixel offset on Y |
| `auth` | `'required' \| 'optional' \| 'none'` | `'optional'` | Client auth gate |
| `label` | `string` | `'Feedback'` | Launcher label |
| `submitPath` | `string` | `/api/_bugfreedback/submit` | Nitro route |
| `storage` | object | `{ provider: 'none' }` | Screenshot storage adapter |
| `export` | object | webhook stub | Export adapter |

CSS variables applied on the document root:

- `--bugfreedback-primary`
- `--bugfreedback-secondary`
- `--bugfreedback-primary-text`
