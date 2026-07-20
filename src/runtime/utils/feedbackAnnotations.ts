import { nanoid } from 'nanoid'

import {
  drawArrow,
  drawEllipse,
  drawTextAnnotation,
  nearestTextSizeId,
  type FeedbackAnnotateTool,
  type FeedbackTextSizeId,
} from './feedbackAnnotateDraw'

export type FeedbackPoint = { x: number, y: number }

export type FeedbackAnnotation
  = | {
    id: string
    kind: 'path'
    tool: 'pen' | 'highlighter'
    points: FeedbackPoint[]
    color: string
    lineWidth: number
  }
  | {
    id: string
    kind: 'shape'
    shape: 'rect' | 'ellipse' | 'redact'
    x: number
    y: number
    w: number
    h: number
    color: string
    lineWidth: number
  }
  | {
    id: string
    kind: 'arrow'
    x1: number
    y1: number
    x2: number
    y2: number
    color: string
    lineWidth: number
  }
  | {
    id: string
    kind: 'text'
    x: number
    y: number
    text: string
    color: string
    /** Absolute pixel size used for drawing / hit-testing. */
    fontSize: number
    /** Preset size id for the toolbar (kept in sync with fontSize). */
    textSize: FeedbackTextSizeId
    bold: boolean
    italic: boolean
  }

export type FeedbackHandleId = 'nw' | 'ne' | 'sw' | 'se' | 'start' | 'end'

export type FeedbackBounds = { x: number, y: number, w: number, h: number }

const HANDLE_SIZE = 10
const HIT_PADDING = 8

export function createAnnotationId(): string {
  return nanoid(10)
}

export function normalizeRect(x1: number, y1: number, x2: number, y2: number): {
  x: number
  y: number
  w: number
  h: number
} {
  const x = Math.min(x1, x2)
  const y = Math.min(y1, y2)
  return {
    x,
    y,
    w: Math.abs(x2 - x1),
    h: Math.abs(y2 - y1),
  }
}

export function getAnnotationBounds(
  annotation: FeedbackAnnotation,
  measureText?: (text: string, fontSize: number) => { width: number, height: number },
): FeedbackBounds {
  if (annotation.kind === 'path') {
    const xs = annotation.points.map(p => p.x)
    const ys = annotation.points.map(p => p.y)
    const pad = annotation.lineWidth
    const minX = Math.min(...xs) - pad
    const minY = Math.min(...ys) - pad
    const maxX = Math.max(...xs) + pad
    const maxY = Math.max(...ys) + pad
    return { x: minX, y: minY, w: Math.max(1, maxX - minX), h: Math.max(1, maxY - minY) }
  }

  if (annotation.kind === 'shape') {
    return {
      x: annotation.x,
      y: annotation.y,
      w: Math.max(1, annotation.w),
      h: Math.max(1, annotation.h),
    }
  }

  if (annotation.kind === 'arrow') {
    const minX = Math.min(annotation.x1, annotation.x2) - annotation.lineWidth
    const minY = Math.min(annotation.y1, annotation.y2) - annotation.lineWidth
    const maxX = Math.max(annotation.x1, annotation.x2) + annotation.lineWidth
    const maxY = Math.max(annotation.y1, annotation.y2) + annotation.lineWidth
    return { x: minX, y: minY, w: Math.max(1, maxX - minX), h: Math.max(1, maxY - minY) }
  }

  const padding = Math.max(4, annotation.fontSize * 0.2)
  const measured = measureText?.(annotation.text, annotation.fontSize) ?? {
    width: Math.max(24, annotation.text.length * annotation.fontSize * 0.55),
    height: annotation.fontSize,
  }
  return {
    x: annotation.x - padding,
    y: annotation.y - padding,
    w: measured.width + padding * 2,
    h: measured.height + padding * 2,
  }
}

export function pointInBounds(point: FeedbackPoint, bounds: FeedbackBounds, pad: number = 0): boolean {
  return (
    point.x >= bounds.x - pad
    && point.x <= bounds.x + bounds.w + pad
    && point.y >= bounds.y - pad
    && point.y <= bounds.y + bounds.h + pad
  )
}

