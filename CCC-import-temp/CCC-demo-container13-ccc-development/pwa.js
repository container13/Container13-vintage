(() => {
  const VISIT_KEY = "c13PwaVisitCount";
  const SESSION_KEY = "c13PwaVisitRegistered";
  const DISMISSED_KEY = "c13PwaPromptDismissedUntil";
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  let deferredInstallPrompt = null;

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js?v=6.10.53", { updateViaCache: "none" })
        .then((registration) => {
          registration.update().catch(() => {});
        })
        .catch(() => {});
    });
  }

  function isInstalled() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  function isMobileDevice() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.matchMedia("(pointer: coarse)").matches;
  }

  function isIos() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  function registerVisit() {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      const next = Math.max(0, Number(localStorage.getItem(VISIT_KEY)) || 0) + 1;
      localStorage.setItem(VISIT_KEY, String(next));
      sessionStorage.setItem(SESSION_KEY, "true");
    }
    return Number(localStorage.getItem(VISIT_KEY)) || 1;
  }

  function firestoreBoolean(field, fallback = true) {
    if (!field) return fallback;
    if (typeof field.booleanValue === "boolean") return field.booleanValue;
    return fallback;
  }

  async function promptIsEnabled() {
    try {
      const { getRawSiteSettings } =
        await import("./js/site-data.js?v=1.0.0");
      const settings = await getRawSiteSettings();
      return firestoreBoolean(
        settings?.fields?.showPwaInstallPrompt,
        true
      );
    } catch (_) {
      return true;
    }
  }

  function addStyles() {
    if (document.getElementById("c13-pwa-install-styles")) return;
    const style = document.createElement("style");
    style.id = "c13-pwa-install-styles";
    style.textContent = `
      .c13-install-card{position:fixed;left:14px;right:14px;bottom:14px;z-index:10000;max-width:520px;margin:auto;background:#fffdf8;border:1px solid rgba(43,35,29,.18);border-radius:16px;box-shadow:0 12px 35px rgba(0,0,0,.22);padding:18px;color:#2b231d;font-family:inherit}
      .c13-install-card[hidden]{display:none!important}.c13-install-card h2{font-size:20px;line-height:1.2;margin:0 34px 7px 0}.c13-install-card p{margin:0 0 14px;line-height:1.45}.c13-install-close{position:absolute;right:10px;top:9px;border:0;background:transparent;font-size:28px;line-height:1;cursor:pointer;color:#55483e;padding:3px 8px}.c13-install-actions{display:flex;gap:10px;flex-wrap:wrap}.c13-install-primary,.c13-install-secondary{border:0;border-radius:10px;padding:11px 15px;font:inherit;font-weight:800;cursor:pointer}.c13-install-primary{background:#2b231d;color:white}.c13-install-secondary{background:#eee7dd;color:#2b231d}.c13-install-steps{background:#f3eee7;border-radius:10px;padding:12px 14px;margin:10px 0 14px}.c13-install-toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:10001;background:#2b231d;color:white;padding:12px 18px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.25);font:700 15px/1.3 inherit}
    `;
    document.head.appendChild(style);
  }

  function showToast(message) {
    addStyles();
    const toast = document.createElement("div");
    toast.className = "c13-install-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }

  function dismiss(card) {
    localStorage.setItem(DISMISSED_KEY, String(Date.now() + THIRTY_DAYS));
    card.remove();
  }

  function createCard() {
    if (document.getElementById("c13-install-card") || isInstalled()) return;
    addStyles();
    const card = document.createElement("aside");
    card.id = "c13-install-card";
    card.className = "c13-install-card";
    card.setAttribute("aria-label", "Lägg till Container13 på hemskärmen");

    const ios = isIos();
    card.innerHTML = `
      <button class="c13-install-close" type="button" aria-label="Stäng">×</button>
      <h2>Gillar du Container13?</h2>
      <p>Lägg till sidan på hemskärmen så har du butiken, öppettiderna och Nyinkommet ett tryck bort.</p>
      ${ios ? '<div class="c13-install-steps"><strong>På iPhone:</strong><br>1. Tryck på Dela-symbolen i Safari.<br>2. Välj <strong>Lägg till på hemskärmen</strong>.<br>3. Tryck på <strong>Lägg till</strong>.</div>' : ''}
      <div class="c13-install-actions">
        <button class="c13-install-primary" type="button">${ios ? "Visa hur" : "Lägg till på hemskärmen"}</button>
        <button class="c13-install-secondary" type="button">Inte nu</button>
      </div>`;

    const close = card.querySelector(".c13-install-close");
    const secondary = card.querySelector(".c13-install-secondary");
    const primary = card.querySelector(".c13-install-primary");
    close.addEventListener("click", () => dismiss(card));
    secondary.addEventListener("click", () => dismiss(card));
    primary.addEventListener("click", async () => {
      if (ios) {
        const steps = card.querySelector(".c13-install-steps");
        steps?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const choice = await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        if (choice.outcome === "accepted") card.remove();
      } else {
        primary.textContent = "Öppna webbläsarens meny ⋮";
        const paragraph = card.querySelector("p");
        paragraph.textContent = "Välj Installera app eller Lägg till på startskärmen i webbläsarens meny.";
      }
    });
    document.body.appendChild(card);
  }

  async function maybeShowPrompt() {
    const visitCount = registerVisit();
    if (!isMobileDevice() || isInstalled() || visitCount < 2) return;
    const dismissedUntil = Number(localStorage.getItem(DISMISSED_KEY)) || 0;
    if (dismissedUntil > Date.now()) return;
    if (!(await promptIsEnabled())) return;
    createCard();
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
  });

  window.addEventListener("appinstalled", () => {
    localStorage.removeItem(DISMISSED_KEY);
    document.getElementById("c13-install-card")?.remove();
    showToast("Container13 har lagts till på hemskärmen ✓");
  });

  window.addEventListener("DOMContentLoaded", maybeShowPrompt);
})();
