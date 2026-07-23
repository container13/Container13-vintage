import { db, storage } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
  ref,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";


const gallery = document.getElementById("nyGallery");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");

const closeButton = document.getElementById("close");
const previousButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");

let images = [];
let current = 0;



async function getImageUrl(url) {

    if (!url) return "";

    if (url.startsWith("https://")) {
        return url;
    }

    if (url.startsWith("gs://")) {

        const path = url.replace(
            "gs://container13-87c1a.firebasestorage.app/",
            ""
        );

        return await getDownloadURL(
            ref(storage, path)
        );

    }

    return url;

}



function openLightbox(index){

    current=index;

    lightbox.style.display="flex";

    lightboxImage.src=images[index].imageUrl;

}



function closeLightbox(){

    lightbox.style.display="none";

}



async function loadGallery(){

    gallery.innerHTML="<p>Hämtar bilder...</p>";

    try{

        const snapshot=await getDocs(collection(db,"gallery"));

        let docs=snapshot.docs
            .map(doc=>doc.data())
            .filter(item=>item.category==="nyinkommet");

        docs.sort((a,b)=>{

            const ta=a.createdAt?.seconds||0;
            const tb=b.createdAt?.seconds||0;

            return tb-ta;

        });

        docs=docs.slice(0,4);

        for(const item of docs){

            item.imageUrl=await getImageUrl(item.imageUrl);

        }

        images=docs;

        gallery.innerHTML="";

        if(images.length===0){

            gallery.innerHTML="<p>Inga bilder.</p>";
            return;

        }

        images.forEach((item,index)=>{

            const img=document.createElement("img");

            img.src=item.imageUrl;

            img.alt="Nyinkommet";

            img.loading="lazy";

            img.onclick=()=>{

                openLightbox(index);

            };

            gallery.appendChild(img);

        });

    }

    catch(error){

        console.error(error);

        gallery.innerHTML="<p>Kunde inte hämta bilder.</p>";

    }

}



closeButton?.addEventListener("click",closeLightbox);

previousButton?.addEventListener("click",()=>{

    current--;

    if(current<0) current=images.length-1;

    lightboxImage.src=images[current].imageUrl;

});

nextButton?.addEventListener("click",()=>{

    current++;

    if(current>=images.length) current=0;

    lightboxImage.src=images[current].imageUrl;

});


loadGallery();