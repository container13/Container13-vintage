(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const fieldIds = ["title", "category", "brand", "season", "price", "manufacturer", "size", "color", "description"];
  const demoKeys = ["arsenal", "levis", "adidas"];

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
    const settingsBtn = $("#visionSettingsBtn");
    const backBtn = $("#headerBackBtn");
    const isModuleHome = visionView === "start";
    if (settingsBtn) settingsBtn.hidden = !isModuleHome;
    if (backBtn) backBtn.hidden = isModuleHome;
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
    const startHome = $("#visionStartHome");
    const startActions = document.querySelector(".vision-start-actions");
    const workspaceToolbar = $("#workspaceToolbar");
    const workspaceCount = $("#workspaceCount");

    if (resume) resume.hidden = !(startMode && hasSession);
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
      file,
      previewUrl: fileUrl(file),
      extraFiles: [],
      extraUrls: [],
      demoKey: demoKeys[index % demoKeys.length],
      visionReady: false,
      visionResult: null,
      approved: false,
      editedFields: null,
      analysisPromise: null,
      publishFile: null,
      publishUrl: null,
      cropData: null
    };
    startSilentAnalysis(item);
    return item;
  }

  function startSilentAnalysis(item, forceAi = false) {
    item.visionReady = false;
    const aiAllowed = forceAi || visionSettings().aiAuto;
    item.analysisMode = aiAllowed && window.CCC_VISION_AI?.configured?.() ? "ai" : (aiAllowed ? "demo" : "manual");
    item.analysisError = "";
    item.analysisErrorCode = "";
    item.analysisHttpStatus = 0;
    const files = [item.file, ...(item.extraFiles || [])].filter(Boolean).slice(0, 3);

    if (item.analysisMode === "manual") {
      item.analysisPromise = Promise.resolve(null);
      item.visionReady = false;
      updateBatchStrip();
      return item.analysisPromise;
    }

    item.analysisPromise = (async () => {
      if (item.analysisMode === "ai") {
        try {
          console.info("[CCC Vision] AI-analys startar", { itemId: item.id, files: files.length });
          const aiResponse = await window.CCC_VISION_AI.analyze(files);
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
    })();
    return item.analysisPromise;
  }

  function updateWorkspaceState() {
    const review = $("#showSuggestionBtn");
    const addDetail = $("#addToSelectedBtn");
    if (!batchItems.length) {
      if (addDetail) addDetail.hidden = true;
      if (review) { review.hidden = true; review.disabled = true; }
      return;
    }
    if (addDetail) addDetail.hidden = true;
    const ready = batchItems.filter((item) => item.visionReady).length;
    if (review) {
      review.hidden = false;
      review.disabled = ready === 0;
      const selected = batchItems[currentIndex];
      const selectedReady = !!selected?.visionReady;
      if (selectedReady) {
        review.textContent = "Visa förslag";
      } else if (ready > 0) {
        review.textContent = `Granska ${ready} ${ready === 1 ? "klart plagg" : "klara plagg"}`;
      } else {
        review.textContent = "Visa förslag";
      }
    }
  }

  function updateBatchStrip() {
    const strip = $("#batchStrip");
    strip.innerHTML = "";
    batchItems.forEach((item, index) => {
      const wrap = document.createElement("button");
      wrap.type = "button";
      wrap.className = "batch-thumb";
      if (index === currentIndex) wrap.classList.add("is-selected");
      wrap.setAttribute("aria-label", `Plagg ${index + 1}${item.visionReady ? ", analys klar" : item.analysisMode === "manual" ? ", ej AI-analyserat" : ", analyseras"}`);
      const img = document.createElement("img");
      img.src = item.previewUrl;
      img.alt = `Plagg ${index + 1}`;
      const state = document.createElement("span");
      state.className = `thumb-status ${item.visionReady ? "is-ready" : item.analysisMode === "manual" ? "is-manual" : "is-working"}`;
      state.textContent = item.visionReady ? "✓" : "";
      state.setAttribute("aria-hidden", "true");
      wrap.addEventListener("click", () => {
        currentIndex = index;
        updateBatchStrip();
        // Miniatyren är alltid användbar. Är AI klar visas förslaget.
        // Pågår analysen öppnas manuell redigering direkt utan att stoppa bakgrundsanalysen.
        if (item.visionReady) openReview(index);
        else editCurrent(true);
      });
      wrap.append(img, state);
      strip.appendChild(wrap);
    });
    strip.hidden = batchItems.length === 0;
    const help = $("#batchHelp");
    if (help) help.hidden = batchItems.length === 0;
    updateWorkspaceState();
    applyCaptureMode();
  }

  function resetCaptureVisual() {
    const preview = $("#mainPreview");
    preview.hidden = true;
    preview.removeAttribute("src");
    $("#startCameraBtn").classList.remove("has-image");
    $("#startCameraBtn .action-copy strong").textContent = batchItems.length ? "Fota nästa plagg" : "Ta ett foto";
  }

  async function startCamera() {
    stagedCameraFile = null;
    stagedItem = null;
    $("#cameraReview").hidden = true;
    $("#cameraVideo").hidden = false;
    $("#cameraLiveActions").hidden = false;
    $("#cameraReviewActions").hidden = true;
    $("#cameraOverlay").hidden = false;
    document.body.classList.add("camera-open");
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      $("#cameraVideo").srcObject = cameraStream;
    } catch (error) {
      closeCamera();
      $("#cameraFallbackInput").click();
    }
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
    updateBatchStrip();
    // Kamerans AI-analys kan bli färdig redan innan användaren trycker Klar.
    // När plagget först nu läggs i batchItems måste kostnadsrutan uppdateras igen,
    // annars står den kvar på "väntar på AI-analys" trots att usage redan finns.
    refreshCostUi();
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
    updateBatchStrip();
    resetCaptureVisual();
    showWorkspace();
  }

  function handleGalleryFiles(fileList) {
    const files = [...fileList].filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;
    files.forEach((file) => batchItems.push(createBatchItem(file, batchItems.length)));
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

  function moveToNextItem() {
    const next = batchItems.findIndex((item, index) => index > currentIndex && !item.approved);
    if (next >= 0) return openReview(next);
    const earlier = batchItems.findIndex((item) => !item.approved);
    if (earlier >= 0) return openReview(earlier);
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
      const request = indexedDB.open("ccc-local-workspace", 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("images")) {
          const store = db.createObjectStore("images", { keyPath: "id" });
          store.createIndex("createdAt", "createdAt");
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function createVisionThumbnail(file, maxSize = 360, quality = .78) {
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      canvas.getContext("2d", { alpha: false }).drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close?.();
      return await new Promise((resolve) => canvas.toBlob((blob) => resolve(blob || file), "image/webp", quality));
    } catch (_) {
      return file;
    }
  }

  async function saveApprovedDraftLocally(item) {
    if (!item?.file) return;
    const fields = item.editedFields || item.visionResult?.fields || {};
    const thumbnailBlob = await createVisionThumbnail(item.file);
    const record = {
      id: item.id,
      originalBlob: item.file,
      thumbnailBlob,
      originalName: item.file.name || `ccc-${item.id}`,
      originalType: item.file.type || "image/jpeg",
      createdAt: item.createdAt || Date.now(),
      source: "vision",
      readyToPublish: true,
      title: (fields.title || item.visionResult?.summaryTitle || "").trim(),
      brand: (fields.brand || fields.manufacturer || "").trim(),
      size: (fields.size || "").trim(),
      price: (fields.price || "").trim(),
      description: (fields.description || "").trim(),
      fields
    };
    const db = await openWorkspaceDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction("images", "readwrite");
      tx.objectStore("images").put(record);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
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
    $("#editThumbnail").src = item.previewUrl;
    $("#editThumbnail").hidden = false;
    $("#editContextTitle").textContent = item.visionReady
      ? (item.visionResult?.summaryTitle || "Redigera plagg")
      : "Redigera medan CCC arbetar";
    if (allowWhileAnalyzing && !item.visionReady && !item.editedFields) {
      item.editedFields = Object.fromEntries(fieldIds.map((id) => [id, $("#" + id).value]));
    }
    updateCounters();
    updateTextPreviews();
    updateSmartSuggestions();
    const manualAi = $("#manualAiBtn");
    if (manualAi) manualAi.hidden = item.visionReady || item.analysisMode !== "manual" || !window.CCC_VISION_AI?.configured?.();
  }

  function editCurrent(allowWhileAnalyzing = false) {
    editReturnView = allowWhileAnalyzing && !currentItem()?.visionReady ? "workspace" : "suggestion";
    populateFormFromItem(allowWhileAnalyzing);
    showStage("editCard", "edit");
  }

  async function saveEditedAndNext() {
    const item = currentItem();
    if (!item) return;
    item.editedFields = Object.fromEntries(fieldIds.map((id) => [id, $("#" + id).value]));
    rememberApprovedItem(item);
    try {
      await saveApprovedDraftLocally(item);
      item.approved = true;
      saveBatchMetadata();
      if (editReturnView === "done") finishBatch();
      else moveToNextItem();
    } catch (error) {
      console.error("[CCC Vision] Utkast kunde inte sparas lokalt", error);
      setMessage("Utkastet kunde inte sparas lokalt. Försök igen.");
    }
  }

  function addSameGarmentFiles(fileList) {
    const item = currentItem();
    if (!item) return;
    const available = Math.max(0, 2 - item.extraFiles.length);
    const files = [...fileList].filter((f) => f.type.startsWith("image/")).slice(0, available);
    files.forEach((file) => {
      item.extraFiles.push(file);
      item.extraUrls.push(fileUrl(file));
    });
    if (files.length) {
      startSilentAnalysis(item);
      item.analysisPromise.then(() => {
        if (!$("#captureCard").hidden) updateBatchStrip();
        else openReview(currentIndex);
      });
    }
    $("#sameGarmentInput").value = "";
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
    if ($("#draftState")) $("#draftState").textContent = "Ändringar…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveDraft(false), 450);
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
    const details = $("#optionalExtrasDetails");
    if (details) details.open = false;
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
    if (!item || item.visionReady) return;
    const button = $("#manualAiBtn");
    if (button) { button.disabled = true; button.textContent = "Analyserar…"; }
    await startSilentAnalysis(item, true);
    if (button) { button.disabled = false; button.textContent = "Analysera med AI"; button.hidden = !!item.visionReady; }
    if (item.visionReady) openReview(currentIndex);
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

  function goBackFromVision() {
    switch (visionView) {
      case "edit":
        if (editReturnView === "workspace") showWorkspace();
        else openReview(currentIndex);
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
        // Ett steg bakåt inom modulen. Sessionen ligger kvar i minnet och kan återupptas.
        showVisionStart();
        return;
      case "start":
      default:
        window.location.assign("../dashboard/index.html");
    }
  }

  $("#visionStartBackBtn")?.addEventListener("click", () => window.location.assign("../dashboard/index.html?v=2.8.4"));
  $("#visionSettingsBtn")?.addEventListener("click", () => setVisionSettingsOpen(true));
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

  // Kamera / fotograferingsflöde
  $("#startCameraBtn").addEventListener("click", startCamera);
  $("#galleryBtn").addEventListener("click", () => $("#galleryInput").click());
  $("#headerBackBtn")?.addEventListener("click", goBackFromVision);
  $("#resumeSessionBtn")?.addEventListener("click", showWorkspace);
  $("#galleryInput").addEventListener("change", (event) => handleGalleryFiles(event.target.files));
  $("#cameraFallbackInput").addEventListener("change", (event) => handleFallbackCamera(event.target.files));
  $("#closeCameraBtn").addEventListener("click", closeCamera);
  $("#shutterBtn").addEventListener("click", captureFrame);
  $("#retakeBtn").addEventListener("click", retakePhoto);
  $("#nextPhotoBtn").addEventListener("click", nextPhoto);
  $("#usePhotoBtn").addEventListener("click", finishCameraSeries);
  $("#workspaceCameraBtn")?.addEventListener("click", () => $("#startCameraBtn")?.click());
  $("#workspaceGalleryBtn")?.addEventListener("click", () => $("#galleryInput")?.click());

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
  $("#trashCurrentBtn").addEventListener("click", trashCurrent);
  $("#undoTrashBtn").addEventListener("click", undoTrash);
  $("#backToSuggestionBtn").addEventListener("click", () => {
    if (editReturnView === "done") { finishBatch(); return; }
    openReview(currentIndex);
  });
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
  $("#closeExtrasBtn")?.addEventListener("click", closeOptionalExtras);
  $("#extrasDoneBtn")?.addEventListener("click", closeOptionalExtras);

  $$('[data-copy]').forEach((button) => button.addEventListener("click", () => copyPreview(button.dataset.copy)));
  $$('[data-demo]').forEach((button) => button.addEventListener("click", () => chooseDemo(button.dataset.demo)));

  fieldIds.forEach((id) => {
    $("#" + id).addEventListener("input", () => {
      const item = currentItem();
      if (item) item.editedFields = Object.fromEntries(fieldIds.map((fieldId) => [fieldId, $("#" + fieldId).value]));
      updateCounters();
      updateTextPreviews();
      scheduleSave();
    });
  });

  // Gamla preview-knappar finns kvar i HTML men används inte i fotograferingsflödet.
  if ($("#backToEditBtn")) $("#backToEditBtn").addEventListener("click", () => showStage("editCard", "edit"));
  if ($("#approveBtn")) $("#approveBtn").addEventListener("click", finishBatch);

  showVisionStart();
  refreshCostUi();
  updateCounters();
  updateTextPreviews();
})();

/* CCC cache stamp: v2.8.52 */
