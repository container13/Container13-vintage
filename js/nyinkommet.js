// Nyinkommet galleri

const nyGallery = document.getElementById("nyGallery");

if (nyGallery) {


const bilder = [

"vara1.png",
"vara2.png"

];


bilder.forEach((bild,index)=>{


const img = document.createElement("img");

img.src = "bilder/nyinkommet/" + bild;

img.alt = "Nyinkommet Container 13";

img.dataset.index = index;

nyGallery.appendChild(img);


});



const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");

const closeBtn = document.getElementById("close");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");


let aktuellBild = 0;
let startX = 0;



// Visa bild

function visaBild(index){

    aktuellBild = index;

    lightboxImage.src = "bilder/nyinkommet/" + bilder[index];

    lightbox.style.display = "flex";

    setTimeout(()=>{

        lightbox.classList.add("show");

    },10);

}



// Stäng bild

function stangBild(){

    lightbox.classList.remove("show");

    setTimeout(()=>{

        lightbox.style.display = "none";

    },200);

}



// Klick på bild

nyGallery.addEventListener("click",function(e){


if(e.target.tagName==="IMG"){

    visaBild(Number(e.target.dataset.index));

}


});



// X

closeBtn.onclick=function(){

stangBild();

};



// Klick utanför

lightbox.addEventListener("click",function(e){

if(e.target===lightbox){

    stangBild();

}

});



// Nästa

nextBtn.onclick=function(){


aktuellBild++;


if(aktuellBild>=bilder.length){

    aktuellBild=0;

}


visaBild(aktuellBild);


};



// Föregående

prevBtn.onclick=function(){


aktuellBild--;


if(aktuellBild<0){

    aktuellBild=bilder.length-1;

}


visaBild(aktuellBild);


};



// Tangentbord

document.addEventListener("keydown",function(e){


if(lightbox.style.display==="flex"){


if(e.key==="Escape"){

    stangBild();

}


if(e.key==="ArrowRight"){

    nextBtn.click();

}


if(e.key==="ArrowLeft"){

    prevBtn.click();

}


}


});



// Svep mobil

lightbox.addEventListener("touchstart",function(e){

startX=e.changedTouches[0].screenX;

});



lightbox.addEventListener("touchend",function(e){


let slutX=e.changedTouches[0].screenX;


if(startX-slutX>50){

    nextBtn.click();

}



if(slutX-startX>50){

    prevBtn.click();

}



});


}