/* Remember image upload preparation, v1. No server upload or private storage access here. */
export const ACCEPTED_IMAGE_TYPES = Object.freeze(['image/jpeg','image/png','image/webp']);
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export async function sha256Hex(blob) {
  if (!(blob instanceof Blob)) throw new TypeError('Expected a Blob');
  const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate and fingerprint original bytes, with no visual similarity heuristics.
 * Server must independently validate, deduplicate and enforce quota atomically.
 * A different crop, screenshot or re-encoded file is treated as a new image.
 */
export async function prepareImageBatch(files, existingDigests = new Set()) {
  const accepted = [], duplicates = [], rejected = [];
  const seen = new Set(existingDigests);
  for (const file of files) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      rejected.push({name:file.name, reason:'Endast JPG, PNG eller WebP stöds.'});
      continue;
    }
    if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
      rejected.push({name:file.name, reason:'Bilden måste vara mellan 1 byte och 10 MB.'});
      continue;
    }
    const digest = await sha256Hex(file);
    if (seen.has(digest)) {
      duplicates.push({name:file.name, digest, message:'Den här bilden finns redan i albumet.'});
      continue;
    }
    seen.add(digest);
    accepted.push({file, digest, idempotencyKey:crypto.randomUUID()});
  }
  return {accepted, duplicates, rejected};
}
