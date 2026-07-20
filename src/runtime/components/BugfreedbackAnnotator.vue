<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from '#imports'
import {
  FEEDBACK_ANNOTATE_COLORS,
  FEEDBACK_ANNOTATE_STROKE_WIDTHS,
  FEEDBACK_TEXT_SIZES,
  buildCanvasFont,
  nearestTextSizeId,
  resolveAnnotateLineWidth,
  resolveTextFontSize,
  type FeedbackAnnotateStrokeWidthId,
  type FeedbackAnnotateTool,
  type FeedbackTextSizeId,
} from '../utils/feedbackAnnotateDraw'
import {
  cloneAnnotations,
  createAnnotationId,
  drawAnnotation,
  drawSelectionOverlay,
  getAnnotationBounds,
  hitTestAnnotation,
  hitTestHandle,
  moveAnnotation,
  normalizeRect,
  resizeAnnotation,
  type FeedbackAnnotation,
  type FeedbackHandleId,
  type FeedbackPoint,
} from '../utils/feedbackAnnotations'

const props = defineProps<{
  imageDataUrl: string
}>()

const emit = defineEmits<{
  continue: [dataUrl: string]
  cancel: []
}>()

type UiTool = FeedbackAnnotateTool | 'select'

const tool = ref<UiTool>('select')
const color = ref<string>(FEEDBACK_ANNOTATE_COLORS[0])
const strokeWidthId = ref<FeedbackAnnotateStrokeWidthId>('medium')
const canvasRef = ref<HTMLCanvasElement | null>(null)
const textInputRef = ref<HTMLInputElement | null>(null)
const baseImage = ref<HTMLImageElement | null>(null)
const annotations = ref<FeedbackAnnotation[]>([])
const selectedId = ref<string | null>(null)
const undoStack = ref<FeedbackAnnotation[][]>([])
const redoStack = ref<FeedbackAnnotation[][]>([])

const isDrawing = ref(false)
const isDragging = ref(false)
const isResizing = ref(false)
const activeHandle = ref<FeedbackHandleId | null>(null)
const startPoint = ref<FeedbackPoint | null>(null)
const lastPoint = ref<FeedbackPoint | null>(null)
const draftPathPoints = ref<FeedbackPoint[]>([])

const MAX_HISTORY = 40

const selectedAnnotation = computed(
  () => annotations.value.find(item => item.id === selectedId.value) ?? null,
)

const selectedText = computed({
  get: () => (selectedAnnotation.value?.kind === 'text' ? selectedAnnotation.value.text : ''),
  set: (value: string) => {
    const current = selectedAnnotation.value
    if (!current || current.kind !== 'text') {
      return
    }
    updateSelected({ ...current, text: value })
  },
})

const selectedTextSize = computed<FeedbackTextSizeId>(() => {
  const selected = selectedAnnotation.value
  if (!selected || selected.kind !== 'text') {
    return 'medium'
  }
  const canvas = canvasRef.value
  if (canvas?.width) {
    return nearestTextSizeId(canvas.width, selected.fontSize)
  }
  return selected.textSize
})

const selectedTextBold = computed(() =>
  selectedAnnotation.value?.kind === 'text' ? selectedAnnotation.value.bold : false,
)
const selectedTextItalic = computed(() =>
  selectedAnnotation.value?.kind === 'text' ? selectedAnnotation.value.italic : false,
)

watch(
  selectedAnnotation,
  (selected) => {
    if (!selected) {
      return
    }
    // Redact is always black visually; keep palette on last drawing color.
    if (selected.kind === 'shape' && selected.shape === 'redact') {
      return
    }
    if (selected.color && selected.color !== color.value) {
      color.value = selected.color
    }
  },
)

function applyColor(next: string) {
  const normalized = next.trim()
  if (!normalized) {
    return
  }
  color.value = normalized
  const selected = selectedAnnotation.value
  if (!selected) {
    return
  }
  if (selected.kind === 'shape' && selected.shape === 'redact') {
    return
  }
  if (selected.color === normalized) {
    return
  }
  pushHistory()
  updateSelected({ ...selected, color: normalized })
}

