import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
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

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

const storeStatus = document.getElementById("store-status");
const openingStatusText = document.getElementById("opening-status-text");
const informationDivider = document.getElementById("information-divider");
const informationMessage = document.getElementById("information-message");
const informationMessageText = document.getElementById("information-message-text");
const newArrivalsDivider = document.getElementById("new-arrivals-divider");
const newArrivalsNotice = document.getElementById("new-arrivals-notice");
const newArrivalsNoticeText = document.getElementById("new-arrivals-notice-text");

const PROJECT_ID = "container13-87c1a";
const API_KEY = "AIzaSyDDWaTS_Yyo5X-skYiJ5nQYX5Jc5ZSa1tw";
const NEW_ARRIVAL_WINDOW_HOURS = 48;

const dayOrder = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
];

const dayNames = {
  sunday: "söndag",
  monday: "måndag",
  tuesday: "tisdag",
  wednesday: "onsdag",
  thursday: "torsdag",
  friday: "fredag",
  saturday: "lördag"
};

let savedOpeningHours = null;
let savedSpecialHours = {};

function timeToMinutes(time) {
  if (typeof time !== "string" || !/^\d{2}:\d{2}$/.test(time)) {
    return null;
  }

  const [hours, minutes] = time.split(":").map(Number);
  return (hours * 60) + minutes;
}

function getSwedishDateParts() {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(new Date());

  const values = {};

  for (const part of parts) {
    values[part.type] = part.value;
  }

  const weekdayMap = {
    söndag: "sunday",
    måndag: "monday",
    tisdag: "tuesday",
    onsdag: "wednesday",
    torsdag: "thursday",
    fredag: "friday",
    lördag: "saturday"
  };

  const dateParts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const dateValues = {};
  for (const part of dateParts) dateValues[part.type] = part.value;
  return {
    dayId: weekdayMap[(values.weekday || "").toLowerCase()],
    currentMinutes: (Number(values.hour) * 60) + Number(values.minute),
    dateKey: `${dateValues.year}-${dateValues.month}-${dateValues.day}`
  };
}

