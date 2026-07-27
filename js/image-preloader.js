import {
  fetchFreshGalleryData,
  getCachedGalleryData
} from "./gallery-data.js?v=1.1.0";

const activePreloads = new Set();
const preloadedUrls = new Set();

function connectionIsTooSlow() {
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (!connection) return false;
  if (connection.saveData === true) return true;

  return ["slow-2g", "2g"].includes(
    String(connection.effectiveType || "").toLowerCase()
  );
}

function firestoreValue(value) {
  if (!value || typeof value !== "object") return null;
  if ("stringValue" in value) return value.stringValue;
  if ("timestampValue" in value) return value.timestampValue;
  if (value.mapValue) return firestoreFields(value.mapValue.fields || {});
  return null;
}

function firestoreFields(fields) {
  const result = {};
  Object.entries(fields || {}).forEach(([key, value]) => {
    result[key] = firestoreValue(value);
  });
  return result;
}

function imageUrls(data) {
  const visibleUrls = new Set(
    Array.from(document.images)
      .map((image) => image.currentSrc || image.src)
      .filter(Boolean)
  );

  return (data?.documents || [])
    .map((document) => firestoreFields(document.fields || {}))
    .filter((item) => ["galleri", "nyinkommet"].includes(
      String(item.category || "").toLowerCase()
    ))
    .map((item) => String(
      item.imageUrl ||
      item.url ||
      item.downloadURL ||
      item.downloadUrl ||
      ""
    ).trim())
    .filter((url) =>
      url &&
      !visibleUrls.has(url) &&
      !preloadedUrls.has(url)
    );
}

function latestNewArrivalUrls(data) {
  return (data?.documents || [])
    .map((document) => ({
      documentCreatedAt: document.createTime || "",
      ...firestoreFields(document.fields || {})
    }))
    .filter((item) =>
      String(item.category || "").toLowerCase() === "nyinkommet" &&
      item.imageUrl
    )
    .sort((first, second) => {
      const firstTime = Date.parse(first.createdAt || first.documentCreatedAt || "") || 0;
      const secondTime = Date.parse(second.createdAt || second.documentCreatedAt || "") || 0;
      return secondTime - firstTime;
    })
    .slice(0, 4)
    .map((item) => String(item.imageUrl).trim())
    .filter(Boolean);
}

function preloadImage(url) {
  if (preloadedUrls.has(url)) return Promise.resolve();
  preloadedUrls.add(url);

  return new Promise((resolve) => {
    const image = new Image();
    activePreloads.add(image);
    image.decoding = "async";
    image.fetchPriority = "low";
    image.onload = image.onerror = () => {
      activePreloads.delete(image);
      resolve();
    };
    image.src = url;
  });
}

async function preloadInPairs(urls) {
  for (let index = 0; index < urls.length; index += 2) {
    await Promise.all(urls.slice(index, index + 2).map(preloadImage));
  }
}

async function preloadLatestNewArrivals() {
  if (connectionIsTooSlow()) return;

  const cached = getCachedGalleryData();
  if (cached) {
    await preloadInPairs(latestNewArrivalUrls(cached));
  }

  try {
    const fresh = await fetchFreshGalleryData();
    await preloadInPairs(latestNewArrivalUrls(fresh));
  } catch (_) {}
}

async function startPreloading() {
  if (connectionIsTooSlow()) return;

  const cached = getCachedGalleryData();
  if (cached) {
    await preloadInPairs(imageUrls(cached));
  }

  try {
    const fresh = await fetchFreshGalleryData();
    await preloadInPairs(imageUrls(fresh));
  } catch (_) {
    // Förladdningen är en bonus. Sidorna hämtar själva bilderna vid behov.
  }
}

function schedulePreloading() {
  const animationWasActive =
    document.documentElement.classList.contains("star-intro-active");
  let pageLoaded = document.readyState === "complete";
  let introFinished = !animationWasActive;
  let remainingStarted = false;

  if (animationWasActive) {
    window.setTimeout(preloadLatestNewArrivals, 350);
  }

  const begin = () => {
    if (!pageLoaded || !introFinished || remainingStarted) return;
    remainingStarted = true;
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => startPreloading(), { timeout: 2500 });
    } else {
      window.setTimeout(startPreloading, 800);
    }
  };

  window.addEventListener("c13-intro-finished", () => {
    introFinished = true;
    begin();
  }, { once: true });

  if (!pageLoaded) {
    window.addEventListener("load", () => {
      pageLoaded = true;
      if (!document.documentElement.classList.contains("star-intro-active")) {
        introFinished = true;
      }
      begin();
    }, { once: true });
  }

  begin();
}

schedulePreloading();