watch(
  () => props.imageDataUrl,
  async (dataUrl) => {
    await nextTick()
    await loadBaseImage(dataUrl)
  },
  { immediate: true },
)

watch([annotations, selectedId, draftPathPoints, isDrawing], () => {
  redraw()
})

function measureText(text: string, fontSize: number): { width: number, height: number } {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  const match = annotations.value.find(
    item => item.kind === 'text' && item.text === text && item.fontSize === fontSize,
  )
  const bold = match?.kind === 'text' ? match.bold : true
  const italic = match?.kind === 'text' ? match.italic : false
  if (!ctx) {
    return { width: Math.max(24, text.length * fontSize * 0.55), height: fontSize }
  }
  ctx.font = buildCanvasFont({ fontSize, bold, italic })
  return { width: ctx.measureText(text).width, height: fontSize }
}

function lineWidth(): number {
  const canvas = canvasRef.value
  if (!canvas) {
    return 4
  }
  return resolveAnnotateLineWidth(canvas.width, strokeWidthId.value)
}

async function loadBaseImage(dataUrl: string) {
  const canvas = canvasRef.value
  if (!canvas || !dataUrl) {
    return
  }
  const img = new Image()
  img.src = dataUrl
  await img.decode()
  baseImage.value = img
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  annotations.value = []
  selectedId.value = null
  undoStack.value = []
  redoStack.value = []
  draftPathPoints.value = []
  redraw()
}

function pushHistory() {
  undoStack.value.push(cloneAnnotations(annotations.value))
  if (undoStack.value.length > MAX_HISTORY) {
    undoStack.value.shift()
  }
  redoStack.value = []
}

function undo() {
  const previous = undoStack.value.pop()
  if (!previous) {
    return
  }
  redoStack.value.push(cloneAnnotations(annotations.value))
  annotations.value = previous
  if (selectedId.value && !annotations.value.some(item => item.id === selectedId.value)) {
    selectedId.value = null
  }
}

function redo() {
  const next = redoStack.value.pop()
  if (!next) {
    return
  }
  undoStack.value.push(cloneAnnotations(annotations.value))
  annotations.value = next
}

function updateSelected(next: FeedbackAnnotation) {
  annotations.value = annotations.value.map(item => (item.id === next.id ? next : item))
}

function replaceAnnotation(id: string, next: FeedbackAnnotation) {
  annotations.value = annotations.value.map(item => (item.id === id ? next : item))
}

function redraw() {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  const image = baseImage.value
  if (!canvas || !ctx || !image) {
    return
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(image, 0, 0)

  for (const annotation of annotations.value) {
    drawAnnotation(ctx, annotation)
  }

  if (isDrawing.value && draftPathPoints.value.length > 1 && (tool.value === 'pen' || tool.value === 'highlighter')) {
    drawAnnotation(ctx, {
      id: 'draft',
      kind: 'path',
      tool: tool.value,
      points: draftPathPoints.value,
      color: color.value,
      lineWidth: lineWidth(),
    })
  }

  const selected = selectedAnnotation.value
  if (selected) {
    drawSelectionOverlay(ctx, selected, measureText)
  }
}

function canvasPoint(event: PointerEvent): FeedbackPoint | null {
  const canvas = canvasRef.value
  if (!canvas) {
    return null
  }
  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) {
    return null
  }
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  }
}

function onPointerDown(event: PointerEvent) {
  const canvas = canvasRef.value
  const point = canvasPoint(event)
  if (!canvas || !point) {
    return
  }
  canvas.setPointerCapture(event.pointerId)

  if (tool.value === 'select' || event.shiftKey) {
    beginSelectInteraction(point)
    return
  }

  if (tool.value === 'text') {
    beginTextPlacement(point)
    return
  }

  // Prefer selecting an existing item when clicking handles/body (except while drawing).
  const hitId = hitTestAnnotation(point, annotations.value, measureText)
  if (hitId) {
    const hit = annotations.value.find(item => item.id === hitId)
    if (hit) {
      const bounds = getAnnotationBounds(hit, measureText)
      const handle = hitTestHandle(point, hit, bounds)
      selectedId.value = hitId
      if (handle) {
        pushHistory()
        isResizing.value = true
        activeHandle.value = handle
        lastPoint.value = point
        return
      }
      pushHistory()
      isDragging.value = true
      lastPoint.value = point
      return
    }
  }

  selectedId.value = null
  pushHistory()
  isDrawing.value = true
  startPoint.value = point
  lastPoint.value = point

  if (tool.value === 'pen' || tool.value === 'highlighter') {
    draftPathPoints.value = [point]
  }
}

