export async function scaleImageDataUrl(dataUrl, scale) {
  if (!(scale > 0) || Math.abs(scale - 1) < 1e-3) {
    return dataUrl;
  }
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return dataUrl;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/png");
}
export function scaleDimensions(width, height, scale) {
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  };
}
