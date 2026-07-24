(() => {
  "use strict";

  const PROJECT_ID = "container13-87c1a";
  const API_KEY = "AIzaSyDDWaTS_Yyo5X-skYiJ5nQYX5Jc5ZSa1tw";

  const gallery = document.getElementById("gallery");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeButton = document.getElementById("close");
  const previousButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");

  let images = [];
  let currentIndex = 0;
  let touchStartX = 0;

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
    const result = {};
    Object.entries(fields || {}).forEach(([key, value]) => {
      result[key] = firestoreValue(value);
    });
    return result;
  }

  function imageUrl(item) {
    return item.imageUrl || item.url || item.downloadURL || item.downloadUrl || "";
  }

  function category(item) {
    return String(item.category || item.type || item.section || "").toLowerCase();
  }

  function createdTime(item) {
    const value = item.createdAt || item.uploadedAt || item.date || "";
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function showCurrentImage() {
    const item = images[currentIndex];
    if (!item || !lightboxImage) return;
    lightboxImage.src = imageUrl(item);
    lightboxImage.alt = item.title || "Bild från Container 13 Vintage";
  }

  function openLightbox(index) {
    if (!lightbox || !images.length) return;
    currentIndex = index;
    showCurrentImage();
    lightbox.style.display = "flex";
    requestAnimationFrame(() => lightbox.classList.add("show", "active"));
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("show", "active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => {
      lightbox.style.display = "none";
      lightboxImage?.removeAttribute("src");
    }, 200);
  }

  function previousImage() {
    if (!images.length) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showCurrentImage();
  }

  function nextImage() {
    if (!images.length) return;
    currentIndex = (currentIndex + 1) % images.length;
    showCurrentImage();
  }

  function render(items) {
    if (!gallery) return;
    images = items;
    gallery.innerHTML = "";
    gallery.setAttribute("aria-busy", "false");

    if (!images.length) {
      gallery.innerHTML = '<p class="gallery-status">Det finns inga butiksbilder ännu.</p>';
      return;
    }

    images.forEach((item, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "gallery-image-shell image-card-loading";

      const image = document.createElement("img");
      image.src = imageUrl(item);
      image.alt = item.title || "Bild från Container 13 Vintage";
      image.loading = "lazy";
      image.decoding = "async";
      image.tabIndex = 0;

      image.addEventListener("load", () => {
        wrapper.classList.remove("image-card-loading");
        wrapper.classList.add("image-card-loaded");
      });

      image.addEventListener("click", () => openLightbox(index));
      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(index);
        }
      });

      image.addEventListener("error", () => wrapper.remove());
      wrapper.appendChild(image);
      gallery.appendChild(wrapper);
    });
  }

  async function loadGallery() {
    if (!gallery) return;
    gallery.innerHTML = '<p class="gallery-status">Hämtar bilder...</p>';

    try {
      const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/gallery?pageSize=100&key=${API_KEY}`;
      const response = await fetch(url, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Firestore svarade ${response.status}`);
      }

      const data = await response.json();
      const allItems = (data.documents || []).map((document) => ({
        id: document.name?.split("/").pop() || "",
        ...firestoreFields(document.fields || {})
      }));

      const galleryItems = allItems
        .filter((item) => category(item) === "galleri" && imageUrl(item))
        .sort((a, b) => createdTime(b) - createdTime(a));

      render(galleryItems);
    } catch (error) {
      console.error("Kunde inte hämta galleriet:", error);
      gallery.setAttribute("aria-busy", "false");
      gallery.innerHTML = `<p class="gallery-status">Bilderna kunde inte hämtas just nu (${error.message}).</p>`;
    }
  }

  closeButton?.addEventListener("click", closeLightbox);
  previousButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    previousImage();
  });
  nextButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    nextImage();
  });
  lightboxImage?.addEventListener("click", (event) => event.stopPropagation());
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("active")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") previousImage();
    if (event.key === "ArrowRight") nextImage();
  });
  lightbox?.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });
  lightbox?.addEventListener("touchend", (event) => {
    const endX = event.changedTouches[0].screenX;
    if (touchStartX - endX > 50) nextImage();
    if (endX - touchStartX > 50) previousImage();
  }, { passive: true });

  loadGallery();
})();
