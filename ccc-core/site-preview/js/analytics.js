import { db } from "./firebase.js";
import {
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const VISITOR_KEY = "container13_visitor_id";
const SESSION_KEY = "container13_session_id";

function randomId(prefix) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function storedId(key, prefix, storage) {
  try {
    let value = storage.getItem(key);
    if (!value) {
      value = randomId(prefix);
      storage.setItem(key, value);
    }
    return value;
  } catch {
    return randomId(prefix);
  }
}

function stockholmDate() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function pageName() {
  const file = location.pathname.split("/").filter(Boolean).pop() || "index.html";
  const names = {
    "index.html": "Hem",
    "galleri.html": "Butiken",
    "nyinkommet.html": "Nyinkommet",
    "omoss.html": "Om oss",
    "kontakt.html": "Kontakt",
    "hittahit.html": "Hitta hit"
  };
  return names[file] || file.replace(/\.html$/i, "") || "Hem";
}

function deviceType() {
  const width = Math.min(screen.width || innerWidth, innerWidth || screen.width);
  if (width <= 767) return "mobil";
  if (width <= 1100) return "surfplatta";
  return "dator";
}

function runsAsPwa() {
  return matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone === true;
}

async function registerPageView() {
  if (navigator.doNotTrack === "1") return;

  const visitorId = storedId(VISITOR_KEY, "visitor", localStorage);
  const sessionId = storedId(SESSION_KEY, "session", sessionStorage);

  try {
    await addDoc(collection(db, "analytics_events"), {
      visitorId,
      sessionId,
      date: stockholmDate(),
      page: pageName(),
      path: location.pathname.slice(0, 120),
      deviceType: deviceType(),
      pwa: runsAsPwa(),
      createdAt: serverTimestamp()
    });
  } catch (error) {
    // Statistik får aldrig störa webbplatsens vanliga funktioner.
    console.warn("Besöksstatistik kunde inte registreras.", error);
  }
}

registerPageView();
