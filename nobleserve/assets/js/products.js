// Our products: three stacked cards, each with a scroll-driven illustration.
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ss = (x, a, b) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

function makeCache() { const c = new Map(); return { prop(node, k, v) { const key = node.__id + k; if (c.get(key) !== v) { c.set(key, v); node.style.setProperty(k, v); } }, cls(node, k, on) { const key = node.__id + 'c' + k; if (c.get(key) !== on) { c.set(key, on); node.classList.toggle(k, on); } }, text(node, v) { const key = node.__id + 't'; if (c.get(key) !== v) { c.set(key, v); node.textContent = v; } } }; }
let uid = 0; const tag = n => { n.__id = 'n' + (++uid); return n; };

// ---------- CloseVille ----------
function closeVille(art, cache) {
  const sheet = art.querySelector('.sheet'), scan = art.querySelector('[data-scan]');
  const fields = [...art.querySelectorAll('[data-f]')].map(tag);
  const rows = [...art.querySelectorAll('[data-r]')].map(tag);
  const rule = tag(art.querySelector('[data-cv-rule]')), ready = tag(art.querySelector('[data-cv-ready]')), sync = tag(art.querySelector('[data-cv-sync]'));
  const req = rows.find(r => r.classList.contains('cv__row--req'));
  tag(art); tag(sheet); tag(scan);
  let fy = {};
  function measure() { const h = sheet.offsetHeight || 1; fy = {}; fields.forEach(f => { fy[f.dataset.f] = (f.offsetTop + f.offsetHeight / 2) / h; }); }
  function render(p) {
    const sc = ss(p, 0.14, 0.7);
    cache.prop(sheet, '--scan', sc.toFixed(4));
    cache.prop(scan, '--scanO', (ss(p, 0.12, 0.16) * (1 - ss(p, 0.7, 0.74))).toFixed(3));
    fields.forEach(f => cache.cls(f, 'hit', sc > fy[f.dataset.f]));
    rows.forEach(r => {
      const t = r.dataset.t, rp = clamp((sc - (fy[r.dataset.r] ?? 1) - 0.015) / 0.09, 0, 1);
      cache.text(r, t.slice(0, Math.round(t.length * rp)));
      cache.cls(r, 'typing', rp > 0 && rp < 1);
    });
    const ruled = sc > (fy['5'] ?? 1) + 0.05;
    cache.cls(rule, 'on', ruled && p < (matchMedia('(max-width: 560px)').matches ? 0.8 : 0.92)); if (req) cache.cls(req, 'is-rule', ruled);
    cache.cls(ready, 'on', p > 0.8); cache.cls(sync, 'on', p > 0.86);
  }
  return { render, measure };
}

