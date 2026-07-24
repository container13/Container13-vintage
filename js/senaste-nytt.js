(() => {
  "use strict";

  const PROJECT_ID = "container13-87c1a";
  const API_KEY = "AIzaSyDDWaTS_Yyo5X-skYiJ5nQYX5Jc5ZSa1tw";
  const grid = document.getElementById("senasteNyttGrid");
  const section = document.getElementById("senaste-nytt");

  if (!grid || !section) return;

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

  function getImageUrl(item) {
    return String(
      item.imageUrl ||
      item.url ||
      item.downloadURL ||
      item.downloadUrl ||
      ""
    ).trim();
  }

  function getCategory(item) {
    return String(
      item.category || item.type || item.section || ""
    ).trim().toLowerCase();
  }

  function getTime(item) {
    const value =
      item.createdAt ||
      item.uploadedAt ||
      item.date ||
      item.documentCreatedAt ||
      "";

    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function showMessage(text) {
    grid.innerHTML = "";
    const message = document.createElement("p");
    message.className = "senaste-nytt-status";
    message.textContent = text;
    grid.appendChild(message);
  }

  function render(items) {
    grid.innerHTML = "";

    if (!items.length) {
      showMessage("Det finns inga bilder under Nyinkommet ännu.");
      return;
    }

    items.forEach((item) => {
      const link = document.createElement("a");
      link.className = "senaste-nytt-kort";
      link.href = "nyinkommet.html";
      link.setAttribute(
        "aria-label",
        item.title
          ? `${item.title} – se allt nyinkommet`
          : "Se allt nyinkommet"
      );

      const image = document.createElement("img");
      image.src = getImageUrl(item);
      image.alt = item.title || "Nyinkommet hos Container 13 Vintage";
      image.loading = "lazy";
      image.decoding = "async";

      image.addEventListener("error", () => {
        link.remove();
        if (!grid.querySelector(".senaste-nytt-kort")) {
          showMessage("Bilderna kunde inte visas just nu.");
        }
      });

      link.appendChild(image);
      grid.appendChild(link);
    });
  }

  async function loadLatest() {
    showMessage("Hämtar de senaste bilderna...");

    try {
      const endpoint =
        `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
        `/databases/(default)/documents/gallery?pageSize=100&key=${API_KEY}`;

      const response = await fetch(endpoint, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Firestore svarade ${response.status}`);
      }

      const data = await response.json();
      const allItems = (data.documents || []).map((document) => ({
        id: document.name?.split("/").pop() || "",
        documentCreatedAt: document.createTime || "",
        ...fieldsFromFirestore(document.fields || {})
      }));

      const latest = allItems
        .filter((item) =>
          getCategory(item) === "nyinkommet" && getImageUrl(item)
        )
        .sort((a, b) => getTime(b) - getTime(a))
        .slice(0, 4);

      render(latest);
    } catch (error) {
      console.error("Kunde inte hämta senaste nyinkommet:", error);
      showMessage("De senaste bilderna kunde inte hämtas just nu.");
    }
  }

  loadLatest();
})();
