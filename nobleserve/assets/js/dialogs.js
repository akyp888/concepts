// Modal dialogs: inert background, focus kept inside, one Escape closes the top dialog, scroll locked with or without Lenis.
const stack = [];
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea,select,[tabindex]:not([tabindex="-1"])';
const canFocus = el => !!el && document.contains(el) && !el.closest('[inert]') && el.getClientRects().length > 0;

function setBackgroundInert(top) {
  [...document.body.children].forEach(el => {
    if (el.tagName === 'SCRIPT') return;
    const shouldInert = el !== top;
    if (shouldInert && !el.hasAttribute('data-was-inert')) { el.setAttribute('data-was-inert', el.inert ? '1' : '0'); el.inert = true; }
    if (!shouldInert && el.hasAttribute('data-was-inert')) { el.inert = el.getAttribute('data-was-inert') === '1'; el.removeAttribute('data-was-inert'); }
  });
}
function restoreBackground() {
  document.querySelectorAll('[data-was-inert]').forEach(el => { el.inert = el.getAttribute('data-was-inert') === '1'; el.removeAttribute('data-was-inert'); });
}
function lockScroll(on) {
  if (window.__lenis) on ? window.__lenis.stop() : window.__lenis.start();
  document.documentElement.classList.toggle('is-locked', on);
}

export function openDialog(el, { opener, initialFocus } = {}) {
  if (stack.some(s => s.el === el)) return;
  if (!canFocus(opener) && canFocus(document.activeElement)) opener = document.activeElement; // opener hidden by a dialog that just closed (menu Ask)
  stack.push({ el, opener });
  el.hidden = false;
  setBackgroundInert(el);
  if (stack.length === 1) lockScroll(true);
  (initialFocus || el.querySelector(FOCUSABLE))?.focus({ preventScroll: true });
  el.dispatchEvent(new CustomEvent('dialog-open'));
}
export function closeDialog(el) {
  const i = stack.findIndex(s => s.el === el); if (i < 0) return;
  const [{ opener }] = stack.splice(i, 1);
  el.hidden = true;
  el.dispatchEvent(new CustomEvent('dialog-close'));
  if (stack.length) setBackgroundInert(stack[stack.length - 1].el);
  else { restoreBackground(); lockScroll(false); }
  if (canFocus(opener)) opener.focus({ preventScroll: true });
}
export const isOpen = el => stack.some(s => s.el === el);

addEventListener('keydown', e => {
  if (!stack.length) return;
  const top = stack[stack.length - 1].el;
  if (e.key === 'Escape') { e.preventDefault(); closeDialog(top); return; }
  if (e.key === 'Tab') {
    const f = [...top.querySelectorAll(FOCUSABLE)].filter(x => x.offsetParent !== null || x === document.activeElement);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
