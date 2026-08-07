(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const fieldIds = ["title", "category", "brand", "season", "price", "manufacturer", "size", "color", "description"];
  let activeDemoKey = "arsenal";
  let demoImageActive = false;
  let objectUrls = new Map();
  let saveTimer;
  let visionTimer;
  let visionRun = 0;
  let visionReady = false;
  let visionPromise = null;
  let pendingVisionResult = null;
  let cameraStream = null;
  let stagedCameraFile = null;
  let selectedFiles = [];

  function showStage(stageId) {
    ["captureCard", "visionCard", "editCard", "previewCard"].forEach((id) => {
      const card = $("#" + id);
      card.hidden = id !== stageId;
      card.classList.toggle("is-active", id === stageId);
    });
  }

  function selectedImageCount() {
    return selectedFiles.length || (demoImageActive ? 1 : 0);
  }

  function updateImageState() {
    const count = selectedImageCount();
    $("#imageCount").textContent = `${count} ${count === 1 ? "bild" : "bilder"}`;
    $("#visionHint").textContent = count > 1
      ? "De extra bilderna hjälper Vision att berätta lite mer."
      : "Ett foto räcker oftast.";
    $("#selectedStrip").hidden = count === 0;
  }

  function revokeObjectUrls() {
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.clear();
  }

  function setPreviewFiles(files) {
    revokeObjectUrls();
    selectedFiles = files.slice(0, 3);
    demoImageActive = false;
    const ids = [["mainPreview","stripMain"],["detailPreview1","stripExtra1"],["detailPreview2","stripExtra2"]];
    ids.forEach(([previewId, stripId], index) => {
      const file = selectedFiles[index];
      const preview = $("#" + previewId);
      const strip = $("#" + stripId);
      const wrap = index === 0 ? null : $(index === 1 ? "#stripExtra1Wrap" : "#stripExtra2Wrap");
      if (!file) {
        preview.hidden = true; preview.removeAttribute("src");
        if (wrap) wrap.hidden = true;
        return;
      }
      const url = URL.createObjectURL(file);
      objectUrls.set(index, url);
      preview.src = url; preview.hidden = false;
      strip.src = url;
      if (wrap) wrap.hidden = false;
    });
    $("#startCameraBtn").classList.toggle("has-image", selectedFiles.length > 0);
    updateImageState();
    syncProductContext();
  }

  function beginVisionInBackground(delay = 1500) {
    clearTimeout(visionTimer);
    const runId = ++visionRun;
    visionReady = false;
    pendingVisionResult = null;
    $("#showSuggestionBtn").hidden = true;
    visionPromise = new Promise((resolve) => {
      visionTimer = setTimeout(() => {
        if (runId !== visionRun) return resolve(false);
        const demo = window.CCC_VISION_DEMOS?.[activeDemoKey] || window.CCC_VISION_DEMO;
        pendingVisionResult = demo;
        visionReady = true;
        $("#showSuggestionBtn").textContent = "Visa förslag ✓";
        $("#showSuggestionBtn").hidden = false;
        resolve(true);
      }, delay);
    });
    return visionPromise;
  }

  async function applyVisionResult() {
    if (!selectedImageCount()) return;
    if (!visionReady && visionPromise) {
      $("#showSuggestionBtn").hidden = false;
      $("#showSuggestionBtn").textContent = "Förbereder…";
      $("#showSuggestionBtn").disabled = true;
      await visionPromise;
      $("#showSuggestionBtn").disabled = false;
    }
    const demo = pendingVisionResult || window.CCC_VISION_DEMOS?.[activeDemoKey] || window.CCC_VISION_DEMO;
    $("#summaryTitle").textContent = demo.summaryTitle;
    $("#summaryBrand").textContent = demo.summaryBrand;
    $("#summarySeason").textContent = demo.summarySeason;
    $("#confidencePill").textContent = selectedImageCount() > 1 ? "Säkerheten är hög" : demo.confidence;
    syncProductContext();
    showStage("visionCard");
  }

  async function startCamera() {
    stagedCameraFile = null;
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
      const reviewUrl = URL.createObjectURL(blob);
      $("#cameraReview").src = reviewUrl;
      $("#cameraReview").dataset.tempUrl = reviewUrl;
      $("#cameraReview").hidden = false;
      $("#cameraVideo").hidden = true;
      $("#cameraLiveActions").hidden = true;
      $("#cameraReviewActions").hidden = false;
      // Vision börjar NU, innan användaren trycker Använd bild.
      selectedFiles = [stagedCameraFile];
      beginVisionInBackground();
      $("#usePhotoBtn").textContent = "Använd bild";
      visionPromise?.then((ok) => { if (ok && stagedCameraFile) $("#usePhotoBtn").textContent = "Använd bild ✓"; });
    }, "image/jpeg", .9);
  }

  function retakePhoto() {
    ++visionRun;
    visionReady = false;
    pendingVisionResult = null;
    stagedCameraFile = null;
    const review = $("#cameraReview");
    if (review.dataset.tempUrl) URL.revokeObjectURL(review.dataset.tempUrl);
    review.removeAttribute("src"); review.hidden = true;
    $("#cameraVideo").hidden = false;
    $("#cameraLiveActions").hidden = false;
    $("#cameraReviewActions").hidden = true;
  }

  async function useCameraPhoto() {
    if (!stagedCameraFile) return;
    const file = stagedCameraFile;
    setPreviewFiles([file]);
    // setPreviewFiles nollställer demo men inte den pågående analysen; starta bara om ifall den inte finns.
    if (!visionPromise) beginVisionInBackground();
    closeCamera();
    await applyVisionResult();
  }

  function handleGalleryFiles(fileList) {
    const files = [...fileList].filter((file) => file.type.startsWith("image/")).slice(0, 3);
    if (!files.length) return;
    setPreviewFiles(files);
    // Så fort bildväljaren lämnar tillbaka 1–3 bilder börjar Vision direkt.
    beginVisionInBackground(files.length > 1 ? 1100 : 1400);
    $("#showSuggestionBtn").hidden = false;
    $("#showSuggestionBtn").textContent = "Visa förslag";
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
    const demo = window.CCC_VISION_DEMOS?.[activeDemoKey] || window.CCC_VISION_DEMO;
    if ($("#editContextTitle")) {
      $("#editContextTitle").textContent = demo?.summaryTitle || "Vald vara";
    }
  }

  async function runVision() { return applyVisionResult(); }

  function populateForm() {
    const fields = (window.CCC_VISION_DEMOS?.[activeDemoKey] || window.CCC_VISION_DEMO).fields;
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

  function showCorrection() {
    $("#correctionBox").hidden = !$("#correctionBox").hidden;
  }

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

  function setDraftState(text) {
    $("#draftState").textContent = text;
  }

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
      fieldIds.forEach((id) => {
        if (draft.fields[id] !== undefined) $("#" + id).value = draft.fields[id];
      });
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
    } catch (error) {
      console.warn("Kunde inte läsa lokalt utkast", error);
    }
  }

  function setMessage(text) {
    ["message", "previewMessage"].forEach((id) => { const el = $("#" + id); if (el) el.textContent = text; });
    clearTimeout(setMessage.timer);
    setMessage.timer = setTimeout(() => { ["message", "previewMessage"].forEach((id) => { const el = $("#" + id); if (el) el.textContent = ""; }); }, 3500);
  }

  function updateCounters() {
    $("#titleCount").textContent = $("#title").value.length;
    $("#descriptionCount").textContent = $("#description").value.length;
  }

  function clean(value) {
    return value.trim();
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

  function currentDemo() {
    return window.CCC_VISION_DEMOS?.[activeDemoKey] || window.CCC_VISION_DEMO;
  }

  function updateSmartSuggestions() {
    const demo = currentDemo();
    const suggested = demo?.priceSuggestion || 795;
    $("#priceSuggestion").textContent = `${suggested} kr`;
    $("#factSuggestionText").textContent = demo?.fact || "Ett kort extra fakta kan läggas till om du vill.";
    updateReadyState();
  }

  function updateReadyState() {
    const title = clean($("#title").value);
    const description = clean($("#description").value);
    const price = clean($("#price").value);
    const state = $("#readyState");
    if (!state) return;
    if (!title) { state.textContent = "Det saknas en rubrik."; state.classList.remove("is-ready"); return; }
    if (!description) { state.textContent = "Det saknas en beskrivning."; state.classList.remove("is-ready"); return; }
    if (!price) { state.textContent = "Det saknas bara pris."; state.classList.remove("is-ready"); return; }
    state.textContent = "✓ Klar att förhandsgranska";
    state.classList.add("is-ready");
  }

  function usePriceSuggestion() {
    const demo = currentDemo();
    $("#price").value = demo?.priceSuggestion || 795;
    updateTextPreviews();
    updateReadyState();
    scheduleSave();
  }

  function appendToDescription(text) {
    const area = $("#description");
    if (area.value.includes(text)) return;
    area.value = `${area.value.trim()}${area.value.trim() ? "\n\n" : ""}${text}`;
    updateCounters();
    updateTextPreviews();
    updateReadyState();
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

  function showPreview() {
    if (!clean($("#title").value)) {
      setMessage("Lägg till en rubrik först.");
      $("#title").focus();
      return;
    }
    if (!clean($("#description").value)) {
      setMessage("Lägg till en beskrivning först.");
      $("#description").focus();
      return;
    }
    updateTextPreviews();
    $("#previewProductTitle").textContent = clean($("#title").value);
    $("#previewProductDescription").textContent = clean($("#description").value);
    const price = clean($("#price").value);
    $("#previewProductPrice").textContent = price ? `${price} kr` : "Pris saknas";
    syncProductContext();
    saveDraft(false);
    showStage("previewCard");
  }

  function approve() {
    if (!clean($("#title").value)) {
      setMessage("Lägg till en rubrik först.");
      $("#title").focus();
      return;
    }
    if (!clean($("#description").value)) {
      setMessage("Lägg till en beskrivning först.");
      $("#description").focus();
      return;
    }
    saveDraft(false);
    setMessage("Godkänt lokalt. Publicering kopplas in senare.");
  }

  function resetAll() {
    if (!confirm("Börja om och ta bort det lokala utkastet?")) return;
    localStorage.removeItem("ccc-vision-draft");
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
    location.reload();
  }

  function chooseDemo(key) {
    const demo = window.CCC_VISION_DEMOS?.[key];
    if (!demo) return;
    activeDemoKey = key;
    demoImageActive = true;
    selectedFiles = [];
    window.CCC_VISION_DEMO = demo;
    revokeObjectUrls();
    const preview = $("#mainPreview");
    preview.src = `demo/${key}.svg`;
    preview.hidden = false;
    $("#stripMain").src = `demo/${key}.svg`;
    $("#selectedStrip").hidden = false;
    $("#stripExtra1Wrap").hidden = true;
    $("#stripExtra2Wrap").hidden = true;
    $("#startCameraBtn").classList.add("has-image");
    syncProductContext();
    updateSmartSuggestions();
    $$(".demo-card").forEach((card) => card.classList.toggle("is-active", card.dataset.demo === key));
    updateImageState();
    beginVisionInBackground(700);
    $("#showSuggestionBtn").hidden = false;
    $("#showSuggestionBtn").textContent = "Visa förslag";
  }

  $("#startCameraBtn").addEventListener("click", startCamera);
  $("#galleryBtn").addEventListener("click", () => $("#galleryInput").click());
  $("#galleryInput").addEventListener("change", (event) => handleGalleryFiles(event.target.files));
  $("#cameraFallbackInput").addEventListener("change", (event) => {
    const files = [...event.target.files];
    if (files.length) { setPreviewFiles(files); beginVisionInBackground(); $("#showSuggestionBtn").hidden = false; }
  });
  $("#closeCameraBtn").addEventListener("click", closeCamera);
  $("#shutterBtn").addEventListener("click", captureFrame);
  $("#retakeBtn").addEventListener("click", retakePhoto);
  $("#usePhotoBtn").addEventListener("click", useCameraPhoto);
  $("#showSuggestionBtn").addEventListener("click", applyVisionResult);
  $$("[data-demo]").forEach((button) => button.addEventListener("click", () => chooseDemo(button.dataset.demo)));

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

  $$('[data-focus]').forEach((button) => {
    button.addEventListener("click", () => focusCorrection(button.dataset.focus));
  });

  $$('[data-copy]').forEach((button) => {
    button.addEventListener("click", () => copyPreview(button.dataset.copy));
  });

  [...fieldIds, "channelWeb", "channelInstagram", "channelFacebook"].forEach((id) => {
    $("#" + id).addEventListener("input", () => {
      updateCounters();
      updateTextPreviews();
      updateReadyState();
      scheduleSave();
    });
    $("#" + id).addEventListener("change", () => {
      updateTextPreviews();
      updateReadyState();
      scheduleSave();
    });
  });

  loadDraft();
  showStage("captureCard");
  updateImageState();
  updateCounters();
  updateTextPreviews();
  updateSmartSuggestions();
})();
