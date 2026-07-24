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

async function initializeLayout() {
  try {
    await Promise.all([
      loadHtml("site-header", "includes/header.html"),
      loadHtml("site-footer", "includes/footer.html")
    ]);

    markCurrentPage();
    const settingsModule = await import("./site-settings.js?v=4.3.0");
    await settingsModule.applySiteSettings();
    await import("./status.js?v=3.6.0");
  } catch (error) {
    console.error("Kunde inte ladda sidans gemensamma delar:", error);
  }
}

initializeLayout();
