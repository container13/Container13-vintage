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


  // CCC gemensamt skal: samma tema och profilmeny som dashboarden
  const rootElement = document.documentElement;
  const themeButton = $("#themeBtn");
  const profileButton = $("#profileBtn");
  const profileMenu = $("#profileMenu");

  function applyCccTheme(theme) {
    rootElement.dataset.theme = theme;
    localStorage.setItem("ccc-theme", theme);
    themeButton?.setAttribute("aria-pressed", String(theme === "dark"));
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#11141b" : "#f7f7f9");
  }

  function setProfileMenu(open) {
    if (!profileMenu) return;
    profileMenu.hidden = !open;
    profileButton?.setAttribute("aria-expanded", String(open));
  }

  const savedCccTheme = localStorage.getItem("ccc-theme");
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  applyCccTheme(savedCccTheme || (prefersDark ? "dark" : "light"));
  const privacyNote = $("#privacyNote");
  if (privacyNote) {
    privacyNote.textContent = window.CCC_VISION_AI?.configured?.()
      ? "Originalbilderna stannar på enheten. En komprimerad kopia skickas endast för analys."
      : "Originalbilderna stannar på den här enheten.";
  }
  themeButton?.addEventListener("click", () => applyCccTheme(rootElement.dataset.theme === "dark" ? "light" : "dark"));
  profileButton?.addEventListener("click", (event) => { event.stopPropagation(); setProfileMenu(profileMenu?.hidden ?? true); });
  document.addEventListener("click", (event) => {
    if (profileMenu && !profileMenu.hidden && !profileMenu.contains(event.target) && event.target !== profileButton) setProfileMenu(false);
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") setProfileMenu(false); });

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

    if (resume) resume.hidden = !(startMode && hasSession);
    if (startMode) {
      if (strip) strip.hidden = true;
      if (help) help.hidden = true;
      if (addDetail) addDetail.hidden = true;
      if (review) review.hidden = true;
    }
    const cameraTitle = $("#startCameraBtn .camera-content strong");
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
      analysisPromise: null
    };
    startSilentAnalysis(item);
    return item;
  }

  function startSilentAnalysis(item) {
    item.visionReady = false;
    item.analysisMode = window.CCC_VISION_AI?.configured?.() ? "ai" : "demo";
    item.analysisError = "";
    item.analysisErrorCode = "";
    item.analysisHttpStatus = 0;
    const files = [item.file, ...(item.extraFiles || [])].filter(Boolean).slice(0, 3);

    item.analysisPromise = (async () => {
      if (item.analysisMode === "ai") {
        try {
          console.info("[CCC Vision] AI-analys startar", { itemId: item.id, files: files.length });
          const aiResponse = await window.CCC_VISION_AI.analyze(files);
          item.visionResult = aiResponse.result || aiResponse;
          item.aiUsage = aiResponse.usage || null;
          item.visionReady = true;
                window.CCC_VISION_KNOWLEDGE?.metric?.({ type: "ai_analysis", itemId: item.id, usage: item.aiUsage, model: aiResponse.model || "" }).catch(() => {});
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
      item.visionResult = window.CCC_VISION_DEMOS?.[item.demoKey] || window.CCC_VISION_DEMO;
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
    if (addDetail) addDetail.hidden = false;
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
      wrap.setAttribute("aria-label", `Plagg ${index + 1}${item.visionReady ? ", analys klar" : ", analyseras"}`);
      const img = document.createElement("img");
      img.src = item.previewUrl;
      img.alt = `Plagg ${index + 1}`;
      const state = document.createElement("span");
      state.className = `thumb-status ${item.visionReady ? "is-ready" : "is-working"}`;
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
    $("#startCameraBtn .camera-content strong").textContent = batchItems.length ? "Fota nästa plagg" : "Ta ett foto";
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

  function approveCurrent() {
    const item = currentItem();
    if (!item) return;
    item.approved = true;
    if (!item.editedFields) item.editedFields = { ...currentDemo().fields };
    rememberApprovedItem(item);
    moveToNextItem();
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
  }

  function editCurrent(allowWhileAnalyzing = false) {
    editReturnView = allowWhileAnalyzing && !currentItem()?.visionReady ? "workspace" : "suggestion";
    populateFormFromItem(allowWhileAnalyzing);
    showStage("editCard", "edit");
  }

  function saveEditedAndNext() {
    const item = currentItem();
    if (!item) return;
    item.editedFields = Object.fromEntries(fieldIds.map((id) => [id, $("#" + id).value]));
    item.approved = true;
    rememberApprovedItem(item);
    saveBatchMetadata();
    moveToNextItem();
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

  function finishBatch() {
    const approved = batchItems.filter((item) => item.approved).length;
    $("#seriesDoneText").textContent = `${approved} ${approved === 1 ? "plagg är" : "plagg är"} ${approved === 1 ? "klart" : "klara"} att publiceras.`;
    saveBatchMetadata();
    showStage("seriesDoneCard", "done");
  }

  function newSeries() {
    batchItems.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      item.extraUrls?.forEach((url) => URL.revokeObjectURL(url));
    });
    batchItems = [];
    currentIndex = 0;
    trashStack = [];
    localStorage.removeItem("ccc-vision-batch-meta");
    updateBatchStrip();
    resetCaptureVisual();
    showVisionStart();
  }

  function saveBatchMetadata() {
    const meta = batchItems.map((item) => ({
      id: item.id,
      demoKey: item.demoKey,
      approved: item.approved,
      extraImageCount: item.extraFiles.length,
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

  // Granskning
  $("#useSuggestionBtn").addEventListener("click", approveCurrent);
  $("#wrongSuggestionBtn").addEventListener("click", editCurrent);
  $("#addSameGarmentBtn").addEventListener("click", () => $("#sameGarmentInput").click());
  $("#sameGarmentInput").addEventListener("change", (event) => addSameGarmentFiles(event.target.files));
  $("#trashCurrentBtn").addEventListener("click", trashCurrent);
  $("#undoTrashBtn").addEventListener("click", undoTrash);
  $("#backToSuggestionBtn").addEventListener("click", () => openReview(currentIndex));
  $("#previewBtn").addEventListener("click", saveEditedAndNext);
  $("#newSeriesBtn").addEventListener("click", newSeries);

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
  updateCounters();
  updateTextPreviews();
})();
