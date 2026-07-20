<script setup>
import {
  FEEDBACK_ANNOTATE_COLORS,
  FEEDBACK_ANNOTATE_STROKE_WIDTHS,
  FEEDBACK_TEXT_SIZES,
  buildCanvasFont,
  nearestTextSizeId,
  resolveAnnotateLineWidth,
  resolveTextFontSize
} from "../utils/feedbackAnnotateDraw";
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
  resizeAnnotation
} from "../utils/feedbackAnnotations";
const props = defineProps({
  imageDataUrl: { type: String, required: true }
});
const emit = defineEmits(["continue", "cancel"]);
const tool = ref("select");
const color = ref(FEEDBACK_ANNOTATE_COLORS[0]);
const strokeWidthId = ref("medium");
const canvasRef = ref(null);
const textInputRef = ref(null);
const baseImage = ref(null);
const annotations = ref([]);
const selectedId = ref(null);
const undoStack = ref([]);
const redoStack = ref([]);
const isDrawing = ref(false);
const isDragging = ref(false);
const isResizing = ref(false);
const activeHandle = ref(null);
const startPoint = ref(null);
const lastPoint = ref(null);
const draftPathPoints = ref([]);
const MAX_HISTORY = 40;
const selectedAnnotation = computed(
  () => annotations.value.find((item) => item.id === selectedId.value) ?? null
);
const selectedText = computed({
  get: () => selectedAnnotation.value?.kind === "text" ? selectedAnnotation.value.text : "",
  set: (value) => {
    const current = selectedAnnotation.value;
    if (!current || current.kind !== "text") {
      return;
    }
    updateSelected({ ...current, text: value });
  }
});
const selectedTextSize = computed(() => {
  const selected = selectedAnnotation.value;
  if (!selected || selected.kind !== "text") {
    return "medium";
  }
  const canvas = canvasRef.value;
  if (canvas?.width) {
    return nearestTextSizeId(canvas.width, selected.fontSize);
  }
  return selected.textSize;
});
const selectedTextBold = computed(
  () => selectedAnnotation.value?.kind === "text" ? selectedAnnotation.value.bold : false
);
const selectedTextItalic = computed(
  () => selectedAnnotation.value?.kind === "text" ? selectedAnnotation.value.italic : false
);
watch(
  selectedAnnotation,
  (selected) => {
    if (!selected) {
      return;
    }
    if (selected.kind === "shape" && selected.shape === "redact") {
      return;
    }
    if (selected.color && selected.color !== color.value) {
      color.value = selected.color;
    }
  }
);
function applyColor(next) {
  const normalized = next.trim();
  if (!normalized) {
    return;
  }
  color.value = normalized;
  const selected = selectedAnnotation.value;
  if (!selected) {
    return;
  }
  if (selected.kind === "shape" && selected.shape === "redact") {
    return;
  }
  if (selected.color === normalized) {
    return;
  }
  pushHistory();
  updateSelected({ ...selected, color: normalized });
}
watch(
  () => props.imageDataUrl,
  async (dataUrl) => {
    await nextTick();
    await loadBaseImage(dataUrl);
  },
  { immediate: true }
);
watch([annotations, selectedId, draftPathPoints, isDrawing], () => {
  redraw();
});
function measureText(text, fontSize) {
  const canvas = canvasRef.value;
  const ctx = canvas?.getContext("2d");
  const match = annotations.value.find(
    (item) => item.kind === "text" && item.text === text && item.fontSize === fontSize
  );
  const bold = match?.kind === "text" ? match.bold : true;
  const italic = match?.kind === "text" ? match.italic : false;
  if (!ctx) {
    return { width: Math.max(24, text.length * fontSize * 0.55), height: fontSize };
  }
  ctx.font = buildCanvasFont({ fontSize, bold, italic });
  return { width: ctx.measureText(text).width, height: fontSize };
}
function lineWidth() {
  const canvas = canvasRef.value;
  if (!canvas) {
    return 4;
  }
  return resolveAnnotateLineWidth(canvas.width, strokeWidthId.value);
}
async function loadBaseImage(dataUrl) {
  const canvas = canvasRef.value;
  if (!canvas || !dataUrl) {
    return;
  }
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  baseImage.value = img;
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  annotations.value = [];
  selectedId.value = null;
  undoStack.value = [];
  redoStack.value = [];
  draftPathPoints.value = [];
  redraw();
}
function pushHistory() {
  undoStack.value.push(cloneAnnotations(annotations.value));
  if (undoStack.value.length > MAX_HISTORY) {
    undoStack.value.shift();
  }
  redoStack.value = [];
}
function undo() {
  const previous = undoStack.value.pop();
  if (!previous) {
    return;
  }
  redoStack.value.push(cloneAnnotations(annotations.value));
  annotations.value = previous;
  if (selectedId.value && !annotations.value.some((item) => item.id === selectedId.value)) {
    selectedId.value = null;
  }
}
function redo() {
  const next = redoStack.value.pop();
  if (!next) {
    return;
  }
  undoStack.value.push(cloneAnnotations(annotations.value));
  annotations.value = next;
}
function updateSelected(next) {
  annotations.value = annotations.value.map((item) => item.id === next.id ? next : item);
}
function replaceAnnotation(id, next) {
  annotations.value = annotations.value.map((item) => item.id === id ? next : item);
}
function redraw() {
  const canvas = canvasRef.value;
  const ctx = canvas?.getContext("2d");
  const image = baseImage.value;
  if (!canvas || !ctx || !image) {
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  for (const annotation of annotations.value) {
    drawAnnotation(ctx, annotation);
  }
  if (isDrawing.value && draftPathPoints.value.length > 1 && (tool.value === "pen" || tool.value === "highlighter")) {
    drawAnnotation(ctx, {
      id: "draft",
      kind: "path",
      tool: tool.value,
      points: draftPathPoints.value,
      color: color.value,
      lineWidth: lineWidth()
    });
  }
  const selected = selectedAnnotation.value;
  if (selected) {
    drawSelectionOverlay(ctx, selected, measureText);
  }
}
function canvasPoint(event) {
  const canvas = canvasRef.value;
  if (!canvas) {
    return null;
  }
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return null;
  }
  return {
    x: (event.clientX - rect.left) / rect.width * canvas.width,
    y: (event.clientY - rect.top) / rect.height * canvas.height
  };
}
function onPointerDown(event) {
  const canvas = canvasRef.value;
  const point = canvasPoint(event);
  if (!canvas || !point) {
    return;
  }
  canvas.setPointerCapture(event.pointerId);
  if (tool.value === "select" || event.shiftKey) {
    beginSelectInteraction(point);
    return;
  }
  if (tool.value === "text") {
    beginTextPlacement(point);
    return;
  }
  const hitId = hitTestAnnotation(point, annotations.value, measureText);
  if (hitId) {
    const hit = annotations.value.find((item) => item.id === hitId);
    if (hit) {
      const bounds = getAnnotationBounds(hit, measureText);
      const handle = hitTestHandle(point, hit, bounds);
      selectedId.value = hitId;
      if (handle) {
        pushHistory();
        isResizing.value = true;
        activeHandle.value = handle;
        lastPoint.value = point;
        return;
      }
      pushHistory();
      isDragging.value = true;
      lastPoint.value = point;
      return;
    }
  }
  selectedId.value = null;
  pushHistory();
  isDrawing.value = true;
  startPoint.value = point;
  lastPoint.value = point;
  if (tool.value === "pen" || tool.value === "highlighter") {
    draftPathPoints.value = [point];
  }
}
function beginSelectInteraction(point) {
  if (selectedId.value) {
    const selected = annotations.value.find((item) => item.id === selectedId.value);
    if (selected) {
      const bounds = getAnnotationBounds(selected, measureText);
      const handle = hitTestHandle(point, selected, bounds);
      if (handle) {
        pushHistory();
        isResizing.value = true;
        activeHandle.value = handle;
        lastPoint.value = point;
        return;
      }
      if (point.x >= bounds.x && point.x <= bounds.x + bounds.w && point.y >= bounds.y && point.y <= bounds.y + bounds.h) {
        pushHistory();
        isDragging.value = true;
        lastPoint.value = point;
        return;
      }
    }
  }
  const hitId = hitTestAnnotation(point, annotations.value, measureText);
  selectedId.value = hitId;
  if (!hitId) {
    return;
  }
  pushHistory();
  isDragging.value = true;
  lastPoint.value = point;
}
function beginTextPlacement(point) {
  pushHistory();
  const canvas = canvasRef.value;
  const textSize = "medium";
  const fontSize = resolveTextFontSize(canvas?.width ?? 800, textSize);
  const annotation = {
    id: createAnnotationId(),
    kind: "text",
    x: point.x,
    y: point.y,
    text: "Text",
    color: color.value,
    fontSize,
    textSize,
    bold: true,
    italic: false
  };
  annotations.value = [...annotations.value, annotation];
  selectedId.value = annotation.id;
  tool.value = "select";
  void nextTick(() => {
    textInputRef.value?.focus();
    textInputRef.value?.select();
  });
}
function applyTextSize(textSize) {
  const selected = selectedAnnotation.value;
  const canvas = canvasRef.value;
  if (!selected || selected.kind !== "text" || !canvas) {
    return;
  }
  const fontSize = resolveTextFontSize(canvas.width, textSize);
  if (selected.textSize === textSize && selected.fontSize === fontSize) {
    return;
  }
  pushHistory();
  updateSelected({ ...selected, textSize, fontSize });
}
function toggleTextBold() {
  const selected = selectedAnnotation.value;
  if (!selected || selected.kind !== "text") {
    return;
  }
  pushHistory();
  updateSelected({ ...selected, bold: !selected.bold });
}
function toggleTextItalic() {
  const selected = selectedAnnotation.value;
  if (!selected || selected.kind !== "text") {
    return;
  }
  pushHistory();
  updateSelected({ ...selected, italic: !selected.italic });
}
function onPointerMove(event) {
  const point = canvasPoint(event);
  if (!point) {
    return;
  }
  if (isResizing.value && selectedId.value && activeHandle.value) {
    const current = annotations.value.find((item) => item.id === selectedId.value);
    if (current) {
      replaceAnnotation(
        current.id,
        resizeAnnotation(current, activeHandle.value, point, canvasRef.value?.width)
      );
    }
    lastPoint.value = point;
    return;
  }
  if (isDragging.value && selectedId.value && lastPoint.value) {
    const dx = point.x - lastPoint.value.x;
    const dy = point.y - lastPoint.value.y;
    const current = annotations.value.find((item) => item.id === selectedId.value);
    if (current) {
      replaceAnnotation(current.id, moveAnnotation(current, dx, dy));
    }
    lastPoint.value = point;
    return;
  }
  if (!isDrawing.value || !startPoint.value) {
    return;
  }
  if (tool.value === "pen" || tool.value === "highlighter") {
    draftPathPoints.value = [...draftPathPoints.value, point];
    redraw();
    return;
  }
  redraw();
  const canvas = canvasRef.value;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) {
    return;
  }
  const preview = buildShapePreview(startPoint.value, point);
  if (preview) {
    drawAnnotation(ctx, preview);
  }
}
function buildShapePreview(start, end) {
  if (tool.value === "arrow") {
    return {
      id: "preview",
      kind: "arrow",
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
      color: color.value,
      lineWidth: lineWidth()
    };
  }
  if (tool.value === "rect" || tool.value === "ellipse" || tool.value === "redact") {
    const rect = normalizeRect(start.x, start.y, end.x, end.y);
    return {
      id: "preview",
      kind: "shape",
      shape: tool.value,
      ...rect,
      color: color.value,
      lineWidth: lineWidth()
    };
  }
  return null;
}
function onPointerUp(event) {
  const point = canvasPoint(event) ?? lastPoint.value;
  if (isResizing.value || isDragging.value) {
    isResizing.value = false;
    isDragging.value = false;
    activeHandle.value = null;
    lastPoint.value = null;
    redraw();
    return;
  }
  if (!isDrawing.value || !startPoint.value) {
    isDrawing.value = false;
    return;
  }
  if (tool.value === "pen" || tool.value === "highlighter") {
    const points = draftPathPoints.value.length > 1 ? draftPathPoints.value : [startPoint.value, point ?? startPoint.value];
    const annotation = {
      id: createAnnotationId(),
      kind: "path",
      tool: tool.value,
      points,
      color: color.value,
      lineWidth: lineWidth()
    };
    annotations.value = [...annotations.value, annotation];
    selectedId.value = annotation.id;
  } else if (point && (tool.value === "rect" || tool.value === "ellipse" || tool.value === "redact" || tool.value === "arrow")) {
    const preview = buildShapePreview(startPoint.value, point);
    if (preview && preview.id === "preview") {
      const annotation = { ...preview, id: createAnnotationId() };
      if (annotation.kind === "shape" && annotation.w < 3 && annotation.h < 3) {
      } else if (annotation.kind === "arrow") {
        const length = Math.hypot(annotation.x2 - annotation.x1, annotation.y2 - annotation.y1);
        if (length >= 4) {
          annotations.value = [...annotations.value, annotation];
          selectedId.value = annotation.id;
        }
      } else {
        annotations.value = [...annotations.value, annotation];
        selectedId.value = annotation.id;
      }
    }
  }
  isDrawing.value = false;
  startPoint.value = null;
  lastPoint.value = null;
  draftPathPoints.value = [];
  redraw();
}
function deleteSelected() {
  if (!selectedId.value) {
    return;
  }
  pushHistory();
  annotations.value = annotations.value.filter((item) => item.id !== selectedId.value);
  selectedId.value = null;
}
function clearAnnotations() {
  pushHistory();
  annotations.value = [];
  selectedId.value = null;
}
function continueAnnotating() {
  const canvas = canvasRef.value;
  if (!canvas) {
    return;
  }
  const previousSelected = selectedId.value;
  selectedId.value = null;
  redraw();
  const dataUrl = canvas.toDataURL("image/png");
  selectedId.value = previousSelected;
  redraw();
  emit("continue", dataUrl);
}
function onKeyDown(event) {
  if (event.key === "Delete" || event.key === "Backspace") {
    const target = event.target;
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
      return;
    }
    if (selectedId.value) {
      event.preventDefault();
      deleteSelected();
    }
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
    event.preventDefault();
    if (event.shiftKey) {
      redo();
    } else {
      undo();
    }
  }
}
onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown);
});
const toolButtons = [
  { id: "select", label: "Select / move", icon: "i-lucide-mouse-pointer-2" },
  { id: "pen", label: "Pen", icon: "i-lucide-pencil" },
  { id: "highlighter", label: "Highlight", icon: "i-lucide-highlighter" },
  { id: "arrow", label: "Arrow", icon: "i-lucide-move-up-right" },
  { id: "rect", label: "Box", icon: "i-lucide-square" },
  { id: "ellipse", label: "Ellipse", icon: "i-lucide-circle" },
  { id: "text", label: "Text", icon: "i-lucide-type" },
  { id: "redact", label: "Redact", icon: "i-lucide-eye-off" }
];
const canvasCursor = computed(() => {
  if (tool.value === "select" || isDragging.value || isResizing.value) {
    return "default";
  }
  return "crosshair";
});
</script>