// ---------- PCR ----------
function pcr(art, cache) {
  tag(art);
  const STN = [['Closing table', 0], ['Classify & index', 0.26], ['Stack & QC', 0.5], ['County recording', 0.74], ['Shipped', 1]];
  const track = el('div', 'pcr__track');
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 100 60'); svg.setAttribute('preserveAspectRatio', 'none');
  const path = document.createElementNS(NS, 'path'); path.setAttribute('d', 'M10 42 C 20 8, 30 8, 38 30 S 54 58, 63 34 S 80 6, 88 26');
  svg.appendChild(path); track.appendChild(svg); art.appendChild(track);
  const total = path.getTotalLength();
  const at = f => { const pt = path.getPointAtLength(total * clamp(f, 0, 1)); return [pt.x, pt.y / 60 * 100]; };
  const dots = Array.from({ length: 44 }, (_, i) => { const f = i / 43, [x, y] = at(f); const d = tag(el('i', 'pcr__dot')); d.style.left = x + '%'; d.style.top = y + '%'; d.__f = f; track.appendChild(d); return d; });
  const stations = STN.map(([label, f], i) => { const [x, y] = at(f); const s = tag(el('div', 'pcr__st' + (i === 0 ? ' pcr__st--first' : i === STN.length - 1 ? ' pcr__st--last' : ''), `<i>${String(i + 1).padStart(2, '0')}</i><span>${label}</span>`)); s.style.left = x + '%'; s.style.top = y + '%'; s.__f = f; track.appendChild(s); return s; });
  const tok = tag(el('div', 'pcr__tok', '<b></b><b></b><b></b>')); track.appendChild(tok);
  const pos = f => at(f);
  const [x1, y1] = pos(0.26), [x2, y2] = pos(0.5), [x3, y3] = pos(0.74), [x4, y4] = pos(1);
  const chip = (cls, text, x, y) => { const c = tag(el('div', 'pcr__ev ' + cls, text)); c.style.left = x + '%'; c.style.top = y + '%'; track.appendChild(c); return c; };
  const tags = [chip('pcr__ev--tag', 'Deed', x1 - 9, y1 + 14), chip('pcr__ev--tag', 'Mortgage', x1, y1 + 26), chip('pcr__ev--tag', 'Assignment', x1 + 10, y1 + 14)];
  const bad = chip('pcr__ev--bad', '⚠ Exception · notary seal missing, page 4', x2, y2 + 16);
  const ok = chip('pcr__ev--ok', '✓ Corrected and re-stacked', x2, y2 + 16);
  const fin = chip('pcr__ev--ok pcr__ev--end', 'Returned · shipped · tracked', x4 + 2, y4 + 34);
  const stamp = tag(el('div', 'pcr__stamp', 'Recorded')); stamp.style.left = x3 + '%'; stamp.style.top = (y3 + 22) + '%'; track.appendChild(stamp);
  const STAT = ['Closed', 'Classified', 'Stacked', 'In QC', 'At county', 'Recorded', 'Shipped'];
  const board = el('div', 'pcr__board', '<h4>Live lifecycle · sample files</h4>');
  const rowsEl = el('div', 'pcr__rows'); board.appendChild(rowsEl); art.appendChild(board);
  const rows = [0, 1, 2, 3].map(i => { const r = el('div', 'pcr__row', `<em>File A-10${42 + i}</em><b></b><i></i>`); rowsEl.appendChild(r); return { b: tag(r.querySelector('b')), i: tag(r.querySelector('i')) }; });
  function render(p) {
    const f = clamp((p - 0.06) / 0.8, 0, 1);
    const [x, y] = at(f); cache.prop(tok, 'left', x.toFixed(2) + '%'); cache.prop(tok, 'top', y.toFixed(2) + '%');
    cache.prop(tok, 'opacity', (1 - ss(f, 0.93, 1)).toFixed(3)); // the file ships: clear the last label
    dots.forEach(d => cache.cls(d, 'on', d.__f <= f + 0.001));
    stations.forEach(s => cache.cls(s, 'on', f >= s.__f - 0.004));
    tags.forEach((t, i) => cache.cls(t, 'on', f > 0.2 + i * 0.02 && f < 0.47));
    cache.cls(bad, 'on', f >= 0.46 && f < 0.58); cache.cls(ok, 'on', f >= 0.58 && f < 0.72);
    const e = ss(f, 0.72, 0.79);
    cache.prop(stamp, '--ss', (1.8 - 0.8 * e).toFixed(3)); cache.prop(stamp, '--so', e.toFixed(3));
    cache.cls(fin, 'on', f > 0.97);
    rows.forEach((r, i) => { const idx = clamp(Math.floor(f * 7.4 - i * 0.8), 0, 6); cache.text(r.b, STAT[idx]); cache.prop(r.i, '--f', (idx / 6).toFixed(3)); });
  }
  return { render, measure() {} };
}

// ---------- NobleDox ----------
function nobleDox(art, cache) {
  tag(art);
  const TYPES = ['Note', 'Mortgage', 'Deed', 'Title policy', 'Closing disclosure', 'Appraisal'];
  art.appendChild(el('div', 'ndx__beam'));
  const bins = el('div', 'ndx__bins'); tag(bins);
  const binEls = TYPES.map(t => { const b = el('div', 'ndx__bin', `<span>${t}</span><b>0</b>`); bins.appendChild(b); return tag(b.querySelector('b')); });
  art.appendChild(bins);
  const docsWrap = tag(el('div', 'ndx__docs')); docsWrap.style.cssText = 'position:absolute;inset:0;opacity:var(--bo,1)'; art.appendChild(docsWrap);
  let s = 7; const r = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const slots = new Array(6).fill(0);
  const docs = Array.from({ length: 12 }, (_, k) => {
    const type = k % 6, slot = slots[type]++;
    const d = tag(el('div', 'ndx__doc', `<em>${TYPES[type]}</em>`));
    const x0 = 5 + (k % 3) * 6.5 + r() * 1.5, y0 = 9 + Math.floor(k / 3) * 17 + r() * 2, r0 = (r() - 0.5) * 12;
    const x2 = 86 - slot * 2.4, y2 = 7.4 + type * 12;
    docsWrap.appendChild(d);
    return { d, type, x0, y0, r0, x2, y2, t0: 0.06 + k * 0.05 };
  });
  const pkg = tag(el('div', 'ndx__pkg', '<p>Investor package · sample</p><h4>Stacked to investor order</h4>'));
  const checks = ['Classified', 'Indexed', 'Stacked to investor order', 'Audit ready'].map(t => { const c = tag(el('div', 'ndx__chk', `<i>✓</i>${t}`)); pkg.appendChild(c); return c; });
  pkg.appendChild(el('div', 'ndx__viz', [0, 1, 2, 3].map(i => `<b style="--i:${i}"></b>`).join('')));
  art.appendChild(pkg);
  function render(p) {
    const counts = new Array(6).fill(0);
    docs.forEach(o => {
      const e = ss(p, o.t0, o.t0 + 0.14);
      let x, y, sc, rot;
      if (e < 0.5) { const k = e / 0.5; x = o.x0 + (36 - o.x0) * k; y = o.y0 + (40 - o.y0) * k * 0.6; sc = 1; rot = o.r0 * (1 - k); }
      else { const k = (e - 0.5) / 0.5; const ym = o.y0 + (40 - o.y0) * 0.6; x = 36 + (o.x2 - 36) * k; y = ym + (o.y2 - ym) * k; sc = 1 - 0.5 * k; rot = 0; }
      cache.prop(o.d, '--x', x.toFixed(2)); cache.prop(o.d, '--y', y.toFixed(2)); cache.prop(o.d, '--s', sc.toFixed(3)); cache.prop(o.d, '--r', rot.toFixed(1) + 'deg');
      cache.prop(o.d, '--lo', ss(e, 0.45, 0.56).toFixed(3));
      if (e > 0.985) counts[o.type]++;
    });
    binEls.forEach((b, i) => cache.text(b, String(counts[i])));
    const po = ss(p, 0.8, 0.88);
    cache.prop(pkg, '--po', po.toFixed(3)); cache.prop(art, '--bo', (1 - po).toFixed(3)); cache.prop(bins, '--bo', (1 - po).toFixed(3)); cache.prop(docsWrap, '--bo', (1 - po).toFixed(3));
    checks.forEach((c, i) => cache.cls(c, 'on', p > 0.86 + i * 0.03));
  }
  return { render, measure() {} };
}

