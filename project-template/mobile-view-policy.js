// Container13 mobile view policy v1. Mobile page pinch is disabled by default.
// Explicit image viewers may opt in with data-image-zoom="true" and must own
// their image-only zoom/pan handling (never zoom the entire page).
(() => {
  const key = Symbol.for('container13.mobile-view-policy');
  if (window[key]) return;
  window[key] = true;
  const isTouchView = () => navigator.maxTouchPoints > 0 &&
    (window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 1024);
  const imageViewer = target => target instanceof Element
    ? target.closest('[data-image-zoom="true"]') : null;
  const block = event => {
    if (!isTouchView() || !event.cancelable) return;
    if (event.type.startsWith('gesture')) {
      if (!imageViewer(event.target)) event.preventDefault();
      return;
    }
    if (!event.touches || event.touches.length < 2) return;
    const viewer = imageViewer(event.touches[0].target);
    const sameViewer = viewer && Array.from(event.touches).every(t => imageViewer(t.target) === viewer);
    if (!sameViewer) event.preventDefault();
  };
  for (const type of ['touchstart','touchmove','gesturestart','gesturechange'])
    document.addEventListener(type, block, {passive:false,capture:true});
})();
