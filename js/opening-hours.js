(() => {
  "use strict";

  const PROJECT_ID = "container13-87c1a";
  const API_KEY = "AIzaSyDDWaTS_Yyo5X-skYiJ5nQYX5Jc5ZSa1tw";
  const list = document.getElementById("oppettider-lista");
  const specialList = document.getElementById("avvikande-oppettider-lista");

  const dayNames = [
    ["Måndag", "monday"], ["Tisdag", "tuesday"], ["Onsdag", "wednesday"],
    ["Torsdag", "thursday"], ["Fredag", "friday"], ["Lördag", "saturday"], ["Söndag", "sunday"]
  ];

  function firestoreValue(value) {
    if (!value || typeof value !== "object") return null;
    if ("stringValue" in value) return value.stringValue;
    if ("booleanValue" in value) return value.booleanValue;
    if ("integerValue" in value) return Number(value.integerValue);
    if ("doubleValue" in value) return Number(value.doubleValue);
    if ("timestampValue" in value) return value.timestampValue;
    if ("nullValue" in value) return null;
    if (value.mapValue) return firestoreFields(value.mapValue.fields || {});
    if (value.arrayValue) return (value.arrayValue.values || []).map(firestoreValue);
    return null;
  }

  function firestoreFields(fields) {
    const result = {};
    Object.entries(fields || {}).forEach(([key, value]) => { result[key] = firestoreValue(value); });
    return result;
  }

  function row(name, values = {}) {
    const div = document.createElement("div");
    div.className = "oppettid-rad";
    const day = document.createElement("span");
    day.className = "oppettid-dag";
    day.textContent = name;
    const time = document.createElement("span");
    time.className = "oppettid-tid";
    time.textContent = values.closed === true ? "Stängt" :
      (values.open && values.close ? `${values.open} – ${values.close}` : "Ej angivet");
    div.append(day, time);
    return div;
  }

  async function load() {
    if (!list) return;
    list.innerHTML = "<p>Hämtar öppettider...</p>";
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/settings/openingHours?key=${API_KEY}`;
    const specialUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/settings/specialOpeningHours?key=${API_KEY}`;
    try {
      const [response, specialResponse] = await Promise.all([
        fetch(url, { cache: "no-store" }),
        fetch(specialUrl, { cache: "no-store" })
      ]);
      if (!response.ok) throw new Error(`Firestore svarade ${response.status}`);
      const documentData = await response.json();
      const data = firestoreFields(documentData.fields || {});
      const savedDays = data.days || data.openingHours || data.hours || {};
      list.innerHTML = "";
      dayNames.forEach(([name, key]) => list.appendChild(row(name, savedDays[key] || {})));

      if (specialList) specialList.innerHTML = "<p>Inga kommande avvikande öppettider är inlagda.</p>";
      if (specialResponse.ok) {
        const specialDocument = await specialResponse.json();
        const specialData = firestoreFields(specialDocument.fields || {});
        const entries = specialData.entries || {};
        const today = new Intl.DateTimeFormat("sv-SE", {
          timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit", day: "2-digit"
        }).format(new Date()).replace(/\//g, "-");
        const upcoming = Object.entries(entries)
          .filter(([dateKey]) => dateKey >= today)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(0, 8);
        if (specialList) {
          specialList.innerHTML = "";
          if (!upcoming.length) {
            specialList.innerHTML = "<p>Inga kommande avvikande öppettider är inlagda.</p>";
          } else {
            upcoming.forEach(([dateKey, values]) => {
              const [year, month, day] = dateKey.split("-").map(Number);
              const name = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
                .format(new Date(Date.UTC(year, month - 1, day, 12)));
              specialList.appendChild(row(name, values));
            });
          }
        }
      }
    } catch (error) {
      console.error("Kunde inte hämta öppettider:", error);
      list.innerHTML = `<p>Öppettiderna kunde inte hämtas (${error.message}).</p>`;
    }
  }

  load();
})();