function beginSelectInteraction(point: FeedbackPoint) {
  if (selectedId.value) {
    const selected = annotations.value.find(item => item.id === selectedId.value)
    if (selected) {
      const bounds = getAnnotationBounds(selected, measureText)
      const handle = hitTestHandle(point, selected, bounds)
      if (handle) {
        pushHistory()
        isResizing.value = true
        activeHandle.value = handle
        lastPoint.value = point
        return
      }
      if (
        point.x >= bounds.x
        && point.x <= bounds.x + bounds.w
        && point.y >= bounds.y
        && point.y <= bounds.y + bounds.h
      ) {
        pushHistory()
        isDragging.value = true
        lastPoint.value = point
        return
      }
    }
  }

  const hitId = hitTestAnnotation(point, annotations.value, measureText)
  selectedId.value = hitId
  if (!hitId) {
    return
  }
  pushHistory()
  isDragging.value = true
  lastPoint.value = point
}

function beginTextPlacement(point: FeedbackPoint) {
  pushHistory()
  const canvas = canvasRef.value
  const textSize: FeedbackTextSizeId = 'medium'
  const fontSize = resolveTextFontSize(canvas?.width ?? 800, textSize)
  const annotation: FeedbackAnnotation = {
    id: createAnnotationId(),
    kind: 'text',
    x: point.x,
    y: point.y,
    text: 'Text',
    color: color.value,
    fontSize,
    textSize,
    bold: true,
    italic: false,
  }
  annotations.value = [...annotations.value, annotation]
  selectedId.value = annotation.id
  tool.value = 'select'
  void nextTick(() => {
    textInputRef.value?.focus()
    textInputRef.value?.select()
  })
}

function applyTextSize(textSize: FeedbackTextSizeId) {
  const selected = selectedAnnotation.value
  const canvas = canvasRef.value
  if (!selected || selected.kind !== 'text' || !canvas) {
    return
  }
  const fontSize = resolveTextFontSize(canvas.width, textSize)
  if (selected.textSize === textSize && selected.fontSize === fontSize) {
    return
  }
  pushHistory()
  updateSelected({ ...selected, textSize, fontSize })
}

function toggleTextBold() {
  const selected = selectedAnnotation.value
  if (!selected || selected.kind !== 'text') {
    return
  }
  pushHistory()
  updateSelected({ ...selected, bold: !selected.bold })
}

function toggleTextItalic() {
  const selected = selectedAnnotation.value
  if (!selected || selected.kind !== 'text') {
    return
  }
  pushHistory()
  updateSelected({ ...selected, italic: !selected.italic })
}

function onPointerMove(event: PointerEvent) {
  const point = canvasPoint(event)
  if (!point) {
    return
  }

  if (isResizing.value && selectedId.value && activeHandle.value) {
    const current = annotations.value.find(item => item.id === selectedId.value)
    if (current) {
      replaceAnnotation(
        current.id,
        resizeAnnotation(current, activeHandle.value, point, canvasRef.value?.width),
      )
    }
    lastPoint.value = point
    return
  }

  if (isDragging.value && selectedId.value && lastPoint.value) {
    const dx = point.x - lastPoint.value.x
    const dy = point.y - lastPoint.value.y
    const current = annotations.value.find(item => item.id === selectedId.value)
    if (current) {
      replaceAnnotation(current.id, moveAnnotation(current, dx, dy))
    }
    lastPoint.value = point
    return
  }

  if (!isDrawing.value || !startPoint.value) {
    return
  }

  if (tool.value === 'pen' || tool.value === 'highlighter') {
    draftPathPoints.value = [...draftPathPoints.value, point]
    redraw()
    return
  }

  // Live preview for shapes/arrow by temporarily mutating a preview layer via redraw hack:
  redraw()
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) {
    return
  }
  const preview = buildShapePreview(startPoint.value, point)
  if (preview) {
    drawAnnotation(ctx, preview)
  }
}

