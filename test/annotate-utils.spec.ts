import { describe, expect, it } from 'vitest'
import {
  cloneAnnotations,
  createAnnotationId,
  getAnnotationBounds,
  moveAnnotation,
  normalizeRect,
  type FeedbackAnnotation,
} from '../src/runtime/utils/feedbackAnnotations'
import {
  FEEDBACK_ANNOTATE_COLORS,
  nearestTextSizeId,
  resolveAnnotateLineWidth,
  resolveTextFontSize,
} from '../src/runtime/utils/feedbackAnnotateDraw'

describe('feedbackAnnotations', () => {
  it('normalizes inverted rectangles', () => {
    expect(normalizeRect(10, 20, 4, 8)).toEqual({ x: 4, y: 8, w: 6, h: 12 })
  })

  it('moves shape annotations', () => {
    const shape: FeedbackAnnotation = {
      id: '1',
      kind: 'shape',
      shape: 'rect',
      x: 10,
      y: 20,
      w: 30,
      h: 40,
      color: '#fff',
      lineWidth: 2,
    }
    expect(moveAnnotation(shape, 5, -3)).toMatchObject({ x: 15, y: 17 })
  })

  it('clones annotations deeply enough for history', () => {
    const original: FeedbackAnnotation[] = [{
      id: createAnnotationId(),
      kind: 'path',
      tool: 'pen',
      points: [{ x: 1, y: 2 }],
      color: '#000',
      lineWidth: 2,
    }]
    const cloned = cloneAnnotations(original)
    expect(cloned).toEqual(original)
    expect(cloned[0]).not.toBe(original[0])
    if (cloned[0]?.kind === 'path' && original[0]?.kind === 'path') {
      expect(cloned[0].points).not.toBe(original[0].points)
    }
  })

  it('computes bounds for text via measure callback', () => {
    const text: FeedbackAnnotation = {
      id: 't',
      kind: 'text',
      x: 5,
      y: 10,
      text: 'Hi',
      color: '#000',
      fontSize: 16,
      textSize: 'medium',
      bold: true,
      italic: false,
    }
    const bounds = getAnnotationBounds(text, () => ({ width: 20, height: 16 }))
    expect(bounds.w).toBeGreaterThan(0)
    expect(bounds.h).toBeGreaterThan(0)
  })
})

describe('feedbackAnnotateDraw', () => {
  it('exposes a non-empty color palette', () => {
    expect(FEEDBACK_ANNOTATE_COLORS.length).toBeGreaterThan(3)
  })

  it('resolves stroke and text sizes from canvas width', () => {
    expect(resolveAnnotateLineWidth(800, 'medium')).toBeGreaterThan(0)
    expect(resolveTextFontSize(800, 'large')).toBeGreaterThan(resolveTextFontSize(800, 'small'))
    expect(nearestTextSizeId(800, resolveTextFontSize(800, 'medium'))).toBe('medium')
  })
})
