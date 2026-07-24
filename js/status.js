import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { collection, doc, getDoc, getDocs, getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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
const newArrivalsNotice = document.getElementById("new-arrivals-notice");
const newArrivalsNoticeText = document.getElementById("new-arrivals-notice-text");

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

  return {
    dayId: weekdayMap[(values.weekday || "").toLowerCase()],
    currentMinutes: (Number(values.hour) * 60) + Number(values.minute)
  };
}

function findNextOpening(days, currentDayId) {
  const currentIndex = dayOrder.indexOf(currentDayId);

  for (let offset = 1; offset <= 7; offset += 1) {
    const dayId = dayOrder[(currentIndex + offset) % 7];
    const values = days[dayId];

    if (values && values.closed !== true && values.open) {
      return { dayId, open: values.open };
    }
  }

  return null;
}

function createOpeningStatus(days) {
  const { dayId, currentMinutes } = getSwedishDateParts();
  const today = days[dayId];

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

  const nextOpening = findNextOpening(days, dayId);

  if (nextOpening) {
    return {
      isOpen: false,
      text: `Stängt · öppnar ${dayNames[nextOpening.dayId]} ${nextOpening.open}`
    };
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

function galleryValue(item, keys) {
  for (const key of keys) {
    if (item && item[key] !== undefined && item[key] !== null) {
      return item[key];
    }
  }
  return null;
}

function galleryCategory(item) {
  return String(galleryValue(item, ["category", "type", "section"]) || "")
    .trim()
    .toLowerCase();
}

function galleryDate(item, documentDate) {
  const raw = galleryValue(item, ["createdAt", "uploadedAt", "date"]);

  if (raw && typeof raw.toDate === "function") {
    return raw.toDate();
  }

  if (raw && typeof raw.seconds === "number") {
    return new Date(raw.seconds * 1000);
  }

  const parsed = new Date(raw || documentDate || "");
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function loadNewArrivalsNotice() {
  if (!newArrivalsNotice || !newArrivalsNoticeText) {
    return;
  }

  try {
    const snapshot = await getDocs(collection(database, "gallery"));
    const now = Date.now();
    const fortyEightHours = 48 * 60 * 60 * 1000;

    const recentCount = snapshot.docs.reduce((count, galleryDocument) => {
      const data = galleryDocument.data();
      const date = galleryDate(data, galleryDocument.createTime);
      const isNewArrival = galleryCategory(data) === "nyinkommet";
      const isRecent = date && now - date.getTime() >= 0 && now - date.getTime() <= fortyEightHours;

      return count + (isNewArrival && isRecent ? 1 : 0);
    }, 0);

    if (recentCount === 0) {
      newArrivalsNotice.hidden = true;
      return;
    }

    newArrivalsNoticeText.textContent = recentCount === 1
      ? "Ett nytt plagg har kommit in – se nyinkommet"
      : `${recentCount} nya plagg har kommit in – se nyinkommet`;
    newArrivalsNotice.hidden = false;
  } catch (error) {
    console.error("Kunde inte hämta notisen om nya plagg:", error);
    newArrivalsNotice.hidden = true;
  }
}

async function loadStatusBar() {
  try {
    const [openingHoursSnapshot, informationSnapshot] = await Promise.all([
      getDoc(doc(database, "settings", "openingHours")),
      getDoc(doc(database, "settings", "informationBar"))
    ]);

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
