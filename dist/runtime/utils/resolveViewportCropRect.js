export const VIEWPORT_CROP_BOTTOM_INSET_PX = 3;
export function resolveViewportCropRect(options) {
  const captureWidth = Math.max(0, Math.round(options.captureWidth));
  const captureHeight = Math.max(0, Math.round(options.captureHeight));
  if (captureWidth === 0 || captureHeight === 0) {
    return { sx: 0, sy: 0, sw: captureWidth, sh: captureHeight };
  }
  const dpr = options.devicePixelRatio > 0 ? options.devicePixelRatio : 1;
  const bottomInsetCss = options.bottomInsetPx ?? VIEWPORT_CROP_BOTTOM_INSET_PX;
  const targets = [
    {
      w: Math.round(options.viewportWidth * dpr),
      h: Math.round(options.viewportHeight * dpr),
      inset: Math.round(bottomInsetCss * dpr)
    },
    {
      w: Math.round(options.viewportWidth),
      h: Math.round(options.viewportHeight),
      inset: Math.round(bottomInsetCss)
    }
  ];
  for (const target of targets) {
    if (target.w <= 0 || target.h <= 0) {
      continue;
    }
    if (target.w > captureWidth + 2 || target.h > captureHeight + 2) {
      continue;
    }
    const nearExactWidth = Math.abs(captureWidth - target.w) <= 2;
    const nearExactHeight = Math.abs(captureHeight - target.h) <= 2;
    if (nearExactWidth && nearExactHeight) {
      const inset2 = Math.min(target.inset, Math.max(0, captureHeight - 1));
      const sh2 = Math.max(1, captureHeight - inset2);
      return { sx: 0, sy: 0, sw: captureWidth, sh: sh2 };
    }
    const sw = Math.min(target.w, captureWidth);
    const sh = Math.min(target.h, captureHeight);
    const sx = Math.max(0, Math.round((captureWidth - sw) / 2));
    const inset = Math.min(target.inset, Math.max(0, captureHeight - sh));
    const sy = Math.max(0, captureHeight - sh - inset);
    return { sx, sy, sw, sh };
  }
  return { sx: 0, sy: 0, sw: captureWidth, sh: captureHeight };
}
