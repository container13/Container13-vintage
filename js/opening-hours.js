import { db } from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const oppettiderLista =
  document.getElementById("oppettider-lista");


const dagar = [
  {
    namn: "Måndag",
    nycklar: ["monday", "mandag", "måndag"]
  },
  {
    namn: "Tisdag",
    nycklar: ["tuesday", "tisdag"]
  },
  {
    namn: "Onsdag",
    nycklar: ["wednesday", "onsdag"]
  },
  {
    namn: "Torsdag",
    nycklar: ["thursday", "torsdag"]
  },
  {
    namn: "Fredag",
    nycklar: ["friday", "fredag"]
  },
  {
    namn: "Lördag",
    nycklar: ["saturday", "lordag", "lördag"]
  },
  {
    namn: "Söndag",
    nycklar: ["sunday", "sondag", "söndag"]
  }
];


function normaliseraText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}


function hittaDag(data, nycklar) {
  const dataNycklar = Object.keys(data);

  for (const nyckel of nycklar) {
    const hittadNyckel = dataNycklar.find(
      dataNyckel =>
        normaliseraText(dataNyckel) ===
        normaliseraText(nyckel)
    );

    if (hittadNyckel) {
      return data[hittadNyckel];
    }
  }

  return null;
}


function skapaTidsrad(dagNamn, dagData) {
  const rad = document.createElement("div");
  rad.className = "oppettider-rad";

  const dag = document.createElement("span");
  dag.className = "oppettider-dag";
  dag.textContent = dagNamn;

  const tid = document.createElement("span");
  tid.className = "oppettider-tid";


  if (!dagData) {
    tid.textContent = "Ej angivet";
  } else if (typeof dagData === "string") {
    tid.textContent = dagData;
  } else {
    const stangt =
      dagData.closed === true ||
      dagData.stangt === true ||
      dagData.isClosed === true;

    const oppnar =
      dagData.open ||
      dagData.start ||
      dagData.from ||
      dagData.oppnar ||
      dagData.öppnar ||
      "";

    const stanger =
      dagData.close ||
      dagData.end ||
      dagData.to ||
      dagData.stanger ||
      dagData.stänger ||
      "";

    if (stangt) {
      tid.textContent = "Stängt";
    } else if (oppnar && stanger) {
      tid.textContent = `${oppnar}–${stanger}`;
    } else {
      tid.textContent = "Ej angivet";
    }
  }


  rad.appendChild(dag);
  rad.appendChild(tid);

  return rad;
}


async function hamtaOppettider() {
  if (!oppettiderLista) {
    return;
  }

  try {
    const dokumentReferens = doc(
      db,
      "settings",
      "openingHours"
    );

    const dokument = await getDoc(dokumentReferens);


    if (!dokument.exists()) {
      oppettiderLista.innerHTML =
        "<p>Inga öppettider har lagts in ännu.</p>";

      return;
    }


    const dokumentData = dokument.data();

    const oppettiderData =
      dokumentData.hours ||
      dokumentData.openingHours ||
      dokumentData;


    oppettiderLista.innerHTML = "";


    dagar.forEach(dag => {
      const dagData = hittaDag(
        oppettiderData,
        dag.nycklar
      );

      const rad = skapaTidsrad(
        dag.namn,
        dagData
      );

      oppettiderLista.appendChild(rad);
    });

  } catch (error) {
    console.error(
      "Det gick inte att hämta öppettiderna:",
      error
    );

    oppettiderLista.innerHTML =
      "<p>Det gick inte att hämta öppettiderna just nu.</p>";
  }
}


hamtaOppettider();