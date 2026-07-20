export type FeedbackAnnotateTool = 'pen' | 'highlighter' | 'rect' | 'ellipse' | 'arrow' | 'text' | 'redact';
export type FeedbackTextSizeId = 'small' | 'medium' | 'large';
export declare const FEEDBACK_ANNOTATE_COLORS: readonly ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#ffffff", "#0f172a"];
export declare const FEEDBACK_ANNOTATE_STROKE_WIDTHS: readonly [{
    readonly id: "thin";
    readonly label: "Thin";
    readonly factor: 1;
}, {
    readonly id: "medium";
    readonly label: "Medium";
    readonly factor: 2;
}, {
    readonly id: "thick";
    readonly label: "Thick";
    readonly factor: 4;
}];
export declare const FEEDBACK_TEXT_SIZES: readonly [{
    readonly id: "small";
    readonly label: "Small";
    readonly factor: number;
}, {
    readonly id: "medium";
    readonly label: "Medium";
    readonly factor: number;
}, {
    readonly id: "large";
    readonly label: "Large";
    readonly factor: number;
}];
export type FeedbackAnnotateStrokeWidthId = (typeof FEEDBACK_ANNOTATE_STROKE_WIDTHS)[number]['id'];
export declare function resolveAnnotateLineWidth(canvasWidth: number, strokeWidthId: FeedbackAnnotateStrokeWidthId): number;
export declare function resolveTextFontSize(canvasWidth: number, textSize: FeedbackTextSizeId): number;
/** Map a pixel font size back to the nearest preset (e.g. after handle resize). */
export declare function nearestTextSizeId(canvasWidth: number, fontSize: number): FeedbackTextSizeId;
export declare function buildCanvasFont(options: {
    fontSize: number;
    bold: boolean;
    italic: boolean;
}): string;
export declare function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, lineWidth: number): void;
/** Shaft end for an arrow from → to (exported for unit tests). */
export declare function arrowShaftEnd(fromX: number, fromY: number, toX: number, toY: number, lineWidth: number): {
    x: number;
    y: number;
    tipX: number;
    tipY: number;
};
export declare function drawEllipse(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): void;
export declare function drawTextAnnotation(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, fontSize: number, bold?: boolean, italic?: boolean): void;
