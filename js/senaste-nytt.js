(() => {
  "use strict";

  const PROJECT_ID = "container13-87c1a";
  const API_KEY = "AIzaSyDDWaTS_Yyo5X-skYiJ5nQYX5Jc5ZSa1tw";
  const grid = document.getElementById("senasteNyttGrid");
  const section = document.getElementById("senaste-nytt");

  if (!grid || !section) return;

  function firestoreValue(value) {
    if (!value || typeof value !== "object") return null;
    if ("stringValue" in value) return value.stringValue;
    if ("booleanValue" in value) return value.booleanValue;
    if ("integerValue" in value) return Number(value.integerValue);
    if ("doubleValue" in value) return Number(value.doubleValue);
    if ("timestampValue" in value) return value.timestampValue;
    if (value.mapValue) return firestoreFields(value.mapValue.fields || {});
    if (value.arrayValue) return (value.arrayValue.values || []).map(firestoreValue);
    return null;
  }

  function firestoreFields(fields) {
    const item = {};
    Object.entries(fields || {}).forEach(([key, value]) => {
      item[key] = firestoreValue(value);
    });
    return item;
  }

  function imageUrl(item) {
    return item.imageUrl || item.url || item.downloadURL || item.downloadUrl || "";
  }

  function category(item) {
    return String(item.category || item.type || item.section || "").toLowerCase();
  }

  function timestamp(item) {
    const value = item.createdAt || item.uploadedAt || item.date || item.documentCreatedAt || "";
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function render(items) {
    grid.innerHTML = "";

    if (!items.length) {
      section.hidden = true;
      return;
    }

    items.forEach((item) => {
      const link = document.createElement("a");
      link.className = "senaste-nytt-kort";
      link.href = "nyinkommet.html";
      link.setAttribute("aria-label", item.title ? `${item.title} – se allt nyinkommet` : "Se allt nyinkommet");

      const image = document.createElement("img");
      image.src = imageUrl(item);
      image.alt = item.title || "Nyinkommet hos Container 13 Vintage";
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => link.remove());

      link.appendChild(image);
      grid.appendChild(link);
    });
  }

  async function loadLatest() {
    try {
      const endpoint = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/gallery?pageSize=100&key=${API_KEY}`;
      const response = await fetch(endpoint, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Firestore svarade ${response.status}`);
      }

      const data = await response.json();
      const items = (data.documents || []).map((document) => ({
        id: document.name?.split("/").pop(),
        documentCreatedAt: document.createTime,
        ...firestoreFields(document.fields || {})
      }));

      const latest = items
        .filter((item) => category(item) === "nyinkommet" && imageUrl(item))
        .sort((a, b) => timestamp(b) - timestamp(a))
        .slice(0, 4);

      render(latest);
    } catch (error) {
      console.error("Kunde inte hämta senaste nyinkommet:", error);
      section.hidden = true;
    }
  }

  loadLatest();
})();
