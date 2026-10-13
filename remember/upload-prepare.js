// Remember upload preparation adapter. Server upload endpoint is NOT enabled yet.
import { prepareRememberImage } from "./image-compress.js";

export async function prepareRememberUpload(file, { onProgress } = {}) {
  onProgress?.({ stage: "compressing", percent: 0 });
  const image = await prepareRememberImage(file);
  const extension = image.mimeType === "image/webp" ? "webp" : "jpg";
  const safeName = "remember-" + crypto.randomUUID() + "." + extension;
  const uploadFile = new File([image.blob], safeName, { type: image.mimeType });
  onProgress?.({ stage: "ready", percent: 100 });
  return {
    file: uploadFile,
    width: image.width,
    height: image.height,
    originalBytes: image.originalBytes,
    uploadBytes: uploadFile.size,
    mimeType: uploadFile.type,
    savingsPercent: Math.max(0, Math.round(100 * (1 - uploadFile.size / image.originalBytes)))
  };
}

// Future server call must validate guest token, reservation, quota and upload window.
// Never put Supabase service credentials in this module or upload directly to a public bucket.