<template>
  <div class="bf-annotator">
    <div class="bf-annotator__toolbar">
      <div class="bf-annotator__tools">
        <button
          v-for="item in toolButtons"
          :key="item.id"
          type="button"
          class="bf-btn bf-btn--xs"
          :class="{ 'bf-btn--active': tool === item.id }"
          :aria-label="item.label"
          :title="item.label"
          @click="tool = item.id"
        >
          {{ item.label }}
        </button>
        <span class="bf-annotator__sep" />
        <button
          type="button"
          class="bf-btn bf-btn--xs"
          aria-label="Undo"
          :disabled="undoStack.length === 0"
          @click="undo"
        >
          Undo
        </button>
        <button
          type="button"
          class="bf-btn bf-btn--xs"
          aria-label="Redo"
          :disabled="redoStack.length === 0"
          @click="redo"
        >
          Redo
        </button>
        <button
          type="button"
          class="bf-btn bf-btn--xs"
          :disabled="!selectedId"
          @click="deleteSelected"
        >
          Delete
        </button>
        <button
          type="button"
          class="bf-btn bf-btn--xs"
          @click="clearAnnotations"
        >
          Clear
        </button>
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
          @input="applyColor($event.target.value)"
        >
        <button
          v-for="width in FEEDBACK_ANNOTATE_STROKE_WIDTHS"
          :key="width.id"
          type="button"
          class="bf-btn bf-btn--xs"
          :class="{ 'bf-btn--active': strokeWidthId === width.id }"
          @click="strokeWidthId = width.id"
        >
          {{ width.label }}
        </button>
      </div>
      <div
        v-if="selectedAnnotation?.kind === 'text'"
        class="bf-annotator__text-edit"
      >
        <label for="bugfreedback-annotate-text-input">Edit text</label>
        <input
          id="bugfreedback-annotate-text-input"
          ref="textInputRef"
          v-model="selectedText"
          type="text"
          placeholder="Label text…"
        >
        <button
          v-for="size in FEEDBACK_TEXT_SIZES"
          :key="size.id"
          type="button"
          class="bf-btn bf-btn--xs"
          :class="{ 'bf-btn--active': selectedTextSize === size.id }"
          @click="applyTextSize(size.id)"
        >
          {{ size.label }}
        </button>
        <button
          type="button"
          class="bf-btn bf-btn--xs"
          :class="{ 'bf-btn--active': selectedTextBold }"
          aria-label="Bold"
          @click="toggleTextBold"
        >
          <b>B</b>
        </button>
        <button
          type="button"
          class="bf-btn bf-btn--xs"
          :class="{ 'bf-btn--active': selectedTextItalic }"
          aria-label="Italic"
          @click="toggleTextItalic"
        >
          <i>I</i>
        </button>
      </div>
      <p
        v-else
        class="bf-annotator__hint"
      >
        Select to move · handles resize · Delete removes
      </p>
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
      <button
        type="button"
        class="bf-btn"
        @click="emit('cancel')"
      >
        Cancel
      </button>
      <button
        type="button"
        class="bf-btn bf-btn--active"
        @click="continueAnnotating"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<style scoped>
