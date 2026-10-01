(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const fieldIds = ["title", "category", "brand", "season", "price", "manufacturer", "size", "color", "description"];
  const demoKeys = ["arsenal", "levis", "adidas"];
  const WORKSPACE_PAGE_SIZE = 6;

  let cameraStream = null;
  let stagedCameraFile = null;
  let stagedItem = null;
  let batchItems = [];
  let currentIndex = 0;
  let trashStack = [];
  let saveTimer;
  let visionView = "start";
  let editReturnView = "suggestion";
  let cropReturnView = "suggestion";
  let cropImage = null;
  let cropState = null;
  let cropPointer = null;
  let savedSessionSummary = null;
  let sessionSaveChain = Promise.resolve();
  let workspacePage = 0;
  let workspaceSwipe = null;
  let suppressWorkspaceClick = false;
  let autosaveSequence = 0;
  let cameraZoomState = { min: 1, max: 1, current: 1, pinchStartDistance: 0, pinchStartZoom: 1 };

  function queueVisionSessionSave() {
    if (!batchItems.length) return Promise.resolve(false);
    sessionSaveChain = sessionSaveChain
      .catch(() => false)
      .then(() => saveVisionSessionLocally())
      .catch((error) => {
        console.error("[CCC Vision] Automatisk sessionssparning misslyckades", storageErrorDetails(error), error);
        setMessage("CCC kunde inte säkerhetsspara fotosessionen. Lämna inte sidan innan du har försökt igen.");
        return false;
      });
    return sessionSaveChain;
  }

  const VISION_SETTING_DEFAULTS = { aiAuto: true, learnEdits: true };
  function readBoolSetting(key, fallback) {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value === "true";
  }
  function visionSettings() {
    return {
      aiAuto: readBoolSetting("ccc-vision-ai-auto", VISION_SETTING_DEFAULTS.aiAuto),
      learnEdits: readBoolSetting("ccc-vision-learn-edits", VISION_SETTING_DEFAULTS.learnEdits)
    };
  }

  const visionSettingsButton = $("#visionSettingsBtn");
  const visionSettingsOverlay = $("#visionSettingsOverlay");
  const visionSettingsCloseButton = $("#visionSettingsCloseBtn");
  const visionAiAutoSetting = $("#visionAiAutoSetting");
  const visionLearnEditsSetting = $("#visionLearnEditsSetting");
  let visionSettingsSavedTimer;

  const visionTotalCost = $("#visionTotalCost");

  async function refreshVisionTotalCost() {
    if (!visionTotalCost) return;
    try {
      const summary = await window.CCC_VISION_KNOWLEDGE?.costSummarySince?.("1970-01-01T00:00:00.000Z");
      const sek = Number(summary?.sek || 0);
      visionTotalCost.textContent = `${new Intl.NumberFormat("sv-SE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(sek)} kr`;
    } catch (error) {
      console.warn("[CCC Vision] Kunde inte läsa total Vision-kostnad", error);
      visionTotalCost.textContent = "0,00 kr";
    }
  }

  function syncVisionSettingsPanel() {
    const settings = visionSettings();
    if (visionAiAutoSetting) visionAiAutoSetting.checked = settings.aiAuto;
    if (visionLearnEditsSetting) visionLearnEditsSetting.checked = settings.learnEdits;
  }
  function setVisionSettingsOpen(open) {
    if (!visionSettingsOverlay) return;
    if (open) {
      syncVisionSettingsPanel();
      refreshVisionTotalCost();
    }
    visionSettingsOverlay.hidden = !open;
    visionSettingsButton?.setAttribute("aria-expanded", String(open));
  }
  function saveVisionSetting(key, value) {
    localStorage.setItem(key, String(value));
    const saved = $("#visionSettingsSaved");
    if (saved) {
      saved.textContent = "Sparat ✓";
      clearTimeout(visionSettingsSavedTimer);
      visionSettingsSavedTimer = setTimeout(() => saved.textContent = "", 1200);
    }
    if (key === "ccc-vision-ai-auto" && privacyNote) {
      privacyNote.textContent = window.CCC_VISION_AI?.configured?.() && value
        ? "Originalbilderna stannar på enheten. En komprimerad kopia skickas endast för analys."
        : "Originalbilderna stannar på den här enheten.";
    }
  }


  const privacyNote = $("#privacyNote");
  if (privacyNote) {
    privacyNote.textContent = window.CCC_VISION_AI?.configured?.() && visionSettings().aiAuto
      ? "Originalbilderna stannar på enheten. En komprimerad kopia skickas endast för analys."
      : "Originalbilderna stannar på den här enheten.";
  }

  document.addEventListener("click", (event) => { const pop=$("#visionCostPopover"); const btn=$("#visionCostBtn"); if(pop && !pop.hidden && !pop.contains(event.target) && event.target !== btn){ pop.hidden=true; btn?.setAttribute("aria-expanded","false"); } });

  const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const cccItemId = () => {
    const d=new Date();
    const y=String(d.getFullYear());
    const m=String(d.getMonth()+1).padStart(2,"0");
    const day=String(d.getDate()).padStart(2,"0");
    const entropy=(globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`)
      .replace(/[^a-zA-Z0-9]/g,"").slice(-6).toUpperCase();
    return `C13-${y}${m}${day}-${entropy}`;
  };
  const currentItem = () => batchItems[currentIndex] || null;
  const currentDemo = () => {
    const item = currentItem();
    if (item?.visionResult) return item.visionResult;
    const key = item?.demoKey || "arsenal";
    return window.CCC_VISION_DEMOS?.[key] || window.CCC_VISION_DEMO;
  };

  function showStage(stageId, viewName = null) {
    ["captureCard", "visionCard", "editCard", "previewCard", "seriesDoneCard"].forEach((id) => {
      const card = $("#" + id);
      if (!card) return;
      card.hidden = id !== stageId;
      card.classList.toggle("is-active", id === stageId);
    });
    if (viewName) visionView = viewName;
    updateHeaderContext();
  }

  function updateHeaderContext() {
    const isModuleHome = visionView === "start";
    const state={back:!isModuleHome,settings:true};
    window.__CCC_HEADER_PENDING__=state;
    window.CCC_CORE?.header?.set(state);
  }

  function applyCaptureMode() {
    if ($("#captureCard")?.hidden) return;
    const hasSession = batchItems.length > 0;
    const startMode = visionView === "start";
    const resume = $("#resumeSessionBtn");
    const strip = $("#batchStrip");
    const help = $("#batchHelp");
    const addDetail = $("#addToSelectedBtn");
    const review = $("#showSuggestionBtn");
    const workspaceContinue = $("#workspaceContinueBtn");
    const saveSession = $("#saveSessionBtn");
    const startHome = $("#visionStartHome");
    const startActions = document.querySelector(".vision-start-actions");
    const workspaceToolbar = $("#workspaceToolbar");
    const workspaceCount = $("#workspaceCount");

    const resumableCount = hasSession ? batchItems.length : Number(savedSessionSummary?.count || 0);
    if (resume) {
      resume.hidden = !(startMode && resumableCount > 0);
      if (resumableCount > 0) resume.textContent = `Fortsätt fotosession – ${resumableCount} ${resumableCount === 1 ? "plagg" : "plagg"}`;
    }
    if (saveSession) saveSession.hidden = startMode || !hasSession;
    if (startHome) startHome.hidden = !startMode;
    if (startActions) startActions.hidden = !startMode;
    if (workspaceToolbar) workspaceToolbar.hidden = startMode || !hasSession;
    if (workspaceCount) {
      const selectedNo = hasSession ? Math.min(currentIndex + 1, batchItems.length) : 0;
      workspaceCount.textContent = hasSession
        ? `${batchItems.length} ${batchItems.length === 1 ? "plagg" : "plagg"} · ${selectedNo} markerat`
        : "0 plagg";
    }
    if (startMode) {
      if (strip) strip.hidden = true;
      if (help) help.hidden = true;
      if (addDetail) addDetail.hidden = true;
      if (review) review.hidden = true;
      if (workspaceContinue) workspaceContinue.hidden = true;
      if (saveSession) saveSession.hidden = true;
    } else if (hasSession) {
      if (strip) strip.hidden = false;
      if (help) help.hidden = false;
      if (workspaceContinue) {
        workspaceContinue.hidden = false;
        workspaceContinue.disabled = false;
      }
    }
    const cameraTitle = $("#startCameraBtn .action-copy strong");
    if (cameraTitle) cameraTitle.textContent = startMode ? "Ta ett foto" : (hasSession ? "Fota nästa plagg" : "Ta ett foto");
  }

  function showVisionStart() {
    showStage("captureCard", "start");
    updateBatchStrip();
    applyCaptureMode();
  }

  function showWorkspace() {
    showStage("captureCard", batchItems.length ? "workspace" : "start");
    updateBatchStrip();
    applyCaptureMode();
  }

  function fileUrl(file) {
    return URL.createObjectURL(file);
  }

  function createBatchItem(file, index) {
    const item = {
      id: uid(),
      cccItemId: cccItemId(),
      file,
      previewUrl: fileUrl(file),
      originalFileKey: null,
      originalFileStored: false,
      originalFileSavePromise: null,
      extraFiles: [],
      extraUrls: [],
      extraFileKeys: [],
      extraFileStored: [],
      extraFileSavePromises: [],
      demoKey: demoKeys[index % demoKeys.length],
      visionReady: false,
      visionResult: null,
      analysisInProgress: false,
      approved: false,
      editedFields: null,
      analysisPromise: null,
      publishFile: null,
      publishUrl: null,
      cropData: null
    };
    item.originalFileKey = `${item.id}:main`;
    item.originalFileSavePromise = putVisionSourceFile(
      item.originalFileKey,
      file,
      buildItemImageMetadata(item)
    )
      .then(() => {
        item.originalFileStored = true;
        item.originalFileSavePromise = null;
      })
      .catch((error) => {
        item.originalFileStored = false;
        item.originalFileSavePromise = null;
        const detail = storageErrorDetails(error);
        console.error("[CCC Vision] Originalbild kunde inte förlagras", detail, error);
        throw error;
      });
    /* Förlagringen får arbeta i bakgrunden; ensureItemSourceFiles avvaktar samma promise vid behov. */
    item.originalFileSavePromise.catch(() => {});
    startSilentAnalysis(item);
    return item;
  }

  async function applyLocalKnowledge(result) {
    if (!result || typeof result !== "object") return result;

    const enriched = {
      ...result,
      fields: { ...(result.fields || {}) }
    };

    try {
      const match = await window.CCC_VISION_KNOWLEDGE?.bestMatch?.(enriched.fields);
      if (!match) return enriched;

      /* Lokal kunskap kompletterar endast tomma AI-fält. AI-resultatet skrivs aldrig bort. */
      const learnedFields = match.fields && typeof match.fields === "object" ? match.fields : match;
      fieldIds.forEach((id) => {
        if (!String(enriched.fields[id] ?? "").trim() && String(learnedFields?.[id] ?? "").trim()) {
          enriched.fields[id] = learnedFields[id];
        }
      });

      if (!enriched.summaryTitle && enriched.fields.title) enriched.summaryTitle = enriched.fields.title;
      if (!enriched.summaryBrand && enriched.fields.brand) enriched.summaryBrand = enriched.fields.brand;
      if (!enriched.summarySeason && enriched.fields.season) enriched.summarySeason = enriched.fields.season;
    } catch (error) {
      /* Kunskapslagret får aldrig stoppa ett färdigt AI-resultat. */
      console.warn("[CCC Vision] Lokal kunskap kunde inte komplettera resultatet", error);
    }

    return enriched;
  }

  function startSilentAnalysis(item, forceAi = false) {
    item.visionReady = false;
    item.analysisInProgress = false;
    const aiAllowed = forceAi || visionSettings().aiAuto;
    item.analysisMode = aiAllowed && window.CCC_VISION_AI?.configured?.() ? "ai" : (aiAllowed ? "demo" : "manual");
    item.analysisError = "";
    item.analysisErrorCode = "";
    item.analysisHttpStatus = 0;
    const files = [item.file, ...(item.extraFiles || [])].filter(Boolean).slice(0, 3);

    if (item.analysisMode === "manual") {
      item.analysisInProgress = false;
      item.analysisPromise = Promise.resolve(null);
      item.visionReady = false;
      updateBatchStrip();
      return item.analysisPromise;
    }

    item.analysisInProgress = true;
    item.analysisPromise = (async () => {
      if (item.analysisMode === "ai") {
        try {
          console.info("[CCC Vision] AI-analys startar", { itemId: item.id, files: files.length });
          const aiResponse = await Promise.race([
            window.CCC_VISION_AI.analyze(files),
            new Promise((_, reject) => setTimeout(() => {
              const error = new Error("AI-analysen tog för lång tid och avbröts.");
              error.code = "AI_TOTAL_TIMEOUT";
              reject(error);
            }, 105000))
          ]);
          item.visionResult = await applyLocalKnowledge(aiResponse.result || aiResponse);
          item.aiUsage = aiResponse.usage || null;
          item.aiModel = aiResponse.model || "";
          const estimated = window.CCC_VISION_KNOWLEDGE?.estimateCost?.(item.aiUsage, item.aiModel) || { usd: 0, sek: 0 };
          item.aiCostUsd = Number(estimated.usd || 0);
          item.aiCostSek = Number(estimated.sek || 0);
          item.visionReady = true;
          window.CCC_VISION_KNOWLEDGE?.metric?.({
            type: "ai_analysis", itemId: item.id, usage: item.aiUsage, model: item.aiModel,
            estimatedUsd: item.aiCostUsd, estimatedSek: item.aiCostSek
          }).catch(() => {});
          refreshCostUi();
          updateBatchStrip();
          console.info("[CCC Vision] AI-analys klar", { itemId: item.id, usage: item.aiUsage });
          return item.visionResult;
        } catch (error) {
          console.error("[CCC Vision] AI-fel – demo används som fallback", error);
          item.analysisError = error?.message || "AI-analysen misslyckades.";
          item.analysisErrorCode = error?.code || "AI_UNKNOWN";
          item.analysisHttpStatus = Number(error?.status) || 0;
          item.analysisMode = "demo";
              }
      }

      // Säkert demoläge tills AI-endpointen är ansluten, eller om testanropet misslyckas.
      await new Promise((resolve) => setTimeout(resolve, 650 + Math.floor(Math.random() * 450)));
      item.visionResult = await applyLocalKnowledge(window.CCC_VISION_DEMOS?.[item.demoKey] || window.CCC_VISION_DEMO);
      item.visionReady = true;
      updateBatchStrip();
      return item.visionResult;
    })().finally(() => {
      item.analysisInProgress = false;
      if (item.visionReady && item.editedFields && item.visionResult?.fields) {
        fieldIds.forEach((id) => {
          if (!String(item.editedFields[id] ?? "").trim()) item.editedFields[id] = item.visionResult.fields[id] ?? "";
        });
      }
      if (visionView === "edit" && currentItem()?.id === item.id) {
        populateFormFromItem(true);
        scheduleAutosave();
      }
      updateBatchStrip();
    });
    return item.analysisPromise;
  }

  function updateWorkspaceState() {
    const review = $("#showSuggestionBtn");
    const workspaceContinue = $("#workspaceContinueBtn");
    const addDetail = $("#addToSelectedBtn");
    if (!batchItems.length) {
      if (addDetail) addDetail.hidden = true;
      if (workspaceContinue) workspaceContinue.hidden = true;
      if (review) { review.hidden = true; review.disabled = true; }
      return;
    }
    if (workspaceContinue) {
      workspaceContinue.hidden = false;
      workspaceContinue.disabled = false;
    }
    if (addDetail) addDetail.hidden = true;
    /* En enda framåtknapp i arbetsvyn. Den valda miniatyren och
       Granska & komplettera leder till samma plagg. */
    if (review) { review.hidden = true; review.disabled = true; }
  }

  function updateBatchStrip() {
    const strip = $("#batchStrip");
    strip.innerHTML = "";
    const pageCount = Math.max(1, Math.ceil(batchItems.length / WORKSPACE_PAGE_SIZE));
    workspacePage = Math.max(0, Math.min(workspacePage, pageCount - 1));
    if (batchItems[currentIndex] && Math.floor(currentIndex / WORKSPACE_PAGE_SIZE) !== workspacePage) workspacePage = Math.floor(currentIndex / WORKSPACE_PAGE_SIZE);
    const track = document.createElement("div");
    track.className = "vision-grid-track";
    for (let page = 0; page < pageCount; page += 1) {
      const grid = document.createElement("div");
      grid.className = "vision-grid-page";
      batchItems.slice(page * WORKSPACE_PAGE_SIZE, page * WORKSPACE_PAGE_SIZE + WORKSPACE_PAGE_SIZE).forEach((item, localIndex) => {
      const index = page * WORKSPACE_PAGE_SIZE + localIndex;
      const wrap = document.createElement("button");
      wrap.type = "button";
      wrap.className = "batch-thumb";
      if (index === currentIndex) wrap.classList.add("is-selected");
      wrap.setAttribute("aria-label", `Plagg ${index + 1}${item.visionReady ? ", analys klar" : item.analysisMode === "manual" ? ", ej AI-analyserat" : ", analyseras"}`);
      const img = document.createElement("img");
      img.src = item.previewUrl;
      img.alt = `Plagg ${index + 1}`;
      const state = document.createElement("span");
      state.className = `thumb-status ${item.visionReady ? "is-ready" : item.analysisInProgress ? "is-working" : item.analysisMode === "manual" ? (item.approved ? "is-saved" : "is-manual") : "is-working"}`;
      state.textContent = item.visionReady || item.approved ? "✓" : "";
      state.setAttribute("aria-hidden", "true");
      wrap.addEventListener("click", () => {
        if (suppressWorkspaceClick) return;
        currentIndex = index;
        workspacePage = page;
        editReturnView = "workspace";
        populateFormFromItem(true);
        showStage("editCard", "edit");
      });
      wrap.append(img, state);
      grid.appendChild(wrap);
      });
      while (grid.children.length < WORKSPACE_PAGE_SIZE) {
        const placeholder = document.createElement("span");
        placeholder.className = "vision-grid-placeholder";
        placeholder.setAttribute("aria-hidden", "true");
        grid.appendChild(placeholder);
      }
      track.appendChild(grid);
    }
    strip.appendChild(track);
    setWorkspacePage(workspacePage, false);
    strip.hidden = batchItems.length === 0;
    renderWorkspacePager(pageCount);
    const help = $("#batchHelp");
    if (help) help.hidden = batchItems.length === 0;
    updateWorkspaceState();
    applyCaptureMode();
  }

  function renderWorkspacePager(pageCount = Math.max(1, Math.ceil(batchItems.length / WORKSPACE_PAGE_SIZE))) {
    const pager = $("#batchPager");
    if (!pager) return;
    pager.innerHTML = "";
    pager.hidden = pageCount <= 1;
    for (let page = 0; page < pageCount; page += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = page === workspacePage ? "is-active" : "";
      dot.setAttribute("aria-label", `Visa sida ${page + 1}`);
      dot.addEventListener("click", () => setWorkspacePage(page, true));
      pager.appendChild(dot);
    }
  }

  function setWorkspacePage(page, animate = true) {
    const track = $("#batchStrip")?.querySelector(".vision-grid-track");
    const pageCount = Math.max(1, Math.ceil(batchItems.length / WORKSPACE_PAGE_SIZE));
    workspacePage = Math.max(0, Math.min(page, pageCount - 1));
    if (track) {
      track.style.transition = animate ? "transform 320ms cubic-bezier(.22,.72,.22,1)" : "none";
      track.style.transform = `translate3d(${-workspacePage * 100}%,0,0)`;
    }
    renderWorkspacePager(pageCount);
  }

  function installWorkspaceSwipe() {
    const strip = $("#batchStrip");
    if (!strip) return;
    strip.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const track = strip.querySelector(".vision-grid-track");
      if (!track || Math.ceil(batchItems.length / WORKSPACE_PAGE_SIZE) <= 1) return;
      workspaceSwipe = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, horizontal: false };
      track.style.transition = "none";
    });
    strip.addEventListener("pointermove", (event) => {
      if (!workspaceSwipe || workspaceSwipe.id !== event.pointerId) return;
      const dx = event.clientX - workspaceSwipe.x;
      const dy = event.clientY - workspaceSwipe.y;
      if (!workspaceSwipe.horizontal && Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.35) {
        workspaceSwipe.horizontal = true;
        strip.setPointerCapture?.(event.pointerId);
      }
      if (!workspaceSwipe.horizontal) return;
      event.preventDefault();
      workspaceSwipe.dx = dx;
      suppressWorkspaceClick = true;
      const lastPage = Math.ceil(batchItems.length / WORKSPACE_PAGE_SIZE) - 1;
      const atEdge = (workspacePage === 0 && dx > 0) || (workspacePage === lastPage && dx < 0);
      const resisted = atEdge ? dx * .24 : dx;
      strip.querySelector(".vision-grid-track").style.transform = `translate3d(calc(${-workspacePage * 100}% + ${resisted}px),0,0)`;
    }, { passive: false });
    const finish = (event) => {
      if (!workspaceSwipe || workspaceSwipe.id !== event.pointerId) return;
      const { dx, horizontal } = workspaceSwipe;
      workspaceSwipe = null;
      if (horizontal && Math.abs(dx) > Math.max(42, strip.clientWidth * .16)) setWorkspacePage(workspacePage + (dx < 0 ? 1 : -1), true);
      else setWorkspacePage(workspacePage, true);
      setTimeout(() => { suppressWorkspaceClick = false; }, 80);
    };
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((name) => strip.addEventListener(name, finish));
  }

  function resetCaptureVisual() {
    const preview = $("#mainPreview");
    preview.hidden = true;
    preview.removeAttribute("src");
    $("#startCameraBtn").classList.remove("has-image");
    $("#startCameraBtn .action-copy strong").textContent = batchItems.length ? "Fota nästa plagg" : "Ta ett foto";
  }

  function updateCameraSessionCount(reviewing = false) {
    const count = batchItems.length + (stagedItem ? 1 : 0);
    const label = $("#cameraSessionCount");
    if (!label) return;
    label.textContent = reviewing && stagedItem
      ? `Foto ${count} · totalt ${count} ${count === 1 ? "plagg" : "plagg"}`
      : `${count} ${count === 1 ? "plagg fotograferat" : "plagg fotograferade"}`;
  }

  async function startCamera() {
    /* Ett nytt kamerabesök ska fortsätta den aktiva lokala sessionen. Det får
       aldrig tyst ersätta bilder som redan fotograferats. */
    if (!batchItems.length && savedSessionSummary?.count) {
      try { await restoreSavedVisionSession(); }
      catch (error) { console.error("[CCC Vision] Kunde inte återuppta session före kamera", error); }
    }
    stagedCameraFile = null;
    stagedItem = null;
    updateCameraSessionCount(false);
    $("#cameraReview").hidden = true;
    $("#cameraVideo").hidden = false;
    $("#cameraLiveActions").hidden = false;
    $("#cameraReviewActions").hidden = true;
    $("#cameraOverlay").hidden = false;
    document.body.classList.add("camera-open");
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      $("#cameraVideo").srcObject = cameraStream;
      configureCameraZoom();
    } catch (error) {
      closeCamera();
      $("#cameraFallbackInput").click();
    }
  }

  function configureCameraZoom() {
    const controls = $("#cameraZoomControls");
    const track = cameraStream?.getVideoTracks?.()[0];
    if (!controls || !track) return;
    const capabilities = track.getCapabilities?.() || {};
    const min = Number(capabilities.zoom?.min ?? 1);
    const max = Number(capabilities.zoom?.max ?? 1);
    const supportsZoom = Number.isFinite(min) && Number.isFinite(max) && max > min;
    cameraZoomState.min = min;
    cameraZoomState.max = max;
    cameraZoomState.current = Math.max(min, Math.min(max, 1));
    controls.querySelectorAll("[data-camera-zoom]").forEach((button) => {
      const requested = Number(button.dataset.cameraZoom || 1);
      button.hidden = requested !== 1 && (!supportsZoom || requested < min || requested > max);
      button.classList.toggle("is-active", requested === 1);
    });
  }

  async function setCameraZoom(requested) {
    const track = cameraStream?.getVideoTracks?.()[0];
    if (!track) return;
    const capabilities = track.getCapabilities?.() || {};
    const min = Number(capabilities.zoom?.min ?? 1);
    const max = Number(capabilities.zoom?.max ?? 1);
    const zoom = Math.max(min, Math.min(max, Number(requested) || 1));
    try {
      await track.applyConstraints({ advanced: [{ zoom }] });
      cameraZoomState.current = zoom;
      $("#cameraZoomControls")?.querySelectorAll("[data-camera-zoom]").forEach((button) =>
        button.classList.toggle("is-active", Number(button.dataset.cameraZoom) === Number(requested))
      );
    } catch (error) {
      console.warn("[CCC Vision] Kameran kunde inte byta zoom", error);
    }
  }

  function installCameraPinchZoom() {
    const viewport = $(".camera-viewport");
    if (!viewport) return;
    const distance = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    viewport.addEventListener("touchstart", (event) => {
      if (event.touches.length !== 2 || cameraZoomState.max <= cameraZoomState.min) return;
      event.preventDefault();
      cameraZoomState.pinchStartDistance = distance(event.touches);
      cameraZoomState.pinchStartZoom = cameraZoomState.current;
    }, { passive: false });
    viewport.addEventListener("touchmove", (event) => {
      if (event.touches.length !== 2 || !cameraZoomState.pinchStartDistance || cameraZoomState.max <= cameraZoomState.min) return;
      event.preventDefault();
      const ratio = distance(event.touches) / cameraZoomState.pinchStartDistance;
      const requested = Math.max(cameraZoomState.min, Math.min(cameraZoomState.max, cameraZoomState.pinchStartZoom * ratio));
      setCameraZoom(requested);
    }, { passive: false });
    viewport.addEventListener("touchend", (event) => {
      if (event.touches.length < 2) cameraZoomState.pinchStartDistance = 0;
    }, { passive: true });
  }

  function stopCameraStream() {
    if (!cameraStream) return;
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
    $("#cameraVideo").srcObject = null;
  }

  function closeCamera() {
    stopCameraStream();
    $("#cameraOverlay").hidden = true;
    document.body.classList.remove("camera-open");
  }

  function closeCameraSafely() {
    /* X betyder lämna kameran, inte kasta fotot som redan tagits. */
    if (stagedItem) commitStagedItem();
    closeCamera();
    resetCaptureVisual();
    if (batchItems.length) showWorkspace();
  }

  function captureFrame() {
    const video = $("#cameraVideo");
    if (!video.videoWidth || !video.videoHeight) return;
    const canvas = $("#cameraCanvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      stagedCameraFile = new File([blob], `ccc-vision-${Date.now()}.jpg`, { type: "image/jpeg" });
      stagedItem = createBatchItem(stagedCameraFile, batchItems.length);
      updateCameraSessionCount(true);
      const reviewUrl = stagedItem.previewUrl;
      $("#cameraReview").src = reviewUrl;
      $("#cameraReview").hidden = false;
      $("#cameraVideo").hidden = true;
      $("#cameraLiveActions").hidden = true;
      $("#cameraReviewActions").hidden = false;
      // Vision arbetar redan tyst på stagedItem här.
    }, "image/jpeg", .9);
  }

  function retakePhoto() {
    if (stagedItem?.previewUrl) URL.revokeObjectURL(stagedItem.previewUrl);
    stagedCameraFile = null;
    stagedItem = null;
    updateCameraSessionCount(false);
    $("#cameraReview").removeAttribute("src");
    $("#cameraReview").hidden = true;
    $("#cameraVideo").hidden = false;
    $("#cameraLiveActions").hidden = false;
    $("#cameraReviewActions").hidden = true;
  }

  function commitStagedItem() {
    if (!stagedItem) return false;
    batchItems.push(stagedItem);
    stagedItem = null;
    stagedCameraFile = null;
    updateCameraSessionCount(false);
    updateBatchStrip();
    // Kamerans AI-analys kan bli färdig redan innan användaren trycker Klar.
    // När plagget först nu läggs i batchItems måste kostnadsrutan uppdateras igen,
    // annars står den kvar på "väntar på AI-analys" trots att usage redan finns.
    refreshCostUi();
    queueVisionSessionSave();
    return true;
  }

  function nextPhoto() {
    if (!commitStagedItem()) return;
    $("#cameraReview").removeAttribute("src");
    $("#cameraReview").hidden = true;
    $("#cameraVideo").hidden = false;
    $("#cameraLiveActions").hidden = false;
    $("#cameraReviewActions").hidden = true;
  }

  async function finishCameraSeries() {
    commitStagedItem();
    closeCamera();
    resetCaptureVisual();
    updateBatchStrip();
    showWorkspace();
  }

  function handleFallbackCamera(fileList) {
    const files = [...fileList].filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    files.forEach((file) => batchItems.push(createBatchItem(file, batchItems.length)));
    queueVisionSessionSave();
    updateBatchStrip();
    resetCaptureVisual();
    showWorkspace();
  }

  function handleGalleryFiles(fileList) {
    const files = [...fileList].filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;
    files.forEach((file) => batchItems.push(createBatchItem(file, batchItems.length)));
    queueVisionSessionSave();
    updateBatchStrip();
    resetCaptureVisual();
    // Bildväljaren är nu stängd: CCC arbetar i bakgrunden medan användaren kan fortsätta.
    showWorkspace();
    $("#galleryInput").value = "";
  }

  async function openReview(index) {
    if (!batchItems.length) {
      showVisionStart();
      return;
    }
    currentIndex = Math.max(0, Math.min(index, batchItems.length - 1));
    const item = currentItem();

    if (!item.visionReady && item.analysisMode === "manual") {
      editReturnView = "workspace";
      populateFormFromItem(true);
      showStage("editCard", "edit");
      return;
    }

    if (!item.visionReady) await item.analysisPromise;
    const demo = item.visionResult || currentDemo();
    window.CCC_VISION_DEMO = demo;
    $("#summaryTitle").textContent = demo.summaryTitle;
    $("#summaryBrand").textContent = demo.summaryBrand;
    $("#summarySeason").textContent = demo.summarySeason;
    $("#confidencePill").textContent = item.extraFiles.length && item.analysisMode === "ai" ? "Säkerheten är hög" : demo.confidence;
    $("#batchProgress").textContent = `${currentIndex + 1} av ${batchItems.length}`;
    $("#visionThumbnail").src = item.previewUrl;
    $("#visionThumbnail").hidden = false;
    let modeNote;
    if (item.analysisMode === "ai") {
      modeNote = "CCC Vision analyserade bilden med AI.";
    } else if (item.analysisError) {
      const statusText = item.analysisHttpStatus ? ` (HTTP ${item.analysisHttpStatus})` : "";
      modeNote = `AI-fel${statusText}: ${item.analysisError} Demo visas tills felet är löst.`;
    } else {
      modeNote = "Testläge – AI-endpoint är inte konfigurerad.";
    }
    $("#visionHint").textContent = item.extraFiles.length
      ? `${item.extraFiles.length + 1} bilder används för det här plagget. ${modeNote}`
      : `${modeNote} Vill du visa mer av just det här plagget kan du lägga till fler bilder.`;
    $("#correctionBox").hidden = true;
    updateBatchStrip();
    showStage("visionCard", "suggestion");
  }

  function openItemForWork(index) {
    if (index < 0 || index >= batchItems.length) return;
    currentIndex = index;
    const item = currentItem();

    /* AI av = manuell arbetsvy. Inga demo-/AI-förslag får visas automatiskt. */
    if (!item.visionReady && item.analysisMode === "manual") {
      editReturnView = "workspace";
      populateFormFromItem(true);
      showStage("editCard", "edit");
      return;
    }

    /* AI på/pågående eller färdigt förslag använder ordinarie review-flöde. */
    return openReview(index);
  }

  function moveToNextItem() {
    const next = batchItems.findIndex((item, index) => index > currentIndex && !item.approved);
    if (next >= 0) return openItemForWork(next);
    const earlier = batchItems.findIndex((item) => !item.approved);
    if (earlier >= 0) return openItemForWork(earlier);
    finishBatch();
  }

  function rememberApprovedItem(item) {
    if (!visionSettings().learnEdits) return;
    const fields = item?.editedFields || item?.visionResult?.fields;
    if (!fields) return;
    const subject = (fields.manufacturer || fields.brand || "").trim();
    const season = (fields.season || "").trim();
    if (!subject || !season) return;
    const key = `${subject.toLowerCase()}::${season.toLowerCase()}`;
    window.CCC_VISION_KNOWLEDGE?.remember?.({
      key, subject, season,
      brand: fields.brand || "",
      category: fields.category || "",
      source: item.editedFields ? "user-confirmed" : "ai-confirmed",
      confidence: item.visionResult?.confidence || ""
    }).then(() => window.CCC_VISION_KNOWLEDGE?.metric?.({ type: "knowledge_saved", key })).catch(() => {});
  }

  function openWorkspaceDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("ccc-local-workspace", 3);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("images")) {
          const store = db.createObjectStore("images", { keyPath: "id" });
          store.createIndex("createdAt", "createdAt");
        }
        if (!db.objectStoreNames.contains("sessions")) {
          db.createObjectStore("sessions", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("vision-files")) {
          const store = db.createObjectStore("vision-files", { keyPath: "id" });
          store.createIndex("createdAt", "createdAt");
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error("IndexedDB-uppgraderingen blockerades av en annan öppen CCC-flik."));
    });
  }

  function storageErrorDetails(error) {
    return {
      name: error?.name || "UnknownError",
      message: error?.message || String(error || "Okänt lagringsfel")
    };
  }

  async function putVisionSourceFile(id, file, metadata = null) {
    if (!id || !file) return;
    const db = await openWorkspaceDb();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction("vision-files", "readwrite");
        tx.objectStore("vision-files").put({
          id,
          blob: file,
          name: file.name || `${id}.jpg`,
          type: file.type || "image/jpeg",
          createdAt: Date.now(),
          metadata: metadata && typeof metadata==="object" ? metadata : null
        });
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error || new Error("Kunde inte spara originalbild."));
        tx.onabort = () => reject(tx.error || new Error("Sparningen av originalbild avbröts."));
      });
    } finally {
      db.close();
    }
  }

  async function getVisionSourceFile(id) {
    if (!id) return null;
    const db = await openWorkspaceDb();
    try {
      const record = await new Promise((resolve, reject) => {
        const tx = db.transaction("vision-files", "readonly");
        const request = tx.objectStore("vision-files").get(id);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
      return record ? sessionFile(record.blob, record.name, record.type) : null;
    } finally {
      db.close();
    }
  }

  function buildItemImageMetadata(item, fields = null) {
    const f=fields || item?.editedFields || item?.visionResult?.fields || {};
    return {
      schemaVersion:1,
      cccItemId:String(item?.cccItemId||""),
      internalId:String(item?.id||""),
      title:String(f?.title||item?.visionResult?.summaryTitle||"").trim(),
      brand:String(f?.brand||f?.manufacturer||"").trim(),
      size:String(f?.size||"").trim(),
      price:String(f?.price||"").trim(),
      description:String(f?.description||"").trim(),
      source:"ccc-vision",
      updatedAt:new Date().toISOString()
    };
  }

  async function updateVisionSourceMetadata(id, metadata) {
    if(!id || !metadata)return;
    const db=await openWorkspaceDb();
    try{
      await new Promise((resolve,reject)=>{
        const tx=db.transaction("vision-files","readwrite");
        const store=tx.objectStore("vision-files");
        const req=store.get(id);
        req.onsuccess=()=>{
          const record=req.result;
          if(!record)return;
          store.put({...record,metadata});
        };
        req.onerror=()=>reject(req.error);
        tx.oncomplete=resolve;
        tx.onerror=()=>reject(tx.error||new Error("Bildmetadata kunde inte sparas."));
        tx.onabort=()=>reject(tx.error||new Error("Bildmetadata-sparning avbröts."));
      });
    }finally{
      db.close();
    }
  }

  async function ensureItemSourceFiles(item) {
    if (!item?.file) return;

    item.originalFileKey ||= `${item.id}:main`;

    if (!item.originalFileStored) {
      if (item.originalFileSavePromise) {
        await item.originalFileSavePromise;
      } else {
        item.originalFileSavePromise = putVisionSourceFile(item.originalFileKey, item.file, buildItemImageMetadata(item))
          .then(() => {
            item.originalFileStored = true;
            item.originalFileSavePromise = null;
          })
          .catch((error) => {
            item.originalFileStored = false;
            item.originalFileSavePromise = null;
            throw error;
          });
        await item.originalFileSavePromise;
      }
    }

    item.extraFileKeys ||= [];
    item.extraFileStored ||= [];
    item.extraFileSavePromises ||= [];

    for (let index = 0; index < (item.extraFiles || []).length; index += 1) {
      if (item.extraFileStored[index]) continue;

      const file = item.extraFiles[index];
      const key = item.extraFileKeys[index] || `${item.id}:extra:${index + 1}`;
      item.extraFileKeys[index] = key;

      if (item.extraFileSavePromises[index]) {
        await item.extraFileSavePromises[index];
        continue;
      }

      item.extraFileSavePromises[index] = putVisionSourceFile(key, file)
        .then(() => {
          item.extraFileStored[index] = true;
          item.extraFileSavePromises[index] = null;
        })
        .catch((error) => {
          item.extraFileStored[index] = false;
          item.extraFileSavePromises[index] = null;
          throw error;
        });

      await item.extraFileSavePromises[index];
    }
  }

  async function putVisionSessionRecord(record) {
    const db = await openWorkspaceDb();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction("sessions", "readwrite");
        tx.objectStore("sessions").put(record);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error || new Error("Kunde inte spara sessionsdata."));
        tx.onabort = () => reject(tx.error || new Error("Sessionssparningen avbröts."));
      });
    } finally {
      db.close();
    }
  }

  async function getVisionSessionRecord() {
    const db = await openWorkspaceDb();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction("sessions", "readonly");
        const request = tx.objectStore("sessions").get("vision-active");
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  }

  async function clearVisionSessionRecord() {
    const db = await openWorkspaceDb();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction("sessions", "readwrite");
        tx.objectStore("sessions").delete("vision-active");
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
    savedSessionSummary = null;
  }

  function sessionFile(blob, name, type) {
    if (!blob) return null;
    try {
      return new File([blob], name || `ccc-${uid()}.jpg`, { type: type || blob.type || "image/jpeg" });
    } catch (_) {
      blob.name = name || `ccc-${uid()}.jpg`;
      return blob;
    }
  }

  async function saveVisionSessionLocally() {
    if (!batchItems.length) return false;

    /* Vänta bara in original som ännu inte hunnit förlagras.
       Redan sparade original skrivs aldrig om när sessionsmetadata uppdateras. */
    for (const item of batchItems) {
      await ensureItemSourceFiles(item);
    }

    const items = batchItems.map((item) => ({
      id: item.id,
      cccItemId: item.cccItemId || cccItemId(),
      originalFileKey: item.originalFileKey,
      extraFileKeys: [...(item.extraFileKeys || [])],
      demoKey: item.demoKey,
      approved: !!item.approved,
      editedFields: item.editedFields || null,
      visionReady: !!item.visionReady,
      visionResult: item.visionResult || null,
      analysisMode: item.analysisMode || "manual",
      aiUsage: item.aiUsage || null,
      aiModel: item.aiModel || "",
      aiCostUsd: Number(item.aiCostUsd || 0),
      aiCostSek: Number(item.aiCostSek || 0),
      cropData: item.cropData || null
    }));

    const record = {
      id: "vision-active",
      schemaVersion: 2,
      savedAt: new Date().toISOString(),
      currentIndex,
      count: items.length,
      items
    };

    await putVisionSessionRecord(record);
    savedSessionSummary = { count: items.length, savedAt: record.savedAt };
    saveBatchMetadata();
    return true;
  }

  async function refreshSavedSessionSummary() {
    try {
      const record = await getVisionSessionRecord();
      savedSessionSummary = record?.items?.length
        ? { count: record.items.length, savedAt: record.savedAt }
        : null;
    } catch (error) {
      console.warn("[CCC Vision] Kunde inte läsa sparad fotosession", error);
      savedSessionSummary = null;
    }
    applyCaptureMode();
  }

  async function restoreSavedVisionSession() {
    const record = await getVisionSessionRecord();
    if (!record?.items?.length) {
      savedSessionSummary = null;
      showVisionStart();
      return;
    }

    batchItems.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      (item.extraUrls || []).forEach((url) => URL.revokeObjectURL(url));
    });

    const restored = [];
    for (const saved of record.items) {
      /* v3: referenser till vision-files. v2 fallback: Blob låg direkt i sessionen. */
      const originalKey = saved.originalFileKey || `${saved.id}:main`;
      let file = saved.originalFileKey ? await getVisionSourceFile(saved.originalFileKey) : null;
      if (!file && saved.originalBlob) {
        file = sessionFile(saved.originalBlob, saved.originalName, saved.originalType);
        await putVisionSourceFile(originalKey, file);
      }
      if (!file) {
        console.warn("[CCC Vision] Saknar originalfil för sparat plagg", saved.id);
        continue;
      }

      const extraFiles = [];
      const extraKeys = [...(saved.extraFileKeys || [])];
      if (extraKeys.length) {
        for (const key of extraKeys) {
          const extra = await getVisionSourceFile(key);
          if (extra) extraFiles.push(extra);
        }
      } else if (saved.extraBlobs?.length) {
        for (let index = 0; index < saved.extraBlobs.length; index += 1) {
          const extra = sessionFile(saved.extraBlobs[index], saved.extraNames?.[index], saved.extraTypes?.[index]);
          const key = `${saved.id}:extra:${index + 1}`;
          await putVisionSourceFile(key, extra);
          extraKeys.push(key);
          extraFiles.push(extra);
        }
      }

      restored.push({
        id: saved.id || uid(),
        cccItemId: saved.cccItemId || cccItemId(),
        file,
        previewUrl: fileUrl(file),
        originalFileKey: originalKey,
        originalFileStored: true,
        originalFileSavePromise: null,
        extraFiles,
        extraUrls: extraFiles.map(fileUrl),
        extraFileKeys: extraKeys,
        extraFileStored: extraFiles.map(() => true),
        extraFileSavePromises: extraFiles.map(() => null),
        demoKey: saved.demoKey || "arsenal",
        visionReady: !!saved.visionReady,
        visionResult: saved.visionResult || null,
        analysisInProgress: false,
        approved: !!saved.approved,
        editedFields: saved.editedFields || null,
        analysisPromise: null,
        analysisMode: saved.analysisMode || "manual",
        aiUsage: saved.aiUsage || null,
        aiModel: saved.aiModel || "",
        aiCostUsd: Number(saved.aiCostUsd || 0),
        aiCostSek: Number(saved.aiCostSek || 0),
        publishFile: null,
        publishUrl: null,
        cropData: saved.cropData || null
      });
    }

    batchItems = restored;
    currentIndex = Math.min(Number(record.currentIndex || 0), Math.max(0, batchItems.length - 1));
    savedSessionSummary = batchItems.length ? { count: batchItems.length, savedAt: record.savedAt } : null;

    batchItems.forEach((item) => {
      if (!item.visionReady && item.analysisMode !== "manual" && visionSettings().aiAuto) {
        startSilentAnalysis(item, true);
      }
    });

    showWorkspace();
  }


  async function saveApprovedDraftLocally(item) {
    if (!item?.file) return;
    await ensureItemSourceFiles(item);

    const fields = item.editedFields || item.visionResult?.fields || {};
    const imageMetadata=buildItemImageMetadata(item,fields);
    item.cccItemId ||= cccItemId();
    imageMetadata.cccItemId=item.cccItemId;
    await updateVisionSourceMetadata(item.originalFileKey,imageMetadata);

    const record = {
      id: item.id,
      cccItemId: item.cccItemId,
      imageMetadata,
      originalFileKey: item.originalFileKey,
      originalName: item.file.name || `ccc-${item.id}`,
      originalType: item.file.type || "image/jpeg",
      createdAt: item.createdAt || Date.now(),
      source: "vision",
      imageProcessingState: "original",
      readyToPublish: true,
      title: (fields.title || item.visionResult?.summaryTitle || "").trim(),
      brand: (fields.brand || fields.manufacturer || "").trim(),
      size: (fields.size || "").trim(),
      price: (fields.price || "").trim(),
      description: (fields.description || "").trim(),
      fields
    };

    const db = await openWorkspaceDb();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction("images", "readwrite");
        tx.objectStore("images").put(record);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error || new Error("Kunde inte spara Publicera-utkast."));
        tx.onabort = () => reject(tx.error || new Error("Publicera-utkastets sparning avbröts."));
      });
    } finally {
      db.close();
    }
  }

  async function approveCurrent() {
    const item = currentItem();
    if (!item) return;
    if (!item.editedFields) item.editedFields = { ...currentDemo().fields };
    rememberApprovedItem(item);
    try {
      await saveApprovedDraftLocally(item);
      item.approved = true;
      saveBatchMetadata();
      moveToNextItem();
    } catch (error) {
      console.error("[CCC Vision] Utkast kunde inte sparas lokalt", error);
      setMessage("Utkastet kunde inte sparas lokalt. Försök igen.");
    }
  }

  function populateFormFromItem(allowWhileAnalyzing = false) {
    const item = currentItem();
    if (!item) return;
    const aiFields = item?.visionResult?.fields || {};
    const fields = item?.editedFields || (item.visionReady ? aiFields : {});
    fieldIds.forEach((id) => {
      $("#" + id).value = fields[id] !== undefined ? fields[id] : "";
    });
    const progress = $("#editProgress");
    if (progress) progress.textContent = `${currentIndex + 1} av ${batchItems.length}`;
    renderSameGarmentEditor();
    if (allowWhileAnalyzing && !item.visionReady && !item.editedFields) {
      item.editedFields = Object.fromEntries(fieldIds.map((id) => [id, $("#" + id).value]));
    }
    updateCounters();
    updateTextPreviews();
    updateSmartSuggestions();
    const manualAi = $("#manualAiBtn");
    if (manualAi) {
      const canAnalyze = !!window.CCC_VISION_AI?.configured?.();
      manualAi.hidden = !canAnalyze;
      manualAi.disabled = !!item.analysisInProgress;
      manualAi.textContent = item.analysisInProgress ? "Analyserar…" : (item.visionReady ? "Analysera igen" : "Analysera med AI");
      manualAi.classList.toggle("is-secondary", !!item.visionReady);
    }
  }

  function renderSameGarmentEditor() {
    const item = currentItem();
    const list = $("#sameGarmentThumbs");
    if (!item || !list) return;
    list.innerHTML = "";
    const main = document.createElement("div");
    main.className = "same-garment-thumb is-main";
    main.innerHTML = `<img src="${item.previewUrl}" alt="Huvudbild"><span>Huvudbild</span>`;
    list.appendChild(main);
    (item.extraUrls || []).forEach((url, index) => {
      const cell = document.createElement("div");
      cell.className = "same-garment-thumb";
      const img = document.createElement("img");
      img.src = url;
      img.alt = `Extrabild ${index + 1}`;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.setAttribute("aria-label", `Ta bort extrabild ${index + 1}`);
      remove.textContent = "×";
      remove.addEventListener("click", () => removeSameGarmentImage(index));
      cell.append(img, remove);
      list.appendChild(cell);
    });
    while (list.children.length < 3) {
      const add = document.createElement("button");
      add.type = "button";
      add.className = "same-garment-thumb same-garment-add";
      const firstEmpty = list.children.length === 1;
      if (firstEmpty) {
        add.innerHTML = "<strong>＋</strong><span>Nytt foto</span>";
        add.addEventListener("click", () => $("#sameGarmentCameraInput")?.click());
      } else {
        add.innerHTML = `<strong>＋</strong><span>${item.extraFiles.length ? "Lägg till" : "Album"}</span>`;
        add.addEventListener("click", () => $("#sameGarmentInput")?.click());
      }
      list.appendChild(add);
    }
    const count = $("#sameGarmentCount");
    if (count) count.textContent = `(${item.extraFiles.length + 1}/3)`;
  }

  function removeSameGarmentImage(index) {
    const item = currentItem();
    if (!item || index < 0 || index >= item.extraFiles.length) return;
    if (item.extraUrls[index]) URL.revokeObjectURL(item.extraUrls[index]);
    item.extraFiles.splice(index, 1);
    item.extraUrls.splice(index, 1);
    item.extraFileKeys.splice(index, 1);
    item.extraFileStored.splice(index, 1);
    item.extraFileSavePromises.splice(index, 1);
    renderSameGarmentEditor();
    startSilentAnalysis(item, true);
    scheduleAutosave();
  }

  function editCurrent(allowWhileAnalyzing = false) {
    editReturnView = allowWhileAnalyzing && !currentItem()?.visionReady ? "workspace" : "suggestion";
    populateFormFromItem(allowWhileAnalyzing);
    showStage("editCard", "edit");
  }

  async function saveEditedCurrent({ advance = false, quiet = false } = {}) {
    const item = currentItem();
    if (!item) return false;

    item.editedFields = Object.fromEntries(fieldIds.map((id) => [id, $("#" + id).value]));
    if (!quiet) rememberApprovedItem(item);

    try {
      await saveApprovedDraftLocally(item);
      item.approved = true;
      saveBatchMetadata();

      /* Håll även pausad fotosession synkad om användaren senare vill fortsätta. */
      if (batchItems.length) {
        saveVisionSessionLocally().catch((error) =>
          console.warn("[CCC Vision] Kunde inte synka aktiv fotosession efter Spara", error)
        );
      }

      if (advance) {
        if (editReturnView === "done") finishBatch();
        else moveToNextItem();
      } else if (!quiet) {
        const state = $("#draftState");
        if (state) state.textContent = "✓ Sparat automatiskt";
        setMessage("Plagget är sparat. Du kan fortsätta här eller välja ett annat plagg.");
      }
      return true;
    } catch (error) {
      console.error("[CCC Vision] Utkast kunde inte sparas lokalt", error);
      setMessage("Utkastet kunde inte sparas lokalt. Försök igen.");
      return false;
    }
  }

  async function saveEditedAndNext() {
    return saveEditedCurrent({ advance: true });
  }

  function scheduleAutosave() {
    const sequence = ++autosaveSequence;
    const state = $("#draftState");
    if (state) state.textContent = "Sparar…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      const ok = await saveEditedCurrent({ quiet: true });
      if (sequence !== autosaveSequence) return;
      if (state) state.textContent = ok ? "✓ Sparat automatiskt" : "Kunde inte spara";
    }, 500);
  }

  async function flushAutosave() {
    clearTimeout(saveTimer);
    autosaveSequence += 1;
    if (visionView !== "edit" || !currentItem()) return true;
    const state = $("#draftState");
    if (state) state.textContent = "Sparar…";
    const ok = await saveEditedCurrent({ quiet: true });
    if (state) state.textContent = ok ? "✓ Sparat automatiskt" : "Kunde inte spara";
    return ok;
  }

  function saveEditedAndBack() {
    const item = currentItem();
    if (!item) return;

    /* Läs formuläret synkront medan redigeringsvyn fortfarande är aktiv. */
    item.editedFields = Object.fromEntries(fieldIds.map((id) => [id, $("#" + id).value]));
    item.approved = true;
    rememberApprovedItem(item);
    saveBatchMetadata();

    /* Navigation väntar inte på IndexedDB.
       Vision behåller originalbilden; slutlig bildbearbetning hör hemma i Publicera. */
    editReturnView = "workspace";
    showWorkspace();

    /* Spara original + metadata med samma item.id i bakgrunden.
       put() uppdaterar befintlig post; ingen WebP skapas i Vision. */
    saveApprovedDraftLocally(item)
      .then(() => saveVisionSessionLocally())
      .then(() => {
        updateBatchStrip();
      })
      .catch((error) => {
        console.error("[CCC Vision] Bakgrundssparning efter Spara & tillbaka misslyckades", error);
        setMessage("Plagget kunde inte sparas lokalt. Öppna det igen och försök på nytt.");
      });
  }

  function addSameGarmentFiles(fileList) {
    const item = currentItem();
    if (!item) return;
    const available = Math.max(0, 2 - item.extraFiles.length);
    const files = [...fileList].filter((f) => f.type.startsWith("image/")).slice(0, available);
    files.forEach((file) => {
      const key = `${item.id}:extra:${uid()}`;
      item.extraFiles.push(file);
      item.extraUrls.push(fileUrl(file));
      item.extraFileKeys ||= [];
      item.extraFileStored ||= [];
      item.extraFileSavePromises ||= [];
      item.extraFileKeys.push(key);
      const extraIndex = item.extraFiles.length - 1;
      item.extraFileStored[extraIndex] = false;
      item.extraFileSavePromises[extraIndex] = putVisionSourceFile(key, file)
        .then(() => {
          item.extraFileStored[extraIndex] = true;
          item.extraFileSavePromises[extraIndex] = null;
        })
        .catch((error) => {
          item.extraFileStored[extraIndex] = false;
          item.extraFileSavePromises[extraIndex] = null;
          const detail = storageErrorDetails(error);
          console.error("[CCC Vision] Extra originalbild kunde inte förlagras", detail, error);
          throw error;
        });
      item.extraFileSavePromises[extraIndex].catch(() => {});
    });
    if (files.length) {
      renderSameGarmentEditor();
      queueVisionSessionSave();
      startSilentAnalysis(item);
      item.analysisPromise.then(() => {
        if (visionView === "edit") {
          populateFormFromItem(true);
          scheduleAutosave();
        } else if (!$("#captureCard").hidden) updateBatchStrip();
        else openReview(currentIndex);
      });
    }
    $("#sameGarmentInput").value = "";
  }

  function trashCurrentFromEdit() {
    if (!batchItems.length) return;
    if (!confirm("Ta bort plagget och bilderna från den här Vision-sessionen?")) return;
    const removedIndex = currentIndex;
    const [removed] = batchItems.splice(removedIndex, 1);
    trashStack.push({ item: removed, index: removedIndex });
    showUndoToast();

    if (!batchItems.length) {
      clearVisionSessionRecord().catch(() => {});
      showVisionStart();
      return;
    }

    currentIndex = Math.min(removedIndex, batchItems.length - 1);
    saveBatchMetadata();
    showWorkspace();
    updateBatchStrip();
    applyCaptureMode();
    saveVisionSessionLocally().catch((error) =>
      console.warn("[CCC Vision] Session kunde inte synkas efter borttagning", error)
    );
  }

  function trashCurrent() {
    if (!batchItems.length) return;
    const [removed] = batchItems.splice(currentIndex, 1);
    trashStack.push({ item: removed, index: currentIndex });
    showUndoToast();
    updateBatchStrip();
    if (!batchItems.length) {
      showVisionStart();
      return;
    }
    openReview(Math.min(currentIndex, batchItems.length - 1));
  }

  function showUndoToast() {
    const toast = $("#undoToast");
    toast.hidden = false;
    clearTimeout(showUndoToast.timer);
    showUndoToast.timer = setTimeout(() => { toast.hidden = true; }, 3500);
  }

  function undoTrash() {
    const last = trashStack.pop();
    if (!last) return;
    batchItems.splice(Math.min(last.index, batchItems.length), 0, last.item);
    $("#undoToast").hidden = true;
    updateBatchStrip();
    openReview(Math.min(last.index, batchItems.length - 1));
  }

  function readyItemTitle(item, index) {
    const fields = item?.editedFields || item?.visionResult?.fields || {};
    return (fields.title || item?.visionResult?.summaryTitle || `Plagg ${index + 1}`).trim();
  }

  function renderReadyPublishList() {
    const list = $("#readyPublishList");
    if (!list) return;
    list.innerHTML = "";
    const ready = batchItems.map((item, index) => ({ item, index })).filter(({ item }) => item.approved);
    ready.forEach(({ item, index }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ready-publish-item";
      button.setAttribute("aria-label", `Öppna ${readyItemTitle(item, index)} för redigering`);
      const img = document.createElement("img");
      img.src = item.previewUrl;
      img.alt = "";
      const copy = document.createElement("span");
      copy.className = "ready-publish-copy";
      const title = document.createElement("strong");
      title.textContent = readyItemTitle(item, index);
      const status = document.createElement("small");
      status.textContent = "✓ Klar";
      copy.append(title, status);
      const arrow = document.createElement("span");
      arrow.className = "ready-publish-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "›";
      button.append(img, copy, arrow);
      button.addEventListener("click", () => {
        currentIndex = index;
        editReturnView = "done";
        populateFormFromItem();
        showStage("editCard", "edit");
      });
      list.appendChild(button);
    });
    const publish = $("#publishReadyBtn");
    if (publish) { publish.textContent = `Publicera ${ready.length} ${ready.length === 1 ? "plagg" : "plagg"}`; publish.disabled = ready.length === 0; }
  }

  function finishBatch() {
    clearVisionSessionRecord().catch((error) => console.warn("[CCC Vision] Kunde inte rensa avslutad fotosession", error));
    const approved = batchItems.filter((item) => item.approved).length;
    $("#seriesDoneText").textContent = `${approved} ${approved === 1 ? "plagg är" : "plagg är"} ${approved === 1 ? "klart" : "klara"} att publiceras.`;
    renderReadyPublishList();
    saveBatchMetadata();
    showStage("seriesDoneCard", "done");
  }

  function newSeries() {
    // Behåll den färdiga publiceringskön och fortsätt fotografera i samma Vision-session.
    resetCaptureVisual();
    showWorkspace();
  }

  function saveBatchMetadata() {
    const meta = batchItems.map((item) => ({
      id: item.id,
      demoKey: item.demoKey,
      approved: item.approved,
      extraImageCount: item.extraFiles.length,
      publishReady: !!item.approved,
      fields: item.editedFields
    }));
    localStorage.setItem("ccc-vision-batch-meta", JSON.stringify({ savedAt: new Date().toISOString(), items: meta }));
  }

  function draftPayload() {
    return {
      savedAt: new Date().toISOString(),
      fields: Object.fromEntries(fieldIds.map((id) => [id, $("#" + id).value])),
      demoItem: currentItem()?.demoKey || "arsenal"
    };
  }

  function saveDraft(showMessage = true) {
    localStorage.setItem("ccc-vision-draft", JSON.stringify(draftPayload()));
    if ($("#draftState")) $("#draftState").textContent = "Sparat lokalt";
    if (showMessage) setMessage("Utkast sparat på den här enheten.");
  }

  function scheduleSave() {
    scheduleAutosave();
  }

  function clean(value) { return value.trim(); }

  function updateCounters() {
    $("#titleCount").textContent = $("#title").value.length;
    $("#descriptionCount").textContent = $("#description").value.length;
  }

  function updateTextPreviews() {
    const title = clean($("#title").value) || "Produktnamn saknas";
    const description = clean($("#description").value) || "Beskrivning saknas.";
    const price = clean($("#price").value);
    const size = clean($("#size").value);
    const meta = [size && `Storlek ${size}`, price && `${price} kr`].filter(Boolean).join(" · ");
    $("#webPreview").textContent = [title, description, meta].filter(Boolean).join("\n\n");
    $("#instagramPreview").textContent = `Nyinkommet ✨\n\n${title}\n${description}${meta ? `\n\n${meta}` : ""}\n\n#container13 #vintage #secondhand`;
    $("#facebookPreview").textContent = `Nyinkommet hos Container 13: ${title}. ${description}${price ? ` Pris: ${price} kr.` : ""}`;
  }

  function updateSmartSuggestions() {
    const demo = currentDemo();
    const priceSuggestion = Number(demo?.priceSuggestion || 0);
    $("#priceSuggestion").textContent = priceSuggestion > 0 ? `${priceSuggestion} kr` : "Ingen prisbedömning";
    $("#usePriceSuggestionBtn").disabled = priceSuggestion <= 0;
    $("#factSuggestionText").textContent = demo?.fact || "Ett kort extra fakta kan läggas till om du vill.";
  }

  function usePriceSuggestion() {
    const suggestion = Number(currentDemo()?.priceSuggestion || 0);
    if (suggestion <= 0) return;
    $("#price").value = suggestion;
    updateTextPreviews();
    scheduleSave();
  }

  function appendToDescription(text) {
    const area = $("#description");
    if (area.value.includes(text)) return;
    area.value = `${area.value.trim()}${area.value.trim() ? "\n\n" : ""}${text}`;
    updateCounters();
    updateTextPreviews();
    scheduleSave();
  }

  function addFact() {
    const fact = currentDemo()?.fact;
    if (fact) appendToDescription(`Visste du?\n${fact}`);
    $("#addFactBtn").textContent = "Tillagt i beskrivningen ✓";
    $("#addFactBtn").disabled = true;
  }

  function addNewCondition() {
    appendToDescription("Nyskick.");
    $("#addNewConditionBtn").textContent = "Tillagt i beskrivningen ✓";
    $("#addNewConditionBtn").disabled = true;
  }

  function closeOptionalExtras() {
    const dialog=$("#optionalExtrasDialog");
    if(dialog)dialog.hidden=true;
  }

  function setMessage(text) {
    ["message", "previewMessage"].forEach((id) => { const el = $("#" + id); if (el) el.textContent = text; });
  }

  async function copyPreview(targetId) {
    const text = $("#" + targetId).textContent;
    try { await navigator.clipboard.writeText(text); setMessage("Texten kopierades."); } catch {}
  }

  function chooseDemo(key) {
    const demo = window.CCC_VISION_DEMOS?.[key];
    if (!demo) return;
    const svgPath = `${key}.svg`;
    fetch(svgPath).then((r) => r.blob()).then((blob) => {
      const file = new File([blob], `${key}.svg`, { type: "image/svg+xml" });
      const item = createBatchItem(file, batchItems.length);
      item.demoKey = key;
      startSilentAnalysis(item);
      batchItems.push(item);
      updateBatchStrip();
      openReview(batchItems.length - 1);
    });
  }

  async function analyzeCurrentManually() {
    const item = currentItem();
    if (!item || item.analysisInProgress) return;

    const itemId = item.id;
    const startedIndex = currentIndex;
    const button = $("#manualAiBtn");
    const contextSub = $("#editContextSub");

    /* Spara det användaren redan skrivit innan AI-resultatet kommer. */
    const userFields = Object.fromEntries(fieldIds.map((id) => [id, $("#" + id).value]));

    item.analysisInProgress = true;
    if (button) { button.disabled = true; button.textContent = "Analyserar…"; }
    if (contextSub) {
      contextSub.hidden = false;
      contextSub.textContent = "CCC analyserar det här plagget…";
    }

    try {
      await startSilentAnalysis(item, true);

      const stillSelected = currentItem()?.id === itemId;
      if (!stillSelected) return;

      if (item.visionReady && item.visionResult?.fields) {
        const aiFields = item.visionResult.fields;
        console.info("[CCC Vision] Manuellt AI-resultat visas", { itemId, fields: Object.keys(aiFields) });

        /* AI fyller tomma fält men skriver aldrig över något användaren redan matat in. */
        fieldIds.forEach((id) => {
          const existing = String(userFields[id] ?? "").trim();
          const suggestion = aiFields[id] ?? "";
          $("#" + id).value = existing || suggestion;
        });

        item.editedFields = Object.fromEntries(fieldIds.map((id) => [id, $("#" + id).value]));
        updateCounters();
        updateTextPreviews();
        updateSmartSuggestions();

        const contextTitle = $("#editContextTitle");
        if (contextTitle) contextTitle.textContent = item.visionResult.summaryTitle || "AI-förslag klart";
        if (contextSub) {
          contextSub.hidden = false;
          contextSub.textContent = "AI-förslag klart – ändra det du vill.";
        }

        if (button) { button.hidden = false; button.textContent = "Analysera igen"; button.classList.add("is-secondary"); }
        saveBatchMetadata();
        scheduleAutosave();
      } else {
        const message = item.analysisError || "AI-analysen gav inget användbart resultat.";
        if (contextSub) {
          contextSub.hidden = false;
          contextSub.textContent = `AI-fel: ${message}`;
        }
      }
    } catch (error) {
      const stillSelected = currentItem()?.id === itemId;
      console.error("[CCC Vision] Manuell AI-analys avbröts oväntat", { itemId, startedIndex }, error);
      if (stillSelected && contextSub) {
        contextSub.hidden = false;
        contextSub.textContent = `AI-fel: ${error?.message || "Analysen kunde inte slutföras."}`;
      }
    } finally {
      item.analysisInProgress = false;

      if (currentItem()?.id === itemId && button) {
        button.disabled = false;
        button.textContent = item.visionReady ? "Analysera igen" : "Analysera med AI";
        button.classList.toggle("is-secondary", !!item.visionReady);
        button.hidden = !window.CCC_VISION_AI?.configured?.();
      }
      updateBatchStrip();
    }
  }

  function formatSek(value) {
    return `${Number(value || 0).toLocaleString("sv-SE", { minimumFractionDigits: 6, maximumFractionDigits: 6 })} kr`;
  }

  async function refreshCostUi() {
    const button = $("#visionCostBtn");
    if (!button) return;
    const visible = visionSettings().showCost;
    button.hidden = !visible;
    if (!visible) { $("#visionCostPopover")?.setAttribute("hidden", ""); return; }

    const aiItems = batchItems.filter((item) => item.aiUsage || item.aiModel || Number(item.aiCostSek || 0) > 0);
    const latestAiItem = aiItems.length ? aiItems[aiItems.length - 1] : null;
    const sessionSek = aiItems.reduce((sum, item) => sum + Number(item.aiCostSek || 0), 0);

    const sessionCostEl = $("#visionSessionCost");
    if (sessionCostEl) sessionCostEl.textContent = `Session: ${formatSek(sessionSek)} · ${aiItems.length} analyser`;

    const details = $("#visionCostDebug");
    if (details) {
      if (!latestAiItem) {
        details.textContent = "Ingen AI-analys registrerad i den här sessionen ännu.";
      } else {
        const usage = latestAiItem.aiUsage || {};
        const inputTokens = usage.input_tokens ?? usage.inputTokens ?? usage.prompt_tokens ?? usage.promptTokens ?? 0;
        const outputTokens = usage.output_tokens ?? usage.outputTokens ?? usage.completion_tokens ?? usage.completionTokens ?? 0;
        details.textContent = `Senaste: ${formatSek(latestAiItem.aiCostSek || 0)} · input ${inputTokens} · output ${outputTokens}`;
      }
    }

    try {
      const start = new Date(); start.setHours(0,0,0,0);
      const today = await window.CCC_VISION_KNOWLEDGE?.costSummarySince?.(start.toISOString());
      if ($("#visionTodayCost")) $("#visionTodayCost").textContent = `Idag: ${formatSek(today?.sek || 0)} · ${today?.count || 0} analyser`;
    } catch {}
  }

  function toggleCostPopover() {
    const pop = $("#visionCostPopover"); const btn = $("#visionCostBtn"); if (!pop || !btn) return;
    const open = pop.hidden; pop.hidden = !open; btn.setAttribute("aria-expanded", String(open));
    if (open) refreshCostUi();
  }

  function resetAll() {
    if (!confirm("Vill du börja om? Bilder och utkast i den här Vision-sessionen tas bort.")) return;
    newSeries();
    localStorage.removeItem("ccc-vision-draft");
  }

  async function goBackFromVision() {
    const optionalExtras=$("#optionalExtrasDialog");
    if(visionView==="edit" && optionalExtras && !optionalExtras.hidden){
      optionalExtras.hidden=true;
      return;
    }
    const moreFields=$("#moreFieldsDialog");
    if(visionView==="edit" && moreFields && !moreFields.hidden){
      moreFields.hidden=true;
      return;
    }
    switch (visionView) {
      case "edit":
        if (!await flushAutosave()) return;
        showWorkspace();
        return;
      case "crop":
        if (cropReturnView === "done") finishBatch();
        else if (cropReturnView === "workspace") editCurrent(true);
        else openReview(currentIndex);
        return;
      case "suggestion":
        showWorkspace();
        return;
      case "done":
        showWorkspace();
        return;
      case "workspace":
        // Ett steg bakåt inom modulen. Säkerhetsspara innan arbetsytan lämnas.
        await queueVisionSessionSave();
        showVisionStart();
        return;
      case "start":
      default:
        if (batchItems.length) await queueVisionSessionSave();
        window.location.assign("../dashboard/index.html");
    }
  }

  $("#visionStartBackBtn")?.addEventListener("click", () => window.location.assign("../dashboard/index.html?v=2.8.4"));
  document.addEventListener("ccc:header-settings",()=>{ window.location.href="../settings/index.html?module=vision"; });
  $("#visionSettingsCloseBtn")?.addEventListener("click", () => setVisionSettingsOpen(false));

  async function renderKnowledgeList() {
    const box = $("#visionKnowledgeList");
    if (!box) return;
    const rows = await window.CCC_VISION_KNOWLEDGE?.listKnowledge?.() || [];
    if (!rows.length) {
      box.innerHTML = '<p class="vision-knowledge-empty">CCC har inte lärt sig något lokalt ännu.</p>';
      return;
    }
    box.innerHTML = rows.map((row) => {
      const title = row.subject || row.brand || "Okänt objekt";
      const details = [row.brand && row.brand !== title ? row.brand : "", row.category, row.season].filter(Boolean).join(" · ");
      const source = row.source === "user-confirmed" ? "Lärt från din ändring" : "Godkänt av dig";
      return `<div class="vision-knowledge-item"><strong>${escapeHtml(title)}</strong>${details ? `<small>${escapeHtml(details)}</small>` : ""}<small>${source}</small></div>`;
    }).join("");
  }

  $("#visionShowKnowledgeBtn")?.addEventListener("click", async (event) => {
    const box = $("#visionKnowledgeList");
    if (!box) return;
    const open = box.hidden;
    box.hidden = !open;
    event.currentTarget.setAttribute("aria-expanded", String(open));
    event.currentTarget.textContent = open ? "Dölj vad CCC har lärt sig" : "Visa vad CCC har lärt sig";
    if (open) await renderKnowledgeList();
  });

  $("#visionClearKnowledgeBtn")?.addEventListener("click", async () => {
    await window.CCC_VISION_KNOWLEDGE?.clearKnowledge?.();
    await renderKnowledgeList();
    const saved = $("#visionSettingsSaved");
    if (saved) saved.textContent = "Kunskapsbasen är rensad ✓";
  });

  $("#visionSettingsOverlay")?.addEventListener("click", (event) => { if (event.target === visionSettingsOverlay) setVisionSettingsOpen(false); });
  $("#visionAiAutoSetting")?.addEventListener("change", (event) => saveVisionSetting("ccc-vision-ai-auto", event.target.checked));
  $("#visionLearnEditsSetting")?.addEventListener("change", (event) => saveVisionSetting("ccc-vision-learn-edits", event.target.checked));

  document.addEventListener("ccc:core-ready",()=>updateHeaderContext(),{once:true});
  // Kamera / fotograferingsflöde
  $("#startCameraBtn").addEventListener("click", startCamera);
  $("#galleryBtn").addEventListener("click", () => $("#galleryInput").click());
  document.addEventListener("ccc:header-back",goBackFromVision);
  $("#reviewBackBtn")?.addEventListener("click", () => showWorkspace());
  $("#resumeSessionBtn")?.addEventListener("click", async () => {
    if (batchItems.length) showWorkspace();
    else {
      const button = $("#resumeSessionBtn");
      if (button) { button.disabled = true; button.textContent = "Öppnar fotosession…"; }
      try { await restoreSavedVisionSession(); }
      catch (error) {
        console.error("[CCC Vision] Kunde inte återställa fotosession", error);
        if (button) button.textContent = "Kunde inte öppna fotosessionen";
      } finally {
        if (button) button.disabled = false;
      }
    }
  });
  $("#saveSessionBtn")?.addEventListener("click", async () => {
    const button = $("#saveSessionBtn");
    if (!batchItems.length || !button) return;
    button.disabled = true;
    button.removeAttribute("title");
    const originalText = "Spara och fortsätt senare";
    button.textContent = "Sparar lokalt…";
    try {
      await saveVisionSessionLocally();
      button.textContent = "Sparat ✓";
      setTimeout(() => {
        showVisionStart();
        applyCaptureMode();
        button.textContent = originalText;
        button.disabled = false;
      }, 650);
    } catch (error) {
      const detail = storageErrorDetails(error);
      console.error("[CCC Vision] Kunde inte spara fotosession", detail, error);
      button.textContent = `Kunde inte spara (${detail.name})`;
      button.title = detail.message;
      button.disabled = false;
      setMessage(`Lagringsfel: ${detail.name}. ${detail.message}`);
    }
  });
  $("#galleryInput").addEventListener("change", (event) => handleGalleryFiles(event.target.files));
  $("#cameraFallbackInput").addEventListener("change", (event) => handleFallbackCamera(event.target.files));
  $("#closeCameraBtn").addEventListener("click", closeCameraSafely);
  $("#shutterBtn").addEventListener("click", captureFrame);
  $("#cameraZoomControls")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-camera-zoom]");
    if (button && !button.hidden) setCameraZoom(button.dataset.cameraZoom);
  });
  $("#retakeBtn").addEventListener("click", retakePhoto);
  $("#nextPhotoBtn").addEventListener("click", nextPhoto);
  $("#usePhotoBtn").addEventListener("click", finishCameraSeries);
  $("#workspaceCameraBtn")?.addEventListener("click", () => $("#startCameraBtn")?.click());
  $("#workspaceGalleryBtn")?.addEventListener("click", () => $("#galleryInput")?.click());

  $("#workspaceContinueBtn")?.addEventListener("click", () => {
    const item=batchItems[currentIndex]||batchItems[0];
    if(!item)return;
    currentIndex=Math.max(0,currentIndex);
    editReturnView="workspace";
    populateFormFromItem(true);
    showStage("editCard","edit");
  });

  $("#showSuggestionBtn").addEventListener("click", () => {
    const selected = batchItems[currentIndex];
    if (selected?.visionReady) {
      openReview(currentIndex);
      return;
    }
    const firstReady = batchItems.findIndex((item) => item.visionReady && !item.approved);
    if (firstReady >= 0) openReview(firstReady);
  });
  $("#addToSelectedBtn")?.addEventListener("click", () => $("#sameGarmentInput").click());
  $("#manualAiBtn")?.addEventListener("click", analyzeCurrentManually);
  $("#visionCostBtn")?.addEventListener("click", (event) => { event.stopPropagation(); toggleCostPopover(); });

  // Granskning
  $("#useSuggestionBtn").addEventListener("click", approveCurrent);
  $("#wrongSuggestionBtn").addEventListener("click", editCurrent);
  $("#addSameGarmentBtn").addEventListener("click", () => $("#sameGarmentInput").click());
  $("#sameGarmentInput").addEventListener("change", (event) => addSameGarmentFiles(event.target.files));
  $("#sameGarmentCameraBtn")?.addEventListener("click", () => $("#sameGarmentCameraInput")?.click());
  $("#sameGarmentAlbumBtn")?.addEventListener("click", () => $("#sameGarmentInput")?.click());
  $("#sameGarmentCameraInput")?.addEventListener("change", (event) => {
    addSameGarmentFiles(event.target.files);
    event.target.value = "";
  });
  $("#trashCurrentBtn").addEventListener("click", trashCurrent); 
  $("#editTrashBtn")?.addEventListener("click", trashCurrentFromEdit);
  $("#undoTrashBtn").addEventListener("click", undoTrash);
  $("#backToSuggestionBtn")?.addEventListener("click", saveEditedAndBack);
  $("#previewBtn").addEventListener("click", saveEditedAndNext);
  $("#newSeriesBtn").addEventListener("click", newSeries);
  $("#publishReadyBtn")?.addEventListener("click", () => {
    saveBatchMetadata();
    window.location.href = "../publish/index.html";
  });


  // Existerande extrafunktioner
  $("#usePriceSuggestionBtn").addEventListener("click", usePriceSuggestion);
  $("#addFactBtn").addEventListener("click", addFact);
  $("#addNewConditionBtn").addEventListener("click", addNewCondition);
  $("#openExtrasBtn")?.addEventListener("click",()=>{$("#optionalExtrasDialog").hidden=false;});
  $("#cancelExtrasBtn")?.addEventListener("click",closeOptionalExtras);
  $("#saveExtrasBtn")?.addEventListener("click",()=>{
    const item=currentItem();
    if(item)item.editedFields=Object.fromEntries(fieldIds.map(id=>[id,$("#"+id).value]));
    saveBatchMetadata();scheduleAutosave();closeOptionalExtras();
  });
  $("#optionalExtrasDialog")?.addEventListener("click",event=>{if(event.target===$("#optionalExtrasDialog"))closeOptionalExtras();});
  $("#openMoreFieldsBtn")?.addEventListener("click",()=>{
    $("#moreFieldsDialog").hidden=false;
  });
  $("#cancelMoreFieldsBtn")?.addEventListener("click",()=>{
    $("#moreFieldsDialog").hidden=true;
  });
  $("#saveMoreFieldsBtn")?.addEventListener("click",()=>{
    const item=currentItem();
    if(item)item.editedFields=Object.fromEntries(fieldIds.map(id=>[id,$("#"+id).value]));
    saveBatchMetadata();
    scheduleAutosave();
    $("#moreFieldsDialog").hidden=true;
  });
  $("#moreFieldsDialog")?.addEventListener("click",event=>{
    if(event.target===$("#moreFieldsDialog"))$("#moreFieldsDialog").hidden=true;
  });

  $$('[data-copy]').forEach((button) => button.addEventListener("click", () => copyPreview(button.dataset.copy)));
  $$('[data-demo]').forEach((button) => button.addEventListener("click", () => chooseDemo(button.dataset.demo)));

  fieldIds.forEach((id) => {
    $("#" + id).addEventListener("input", () => {
      const item = currentItem();
      if (item) item.editedFields = Object.fromEntries(fieldIds.map((fieldId) => [fieldId, $("#" + fieldId).value]));
      updateCounters();
      updateTextPreviews();
      scheduleAutosave();
    });
  });

  // Gamla preview-knappar finns kvar i HTML men används inte i fotograferingsflödet.
  if ($("#backToEditBtn")) $("#backToEditBtn").addEventListener("click", () => showStage("editCard", "edit"));
  if ($("#approveBtn")) $("#approveBtn").addEventListener("click", finishBatch);

  installWorkspaceSwipe();
  installCameraPinchZoom();
  showVisionStart();
  refreshSavedSessionSummary();
  refreshCostUi();
  updateCounters();
  updateTextPreviews();
})();

/* CCC cache stamp: v2.8.69 */
