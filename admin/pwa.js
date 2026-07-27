if ("serviceWorker" in navigator) {
  let reloadingForAdminUpdate = false;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js?v=6.10.38", { updateViaCache: "none" })
      .then((registration) => registration.update())
      .catch((error) => {
        console.warn("Service worker kunde inte registreras:", error);
      });
  });

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloadingForAdminUpdate) return;
    reloadingForAdminUpdate = true;
    window.location.reload();
  });
}