.bf-annotator{display:flex;flex:1;flex-direction:column;gap:.75rem;min-height:0}.bf-annotator__toolbar{display:flex;flex-direction:column;gap:.5rem}.bf-annotator__actions,.bf-annotator__palette,.bf-annotator__text-edit,.bf-annotator__tools{align-items:center;display:flex;flex-wrap:wrap;gap:.35rem}.bf-annotator__sep{background:rgba(0,0,0,.2);height:1.25rem;margin:0 .25rem;width:1px}.bf-annotator__hint{font-size:.75rem;margin:0;opacity:.75}.bf-annotator__canvas-wrap{background:hsla(240,4%,46%,.2);border:1px solid rgba(0,0,0,.12);border-radius:.5rem;flex:1;min-height:0;overflow:auto;position:relative}.bf-annotator__canvas{display:block;height:auto;margin:0 auto;max-width:100%;touch-action:none}.bf-annotator__actions{justify-content:flex-end}.bf-btn{align-items:center;background:hsla(0,0%,100%,.75);border:1px solid rgba(0,0,0,.15);border-radius:.375rem;color:inherit;cursor:pointer;display:inline-flex;font-size:.75rem;justify-content:center;padding:.35rem .65rem}.bf-btn:disabled{cursor:not-allowed;opacity:.45}.bf-btn--xs{font-size:.7rem;padding:.2rem .45rem}.bf-btn--active{background:var(--bugfreedback-primary,#3b82f6);border-color:transparent;color:var(--bugfreedback-primary-text,#fff)}.bf-swatch{border:2px solid rgba(0,0,0,.2);border-radius:9999px;cursor:pointer;height:1.35rem;padding:0;width:1.35rem}.bf-swatch--active{border-color:#fff;transform:scale(1.1)}.bf-color{background:transparent;border:0;cursor:pointer;height:1.6rem;padding:0;width:1.6rem}.bf-annotator__text-edit label{font-size:.75rem}.bf-annotator__text-edit input[type=text]{border:1px solid rgba(0,0,0,.2);border-radius:.375rem;flex:1;font-size:.875rem;min-width:8rem;padding:.25rem .5rem}
</style>