function buildShapePreview(start: FeedbackPoint, end: FeedbackPoint): FeedbackAnnotation | null {
  if (tool.value === 'arrow') {
    return {
      id: 'preview',
      kind: 'arrow',
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
      color: color.value,
      lineWidth: lineWidth(),
    }
  }
  if (tool.value === 'rect' || tool.value === 'ellipse' || tool.value === 'redact') {
    const rect = normalizeRect(start.x, start.y, end.x, end.y)
    return {
      id: 'preview',
      kind: 'shape',
      shape: tool.value,
      ...rect,
      color: color.value,
      lineWidth: lineWidth(),
    }
  }
  return null
}

function onPointerUp(event: PointerEvent) {
  const point = canvasPoint(event) ?? lastPoint.value

  if (isResizing.value || isDragging.value) {
    isResizing.value = false
    isDragging.value = false
    activeHandle.value = null
    lastPoint.value = null
    redraw()
    return
  }

  if (!isDrawing.value || !startPoint.value) {
    isDrawing.value = false
    return
  }

  if (tool.value === 'pen' || tool.value === 'highlighter') {
    const points = draftPathPoints.value.length > 1
      ? draftPathPoints.value
      : [startPoint.value, point ?? startPoint.value]
    const annotation: FeedbackAnnotation = {
      id: createAnnotationId(),
      kind: 'path',
      tool: tool.value,
      points,
      color: color.value,
      lineWidth: lineWidth(),
    }
    annotations.value = [...annotations.value, annotation]
    selectedId.value = annotation.id
  }
  else if (point && (tool.value === 'rect' || tool.value === 'ellipse' || tool.value === 'redact' || tool.value === 'arrow')) {
    const preview = buildShapePreview(startPoint.value, point)
    if (preview && preview.id === 'preview') {
      const annotation = { ...preview, id: createAnnotationId() } as FeedbackAnnotation
      // Skip tiny accidental clicks
      if (annotation.kind === 'shape' && annotation.w < 3 && annotation.h < 3) {
        // ignore
      }
      else if (annotation.kind === 'arrow') {
        const length = Math.hypot(annotation.x2 - annotation.x1, annotation.y2 - annotation.y1)
        if (length >= 4) {
          annotations.value = [...annotations.value, annotation]
          selectedId.value = annotation.id
        }
      }
      else {
        annotations.value = [...annotations.value, annotation]
        selectedId.value = annotation.id
      }
    }
  }

  isDrawing.value = false
  startPoint.value = null
  lastPoint.value = null
  draftPathPoints.value = []
  redraw()
}

function deleteSelected() {
  if (!selectedId.value) {
    return
  }
  pushHistory()
  annotations.value = annotations.value.filter(item => item.id !== selectedId.value)
  selectedId.value = null
}

function clearAnnotations() {
  pushHistory()
  annotations.value = []
  selectedId.value = null
}

function continueAnnotating() {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }
  // Export without selection chrome
  const previousSelected = selectedId.value
  selectedId.value = null
  redraw()
  const dataUrl = canvas.toDataURL('image/png')
  selectedId.value = previousSelected
  redraw()
  emit('continue', dataUrl)
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Delete' || event.key === 'Backspace') {
    const target = event.target as HTMLElement | null
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return
    }
    if (selectedId.value) {
      event.preventDefault()
      deleteSelected()
    }
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
    event.preventDefault()
    if (event.shiftKey) {
      redo()
    }
    else {
      undo()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})

