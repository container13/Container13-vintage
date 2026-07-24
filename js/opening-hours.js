import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDWaTS_Yyo5X-skYiJ5nQYX5Jc5ZSa1tw",
  authDomain: "container13-87c1a.firebaseapp.com",
  projectId: "container13-87c1a",
  storageBucket: "container13-87c1a.firebasestorage.app",
  messagingSenderId: "936924614149",
  appId: "1:936924614149:web:2b74d823951538fa2b166c",
  measurementId: "G-PSHRGK4JJC"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
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
  time.textContent = values.closed === true
    ? "Stängt"
    : values.open && values.close
      ? `${values.open}–${values.close}`
      : "Ej angivet";

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

    const savedDays = snapshot.data().days || {};
    list.innerHTML = "";
    days.forEach(([name, key]) => list.appendChild(renderRow(name, savedDays[key])));
  } catch (error) {
    console.error("Kunde inte hämta öppettider:", error);
    list.innerHTML = "<p>Öppettiderna kunde inte hämtas just nu.</p>";
  }
}

loadOpeningHours();
