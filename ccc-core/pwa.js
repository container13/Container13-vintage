(() => {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("../sw.js?v=2.8.43", {
        scope: "../",
        updateViaCache: "none"
      });
      await registration.update().catch(() => {});
    } catch (error) {
      console.warn("[CCC PWA] Service worker registration failed", error);
    }
  });
})();
