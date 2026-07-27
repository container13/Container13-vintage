const PROJECT_ID = "container13-87c1a";
const API_KEY = "AIzaSyDDWaTS_Yyo5X-skYiJ5nQYX5Jc5ZSa1tw";
const SITE_SETTINGS_URL =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/settings/site?key=${API_KEY}`;

let rawSettingsPromise = null;

function valueFromFirestore(value) {
  if (!value || typeof value !== "object") return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("timestampValue" in value) return value.timestampValue;
  if (value.mapValue) return fieldsFromFirestore(value.mapValue.fields || {});
  if (value.arrayValue) {
    return (value.arrayValue.values || []).map(valueFromFirestore);
  }
  return null;
}

function fieldsFromFirestore(fields) {
  const result = {};

  Object.entries(fields || {}).forEach(([key, value]) => {
    result[key] = valueFromFirestore(value);
  });

  return result;
}

function fetchRawSettings() {
  return fetch(SITE_SETTINGS_URL, { cache: "no-store" })
    .then((response) => response.ok ? response.json() : null)
    .catch(() => null);
}

export function getRawSiteSettings() {
  if (!rawSettingsPromise) {
    rawSettingsPromise =
      window.c13IntroSettingsPromise ||
      fetchRawSettings();
  }

  return rawSettingsPromise;
}

export async function getSiteSettings() {
  const raw = await getRawSiteSettings();
  return raw ? fieldsFromFirestore(raw.fields || {}) : {};
}
