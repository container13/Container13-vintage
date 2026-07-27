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

function initializeMobileMenu() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const navigation = document.getElementById("main-navigation");

  if (!toggle || !navigation) {
    return;
  }

  const setMenuOpen = (isOpen) => {
    navigation.classList.toggle("oppen", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Stäng meny" : "Öppna meny");

    const icon = toggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars", !isOpen);
      icon.classList.toggle("fa-times", isOpen);
    }
  };

  toggle.addEventListener("click", () => {
    setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
      toggle.focus();
    }
  });
}

function placeScrollableNotices() {
  const headerHost = document.getElementById("site-header");
  const notices = headerHost?.querySelector(".site-notiser");

  if (headerHost && notices) {
    headerHost.insertAdjacentElement("afterend", notices);
  }
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
    placeScrollableNotices();
    initializeMobileMenu();
    const statusTask = import("./status.js?v=3.7.0");
    const settingsTask = import("./site-settings.js?v=6.10.0")
      .then((settingsModule) => settingsModule.applySiteSettings());
    const themeTask = import("./theme-controls.js?v=2.0.0");

    await Promise.allSettled([statusTask, settingsTask, themeTask]);
  } catch (error) {
    console.error("Kunde inte ladda sidans gemensamma delar:", error);
  }
}

rememberHomeNavigation();
initializeLayout();
