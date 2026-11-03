import { initJourney } from './journey.js';
import { initProducts } from './products.js';
import { initLife } from './herolife.js';
import { initOps } from './heroops.js';
import { initChat } from './chat.js';
import { openDialog, closeDialog, isOpen } from './dialogs.js';
import { ASSETS, pic } from './manifest.js';

window.__booted = true;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const mqReduced = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = mqReduced.matches;
window.__reduced = reduced;

// ---------- Smooth scroll ----------
let lenis = null;
function startLenis() {
  if (lenis || reduced || !window.Lenis) return;
  lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 0.95 }); // a shorter glide keeps the scrubbed film tight to the wheel
  window.__lenis = lenis;
  lenis.on('scroll', update); // already inside the animation frame: draw in the same frame, not the next
  if (document.documentElement.classList.contains('is-locked')) lenis.stop();
  const raf = t => { if (!lenis) return; lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
function stopLenis() { if (!lenis) return; lenis.destroy(); lenis = null; window.__lenis = null; }
addEventListener('scroll', () => { if (!lenis) schedule(); }, { passive: true });

// ---------- Text splitting ----------
function splitWords(el) {
  let i = 0;
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'w';
          const inner = document.createElement('span'); inner.textContent = p; inner.style.setProperty('--i', i++);
          w.appendChild(inner); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
  };
  walk(el);
}
$$('[data-split]').forEach(splitWords);
$$('[data-roll]').forEach(el => {
  const t = el.textContent; el.setAttribute('aria-label', t); el.textContent = '';
  [...t].forEach((c, i) => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; s.dataset.c = c; s.style.setProperty('--i', i); s.setAttribute('aria-hidden', 'true'); el.appendChild(s); });
});
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
$$('[data-split],[data-reveal]').forEach(el => io.observe(el));

// ---------- Imagery ----------
$$('[data-thumb]').forEach(el => { const name = el.dataset.thumb; if (ASSETS.thumbs && ASSETS.thumbs[name]) el.appendChild(pic(ASSETS.thumbs[name], { sizes: '100vw' })); });

// ---------- Accreditations ribbon ----------
const tick = $('[data-ticker]');
const clone = document.createElement('div'); clone.className = 'ticker__clone'; clone.setAttribute('aria-hidden', 'true'); clone.innerHTML = tick.innerHTML;
clone.querySelectorAll('img').forEach(i => (i.alt = ''));
tick.appendChild(clone);
const tickBtn = $('[data-ticker-pause]');
tickBtn?.addEventListener('click', () => { const p = !tick.classList.contains('is-paused'); tick.classList.toggle('is-paused', p); tickBtn.textContent = p ? 'Play' : 'Pause'; });

// ---------- Hero lifecycle and the operations diagram in the fourth product card ----------
const hero = $('[data-scrub="hero"]');
const life = initLife($('[data-life]'), { reduced });
const ops = initOps($('[data-ops]'), { reduced });
// each illustration has its own pause; both also hold still while a dialog is open
const motion = [[life, $('[data-life] [data-motion-pause]')], [ops, $('[data-ops] [data-motion-pause]')]].map(([api, btn]) => ({ api, btn, user: false }));
const holdMotion = held => motion.forEach(m => m.api.setPaused(held || m.user));
motion.forEach(m => m.btn?.addEventListener('click', () => {
  m.user = !m.user; m.btn.setAttribute('aria-pressed', String(m.user)); m.btn.closest('[data-life],[data-ops]').classList.toggle('is-held', m.user); m.api.setPaused(m.user);
}));

// ---------- CTA status chips ----------
const chipsWrap = $('[data-chips]');
const CHIPS = [['Commitment typed', 'cv'], ['Exception cleared', 'cv'], ['Recorded with county', 'pcr'], ['Investor package ready', 'ndx'], ['Payoff ordered', 'cv'], ['Audit ready', 'ndx'], ['Closing disclosure sent', 'pcr'], ['Appraisal QC complete', 'ndx']];
const SPOTS = [[6, 14, .9], [72, 10, .7], [10, 76, .6], [80, 72, .8], [3, 46, .5], [86, 42, .65], [24, 90, .45], [62, 88, .55]];
const chips = CHIPS.map(([t, p], i) => {
  const d = document.createElement('div'); d.className = `cchip cchip--${p}`; d.dataset.i = i;
  const [x, y, z] = SPOTS[i]; if (x > 50) d.style.right = (100 - x - 8) + '%'; else d.style.left = x + '%'; d.style.top = y + '%';
  d.innerHTML = `<i></i>${t}`; chipsWrap.appendChild(d); return { d, z };
});
let mx = 0, my = 0;
$('.cta').addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; schedule(); }, { passive: true });

// ---------- Products and journey ----------
const productsSec = $('#products');
const products = initProducts(productsSec);
const journeySec = $('[data-scrub="journey"]');
const journey = initJourney(journeySec);

// ---------- Header ----------
const hdr = $('[data-hdr]');
const cta = $('[data-scrub="cta"]');
const menu = $('#menu'), menuBtn = $('[data-menu-open]'), chatDlg = $('[data-chat]');
const prodCards = $$('[data-prod]');
const darkBand = [$('[data-life]')].filter(Boolean);
// a band darkens the header only where it sits under the wordmark (the hero card is on the right on desktop)
const wordmark = $('.wordmark');
const inBand = el => { const r = el.getBoundingClientRect(), w = wordmark.getBoundingClientRect(); return r.top < 64 && r.bottom > 16 && r.left < w.right && r.right > w.left; };
let onDark = null, lastY = scrollY, hdrHidden = false;

