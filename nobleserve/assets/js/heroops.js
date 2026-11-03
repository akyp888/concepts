// Fourth product card: how a file moves. Files flow into NobleServe's platforms, pass expert review, and come out as finished work (illustration, sample data).
const NS = 'http://www.w3.org/2000/svg';
const EVENTS = [
  { i: 1, p: 'cv', o: 1, log: 'CloseVille typed the commitment · examiner approved' },
  { i: 2, p: 'pcr', o: 2, log: 'PCR · deed recorded with the county · package shipped' },
  { i: 0, p: 'ndx', o: 0, log: 'NobleDox classified and indexed the loan file' },
  { i: 1, p: 'cv', o: 1, exc: true, log: 'Open 2009 lien found · curative ordered the payoff' },
  { i: 3, p: 'ndx', o: 3, log: 'NobleDox stacked the investor package · audit ready' },
  { i: 2, p: 'pcr', o: 2, log: 'PCR flagged a missing page · corrected and re-stacked' }
];
const WIRES = [['in', 0, 'ndx'], ['in', 1, 'cv'], ['in', 2, 'pcr'], ['in', 3, 'ndx'], ['out', 'ndx', 0], ['out', 'cv', 1], ['out', 'pcr', 2], ['out', 'ndx', 3]];

export function initOps(root, { reduced = false } = {}) {
  const svg = root.querySelector('.ops__wires');
  const ins = [...root.querySelectorAll('[data-in]')], outs = [...root.querySelectorAll('[data-out]')];
  const plats = Object.fromEntries([...root.querySelectorAll('[data-plat]')].map(e => [e.dataset.plat, e]));
  const review = root.querySelector('[data-review]');
  const logEl = root.querySelector('[data-log]');
  let paths = {}, particles = [], raf = null, visible = true, paused = false, timers = [], k = 4, lastSpawn = 0, fileNo = 0;

  function anchor(el, side) {
    const r = el.getBoundingClientRect(), b = root.getBoundingClientRect();
    const x = r.left - b.left, y = r.top - b.top;
    return side === 'r' ? [x + r.width, y + r.height / 2] : side === 'l' ? [x, y + r.height / 2] : side === 'b' ? [x + r.width / 2, y + r.height] : [x + r.width / 2, y];
  }
  function curve(a, b) {
    const vertical = b[1] - a[1] > Math.abs(b[0] - a[0]) * 0.6;
    if (vertical) { const m = (b[1] - a[1]) / 2; return `M${a[0]} ${a[1]} C${a[0]} ${a[1] + m},${b[0]} ${b[1] - m},${b[0]} ${b[1]}`; }
    const m = (b[0] - a[0]) / 2; return `M${a[0]} ${a[1]} C${a[0] + m} ${a[1]},${b[0] - m} ${b[1]},${b[0]} ${b[1]}`;
  }
  function layout() {
    const b = root.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
    svg.querySelectorAll('path').forEach(p => p.remove()); // keep dots in flight
    paths = {};
    if (getComputedStyle(svg).display === 'none') return; // narrow screens: no wires, the highlights carry it
    const portrait = matchMedia('(max-width: 900px)').matches;
    WIRES.forEach(([dir, from, to]) => {
      const s = dir === 'in' ? ins[from] : plats[from], t = dir === 'in' ? plats[to] : outs[to];
      if (!s || !t || !s.offsetParent || !t.offsetParent) return;
      const a = anchor(s, portrait ? 'b' : 'r'), z = anchor(t, portrait ? 't' : 'l');
      const p = document.createElementNS(NS, 'path'); p.setAttribute('d', curve(a, z)); p.setAttribute('class', 'ops__wire ops__wire--' + (dir === 'in' ? to : from));
      svg.appendChild(p);
      paths[`${dir}:${from}:${to}`] = p;
    });
  }
  function flash(el, cls, ms) { if (!el) return; el.classList.add(cls); timers.push(setTimeout(() => el.classList.remove(cls), ms)); }
  function pushLog(text, exc) {
    const li = document.createElement('li'); if (exc) li.className = 'exc';
    li.innerHTML = `<span class="t">File A-${1040 + (fileNo++ % 60)}</span>${text}`;
    logEl.prepend(li); while (logEl.children.length > 4) logEl.lastChild.remove();
  }
  function spawn(path, plat, onDone, dur = 900) {
    if (!path) { timers.push(setTimeout(() => onDone && onDone(), dur)); return; }
    const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', 4); c.setAttribute('class', 'ops__dot ops__dot--' + plat);
    const p0 = path.getPointAtLength(0); c.setAttribute('cx', p0.x.toFixed(1)); c.setAttribute('cy', p0.y.toFixed(1));
    svg.appendChild(c);
    particles.push({ c, path, len: path.getTotalLength(), t0: performance.now(), dur, onDone });
  }
  function run(e) {
    // small screens hide some rows: use the visible ones so every platform still gets its turn
    const vis = list => list.filter(n => n.offsetParent), vi = vis(ins), vo = vis(outs);
    if (!vi.length || !vo.length) return;
    const inEl = ins[e.i].offsetParent ? ins[e.i] : vi[e.i % vi.length], outEl = outs[e.o].offsetParent ? outs[e.o] : vo[e.o % vo.length];
    const inKey = `in:${ins.indexOf(inEl)}:${e.p}`, outKey = `out:${e.p}:${outs.indexOf(outEl)}`;
    flash(inEl, 'is-on', 900);
    spawn(paths[inKey], e.p, () => {
      flash(plats[e.p], 'is-on', 1100);
      if (e.exc) flash(plats[e.p], 'is-exc', 1100);
      timers.push(setTimeout(() => {
        flash(review, 'is-on', 800);
        timers.push(setTimeout(() => spawn(paths[outKey], e.p, () => { flash(outEl, 'is-done', 1600); pushLog(e.log, e.exc); }), 380));
      }, 420));
    });
  }
  function frame(now) {
    if (now - lastSpawn > 1500) { lastSpawn = now; run(EVENTS[k++ % EVENTS.length]); }
    particles = particles.filter(p => {
      const u = Math.min(1, Math.max(0, now - p.t0) / p.dur), e = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      const pt = p.path.getPointAtLength(p.len * e); p.c.setAttribute('cx', pt.x.toFixed(1)); p.c.setAttribute('cy', pt.y.toFixed(1));
      if (u >= 1) { p.c.remove(); p.onDone && p.onDone(); return false; }
      return true;
    });
    raf = requestAnimationFrame(frame);
  }
  const start = () => { if (raf === null && !reduced && !paused && visible && !document.hidden) { lastSpawn = 0; raf = requestAnimationFrame(frame); } };
  const stop = () => { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } };
  function staticState() { outs.forEach(o => o.classList.add('is-done')); EVENTS.slice(0, 4).forEach(e => pushLog(e.log, e.exc)); }

  layout();
  new ResizeObserver(() => layout()).observe(root);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : stop(); }).observe(root);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  EVENTS.slice(0, 4).forEach(e => pushLog(e.log, e.exc)); // full log from the start, so the card never grows
  if (reduced) outs.forEach(o => o.classList.add('is-done')); else start();
  return {
    setReduced(v) { reduced = v; if (v) { stop(); particles.forEach(p => p.c.remove()); particles = []; staticState(); } else start(); },
    // pause means still: drop pending flashes and dots in flight, clear the highlights
    setPaused(v) { paused = v; if (!v) { start(); return; } stop(); if (reduced) return; timers.forEach(clearTimeout); timers = []; particles.forEach(p => p.c.remove()); particles = []; root.querySelectorAll('.is-on,.is-exc,.is-done').forEach(e => e.classList.remove('is-on', 'is-exc', 'is-done')); },
    relayout: layout
  };
}
