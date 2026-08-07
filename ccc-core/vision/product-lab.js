(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const imagePairs = [
    ["mainImage", "mainPreview"],
    ["detailImage1", "detailPreview1"],
    ["detailImage2", "detailPreview2"]
  ];
  const fieldIds = ["title", "category", "brand", "season", "price", "manufacturer", "size", "color", "description"];

  let activeDemoKey = "arsenal";
  let demoImageActive = false;
  let objectUrls = new Map();
  let imageFiles = new Map();
  let saveTimer;
  let visionTimer;
  let visionRun = 0;
  let visionReady = false;
  let pendingVisionResult = null;
  let cameraStream = null;
  let capturedCameraFile = null;
  let cameraFallback = false;

  function showStage(stageId) {
    ["captureCard", "visionCard", "editCard", "previewCard"].forEach((id) => {
      const card = $("#" + id);
      card.hidden = id !== stageId;
      card.classList.toggle("is-active", id === stageId);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectedImageCount() {
    return imageFiles.size + (demoImageActive ? 1 : 0);
  }

  function setUseButtonState() {
    const count = selectedImageCount();
    const mainText = count > 1 ? "Använd bilder" : "Använd bild";
    if ($("#photoReadyActions")) $("#photoReadyActions").hidden = count === 0;
    if ($("#usePhotoBtn")) $("#usePhotoBtn").textContent = visionReady ? `${mainText} ✓` : mainText;
    if ($("#cameraUseBtn")) $("#cameraUseBtn").textContent = visionReady ? "Använd bild ✓" : "Använd bild";
  }

  function updateImageState() {
    const count = selectedImageCount();
    $("#imageCount").textContent = `${count} ${count === 1 ? "bild" : "bilder"}`;
    $("#visionHint").textContent = count > 1
      ? "De extra bilderna hjälper Vision att ge ett bättre förslag."
      : "Ett foto räcker oftast. Lägg bara till mer om du vill berätta mer.";
    setUseButtonState();
  }

  function revokeUrl(slotId) {
    const url = objectUrls.get(slotId);
    if (url) URL.revokeObjectURL(url);
    objectUrls.delete(slotId);
  }

  function setSlotPreview(slotId, previewId, file) {
    const preview = $("#" + previewId);
    const label = slotId === "mainImage"
      ? $("#mainCameraLabel")
      : ($("#" + slotId)?.closest("label") || preview?.closest("label"));
    const clearButton = label?.querySelector(".remove-image");
    revokeUrl(slotId);

    if (!file) {
      imageFiles.delete(slotId);
      if (preview) {
        preview.hidden = true;
        preview.removeAttribute("src");
      }
      label?.classList.remove("has-image");
      if (clearButton) clearButton.hidden = true;
      updateImageState();
      return;
    }

    demoImageActive = false;
    imageFiles.set(slotId, file);
    const url = URL.createObjectURL(file);
    objectUrls.set(slotId, url);
    preview.src = url;
    preview.hidden = false;
    label?.classList.add("has-image");
    if (clearButton) clearButton.hidden = false;
    updateImageState();
    if (slotId === "mainImage") syncProductContext();
  }

  function previewInput(inputId, previewId) {
    const input = $("#" + inputId);
    setSlotPreview(inputId, previewId, input.files?.[0] || null);
  }

  function clearImage(slotId) {
    const pair = imagePairs.find(([id]) => id === slotId);
    if (!pair) return;
    const input = $("#" + slotId);
    if (input) input.value = "";
    if (slotId === "mainImage" && demoImageActive) {
      demoImageActive = false;
      $("#mainPreview").hidden = true;
      $("#mainPreview").removeAttribute("src");
      $("#mainCameraLabel").classList.remove("has-image");
      $("#mainCameraLabel .remove-image").hidden = true;
      $$(".demo-card").forEach((card) => card.classList.remove("is-active"));
    }
    setSlotPreview(...pair, null);
    cancelVision();
    if (selectedImageCount()) scheduleVision(120);
  }

  imagePairs.forEach(([inputId, previewId]) => {
    $("#" + inputId).addEventListener("change", () => {
      previewInput(inputId, previewId);
      if (selectedImageCount()) scheduleVision(80);
    });
  });

  $$('[data-clear]').forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      clearImage(button.dataset.clear);
    });
  });

  function cancelVision() {
    clearTimeout(visionTimer);
    visionRun += 1;
    visionReady = false;
    pendingVisionResult = null;
    setUseButtonState();
  }

  function scheduleVision(delay = 120) {
    cancelVision();
    visionTimer = setTimeout(runVision, delay);
  }

  function syncProductContext() {
    const source = $("#mainPreview").getAttribute("src") || "";
    ["visionThumbnail", "editThumbnail", "previewThumbnail"].forEach((id) => {
      const image = $("#" + id);
      if (!image) return;
      if (source) {
        image.src = source;
        image.hidden = false;
      } else {
        image.removeAttribute("src");
        image.hidden = true;
      }
    });
    const demo = currentDemo();
    if ($("#editContextTitle")) $("#editContextTitle").textContent = demo?.summaryTitle || "Vald vara";
  }

  async function runVision() {
    if (!selectedImageCount()) return;
    const runId = ++visionRun;
    visionReady = false;
    pendingVisionResult = null;
    setUseButtonState();

    // Simulerar framtida AI-anrop. Det sker helt i bakgrunden.
    await new Promise((resolve) => setTimeout(resolve, selectedImageCount() > 1 ? 720 : 980));
    if (runId !== visionRun || !selectedImageCount()) return;

    const demo = currentDemo();
    pendingVisionResult = {
      summaryTitle: demo.summaryTitle,
      summaryBrand: demo.summaryBrand,
      summarySeason: demo.summarySeason,
      confidence: selectedImageCount() > 1 ? "Säkerheten är hög" : demo.confidence
    };
    visionReady = true;
    setUseButtonState();
  }

  async function ensureVisionReady(button) {
    if (visionReady && pendingVisionResult) return true;
    if (!selectedImageCount()) return false;
    const original = button?.textContent;
    if (button) button.textContent = "Ett ögonblick…";
    if (!visionTimer && !pendingVisionResult) scheduleVision(0);
    const started = Date.now();
    while (!visionReady && Date.now() - started < 5000) {
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    if (button && original) button.textContent = original;
    return visionReady;
  }

  function applyVisionResult() {
    const result = pendingVisionResult;
    if (!result) return;
    $("#summaryTitle").textContent = result.summaryTitle;
    $("#summaryBrand").textContent = result.summaryBrand;
    $("#summarySeason").textContent = result.summarySeason;
    $("#confidencePill").textContent = result.confidence;
    syncProductContext();
  }

  async function useCurrentPhotos(button) {
    if (!selectedImageCount()) return;
    const ready = await ensureVisionReady(button);
    if (!ready) return;
    applyVisionResult();
    closeCamera();
    showStage("visionCard");
  }

  function populateForm() {
    const fields = currentDemo().fields;
    fieldIds.forEach((id) => {
      if (fields[id] !== undefined) $("#" + id).value = fields[id];
    });
    updateCounters();
    updateTextPreviews();
    updateSmartSuggestions();
  }

  function useSuggestion() {
    populateForm();
    syncProductContext();
    $("#correctionBox").hidden = true;
    saveDraft(false);
    showStage("editCard");
  }

  function showCorrection() { $("#correctionBox").hidden = !$("#correctionBox").hidden; }

  function focusCorrection(fieldId) {
    if ($("#editCard").hidden) populateForm();
    showStage("editCard");
    requestAnimationFrame(() => {
      const field = $("#" + fieldId);
      field.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => field.focus(), 350);
    });
  }

  function draftPayload() {
    return {
      savedAt: new Date().toISOString(),
      fields: Object.fromEntries(fieldIds.map((id) => [id, $("#" + id).value])),
      demoItem: activeDemoKey,
      channels: {
        web: $("#channelWeb").checked,
        instagram: $("#channelInstagram").checked,
        facebook: $("#channelFacebook").checked
      }
    };
  }

  function setDraftState(text) { $("#draftState").textContent = text; }
  function saveDraft(showMessage = true) {
    localStorage.setItem("ccc-vision-draft", JSON.stringify(draftPayload()));
    setDraftState("Sparat lokalt");
    if (showMessage) setMessage("Utkast sparat på den här enheten.");
  }
  function scheduleSave() {
    setDraftState("Ändringar…");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveDraft(false), 450);
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem("ccc-vision-draft");
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (!draft?.fields) return;
      fieldIds.forEach((id) => { if (draft.fields[id] !== undefined) $("#" + id).value = draft.fields[id]; });
      if (draft.demoItem && window.CCC_VISION_DEMOS?.[draft.demoItem]) {
        activeDemoKey = draft.demoItem;
        window.CCC_VISION_DEMO = window.CCC_VISION_DEMOS[draft.demoItem];
      }
      if (draft.channels) {
        $("#channelWeb").checked = draft.channels.web !== false;
        $("#channelInstagram").checked = draft.channels.instagram !== false;
        $("#channelFacebook").checked = draft.channels.facebook !== false;
      }
      setDraftState("Sparat utkast finns");
      updateCounters();
      updateTextPreviews();
    } catch (error) { console.warn("Kunde inte läsa lokalt utkast", error); }
  }

  function setMessage(text) {
    ["message", "previewMessage"].forEach((id) => { const el = $("#" + id); if (el) el.textContent = text; });
    clearTimeout(setMessage.timer);
    setMessage.timer = setTimeout(() => {
      ["message", "previewMessage"].forEach((id) => { const el = $("#" + id); if (el) el.textContent = ""; });
    }, 3500);
  }

  function updateCounters() {
    $("#titleCount").textContent = $("#title").value.length;
    $("#descriptionCount").textContent = $("#description").value.length;
  }
  function clean(value) { return value.trim(); }

  function updateTextPreviews() {
    const title = clean($("#title").value) || "Produktnamn saknas";
    const description = clean($("#description").value) || "Beskrivning saknas.";
    const price = clean($("#price").value);
    const size = clean($("#size").value);
    const meta = [size && `Storlek ${size}`, price && `${price} kr`].filter(Boolean).join(" · ");
    $("#webPreview").textContent = [title, description, meta].filter(Boolean).join("\n\n");
    $("#instagramPreview").textContent = `Nyinkommet ✨\n\n${title}\n${description}${meta ? `\n\n${meta}` : ""}\n\n#container13 #vintage #secondhand`;
    $("#facebookPreview").textContent = `Nyinkommet hos Container 13: ${title}. ${description}${price ? ` Pris: ${price} kr.` : ""}`;
    $("#webPreviewCard").hidden = !$("#channelWeb").checked;
    $("#instagramPreviewCard").hidden = !$("#channelInstagram").checked;
    $("#facebookPreviewCard").hidden = !$("#channelFacebook").checked;
  }

  async function copyPreview(targetId) {
    const text = $("#" + targetId).textContent;
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Texten kopierades.");
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      setMessage("Texten kopierades.");
    }
  }

  function currentDemo() { return window.CCC_VISION_DEMOS?.[activeDemoKey] || window.CCC_VISION_DEMO; }

  function updateSmartSuggestions() {
    const demo = currentDemo();
    $("#priceSuggestion").textContent = `${demo?.priceSuggestion || 795} kr`;
    $("#factSuggestionText").textContent = demo?.fact || "Ett kort extra fakta kan läggas till om du vill.";
    updateReadyState();
  }

  function updateReadyState() {
    const state = $("#readyState");
    if (!state) return;
    const title = clean($("#title").value);
    const description = clean($("#description").value);
    const price = clean($("#price").value);
    if (!title) { state.textContent = "Det saknas en rubrik."; state.classList.remove("is-ready"); return; }
    if (!description) { state.textContent = "Det saknas en beskrivning."; state.classList.remove("is-ready"); return; }
    if (!price) { state.textContent = "Det saknas bara pris."; state.classList.remove("is-ready"); return; }
    state.textContent = "✓ Klar att förhandsgranska";
    state.classList.add("is-ready");
  }

  function usePriceSuggestion() {
    $("#price").value = currentDemo()?.priceSuggestion || 795;
    updateTextPreviews(); updateReadyState(); scheduleSave();
  }

  function appendToDescription(text) {
    const area = $("#description");
    if (area.value.includes(text)) return;
    area.value = `${area.value.trim()}${area.value.trim() ? "\n\n" : ""}${text}`;
    updateCounters(); updateTextPreviews(); updateReadyState(); scheduleSave();
  }
  function addFact() {
    const fact = currentDemo()?.fact;
    if (fact) appendToDescription(fact);
    $("#addFactBtn").textContent = "Tillagt ✓"; $("#addFactBtn").disabled = true;
  }
  function addNewCondition() {
    appendToDescription("Nyskick.");
    $("#addNewConditionBtn").textContent = "Nyskick tillagt ✓"; $("#addNewConditionBtn").disabled = true;
  }

  function showPreview() {
    if (!clean($("#title").value)) { setMessage("Lägg till en rubrik först."); $("#title").focus(); return; }
    if (!clean($("#description").value)) { setMessage("Lägg till en beskrivning först."); $("#description").focus(); return; }
    updateTextPreviews();
    $("#previewProductTitle").textContent = clean($("#title").value);
    $("#previewProductDescription").textContent = clean($("#description").value);
    const price = clean($("#price").value);
    $("#previewProductPrice").textContent = price ? `${price} kr` : "Pris saknas";
    syncProductContext(); saveDraft(false); showStage("previewCard");
  }

  function approve() {
    if (!clean($("#title").value)) { setMessage("Lägg till en rubrik först."); $("#title").focus(); return; }
    if (!clean($("#description").value)) { setMessage("Lägg till en beskrivning först."); $("#description").focus(); return; }
    saveDraft(false); setMessage("Godkänt lokalt. Publicering kopplas in senare.");
  }

  function resetAll() {
    if (!confirm("Börja om och ta bort det lokala utkastet?")) return;
    localStorage.removeItem("ccc-vision-draft");
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
    closeCamera();
    location.reload();
  }

  function chooseDemo(key) {
    const demo = window.CCC_VISION_DEMOS?.[key];
    if (!demo) return;
    cancelVision();
    imageFiles.clear();
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.clear();
    activeDemoKey = key;
    demoImageActive = true;
    window.CCC_VISION_DEMO = demo;
    const preview = $("#mainPreview");
    preview.src = `demo/${key}.svg`;
    preview.hidden = false;
    $("#mainCameraLabel").classList.add("has-image");
    $("#mainCameraLabel .remove-image").hidden = false;
    syncProductContext(); updateSmartSuggestions();
    $$(".demo-card").forEach((card) => card.classList.toggle("is-active", card.dataset.demo === key));
    showStage("captureCard"); updateImageState(); setMessage(`Demovara vald: ${demo.label}.`);
    $("#demoPanel").hidden = true; $("#demoToggleBtn").setAttribute("aria-expanded", "false");
    scheduleVision(80);
  }

  function toggleMorePhotos() {
    const panel = $("#morePhotosPanel");
    panel.hidden = !panel.hidden;
    $("#morePhotosBtn").setAttribute("aria-expanded", String(!panel.hidden));
    $("#morePhotosBtn").textContent = panel.hidden ? "+ Berätta mer med fler bilder" : "− Dölj extra bilder";
  }
  function toggleDemoPanel() {
    const panel = $("#demoPanel"); panel.hidden = !panel.hidden;
    $("#demoToggleBtn").setAttribute("aria-expanded", String(!panel.hidden));
  }

  function openAlbumPicker() { $("#albumInput").click(); }

  function applyAlbumFiles(files) {
    const chosen = [...files].slice(0, 3);
    if (!chosen.length) return;
    cancelVision();
    demoImageActive = false;
    $$(".demo-card").forEach((card) => card.classList.remove("is-active"));
    const slots = [
      ["mainImage", "mainPreview"],
      ["detailImage1", "detailPreview1"],
      ["detailImage2", "detailPreview2"]
    ];
    slots.forEach(([slot, preview], index) => setSlotPreview(slot, preview, chosen[index] || null));
    if (chosen.length > 1) {
      $("#morePhotosPanel").hidden = false;
      $("#morePhotosBtn").setAttribute("aria-expanded", "true");
      $("#morePhotosBtn").textContent = "− Dölj extra bilder";
    }
    scheduleVision(40);
  }

  async function openCamera() {
    cameraFallback = false;
    if (!navigator.mediaDevices?.getUserMedia) {
      cameraFallback = true;
      $("#mainImage").setAttribute("capture", "environment");
      $("#mainImage").click();
      return;
    }
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } }, audio: false
      });
      $("#cameraVideo").srcObject = cameraStream;
      $("#cameraStill").hidden = true;
      $("#cameraVideo").hidden = false;
      $("#cameraLiveActions").hidden = false;
      $("#cameraReviewActions").hidden = true;
      capturedCameraFile = null;
      $("#cameraOverlay").hidden = false;
      document.body.classList.add("camera-open");
    } catch (error) {
      console.warn("CCC-kameran kunde inte öppnas, använder systemkameran.", error);
      cameraFallback = true;
      $("#mainImage").setAttribute("capture", "environment");
      $("#mainImage").click();
    }
  }

  function stopCameraStream() {
    cameraStream?.getTracks().forEach((track) => track.stop());
    cameraStream = null;
    if ($("#cameraVideo")) $("#cameraVideo").srcObject = null;
  }

  function closeCamera() {
    stopCameraStream();
    if ($("#cameraOverlay")) $("#cameraOverlay").hidden = true;
    document.body.classList.remove("camera-open");
  }

  async function captureCameraFrame() {
    const video = $("#cameraVideo");
    if (!video.videoWidth || !video.videoHeight) return;
    const canvas = $("#cameraCanvas");
    const maxWidth = 1600;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
    if (!blob) return;
    capturedCameraFile = new File([blob], `ccc-vision-${Date.now()}.jpg`, { type: "image/jpeg" });

    // Viktigt: Vision startar NU – innan användaren trycker "Använd bild".
    setSlotPreview("mainImage", "mainPreview", capturedCameraFile);
    scheduleVision(0);

    const still = $("#cameraStill");
    still.src = objectUrls.get("mainImage");
    still.hidden = false;
    video.hidden = true;
    $("#cameraLiveActions").hidden = true;
    $("#cameraReviewActions").hidden = false;
  }

  async function retakeCameraPhoto() {
    cancelVision();
    capturedCameraFile = null;
    setSlotPreview("mainImage", "mainPreview", null);
    $("#cameraStill").hidden = true;
    $("#cameraStill").removeAttribute("src");
    $("#cameraVideo").hidden = false;
    $("#cameraLiveActions").hidden = false;
    $("#cameraReviewActions").hidden = true;
  }

  $("#cameraBtn").addEventListener("click", openCamera);
  $("#albumBtn").addEventListener("click", openAlbumPicker);
  $("#albumInput").addEventListener("change", (event) => applyAlbumFiles(event.target.files));
  $("#morePhotosBtn").addEventListener("click", toggleMorePhotos);
  $("#demoToggleBtn").addEventListener("click", toggleDemoPanel);
  $$("[data-demo]").forEach((button) => button.addEventListener("click", () => chooseDemo(button.dataset.demo)));

  $("#usePhotoBtn").addEventListener("click", (event) => useCurrentPhotos(event.currentTarget));
  $("#cameraCloseBtn").addEventListener("click", closeCamera);
  $("#cameraCaptureBtn").addEventListener("click", captureCameraFrame);
  $("#cameraRetakeBtn").addEventListener("click", retakeCameraPhoto);
  $("#cameraUseBtn").addEventListener("click", (event) => useCurrentPhotos(event.currentTarget));

  $("#useSuggestionBtn").addEventListener("click", useSuggestion);
  $("#backToPhotoBtn").addEventListener("click", () => showStage("captureCard"));
  $("#backToSuggestionBtn").addEventListener("click", () => showStage("visionCard"));
  $("#backToEditBtn").addEventListener("click", () => showStage("editCard"));
  $("#previewBtn").addEventListener("click", showPreview);
  $("#wrongSuggestionBtn").addEventListener("click", showCorrection);
  $("#usePriceSuggestionBtn").addEventListener("click", usePriceSuggestion);
  $("#addFactBtn").addEventListener("click", addFact);
  $("#addNewConditionBtn").addEventListener("click", addNewCondition);
  $("#approveBtn").addEventListener("click", approve);
  $("#resetBtn").addEventListener("click", resetAll);

  $$("[data-focus]").forEach((button) => button.addEventListener("click", () => focusCorrection(button.dataset.focus)));
  $$("[data-copy]").forEach((button) => button.addEventListener("click", () => copyPreview(button.dataset.copy)));

  [...fieldIds, "channelWeb", "channelInstagram", "channelFacebook"].forEach((id) => {
    $("#" + id).addEventListener("input", () => { updateCounters(); updateTextPreviews(); updateReadyState(); scheduleSave(); });
    $("#" + id).addEventListener("change", () => { updateTextPreviews(); updateReadyState(); scheduleSave(); });
  });

  loadDraft();
  showStage("captureCard");
  updateImageState();
  updateCounters();
  updateTextPreviews();
  updateSmartSuggestions();
})();