export function initProducts(section) {
  const stack = section.querySelector('[data-products]');
  const cards = [...stack.querySelectorAll('[data-prod]')].map(tag);
  const cache = makeCache();
  const arts = cards.map(card => {
    const art = card.querySelector('[data-art]');
    const kind = art.dataset.art;
    return kind === 'cv' ? closeVille(art, cache) : kind === 'pcr' ? pcr(art, cache) : kind === 'ndx' ? nobleDox(art, cache) : { render() {}, measure() {} };
  });
  const mqStack = matchMedia('(max-width: 900px), (max-height: 560px)');
  const narrow = () => mqStack.matches;
  function measure() { arts.forEach(a => a.measure()); }
  // Each card's illustration eases toward its scroll position, so the animation glides instead of jumping.
  const target = cards.map(() => 0), shown = cards.map(() => 0);
  let raf = null, last = 0;
  function step(now) {
    const dt = Math.min(64, now - (last || now)); last = now;
    const k = 1 - Math.pow(1 - 0.06, dt / 16.667);
    let moving = false;
    cards.forEach((c, i) => {
      const d = target[i] - shown[i];
      if (Math.abs(d) > 0.0006) { shown[i] += d * k; moving = true; } else shown[i] = target[i];
      arts[i].render(shown[i]);
    });
    raf = moving ? requestAnimationFrame(step) : (last = 0, null);
  }
  function kick() { if (raf === null) raf = requestAnimationFrame(step); }
  function update() {
    const reduced = !!window.__reduced;
    if (narrow()) {
      cards.forEach((card, k) => {
        const r = card.querySelector('[data-art]').getBoundingClientRect();
        target[k] = reduced ? 1 : clamp((innerHeight * 0.9 - r.top) / (innerHeight * 0.9), 0, 1);
        cache.prop(card, '--cs2', '1'); cache.prop(card, '--cover', '0');
      });
    } else {
      const stackTop = stack.getBoundingClientRect().top + scrollY;
      const H = cards[0].offsetHeight, D = parseFloat(getComputedStyle(cards[1]).marginTop) || innerHeight;
      cards.forEach((card, k) => {
        const stuckAt = stackTop + k * (H + D) - 16;
        // the animation starts as the card arrives and finishes a little before the next card covers it
        target[k] = reduced ? 1 : clamp((scrollY - stuckAt + innerHeight * 0.25) / (D * 0.95 + innerHeight * 0.25), 0, 1);
        const q = k < cards.length - 1 ? clamp((scrollY - stuckAt - D) / H, 0, 1) : 0;
        cache.prop(card, '--cs2', (1 - 0.05 * q).toFixed(4));
        cache.prop(card, '--cover', (0.6 * q).toFixed(3));
      });
    }
    if (reduced) { cards.forEach((c, i) => { shown[i] = target[i]; arts[i].render(1); }); return; }
    kick();
  }
  measure();
  return { update, measure };
}
