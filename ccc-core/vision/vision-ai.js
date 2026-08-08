(() => {
  const config = window.CCC_VISION_AI_CONFIG || {};

  function configured() {
    return typeof config.endpoint === "string" && /^https:\/\//.test(config.endpoint.trim());
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error("Kunde inte läsa bilden."));
      reader.readAsDataURL(file);
    });
  }

  function loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Kunde inte förbereda bilden."));
      image.src = dataUrl;
    });
  }

  async function prepareImage(file) {
    const dataUrl = await readFileAsDataUrl(file);
    // SVG och okända format skickas oförändrade i testläge. Vanliga foton komprimeras endast för analys.
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return dataUrl;

    const image = await loadImage(dataUrl);
    const maxEdge = Number(config.maxImageEdge) || 1600;
    const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth || 1, image.naturalHeight || 1));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", Number(config.jpegQuality) || 0.84);
  }

  function normalize(result) {
    if (!result || typeof result !== "object") throw new Error("Vision gav inget användbart svar.");
    const fields = result.fields || {};
    const clean = (value, fallback = "") => typeof value === "string" ? value.trim() : fallback;
    return {
      label: clean(result.label, "AI-analys"),
      summaryTitle: clean(result.summaryTitle, "Plagg"),
      summaryBrand: clean(result.summaryBrand, "Märke ej säkert"),
      summarySeason: clean(result.summarySeason, "År/säsong ej säkert"),
      confidence: clean(result.confidence, "Lite osäker"),
      priceSuggestion: Number.isFinite(Number(result.priceSuggestion)) ? Number(result.priceSuggestion) : 0,
      fact: clean(result.fact),
      fields: {
        title: clean(fields.title),
        category: clean(fields.category),
        brand: clean(fields.brand),
        season: clean(fields.season),
        price: clean(fields.price),
        manufacturer: clean(fields.manufacturer),
        size: clean(fields.size),
        color: clean(fields.color),
        description: clean(fields.description)
      }
    };
  }

  async function analyze(files) {
    if (!configured()) {
      const error = new Error("CCC Vision AI är inte ansluten ännu.");
      error.code = "AI_NOT_CONFIGURED";
      throw error;
    }
    const imageFiles = [...(files || [])].filter(Boolean).slice(0, 3);
    if (!imageFiles.length) throw new Error("Ingen bild att analysera.");
    const images = await Promise.all(imageFiles.map(prepareImage));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Number(config.timeoutMs) || 45000);
    try {
      const response = await fetch(config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images, locale: "sv-SE" }),
        signal: controller.signal
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || `Vision kunde inte analysera bilden (${response.status}).`);
      return normalize(payload.result || payload);
    } finally {
      clearTimeout(timer);
    }
  }

  window.CCC_VISION_AI = { configured, analyze };
})();
