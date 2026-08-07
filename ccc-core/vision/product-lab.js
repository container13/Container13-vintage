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
    const key = item?.demoKey || "arsenal";
    return window.CCC_VISION_DEMOS?.[key] || window.CCC_VISION_DEMO;
  };

  function showStage(stageId) {
    ["captureCard", "visionCard", "editCard", "previewCard", "seriesDoneCard"].forEach((id) => {
      const card = $("#" + id);
      if (!card) return;
      card.hidden = id !== stageId;
      card.classList.toggle("is-active", id === stageId);
    });
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
    const delay = 650 + Math.floor(Math.random() * 450);
    item.analysisPromise = new Promise((resolve) => {
      setTimeout(() => {
        item.visionResult = window.CCC_VISION_DEMOS?.[item.demoKey] || window.CCC_VISION_DEMO;
        item.visionReady = true;
        resolve(item.visionResult);
      }, delay);
    });
    return item.analysisPromise;
  }

  function updateBatchStrip() {
    const strip = $("#batchStrip");
    strip.innerHTML = "";
    batchItems.forEach((item, index) => {
      const wrap = document.createElement("div");
      wrap.className = "batch-thumb";
      if (index === currentIndex && !$("#visionCard").hidden) wrap.classList.add("is-current");
      const img = document.createElement("img");
      img.src = item.previewUrl;
      img.alt = `Plagg ${index + 1}`;
      const num = document.createElement("span");
      num.textContent = index + 1;
      wrap.append(img, num);
      strip.appendChild(wrap);
    });
    strip.hidden = batchItems.length === 0;
    $("#imageCount").textContent = `${batchItems.length} ${batchItems.length === 1 ? "plagg" : "plagg"}`;
    $("#showSuggestionBtn").hidden = batchItems.length === 0;
  }

  function resetCaptureVisual() {
    const preview = $("#mainPreview");
    preview.hidden = true;
    preview.removeAttribute("src");
    $("#startCameraBtn").classList.remove("has-image");
    $("#startCameraBtn .camera-content strong").textContent = batchItems.length ? "Fota nästa plagg" : "Börja fota";
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
    if (batchItems.length) await openReview(0);
  }

  function handleFallbackCamera(fileList) {
    const files = [...fileList].filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    files.forEach((file) => batchItems.push(createBatchItem(file, batchItems.length)));
    updateBatchStrip();
    resetCaptureVisual();
    openReview(0);
  }

  function handleGalleryFiles(fileList) {
    const files = [...fileList].filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;
    files.forEach((file) => batchItems.push(createBatchItem(file, batchItems.length)));
    updateBatchStrip();
    resetCaptureVisual();
    // Bildväljaren är nu stängd: CCC har redan börjat tänka på alla bilder.
    openReview(0);
    $("#galleryInput").value = "";
  }

  async function openReview(index) {
    if (!batchItems.length) {
      showStage("captureCard");
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
    $("#confidencePill").textContent = item.extraFiles.length ? "Säkerheten är hög" : demo.confidence;
    $("#batchProgress").textContent = `${currentIndex + 1} av ${batchItems.length}`;
    $("#visionThumbnail").src = item.previewUrl;
    $("#visionThumbnail").hidden = false;
    $("#visionHint").textContent = item.extraFiles.length
      ? `${item.extraFiles.length + 1} bilder används för det här plagget.`
      : "Vill du visa mer av just det här plagget kan du lägga till fler bilder.";
    $("#correctionBox").hidden = true;
    updateBatchStrip();
    showStage("visionCard");
  }

  function moveToNextItem() {
    const next = batchItems.findIndex((item, index) => index > currentIndex && !item.approved);
    if (next >= 0) return openReview(next);
    const earlier = batchItems.findIndex((item) => !item.approved);
    if (earlier >= 0) return openReview(earlier);
    finishBatch();
  }

  function approveCurrent() {
    const item = currentItem();
    if (!item) return;
    item.approved = true;
    if (!item.editedFields) item.editedFields = { ...currentDemo().fields };
    moveToNextItem();
  }

  function populateFormFromItem() {
    const item = currentItem();
    const fields = item?.editedFields || currentDemo().fields;
    fieldIds.forEach((id) => { if (fields[id] !== undefined) $("#" + id).value = fields[id]; });
    $("#editThumbnail").src = item.previewUrl;
    $("#editThumbnail").hidden = false;
    $("#editContextTitle").textContent = currentDemo().summaryTitle;
    updateCounters();
    updateTextPreviews();
    updateSmartSuggestions();
  }

  function editCurrent() {
    populateFormFromItem();
    showStage("editCard");
  }

  function saveEditedAndNext() {
    const item = currentItem();
    if (!item) return;
    item.editedFields = Object.fromEntries(fieldIds.map((id) => [id, $("#" + id).value]));
    item.approved = true;
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
      item.analysisPromise.then(() => openReview(currentIndex));
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
      showStage("captureCard");
      return;
    }
    openReview(Math.min(currentIndex, batchItems.length - 1));
  }

  function showUndoToast() {
    const toast = $("#undoToast");
    toast.hidden = false;
    clearTimeout(showUndoToast.timer);
    showUndoToast.timer = setTimeout(() => { toast.hidden = true; }, 5000);
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
    $("#seriesDoneText").textContent = `${approved} ${approved === 1 ? "produkt är" : "produkter är"} godkända lokalt. Inget har skickats till Firebase.`;
    saveBatchMetadata();
    showStage("seriesDoneCard");
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
    showStage("captureCard");
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
    $("#priceSuggestion").textContent = `${demo?.priceSuggestion || 795} kr`;
    $("#factSuggestionText").textContent = demo?.fact || "Ett kort extra fakta kan läggas till om du vill.";
  }

  function usePriceSuggestion() {
    $("#price").value = currentDemo()?.priceSuggestion || 795;
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
    if (fact) appendToDescription(fact);
    $("#addFactBtn").textContent = "Tillagt ✓";
    $("#addFactBtn").disabled = true;
  }

  function addNewCondition() {
    appendToDescription("Nyskick.");
    $("#addNewConditionBtn").textContent = "Nyskick tillagt ✓";
    $("#addNewConditionBtn").disabled = true;
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
    const svgPath = `demo/${key}.svg`;
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
    if (!confirm("Börja om och ta bort lokala utkast?")) return;
    newSeries();
    localStorage.removeItem("ccc-vision-draft");
  }

  // Kamera / fotograferingsflöde
  $("#startCameraBtn").addEventListener("click", startCamera);
  $("#galleryBtn").addEventListener("click", () => $("#galleryInput").click());
  $("#galleryInput").addEventListener("change", (event) => handleGalleryFiles(event.target.files));
  $("#cameraFallbackInput").addEventListener("change", (event) => handleFallbackCamera(event.target.files));
  $("#closeCameraBtn").addEventListener("click", closeCamera);
  $("#shutterBtn").addEventListener("click", captureFrame);
  $("#retakeBtn").addEventListener("click", retakePhoto);
  $("#nextPhotoBtn").addEventListener("click", nextPhoto);
  $("#usePhotoBtn").addEventListener("click", finishCameraSeries);
  $("#showSuggestionBtn").addEventListener("click", () => openReview(0));

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
  $("#resetBtn").addEventListener("click", resetAll);
  $$('[data-copy]').forEach((button) => button.addEventListener("click", () => copyPreview(button.dataset.copy)));
  $$('[data-demo]').forEach((button) => button.addEventListener("click", () => chooseDemo(button.dataset.demo)));

  fieldIds.forEach((id) => {
    $("#" + id).addEventListener("input", () => { updateCounters(); updateTextPreviews(); scheduleSave(); });
  });

  // Gamla preview-knappar finns kvar i HTML men används inte i fotograferingsflödet.
  if ($("#backToEditBtn")) $("#backToEditBtn").addEventListener("click", () => showStage("editCard"));
  if ($("#approveBtn")) $("#approveBtn").addEventListener("click", finishBatch);

  showStage("captureCard");
  updateBatchStrip();
  updateCounters();
  updateTextPreviews();
})();
