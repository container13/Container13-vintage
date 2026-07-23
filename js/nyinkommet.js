import { db, storage } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
    ref,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";


document.addEventListener("DOMContentLoaded", () => {
    loadNyinkommet();
});


async function loadNyinkommet() {

    const gallery = document.getElementById("nyGallery");

    if (!gallery) {
        console.error('Elementet "nyGallery" saknas.');
        return;
    }

    gallery.innerHTML = "<p>Hämtar bilder från Firebase...</p>";

    try {

        const snapshot = await getDocs(
            collection(db, "gallery")
        );

        let images = snapshot.docs
            .map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter((item) => item.category === "nyinkommet");


        if (images.length === 0) {

            gallery.innerHTML =
                `<p>Firestore svarade, men inget dokument har category = nyinkommet.</p>`;

            return;
        }


        images.sort((a, b) => {

            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;

            return timeB - timeA;
        });


        images = images.slice(0, 4);

        gallery.innerHTML = "";


        for (const item of images) {

            if (!item.imageUrl) {

                const message = document.createElement("p");

                message.textContent =
                    `Dokumentet ${item.id} saknar imageUrl.`;

                gallery.appendChild(message);

                continue;
            }


            let imageUrl = item.imageUrl;


            try {

                if (imageUrl.startsWith("gs://")) {

                    const storageReference = ref(
                        storage,
                        imageUrl
                    );

                    imageUrl = await getDownloadURL(
                        storageReference
                    );
                }

            } catch (storageError) {

                const message = document.createElement("p");

                message.textContent =
                    `Storage-fel: ${storageError.message}`;

                gallery.appendChild(message);

                console.error(storageError);

                continue;
            }


            const image = document.createElement("img");

            image.src = imageUrl;
            image.alt = "Nyinkommet";
            image.loading = "lazy";


            image.addEventListener("load", () => {

                console.log(
                    "Bilden laddades:",
                    imageUrl
                );
            });


            image.addEventListener("error", () => {

                image.remove();

                const message = document.createElement("p");

                message.textContent =
                    `Bildadressen hittades, men bilden kunde inte visas: ${imageUrl}`;

                gallery.appendChild(message);

                console.error(
                    "Bilden kunde inte visas:",
                    imageUrl
                );
            });


            gallery.appendChild(image);
        }

    } catch (error) {

        console.error(error);

        gallery.innerHTML =
            `<p>Firestore-fel: ${error.message}</p>`;
    }
}