import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeButton = document.getElementById("close");
const previousButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");

let images = [];
let currentIndex = 0;
let touchStartX = 0;

function createdTime(item) {
  const value = item.createdAt;
  if (value && typeof value.toMillis === "function") return value.toMillis();
  if (value && typeof value.seconds === "number") return value.seconds * 1000;
  return 0;
}

function showCurrentImage() {
  const item = images[currentIndex];
  if (!item || !lightboxImage) return;
  lightboxImage.src = item.imageUrl;
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

  if (!images.length) {
    gallery.innerHTML = '<p class="gallery-status">Det finns inga butiksbilder ännu.</p>';
    return;
  }

  images.forEach((item, index) => {
    const image = document.createElement("img");
    image.src = item.imageUrl;
    image.alt = item.title || "Bild från Container 13 Vintage";
    image.loading = "lazy";
    image.tabIndex = 0;
    image.addEventListener("click", () => openLightbox(index));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });
    image.addEventListener("error", () => image.remove());
    gallery.appendChild(image);
  });
}

async function loadGallery() {
  if (!gallery) return;
  gallery.innerHTML = '<p class="gallery-status">Hämtar bilder...</p>';

  try {
    const snapshot = await getDocs(collection(db, "gallery"));
    const items = snapshot.docs
      .map((document) => ({ id: document.id, ...document.data() }))
      .filter((item) => item.category === "galleri" && typeof item.imageUrl === "string" && item.imageUrl.trim())
      .sort((a, b) => createdTime(b) - createdTime(a));
    render(items);
  } catch (error) {
    console.error("Kunde inte hämta galleriet:", error);
    gallery.innerHTML = '<p class="gallery-status">Bilderna kunde inte hämtas just nu.</p>';
  }
}

closeButton?.addEventListener("click", closeLightbox);
previousButton?.addEventListener("click", (event) => { event.stopPropagation(); previousImage(); });
nextButton?.addEventListener("click", (event) => { event.stopPropagation(); nextImage(); });
lightboxImage?.addEventListener("click", (event) => event.stopPropagation());
lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("active")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") previousImage();
  if (event.key === "ArrowRight") nextImage();
});
lightbox?.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
lightbox?.addEventListener("touchend", (event) => {
  const endX = event.changedTouches[0].screenX;
  if (touchStartX - endX > 50) nextImage();
  if (endX - touchStartX > 50) previousImage();
}, { passive: true });

loadGallery();
