// Fallback scene art drawn in code.
let uid = 0;
const C = { paper: '#F4F1E8', white: '#E9EBF4', blue: '#2236FF', blue2: '#4A5BFF', ice: '#9FB0FF', ink: '#0B0D1A', leg: '#2A2F45', home: '#FFB65C', seal: '#E0352B' };

function base(id, inner) {
  // perspective grid floor, horizon at y=560
  let grid = '';
  for (let k = -14; k <= 14; k++) grid += `<line x1="${800 + k * 34}" y1="560" x2="${800 + k * 380}" y2="900"/>`;
  for (let t = 1; t <= 9; t++) { const y = 560 + 340 * Math.pow(t / 9, 2.2); grid += `<line x1="0" y1="${y.toFixed(1)}" x2="1600" y2="${y.toFixed(1)}"/>`; }
  return `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialGradient id="bg${id}" cx="50%" cy="40%" r="78%"><stop offset="0" stop-color="#1B2358"/><stop offset=".55" stop-color="#0B0F2B"/><stop offset="1" stop-color="#060918"/></radialGradient>
<linearGradient id="fl${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060918" stop-opacity=".95"/><stop offset=".35" stop-color="#060918" stop-opacity="0"/></linearGradient>
<radialGradient id="wm${id}" cx="50%" cy="60%" r="60%"><stop offset="0" stop-color="#FFE2B0"/><stop offset="1" stop-color="${C.home}"/></radialGradient>
<filter id="gl${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="sg${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
</defs>
<rect width="1600" height="900" fill="url(#bg${id})"/>
<g stroke="${C.blue2}" stroke-opacity=".22" stroke-width="1">${grid}</g>
<rect y="560" width="1600" height="340" fill="url(#fl${id})"/>
${inner}
</svg>`;
}

function figure(x, y, s = 1, extra = '') {
  return `<g transform="translate(${x} ${y}) scale(${s})">
<ellipse cx="0" cy="4" rx="30" ry="7" fill="#000" opacity=".4"/>
<rect x="-13" y="-48" width="11" height="50" rx="5.5" fill="${C.leg}"/><rect x="2" y="-48" width="11" height="50" rx="5.5" fill="${C.leg}"/>
<rect x="-22" y="-100" width="44" height="60" rx="18" fill="${C.blue}"/>
<rect x="-22" y="-100" width="44" height="60" rx="18" fill="none" stroke="${C.ice}" stroke-opacity=".5" stroke-width="1.5"/>
<rect x="20" y="-84" width="15" height="24" rx="2.5" fill="${C.paper}"/>
<circle cx="0" cy="-118" r="18" fill="${C.white}"/>${extra}</g>`;
}

function house(cx, by, w, h, fill = C.paper, door = '#C9CEE6') {
  const x0 = cx - w / 2, x1 = cx + w / 2, wy = by - h, ry = wy - w * 0.38;
  return `<polygon points="${x0},${by} ${x0},${wy} ${cx},${ry} ${x1},${wy} ${x1},${by}" fill="${fill}"/>
<rect x="${cx - w * 0.09}" y="${by - h * 0.46}" width="${w * 0.18}" height="${h * 0.46}" fill="${door}"/>
<rect x="${x0 + w * 0.12}" y="${wy + h * 0.18}" width="${w * 0.18}" height="${h * 0.2}" fill="#C9CEE6"/>
<rect x="${x1 - w * 0.3}" y="${wy + h * 0.18}" width="${w * 0.18}" height="${h * 0.2}" fill="#C9CEE6"/>`;
}

