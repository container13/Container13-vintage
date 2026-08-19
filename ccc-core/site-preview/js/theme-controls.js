const themeToggle = document.getElementById("footer-theme-toggle");
const themeStatus = document.getElementById("theme-choice-status");

function getActiveTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function updateThemeToggle() {
  if (!themeToggle) return;

  const activeTheme = getActiveTheme();
  const nextTheme = activeTheme === "dark" ? "light" : "dark";
  const icon = themeToggle.querySelector("i");

  if (icon) {
    icon.className = activeTheme === "dark" ? "fas fa-moon" : "fas fa-sun";
  }

  const actionLabel =
    nextTheme === "dark" ? "Byt till mörkt tema" : "Byt till ljust tema";

  themeToggle.title = actionLabel;
  themeToggle.setAttribute("aria-label", actionLabel);
  themeToggle.dataset.activeTheme = activeTheme;

  if (themeStatus) {
    themeStatus.textContent =
      activeTheme === "dark" ? "Mörkt tema är aktivt" : "Ljust tema är aktivt";
  }
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = getActiveTheme() === "dark" ? "light" : "dark";
  window.Container13Theme?.setChoice?.(nextTheme);
  updateThemeToggle();
});

window.addEventListener("container13themechange", updateThemeToggle);
updateThemeToggle();
