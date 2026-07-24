import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const gallery =
  document.getElementById("gallery");

const lightbox =
  document.getElementById("lightbox");

const lightboxImage =
  document.getElementById("lightboxImage");

const closeButton =
  document.getElementById("close");

const previousButton =
  document.querySelector(".prev");

const nextButton =
  document.querySelector(".next");


let galleryImages = [];
let currentImageIndex = 0;
let touchStartX = 0;


/*
  Gör om Firestores createdAt-värde
  till ett tal som kan sorteras.
*/
function getCreatedTime(item) {
  const createdAt = item.createdAt;

  if (
    createdAt &&
    typeof createdAt.toMillis === "function"
  ) {
    return createdAt.toMillis();
  }

  if (
    createdAt &&
    typeof createdAt.seconds === "number"
  ) {
    return createdAt.seconds * 1000;
  }

  return 0;
}


/*
  Visar aktuell bild i lightboxen.
*/
function showCurrentImage() {
  const item =
    galleryImages[currentImageIndex];

  if (!item || !lightboxImage) {
    return;
  }

  lightboxImage.src = item.imageUrl;
  lightboxImage.alt =
    item.title || "Bild från Container 13 Vintage";
}


/*
  Öppnar lightboxen.
*/
function openLightbox(index) {
  if (
    !lightbox ||
    galleryImages.length === 0
  ) {
    return;
  }

  currentImageIndex = index;

  showCurrentImage();

  lightbox.style.display = "flex";

  requestAnimationFrame(() => {
    lightbox.classList.add("show");
    lightbox.classList.add("active");
  });

  lightbox.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow = "hidden";
}


/*
  Stänger lightboxen.
*/
function closeLightbox() {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("show");
  lightbox.classList.remove("active");

  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow = "";

  setTimeout(() => {
    lightbox.style.display = "none";

    if (lightboxImage) {
      lightboxImage.removeAttribute("src");
    }
  }, 200);
}


/*
  Visar föregående bild.
*/
function showPreviousImage() {
  if (galleryImages.length === 0) {
    return;
  }

  currentImageIndex =
    (
      currentImageIndex -
      1 +
      galleryImages.length
    ) % galleryImages.length;

  showCurrentImage();
}


/*
  Visar nästa bild.
*/
function showNextImage() {
  if (galleryImages.length === 0) {
    return;
  }

  currentImageIndex =
    (
      currentImageIndex + 1
    ) % galleryImages.length;

  showCurrentImage();
}


/*
  Skapar bilderna på sidan.
*/
function renderGallery(items) {
  gallery.innerHTML = "";

  galleryImages = items;

  if (galleryImages.length === 0) {
    gallery.innerHTML = `
      <p class="gallery-status">
        Det finns inga bilder i galleriet ännu.
      </p>
    `;

    return;
  }

  galleryImages.forEach((item, index) => {
    const image =
      document.createElement("img");

    image.src = item.imageUrl;

    image.alt =
      item.title ||
      "Bild från Container 13 Vintage";

    image.loading = "lazy";

    image.dataset.index =
      String(index);

    image.tabIndex = 0;

    image.addEventListener(
      "click",
      () => {
        openLightbox(index);
      }
    );

    image.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          openLightbox(index);
        }
      }
    );

    image.addEventListener(
      "error",
      () => {
        console.error(
          "Bilden kunde inte visas:",
          item.imageUrl
        );

        image.classList.add(
          "gallery-image-error"
        );
      }
    );

    gallery.appendChild(image);
  });
}


/*
  Hämtar alla galleribilder från Firestore.
*/
async function loadGallery() {
  if (!gallery) {
    return;
  }

  gallery.innerHTML = `
    <p class="gallery-status">
      Hämtar bilder...
    </p>
  `;

  try {
    const snapshot =
      await getDocs(
        collection(db, "gallery")
      );

    const items =
      snapshot.docs
        .map((galleryDocument) => ({
          id: galleryDocument.id,
          ...galleryDocument.data()
        }))
        .filter((item) => {
          return (
            item.category === "galleri" &&
            typeof item.imageUrl === "string" &&
            item.imageUrl.trim() !== ""
          );
        })
        .sort((a, b) => {
          return (
            getCreatedTime(b) -
            getCreatedTime(a)
          );
        });

    renderGallery(items);
  } catch (error) {
    console.error(
      "Kunde inte hämta galleriet:",
      error
    );

    gallery.innerHTML = `
      <p class="gallery-status">
        Bilderna kunde inte hämtas just nu.
      </p>
    `;
  }
}


closeButton?.addEventListener(
  "click",
  closeLightbox
);

previousButton?.addEventListener(
  "click",
  (event) => {
    event.stopPropagation();
    showPreviousImage();
  }
);

nextButton?.addEventListener(
  "click",
  (event) => {
    event.stopPropagation();
    showNextImage();
  }
);

lightboxImage?.addEventListener(
  "click",
  (event) => {
    event.stopPropagation();
  }
);

lightbox?.addEventListener(
  "click",
  (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  }
);

document.addEventListener(
  "keydown",
  (event) => {
    if (
      !lightbox ||
      (
        lightbox.style.display !== "flex" &&
        !lightbox.classList.contains("active")
      )
    ) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showPreviousImage();
    }

    if (event.key === "ArrowRight") {
      showNextImage();
    }
  }
);

lightbox?.addEventListener(
  "touchstart",
  (event) => {
    touchStartX =
      event.changedTouches[0].screenX;
  },
  {
    passive: true
  }
);

lightbox?.addEventListener(
  "touchend",
  (event) => {
    const touchEndX =
      event.changedTouches[0].screenX;

    if (
      touchStartX - touchEndX >
      50
    ) {
      showNextImage();
    }

    if (
      touchEndX - touchStartX >
      50
    ) {
      showPreviousImage();
    }
  },
  {
    passive: true
  }
);


loadGallery();