// ---------- Scroll driver ----------
let queued = false, pinned = null;
function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
const progress = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); };
const onScreen = el => { const r = el.getBoundingClientRect(); return r.bottom > -50 && r.top < innerHeight + 50; };
function update() {
  queued = false; pinned = null;
  let dark = false, surf = false;
  if (onScreen(productsSec)) { products.update(); if (prodCards.some(inBand)) { dark = true; surf = true; } }
  if (onScreen(journeySec)) {
    const p = progress(journeySec); journey.render(p);
    const r = journeySec.getBoundingClientRect();
    if (r.top <= 0 && r.bottom > 30 && p > 0.05) dark = true;
    if (r.top <= 0 && r.bottom >= innerHeight) pinned = { el: journeySec, p, w: innerWidth, h: journeySec.offsetHeight };
  }
  if (onScreen(cta)) {
    const r = cta.getBoundingClientRect(); if (r.top < 30 && r.bottom > 30) dark = true;
    const cp = clamp((innerHeight - r.top) / (r.height + innerHeight), 0, 1);
    if (!reduced) chips.forEach(s => { s.d.style.transform = `translate3d(${(mx * s.z * -50).toFixed(1)}px, ${((0.5 - cp) * s.z * 300 + my * s.z * -30).toFixed(1)}px, 0)`; });
  }
  if (!dark && darkBand.some(el => onScreen(el) && inBand(el))) { dark = true; surf = true; }
  if (dark !== onDark) { onDark = dark; hdr.classList.toggle('on-dark', dark); }
  hdr.classList.toggle('is-solid', scrollY > 24 && (!dark || surf));
  const y = scrollY, top = y <= innerHeight * 0.6, anyOpen = isOpen(menu) || isOpen(chatDlg);
  if (!anyOpen && !top && y > lastY + 3 && !hdrHidden) { hdrHidden = true; hdr.classList.add('is-hidden'); }
  else if ((top || y < lastY - 3 || anyOpen) && hdrHidden) { hdrHidden = false; hdr.classList.remove('is-hidden'); }
  lastY = y;
}

// keep the place inside the pinned journey when the viewport really changes size
let resizeT = null, pinBeforeResize = null;
addEventListener('resize', () => {
  if (!pinBeforeResize && pinned) pinBeforeResize = pinned;
  clearTimeout(resizeT);
  resizeT = setTimeout(() => {
    journey.measure(); products.measure();
    const pin = pinBeforeResize; pinBeforeResize = null;
    if (pin && (innerWidth !== pin.w || pin.el.offsetHeight !== pin.h)) {
      const y = pin.el.getBoundingClientRect().top + scrollY + pin.p * Math.max(0, pin.el.offsetHeight - innerHeight);
      lenis ? lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y);
    }
    schedule();
  }, 140);
});

// ---------- Menu ----------
const menuClose = $('[data-menu-close]');
menuBtn.addEventListener('click', () => { openDialog(menu, { opener: menuBtn, initialFocus: menuClose }); menuBtn.setAttribute('aria-expanded', 'true'); hdr.classList.remove('is-hidden'); hdrHidden = false; });
menuClose.addEventListener('click', () => closeDialog(menu));
menu.addEventListener('click', e => { if (e.target === menu) closeDialog(menu); });
menu.addEventListener('dialog-close', () => menuBtn.setAttribute('aria-expanded', 'false'));
[menu, chatDlg].forEach(d => { d.addEventListener('dialog-open', () => holdMotion(true)); d.addEventListener('dialog-close', () => holdMotion(isOpen(menu) || isOpen(chatDlg))); });
menu.querySelector('[data-ask-open]')?.addEventListener('click', () => closeDialog(menu), { capture: true });

// ---------- Anchors through the smooth scroller, moving focus to the target ----------
function focusTarget(t) { if (!t.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  if (a.classList.contains('skip')) return;
  const id = a.getAttribute('href'); if (id.length < 2) return;
  const target = $(id); if (!target) return;
  e.preventDefault();
  if (isOpen(menu)) closeDialog(menu);
  const y = a.dataset.step ? journey.stepY(+a.dataset.step) : target.getBoundingClientRect().top + scrollY; // a service step lands on its place in the journey
  const done = () => focusTarget(target);
  if (lenis) lenis.scrollTo(y, { duration: 1.6, onComplete: done, force: true }); else { scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' }); setTimeout(done, reduced ? 0 : 900); }
}));

const concept = $('[data-concept]');
concept.addEventListener('click', () => concept.setAttribute('aria-expanded', concept.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'));

const clocks = $$('[data-clock]');
function tickClocks() { clocks.forEach(c => { c.textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: c.dataset.clock }); }); }
tickClocks(); setInterval(tickClocks, 20000);

document.addEventListener('visibilitychange', () => document.body.classList.toggle('paused', document.hidden));
mqReduced.addEventListener('change', e => {
  reduced = e.matches; window.__reduced = reduced;
  ops.setReduced(reduced); life.setReduced(reduced);
  reduced ? stopLenis() : startLenis();
  schedule();
});

initChat();

// ---------- Loader ----------
const bar = $('.loader__bar');
const MIN = reduced ? 0 : 500;
let fontsReady = false; document.fonts?.ready.then(() => { fontsReady = true; });
function loaderTick(now) {
  const k = clamp(now / MIN, 0, 1), shown = fontsReady ? k : Math.min(k, .9);
  bar?.style.setProperty('--lp', shown.toFixed(3));
  if (shown < 1) requestAnimationFrame(loaderTick);
  else {
    journey.measure(); products.measure(); ops.relayout(); life.relayout();
    document.body.classList.add('is-ready');
    setTimeout(() => { document.body.classList.remove('is-loading'); $('.loader')?.remove(); }, 800);
    startLenis(); schedule();
  }
}
requestAnimationFrame(loaderTick);
setTimeout(() => { fontsReady = true; }, 1500);
schedule();
