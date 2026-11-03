// One file, start to finish: the pinned nine-chapter mortgage journey.
import { sceneSVG } from './art.js';
import { ASSETS, pic } from './manifest.js';

// Each step of the journey is a NobleServe service line (from mortgage.nobleserve.com). pos 'top' moves the caption above the subject.
export const CHAPTERS = [
  { t: 'Apply', prac: 'Originations', svc: ['New loan setup', 'Processing services'] },
  { t: 'Documents', prac: 'Originations and servicing', svc: ['Indexing and data extraction', 'Document management'], plat: 'NobleDox' },
  { t: 'Underwriting', prac: 'Originations', svc: ['Underwriting support'] },
  { t: 'Title search', prac: 'Title', svc: ['Order entry', 'Nationwide residential title search', 'Tax search', 'Commitment typing'], plat: 'CloseVille' },
  { t: 'Appraisal', prac: 'Valuations', svc: ['Appraisal QC', 'BPO QC', 'Vendor management', 'Property preservation review'], pos: 'top' },
  { t: 'Curative', prac: 'Curative', svc: ['Payoff ordering', 'Release requests', 'Judgment payoffs', 'HOA and HOI ordering'], pos: 'top' },
  { t: 'Clear to close', prac: 'Settlement', svc: ['Pre-closing', 'Closing disclosure', 'Notary scheduling'] },
  { t: 'Closing', prac: 'Settlement', svc: ['Funding', 'Post closing', 'Policy typing'], plat: 'PCR', pos: 'top', posM: 'bottom' },
  { t: 'Recording and servicing', prac: 'Settlement and servicing', svc: ['Recording', 'Lien release and payoff quotes', 'Escrow and payment collection', 'Default management'], plat: 'PCR for recording' }
];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ss = (x, a, b) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const T0 = 0.16, T1 = 0.975; // scroll progress where the film starts and ends

const GATES = ['(prefers-reduced-motion: reduce)'];
const PORTRAIT = '(orientation: portrait)';

