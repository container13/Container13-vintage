const PROJECT_ID = "container13-87c1a";
const API_KEY = "AIzaSyDDWaTS_Yyo5X-skYiJ5nQYX5Jc5ZSa1tw";
const GALLERY_URL =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/gallery?pageSize=100&key=${API_KEY}`;
const CACHE_KEY = "c13GalleryDataCacheV1";
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000;

let freshGalleryPromise = null;

function validPayload(value) {
  return value && typeof value === "object" && Array.isArray(value.documents);
}

function readStoredGallery() {
  try {
    const stored = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (
      !stored ||
      typeof stored.savedAt !== "number" ||
      Date.now() - stored.savedAt > CACHE_MAX_AGE ||
      !validPayload(stored.data)
    ) {
      return null;
    }
    return stored.data;
  } catch (_) {
    return null;
  }
}

function storeGallery(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      savedAt: Date.now(),
      data
    }));
  } catch (_) {
    // Sidan fungerar även om lokal lagring är avstängd.
  }
}

export function getCachedGalleryData() {
  return readStoredGallery();
}

export function fetchFreshGalleryData() {
  if (!freshGalleryPromise) {
    freshGalleryPromise = fetch(GALLERY_URL, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Firestore svarade ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const normalized = validPayload(data) ? data : { documents: [] };
        storeGallery(normalized);
        return normalized;
      })
      .finally(() => {
        freshGalleryPromise = null;
      });
  }

  return freshGalleryPromise;
}