function dateKeyWithOffset(dateKey, offset) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + offset, 12));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,"0")}-${String(date.getUTCDate()).padStart(2,"0")}`;
}

function weekdayIdForDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return dayOrder[new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay()];
}

function effectiveHoursForDate(days, dateKey) {
  return savedSpecialHours[dateKey] || days[weekdayIdForDateKey(dateKey)] || null;
}

function findNextOpening(days, currentDateKey) {
  for (let offset = 1; offset <= 14; offset += 1) {
    const dateKey = dateKeyWithOffset(currentDateKey, offset);
    const values = effectiveHoursForDate(days, dateKey);
    if (values && values.closed !== true && values.open) {
      return { dateKey, dayId: weekdayIdForDateKey(dateKey), open: values.open };
    }
  }
  return null;
}

function createOpeningStatus(days) {
  const { currentMinutes, dateKey } = getSwedishDateParts();
  const today = effectiveHoursForDate(days, dateKey);

  if (today && today.closed !== true && today.open && today.close) {
    const openMinutes = timeToMinutes(today.open);
    const closeMinutes = timeToMinutes(today.close);
    if (openMinutes !== null && closeMinutes !== null) {
      if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
        return { isOpen: true, text: `Öppet nu · stänger ${today.close}` };
      }
      if (currentMinutes < openMinutes) {
        return { isOpen: false, text: `Stängt · öppnar idag ${today.open}` };
      }
    }
  }

  const nextOpening = findNextOpening(days, dateKey);
  if (nextOpening) {
    return { isOpen: false, text: `Stängt · öppnar ${dayNames[nextOpening.dayId]} ${nextOpening.open}` };
  }
  return { isOpen: false, text: "Stängt" };
}

function renderOpeningStatus(days) {
  const status = createOpeningStatus(days);

  openingStatusText.textContent = status.text;
  storeStatus.classList.toggle("ar-oppen", status.isOpen);
  storeStatus.classList.toggle("ar-stangd", !status.isOpen);
  storeStatus.classList.add("synlig");
}

function renderInformationBar(data) {
  const enabled = data && data.enabled === true;
  const message = data && typeof data.message === "string" ? data.message.trim() : "";
  const shouldShow = enabled && message.length > 0;

  informationMessage.classList.toggle("synlig", shouldShow);
  informationDivider.hidden = !shouldShow;
  informationMessageText.textContent = shouldShow ? message : "";
}


function firestoreValue(value) {
  if (!value || typeof value !== "object") return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("timestampValue" in value) return value.timestampValue;
  if (value.mapValue) return firestoreFields(value.mapValue.fields || {});
  if (value.arrayValue) return (value.arrayValue.values || []).map(firestoreValue);
  return null;
}

function firestoreFields(source) {
  const result = {};
  Object.entries(source || {}).forEach(([key, value]) => {
    result[key] = firestoreValue(value);
  });
  return result;
}

function galleryCategory(item) {
  return String(item.category || item.type || item.section || "").trim().toLowerCase();
}

function galleryImageUrl(item) {
  return String(item.imageUrl || item.url || item.downloadURL || item.downloadUrl || "").trim();
}

function galleryDate(item) {
  const raw = item.createdAt || item.uploadedAt || item.date || item.documentCreatedAt || "";
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function renderNewArrivalsNotice(count) {
  if (!newArrivalsNotice || !newArrivalsNoticeText || !newArrivalsDivider) return;

  const shouldShow = count > 0;
  newArrivalsNotice.hidden = !shouldShow;
  newArrivalsNotice.classList.toggle("synlig", shouldShow);
  newArrivalsDivider.hidden = !shouldShow;

  if (!shouldShow) {
    newArrivalsNoticeText.textContent = "";
    return;
  }

  newArrivalsNoticeText.textContent = count === 1
    ? "1 nytt plagg har kommit in – se nyinkommet"
    : `${count} nya plagg har kommit in – se nyinkommet`;
}

async function loadNewArrivalsNotice() {
  if (!newArrivalsNotice) return;

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/gallery?pageSize=100&key=${API_KEY}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Firestore svarade ${response.status}`);

    const json = await response.json();
    const cutoff = Date.now() - (NEW_ARRIVAL_WINDOW_HOURS * 60 * 60 * 1000);
    const count = (json.documents || [])
      .map((document) => ({
        documentCreatedAt: document.createTime || "",
        ...firestoreFields(document.fields || {})
      }))
      .filter((item) => galleryCategory(item) === "nyinkommet" && galleryImageUrl(item))
      .filter((item) => {
        const date = galleryDate(item);
        return date && date.getTime() >= cutoff;
      }).length;

    renderNewArrivalsNotice(count);
  } catch (error) {
    console.error("Kunde inte hämta notisen om nya plagg:", error);
    renderNewArrivalsNotice(0);
  }
}

async function loadStatusBar() {
  try {
    const [openingHoursSnapshot, informationSnapshot, specialHoursSnapshot] = await Promise.all([
      getDoc(doc(database, "settings", "openingHours")),
      getDoc(doc(database, "settings", "informationBar")),
      getDoc(doc(database, "settings", "specialOpeningHours"))
    ]);

    savedSpecialHours = specialHoursSnapshot.exists()
      ? (specialHoursSnapshot.data().entries || {})
      : {};

    if (openingHoursSnapshot.exists()) {
      savedOpeningHours = openingHoursSnapshot.data().days || {};
      renderOpeningStatus(savedOpeningHours);
    } else {
      openingStatusText.textContent = "Öppettider saknas";
      storeStatus.classList.add("synlig", "ar-stangd");
    }

    renderInformationBar(
      informationSnapshot.exists() ? informationSnapshot.data() : null
    );
  } catch (error) {
    console.error("Kunde inte hämta statusraden:", error);
    openingStatusText.textContent = "Se aktuella öppettider på kontaktsidan";
    storeStatus.classList.add("synlig", "ar-stangd");
  }
}

if (storeStatus && openingStatusText) {
  loadStatusBar();
  loadNewArrivalsNotice();

  setInterval(() => {
    if (savedOpeningHours) {
      renderOpeningStatus(savedOpeningHours);
    }
  }, 60000);
}
