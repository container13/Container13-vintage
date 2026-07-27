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
  const headerTask = loadHtml("site-header", "includes/header.html");
  const footerTask = loadHtml("site-footer", "includes/footer.html");
  const settingsModuleTask = import("./site-settings.js?v=6.10.42");

  try {
    await headerTask;
    markCurrentPage();
    import("./status.js?v=4.0.0").catch((error) => {
      console.error("Kunde inte starta statusraden:", error);
    });
  } catch (error) {
    console.error("Kunde inte ladda sidans header:", error);
  }

  try {
    await footerTask;
    import("./theme-controls.js?v=2.0.0").catch((error) => {
      console.error("Kunde inte starta temaväljaren:", error);
    });
  } catch (error) {
    console.error("Kunde inte ladda sidans footer:", error);
  }

  try {
    const settingsModule = await settingsModuleTask;
    await settingsModule.applySiteSettings();
  } catch (error) {
    console.error("Kunde inte använda webbplatsens inställningar:", error);
  }
}

rememberHomeNavigation();
initializeLayout();