export function getHandlePositions(
  annotation: FeedbackAnnotation,
  bounds: FeedbackBounds,
): Partial<Record<FeedbackHandleId, FeedbackPoint>> {
  if (annotation.kind === 'arrow') {
    return {
      start: { x: annotation.x1, y: annotation.y1 },
      end: { x: annotation.x2, y: annotation.y2 },
    }
  }

  return {
    nw: { x: bounds.x, y: bounds.y },
    ne: { x: bounds.x + bounds.w, y: bounds.y },
    sw: { x: bounds.x, y: bounds.y + bounds.h },
    se: { x: bounds.x + bounds.w, y: bounds.y + bounds.h },
  }
}

export function hitTestHandle(
  point: FeedbackPoint,
  annotation: FeedbackAnnotation,
  bounds: FeedbackBounds,
  handleSize: number = HANDLE_SIZE,
): FeedbackHandleId | null {
  const handles = getHandlePositions(annotation, bounds)
  const half = handleSize / 2 + 2
  for (const [id, position] of Object.entries(handles) as [FeedbackHandleId, FeedbackPoint][]) {
    if (
      Math.abs(point.x - position.x) <= half
      && Math.abs(point.y - position.y) <= half
    ) {
      return id
    }
  }
  return null
}

export function hitTestAnnotation(
  point: FeedbackPoint,
  annotations: FeedbackAnnotation[],
  measureText?: (text: string, fontSize: number) => { width: number, height: number },
): string | null {
  for (let index = annotations.length - 1; index >= 0; index -= 1) {
    const annotation = annotations[index]
    if (!annotation) {
      continue
    }
    const bounds = getAnnotationBounds(annotation, measureText)
    if (pointInBounds(point, bounds, HIT_PADDING)) {
      return annotation.id
    }
  }
  return null
}

export function moveAnnotation(annotation: FeedbackAnnotation, dx: number, dy: number): FeedbackAnnotation {
  if (annotation.kind === 'path') {
    return {
      ...annotation,
      points: annotation.points.map(point => ({ x: point.x + dx, y: point.y + dy })),
    }
  }
  if (annotation.kind === 'shape') {
    return { ...annotation, x: annotation.x + dx, y: annotation.y + dy }
  }
  if (annotation.kind === 'arrow') {
    return {
      ...annotation,
      x1: annotation.x1 + dx,
      y1: annotation.y1 + dy,
      x2: annotation.x2 + dx,
      y2: annotation.y2 + dy,
    }
  }
  return { ...annotation, x: annotation.x + dx, y: annotation.y + dy }
}

export function resizeAnnotation(
  annotation: FeedbackAnnotation,
  handle: FeedbackHandleId,
  point: FeedbackPoint,
  canvasWidth?: number,
): FeedbackAnnotation {
  if (annotation.kind === 'arrow') {
    if (handle === 'start') {
      return { ...annotation, x1: point.x, y1: point.y }
    }
    if (handle === 'end') {
      return { ...annotation, x2: point.x, y2: point.y }
    }
    return annotation
  }

  if (annotation.kind === 'text') {
    if (handle === 'se') {
      const nextSize = Math.max(12, Math.round(point.y - annotation.y))
      const widthHint = canvasWidth && canvasWidth > 0 ? canvasWidth : Math.max(nextSize * 40, 400)
      return {
        ...annotation,
        fontSize: nextSize,
        textSize: nearestTextSizeId(widthHint, nextSize),
      }
    }
    return annotation
  }

  if (annotation.kind === 'path') {
    // Paths are move-only via bounding-box drag; corner handles scale around center.
    const bounds = getAnnotationBounds(annotation)
    const cx = bounds.x + bounds.w / 2
    const cy = bounds.y + bounds.h / 2
    let scaleX = 1
    let scaleY = 1
    if (handle === 'se' || handle === 'ne') {
      scaleX = bounds.w > 0 ? (point.x - bounds.x) / bounds.w : 1
    }
    if (handle === 'sw' || handle === 'nw') {
      scaleX = bounds.w > 0 ? (bounds.x + bounds.w - point.x) / bounds.w : 1
    }
    if (handle === 'se' || handle === 'sw') {
      scaleY = bounds.h > 0 ? (point.y - bounds.y) / bounds.h : 1
    }
    if (handle === 'ne' || handle === 'nw') {
      scaleY = bounds.h > 0 ? (bounds.y + bounds.h - point.y) / bounds.h : 1
    }
    scaleX = Math.max(0.1, scaleX)
    scaleY = Math.max(0.1, scaleY)
    return {
      ...annotation,
      points: annotation.points.map(p => ({
        x: cx + (p.x - cx) * scaleX,
        y: cy + (p.y - cy) * scaleY,
      })),
    }
  }

  // shape
  let { x, y, w, h } = annotation
  const right = x + w
  const bottom = y + h
  if (handle === 'nw') {
    x = point.x
    y = point.y
    w = right - point.x
    h = bottom - point.y
  }
  else if (handle === 'ne') {
    y = point.y
    w = point.x - x
    h = bottom - point.y
  }
  else if (handle === 'sw') {
    x = point.x
    w = right - point.x
    h = point.y - y
  }
  else if (handle === 'se') {
    w = point.x - x
    h = point.y - y
  }
  const normalized = normalizeRect(x, y, x + w, y + h)
  return { ...annotation, ...normalized }
}

