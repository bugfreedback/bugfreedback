/** Max decoded screenshot size accepted from the client (~5 MiB). */
export declare const BUGFREEDBACK_MAX_SCREENSHOT_BYTES: number;
/** Root element id for the bugfreedback widget (modal dismiss guard). */
export declare const BUGFREEDBACK_ROOT_ID = "bugfreedback-root";
export declare const BUGFREEDBACK_CAPTURE_GUIDE_ROOT_ID = "bugfreedback-capture-guide-root";
/** Full-screen capture permission guide (above page, below native browser chrome). */
export declare const BUGFREEDBACK_CAPTURE_GUIDE_Z_INDEX = 10060;
export declare const BUGFREEDBACK_HOST_SELECTOR = "#bugfreedback-root";
/** Mid-edge vertical/horizontal tab nudge (px). */
export declare const BUGFREEDBACK_LAUNCHER_EDGE_NUDGE_PX = 34;
/**
 * Annotate modal and pre-annotation screenshot scale relative to full capture.
 */
export declare const BUGFREEDBACK_ANNOTATE_SCALE = 0.75;
export declare const BUGFREEDBACK_DEFAULT_PRIMARY = "#3b82f6";
export declare const BUGFREEDBACK_DEFAULT_SECONDARY = "#1e293b";
export declare const BUGFREEDBACK_DEFAULT_PRIMARY_TEXT = "#ffffff";
export declare const BUGFREEDBACK_DEFAULT_MODAL_BG = "rgba(15, 23, 42, 0.98)";
export declare const BUGFREEDBACK_DEFAULT_MODAL_TEXT = "#ffffff";
export declare const BUGFREEDBACK_DEFAULT_ANNOTATE_BG = "#3f3f46";
export declare const BUGFREEDBACK_DEFAULT_ANNOTATE_TEXT = "#f4f4f5";
/** CSS padding for the edge launcher (`padding-block padding-inline`). */
export declare const BUGFREEDBACK_DEFAULT_LAUNCHER_PADDING = "0.55rem 1.1rem";
/** Lucide icons used by the widget toolbar (bundled via @nuxt/icon). */
export declare const BUGFREEDBACK_ICON_NAMES: readonly ["lucide:mouse-pointer-2", "lucide:pencil", "lucide:highlighter", "lucide:move-up-right", "lucide:square", "lucide:circle", "lucide:type", "lucide:eye-off", "lucide:undo-2", "lucide:redo-2", "lucide:trash-2", "lucide:eraser", "lucide:x", "lucide:camera", "lucide:paperclip", "lucide:circle-help"];
