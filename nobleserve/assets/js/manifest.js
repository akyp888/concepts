// Asset manifest.
// stills: journey keyframes K0..K8 (phones, reduced motion, and the layer under each clip).
// focus: horizontal focal point (%) per keyframe, so portrait crops keep the buyer in frame.
// clips: scrubbed segments K0->K1 ... K7->K8; clipsM: the same in portrait crops for portrait screens, the crop panning
// from focus[i] to focus[i+1] across each clip so neighbouring clips meet at the same framing.
const img = n => `assets/img/${n}`;
export const ASSETS = {
  stills: ['k0', 'k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7', 'k8'].map(img),
  focus: [50, 50, 30, 50, 30, 28, 76, 40, 50],
  clips: [1, 2, 3, 4, 5, 6, 7, 8].map(n => `assets/video/c0${n}.mp4`),
  clipsM: [1, 2, 3, 4, 5, 6, 7, 8].map(n => `assets/video/c0${n}-m.mp4?v=2`),
  thumbs: { docs: img('k1'), originations: img('k2'), title: img('k3'), curative: img('k5'), settlement: img('k7'), servicing: img('s1'), valuations: img('k4'), home: img('k8') },
  stickers: Object.fromEntries(['key', 'stamp', 'pen', 'magnifier', 'pin', 'folder', 'house', 'padlock', 'mug', 'clock', 'rosette', 'deed'].map(n => [n, `assets/img/st-${n}.png`]))
};
// Responsive still: base path without extension; 1280, 1920 and 2688 wide variants, none wider than max.
export function pic(base, { eager = false, focus = 50, alt = '', sizes = '100vw', max = 2688 } = {}) {
  const im = new Image();
  im.alt = alt; im.decoding = 'async'; im.loading = eager ? 'eager' : 'lazy';
  im.srcset = [[1280, '-1280'], [1920, ''], [2688, '-2688']].filter(([w]) => w <= max).map(([w, x]) => `${base}${x}.jpg ${w}w`).join(', ');
  im.sizes = sizes; im.src = `${base}${max < 1920 ? '-1280' : ''}.jpg`;
  im.style.objectPosition = `${focus}% 50%`;
  return im;
}
