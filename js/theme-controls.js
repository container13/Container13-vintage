const themeButtons = Array.from(document.querySelectorAll("[data-theme-choice]"));
const themeStatus = document.getElementById("theme-choice-status");

const choiceLabels = {
  auto: "Automatiskt tema",
  light: "Ljust tema",
  dark: "Mörkt tema"
};

function updateThemeControls() {
  const choice = window.Container13Theme?.getChoice?.() || "auto";

  themeButtons.forEach((button) => {
    const isSelected = button.dataset.themeChoice === choice;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  if (themeStatus) {
    themeStatus.textContent = `Valt: ${choiceLabels[choice] || choiceLabels.auto}`;
  }
}

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    window.Container13Theme?.setChoice?.(button.dataset.themeChoice);
    updateThemeControls();
  });
});

window.addEventListener("container13themechange", updateThemeControls);
updateThemeControls();
