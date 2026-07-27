import { getSiteSettings } from "./site-data.js?v=1.1.0";
import {
  fetchFreshGalleryData,
  getCachedGalleryData
} from "./gallery-data.js?v=1.0.0";
import {
  fetchFreshSettingDocument,
  getCachedSettingDocument
} from "./settings-data.js?v=1.0.0";

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
const DEFAULT_NEW_ARRIVAL_RETENTION_DAYS = 7;

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

function newArrivalsRetention(settings) {
  if (settings && settings.newArrivalsRetentionMode === "manual") {
    return { mode: "manual", days: 0 };
  }

  const parsedDays = Number(settings && settings.newArrivalsRetentionDays);
  const days = Number.isInteger(parsedDays)
    ? Math.min(30, Math.max(1, parsedDays))
    : DEFAULT_NEW_ARRIVAL_RETENTION_DAYS;

  return { mode: "days", days };
}

function isWithinNewArrivalsRetention(item, retention) {
  if (retention.mode === "manual") return true;

  const date = galleryDate(item);
  if (!date) return true;

  return date.getTime() >= Date.now() - (retention.days * 24 * 60 * 60 * 1000);
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

  const settings = await getSiteSettings();
  const retention = newArrivalsRetention(settings);
  const renderGalleryData = (galleryJson) => {
    const count = (galleryJson.documents || [])
      .map((document) => ({
        documentCreatedAt: document.createTime || "",
        ...firestoreFields(document.fields || {})
      }))
      .filter((item) => galleryCategory(item) === "nyinkommet" && galleryImageUrl(item))
      .filter((item) => isWithinNewArrivalsRetention(item, retention))
      .length;

    renderNewArrivalsNotice(count);
  };

  const cached = getCachedGalleryData();
  if (cached) {
    renderGalleryData(cached);
  }

  try {
    const fresh = await fetchFreshGalleryData();
    renderGalleryData(fresh);
  } catch (error) {
    console.error("Kunde inte hämta notisen om nya plagg:", error);
    if (!cached) {
      renderNewArrivalsNotice(0);
    }
  }
}

async function loadStatusBar() {
  const renderDocuments = (openingDocument, informationDocument, specialDocument) => {
    const openingData = openingDocument
      ? firestoreFields(openingDocument.fields || {})
      : null;
    const informationData = informationDocument
      ? firestoreFields(informationDocument.fields || {})
      : null;
    const specialData = specialDocument
      ? firestoreFields(specialDocument.fields || {})
      : null;

    savedSpecialHours = specialData?.entries || {};

    if (openingData) {
      savedOpeningHours = openingData.days || {};
      renderOpeningStatus(savedOpeningHours);
    } else {
      openingStatusText.textContent = "Öppettider saknas";
      storeStatus.classList.add("synlig", "ar-stangd");
    }

    renderInformationBar(informationData);
  };

  const cachedDocuments = [
    getCachedSettingDocument("openingHours"),
    getCachedSettingDocument("informationBar"),
    getCachedSettingDocument("specialOpeningHours")
  ];

  if (cachedDocuments.some(Boolean)) {
    renderDocuments(...cachedDocuments);
  }

  try {
    const freshDocuments = await Promise.all([
      fetchFreshSettingDocument("openingHours"),
      fetchFreshSettingDocument("informationBar"),
      fetchFreshSettingDocument("specialOpeningHours")
    ]);
    renderDocuments(...freshDocuments);
  } catch (error) {
    console.error("Kunde inte hämta statusraden:", error);
    if (!cachedDocuments.some(Boolean)) {
      openingStatusText.textContent = "Se aktuella öppettider på kontaktsidan";
      storeStatus.classList.add("synlig", "ar-stangd");
    }
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
