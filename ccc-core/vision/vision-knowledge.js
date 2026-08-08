(() => {
  const DB_NAME = "ccc-vision-local";
  const DB_VERSION = 1;
  const KNOWLEDGE = "knowledge";
  const METRICS = "metrics";

  function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(KNOWLEDGE)) db.createObjectStore(KNOWLEDGE, { keyPath: "key" });
        if (!db.objectStoreNames.contains(METRICS)) db.createObjectStore(METRICS, { keyPath: "id", autoIncrement: true });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function put(storeName, value) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).put(value);
      tx.oncomplete = () => { db.close(); resolve(value); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  }

  async function remember(record) {
    if (!record?.key) return;
    return put(KNOWLEDGE, { ...record, updatedAt: new Date().toISOString() });
  }

  async function metric(event) {
    return put(METRICS, { ...event, at: new Date().toISOString() });
  }

  async function loadBase() {
    try {
      const res = await fetch("football-base.json", { cache: "no-store" });
      return res.ok ? await res.json() : null;
    } catch { return null; }
  }

  window.CCC_VISION_KNOWLEDGE = { remember, metric, loadBase };
})();
