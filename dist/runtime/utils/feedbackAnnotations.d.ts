import { type FeedbackAnnotateTool, type FeedbackTextSizeId } from './feedbackAnnotateDraw.js';
export type FeedbackPoint = {
    x: number;
    y: number;
};
export type FeedbackAnnotation = {
    id: string;
    kind: 'path';
    tool: 'pen' | 'highlighter';
    points: FeedbackPoint[];
    color: string;
    lineWidth: number;
} | {
    id: string;
    kind: 'shape';
    shape: 'rect' | 'ellipse' | 'redact';
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    lineWidth: number;
} | {
    id: string;
    kind: 'arrow';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    lineWidth: number;
} | {
    id: string;
    kind: 'text';
    x: number;
    y: number;
    text: string;
    color: string;
    /** Absolute pixel size used for drawing / hit-testing. */
    fontSize: number;
    /** Preset size id for the toolbar (kept in sync with fontSize). */
    textSize: FeedbackTextSizeId;
    bold: boolean;
    italic: boolean;
};
export type FeedbackHandleId = 'nw' | 'ne' | 'sw' | 'se' | 'start' | 'end';
export type FeedbackBounds = {
    x: number;
    y: number;
    w: number;
    h: number;
};
export declare function createAnnotationId(): string;
export declare function normalizeRect(x1: number, y1: number, x2: number, y2: number): {
    x: number;
    y: number;
    w: number;
    h: number;
};
export declare function getAnnotationBounds(annotation: FeedbackAnnotation, measureText?: (text: string, fontSize: number) => {
    width: number;
    height: number;
}): FeedbackBounds;
export declare function pointInBounds(point: FeedbackPoint, bounds: FeedbackBounds, pad?: number): boolean;
export declare function getHandlePositions(annotation: FeedbackAnnotation, bounds: FeedbackBounds): Partial<Record<FeedbackHandleId, FeedbackPoint>>;
export declare function hitTestHandle(point: FeedbackPoint, annotation: FeedbackAnnotation, bounds: FeedbackBounds, handleSize?: number): FeedbackHandleId | null;
export declare function hitTestAnnotation(point: FeedbackPoint, annotations: FeedbackAnnotation[], measureText?: (text: string, fontSize: number) => {
    width: number;
    height: number;
}): string | null;
export declare function moveAnnotation(annotation: FeedbackAnnotation, dx: number, dy: number): FeedbackAnnotation;
export declare function resizeAnnotation(annotation: FeedbackAnnotation, handle: FeedbackHandleId, point: FeedbackPoint, canvasWidth?: number): FeedbackAnnotation;
export declare function drawAnnotation(ctx: CanvasRenderingContext2D, annotation: FeedbackAnnotation): void;
export declare function drawSelectionOverlay(ctx: CanvasRenderingContext2D, annotation: FeedbackAnnotation, measureText?: (text: string, fontSize: number) => {
    width: number;
    height: number;
}): void;
export declare function cloneAnnotations(annotations: FeedbackAnnotation[]): FeedbackAnnotation[];
export declare function isDrawingTool(tool: FeedbackAnnotateTool | 'select'): tool is FeedbackAnnotateTool;
