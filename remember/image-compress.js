// Remember mobile image preparation candidate. Not wired to uploads yet.
// Browser-native canvas encoding; no third-party dependencies.
export async function prepareRememberImage(file, options = {}) {
  const maxInputBytes = 10 * 1024 * 1024;
  const maxEdge = options.maxEdge ?? 1920;
  const targetBytes = options.targetBytes ?? 600 * 1024;
  if (!(file instanceof Blob) || file.size === 0 || file.size > maxInputBytes) {
    throw new Error("Bilden saknas eller är för stor (max 10 MB).");
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Välj en JPEG-, PNG- eller WebP-bild.");
  }
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Bildbehandling stöds inte i den här webbläsaren.");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);
    const encode = (type, quality) => new Promise((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Kunde inte komprimera bilden.")), type, quality);
    });
    const supportedWebP = (await encode("image/webp", 0.82)).type === "image/webp";
    const type = supportedWebP ? "image/webp" : "image/jpeg";
    // Avoid low-quality artifacts: use the smallest candidate above a conservative quality floor.
    let best = await encode(type, 0.86);
    for (const quality of [0.80, 0.74, 0.68]) {
      if (best.size <= targetBytes) break;
      const candidate = await encode(type, quality);
      if (candidate.size < best.size) best = candidate;
    }
    return { blob: best, mimeType: best.type, width, height, bytes: best.size,
      originalBytes: file.size, compressed: true };
  } finally {
    bitmap.close();
  }
}
