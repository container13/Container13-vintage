(() => {
  const defaults = {
    "ccc-vision-ai-auto": true,
    "ccc-vision-learn-edits": true
  };
  const map = { visionAiAuto: "ccc-vision-ai-auto", visionLearnEdits: "ccc-vision-learn-edits" };
  const read = (key) => { const value = localStorage.getItem(key); return value === null ? defaults[key] : value === "true"; };
  let timer;
  Object.entries(map).forEach(([id,key]) => {
    const input = document.getElementById(id); if (!input) return; input.checked = read(key);
    input.addEventListener("change", () => {
      localStorage.setItem(key, String(input.checked));
      const saved = document.getElementById("settingsSaved"); saved.textContent = "Sparat lokalt ✓";
      clearTimeout(timer); timer = setTimeout(() => saved.textContent = "", 1400);
    });
  });
})();
