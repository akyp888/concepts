// NobleServe AI: a ChatGPT-style chat. Streams from /api/chat when it is deployed; otherwise answers locally from the same facts.
// One thread per mode (services, products, all), each kept in sessionStorage under 'ns-chat-<mode>'.
import { openDialog, closeDialog } from './dialogs.js';
import { localReply, SUGGEST } from './facts.js';

const MODES = {
  services: { label: 'About our services', hello: 'How can we help with your mortgage operations?' },
  products: { label: 'About our products', hello: 'What would you like to know about CloseVille, PCR or NobleDox?' },
  all: { label: 'Ask anything about NobleServe', hello: 'How can we help?' }
};
const KEY = 'ns-chat-', isMode = k => Object.hasOwn(MODES, k);
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const strs = a => Array.isArray(a) ? a.filter(x => typeof x === 'string') : [];
// paragraphs, plus runs of '- ' or '1. ' lines inside a block as ul / ol
function md(text) {
  return text.trim().split(/\n\s*\n/).map(b => {
    const out = []; let cur = null;
    b.split('\n').forEach(l => {
      const x = l.match(/^\s*(?:[-•*]|(\d+)\.)\s+(.*)/), tag = x ? (x[1] ? 'ol' : 'ul') : 'p';
      if (!cur || cur.tag !== tag) out.push(cur = { tag, n: x ? +x[1] : 0, items: [] });
      cur.items.push(inline(x ? x[2] : l));
    });
    return out.map(({ tag, n, items }) => tag === 'p' ? `<p>${items.join('<br>')}</p>` : `<${tag}${n > 1 ? ` start="${n}"` : ''}>${items.map(i => `<li>${i}</li>`).join('')}</${tag}>`).join('');
  }).join('');
}
const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(info@nobleserve\.com)/g, '<a href="mailto:$1">$1</a>');
function load(k) {
  try { const a = JSON.parse(sessionStorage.getItem(KEY + k) || '[]'); return Array.isArray(a) ? a.filter(h => h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string').slice(-30) : []; } catch (e) { return []; }
}

export function initChat() {
  const dlg = document.querySelector('[data-chat]');
  const log = dlg.querySelector('[data-chat-log]');
  const form = dlg.querySelector('[data-chat-form]');
  const input = dlg.querySelector('[data-chat-input]');
  const sendBtn = dlg.querySelector('[data-chat-send]');
  const modeEl = dlg.querySelector('[data-chat-mode]');
  const status = dlg.querySelector('[data-chat-status]');
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  // the old single thread ('ns-chat': { mode, history }) moves to its mode's key once
  try { const raw = sessionStorage.getItem('ns-chat'); if (raw !== null) { sessionStorage.removeItem('ns-chat'); const o = JSON.parse(raw), k = isMode(o?.mode) ? o.mode : 'all'; if (Array.isArray(o?.history) && o.history.length && sessionStorage.getItem(KEY + k) === null) sessionStorage.setItem(KEY + k, JSON.stringify(o.history.slice(-30))); } } catch (e) {}
  const threads = {}, thread = k => threads[k] || (threads[k] = load(k));
  let mode = 'all', history = thread(mode), shown = null, busy = false, stopFn = null, api = null, ptr = ''; // api: null unknown, true live, false not deployed
  const save = k => { try { sessionStorage.setItem(KEY + k, JSON.stringify(threads[k].slice(-30))); } catch (e) {} };
  const say = t => { if (status) status.textContent = t; };
  const stop = full => { if (busy && stopFn) stopFn(full); };

  function empty() {
    log.innerHTML = '';
    const e = document.createElement('div'); e.className = 'chat__empty';
    e.innerHTML = `<span class="chat__orb" aria-hidden="true"></span><h3>${MODES[mode].hello}</h3><p>Answers come only from what NobleServe has published, with the source shown.</p>`;
    const grid = document.createElement('div'); grid.className = 'chat__starters';
    (SUGGEST[mode] || SUGGEST.all).slice(0, 4).forEach(q => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chat__starter'; b.textContent = q; b.addEventListener('click', () => send(q)); grid.appendChild(b); });
    e.appendChild(grid); log.appendChild(e);
  }
  function userMsg(text) { const m = document.createElement('div'); m.className = 'cmsg cmsg--user'; m.innerHTML = `<div class="cmsg__bubble">${esc(text)}</div>`; log.appendChild(m); scroll(); }
  function botMsg() {
    const m = document.createElement('div'); m.className = 'cmsg cmsg--bot';
    m.innerHTML = '<span class="cmsg__avatar" aria-hidden="true"></span><div class="cmsg__body"><div class="cmsg__text" aria-hidden="true"><span class="cmsg__dots"><i></i><i></i><i></i></span></div></div>';
    log.appendChild(m); scroll(); return m;
  }
  function finish(m, text, sources, next, stopped = false) {
    const t = m.querySelector('.cmsg__text'); t.innerHTML = md(text); t.removeAttribute('aria-hidden');
    const body = m.querySelector('.cmsg__body');
    if (sources.length) { const s = document.createElement('div'); s.className = 'cmsg__src'; s.innerHTML = '<span class="sr">Sources:</span>' + sources.map(x => `<span>${esc(x)}</span>`).join(''); body.appendChild(s); }
    if (stopped) { const s = document.createElement('p'); s.className = 'cmsg__stopped mono'; s.textContent = 'Stopped'; body.appendChild(s); }
    if (next.length) { const n = document.createElement('div'); n.className = 'cmsg__next'; next.forEach(q => { const b = document.createElement('button'); b.type = 'button'; b.textContent = q; b.addEventListener('click', () => send(q)); n.appendChild(b); }); body.appendChild(n); }
    scroll();
  }
  const scroll = () => { log.scrollTop = log.scrollHeight; };
  function setBusy(v) { busy = v; dlg.classList.toggle('is-busy', v); sendBtn.setAttribute('aria-label', v ? 'Stop' : 'Send'); v ? log.setAttribute('aria-busy', 'true') : log.removeAttribute('aria-busy'); if (v) say('NobleServe AI is answering'); }

  // done(text): the full text, or only the words already shown when stopped (stop(true) shows the rest at once)
  function streamWords(m, text, done) {
    const el = m.querySelector('.cmsg__text');
    if (reduced()) { done(text); return () => {}; }
    const words = text.split(/(\s+)/); let i = 0, t;
    const tick = () => { i += 2; el.innerHTML = md(words.slice(0, i).join('')); scroll(); if (i < words.length) t = setTimeout(tick, 24); else done(text); };
    t = setTimeout(tick, 260);
    return full => { clearTimeout(t); done(full ? text : words.slice(0, i).join('').trimEnd()); };
  }

  async function remote(m, h, k, ctrl) {
    const res = await fetch('api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ mode: k, messages: h.slice(-12).map(({ role, content }) => ({ role, content })) }), signal: ctrl.signal });
    if (!res.ok || !res.body) throw new Error('unavailable ' + res.status);
    api = true;
    let sources = []; try { sources = strs(JSON.parse(decodeURIComponent(res.headers.get('x-sources') || '%5B%5D'))); } catch (e) {}
    const reader = res.body.getReader(), dec = new TextDecoder(), el = m.querySelector('.cmsg__text'); let text = '';
    try { for (;;) { const { done, value } = await reader.read(); if (done) break; text += dec.decode(value, { stream: true }); el.innerHTML = md(text); scroll(); } } catch (e) { /* stopped or dropped */ }
    text = text.replace(/—/g, ', ').trim();
    return { text: text || (ctrl.signal.aborted ? '' : 'Sorry, I could not answer that. Write to info@nobleserve.com.'), sources };
  }

  async function send(q) {
    q = (q || '').trim().slice(0, 1200); if (!q || busy) return;
    // a starter or chip is about to be removed: keep focus in the dialog (no on-screen keyboard after a tap)
    const a = document.activeElement; if (a !== input && dlg.contains(a)) (/touch|pen/.test(ptr) ? sendBtn : input).focus({ preventScroll: true });
    if (log.querySelector('.chat__empty')) log.innerHTML = '';
    log.querySelectorAll('.cmsg__next').forEach(n => n.remove());
    const h = history, k = mode;
    h.push({ role: 'user', content: q }); userMsg(q);
    const m = botMsg(); setBusy(true);
    let out = null, cut = false;
    if (api !== false && location.protocol.startsWith('http')) {
      const ctrl = new AbortController(); stopFn = () => ctrl.abort();
      // only "not deployed or not configured" switches the endpoint off; a 429 or 502 falls back for this answer only
      try { out = await remote(m, h, k, ctrl); } catch (e) { if (/^unavailable (404|405|501|503)$/.test(e.message)) api = false; }
      cut = ctrl.signal.aborted;
    }
    const r = localReply(h, k);
    if (!out && !cut) { const text = await new Promise(res => { stopFn = streamWords(m, r.text, res); }); out = { text, sources: r.sources }; cut = text !== r.text; }
    stopFn = null;
    if (threads[k] !== h) { setBusy(false); say(''); return; } // New chat dropped this thread
    const text = out ? out.text : '', srcs = text ? (out.sources.length ? out.sources : strs(r.sources)) : [], next = text && !cut ? strs(r.next) : [];
    if (text) h.push({ role: 'assistant', content: text, topic: r.topic, sources: srcs, next, stopped: cut }); else h.pop(); // stopped before any text: drop the question
    save(k);
    if (h === history) { finish(m, text || 'Stopped.', srcs, next, cut && !!text); say(text ? text.replace(/\*\*/g, '').replace(/^\s*[-•*]\s+/gm, '') + (cut ? ' Stopped.' : '') + (srcs.length ? ` Sources: ${srcs.join('; ')}.` : '') : 'Stopped.'); }
    setBusy(false);
  }

  function restore() {
    shown = history;
    if (!history.length) { empty(); return; }
    log.innerHTML = '';
    history.forEach((h, i) => { if (h.role === 'user') userMsg(h.content); else finish(botMsg(), h.content, strs(h.sources), i === history.length - 1 ? strs(h.next) : [], h.stopped === true); });
  }

  form.addEventListener('submit', e => { e.preventDefault(); if (busy) { stop(); return; } const v = input.value; input.value = ''; grow(); send(v); });
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); if (!busy) form.requestSubmit(); } });
  const grow = () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 180) + 'px'; };
  input.addEventListener('input', grow);
  dlg.addEventListener('pointerdown', e => { ptr = e.pointerType; }, true);
  dlg.addEventListener('keydown', () => { ptr = 'key'; }, true);
  dlg.querySelector('[data-chat-new]').addEventListener('click', () => { stop(); history = threads[mode] = []; save(mode); restore(); say(''); input.focus(); });
  dlg.querySelector('[data-chat-close]').addEventListener('click', () => close());
  dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
  dlg.addEventListener('dialog-close', () => stop(true)); // X, backdrop, Escape and Cmd+K all land here

  function open(newMode, opener, q) {
    if (isMode(newMode) && newMode !== mode) { stop(); mode = newMode; history = thread(mode); say(''); }
    modeEl.textContent = MODES[mode].label;
    const short = innerWidth < 600; // a placeholder that wraps gets cut mid-word in the one-line composer
    input.placeholder = mode === 'products' ? (short ? 'Ask about our products' : 'Ask about CloseVille, PCR or NobleDox') : mode === 'services' ? (short ? 'Ask about our services' : 'Ask about our mortgage services') : 'Message NobleServe AI';
    if (shown !== history) restore();
    if (dlg.hidden) openDialog(dlg, { opener: opener || document.activeElement, initialFocus: input });
    if (q) send(q);
  }
  const close = () => closeDialog(dlg);
  document.querySelectorAll('[data-ask-open]').forEach(b => b.addEventListener('click', () => open(b.dataset.mode || 'all', b, b.dataset.askQ)));
  document.querySelectorAll('[data-ask-form]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const field = f.querySelector('input');
    const q = field.value.trim();
    field.value = '';
    field.blur();
    open(f.dataset.mode || 'all', f.querySelector('button') || f, q || undefined);
  }));
  addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dlg.hidden ? open() : close(); } });
  return { open, close };
}
