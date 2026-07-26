(() => {
  const STORAGE_KEY = "c13ThemeChoice";
  const allowedChoices = new Set(["auto", "light", "dark"]);
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function getChoice() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return allowedChoices.has(saved) ? saved : "auto";
    } catch (_) {
      return "auto";
    }
  }

  function resolveTheme(choice) {
    return choice === "auto" ? (media.matches ? "dark" : "light") : choice;
  }

  function applyChoice(choice, save = false) {
    const normalizedChoice = allowedChoices.has(choice) ? choice : "auto";
    const resolvedTheme = resolveTheme(normalizedChoice);

    document.documentElement.dataset.themeChoice = normalizedChoice;
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", resolvedTheme === "dark" ? "#171614" : "#f8f5ef");
    }

    if (save) {
      try {
        localStorage.setItem(STORAGE_KEY, normalizedChoice);
      } catch (_) {
        // Temat fungerar även om lokal lagring inte är tillgänglig.
      }
    }

    window.dispatchEvent(new CustomEvent("container13themechange", {
      detail: { choice: normalizedChoice, theme: resolvedTheme }
    }));
  }

  window.Container13Theme = {
    getChoice,
    setChoice(choice) {
      applyChoice(choice, true);
    },
    refresh() {
      applyChoice(getChoice());
    }
  };

  media.addEventListener?.("change", () => {
    if (getChoice() === "auto") {
      applyChoice("auto");
    }
  });

  applyChoice(getChoice());
})();