const scenes = [
  // 0 Apply: portal of paper
  id => base(id, `<polygon points="690,590 910,590 1080,900 520,900" fill="${C.blue2}" opacity=".16"/>
<rect x="690" y="170" width="220" height="420" rx="6" fill="${C.paper}" opacity=".96" filter="url(#gl${id})"/>
<rect x="690" y="170" width="220" height="420" rx="6" fill="none" stroke="${C.blue2}" stroke-width="5" filter="url(#gl${id})"/>
<g stroke="#BFC4D9" stroke-width="5" stroke-linecap="round"><line x1="725" y1="240" x2="870" y2="240"/><line x1="725" y1="280" x2="850" y2="280"/><line x1="725" y1="320" x2="875" y2="320"/><line x1="725" y1="360" x2="820" y2="360"/></g>
${figure(800, 790, 1.15)}`),
  // 1 Documents: orbiting sheets + scan lines
  id => {
    let s = '';
    for (let i = 0; i < 34; i++) {
      const a = i / 34 * Math.PI * 2 + (i % 3) * .2, r = 300 + (i % 5) * 46;
      const x = 800 + Math.cos(a) * r * 1.35, y = 470 + Math.sin(a) * r * .42 - (i % 4) * 26;
      s += `<rect x="${(x - 23).toFixed(0)}" y="${(y - 30).toFixed(0)}" width="46" height="60" rx="3" fill="${C.paper}" opacity="${(.55 + (i % 4) * .12).toFixed(2)}" transform="rotate(${(i * 37) % 70 - 35} ${x.toFixed(0)} ${y.toFixed(0)})"/>`;
    }
    return base(id, `${s}<g stroke="${C.blue2}" stroke-width="3" filter="url(#gl${id})"><line x1="180" y1="400" x2="1420" y2="400" opacity=".9"/><line x1="260" y1="470" x2="1340" y2="470" opacity=".5"/><line x1="340" y1="540" x2="1260" y2="540" opacity=".3"/></g>${figure(800, 780, 1.1)}`);
  },
  // 2 Underwriting: balance
  id => base(id, `<rect x="790" y="320" width="20" height="360" rx="6" fill="${C.white}"/><circle cx="800" cy="318" r="18" fill="${C.white}"/>
<line x1="500" y1="336" x2="1100" y2="326" stroke="${C.white}" stroke-width="12" stroke-linecap="round"/>
<line x1="500" y1="336" x2="1100" y2="326" stroke="${C.blue2}" stroke-width="3" filter="url(#gl${id})"/>
<g stroke="#BFC4D9" stroke-width="2"><line x1="510" y1="336" x2="450" y2="560"/><line x1="510" y1="336" x2="570" y2="560"/><line x1="1090" y1="326" x2="1030" y2="550"/><line x1="1090" y1="326" x2="1150" y2="550"/></g>
<ellipse cx="510" cy="562" rx="130" ry="20" fill="${C.white}"/><ellipse cx="1090" cy="552" rx="130" ry="20" fill="${C.white}"/>
${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${1040 + (i % 2) * 6}" y="${520 - i * 13}" width="96" height="11" rx="2" fill="${C.paper}"/>`).join('')}
${figure(510, 560, .85)}<rect x="770" y="680" width="60" height="12" rx="4" fill="${C.white}"/>`),
  // 3 Title search: tunnel of records
  id => {
    let r = '';
    for (let i = 0; i < 11; i++) {
      const k = Math.pow(.74, i), w = 1700 * k, h = 980 * k, x = 800 - w / 2, y = 450 - h / 2;
      const o = (.85 - i * .06).toFixed(2);
      r += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" rx="${(40 * k).toFixed(0)}" fill="none" stroke="${i === 3 ? C.ice : C.blue2}" stroke-opacity="${o}" stroke-width="${(i === 3 ? 6 : 2) * k + 1}" ${i === 3 ? `filter="url(#gl${id})"` : ''}/>`;
      for (let d = 0; d < 6; d++) {
        const yy = y + h * (d + .5) / 6;
        r += `<rect x="${(x + 10 * k).toFixed(0)}" y="${(yy - 12 * k).toFixed(0)}" width="${(60 * k).toFixed(0)}" height="${(24 * k).toFixed(0)}" fill="${C.paper}" opacity="${(o * .5).toFixed(2)}"/><rect x="${(x + w - 70 * k).toFixed(0)}" y="${(yy - 12 * k).toFixed(0)}" width="${(60 * k).toFixed(0)}" height="${(24 * k).toFixed(0)}" fill="${C.paper}" opacity="${(o * .5).toFixed(2)}"/>`;
      }
    }
    return base(id, `${r}<ellipse cx="800" cy="450" rx="70" ry="50" fill="#fff" filter="url(#sg${id})"/><ellipse cx="800" cy="450" rx="26" ry="18" fill="#fff"/>${figure(800, 700, .6)}`);
  },
  // 4 Appraisal: house model, measuring lines
  id => base(id, `<ellipse cx="800" cy="660" rx="250" ry="44" fill="${C.white}"/><rect x="550" y="640" width="500" height="22" fill="#C9CEE6"/><ellipse cx="800" cy="640" rx="250" ry="44" fill="${C.white}"/>
${house(800, 640, 260, 190)}
<g fill="none" stroke="${C.blue2}" stroke-width="2.5" filter="url(#gl${id})"><ellipse cx="800" cy="520" rx="330" ry="90" stroke-dasharray="10 12"/><ellipse cx="800" cy="460" rx="250" ry="62" stroke-dasharray="4 10"/>
<line x1="1000" y1="350" x2="1000" y2="640"/><line x1="988" y1="350" x2="1012" y2="350"/><line x1="988" y1="640" x2="1012" y2="640"/>
<line x1="670" y1="700" x2="930" y2="700"/><line x1="670" y1="688" x2="670" y2="712"/><line x1="930" y1="688" x2="930" y2="712"/></g>
${figure(520, 790, .9)}`),
  // 5 Curative: red threads
  id => {
    const ends = [[420, 860], [520, 900], [640, 880], [980, 890], [1100, 860], [1220, 900], [380, 760], [1260, 770], [700, 900], [900, 900]];
    const from = [[690, 480], [720, 560], [760, 600], [840, 600], [880, 560], [910, 480], [700, 520], [900, 520], [780, 460], [820, 460]];
    const lines = ends.map((e, i) => `<line x1="${from[i][0]}" y1="${from[i][1]}" x2="${e[0]}" y2="${e[1]}"/>`).join('');
    return base(id, `<ellipse cx="800" cy="640" rx="250" ry="44" fill="${C.white}"/>${house(800, 640, 260, 190)}
<g stroke="${C.seal}" stroke-width="3" stroke-linecap="round">${lines}</g>
<path d="M700 520 Q 600 640 548 690" fill="none" stroke="${C.seal}" stroke-width="4"/>
${figure(520, 790, .9)}`);
  },
  // 6 Clear to close: stamp + ring
  id => base(id, `<g fill="none" stroke="${C.blue2}" filter="url(#gl${id})"><ellipse cx="800" cy="760" rx="320" ry="64" stroke-width="4"/><ellipse cx="800" cy="760" rx="560" ry="112" stroke-width="2.5" opacity=".6"/><ellipse cx="800" cy="760" rx="820" ry="164" stroke-width="1.5" opacity=".3"/></g>
<polygon points="580,700 1020,700 1100,820 500,820" fill="${C.paper}"/>
<g><circle cx="800" cy="210" r="46" fill="${C.white}"/><rect x="770" y="240" width="60" height="90" rx="12" fill="${C.white}"/><rect x="660" y="320" width="280" height="70" rx="14" fill="${C.white}"/><rect x="672" y="386" width="256" height="18" rx="6" fill="${C.blue}"/></g>
<line x1="800" y1="420" x2="800" y2="690" stroke="${C.ice}" stroke-opacity=".35" stroke-width="2" stroke-dasharray="3 10"/>
${figure(1180, 800, .95)}`),
  // 7 Closing: table, key
  id => base(id, `<polygon points="800,0 520,880 1080,880" fill="#fff" opacity=".05"/>
<polygon points="640,560 960,560 1180,900 420,900" fill="${C.white}"/><polygon points="640,560 960,560 975,580 625,580" fill="#fff"/>
<rect x="720" y="640" width="150" height="110" fill="${C.paper}" transform="rotate(-6 795 695)"/>
<g stroke="#BFC4D9" stroke-width="3"><line x1="740" y1="664" x2="840" y2="654"/><line x1="742" y1="684" x2="830" y2="675"/><line x1="745" y1="725" x2="800" y2="719"/></g>
<line x1="830" y1="700" x2="900" y2="650" stroke="${C.blue}" stroke-width="8" stroke-linecap="round"/>
<g transform="translate(960 760) rotate(-20)"><circle r="16" fill="none" stroke="${C.home}" stroke-width="7"/><rect x="14" y="-4" width="52" height="8" rx="3" fill="${C.home}"/><rect x="52" y="0" width="7" height="14" fill="${C.home}"/></g>
${figure(800, 960, 1.6)}`),
  // 8 Home: open door, warm light
  id => base(id, `<rect x="470" y="300" width="660" height="420" fill="${C.white}"/><polygon points="430,304 800,110 1170,304" fill="${C.white}"/>
<polygon points="430,304 800,110 1170,304" fill="none" stroke="${C.ice}" stroke-opacity=".4" stroke-width="2"/>
<rect x="560" y="400" width="110" height="100" fill="url(#wm${id})" opacity=".9"/><rect x="930" y="400" width="110" height="100" fill="url(#wm${id})" opacity=".9"/>
<rect x="735" y="500" width="130" height="220" fill="url(#wm${id})"/><polygon points="735,500 735,720 690,740 690,486" fill="#C9CEE6"/>
<polygon points="735,720 865,720 1060,900 540,900" fill="${C.home}" opacity=".32"/>
<ellipse cx="800" cy="600" rx="200" ry="160" fill="${C.home}" opacity=".35" filter="url(#sg${id})"/>
${[[620, 360], [980, 340], [700, 260], [910, 250], [560, 560], [1060, 600], [840, 430]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${2 + i % 3}" fill="${C.home}" opacity=".8"/>`).join('')}
${figure(800, 812, 1.15)}`)
];

export function sceneSVG(i) { return scenes[i](++uid); }

// ---------- Stickers ----------
const S = 'stroke="#fff" stroke-width="10" paint-order="stroke" stroke-linejoin="round" stroke-linecap="round"';
const O = 'stroke="#0B0D1A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
const stickers = {
  key: `<g ${S}><circle cx="40" cy="60" r="24" fill="#FFC94D"/><rect x="58" y="53" width="48" height="14" rx="5" fill="#FFC94D"/><rect x="88" y="62" width="10" height="18" rx="3" fill="#FFC94D"/></g><circle cx="40" cy="60" r="9" fill="#0B0D1A"/><path d="M58 60h44" ${O} fill="none" opacity=".25"/>`,
  stamp: `<g ${S}><circle cx="60" cy="26" r="15" fill="#2236FF"/><rect x="50" y="36" width="20" height="30" rx="6" fill="#2236FF"/><rect x="24" y="64" width="72" height="22" rx="8" fill="#2236FF"/><rect x="28" y="86" width="64" height="10" rx="3" fill="#0B0D1A"/></g><path d="M34 70h52" stroke="#9FB0FF" stroke-width="3" stroke-linecap="round"/>`,
  pen: `<g transform="rotate(-38 60 60)" ${S}><rect x="50" y="14" width="20" height="70" rx="8" fill="#0B0D1A"/><path d="M50 84 L60 108 L70 84z" fill="#F4F1E8"/></g><g transform="rotate(-38 60 60)"><rect x="50" y="30" width="20" height="8" fill="#2236FF"/><circle cx="60" cy="101" r="2.5" fill="#0B0D1A"/></g>`,
  magnifier: `<g ${S}><circle cx="50" cy="50" r="30" fill="#E9EBF4"/><rect x="72" y="70" width="16" height="40" rx="7" fill="#2236FF" transform="rotate(-45 80 90)"/></g><circle cx="50" cy="50" r="22" fill="#9FB0FF" opacity=".55"/><path d="M38 40a16 16 0 0 1 14-8" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/>`,
  pin: `<g ${S}><path d="M60 108 C 30 72, 26 58, 26 46 a34 34 0 0 1 68 0 c0 12 -4 26 -34 62z" fill="#2236FF"/></g><circle cx="60" cy="46" r="13" fill="#F4F1E8"/>`,
  folder: `<g ${S}><path d="M14 34h34l8 10h50v56H14z" fill="#F4F1E8"/><rect x="14" y="48" width="92" height="52" rx="4" fill="#FFC94D"/></g><rect x="26" y="60" width="40" height="5" rx="2" fill="#0B0D1A" opacity=".5"/>`,
  house: `<g ${S}><path d="M18 58 L60 22 L102 58 V100 H18z" fill="#2236FF"/></g><rect x="50" y="68" width="20" height="32" rx="2" fill="#FFC94D"/><rect x="28" y="62" width="14" height="14" fill="#F4F1E8"/><rect x="78" y="62" width="14" height="14" fill="#F4F1E8"/>`,
  padlock: `<g ${S}><path d="M38 52 V38 a22 22 0 0 1 44 0 V52" fill="none" stroke-width="22"/><path d="M38 52 V38 a22 22 0 0 1 44 0 V52" fill="none" stroke="#FFC94D" stroke-width="10" paint-order="normal"/><rect x="24" y="50" width="72" height="56" rx="12" fill="#0B0D1A"/></g><circle cx="60" cy="74" r="7" fill="#FFC94D"/><rect x="57" y="76" width="6" height="14" rx="2" fill="#FFC94D"/>`,
  mug: `<g ${S}><rect x="22" y="38" width="62" height="66" rx="12" fill="#F4F1E8"/><path d="M84 52 h8 a14 14 0 0 1 0 28 h-8" fill="none" stroke-width="18"/></g><path d="M84 52 h8 a14 14 0 0 1 0 28 h-8" fill="none" stroke="#F4F1E8" stroke-width="8"/><rect x="22" y="60" width="62" height="14" fill="#2236FF"/><path d="M40 28c-6-8 6-10 0-18M60 28c-6-8 6-10 0-18" stroke="#9FB0FF" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  clock: `<g ${S}><circle cx="60" cy="60" r="42" fill="#F4F1E8"/></g><circle cx="60" cy="60" r="36" fill="none" stroke="#2236FF" stroke-width="7"/><path d="M60 36 V60 L76 70" ${O} fill="none" stroke-width="5"/><circle cx="60" cy="60" r="4" fill="#0B0D1A"/>`,
  rosette: `<g ${S}><path d="M44 78 L34 112 L50 104 L58 116 L62 82z M76 78 L86 112 L70 104 L62 116 L58 82z" fill="#FFC94D"/><circle cx="60" cy="54" r="38" fill="#2236FF"/></g><path d="M42 54 L55 67 L80 42" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  deed: `<g ${S}><rect x="26" y="26" width="70" height="72" rx="6" fill="#F4F1E8"/><rect x="18" y="20" width="86" height="16" rx="8" fill="#E9EBF4"/><rect x="18" y="90" width="86" height="16" rx="8" fill="#E9EBF4"/></g><g stroke="#BFC4D9" stroke-width="4" stroke-linecap="round"><line x1="38" y1="50" x2="84" y2="50"/><line x1="38" y1="62" x2="78" y2="62"/><line x1="38" y1="74" x2="70" y2="74"/></g><circle cx="80" cy="82" r="9" fill="#2236FF"/>`
};
export const stickerNames = Object.keys(stickers);
export function stickerSVG(name) { return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">${stickers[name]}</svg>`; }
