// Hero: NobleServe across the mortgage lifecycle. A loan file travels from the client through every stage
// NobleServe handles, end to end, and each stage's work goes back to the client as it finishes.
const NS = 'http://www.w3.org/2000/svg';
export const STAGES = [
  { id: 'orig', name: 'Originations', svc: ['New loan setup', 'Underwriting support', 'Post closing'] },
  { id: 'val', name: 'Valuations', svc: ['Appraisal QC', 'BPO QC', 'Vendor management'] },
  { id: 'title', name: 'Title', svc: ['Title search', 'Commitment typing', 'Tax search'] },
  { id: 'cure', name: 'Curative', svc: ['Payoff ordering', 'Release requests', 'Judgment payoffs'] },
  { id: 'settle', name: 'Settlement', svc: ['Closing disclosure', 'Funding', 'Recording'] },
  { id: 'serv', name: 'Servicing', svc: ['Escrow', 'Lien release', 'Default management'] }
];

export function initLife(root, { reduced = false } = {}) {
  const track = root.querySelector('[data-life-track]');
  const svg = track.querySelector('svg');
  const nodes = [...track.querySelectorAll('[data-stage]')];
  const token = track.querySelector('[data-token]');
  const who = [...root.querySelectorAll('[data-who]')];
  const done = root.querySelector('[data-done]');
  const outs = [...root.querySelectorAll('[data-out]')];
  let path = null, fill = null, len = 0, pts = [], cum = [], raf = null, visible = true, paused = false, t0 = 0, held = 0, active = -1, lastWho = -1;
  const CYCLE = 13000; // ms for one loan, end to end

  function layout() {
    const b = track.getBoundingClientRect();
    if (!b.width) return;
    svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
    const vertical = matchMedia('(max-width: 600px)').matches;
    pts = nodes.map(n => { const r = n.querySelector('i').getBoundingClientRect(); return [r.left - b.left + r.width / 2, r.top - b.top + r.height / 2]; });
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    const parts = [d];
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      d += vertical ? ` C${x0} ${(y0 + y1) / 2},${x1} ${(y0 + y1) / 2},${x1} ${y1}` : ` C${(x0 + x1) / 2} ${y0},${(x0 + x1) / 2} ${y1},${x1} ${y1}`;
      parts.push(d);
    }
    // path length at each stage node, so the token stops exactly on it even when stages are unevenly spaced
    svg.innerHTML = parts.map(p => `<path d="${p}"/>`).join('');
    cum = [...svg.querySelectorAll('path')].map((el, i) => i ? el.getTotalLength() : 0);
    svg.innerHTML = `<path class="life__base" d="${d}"/><path class="life__fill" d="${d}"/>`;
    path = svg.querySelector('.life__base'); fill = svg.querySelector('.life__fill');
    len = path.getTotalLength();
    fill.style.strokeDasharray = `${len} ${len}`;
    render(performance.now(), true);
  }
  function render(now, force) {
    if (!path) return;
    const ms = Math.max(0, now - t0); // a frame's timestamp can sit a hair before t0
    const u = reduced ? 0.999 : (ms % CYCLE) / CYCLE;
    // travel 0..0.86 with dwell on each stage, then a short "delivered" beat
    const travel = Math.min(1, u / 0.86);
    const n = STAGES.length - 1, seg = travel * n, k = Math.min(n, Math.floor(seg)), f = seg - k;
    const move = f < 0.55 ? 0 : (f - 0.55) / 0.45; // hold at the stage, then move to the next
    const eased = move < .5 ? 2 * move * move : 1 - Math.pow(-2 * move + 2, 2) / 2;
    const at = k < n ? cum[k] + (cum[k + 1] - cum[k]) * eased : len;
    const frac = Math.min(1, at / len);
    const pt = path.getPointAtLength(at);
    token.style.transform = `translate(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px)`;
    fill.style.strokeDashoffset = (len * (1 - frac)).toFixed(1);
    const cur = travel >= 1 ? n : (f < 0.55 ? k : -1);
    if (cur !== active || force) {
      active = cur;
      nodes.forEach((nd, i) => { nd.classList.toggle('is-on', i === cur); nd.classList.toggle('is-past', i < k || travel >= 1); });
      // a stage's work lands back with the client once the file has been through it
      outs.forEach((o, i) => { o.classList.toggle('is-done', i < k || i === cur || travel >= 1); o.classList.toggle('is-on', i === cur); });
    }
    const delivered = u > 0.88;
    done.classList.toggle('is-on', delivered);
    const w = Math.floor(ms / CYCLE) % who.length;
    if (w !== lastWho) { lastWho = w; who.forEach((el, i) => el.classList.toggle('is-on', i === w)); }
    token.dataset.who = who[w]?.dataset.who || '';
  }
  function frame(now) { render(now); raf = requestAnimationFrame(frame); }
  // resume where it stopped rather than jumping ahead
  const start = () => { if (raf === null && !reduced && !paused && visible && !document.hidden) { if (held) { t0 += performance.now() - held; held = 0; } raf = requestAnimationFrame(frame); } };
  const stop = () => { if (raf !== null) { cancelAnimationFrame(raf); raf = null; held = performance.now(); } };

  t0 = performance.now();
  layout();
  new ResizeObserver(() => layout()).observe(track);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(root);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  if (reduced) render(0, true); else start();
  return { setReduced(v) { reduced = v; v ? (stop(), render(0, true)) : start(); }, setPaused(v) { paused = v; v ? stop() : start(); }, relayout: layout };
}
