import { app } from "./firebase.js";
import {
  doc,
  getFirestore,
  increment,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const database = getFirestore(app);
const VISITOR_KEY = "c13_analytics_visitor_id";
const DAILY_KEY_PREFIX = "c13_analytics_seen_";

function createVisitorId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `c13-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function getVisitorId() {
  try {
    let visitorId = localStorage.getItem(VISITOR_KEY);
    if (!visitorId) {
      visitorId = createVisitorId();
      localStorage.setItem(VISITOR_KEY, visitorId);
    }
    return visitorId;
  } catch (_) {
    return createVisitorId();
  }
}

function stockholmDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function deviceType() {
  const ua = navigator.userAgent || "";
  if (/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)) return "surfplatta";
  if (/Mobi|iPhone|Android/i.test(ua)) return "mobil";
  return "dator";
}

function platformName() {
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iPhone/iPad";
  if (/Android/i.test(ua)) return "Android";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Macintosh|Mac OS X/i.test(ua)) return "Mac";
  if (/CrOS/i.test(ua)) return "Chromebook";
  return "Övrigt";
}

function isInstalledPwa() {
  return window.matchMedia?.("(display-mode: standalone)").matches === true ||
    window.navigator.standalone === true;
}

function currentPage() {
  const file = location.pathname.split("/").filter(Boolean).pop() || "index.html";
  const labels = {
    "index.html": "Hem",
    "galleri.html": "Butiken",
    "nyinkommet.html": "Nyinkommet",
    "kontakt.html": "Kontakt",
    "hittahit.html": "Hitta hit"
  };
  return labels[file] || file.replace(/\.html$/i, "") || "Hem";
}

function safePageKey(name) {
  return name.toLowerCase().replace(/[^a-z0-9åäö]+/gi, "-").replace(/^-|-$/g, "") || "okand";
}

async function registerVisit() {
  const visitorId = getVisitorId();
  const dateKey = stockholmDateKey();
  const pageName = currentPage();
  const pageKey = safePageKey(pageName);
  let firstToday = false;

  try {
    const dailyStorageKey = `${DAILY_KEY_PREFIX}${dateKey}`;
    firstToday = localStorage.getItem(dailyStorageKey) !== visitorId;
    if (firstToday) localStorage.setItem(dailyStorageKey, visitorId);
  } catch (_) {
    firstToday = true;
  }

  const visitorReference = doc(database, "analytics_visitors", visitorId);
  const dayReference = doc(database, "analytics_days", dateKey);

  const visitorData = {
    lastSeenAt: serverTimestamp(),
    lastPage: pageName,
    deviceType: deviceType(),
    platform: platformName(),
    installedPwa: isInstalledPwa(),
    visitCount: increment(1)
  };

  const dayData = {
    date: dateKey,
    updatedAt: serverTimestamp(),
    pageViews: increment(1),
    pages: { [pageKey]: increment(1) }
  };

  if (firstToday) {
    dayData.uniqueVisitors = increment(1);
  }

  try {
    await Promise.all([
      setDoc(visitorReference, visitorData, { merge: true }),
      setDoc(dayReference, dayData, { merge: true })
    ]);
  } catch (error) {
    console.warn("Besöksstatistiken kunde inte sparas:", error);
  }
}

registerVisit();
