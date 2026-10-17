// Remember: isolated owner review module, not yet activated in production.
export async function loadOwnerReview({albumId, request}) {
  const data = await request("remember-photo-approval-queue", {albumId});
  if (data.ok !== true) throw Error("Bildgranskningen kunde inte hämtas");
  return {
    readOnly: Boolean(data.readOnly),
    featureEnabled: Boolean(data.featureEnabled),
    pending: (data.photos || []).filter(photo => photo.decision !== "rejected"),
    quarantine: (data.photos || []).filter(photo => photo.decision === "rejected")
  };
}
export function quarantineTimeLeft(expiresAt, now = Date.now()) {
  const remaining = Date.parse(expiresAt) - now;
  if (!Number.isFinite(remaining)) return "Okänd tid";
  if (remaining <= 0) return "Tiden har gått ut";
  const hours = Math.ceil(remaining / 3600000);
  return hours > 24 ? Math.ceil(hours / 24) + " dygn kvar" : hours + " timmar kvar";
}
