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


  async function getAll(storeName) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => { db.close(); resolve(req.result || []); };
      req.onerror = () => { db.close(); reject(req.error); };
    });
  }

  async function metricsSince(isoDate) {
    const from = new Date(isoDate).getTime();
    const rows = await getAll(METRICS);
    return rows.filter((row) => new Date(row.at || 0).getTime() >= from);
  }

  function estimateCost(usage, model) {
    const pricing = window.CCC_VISION_AI_CONFIG?.pricing || {};
    const modelPrices = pricing.models?.[model] || pricing.models?.["gpt-5.6-terra"];
    if (!usage || !modelPrices) return { usd: 0, sek: 0 };
    const input = Number(usage.input_tokens || 0);
    const output = Number(usage.output_tokens || 0);
    const usd = (input / 1_000_000) * Number(modelPrices.inputPerMTokUsd || 0)
      + (output / 1_000_000) * Number(modelPrices.outputPerMTokUsd || 0);
    const sek = usd * Number(pricing.usdToSek || 10.5);
    return { usd, sek, inputTokens: input, outputTokens: output };
  }

  async function costSummarySince(isoDate) {
    const rows = await metricsSince(isoDate);
    const analyses = rows.filter((row) => row.type === "ai_analysis");
    return analyses.reduce((acc, row) => {
      acc.count += 1;
      acc.sek += Number(row.estimatedSek || 0);
      acc.usd += Number(row.estimatedUsd || 0);
      return acc;
    }, { count: 0, sek: 0, usd: 0 });
  }

  async function loadBase() {
    try {
      const res = await fetch("football-base.json", { cache: "no-store" });
      return res.ok ? await res.json() : null;
    } catch { return null; }
  }

  window.CCC_VISION_KNOWLEDGE = { remember, metric, loadBase, metricsSince, estimateCost, costSummarySince };
})();