const toolButtons: { id: UiTool, label: string, icon: string }[] = [
  { id: 'select', label: 'Select / move', icon: 'i-lucide-mouse-pointer-2' },
  { id: 'pen', label: 'Pen', icon: 'i-lucide-pencil' },
  { id: 'highlighter', label: 'Highlight', icon: 'i-lucide-highlighter' },
  { id: 'arrow', label: 'Arrow', icon: 'i-lucide-move-up-right' },
  { id: 'rect', label: 'Box', icon: 'i-lucide-square' },
  { id: 'ellipse', label: 'Ellipse', icon: 'i-lucide-circle' },
  { id: 'text', label: 'Text', icon: 'i-lucide-type' },
  { id: 'redact', label: 'Redact', icon: 'i-lucide-eye-off' },
]

const canvasCursor = computed(() => {
  if (tool.value === 'select' || isDragging.value || isResizing.value) {
    return 'default'
  }
  return 'crosshair'
})
</script>

<template>
  <div class="bf-annotator">
    <!--
      Explicit 50/50 columns: a column flex stack lets the tool row's
      max-content width push Edit text under the toolbar. Grid keeps the
      edit panel beside tools at half modal width without resizing the
      tool column when text controls appear.
    -->
    <div class="bf-annotator__toolbar">
      <div class="bf-annotator__toolbar-main">
        <div class="bf-annotator__tools">
          <UButton
            v-for="item in toolButtons"
            :key="item.id"
            size="xs"
            :color="tool === item.id ? 'primary' : 'neutral'"
            :variant="tool === item.id ? 'solid' : 'soft'"
            :icon="item.icon"
            :aria-label="item.label"
            :title="item.label"
            @click="tool = item.id"
          />
          <span class="bf-annotator__sep" />
          <UButton
            size="xs"
            color="neutral"
            variant="soft"
            icon="i-lucide-undo-2"
            aria-label="Undo"
            :disabled="undoStack.length === 0"
            @click="undo"
          />
          <UButton
            size="xs"
            color="neutral"
            variant="soft"
            icon="i-lucide-redo-2"
            aria-label="Redo"
            :disabled="redoStack.length === 0"
            @click="redo"
          />
          <UButton
            size="xs"
            color="neutral"
            variant="soft"
            icon="i-lucide-trash-2"
            :disabled="!selectedId"
            @click="deleteSelected"
          >
            Delete
          </UButton>
          <UButton
            size="xs"
            color="neutral"
            variant="soft"
            icon="i-lucide-eraser"
            @click="clearAnnotations"
          >
            Clear
          </UButton>
        </div>
        <div class="bf-annotator__palette">
          <button
            v-for="swatch in FEEDBACK_ANNOTATE_COLORS"
            :key="swatch"
            type="button"
            class="bf-swatch"
            :class="{ 'bf-swatch--active': color.toLowerCase() === swatch.toLowerCase() }"
            :style="{ backgroundColor: swatch }"
            :aria-label="`Color ${swatch}`"
            @click="applyColor(swatch)"
          />
          <input
            :value="color"
            type="color"
            class="bf-color"
            aria-label="Custom color"
            @input="applyColor(($event.target as HTMLInputElement).value)"
          >
          <UButton
            v-for="width in FEEDBACK_ANNOTATE_STROKE_WIDTHS"
            :key="width.id"
            size="xs"
            :color="strokeWidthId === width.id ? 'primary' : 'neutral'"
            :variant="strokeWidthId === width.id ? 'solid' : 'soft'"
            @click="strokeWidthId = width.id"
          >
            {{ width.label }}
          </UButton>
        </div>
      </div>

      <div class="bf-annotator__toolbar-side">
        <div
          class="bf-annotator__text-edit"
          :class="{ 'bf-annotator__text-edit--active': selectedAnnotation?.kind === 'text' }"
          :aria-hidden="selectedAnnotation?.kind !== 'text'"
        >
          <label for="bugfreedback-annotate-text-input">Edit text</label>
          <input
            id="bugfreedback-annotate-text-input"
            ref="textInputRef"
            v-model="selectedText"
            type="text"
            placeholder="Label text…"
            :tabindex="selectedAnnotation?.kind === 'text' ? 0 : -1"
          >
          <UButton
            v-for="size in FEEDBACK_TEXT_SIZES"
            :key="size.id"
            size="xs"
            :color="selectedTextSize === size.id ? 'primary' : 'neutral'"
            :variant="selectedTextSize === size.id ? 'solid' : 'soft'"
            :tabindex="selectedAnnotation?.kind === 'text' ? 0 : -1"
            @click="applyTextSize(size.id)"
          >
            {{ size.label }}
          </UButton>
          <UButton
            size="xs"
            :color="selectedTextBold ? 'primary' : 'neutral'"
            :variant="selectedTextBold ? 'solid' : 'soft'"
            aria-label="Bold"
            :tabindex="selectedAnnotation?.kind === 'text' ? 0 : -1"
            @click="toggleTextBold"
          >
            <span class="font-bold px-0.5">B</span>
          </UButton>
          <UButton
            size="xs"
            :color="selectedTextItalic ? 'primary' : 'neutral'"
            :variant="selectedTextItalic ? 'solid' : 'soft'"
            aria-label="Italic"
            :tabindex="selectedAnnotation?.kind === 'text' ? 0 : -1"
            @click="toggleTextItalic"
          >
            <span class="italic px-0.5">I</span>
          </UButton>
        </div>
        <p
          v-if="selectedAnnotation?.kind !== 'text'"
          class="bf-annotator__hint"
        >
          Select to move · handles resize · Delete removes
        </p>
      </div>
    </div>

    <div class="bf-annotator__canvas-wrap">
      <canvas
        ref="canvasRef"
        class="bf-annotator__canvas"
        :style="{ cursor: canvasCursor }"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      />
    </div>

    <div class="bf-annotator__actions">
      <UButton
        color="neutral"
        variant="soft"
        @click="emit('cancel')"
      >
        Cancel
      </UButton>
      <UButton
        color="primary"
        @click="continueAnnotating"
      >
        Continue
      </UButton>
    </div>
  </div>
