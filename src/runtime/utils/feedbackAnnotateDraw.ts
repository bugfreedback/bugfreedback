export type FeedbackAnnotateTool
  = | 'pen'
    | 'highlighter'
    | 'rect'
    | 'ellipse'
    | 'arrow'
    | 'text'
    | 'redact'

export type FeedbackTextSizeId = 'small' | 'medium' | 'large'

export const FEEDBACK_ANNOTATE_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#a855f7',
  '#ffffff',
  '#0f172a',
] as const

export const FEEDBACK_ANNOTATE_STROKE_WIDTHS = [
  { id: 'thin', label: 'Thin', factor: 1 },
  { id: 'medium', label: 'Medium', factor: 2 },
  { id: 'thick', label: 'Thick', factor: 4 },
] as const

export const FEEDBACK_TEXT_SIZES = [
  { id: 'small', label: 'Small', factor: 1 / 60 },
  { id: 'medium', label: 'Medium', factor: 1 / 45 },
  { id: 'large', label: 'Large', factor: 1 / 28 },
] as const

export type FeedbackAnnotateStrokeWidthId = (typeof FEEDBACK_ANNOTATE_STROKE_WIDTHS)[number]['id']

export function resolveAnnotateLineWidth(
  canvasWidth: number,
  strokeWidthId: FeedbackAnnotateStrokeWidthId,
): number {
  const base = Math.max(2, canvasWidth / 500)
  const entry = FEEDBACK_ANNOTATE_STROKE_WIDTHS.find(item => item.id === strokeWidthId)
  return base * (entry?.factor ?? 2)
}

export function resolveTextFontSize(
  canvasWidth: number,
  textSize: FeedbackTextSizeId,
): number {
  const entry = FEEDBACK_TEXT_SIZES.find(item => item.id === textSize) ?? FEEDBACK_TEXT_SIZES[1]
  return Math.max(12, Math.round(canvasWidth * entry.factor))
}

/** Map a pixel font size back to the nearest preset (e.g. after handle resize). */
export function nearestTextSizeId(
  canvasWidth: number,
  fontSize: number,
): FeedbackTextSizeId {
  let best: FeedbackTextSizeId = 'medium'
  let bestDelta = Number.POSITIVE_INFINITY
  for (const entry of FEEDBACK_TEXT_SIZES) {
    const size = resolveTextFontSize(canvasWidth, entry.id)
    const delta = Math.abs(size - fontSize)
    if (delta < bestDelta) {
      bestDelta = delta
      best = entry.id
    }
  }
  return best
}

export function buildCanvasFont(options: {
  fontSize: number
  bold: boolean
  italic: boolean
}): string {
  const style = options.italic ? 'italic' : 'normal'
  const weight = options.bold ? 'bold' : 'normal'
  return `${style} ${weight} ${options.fontSize}px system-ui, sans-serif`
}

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  lineWidth: number,
): void {
  const dx = toX - fromX
  const dy = toY - fromY
  const length = Math.hypot(dx, dy)
  if (length < 1) {
    return
  }

  const angle = Math.atan2(dy, dx)
  const headLength = Math.max(lineWidth * 4, 12)
  const headHalfAngle = Math.PI / 6
  // Stop the shaft at the arrowhead base so the tip sits on the true endpoint
  // (drawing the stroke to the tip makes the head look inset under round caps).
  const shaftInset = Math.min(length * 0.9, headLength * 0.85)
  const shaftEndX = toX - Math.cos(angle) * shaftInset
  const shaftEndY = toY - Math.sin(angle) * shaftInset

  ctx.beginPath()
  ctx.moveTo(fromX, fromY)
  ctx.lineTo(shaftEndX, shaftEndY)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(toX, toY)
  ctx.lineTo(
    toX - headLength * Math.cos(angle - headHalfAngle),
    toY - headLength * Math.sin(angle - headHalfAngle),
  )
  ctx.lineTo(
    toX - headLength * Math.cos(angle + headHalfAngle),
    toY - headLength * Math.sin(angle + headHalfAngle),
  )
  ctx.closePath()
  ctx.fill()
}

/** Shaft end for an arrow from → to (exported for unit tests). */
export function arrowShaftEnd(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  lineWidth: number,
): { x: number, y: number, tipX: number, tipY: number } {
  const dx = toX - fromX
  const dy = toY - fromY
  const length = Math.hypot(dx, dy)
  const angle = Math.atan2(dy, dx)
  const headLength = Math.max(lineWidth * 4, 12)
  const shaftInset = Math.min(length * 0.9, headLength * 0.85)
  return {
    x: toX - Math.cos(angle) * shaftInset,
    y: toY - Math.sin(angle) * shaftInset,
    tipX: toX,
    tipY: toY,
  }
}

export function drawEllipse(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): void {
  const cx = (x1 + x2) / 2
  const cy = (y1 + y2) / 2
  const rx = Math.abs(x2 - x1) / 2
  const ry = Math.abs(y2 - y1) / 2
  ctx.beginPath()
  ctx.ellipse(cx, cy, Math.max(rx, 0.5), Math.max(ry, 0.5), 0, 0, Math.PI * 2)
  ctx.stroke()
}

export function drawTextAnnotation(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  fontSize: number,
  bold: boolean = true,
  italic: boolean = false,
): void {
  ctx.save()
  ctx.font = buildCanvasFont({ fontSize, bold, italic })
  ctx.textBaseline = 'top'
  ctx.fillStyle = color
  ctx.fillText(text, x, y)
  ctx.restore()
}
