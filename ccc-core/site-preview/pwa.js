(() => {
  // CCC site-preview: medvetet neutraliserad.
  // Förhandsvisningen ska aldrig registrera service worker,
  // visa installationsprompt eller skriva PWA-relaterad state.
  window.C13_SITE_PREVIEW = true;
})();
