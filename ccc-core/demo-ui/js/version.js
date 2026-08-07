(() => {
  const CCC_VERSION = "2.3.1";
  window.CCC_VERSION = CCC_VERSION;

  function applyVersion() {
    document.querySelectorAll('.js-ccc-version').forEach(el => {
      el.textContent = `v${CCC_VERSION}`;
    });

    const brand = document.querySelector('.ccc-brand-mark, .brand');
    if (brand && !brand.querySelector('.ccc-global-version')) {
      const badge = document.createElement('span');
      badge.className = 'ccc-global-version';
      badge.textContent = `v${CCC_VERSION}`;
      badge.setAttribute('aria-label', `CCC version ${CCC_VERSION}`);
      brand.appendChild(badge);
    } else if (!brand && !document.querySelector('.ccc-floating-version')) {
      const badge = document.createElement('span');
      badge.className = 'ccc-floating-version';
      badge.textContent = `v${CCC_VERSION}`;
      document.body.appendChild(badge);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyVersion);
  else applyVersion();
})();
