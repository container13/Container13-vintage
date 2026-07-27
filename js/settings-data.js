const PROJECT_ID = "container13-87c1a";
const API_KEY = "AIzaSyDDWaTS_Yyo5X-skYiJ5nQYX5Jc5ZSa1tw";
const CACHE_PREFIX = "c13SettingDocumentV1:";
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000;
const pendingRequests = new Map();

function documentUrl(name) {
  return `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/settings/${encodeURIComponent(name)}?key=${API_KEY}`;
}

export function getCachedSettingDocument(name) {
  try {
    const stored = JSON.parse(localStorage.getItem(`${CACHE_PREFIX}${name}`) || "null");
    if (
      !stored ||
      typeof stored.savedAt !== "number" ||
      Date.now() - stored.savedAt > CACHE_MAX_AGE ||
      !stored.data ||
      typeof stored.data !== "object"
    ) {
      return null;
    }
    return stored.data;
  } catch (_) {
    return null;
  }
}

export function fetchFreshSettingDocument(name) {
  if (!pendingRequests.has(name)) {
    const request = fetch(documentUrl(name), { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) return null;
          throw new Error(`Firestore svarade ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          try {
            localStorage.setItem(`${CACHE_PREFIX}${name}`, JSON.stringify({
              savedAt: Date.now(),
              data
            }));
          } catch (_) {}
        }
        return data;
      })
      .finally(() => pendingRequests.delete(name));
    pendingRequests.set(name, request);
  }

  return pendingRequests.get(name);
}