export function initJourney(section) {
  const frame = section.querySelector('[data-frame]');
  const layersEl = section.querySelector('[data-layers]');
  const videosEl = section.querySelector('[data-videos]');
  const big = section.querySelector('[data-big]');
  const capsEl = section.querySelector('[data-caps]');
  const rail = section.querySelector('[data-rail]');

  const layers = CHAPTERS.map((c, i) => {
    const d = document.createElement('div'); d.className = 'lay';
    if (!ASSETS.stills) d.innerHTML = sceneSVG(i);
    layersEl.appendChild(d); return d;
  });
  // stills are made only around the current chapter (stacked lazy images would all load at once); on phones the clip covers them
  function stills(i) {
    if (!ASSETS.stills) return;
    const max = innerWidth < 900 ? (videoMode ? 1280 : 1920) : 2688;
    for (let j = Math.max(0, i - 1); j <= Math.min(8, i + 2); j++) if (!layers[j].firstChild) layers[j].appendChild(pic(ASSETS.stills[j], { eager: true, max, focus: (ASSETS.focus || [])[j] ?? 50, sizes: '(orientation: portrait) 178vh, 100vw' }));
  }

  const caps = CHAPTERS.map((c, i) => {
    const li = document.createElement('li');
    if (c.pos === 'top') li.classList.add('is-top');
    if (c.posM === 'bottom') li.classList.add('m-bottom');
    let j = 0;
    const lines = c.svc.map(line => `<span class="ln">${line.split(' ').map(w => `<span class="w" style="--j:${j++}">${w}</span>`).join(' ')}</span>`).join('');
    const prac = c.prac !== c.t ? `<span class="prac mono">${c.prac} ${c.prac.includes(' and ') ? 'practices' : 'practice'}</span>` : '';
    li.innerHTML = `<span class="tags"><span class="n">Step ${String(i + 1).padStart(2, '0')} · ${c.t}</span>${prac}</span><h3>${lines}</h3>${c.plat ? `<p class="plat mono"><span></span>Powered by ${c.plat}</p>` : ''}`;
    capsEl.appendChild(li);
    const words = [...li.querySelectorAll('.w')];
    return { li, words, f: Math.max(1.6, 1 + 0.12 * (words.length - 1)), k: -1, o: -1 }; // f: the last word lands at k=1
  });
  capsEl.setAttribute('aria-hidden', 'true');
  const srList = document.createElement('ol'); srList.className = 'sr';
  srList.innerHTML = CHAPTERS.map((c, i) => `<li>Step ${i + 1}, ${c.t} (${c.prac}): ${c.svc.join(', ')}.${c.plat ? ` Powered by ${c.plat}.` : ''}</li>`).join('');
  capsEl.after(srList);
  const railItems = CHAPTERS.map(c => {
    const li = document.createElement('li');
    li.innerHTML = `<i><b></b></i><span>${c.t}</span>`;
    rail.appendChild(li); return { li, b: li.querySelector('b'), f: -1, on: null };
  });

  // the statement sits on its own panel over the portal: shown from the small-square start, sized to fit the square, then it lets go
  const bigPanel = big.querySelector('.big__panel'), bigLines = [...big.querySelectorAll('.big__ln')];
  let bigW = 1;
  function measureBig() { bigW = bigPanel.offsetWidth || 1; }
  big.querySelector('img')?.addEventListener('load', () => { measureBig(); render(lastP, true); });

  // ---------- Video scrub ----------
  let videoMode = false, videos = [], seekBusy = [], pending = [], loaded = [], gen = [], near = false, wantLoad = -1, loadTimer = null, lastTarget = [], have = [];
  const FPS = 24; // all clips
  const saveData = () => !!(navigator.connection && navigator.connection.saveData);
  const videoAllowed = () => !!(ASSETS.clips && ASSETS.clips.length) && !GATES.some(q => matchMedia(q).matches) && !saveData();
  // portrait crops only on portrait screens: a landscape phone gets the wide clips
  const wantM = () => !!ASSETS.clipsM && matchMedia(PORTRAIT).matches;
  let clipSet = wantM();
  const clipSrc = i => (clipSet ? ASSETS.clipsM : ASSETS.clips)[i];
  // the crop pans from one keyframe's focus to the next across the clip, so neighbouring clips meet at the same crop (no sideways jump at a cut)
  const vpos = (i, u = 0.5) => { const f = ASSETS.focus || [], a = f[i] ?? 50; return clipSet ? '50% 50%' : `${(a + ((f[i + 1] ?? 50) - a) * clamp(u, 0, 1)).toFixed(1)}% 50%`; };
  function ensureVideos() {
    if (videos.length || !ASSETS.clips) return;
    videos = ASSETS.clips.map((src, i) => {
      const v = document.createElement('video');
      v.muted = true; v.playsInline = true; v.preload = 'none'; v.setAttribute('aria-hidden', 'true'); v.tabIndex = -1;
      v.style.objectPosition = vpos(i);
      // have: the time of the frame the element is holding; it stays on screen through the next seek
      v.addEventListener('seeked', () => { seekBusy[i] = false; have[i] = v.currentTime; if (pending[i] != null) { const t = pending[i]; pending[i] = null; seek(i, t); } if (cache[`V${i}`] !== '1') render(lastP, true); });
      v.addEventListener('error', () => { if (!v.getAttribute('src')) return; seekBusy[i] = false; pending[i] = null; loaded[i] = 'failed'; });
      videosEl.appendChild(v); return v;
    });
  }
  // free a clip (far from the current chapter, or the wrong crop after a rotation); gen voids a fetch still in flight
  function drop(i) {
    const v = videos[i], s = v.getAttribute('src');
    gen[i] = (gen[i] || 0) + 1; loaded[i] = null; seekBusy[i] = false; pending[i] = null; lastTarget[i] = have[i] = null; v.style.opacity = cache[`V${i}`] = '0';
    if (s) { v.removeAttribute('src'); v.load(); URL.revokeObjectURL(s); }
  }
  const dropAll = () => { clearTimeout(loadTimer); wantLoad = -1; videos.forEach((v, j) => drop(j)); };
  async function loadClip(i) {
    if (i < 0 || i >= videos.length || loaded[i]) return;
    loaded[i] = 'loading'; const g = gen[i] = (gen[i] || 0) + 1;
    try {
      const res = await fetch(clipSrc(i), { priority: 'low' });
      if (!res.ok) throw new Error(res.status);
      const blob = await res.blob();
      if (gen[i] !== g) return;
      videos[i].src = URL.createObjectURL(blob);
      videos[i].load();
      videos[i].addEventListener('canplay', () => { if (gen[i] === g) { loaded[i] = 'ready'; have[i] = videos[i].currentTime; render(lastP, true); } }, { once: true });
    } catch (e) { if (gen[i] === g) loaded[i] = 'failed'; }
  }
  // load only near the journey, and only once the chapter has been stable briefly (menu jumps fly past); hold at most four clips
  function requestLoads(i, u) {
    if (!near || !videoMode) return;
    const key = i * 10 + (u > 0.5 ? 1 : 0);
    if (key === wantLoad) return;
    wantLoad = key; clearTimeout(loadTimer);
    loadTimer = setTimeout(() => { videos.forEach((v, j) => { if (j < i - 1 || j > i + 2) drop(j); }); loadClip(i); loadClip(i + 1); if (u > 0.5) loadClip(i + 2); }, 180);
  }
  function seek(i, t) {
    const v = videos[i]; if (!v || !v.duration) return;
    // the last frames repeat the next clip's first frame; Chrome can skip repainting a seek to the very end
    // snap to the middle of a frame, so scroll steps smaller than a frame don't start a seek (each decodes from the last keyframe)
    t = (Math.floor(clamp(t, 0, v.duration - 0.1) * FPS) + 0.5) / FPS;
    lastTarget[i] = t;
    if (seekBusy[i]) { pending[i] = t; return; }
    if (Math.abs(v.currentTime - t) < 0.5 / FPS) return;
    seekBusy[i] = true; v.currentTime = t;
  }
  function applyMode() {
    videoMode = videoAllowed();
    if (videoMode) ensureVideos();
    if (!videoMode || clipSet !== wantM()) { clipSet = wantM(); dropAll(); videos.forEach((v, j) => (v.style.objectPosition = cache[`P${j}`] = vpos(j))); }
    videosEl.style.display = videoMode ? '' : 'none';
    render(lastP, true);
  }
  [...GATES, PORTRAIT].map(q => matchMedia(q)).forEach(m => m.addEventListener('change', applyMode));
  new IntersectionObserver(([e]) => { near = e.isIntersecting; if (near) { stills(curI); render(lastP, true); } else dropAll(); }, { rootMargin: '120% 0px 120% 0px' }).observe(section);

  // ---------- Render ----------
  let lastP = -1, curI = 0, cache = {};
  const set = (key, el, prop, val) => { if (cache[key] !== val) { cache[key] = val; el.style.setProperty(prop, val); } };

  function render(p, force = false) {
    if (p < 0) return;
    if (!force && Math.abs(p - lastP) < 1e-5) return;
    lastP = p;
    const reduced = !!window.__reduced;

    // 1. Cut-in: the card grows to full bleed (already full with reduced motion)
    const g = reduced ? 1 : ss(p, 0, 0.06);
    const narrow = innerWidth < 900;
    const ins = narrow ? [12, 6, 10, 6] : [20, 26, 12, 26];
    set('ct', frame, '--ct', `${(ins[0] * (1 - g)).toFixed(2)}%`);
    set('cr', frame, '--cr', `${(ins[1] * (1 - g)).toFixed(2)}%`);
    set('cb', frame, '--cb', `${(ins[2] * (1 - g)).toFixed(2)}%`);
    set('cl', frame, '--cl', `${(ins[3] * (1 - g)).toFixed(2)}%`);
    set('cr0', frame, '--cr0', `${(24 * (1 - g)).toFixed(1)}px`);

    // 2. Big statement: on screen from the start, centred on the portal and scaled to fit it; it grows with the portal,
    // holds, then lets go fast (lines part, the panel zooms toward the viewer and fades)
    const bOut = reduced ? 0 : ss(p, 0.11, 0.128), bFade = ss(p, 0.11, 0.126);
    set('dim', frame, '--dim', ((1 - ss(p, 0.12, 0.14)) * (narrow ? 0.45 : 0.3)).toFixed(3));
    const sqW = innerWidth * (1 - (ins[1] + ins[3]) * (1 - g) / 100), fit = Math.min(1, innerWidth * 0.92 / bigW);
    const bs = Math.min(fit, sqW * 0.94 / bigW) * (1 + bOut * 0.35);
    set('by', big, '--by', `${(ins[0] * (1 - g) + (100 - (ins[0] + ins[2]) * (1 - g)) / 2).toFixed(2)}%`);
    set('bs', big, '--bs', bs.toFixed(4));
    set('bo', big, 'opacity', (1 - bFade).toFixed(3));
    set('bv', big, 'visibility', bFade >= 1 ? 'hidden' : 'visible');
    const spread = (bOut * 0.6).toFixed(3);
    if (cache.spread !== spread || force) {
      cache.spread = spread;
      bigLines.forEach((l, k) => { l.style.transform = +spread ? `translate3d(0, ${((k - 1) * spread * 90).toFixed(1)}px, 0)` : ''; });
      bigPanel.style.filter = +spread ? `blur(${(bOut * 8).toFixed(1)}px)` : '';
    }

    // 3. Film
    const t = clamp((p - T0) / (T1 - T0), 0, 1) * 8;
    const i = Math.min(7, Math.floor(t)), u = t - i;
    curI = i; stills(i);
    layers.forEach((L, j) => {
      let o = 0, s = 1;
      if (j === i) { o = 1 - ss(u, 0.55, 0.95); s = 1 + u * 0.32; }
      else if (j === i + 1) { o = ss(u, 0.55, 0.95); s = 0.9 + 0.1 * ss(u, 0.45, 1); }
      if (p < T0 && j === 0) { o = 1; s = 1 + (1 - g) * 0.06; }
      if (reduced) s = 1;
      const key = `L${j}`, val = `${o.toFixed(3)}|${s.toFixed(4)}`;
      if (cache[key] !== val) { cache[key] = val; L.style.opacity = o.toFixed(3); L.style.transform = `scale(${s.toFixed(4)})`; }
    });

    if (videoMode) {
      requestLoads(i, u);
      const v = videos[i];
      if (loaded[i] === 'ready') seek(i, u * v.duration);
      const op = vpos(i, u); if (cache[`P${i}`] !== op) { cache[`P${i}`] = op; v.style.objectPosition = op; }
      videos.forEach((vv, j) => {
        // show while the frame it holds is close to the target, seeking or not (no stale-frame pop, no still flashing through mid-seek);
        // hysteresis so a fast flick doesn't blink it
        // once up, it stays while its frame is nearer the target than the keyframe still underneath (which only matches near the clip's ends)
        const tg = lastTarget[j] ?? -9, still = Math.min(Math.abs(tg), Math.abs((vv.duration || 0) - tg));
        const tol = cache[`V${j}`] === '1' ? Math.max(0.6, still) : 0.3;
        const show = j === i && loaded[j] === 'ready' && have[j] != null && Math.abs(have[j] - tg) < tol;
        const val = show ? '1' : '0';
        if (cache[`V${j}`] !== val) { cache[`V${j}`] = val; vv.style.opacity = val; }
      });
    }

    // captions, centred on their keyframe
    caps.forEach((c, j) => {
      const a = j === 0 ? 0 : j - 0.42, b = j === 8 ? 9 : j + 0.4;
      const inK = j === 0 ? ss(p, 0.135, 0.152) : ss(t, a, a + 0.1);
      const out = j === 8 ? 0 : ss(t, b - 0.1, b);
      const o = (j === 0 || t >= a - 0.001) ? inK * (1 - out) : 0;
      const ov = (p < 0.13 ? 0 : o).toFixed(3);
      if (c.o !== ov) { c.o = ov; c.li.style.opacity = ov; c.li.style.visibility = +ov > 0.001 ? 'visible' : 'hidden'; }
      const k = clamp(inK, 0, 1), kv = k.toFixed(3);
      if (c.k !== kv) { c.k = kv; c.li.style.setProperty('--k', kv); c.words.forEach((w, n) => w.style.setProperty('--wk', clamp(k * c.f - n * 0.12, 0, 1).toFixed(3))); }
    });

    // rail
    set('railO', rail, '--hudO', (ss(p, 0.135, 0.155) * (1 - ss(p, 0.975, 0.99))).toFixed(3));
    const chapter = clamp(Math.floor(t + 0.42), 0, 8);
    railItems.forEach((r, j) => {
      const f = clamp(t - j + 1, 0, 1).toFixed(3);
      if (r.f !== f) { r.f = f; r.b.style.setProperty('--f', f); }
      const on = j <= chapter && p >= 0.13;
      if (r.on !== on) { r.on = on; r.li.classList.toggle('on', on); }
    });

    // 4. Exit: fade to night just before the stage unpins, so it meets the dark closing section without a seam
    set('exit', frame, '--exit', ss(p, 0.99, 1).toFixed(3));
  }

  // scroll position that lands on a step (its caption centred on its keyframe)
  const stepY = j => { const top = section.getBoundingClientRect().top + scrollY; return top + (T0 + (T1 - T0) * clamp(j, 0, 8) / 8) * (section.offsetHeight - innerHeight); };

  measureBig();
  addEventListener('resize', () => { measureBig(); render(lastP, true); });
  document.fonts?.ready.then(() => { measureBig(); render(lastP, true); });
  applyMode();
  render(0, true); // the statement and the small portal are drawn before the section is reached
  return { render, measure: measureBig, stepY };
}
