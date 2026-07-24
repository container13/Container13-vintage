(() => {
  "use strict";

  const PROJECT_ID = "container13-87c1a";
  const API_KEY = "AIzaSyDDWaTS_Yyo5X-skYiJ5nQYX5Jc5ZSa1tw";
  const gallery = document.getElementById("nyGallery");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeButton = document.getElementById("close");
  const previousButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  let images = [];
  let currentIndex = 0;

  function val(value) {
    if (!value || typeof value !== "object") return null;
    if ("stringValue" in value) return value.stringValue;
    if ("booleanValue" in value) return value.booleanValue;
    if ("integerValue" in value) return Number(value.integerValue);
    if ("doubleValue" in value) return Number(value.doubleValue);
    if ("timestampValue" in value) return value.timestampValue;
    if (value.mapValue) return fields(value.mapValue.fields || {});
    if (value.arrayValue) return (value.arrayValue.values || []).map(val);
    return null;
  }

  function fields(source) {
    const result = {};
    Object.entries(source || {}).forEach(([key, value]) => result[key] = val(value));
    return result;
  }

  function imageUrl(item) {
    return String(item.imageUrl || item.url || item.downloadURL || item.downloadUrl || "").trim();
  }

  function category(item) {
    return String(item.category || item.type || item.section || "").trim().toLowerCase();
  }

  function itemDate(item) {
    const raw = item.createdAt || item.uploadedAt || item.date || item.documentCreatedAt || "";
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function time(item) {
    return itemDate(item)?.getTime() || 0;
  }

  function relativeDateText(item) {
    const date = itemDate(item);
    if (!date) return "Nyinkommen";

    const today = new Date();
    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const days = Math.max(0, Math.round((startToday - startDate) / 86400000));

    if (days === 0) return "Nyinkommen idag";
    if (days === 1) return "Nyinkommen igår";
    if (days < 7) return `Nyinkommen för ${days} dagar sedan`;

    const options = date.getFullYear() === today.getFullYear()
      ? { day: "numeric", month: "long" }
      : { day: "numeric", month: "long", year: "numeric" };
    return `Nyinkommen ${date.toLocaleDateString("sv-SE", options)}`;
  }

  function showLightboxImage() {
    const item = images[currentIndex];
    if (item && lightboxImage) {
      lightboxImage.src = imageUrl(item);
      lightboxImage.alt = item.title || "Bild från Container 13 Vintage";
    }
  }

  function open(index) {
    if (!lightbox || !images.length) return;
    currentIndex = index;
    showLightboxImage();
    lightbox.style.display = "flex";
    lightbox.classList.add("show", "active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    if (!lightbox) return;
    lightbox.classList.remove("show", "active");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.style.display = "none";
    document.body.style.overflow = "";
  }

  function previous() {
    if (images.length) {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showLightboxImage();
    }
  }

  function next() {
    if (images.length) {
      currentIndex = (currentIndex + 1) % images.length;
      showLightboxImage();
    }
  }

  function render(items) {
    images = items;
    gallery.innerHTML = "";

    if (!items.length) {
      gallery.innerHTML = '<p class="gallery-status">Det finns inga bilder under Nyinkommet ännu.</p>';
      return;
    }

    items.forEach((item, index) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-item nyinkommet-kort image-card-loading";

      const imageButton = document.createElement("button");
      imageButton.className = "nyinkommet-bildknapp";
      imageButton.type = "button";
      imageButton.setAttribute("aria-label", item.title ? `Öppna ${item.title} i stort format` : "Öppna bilden i stort format");
      imageButton.addEventListener("click", () => open(index));

      const img = document.createElement("img");
      img.src = imageUrl(item);
      img.alt = item.title || "Bild från Container 13 Vintage";
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("load", () => {
        figure.classList.remove("image-card-loading");
        figure.classList.add("image-card-loaded");
      });
      img.addEventListener("error", () => figure.remove());

      const caption = document.createElement("figcaption");
      caption.className = "nyinkommet-info";

      const title = String(item.title || "").trim();
      if (title) {
        const heading = document.createElement("p");
        heading.className = "nyinkommet-titel";
        heading.textContent = title;
        caption.appendChild(heading);
      }

      const date = document.createElement("p");
      date.className = "nyinkommet-datum";
      date.textContent = relativeDateText(item);

      imageButton.appendChild(img);
      caption.appendChild(date);
      figure.append(imageButton, caption);
      gallery.appendChild(figure);
    });
  }

  async function load() {
    if (!gallery) return;
    gallery.innerHTML = '<p class="gallery-status">Hämtar bilder...</p>';
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/gallery?pageSize=100&key=${API_KEY}`;
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`Firestore svarade ${response.status}`);
      const json = await response.json();
      const all = (json.documents || []).map((document) => ({
        id: document.name?.split("/").pop() || "",
        documentCreatedAt: document.createTime || "",
        ...fields(document.fields || {})
      }));
      const selected = all
        .filter((item) => category(item) === "nyinkommet" && imageUrl(item))
        .sort((a, b) => time(b) - time(a));
      render(selected);
    } catch (error) {
      console.error(error);
      gallery.innerHTML = `<p class="gallery-status">Bilderna kunde inte hämtas (${error.message}).</p>`;
    }
  }

  closeButton?.addEventListener("click", close);
  previousButton?.addEventListener("click", previous);
  nextButton?.addEventListener("click", next);
  lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) close(); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") previous();
    if (event.key === "ArrowRight") next();
  });

  load();
})();
