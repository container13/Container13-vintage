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

    // Worker v1 returnerar { ok: true, product: {...} }.
    const product = result.product && typeof result.product === "object" ? result.product : result;
    const clean = (value, fallback = "") => typeof value === "string" ? value.trim() : fallback;
    const price = Number(product.suggested_price_sek);
    const confidenceMap = { high: "Säkerheten är hög", medium: "Ganska säker", low: "Lite osäker" };

    return {
      label: "AI-analys",
      summaryTitle: clean(product.title, "Plagg"),
      summaryBrand: clean(product.brand, "Märke ej säkert"),
      summarySeason: clean(product.year_or_season, "År/säsong ej säkert"),
      confidence: confidenceMap[product.confidence] || "Lite osäker",
      priceSuggestion: Number.isFinite(price) ? price : 0,
      fact: clean(product.fun_fact),
      fields: {
        title: clean(product.title),
        category: clean(product.category),
        brand: clean(product.brand),
        season: clean(product.year_or_season),
        price: Number.isFinite(price) ? String(price) : "",
        manufacturer: clean(product.team_or_subject),
        size: clean(product.size),
        color: clean(product.color),
        description: clean(product.description)
      }
    };
  }

  function makeVisionError(message, code, details = "", status = 0) {
    const error = new Error(message);
    error.code = code;
    error.details = details;
    error.status = status;
    return error;
  }

  async function analyze(files) {
    if (!configured()) {
      throw makeVisionError("AI-endpoint saknas.", "AI_NOT_CONFIGURED");
    }

    const imageFiles = [...(files || [])].filter(Boolean).slice(0, 3);
    if (!imageFiles.length) throw makeVisionError("Ingen bild att analysera.", "AI_NO_IMAGE");

    console.info("[CCC Vision] Förbereder bild för AI", {
      endpoint: config.endpoint,
      files: imageFiles.length
    });

    let images;
    try {
      images = await Promise.all(imageFiles.map(prepareImage));
    } catch (error) {
      console.error("[CCC Vision] Bildförberedelse misslyckades", error);
      throw makeVisionError("Kunde inte förbereda bilden för analys.", "AI_IMAGE_PREP", error?.message || String(error));
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Number(config.timeoutMs) || 45000);

    try {
      console.info("[CCC Vision] Skickar analysförfrågan", { endpoint: config.endpoint });
      const response = await fetch(config.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        cache: "no-store",
        body: JSON.stringify({ image: images[0], locale: "sv-SE" }),
        signal: controller.signal
      });

      const raw = await response.text();
      let payload = {};
      try { payload = raw ? JSON.parse(raw) : {}; } catch (_) { payload = { raw }; }

      console.info("[CCC Vision] Servern svarade", {
        status: response.status,
        ok: response.ok,
        payload
      });

      if (!response.ok) {
        const message = payload?.details || payload?.error || `Vision-servern svarade med HTTP ${response.status}.`;
        throw makeVisionError(message, "AI_HTTP_ERROR", payload?.error || "", response.status);
      }

      try {
        return normalize(payload);
      } catch (error) {
        console.error("[CCC Vision] Kunde inte tolka AI-svaret", error, payload);
        throw makeVisionError("AI-svaret hade oväntat format.", "AI_BAD_RESPONSE", error?.message || String(error), response.status);
      }
    } catch (error) {
      if (error?.name === "AbortError") {
        console.error("[CCC Vision] Timeout efter", Number(config.timeoutMs) || 45000, "ms");
        throw makeVisionError("AI-analysen tog för lång tid.", "AI_TIMEOUT");
      }
      if (error?.code) throw error;
      console.error("[CCC Vision] Kunde inte nå Vision-servern", error);
      throw makeVisionError("Kunde inte nå CCC Vision-servern.", "AI_NETWORK", error?.message || String(error));
    } finally {
      clearTimeout(timer);
    }
  }

  window.CCC_VISION_AI = { configured, analyze };
})();
