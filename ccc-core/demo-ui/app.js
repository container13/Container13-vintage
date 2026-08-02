const saveButton = document.getElementById("save");
const theme = document.getElementById("theme");
const message = document.getElementById("message");

saveButton.addEventListener("click", () => {
  message.textContent = "Configuration sparad (demo)";
});
