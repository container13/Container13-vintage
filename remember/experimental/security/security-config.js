// Remember experimental security module. NOT loaded by production pages.
// No network, persistence, database writes or customer notifications.
export const FEATURES = Object.freeze({
  quotaStatus: { label: "Bildräknare", defaultMode: "off" },
  blockedAttempts: { label: "Stoppade uppladdningsförsök", defaultMode: "off" },
  ownerAlerts: { label: "Aviseringar till albumägare", defaultMode: "off" },
  emailAlerts: { label: "Mejlaviseringar", defaultMode: "off" },
  verifiedEmail: { label: "Verifierad mejl före uppladdning", defaultMode: "off" },
  moderation: { label: "Granskning före publicering", defaultMode: "off" },
  reports: { label: "Rapportera olämplig bild", defaultMode: "off" }
});
export const MODES = Object.freeze(["off", "test", "on"]);
export const OWNER_DEFAULTS = Object.freeze({
  requireVerifiedEmail: false,
  reviewBeforePublishing: false,
  allowReports: true,
  reportNotifications: true
});
export function effectiveSecurity(flags, owner, isTester = false) {
  const enabled = key => {
    const mode = flags[key] || FEATURES[key]?.defaultMode || "off";
    return mode === "on" || (mode === "test" && isTester);
  };
  return {
    requireVerifiedEmail: enabled("verifiedEmail") && owner.requireVerifiedEmail === true,
    reviewBeforePublishing: enabled("moderation") && owner.reviewBeforePublishing === true,
    allowReports: enabled("reports") && owner.allowReports !== false,
    reportNotifications: enabled("reports") && enabled("ownerAlerts") &&
      owner.allowReports !== false && owner.reportNotifications === true
  };
}
export function validateOwnerSettings(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return false;
  const keys = Object.keys(OWNER_DEFAULTS);
  return Object.keys(input).every(key => keys.includes(key) && typeof input[key] === "boolean");
}
export function transitionFeature(flags, key, mode, actor, audit) {
  if (!Object.hasOwn(FEATURES, key) || !MODES.includes(mode)) throw Error("Invalid feature");
  const previous = flags[key] || "off";
  if (previous !== mode) audit.push({ at: new Date().toISOString(), actor, key, previous, next: mode });
  return { ...flags, [key]: mode };
}
