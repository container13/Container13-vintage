async function loadHtml(targetId, filePath) {
  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  const response = await fetch(filePath);

  if (!response.ok) {
    throw new Error(`Kunde inte läsa ${filePath}`);
  }

  target.innerHTML = await response.text();
}

function markCurrentPage() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".sidhuvud nav a").forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function rememberHomeNavigation() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (!link) return;

    try {
      const destination = new URL(link.href, window.location.href);
      const destinationPage =
        destination.pathname.split("/").pop() || "index.html";

      if (
        destination.origin === window.location.origin &&
        destinationPage === "index.html"
      ) {
        sessionStorage.setItem("c13StarIntroShown", "true");
      }
    } catch (_) {
      // Navigeringen ska fortsätta även om lagringen inte är tillgänglig.
    }
  });
}

async function initializeLayout() {
  try {
    await Promise.all([
      loadHtml("site-header", "includes/header.html"),
      loadHtml("site-footer", "includes/footer.html")
    ]);

    markCurrentPage();
    const statusTask = import("./status.js?v=3.7.0");
    const settingsTask = import("./site-settings.js?v=6.10.0")
      .then((settingsModule) => settingsModule.applySiteSettings());
    const themeTask = import("./theme-controls.js?v=1.0.0");

    await Promise.allSettled([statusTask, settingsTask, themeTask]);
  } catch (error) {
    console.error("Kunde inte ladda sidans gemensamma delar:", error);
  }
}

rememberHomeNavigation();
initializeLayout();
