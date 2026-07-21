/**
 * Generates a PNG data URL resembling the playground dashboard for docs screenshots
 * when the Screen Capture API is unavailable (e.g. headless browsers, CI).
 */
export function createDemoScreenshot(): string {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 800
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not create demo screenshot canvas')
  }

  const gradient = ctx.createLinearGradient(0, 0, 1200, 800)
  gradient.addColorStop(0, '#dbeafe')
  gradient.addColorStop(0.5, '#f8fafc')
  gradient.addColorStop(1, '#ffedd5')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1200, 800)

  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 48px Segoe UI, system-ui, sans-serif'
  ctx.fillText('Acme Dashboard', 80, 120)

  ctx.fillStyle = '#64748b'
  ctx.font = '600 18px Segoe UI, system-ui, sans-serif'
  ctx.fillText('BUGFREEDBACK PLAYGROUND', 80, 160)

  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 36px Segoe UI, system-ui, sans-serif'
  ctx.fillText('Example app for docs & screenshots', 80, 220)

  const cards = [
    { title: 'Active users', body: 'Sample metric card' },
    { title: 'Open issues', body: 'Route feedback to GitHub, Linear, Slack…' },
    { title: 'Deployments', body: 'Capture form and annotate steps for docs' },
  ]

  cards.forEach((card, index) => {
    const x = 80 + index * 360
    ctx.shadowColor = 'rgba(15, 23, 42, 0.08)'
    ctx.shadowBlur = 24
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x, 280, 320, 180)
    ctx.shadowBlur = 0

    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 22px Segoe UI, system-ui, sans-serif'
    ctx.fillText(card.title, x + 24, 330)

    ctx.fillStyle = '#64748b'
    ctx.font = '16px Segoe UI, system-ui, sans-serif'
    ctx.fillText(card.body, x + 24, 370)
  })

  return canvas.toDataURL('image/png')
}