function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '')
  if (normalized.length !== 6) {
    return hex
  }
  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function drawAnnotation(ctx: CanvasRenderingContext2D, annotation: FeedbackAnnotation): void {
  if (annotation.kind === 'path') {
    if (annotation.points.length < 2) {
      return
    }
    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = annotation.tool === 'highlighter' ? annotation.lineWidth * 3 : annotation.lineWidth
    ctx.strokeStyle = annotation.tool === 'highlighter'
      ? withAlpha(annotation.color, 0.35)
      : annotation.color
    ctx.beginPath()
    ctx.moveTo(annotation.points[0]!.x, annotation.points[0]!.y)
    for (let i = 1; i < annotation.points.length; i += 1) {
      const point = annotation.points[i]!
      ctx.lineTo(point.x, point.y)
    }
    ctx.stroke()
    ctx.restore()
    return
  }

  if (annotation.kind === 'shape') {
    ctx.save()
    if (annotation.shape === 'redact') {
      ctx.fillStyle = '#000000'
      ctx.fillRect(annotation.x, annotation.y, annotation.w, annotation.h)
    }
    else {
      ctx.strokeStyle = annotation.color
      ctx.lineWidth = annotation.lineWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      if (annotation.shape === 'rect') {
        ctx.strokeRect(annotation.x, annotation.y, annotation.w, annotation.h)
      }
      else {
        drawEllipse(
          ctx,
          annotation.x,
          annotation.y,
          annotation.x + annotation.w,
          annotation.y + annotation.h,
        )
      }
    }
    ctx.restore()
    return
  }

  if (annotation.kind === 'arrow') {
    ctx.save()
    ctx.strokeStyle = annotation.color
    ctx.fillStyle = annotation.color
    ctx.lineWidth = annotation.lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    drawArrow(ctx, annotation.x1, annotation.y1, annotation.x2, annotation.y2, annotation.lineWidth)
    ctx.restore()
    return
  }

  drawTextAnnotation(
    ctx,
    annotation.text,
    annotation.x,
    annotation.y,
    annotation.color,
    annotation.fontSize,
    annotation.bold,
    annotation.italic,
  )
}

export function drawSelectionOverlay(
  ctx: CanvasRenderingContext2D,
  annotation: FeedbackAnnotation,
  measureText?: (text: string, fontSize: number) => { width: number, height: number },
): void {
  const bounds = getAnnotationBounds(annotation, measureText)
  ctx.save()
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 1.5
  ctx.setLineDash([6, 4])
  ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h)
  ctx.setLineDash([])

  const handles = getHandlePositions(annotation, bounds)
  const size = HANDLE_SIZE
  for (const position of Object.values(handles)) {
    if (!position) {
      continue
    }
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#0ea5e9'
    ctx.lineWidth = 1.5
    ctx.fillRect(position.x - size / 2, position.y - size / 2, size, size)
    ctx.strokeRect(position.x - size / 2, position.y - size / 2, size, size)
  }
  ctx.restore()
}

export function cloneAnnotations(annotations: FeedbackAnnotation[]): FeedbackAnnotation[] {
  return annotations.map((annotation) => {
    if (annotation.kind === 'path') {
      return { ...annotation, points: annotation.points.map(point => ({ ...point })) }
    }
    return { ...annotation }
  })
}

export function isDrawingTool(tool: FeedbackAnnotateTool | 'select'): tool is FeedbackAnnotateTool {
  return tool !== 'select'
}
