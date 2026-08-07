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
  let saveTimer;
  let visionTimer;
  let visionRun = 0;
  let visionState = "idle";
  let continueWhenReady = false;

  function showStage(stageId) {
    ["captureCard", "visionCard", "editCard", "previewCard"].forEach((id) => {
      const card = $("#" + id);
      card.hidden = id !== stageId;
      card.classList.toggle("is-active", id === stageId);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectedImageCount() {
    const uploaded = imagePairs.filter(([inputId]) => $("#" + inputId).files?.length).length;
    return uploaded + (demoImageActive ? 1 : 0);
  }

  function updateImageState() {
    const count = selectedImageCount();
    $("#imageCount").textContent = `${count} ${count === 1 ? "bild" : "bilder"}`;
    $("#visionHint").textContent = count > 1
      ? "De extra bilderna hjälper mig att berätta lite mer."
      : "Ett foto räcker oftast. Du bestämmer om du vill lägga till mer.";

    const actions = $("#captureActions");
    if (actions) actions.hidden = count === 0;
    if (count === 0) setCaptureContinueState("idle");
  }

  function setCaptureContinueState(state) {
    visionState = state;
    const button = $("#captureContinueBtn");
    if (!button) return;
    button.disabled = false;
    button.classList.toggle("is-ready", state === "ready");
    if (state === "ready") button.textContent = "Använd bild ✓";
    else if (state === "waiting") button.textContent = "Förbereder…";
    else button.textContent = "Använd bild";
  }

  function revokeUrl(inputId) {
    const url = objectUrls.get(inputId);
    if (url) URL.revokeObjectURL(url);
    objectUrls.delete(inputId);
  }

  function previewImage(inputId, previewId) {
    const input = $("#" + inputId);
    const preview = $("#" + previewId);
    const label = input.closest("label");
    const clearButton = label.querySelector(".remove-image");
    const file = input.files?.[0];

    revokeUrl(inputId);

    if (!file) {
      preview.hidden = true;
      preview.removeAttribute("src");
      label.classList.remove("has-image");
      clearButton.hidden = true;
      updateImageState();
      return;
    }

    const url = URL.createObjectURL(file);
    objectUrls.set(inputId, url);
    preview.src = url;
    preview.hidden = false;
    label.classList.add("has-image");
    clearButton.hidden = false;
    updateImageState();
    if (inputId === "mainImage") syncProductContext();
  }

  function clearImage(inputId) {
    const pair = imagePairs.find(([id]) => id === inputId);
    if (!pair) return;
    const input = $("#" + inputId);
    input.value = "";
    if (inputId === "mainImage" && demoImageActive) {
      demoImageActive = false;
      $("#mainPreview").hidden = true;
      $("#mainPreview").removeAttribute("src");
      $("#mainCameraLabel").classList.remove("has-image");
      $("#mainCameraLabel .remove-image").hidden = true;
      $$(".demo-card").forEach((card) => card.classList.remove("is-active"));
      updateImageState();
      if (!selectedImageCount()) {
        clearTimeout(visionTimer);
        ++visionRun;
        continueWhenReady = false;
        setCaptureContinueState("idle");
      }
      return;
    }
    previewImage(...pair);
    if (!selectedImageCount()) {
      clearTimeout(visionTimer);
      ++visionRun;
      continueWhenReady = false;
      setCaptureContinueState("idle");
    }
  }

  imagePairs.forEach(([inputId, previewId]) => {
    $("#" + inputId).addEventListener("change", () => {
      previewImage(inputId, previewId);
      if ($("#" + inputId).files?.length && selectedImageCount()) {
        scheduleVision();
      }
    });
  });

  $$('[data-clear]').forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      clearImage(button.dataset.clear);
    });
  });

  function scheduleVision(delay = 120) {
    clearTimeout(visionTimer);
    continueWhenReady = false;
    setCaptureContinueState("running");
    visionTimer = setTimeout(() => runVision(), delay);
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

  async function runVision() {
    if (!selectedImageCount()) return;

    const runId = ++visionRun;
    setCaptureContinueState("running");

    // v1.8: simulera arbetet utan popup eller vänteläge på skärmen.
    await new Promise((resolve) => setTimeout(resolve, 1050));
    if (runId !== visionRun) return;

    const demo = window.CCC_VISION_DEMOS?.[activeDemoKey] || window.CCC_VISION_DEMO;
    $("#summaryTitle").textContent = demo.summaryTitle;
    $("#summaryBrand").textContent = demo.summaryBrand;
    $("#summarySeason").textContent = demo.summarySeason;
    $("#confidencePill").textContent = selectedImageCount() > 1 ? "Säkerheten är hög" : demo.confidence;

    syncProductContext();
    setCaptureContinueState("ready");

    if (continueWhenReady) {
      continueWhenReady = false;
      showStage("visionCard");
    }
  }

  function continueFromCapture() {
    if (!selectedImageCount()) return;
    if (visionState === "ready") {
      showStage("visionCard");
      return;
    }
    continueWhenReady = true;
    setCaptureContinueState("waiting");
  }

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
    window.CCC_VISION_DEMO = demo;

    const preview = $("#mainPreview");
    preview.src = `demo/${key}.svg`;
    preview.hidden = false;
    $("#mainCameraLabel").classList.add("has-image");
    $("#mainCameraLabel .remove-image").hidden = false;
    syncProductContext();
    updateSmartSuggestions();
    $$(".demo-card").forEach((card) => card.classList.toggle("is-active", card.dataset.demo === key));

    showStage("captureCard");
    updateImageState();
    setMessage(`Demovara vald: ${demo.label}.`);
    $("#demoPanel").hidden = true;
    $("#demoToggleBtn").setAttribute("aria-expanded", "false");
    scheduleVision(300);
  }


  function toggleMorePhotos() {
    const panel = $("#morePhotosPanel");
    panel.hidden = !panel.hidden;
    $("#morePhotosBtn").setAttribute("aria-expanded", String(!panel.hidden));
    $("#morePhotosBtn").textContent = panel.hidden
      ? "+ Berätta mer med fler bilder"
      : "− Dölj extra bilder";
  }
  function toggleDemoPanel() {
    const panel = $("#demoPanel");
    panel.hidden = !panel.hidden;
    $("#demoToggleBtn").setAttribute("aria-expanded", String(!panel.hidden));
  }

  function openOwnItemPicker() {
    $("#mainImage").click();
  }

  $("#captureContinueBtn").addEventListener("click", continueFromCapture);
  $("#ownItemBtn").addEventListener("click", openOwnItemPicker);
  $("#morePhotosBtn").addEventListener("click", toggleMorePhotos);
  $("#demoToggleBtn").addEventListener("click", toggleDemoPanel);
  $$("[data-demo]").forEach((button) => {
    button.addEventListener("click", () => chooseDemo(button.dataset.demo));
  });

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
