import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { doc, getDoc, getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDWaTS_Yyo5X-skYiJ5nQYX5Jc5ZSa1tw",
  authDomain: "container13-87c1a.firebaseapp.com",
  projectId: "container13-87c1a",
  storageBucket: "container13-87c1a.firebasestorage.app",
  messagingSenderId: "936924614149",
  appId: "1:936924614149:web:2b74d823951538fa2b166c",
  measurementId: "G-PSHRGK4JJC"
};

const defaults = {
  storeName: "Container 13 Vintage", city: "Hudiksvall", address: "Marknadsgatan 1A",
  postalCity: "824 32 Hudiksvall", phone: "072-527 02 35", email: "alvinbrisvag@outlook.com",
  facebook: "https://www.facebook.com/61590920005705", instagram: "https://www.instagram.com/container.13",
  tiktok: "https://www.tiktok.com/@container.13", copyright: "© 2026 Container 13 Vintage"
};

function text(id, value) { const el = document.getElementById(id); if (el) el.textContent = value || ""; }
function link(id, value) { const el = document.getElementById(id); if (!el) return; if (value) { el.href = value; el.hidden = false; } else el.hidden = true; }

export async function applySiteSettings() {
  try {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    const snapshot = await getDoc(doc(getFirestore(app), "settings", "site"));
    const data = { ...defaults, ...(snapshot.exists() ? snapshot.data() : {}) };
    text("site-store-name", data.storeName); text("site-city", data.city); text("site-address", data.address);
    text("site-postal-city", data.postalCity); text("site-phone", data.phone); text("site-email", data.email);
    text("site-copyright", data.copyright);
    const phone = document.getElementById("site-phone-link"); if (phone) phone.href = `tel:${String(data.phone || "").replace(/[^+\d]/g, "")}`;
    const email = document.getElementById("site-email-link"); if (email) email.href = `mailto:${data.email || ""}`;
    link("site-facebook", data.facebook); link("site-instagram", data.instagram); link("site-tiktok", data.tiktok);
    const map = document.getElementById("site-map"); if (map) map.src = `https://www.google.com/maps?q=${encodeURIComponent(`${data.address} ${data.city}`)}&output=embed`;
    const directions = document.getElementById("site-directions"); if (directions) directions.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${data.address} ${data.city}`)}`;
  } catch (error) { console.warn("Kunde inte hämta webbplatsens inställningar:", error); }
}
