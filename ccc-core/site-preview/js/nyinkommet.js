import { getSiteSettings } from "./site-data.js?v=1.1.0";
import {
  fetchFreshGalleryData,
  getCachedGalleryData
} from "./gallery-data.js?v=1.1.0";

(() => {
  "use strict";

  const PROJECT_ID = "container13-87c1a";
  const API_KEY = "AIzaSyDDWaTS_Yyo5X-skYiJ5nQYX5Jc5ZSa1tw";
  const gallery = document.getElementById("nyGallery");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeButton = document.getElementById("close");
  const previousButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const previewBackButton = document.getElementById("cccPreviewBack");
  let images = [];
  let currentIndex = 0;

  const PREVIEW_DB_NAME = "ccc-local-workspace";
  const PREVIEW_DB_VERSION = 3;
  const PREVIEW_IMAGE_STORE = "images";
  const PREVIEW_FILE_STORE = "vision-files";
  let previewItems = [];
  let previewObjectUrls = [];

  function previewMode() {
    const params=new URLSearchParams(window.location.search);
    if(params.get("cccStage")==="1")return "stage";
    if(params.get("cccPreview")==="1")return "preview";
    return "";
  }

  function previewRequested() {
    return !!previewMode();
  }

  function previewMetadataList() {
    try {
      // Samma session-transport används för både Förhandsvisa och direkt staging-test.
      const current=JSON.parse(sessionStorage.getItem("ccc-site-preview-items") || "null");
      if(Array.isArray(current)&&current.length)return current;

      if(previewMode()==="stage"){
        const staged=JSON.parse(localStorage.getItem("ccc-site-stage-items") || "null");
        return Array.isArray(staged)?staged:[];
      }

      const one=JSON.parse(sessionStorage.getItem("ccc-site-preview-item") || "null");
      return one?[one]:[];
    } catch (_) {
      return [];
    }
  }

  function previewDisplaySettings() {
    try {
      const raw=sessionStorage.getItem("ccc-site-preview-display-settings")
        || (previewMode()==="stage" ? localStorage.getItem("ccc-site-stage-display-settings") : null);
      const stored=JSON.parse(raw || "null");
      if(stored && typeof stored==="object"){
        return {
          showTitle:stored.showTitle!==false,
          showDescription:stored.showDescription===true
        };
      }
    } catch (_) {}
    return {
      showTitle:localStorage.getItem("ccc-publish-container13-show-title")!=="0",
      showDescription:localStorage.getItem("ccc-publish-container13-show-description")==="1"
    };
  }

  function openPreviewDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(PREVIEW_DB_NAME, PREVIEW_DB_VERSION);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error("CCC:s lokala databas är blockerad."));
    });
  }

  async function getPreviewRecord(id) {
    if (!id) return null;
    const db = await openPreviewDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PREVIEW_IMAGE_STORE, "readonly");
      const request = tx.objectStore(PREVIEW_IMAGE_STORE).get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  }

  async function getPreviewSourceFile(key) {
    if (!key) return null;
    const db = await openPreviewDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PREVIEW_FILE_STORE, "readonly");
      const request = tx.objectStore(PREVIEW_FILE_STORE).get(key);
      request.onsuccess = () => resolve(request.result?.blob || null);
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  }


  async function getTransportedPreviewBlob(cacheKey) {
    if(!cacheKey || !("caches" in window))return null;
    try{
      const response=await caches.match(cacheKey);
      return response?.ok ? await response.blob() : null;
    }catch(error){
      console.warn("[CCC Site Preview] Cache Storage kunde inte läsas",error);
      return null;
    }
  }

  async function loadLocalPreviewItems() {
    if (!previewRequested()) return [];
    const banner=document.getElementById("cccPreviewBanner");
    banner?.classList.add("is-active");
    const bannerText=banner?.querySelector("span");
    if(bannerText){
      bannerText.textContent=previewMode()==="stage"
        ?"Staging – publicerat från CCC, inte live"
        :"Förhandsvisning – inget är publicerat";
    }

    const params = new URLSearchParams(window.location.search);
    const metadata = previewMetadataList();
    const idsFromUrl=(params.get("items")||params.get("item")||"").split(",").map(s=>s.trim()).filter(Boolean);
    const ids=idsFromUrl.length?idsFromUrl:metadata.map(item=>item.id).filter(Boolean);
    if (!ids.length) return [];

    const loaded=[];
    for(const id of ids){
      try {
        const meta=metadata.find(item=>String(item.id)===String(id))||{};
        let blob=await getTransportedPreviewBlob(meta.imageCacheKey||"");
        let record=null;
        if(!blob){
          record=await getPreviewRecord(id);
          blob = record?.publishBlob || record?.thumbnailBlob || record?.originalBlob || null;
        }
        const sourceFileKey=record?.originalFileKey || meta.originalFileKey || "";
        if (!blob && sourceFileKey) blob = await getPreviewSourceFile(sourceFileKey);
        if (!blob) throw new Error(`Utkastet ${id} saknar lokal bild.`);

        const localUrl=URL.createObjectURL(blob);
        previewObjectUrls.push(localUrl);
        loaded.push({
          id: `ccc-preview-${id}`,
          title: meta.title || record?.title || record?.fields?.title || "Förhandsvisning",
          description: meta.description || record?.description || record?.fields?.description || "",
          imageUrl: localUrl,
          category: "nyinkommet",
          createdAt: meta.createdAt || new Date().toISOString(),
          __cccPreview: true,
          __cccStage: previewMode()==="stage"
        });
      } catch (error) {
        console.error("[CCC Site Preview]", error);
      }
    }
    const banner=document.getElementById("cccPreviewBanner");
    const bannerText=banner?.querySelector("span");
    if(!loaded.length){
      if(bannerText)bannerText.textContent=previewMode()==="stage"
        ?`Staging kunde inte ladda bilderna (0 av ${ids.length}).`
        :"Förhandsvisningen kunde inte ladda de lokala utkasten.";
    }else if(previewMode()==="stage" && loaded.length<ids.length){
      if(bannerText)bannerText.textContent=`Staging – ${loaded.length} av ${ids.length} plagg laddade, inte live`;
    }
    return loaded;
  }

  function val(value) {
    if (!value || typeof value !== "object") return null;
    if ("stringValue" in value) return value.stringValue;
    if ("booleanValue" in value) return value.booleanValue;
    if ("integerValue" in value) return Number(value.integerValue);
    if ("doubleValue" in value) return Number(value.doubleValue);
    if ("timestampValue" in value) return value.timestampValue;
    if (value.mapValue) return fields(value.mapValue.fields || {});
    if (value.arrayValue) return (value.arrayValue.values || []).map(val);
    return null;
  }

  function fields(source) {
    const result = {};
    Object.entries(source || {}).forEach(([key, value]) => result[key] = val(value));
    return result;
  }

  function imageUrl(item) {
    return String(item.imageUrl || item.url || item.downloadURL || item.downloadUrl || "").trim();
  }

  function category(item) {
    return String(item.category || item.type || item.section || "").trim().toLowerCase();
  }

  function itemDate(item) {
    const raw = item.createdAt || item.uploadedAt || item.date || item.documentCreatedAt || "";
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function time(item) {
    return itemDate(item)?.getTime() || 0;
  }

  function relativeDateText(item) {
    const date = itemDate(item);
    if (!date) return "Nyinkommen";

    const today = new Date();
    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const days = Math.max(0, Math.round((startToday - startDate) / 86400000));

    if (days === 0) return "Nyinkommen idag";
    if (days === 1) return "Nyinkommen igår";
    if (days < 7) return `Nyinkommen för ${days} dagar sedan`;

    const options = date.getFullYear() === today.getFullYear()
      ? { day: "numeric", month: "long" }
      : { day: "numeric", month: "long", year: "numeric" };
    return `Nyinkommen ${date.toLocaleDateString("sv-SE", options)}`;
  }

  function showLightboxImage() {
    const item = images[currentIndex];
    if (item && lightboxImage) {
      lightboxImage.src = imageUrl(item);
      lightboxImage.alt = item.title || "Bild från Container 13 Vintage";
    }
  }

  function open(index) {
    if (!lightbox || !images.length) return;
    currentIndex = index;
    showLightboxImage();
    lightbox.style.display = "flex";
    lightbox.classList.add("show", "active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    if (!lightbox) return;
    lightbox.classList.remove("show", "active");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.style.display = "none";
    document.body.style.overflow = "";
  }

  function previous() {
    if (images.length) {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showLightboxImage();
    }
  }

  function next() {
    if (images.length) {
      currentIndex = (currentIndex + 1) % images.length;
      showLightboxImage();
    }
  }

  async function getRetentionSetting() {
    try {
      const settings = await getSiteSettings();
      if (settings.newArrivalsRetentionMode === "manual") return { mode: "manual", days: 0 };
      const parsed = Number(settings.newArrivalsRetentionDays);
      const days = Number.isInteger(parsed) ? Math.min(30, Math.max(1, parsed)) : 7;
      return { mode: "days", days };
    } catch (error) {
      console.warn("Visningstiden kunde inte hämtas. 7 dagar används.", error);
      return { mode: "days", days: 7 };
    }
  }

  function withinRetention(item, retention) {
    if (retention.mode === "manual") return true;
    const date = itemDate(item);
    if (!date) return true;
    return date.getTime() >= Date.now() - retention.days * 86400000;
  }

  function render(items) {
    images = items;
    gallery.innerHTML = "";
    const display=previewDisplaySettings();

    if (!items.length) {
      gallery.innerHTML = '<p class="gallery-status">Det finns inga bilder under Nyinkommet ännu.</p>';
      return;
    }

    items.forEach((item, index) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-item nyinkommet-kort image-card-loading";
      if (item.__cccPreview) {
        figure.dataset.cccPreview = "true";
        figure.setAttribute("aria-label","Lokalt CCC-utkast i förhandsvisning");
      }

      const imageButton = document.createElement("button");
      imageButton.className = "nyinkommet-bildknapp";
      imageButton.type = "button";
      imageButton.setAttribute("aria-label", item.title ? `Öppna ${item.title} i stort format` : "Öppna bilden i stort format");
      imageButton.addEventListener("click", () => open(index));

      const img = document.createElement("img");
      img.src = imageUrl(item);
      img.alt = item.title || "Bild från Container 13 Vintage";
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("load", () => {
        figure.classList.remove("image-card-loading");
        figure.classList.add("image-card-loaded");
      });
      img.addEventListener("error", () => figure.remove());

      const caption = document.createElement("figcaption");
      caption.className = "nyinkommet-info";

      const title = String(item.title || "").trim();
      if (display.showTitle && title) {
        const heading = document.createElement("p");
        heading.className = "nyinkommet-titel";
        heading.textContent = title;
        caption.appendChild(heading);
      }

      const description=String(item.description || "").trim();
      if(display.showDescription && description){
        const copy=document.createElement("p");
        copy.className="nyinkommet-beskrivning";
        copy.textContent=description;
        caption.appendChild(copy);
      }

      const date = document.createElement("p");
      date.className = "nyinkommet-datum";
      date.textContent = `◷ ${relativeDateText(item)}`;

      imageButton.appendChild(img);
      caption.appendChild(date);
      figure.append(imageButton, caption);
      gallery.appendChild(figure);
    });
  }

  async function load() {
    if (!gallery) return;
    previewItems = await loadLocalPreviewItems();
    if (previewItems.length) {
      render(previewItems);
      if(previewMode()==="stage"){
        const bannerText=document.querySelector("#cccPreviewBanner span");
        if(bannerText){
          bannerText.textContent=`Staging – ${previewItems.length} ${previewItems.length===1?"plagg":"plagg"} publicerade från CCC, inte live`;
        }
      }
    }

    const cached = getCachedGalleryData();
    if (!cached && !previewItems.length) {
      gallery.innerHTML = '<p class="gallery-status">Hämtar bilder...</p>';
    }

    const retention = await getRetentionSetting();
    const renderGalleryData = (json) => {
      const all = (json.documents || []).map((document) => ({
        id: document.name?.split("/").pop() || "",
        documentCreatedAt: document.createTime || "",
        ...fields(document.fields || {})
      }));
      const selected = all
        .filter((item) => category(item) === "nyinkommet" && imageUrl(item) && withinRetention(item, retention))
        .sort((a, b) => time(b) - time(a));
      render(previewItems.length ? [...previewItems, ...selected] : selected);
    };

    if (cached) {
      renderGalleryData(cached);
    }

    try {
      const fresh = await fetchFreshGalleryData();
      renderGalleryData(fresh);
    } catch (error) {
      console.error(error);
      if (!cached && !previewItems.length) {
        gallery.innerHTML = `<p class="gallery-status">Bilderna kunde inte hämtas (${error.message}).</p>`;
      } else if (!cached && previewItems.length) {
        render(previewItems);
      }
    }
  }


  previewBackButton?.addEventListener("click", () => {
    if (history.length > 1) history.back();
    else window.location.href = "../publish/";
  });

  let lightboxTouchStartX = null;
  lightbox?.addEventListener("touchstart", (event) => { lightboxTouchStartX = event.changedTouches?.[0]?.clientX ?? null; }, {passive:true});
  lightbox?.addEventListener("touchend", (event) => {
    if (lightboxTouchStartX == null) return;
    const endX = event.changedTouches?.[0]?.clientX ?? lightboxTouchStartX;
    const dx = endX - lightboxTouchStartX;
    lightboxTouchStartX = null;
    if (Math.abs(dx) < 45) return;
    dx < 0 ? next() : previous();
  }, {passive:true});

  closeButton?.addEventListener("click", close);
  previousButton?.addEventListener("click", previous);
  nextButton?.addEventListener("click", next);
  lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) close(); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") previous();
    if (event.key === "ArrowRight") next();
  });

  window.addEventListener("pagehide",()=>previewObjectUrls.forEach(u=>URL.revokeObjectURL(u)));
  load();
})();
