import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const list = document.getElementById("oppettider-lista");

const days = [
  ["Måndag", "monday"],
  ["Tisdag", "tuesday"],
  ["Onsdag", "wednesday"],
  ["Torsdag", "thursday"],
  ["Fredag", "friday"],
  ["Lördag", "saturday"],
  ["Söndag", "sunday"]
];

function renderRow(dayName, values = {}) {
  const row = document.createElement("div");
  row.className = "oppettider-rad";

  const day = document.createElement("span");
  day.className = "oppettider-dag";
  day.textContent = dayName;

  const time = document.createElement("span");
  time.className = "oppettider-tid";

  if (values.closed === true) {
    time.textContent = "Stängt";
  } else if (values.open && values.close) {
    time.textContent = `${values.open}–${values.close}`;
  } else {
    time.textContent = "Ej angivet";
  }

  row.append(day, time);
  return row;
}

async function loadOpeningHours() {
  if (!list) return;

  list.innerHTML = "<p>Hämtar öppettider...</p>";

  try {
    const snapshot = await getDoc(doc(db, "settings", "openingHours"));

    if (!snapshot.exists()) {
      list.innerHTML = "<p>Inga öppettider har lagts in ännu.</p>";
      return;
    }

    const data = snapshot.data();
    const savedDays = data.days || {};

    list.innerHTML = "";
    days.forEach(([name, key]) => list.appendChild(renderRow(name, savedDays[key])));
  } catch (error) {
    console.error("Kunde inte hämta öppettider:", error);
    list.innerHTML = "<p>Öppettiderna kunde inte hämtas just nu.</p>";
  }
}

loadOpeningHours();