</template>

<style scoped>
.bf-annotator {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 0;
  flex: 1;
}
.bf-annotator__toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
  width: 100%;
}
.bf-annotator__toolbar-main {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}
.bf-annotator__toolbar-side {
  position: relative;
  min-width: 0;
  width: 100%;
}
.bf-annotator__tools,
.bf-annotator__palette,
.bf-annotator__text-edit,
.bf-annotator__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}
.bf-annotator__sep {
  width: 1px;
  height: 1.25rem;
  background: rgba(0, 0, 0, 0.2);
  margin: 0 0.25rem;
}
.bf-annotator__hint {
  position: absolute;
  inset: 0;
  margin: 0;
  font-size: 0.75rem;
  opacity: 0.75;
  padding: 0.25rem 0;
  pointer-events: none;
  display: flex;
  align-items: center;
}
.bf-annotator__text-edit {
  box-sizing: border-box;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.2);
  padding: 0.25rem 0.625rem;
  /* Always in layout so selecting text does not resize the toolbar. */
  visibility: hidden;
}
.bf-annotator__text-edit--active {
  visibility: visible;
}
.bf-annotator__canvas-wrap {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: auto;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(113, 113, 122, 0.2);
}
.bf-annotator__canvas {
  display: block;
  max-width: 100%;
  height: auto;
  touch-action: none;
  margin: 0 auto;
}
.bf-annotator__actions {
  justify-content: flex-end;
}
.bf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.75);
  color: inherit;
  padding: 0.35rem 0.65rem;
  font-size: 0.75rem;
  cursor: pointer;
}
.bf-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.bf-btn--xs {
  padding: 0.2rem 0.45rem;
  font-size: 0.7rem;
}
.bf-btn--active {
  background: var(--bugfreedback-primary, #3b82f6);
  color: var(--bugfreedback-primary-text, #fff);
  border-color: transparent;
}
.bf-swatch {
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 9999px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;
  padding: 0;
}
.bf-swatch--active {
  border-color: #fff;
  transform: scale(1.1);
}
.bf-color {
  width: 1.6rem;
  height: 1.6rem;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0;
}
.bf-annotator__text-edit label {
  font-size: 0.75rem;
  flex-shrink: 0;
  white-space: nowrap;
}
.bf-annotator__text-edit input[type='text'] {
  min-width: 0;
  flex: 1 1 8rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(24, 24, 27, 0.9);
  color: inherit;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  outline: none;
}
</style>
