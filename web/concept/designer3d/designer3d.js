/* ABJ 3D room designer v2 (23 Nov 2026). Kitchen, fitted bedroom, wardrobe and media wall built live in three.js.
   Markup + styles: designer3d.html (section #d3). Booking hand-off: sessionStorage 'abj_design' (read by ABJ DESIGNFILL on the
   booking form) now includes a link that reopens the exact design (#d3=...). GA event: room_designer_3d.
   v2: inspire-me looks, tap the room to change it, doors/drawers that open, share link, day/evening lighting, floor + wall
   choices, ceiling height + window, eye-level view, fitted bedroom, contact shadows, adaptive quality for older phones. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

const $ = i => document.getElementById(i);
const root = $('d3');
if (root && !root.dataset.on) { root.dataset.on = '1'; start(); }

function start() {
/* ================================================================== data */
const COL = {
  white: ['Soft white', '#F2F0EA'], cream: ['Cream', '#E6DCC7'], cashmere: ['Cashmere', '#CFC2AE'],
  sage: ['Sage green', '#9DAC96'], grey: ['Dove grey', '#B3B7B6'], blue: ['Dusk blue', '#5F7388'],
  navy: ['Navy', '#26334A'], forest: ['Forest green', '#2C463C'], charcoal: ['Charcoal', '#3A3D40'],
  black: ['Black', '#1F2022'], oak: ['Oak', '#C39A6B', 1], walnut: ['Walnut', '#6E4A33', 1]
};
const HF = { brass: ['Brushed brass', '#B99A5E'], black: ['Matt black', '#222222'], chrome: ['Chrome', '#D7DBDE'] };
const TOP = {
  quartzw: ['White quartz', '#EFEDE8'], calacatta: ['Calacatta gold quartz', '#F1EEE8'], quartzb: ['Black quartz', '#1E1F21'],
  oak: ['Solid oak', '#B98B5B'], concrete: ['Concrete grey', '#8E8C88']
};
const FLOOR = { oak: ['Natural oak', '#C49A6C'], greyoak: ['Grey oak', '#A39B90'], herring: ['Oak chevron', '#BE935F'], tile: ['Grey porcelain', '#9A9894'], stone: ['Limestone', '#D9CDB8'] };
const WALLC = { white: ['Warm white', '#ECE6DC'], greige: ['Greige', '#D3C9BB'], sage: ['Soft sage', '#C4CDBB'], bluegrey: ['Blue grey', '#BCC6CD'], plaster: ['Plaster pink', '#D6BCA8'], green: ['Deep green', '#2F4A40'] };
const L = {
  lay: { straight: 'Straight', L: 'L-shaped', U: 'U-shaped', galley: 'Galley' },
  isl: { none: 'No island', island: 'Island', waterfall: 'Waterfall island' },
  kstyle: { handleless: 'Handleless', shaker: 'Shaker', flat: 'Flat with handles', inframe: 'In-frame' },
  fin: { matt: 'Matt', gloss: 'Gloss' },
  tall: { none: 'None', oven: 'Oven tower', ovenlarder: 'Oven + larder', full: 'Oven, fridge + larder' },
  wall: { units: 'Wall cupboards', shelves: 'Open shelves', none: 'None' },
  spl: { match: 'Matching upstand', tiles: 'White metro tiles', paint: 'Painted wall' },
  khd: { bar: 'Bar', cup: 'Cup + knob', knob: 'Knob' },
  sink: { under: 'Undermount', belfast: 'Belfast' },
  hob: { run: 'On the worktop', island: 'On the island' },
  ext: { hood: 'Chimney hood', hidden: 'Hidden extractor' },
  yn: { yes: 'Yes', no: 'No' },
  onoff: { on: 'On', off: 'Off' },
  open: { hinged: 'Hinged', sliding: 'Sliding' },
  wstyle: { flat: 'Flat', shaker: 'Shaker', fluted: 'Fluted', handleless: 'Handleless', mirror: 'Mirrored' },
  bstyle: { flat: 'Flat', shaker: 'Shaker', fluted: 'Fluted', handleless: 'Handleless' },
  whd: { bar: 'Bar', long: 'Full length', knob: 'Knob', none: 'None' },
  shelf: { none: 'None', left: 'Left', right: 'Right' },
  bay: { hang: 'Long hanging', double: 'Double hanging', shelves: 'Shelves', drawers: 'Drawers + hanging' },
  fire: { yes: 'Electric fire', no: 'No fire' },
  side: { shelves: 'Lit shelves', slats: 'Slat panels', none: 'Clean wall' },
  base: { float: 'Floating unit', cabinets: 'Base cupboards', none: 'None' },
  mfin: { slat: 'Wood slats', paint: 'Painted', marble: 'Marble effect' },
  bed: { double: 'Double', king: 'King size', super: 'Super king' },
  head: { fluted: 'Fluted panel', panel: 'Panelled wall', upholstered: 'Upholstered', none: 'None' },
  bwards: { both: 'Both sides', one: 'One side', none: 'None' },
  bside: { float: 'Floating', drawers: 'Drawers', none: 'None' },
  kwin: { sink: 'Above the sink', none: 'No window' },
  swin: { side: 'On the side wall', none: 'No window' }
};
const DEF = {
  t: 'k', tab: 0, view: 'angle',
  k: { lay: 'L', isl: 'island', A: 380, B: 280, style: 'handleless', fin: 'matt', col: 'sage', col2: 'walnut', top: 'calacatta', spl: 'match',
       hd: 'bar', hf: 'brass', tall: 'ovenlarder', wall: 'shelves', sink: 'under', hob: 'island', ext: 'hood', pend: 'yes', led: 'on', stools: 'yes' },
  w: { W: 260, H: 240, open: 'hinged', style: 'shaker', col: 'sage', hd: 'bar', hf: 'brass', shelf: 'right', led: 'on', bays: ['hang', 'shelves', 'drawers', 'double', 'hang', 'shelves'] },
  m: { W: 340, H: 250, tv: 65, fire: 'yes', side: 'shelves', base: 'float', fin: 'slat', col: 'charcoal', led: 'on' },
  b: { W: 420, bed: 'king', head: 'fluted', wards: 'both', bridge: 'yes', bside: 'float', dress: 'yes', style: 'shaker', col: 'cashmere', hd: 'bar', hf: 'brass', led: 'on' },
  room: { floor: 'oak', wallc: 'white', ceil: 255, kwin: 'sink', swin: 'side' }
};
const ENUM = {
  k: { lay: L.lay, isl: L.isl, style: L.kstyle, fin: L.fin, col: COL, col2: Object.assign({ same: 1 }, COL), top: TOP, spl: L.spl, hd: L.khd, hf: HF, tall: L.tall, wall: L.wall, sink: L.sink, hob: L.hob, ext: L.ext, pend: L.yn, stools: L.yn, led: L.onoff },
  w: { open: L.open, style: L.wstyle, col: COL, hd: L.whd, hf: HF, shelf: L.shelf, led: L.onoff },
  m: { fire: L.fire, side: L.side, base: L.base, fin: L.mfin, col: COL, led: L.onoff },
  b: { bed: L.bed, head: L.head, wards: L.bwards, bridge: L.yn, bside: L.bside, dress: L.yn, style: L.bstyle, col: COL, hd: L.whd, hf: HF, led: L.onoff },
  room: { floor: FLOOR, wallc: WALLC, kwin: L.kwin, swin: L.swin }
};
const NUM = { k: { A: [200, 600], B: [180, 450] }, w: { W: [100, 450], H: [200, 300] }, m: { W: [180, 450], H: [200, 300], tv: [43, 85] }, b: { W: [300, 550] }, room: { ceil: [230, 300] } };
const TABS = { k: ['Layout', 'Style', 'Colours', 'Worktop', 'Handles', 'Extras', 'Room'], b: ['Size', 'Bed', 'Storage', 'Doors', 'Room'], w: ['Size', 'Doors', 'Colour', 'Handles', 'Inside', 'Room'], m: ['Size', 'TV & fire', 'Layout', 'Finish', 'Room'] };
const NAME = { k: 'kitchen', b: 'bedroom', w: 'wardrobe', m: 'media wall' };
const PRESETS = {
  k: [
    ['Sage & walnut', '#9DAC96', { lay: 'L', isl: 'island', style: 'handleless', fin: 'matt', col: 'sage', col2: 'walnut', top: 'calacatta', spl: 'match', hf: 'brass', tall: 'ovenlarder', wall: 'shelves', sink: 'under', hob: 'island', ext: 'hood', pend: 'yes', stools: 'yes', led: 'on' }, { floor: 'oak', wallc: 'white' }],
    ['Navy Shaker & brass', '#26334A', { lay: 'L', isl: 'island', style: 'shaker', fin: 'matt', col: 'navy', col2: 'oak', top: 'quartzw', spl: 'tiles', hd: 'cup', hf: 'brass', tall: 'ovenlarder', wall: 'shelves', sink: 'belfast', hob: 'run', ext: 'hood', pend: 'yes', stools: 'yes', led: 'on' }, { floor: 'herring', wallc: 'white' }],
    ['Graphite & oak', '#3A3D40', { lay: 'L', isl: 'waterfall', style: 'handleless', fin: 'matt', col: 'charcoal', col2: 'oak', top: 'concrete', spl: 'match', hf: 'black', tall: 'full', wall: 'none', sink: 'under', hob: 'island', pend: 'yes', stools: 'yes', led: 'on' }, { floor: 'tile', wallc: 'greige' }],
    ['Cream in-frame', '#E6DCC7', { lay: 'straight', isl: 'island', style: 'inframe', fin: 'matt', col: 'cream', col2: 'forest', top: 'oak', spl: 'tiles', hd: 'knob', hf: 'brass', tall: 'oven', wall: 'shelves', sink: 'belfast', hob: 'run', ext: 'hood', pend: 'yes', stools: 'yes', led: 'on' }, { floor: 'stone', wallc: 'sage' }],
    ['White gloss', '#F2F0EA', { lay: 'U', isl: 'none', style: 'handleless', fin: 'gloss', col: 'white', top: 'quartzb', spl: 'match', hf: 'chrome', tall: 'ovenlarder', wall: 'units', sink: 'under', ext: 'hidden', led: 'on' }, { floor: 'greyoak', wallc: 'white' }]
  ],
  b: [
    ['Cashmere fluted', '#CFC2AE', { head: 'fluted', wards: 'both', bridge: 'yes', bside: 'float', style: 'shaker', col: 'cashmere', hd: 'bar', hf: 'brass', dress: 'yes', led: 'on' }, { floor: 'oak', wallc: 'white' }],
    ['Sage panelled', '#9DAC96', { head: 'panel', wards: 'both', bridge: 'yes', bside: 'drawers', style: 'shaker', col: 'sage', hd: 'knob', hf: 'brass', dress: 'no', led: 'on' }, { floor: 'greyoak', wallc: 'white' }],
    ['Navy hotel suite', '#26334A', { head: 'upholstered', wards: 'both', bridge: 'no', bside: 'float', style: 'flat', col: 'navy', hd: 'long', hf: 'brass', dress: 'yes', led: 'on' }, { floor: 'herring', wallc: 'greige' }],
    ['Clean white & oak', '#F2F0EA', { head: 'fluted', wards: 'one', bridge: 'yes', bside: 'float', style: 'handleless', col: 'white', dress: 'yes', led: 'on' }, { floor: 'oak', wallc: 'plaster' }]
  ],
  w: [
    ['Sage Shaker', '#9DAC96', { open: 'hinged', style: 'shaker', col: 'sage', hd: 'bar', hf: 'brass', shelf: 'right', led: 'on' }, { floor: 'oak', wallc: 'white' }],
    ['Walnut fluted', '#6E4A33', { open: 'hinged', style: 'fluted', col: 'walnut', hd: 'long', hf: 'black', shelf: 'left', led: 'on' }, { floor: 'greyoak', wallc: 'greige' }],
    ['Mirror sliding', '#D9E0E2', { open: 'sliding', style: 'mirror', col: 'white', hf: 'chrome', shelf: 'none', led: 'on' }, { floor: 'oak', wallc: 'bluegrey' }],
    ['Navy & brass', '#26334A', { open: 'hinged', style: 'shaker', col: 'navy', hd: 'knob', hf: 'brass', shelf: 'right', led: 'on' }, { floor: 'herring', wallc: 'white' }],
    ['Charcoal handleless', '#3A3D40', { open: 'hinged', style: 'handleless', col: 'charcoal', shelf: 'none', led: 'on' }, { floor: 'stone', wallc: 'white' }]
  ],
  m: [
    ['Walnut slats & fire', '#B88E63', { fire: 'yes', side: 'shelves', base: 'float', fin: 'slat', col: 'charcoal', led: 'on' }, { floor: 'oak', wallc: 'white' }],
    ['Marble & white', '#F0EEEA', { fire: 'yes', side: 'slats', base: 'cabinets', fin: 'marble', col: 'white', led: 'on' }, { floor: 'greyoak', wallc: 'greige' }],
    ['Forest green', '#2C463C', { fire: 'yes', side: 'shelves', base: 'float', fin: 'paint', col: 'forest', led: 'on' }, { floor: 'herring', wallc: 'white' }],
    ['Cashmere & oak', '#CFC2AE', { fire: 'no', side: 'shelves', base: 'cabinets', fin: 'slat', col: 'cashmere', led: 'on' }, { floor: 'stone', wallc: 'plaster' }]
  ]
};
const copy = o => JSON.parse(JSON.stringify(o));
let S = copy(DEF);
let fromLink = false;
(function restore() {
  let src = null;
  try { const h = location.hash.match(/[#&]d3=([A-Za-z0-9_-]+)/); if (h) { src = dec(h[1]); fromLink = !!src; } } catch (e) {}
  if (!src) try { src = JSON.parse(localStorage.getItem('abj_d3') || 'null'); } catch (e) {}
  const c = clean(src); ['k', 'w', 'm', 'b', 'room'].forEach(t => { if (c[t]) Object.assign(S[t], c[t]); }); if (c.t) S.t = c.t;
})();
function clean(src) {
  const out = {}; if (!src || typeof src !== 'object') return out;
  for (const t of ['k', 'w', 'm', 'b', 'room']) {
    const s = src[t]; if (!s || typeof s !== 'object') continue; const o = {};
    for (const k in DEF[t]) {
      const v = s[k]; if (v == null) continue;
      if (k === 'bays') { if (Array.isArray(v)) { const a = v.filter(x => typeof x === 'string' && Object.prototype.hasOwnProperty.call(L.bay, x)).slice(0, 6); if (a.length) o.bays = a; } continue; }
      const n = NUM[t] && NUM[t][k], e = ENUM[t] && ENUM[t][k];
      if (n) { const x = +v; if (isFinite(x)) o[k] = Math.max(n[0], Math.min(n[1], Math.round(x))); }
      else if (e && typeof v === 'string' && Object.prototype.hasOwnProperty.call(e, v)) o[k] = v;
    }
    out[t] = o;
  }
  if (['k', 'w', 'm', 'b'].indexOf(src.t) >= 0) out.t = src.t;
  return out;
}
function diff(a, b) { const d = {}; for (const k in a) if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) d[k] = a[k]; return d; }
function enc() { const o = { v: 2, t: S.t, s: diff(S[S.t], DEF[S.t]), r: diff(S.room, DEF.room) }; return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function dec(s) {
  try { s = s.replace(/-/g, '+').replace(/_/g, '/'); const o = JSON.parse(decodeURIComponent(escape(atob(s))));
    if (!o || ['k', 'w', 'm', 'b'].indexOf(o.t) < 0) return null; const out = { t: o.t, room: Object.assign(copy(DEF.room), o.r || {}) }; out[o.t] = Object.assign(copy(DEF[o.t]), o.s || {}); return out;
  } catch (e) { return null; }
}
function link() { return location.origin + location.pathname + '#d3=' + enc(); }
let saveT = 0;
function remember() { clearTimeout(saveT); saveT = setTimeout(() => { try { const o = copy(S); delete o.tab; delete o.view; localStorage.setItem('abj_d3', JSON.stringify(o)); } catch (e) {} }, 400); }

/* ================================================================== renderer */
const cv = $('d3-cv'), stage = $('d3-stage'), load = $('d3-load');
let R;
try { R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: false }); } catch (e) { R = null; }
const small = matchMedia('(max-width:899px)').matches;
const LOW = small || (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
const TS = LOW ? .5 : 1;
const UI = setupUI();
if (!R) { load.innerHTML = '<span>Your browser can&#39;t show the 3D view, but your choices below still go with your enquiry.</span>'; UI.all(); return; }
let PR = Math.min(window.devicePixelRatio || 1, LOW ? 1.5 : 2);
R.setPixelRatio(PR);
R.outputColorSpace = THREE.SRGBColorSpace;
R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.02;
R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); scene.background = new THREE.Color('#E9E3D8');
const cam = new THREE.PerspectiveCamera(38, 1.6, 0.05, 60);
const pm = new THREE.PMREMGenerator(R);
const ENV = { day: pm.fromScene(envScene(1), 0.035).texture, eve: pm.fromScene(envScene(.16), 0.035).texture };
scene.environment = ENV.day;
const hemi = new THREE.HemisphereLight('#fffaf2', '#a88d6f', 0.55); scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff3e3', 1.55); sun.castShadow = true;
sun.shadow.mapSize.set(LOW ? 1024 : 2048, LOW ? 1024 : 2048); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.025;
scene.add(sun, sun.target);
let G = null, EVE = false, ANIMS = [], LIGHTS = [];

function envScene(k) {
  const s = new THREE.Scene(), g = new THREE.BoxGeometry();
  const room = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: new THREE.Color(0x8a847b).multiplyScalar(Math.max(.25, k)) }));
  room.scale.set(30, 12, 30); room.position.y = 5; s.add(room);
  const lt = (i, x, y, z, sx, sy, sz, c) => { const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: new THREE.Color(c || 0xffffff).multiplyScalar(i) })); m.position.set(x, y, z); m.scale.set(sx, sy, sz); s.add(m); };
  lt(7 * k, 0, 10.8, 0, 12, .2, 10); lt(3.5 * k, -14.8, 5, 2, .2, 5, 9); lt(2.8 * k, 14.8, 5, -3, .2, 4, 7); lt(2.2 * k, 0, 5, 14.8, 10, 4, .2);
  if (k < .5) { lt(1.6, -4, 2, -6, 2, .3, 2, 0xffc68a); lt(1.2, 5, 2.5, 4, 2, .3, 2, 0xffc68a); }
  s.add(new THREE.AmbientLight(0xffffff, .5 * k));
  return s;
}

/* ================================================================== textures */
const TX = {};
function rnd(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function canvasTex(key, w, h, draw, srgb = true, scale = TS) {
  if (TX[key]) return TX[key];
  const c = document.createElement('canvas'); c.width = Math.max(8, Math.round(w * scale)); c.height = Math.max(8, Math.round(h * scale));
  const x = c.getContext('2d'); x.scale(c.width / w, c.height / h); draw(x, w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = LOW ? 4 : 8;
  return TX[key] = t;
}
function shade(hex, a) { const c = new THREE.Color(hex); const h = {}; c.getHSL(h); c.setHSL(h.h, h.s, Math.max(0, Math.min(1, h.l + a))); return '#' + c.getHexString(); }
function mix(a, b, k) { return '#' + new THREE.Color(a).lerp(new THREE.Color(b), k).getHexString(); }
function woodTex(hex, horiz) {
  const base = canvasTex('w' + hex, 512, 512, (x, w, h) => {
    const r = rnd(7); x.fillStyle = hex; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 46; i++) { x.fillStyle = shade(hex, (r() - .5) * .09) + '55'; const px = r() * w, pw = 6 + r() * 30; x.fillRect(px, 0, pw, h); }
    for (let i = 0; i < 170; i++) {
      x.strokeStyle = (r() < .6 ? 'rgba(40,22,8,' : 'rgba(255,240,215,') + (0.04 + r() * .12) + ')'; x.lineWidth = .6 + r() * 2.2;
      let px = r() * w; x.beginPath(); x.moveTo(px, 0);
      for (let y = 0; y <= h; y += 16) { px += (r() - .5) * 2.4; x.lineTo(px + Math.sin(y / 40 + i) * 1.6, y); }
      x.stroke();
    }
    for (let i = 0; i < 4; i++) { const kx = r() * w, ky = r() * h; for (let k = 0; k < 6; k++) { x.strokeStyle = 'rgba(50,28,10,' + (.12 - k * .015) + ')'; x.lineWidth = 1.2; x.beginPath(); x.ellipse(kx, ky, 3 + k * 3, 8 + k * 7, 0, 0, 7); x.stroke(); } }
  });
  if (!horiz) return base;
  if (TX['wh' + hex]) return TX['wh' + hex];
  const t = base.clone(); t.rotation = Math.PI / 2; t.center.set(.5, .5); t.needsUpdate = true; return TX['wh' + hex] = t;
}
function plankTex(key, col, var1) {
  return canvasTex(key, 1024, 1024, (x, w, h) => {
    const r = rnd(3), rows = 8, rh = h / rows;
    for (let i = 0; i < rows; i++) {
      let px = -r() * 300;
      while (px < w) {
        const len = 280 + r() * 340, base = shade(col, (r() - .5) * var1);
        x.fillStyle = base; x.fillRect(px, i * rh, len, rh);
        for (let k = 0; k < 22; k++) { x.strokeStyle = 'rgba(60,35,15,' + (0.04 + r() * .09) + ')'; x.lineWidth = .8 + r() * 1.6; const yy = i * rh + r() * rh; x.beginPath(); x.moveTo(px, yy); x.bezierCurveTo(px + len * .3, yy + (r() - .5) * 6, px + len * .6, yy + (r() - .5) * 6, px + len, yy + (r() - .5) * 4); x.stroke(); }
        x.fillStyle = 'rgba(40,25,12,.42)'; x.fillRect(px, i * rh, 2, rh);
        px += len;
      }
      x.fillStyle = 'rgba(40,25,12,.32)'; x.fillRect(0, i * rh, w, 2);
    }
  });
}
function chevronTex() {
  return canvasTex('chev', 1024, 1024, (x, w, h) => {
    const r = rnd(12), cw = 128, pw = 64, cols = w / cw;
    for (let n = 0; n < cols; n++) {
      const up = n % 2 === 0;
      for (let k = -4; k < h / pw + 4; k++) {
        const c = shade('#BE935F', (r() - .5) * .12); x.fillStyle = c;
        const x0 = n * cw, y0 = k * pw;
        x.beginPath();
        if (up) { x.moveTo(x0, y0); x.lineTo(x0 + cw, y0 - cw); x.lineTo(x0 + cw, y0 - cw + pw); x.lineTo(x0, y0 + pw); }
        else { x.moveTo(x0, y0 - cw); x.lineTo(x0 + cw, y0); x.lineTo(x0 + cw, y0 + pw); x.lineTo(x0, y0 - cw + pw); }
        x.closePath(); x.fill();
        x.strokeStyle = 'rgba(45,28,12,.38)'; x.lineWidth = 1.6; x.stroke();
        x.save(); x.clip();
        for (let g = 0; g < 7; g++) { x.strokeStyle = 'rgba(60,35,15,' + (0.05 + r() * .08) + ')'; x.lineWidth = .8 + r(); const o = r() * pw; x.beginPath(); if (up) { x.moveTo(x0, y0 + o); x.lineTo(x0 + cw, y0 - cw + o); } else { x.moveTo(x0, y0 - cw + o); x.lineTo(x0 + cw, y0 + o); } x.stroke(); }
        x.restore();
      }
    }
  });
}
function tileFloorTex(key, col, n, grout) {
  return canvasTex(key, 1024, 1024, (x, w, h) => {
    const r = rnd(21); x.fillStyle = grout; x.fillRect(0, 0, w, h); const s = w / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      x.fillStyle = shade(col, (r() - .5) * .04); x.fillRect(i * s + 2, j * s + 2, s - 4, s - 4);
      for (let k = 0; k < 40; k++) { const g = x.createRadialGradient(i * s + r() * s, j * s + r() * s, 0, i * s + r() * s, j * s + r() * s, 20 + r() * 70); const v = r() < .5 ? '255,255,255' : '60,55,50'; g.addColorStop(0, 'rgba(' + v + ',.06)'); g.addColorStop(1, 'rgba(' + v + ',0)'); x.fillStyle = g; x.fillRect(i * s + 2, j * s + 2, s - 4, s - 4); }
    }
  });
}
function floorMat(k) {
  return mat('fl' + k, () => {
    if (k === 'greyoak') return new THREE.MeshStandardMaterial({ map: plankTex('pgrey', '#A39B90', .09), roughness: .58, envMapIntensity: .4 });
    if (k === 'herring') return new THREE.MeshStandardMaterial({ map: chevronTex(), roughness: .55, envMapIntensity: .4 });
    if (k === 'tile') return new THREE.MeshStandardMaterial({ map: tileFloorTex('tgrey', '#9C9A96', 2, '#7d7b77'), roughness: .35, envMapIntensity: .6 });
    if (k === 'stone') return new THREE.MeshStandardMaterial({ map: tileFloorTex('tstone', '#DCD0BC', 2, '#c4b8a3'), roughness: .6, envMapIntensity: .4 });
    return new THREE.MeshStandardMaterial({ map: plankTex('poak', '#C49A6C', .1), roughness: .55, envMapIntensity: .4 });
  });
}
function marbleTex(key, base, vein, gold) {
  return canvasTex(key, 1024, 1024, (x, w, h) => {
    const r = rnd(11); x.fillStyle = base; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 14; i++) { const g = x.createRadialGradient(r() * w, r() * h, 0, r() * w, r() * h, 120 + r() * 260); g.addColorStop(0, 'rgba(140,140,150,.07)'); g.addColorStop(1, 'rgba(140,140,150,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); }
    const veins = (n, cw, alpha, col) => { for (let i = 0; i < n; i++) { let px = -50, py = r() * h; x.strokeStyle = col.replace('A', alpha * (0.5 + r() * .5)); x.lineWidth = cw * (0.4 + r()); x.beginPath(); x.moveTo(px, py); while (px < w + 50) { px += 18 + r() * 30; py += (r() - .5) * 46; x.lineTo(px, py); } x.stroke(); } };
    x.globalAlpha = .55; veins(5, 7, .35, vein); x.globalAlpha = 1; veins(9, 1.4, .55, vein); veins(14, .6, .4, vein);
    if (gold) { veins(4, 2.2, .7, 'rgba(176,138,72,A)'); }
  });
}
function speckTex() {
  return canvasTex('speck', 1024, 1024, (x, w, h) => {
    const r = rnd(5); x.fillStyle = '#1C1D1F'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) { const v = 60 + r() * 140; x.fillStyle = 'rgba(' + v + ',' + v + ',' + (v + 6) + ',' + (r() * .5) + ')'; x.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2); }
    x.strokeStyle = 'rgba(200,200,205,.12)'; x.lineWidth = 1.2; for (let i = 0; i < 4; i++) { let px = 0, py = r() * h; x.beginPath(); x.moveTo(px, py); while (px < w) { px += 30; py += (r() - .5) * 40; x.lineTo(px, py); } x.stroke(); }
  });
}
function concreteTex() {
  return canvasTex('conc', 512, 512, (x, w, h) => {
    const r = rnd(9); x.fillStyle = '#8F8D89'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) { const g = x.createRadialGradient(r() * w, r() * h, 0, r() * w, r() * h, 10 + r() * 60); const v = r() < .5 ? '60,58,55' : '190,188,183'; g.addColorStop(0, 'rgba(' + v + ',' + (0.05 + r() * .08) + ')'); g.addColorStop(1, 'rgba(' + v + ',0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); }
    for (let i = 0; i < 2500; i++) { x.fillStyle = 'rgba(40,40,40,' + r() * .25 + ')'; x.fillRect(r() * w, r() * h, 1, 1); }
  });
}
function tilesTex() {
  return canvasTex('tiles', 512, 512, (x, w, h) => {
    x.fillStyle = '#D6D0C6'; x.fillRect(0, 0, w, h);
    const tw = 128, th = 64;
    for (let row = 0; row < h / th; row++) for (let col = -1; col < w / tw + 1; col++) {
      const px = col * tw + (row % 2 ? tw / 2 : 0), py = row * th;
      const g = x.createLinearGradient(0, py, 0, py + th); g.addColorStop(0, '#FBFAF7'); g.addColorStop(1, '#ECE9E3');
      x.fillStyle = g; x.fillRect(px + 3, py + 3, tw - 6, th - 6);
      x.fillStyle = 'rgba(255,255,255,.7)'; x.fillRect(px + 6, py + 6, tw - 30, 4);
    }
  });
}
function fluteTex() {
  return canvasTex('flute', 64, 8, (x, w, h) => {
    for (let i = 0; i < w; i++) { const v = Math.round(128 + 110 * Math.cos(i / w * Math.PI * 2)); x.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; x.fillRect(i, 0, 1, h); }
  }, false, 1);
}
function glowTex() {
  return canvasTex('glow', 128, 128, (x, w, h) => {
    const g = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,210,150,1)'); g.addColorStop(.45, 'rgba(255,190,120,.45)'); g.addColorStop(1, 'rgba(255,180,110,0)');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
  }, true, 1);
}
function screenTex() {
  return canvasTex('tv', 512, 288, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1d3448'); g.addColorStop(.55, '#d58a5a'); g.addColorStop(.62, '#2b2a35'); g.addColorStop(1, '#101218');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = 'rgba(255,214,160,.9)'; x.beginPath(); x.arc(w * .68, h * .5, 26, 0, 7); x.fill();
    x.fillStyle = '#15171d'; x.beginPath(); x.moveTo(0, h * .62); for (let i = 0; i <= 10; i++) x.lineTo(w * i / 10, h * (.56 + Math.sin(i * 1.7) * .05)); x.lineTo(w, h); x.lineTo(0, h); x.fill();
  }, true, 1);
}
function flameTex() {
  return canvasTex('flame', 512, 64, (x, w, h) => {
    const r = rnd(4); x.fillStyle = '#120a06'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { const px = r() * w, fh = h * (.35 + r() * .6), g = x.createLinearGradient(0, h, 0, h - fh); g.addColorStop(0, 'rgba(255,220,120,.95)'); g.addColorStop(.4, 'rgba(255,120,30,.8)'); g.addColorStop(1, 'rgba(160,30,0,0)'); x.fillStyle = g; x.beginPath(); x.ellipse(px, h, 6 + r() * 10, fh, 0, Math.PI, 2 * Math.PI); x.fill(); }
    x.fillStyle = 'rgba(255,240,220,.9)'; x.fillRect(0, h - 5, w, 5);
  }, true, 1);
}
function skyTex(night) {
  return canvasTex(night ? 'skyN' : 'sky', 256, 256, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h);
    if (night) { g.addColorStop(0, '#0b1426'); g.addColorStop(.6, '#22304a'); g.addColorStop(.61, '#141a16'); g.addColorStop(1, '#0d110e'); }
    else { g.addColorStop(0, '#cfe0ea'); g.addColorStop(.65, '#eef3f2'); g.addColorStop(.66, '#a9b99a'); g.addColorStop(1, '#8fa181'); }
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    if (night) { const r = rnd(2); for (let i = 0; i < 40; i++) { x.fillStyle = 'rgba(255,255,255,' + (.3 + r() * .6) + ')'; x.fillRect(r() * w, r() * h * .55, 1.5, 1.5); } x.fillStyle = 'rgba(255,210,140,.9)'; x.fillRect(w * .7, h * .64, 6, 4); x.fillRect(w * .2, h * .66, 4, 3); }
  }, true, 1);
}
function rugTex() {
  return canvasTex('rug', 512, 512, (x, w, h) => {
    const r = rnd(8); x.fillStyle = '#D8CFC0'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 6000; i++) { x.fillStyle = 'rgba(' + (r() < .5 ? '120,105,90' : '250,245,235') + ',' + r() * .18 + ')'; x.fillRect(r() * w, r() * h, 2, 2); }
    x.strokeStyle = 'rgba(110,95,80,.5)'; x.lineWidth = 6; x.strokeRect(26, 26, w - 52, h - 52); x.lineWidth = 2; x.strokeRect(44, 44, w - 88, h - 88);
  });
}
function aoStripTex() {
  return canvasTex('aoS', 16, 128, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#fff'); g.addColorStop(.35, '#777'); g.addColorStop(1, '#000'); x.fillStyle = g; x.fillRect(0, 0, w, h); }, false, 1);
}
function aoBlobTex() {
  return canvasTex('aoB', 256, 256, (x, w, h) => {
    x.fillStyle = '#000'; x.fillRect(0, 0, w, h);
    x.shadowColor = '#fff'; x.shadowBlur = 34; x.shadowOffsetX = 2000; x.fillStyle = '#fff';
    x.beginPath(); x.rect(48 - 2000, 48, w - 96, h - 96); x.fill();
  }, false, 1);
}

/* ================================================================== materials */
const MT = {};
const mat = (k, f) => MT[k] || (MT[k] = f());
function paint(hex, gloss) {
  return mat('p' + hex + (gloss ? 'g' : ''), () => gloss
    ? new THREE.MeshPhysicalMaterial({ color: hex, roughness: .16, clearcoat: 1, clearcoatRoughness: .06, envMapIntensity: .9 })
    : new THREE.MeshStandardMaterial({ color: hex, roughness: .66, envMapIntensity: .55 }));
}
function woodMat(hex, horiz) { return mat('wd' + hex + (horiz ? 'h' : ''), () => new THREE.MeshStandardMaterial({ map: woodTex(hex, horiz), roughness: .58, envMapIntensity: .5 })); }
function colMat(key, gloss) { const c = COL[key] || COL.white; return c[2] ? woodMat(c[1]) : paint(c[1], gloss); }
function metal(k) {
  return mat('m' + k, () => k === 'brass' ? new THREE.MeshStandardMaterial({ color: '#C4A25E', metalness: 1, roughness: .32 })
    : k === 'black' ? new THREE.MeshStandardMaterial({ color: '#1d1d1d', metalness: .55, roughness: .42 })
    : k === 'steel' ? new THREE.MeshStandardMaterial({ color: '#C9CDCF', metalness: 1, roughness: .28 })
    : new THREE.MeshStandardMaterial({ color: '#E4E7E9', metalness: 1, roughness: .1 }));
}
function topMat(k) {
  return mat('t' + k, () => {
    if (k === 'oak') return new THREE.MeshStandardMaterial({ map: woodTex('#B98B5B', true), roughness: .5 });
    if (k === 'quartzb') return new THREE.MeshPhysicalMaterial({ map: speckTex(), roughness: .22, clearcoat: .6, clearcoatRoughness: .15 });
    if (k === 'concrete') return new THREE.MeshStandardMaterial({ map: concreteTex(), roughness: .8 });
    return new THREE.MeshPhysicalMaterial({ map: k === 'calacatta' ? marbleTex('calg', '#F2EFEA', 'rgba(150,150,158,A)', 1) : marbleTex('quw', '#F1F0EC', 'rgba(175,175,182,A)'), roughness: .18, clearcoat: .7, clearcoatRoughness: .1 });
  });
}
function wallMat() { const c = (WALLC[S.room.wallc] || WALLC.white)[1]; return mat('wall' + c, () => new THREE.MeshStandardMaterial({ color: c, roughness: .95, envMapIntensity: .3 })); }
function fabricMat(hex) { return mat('fab' + hex, () => new THREE.MeshStandardMaterial({ color: hex, roughness: 1, envMapIntensity: .25 })); }
const M_SKIRT = new THREE.MeshStandardMaterial({ color: '#F4F1EB', roughness: .6 });
const M_DARK = new THREE.MeshStandardMaterial({ color: '#1A1A1A', roughness: .6 });
const M_GLASS = new THREE.MeshPhysicalMaterial({ color: '#0d0d0f', roughness: .05, metalness: .2, clearcoat: 1 });
const M_CERAMIC = new THREE.MeshPhysicalMaterial({ color: '#F6F5F1', roughness: .2, clearcoat: .8 });
const M_PLANT = new THREE.MeshStandardMaterial({ color: '#4F6B45', roughness: .9 });
const M_LED = new THREE.MeshBasicMaterial({ color: '#FFE2B5' });
const M_MIRROR = new THREE.MeshPhysicalMaterial({ color: '#E8EEF0', metalness: .7, roughness: .1, envMapIntensity: 2, clearcoat: 1, clearcoatRoughness: .05 });
const M_CARC = new THREE.MeshStandardMaterial({ color: '#EEEBE5', roughness: .7, envMapIntensity: .4 });
const M_DRAWER = new THREE.MeshStandardMaterial({ color: '#E9E6E0', roughness: .6 });
const M_INSIDE = woodMat('#D2B48C');
const M_AO = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .32, depthWrite: false });
const M_BULB = new THREE.MeshBasicMaterial({ color: '#FFE9C4' });

/* ================================================================== geometry helpers */
const BOX = new THREE.BoxGeometry(1, 1, 1);
const GEO = {};
function uvBox(w, h, d, s) {
  const k = [w, h, d, s].map(v => v.toFixed(3)).join(',');
  if (GEO[k]) return GEO[k];
  const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) { const i = f * 4 + v; uv.setXY(i, uv.getX(i) * dims[f][0] / s, uv.getY(i) * dims[f][1] / s); }
  return GEO[k] = g;
}
function bx(p, w, h, d, x, y, z, m, o) {
  if (w <= 0 || h <= 0 || d <= 0) return null;
  const textured = !!(m.map || m.bumpMap);
  const me = new THREE.Mesh(textured ? uvBox(w, h, d, (o && o.s) || 1) : BOX, m);
  if (!textured) me.scale.set(w, h, d);
  me.position.set(x + w / 2, y + h / 2, z + d / 2);
  me.castShadow = !(o && o.ns); me.receiveShadow = true; p.add(me); return me;
}
const CYL = new THREE.CylinderGeometry(1, 1, 1, 20), SPH = new THREE.SphereGeometry(1, 20, 14);
function cyl(p, r, h, x, y, z, m, axis) {
  const me = new THREE.Mesh(CYL, m); me.scale.set(r, h, r);
  if (axis === 'x') me.rotation.z = Math.PI / 2; else if (axis === 'z') me.rotation.x = Math.PI / 2;
  me.position.set(x, y, z); me.castShadow = true; me.receiveShadow = true; p.add(me); return me;
}
function sph(p, r, x, y, z, m) { const me = new THREE.Mesh(SPH, m); me.scale.setScalar(r); me.position.set(x, y, z); me.castShadow = true; p.add(me); return me; }
function part(p, name, x, y, z, ry) { const g = new THREE.Group(); g.userData.part = name; if (x != null) g.position.set(x, y || 0, z || 0); if (ry) g.rotation.y = ry; p.add(g); return g; }
function tag(m, name) { if (m) m.userData.part = name; return m; }
/* contact shadows: a soft strip with its dark edge at z0 (local), and a soft blob under freestanding things */
function aoStrip(p, x0, z0, len, depth, ry, op) {
  if (len <= 0) return;
  const h = new THREE.Group(); h.position.set(x0, 0, z0); h.rotation.y = ry || 0; p.add(h);
  const m = mat('aoS' + (op || ''), () => { const c = M_AO.clone(); c.alphaMap = aoStripTex(); if (op) c.opacity = op; return c; });
  const me = new THREE.Mesh(new THREE.PlaneGeometry(len, depth), m); me.rotation.x = -Math.PI / 2; me.position.set(len / 2, .003, depth / 2); me.renderOrder = 1; h.add(me);
}
function aoBlob(p, cx, cz, w, d, op, y) {
  const m = mat('aoB' + (op || ''), () => { const c = M_AO.clone(); c.alphaMap = aoBlobTex(); c.opacity = op || .45; return c; });
  const me = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.5, d * 1.5), m); me.rotation.x = -Math.PI / 2; me.position.set(cx, y || .004, cz); me.renderOrder = 1; p.add(me);
}
function light(p, x, y, z, color, base, dist, eve) { const l = new THREE.PointLight(color || '#FFD6A0', base, dist || 2, 2); l.position.set(x, y, z); l.userData.base = base; l.userData.eve = eve || 2.6; p.add(l); LIGHTS.push(l); return l; }

/* moving parts: doors swing (L = hinge on the left edge), drawers slide, sliding doors glide */
function anim(g, type, v, extra) { g.userData.anim = Object.assign({ type, v: v || 0, t: v || 0 }, extra || {}); ANIMS.push(g); applyAnim(g); return g; }
function applyAnim(g) {
  const a = g.userData.anim, e = a.v * a.v * (3 - 2 * a.v);
  if (a.type === 'L') g.rotation.y = -e * (a.max || 1.7);
  else if (a.type === 'R') g.rotation.y = e * (a.max || 1.7);
  else if (a.type === 'drawer') g.position.z = e * (a.out || .36);
  else if (a.type === 'slide') g.position.x = e * a.dx;
}

/* handles: drawn on a front whose face is at z = fz (local), facing +z */
function handle(p, kind, fin, cx, cy, fz, ori, len) {
  const m = metal(fin), hg = part(p, 'handle');
  if (kind === 'knob') { cyl(hg, .006, .022, cx, cy, fz + .011, m, 'z'); sph(hg, .013, cx, cy, fz + .026, m); return; }
  if (kind === 'cup') { bx(hg, .095, .012, .028, cx - .0475, cy + .006, fz, m); bx(hg, .095, .022, .004, cx - .0475, cy - .016, fz + .024, m); bx(hg, .004, .034, .028, cx - .0475, cy - .016, fz, m); bx(hg, .004, .034, .028, cx + .0435, cy - .016, fz, m); return; }
  const l = len || .16;
  if (ori === 'v') { cyl(hg, .0058, l, cx, cy, fz + .032, m); cyl(hg, .004, .032, cx, cy + l / 2 - .02, fz + .016, m, 'z'); cyl(hg, .004, .032, cx, cy - l / 2 + .02, fz + .016, m, 'z'); }
  else { cyl(hg, .0058, l, cx, cy, fz + .032, m, 'x'); cyl(hg, .004, .032, cx + l / 2 - .02, cy, fz + .016, m, 'z'); cyl(hg, .004, .032, cx - l / 2 + .02, cy, fz + .016, m, 'z'); }
}

/* one door / drawer front: rect x..x+w, y..y+h, face at z = fz, thickness behind it.
   o.anim: 'L' | 'R' (hinge edge) | 'drawer'; o.part: what a tap on it changes */
function front(p, x, y, w, h, fz, style, m, o) {
  o = o || {}; const g = .0035, t = .019, X = x + g, Y = y + g, W = w - 2 * g, H = h - 2 * g;
  if (W <= .02 || H <= .02) return null;
  const host = new THREE.Group(); host.userData.part = o.part || 'door';
  let top = host;
  if (o.anim === 'L' || o.anim === 'R') {
    top = new THREE.Group(); top.userData.part = host.userData.part; const hx = o.anim === 'L' ? x : x + w;
    top.position.set(hx, 0, fz); host.position.set(-hx, 0, -fz); top.add(host); anim(top, o.anim, o.open || 0, { max: o.max });
  } else if (o.anim === 'drawer') {
    top = new THREE.Group(); top.userData.part = host.userData.part; top.add(host); anim(top, 'drawer', 0, { out: Math.min(.36, (o.depth || .45) * .8) });
    const dd = o.depth || .44; bx(host, W - .05, Math.max(.04, H - .07), dd, X + .025, Y + .03, fz - .022 - dd, M_DRAWER, { ns: 1 });
  }
  p.add(top);
  if (style === 'shaker' || style === 'inframe') {
    const f = Math.min(.068, W * .2, H * .2);
    bx(host, W, H, t - .012, X, Y, fz - t, m);
    bx(host, W, f, t, X, Y + H - f, fz - t, m); bx(host, W, f, t, X, Y, fz - t, m);
    bx(host, f, H - 2 * f, t, X, Y + f, fz - t, m); bx(host, f, H - 2 * f, t, X + W - f, Y + f, fz - t, m);
  } else if (style === 'fluted') {
    const fm = mat('fl' + m.uuid, () => { const c = m.clone(); c.bumpMap = fluteTex(); c.bumpScale = 3; c.map = m.map || null; return c; });
    bx(host, W, H, t, X, Y, fz - t, fm, { s: .03 });
  } else if (style === 'mirror') {
    bx(host, W, H, t - .004, X, Y, fz - t, m);
    bx(host, W - .05, H - .05, .004, X + .025, Y + .025, fz - .004, M_MIRROR);
  } else bx(host, W, H, t, X, Y, fz - t, m);
  if (o.glass) bx(host, W * .64, H * .7, .002, X + W * .18, Y + H * .15, fz + .001, M_GLASS, { ns: 1 });
  if (o.hd && o.hd !== 'none') {
    let cx = X + W / 2, cy = Y + H / 2, ori = 'h', len = o.len;
    if (o.pos === 'top') cy = Y + H - .05; else if (o.pos === 'bottom') cy = Y + .05;
    if (o.side === 'L') { cx = X + .04; ori = 'v'; } else if (o.side === 'R') { cx = X + W - .04; ori = 'v'; }
    if (ori === 'v' && o.pos === 'top') cy = Y + H - (len || .16) / 2 - .04;
    if (ori === 'v' && o.pos === 'bottom') cy = Y + (len || .16) / 2 + .04;
    if (o.hd === 'cup' && ori === 'v') handle(host, 'knob', o.hf, cx, cy, fz, ori);
    else handle(host, o.hd, o.hf, cx, cy, fz, ori, ori === 'h' && o.hd === 'bar' ? Math.min(.32, Math.max(.12, W * .45)) : len);
  }
  return top;
}
const hingeFor = side => side === 'R' ? 'L' : side === 'L' ? 'R' : null;
/* hollow cupboard box: back, sides, bottom (+ top), so open doors show an inside */
function carc(p, x, y, w, h, d, z0, o) {
  o = o || {}; const s = .018;
  bx(p, w, h, s, x, y, z0, M_CARC, { ns: 1 });
  bx(p, s, h, d, x, y, z0, M_CARC); bx(p, s, h, d, x + w - s, y, z0, M_CARC);
  bx(p, w - 2 * s, s, d - s, x + s, y, z0 + s, M_CARC, { ns: 1 });
  if (o.top) bx(p, w, s, d, x, y + h - s, z0, M_CARC);
  (o.shelves || []).forEach(k => bx(p, w - 2 * s, s, d - .06, x + s, y + h * k, z0 + s, M_CARC, { ns: 1 }));
}

/* ================================================================== room shell */
function shell(p, X, Z, o) {
  const wh = Math.max(o.wallH || 0, S.room.ceil / 100), WM = wallMat();
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(X, Z), floorMat(S.room.floor));
  const tile = S.room.floor === 'tile' || S.room.floor === 'stone' ? 1.2 : S.room.floor === 'herring' ? 1.6 : 2.4;
  fl.geometry.attributes.uv.array.forEach((v, i, a) => { a[i] = v * (i % 2 ? Z / tile : X / tile); });
  fl.rotation.x = -Math.PI / 2; fl.position.set(X / 2, 0, Z / 2); fl.receiveShadow = true; tag(fl, 'floor'); p.add(fl);
  bx(p, X + .2, .08, Z + .1, -.1, -.082, 0, M_SKIRT, { ns: 1 });
  tag(bx(p, X + .2, wh, .1, -.1, 0, -.1, WM, { ns: 1 }), 'wall');
  bx(p, X, .1, .015, 0, 0, 0, M_SKIRT, { ns: 1 });
  aoStrip(p, 0, 0, X, .4, 0, .22);
  const cut = { L: [], R: [], Ls: [], Rs: [] };
  const side = (x, sk, list, stub, ry, ax, az0) => {
    list.push(tag(bx(p, .1, wh, Z, x, 0, 0, WM, { ns: 1 }), 'wall'));
    const s2 = bx(p, .1, .12, Z, x, 0, 0, WM, { ns: 1 }); s2.visible = false; stub.push(s2);
    bx(p, .015, .1, Z, sk, 0, 0, M_SKIRT, { ns: 1 }); aoStrip(p, ax, az0, Z, .4, ry, .22);
  };
  if (o.left !== false) side(-.1, 0, cut.L, cut.Ls, Math.PI / 2, 0, Z);
  if (o.right) side(X, X - .015, cut.R, cut.Rs, -Math.PI / 2, X, 0);
  p.userData.cut = cut;
  if (o.sideWin && S.room.swin === 'side' && o.left !== false) {
    const zc = Math.max(1.2, Z - 1.35), g = part(p, 'window', 0, 0, zc, Math.PI / 2);
    windowOn(g, 0, .95, 1.15, Math.min(1.35, wh - 1.15)); cut.L.push(g);
  }
  return wh;
}
function windowOn(p, cx, y0, w, h) {
  const g = part(p, 'window'), fm = paint('#F4F2EE');
  bx(g, w + .12, h + .12, .03, cx - w / 2 - .06, y0 - .06, 0, fm, { ns: 1 });
  const sk = mat('skyM', () => new THREE.MeshBasicMaterial({ map: skyTex(false) }));
  const pl = new THREE.Mesh(new THREE.PlaneGeometry(w, h), sk); pl.position.set(cx, y0 + h / 2, .031); g.add(pl);
  bx(g, .035, h, .02, cx - .0175, y0, .03, fm, { ns: 1 }); bx(g, w, .035, .02, cx - w / 2, y0 + h * .62, .03, fm, { ns: 1 });
  bx(g, w + .16, .03, .08, cx - w / 2 - .08, y0 - .06, 0, fm);
}
function plant(p, x, z, y) { const g = part(p, 'plant'); y = y || 0; cyl(g, .1, .2, x, y + .1, z, paint('#E9E4DA')); for (let i = 0; i < 7; i++) sph(g, .09 + (i % 3) * .02, x + Math.sin(i * 2.1) * .08, y + .3 + (i % 4) * .06, z + Math.cos(i * 2.1) * .08, M_PLANT); if (!y) aoBlob(p, x, z, .26, .26, .5); }
function rug(p, cx, cz, w, d) { const r = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat('rugM', () => new THREE.MeshStandardMaterial({ map: rugTex(), roughness: 1 }))); r.rotation.x = -Math.PI / 2; r.position.set(cx, .005, cz); r.receiveShadow = true; tag(r, 'floor'); p.add(r); }

/* ================================================================== kitchen */
function planRun(Lr, specials, talls, tallStart) {
  const out = [], tw = talls.length * .6;
  let cur = tallStart ? tw : 0; const end = Lr - (tallStart ? 0 : tw);
  if (tallStart) talls.forEach((k, i) => out.push({ kind: k, x: i * .6, w: .6 }));
  const fill = (a, b) => { const len = b - a; if (len < .05) return; if (len < .2) { out.push({ kind: 'filler', x: a, w: len }); return; } const n = Math.max(1, Math.round(len / .6)), w = len / n; for (let i = 0; i < n; i++) out.push({ kind: 'door', x: a + i * w, w }); };
  specials.sort((a, b) => a.at - b.at).forEach((s, i, arr) => {
    const rest = arr.slice(i + 1).reduce((t, q) => t + q.w, 0);
    let x = Math.max(cur, Math.min(end - rest - s.w, s.at * Lr - s.w / 2));
    fill(cur, x); out.push({ kind: s.kind, x, w: s.w }); cur = x + s.w;
  });
  fill(cur, end);
  if (!tallStart) talls.forEach((k, i) => out.push({ kind: k, x: end + i * .6, w: .6 }));
  let alt = 0; out.forEach(u => { if (u.kind === 'door') { u.kind = (alt++ % 3 === 1 && u.w >= .45) ? 'drawers' : 'door'; } });
  return out;
}
function kitchen(p) {
  const o = S.k, lay = o.lay, isl = o.isl !== 'none' && lay !== 'galley';
  const gloss = o.fin === 'gloss' && (o.style === 'handleless' || o.style === 'flat');
  const dm = colMat(o.col, gloss), im = colMat(o.col2 === 'same' ? o.col : o.col2, gloss);
  const tm = topMat(o.top), tt = (o.top === 'oak' || o.top === 'concrete') ? .04 : .03, TOPY = .87;
  const style = o.style, hd = style === 'handleless' ? 'none' : o.hd, hf = o.hf;
  const hobOnIsland = isl && o.hob === 'island';
  let X, Z, A = o.A / 100, B = o.B / 100;
  if (lay === 'galley') { X = 2.7; Z = Math.max(A + 1.2, 3.4); }
  else { X = A; Z = Math.max(lay === 'straight' ? 0 : B + .9, isl ? 3.6 : 2.6, 3.0); }
  if (lay === 'U') X = Math.max(X, 2.6);
  shell(p, X, Z, { left: true, right: lay === 'U' || lay === 'galley', wallH: 2.3 });
  const plCol = c => paint(shade(COL[c] ? COL[c][1] : '#888', -.12));
  const unit = (R, u, cm, info) => {
    const x = u.x, w = u.w, pt = info.island ? 'island' : 'door';
    const isTall = u.kind.indexOf('tall') === 0;
    bx(R, w, .148, .52, x, 0, .03, isTall || style !== 'handleless' ? plCol(info.island ? (o.col2 === 'same' ? o.col : o.col2) : o.col) : M_DARK);
    const topH = isTall ? 2.2 : TOPY;
    const fz = .6, base = .15;
    if (u.kind === 'tall-oven') bx(R, w, topH - .15, .57, x, .15, .01, M_CARC);
    else carc(R, x, base, w, topH - base, .57, .01, { top: isTall, shelves: isTall ? [.2, .42, .64, .84] : [.5] });
    if (style === 'inframe') { const f = .03; bx(R, w, f, .02, x, topH - f, .58, cm); bx(R, w, f, .02, x, base, .58, cm); bx(R, f, topH - base, .02, x, base, .58, cm); bx(R, f, topH - base, .02, x + w - f, base, .58, cm); }
    const ins = style === 'inframe' ? .03 : 0, fx = x + ins, fw = w - 2 * ins;
    const fst = style === 'handleless' ? 'flat' : style;
    const opt = q => Object.assign({ hd, hf, part: pt }, q);
    if (isTall) {
      const tH = 2.2 - base - ins;
      if (u.kind === 'tall-oven') {
        front(R, fx, base + ins, fw, .55, fz, fst, cm, opt({ pos: 'top', anim: 'drawer', depth: .5 }));
        const oy = base + ins + .56, og = part(R, 'oven');
        bx(og, fw - .02, .58, .02, fx + .01, oy, fz - .02, M_GLASS); bx(og, fw * .7, .3, .003, fx + fw * .15, oy + .12, fz, mat('ovw', () => new THREE.MeshStandardMaterial({ color: '#2a2b2e', roughness: .2 })), { ns: 1 });
        cyl(og, .008, fw * .7, fx + fw / 2, oy + .5, fz + .03, metal('steel'), 'x');
        bx(og, fw - .02, .44, .02, fx + .01, oy + .6, fz - .02, M_GLASS); cyl(og, .008, fw * .7, fx + fw / 2, oy + .98, fz + .03, metal('steel'), 'x');
        front(R, fx, oy + 1.05, fw, 2.2 - ins - (oy + 1.05), fz, fst, cm, opt({ pos: 'bottom' }));
      } else {
        const split = u.kind === 'tall-fridge' ? 1.05 : .95, sd = info.flip ? 'L' : 'R';
        front(R, fx, base + ins, fw, split, fz, fst, cm, opt({ side: sd, pos: 'top', len: .3, anim: hingeFor(sd) }));
        front(R, fx, base + ins + split, fw, tH - split, fz, fst, cm, opt({ side: sd, pos: 'bottom', len: .3, anim: hingeFor(sd) }));
      }
      if (style === 'handleless') bx(R, .02, tH, .02, info.flip ? x : x + w - .02, base, .58, metal(hf === 'brass' ? 'brass' : 'black'));
      return;
    }
    const fh = (style === 'handleless' ? .685 : .72) - ins * 2;
    if (style === 'handleless') tag(bx(R, w, .035, .025, x, base + .685, .555, metal(hf === 'brass' ? 'brass' : hf === 'chrome' ? 'steel' : 'black'), { ns: 1 }), 'handle');
    if (u.kind === 'filler') { bx(R, w, fh, .02, x, base, .58, cm); return; }
    if (u.kind === 'drawers' || u.kind === 'hob') {
      const hs = [.18, .27, fh - .45];
      let yy = base + ins + fh - hs[0];
      front(R, fx, yy, fw, hs[0], fz, fst, cm, opt({ pos: 'top', anim: 'drawer' })); yy -= hs[1];
      front(R, fx, yy, fw, hs[1], fz, fst, cm, opt({ pos: 'top', anim: 'drawer' })); front(R, fx, base + ins, fw, hs[2], fz, fst, cm, opt({ pos: 'top', anim: 'drawer' }));
      return;
    }
    let fh2 = fh, by = base + ins;
    if (u.kind === 'sink' && o.sink === 'belfast') { fh2 = fh - .24; tag(bx(R, w - .02, .245, .55, x + .01, TOPY - .245, .08, M_CERAMIC), 'sink'); }
    if (fw > .62) { front(R, fx, by, fw / 2, fh2, fz, fst, cm, opt({ side: 'R', pos: 'top', anim: 'L' })); front(R, fx + fw / 2, by, fw / 2, fh2, fz, fst, cm, opt({ side: 'L', pos: 'top', anim: 'R' })); }
    else { const sd = info.flip ? 'L' : 'R'; front(R, fx, by, fw, fh2, fz, fst, cm, opt({ side: sd, pos: 'top', anim: hingeFor(sd) })); }
  };
  const sinkOn = (R, cx) => {
    const y = TOPY + tt, g = part(R, 'sink');
    if (o.sink === 'belfast') bx(g, .5, .002, .4, cx - .25, y, .12, mat('bsin', () => new THREE.MeshStandardMaterial({ color: '#DCDAD5', roughness: .3 })), { ns: 1 });
    else { bx(g, .52, .002, .4, cx - .26, y, .12, metal('steel'), { ns: 1 }); bx(g, .46, .0025, .34, cx - .23, y, .15, mat('sinkin', () => new THREE.MeshStandardMaterial({ color: '#6d7174', metalness: .9, roughness: .35 })), { ns: 1 }); }
    const tg = part(R, 'handle'), tm2 = metal(hf); cyl(tg, .022, .05, cx, y + .025, .07, tm2); cyl(tg, .012, .3, cx, y + .17, .07, tm2);
    const tor = new THREE.Mesh(new THREE.TorusGeometry(.09, .011, 10, 24, Math.PI), tm2); tor.position.set(cx, y + .32, .16); tor.rotation.y = Math.PI / 2; tor.castShadow = true; tg.add(tor);
    cyl(tg, .012, .06, cx, y + .29, .25, tm2);
  };
  const hobOn = (R, cx, cz) => {
    const y = TOPY + tt, g = part(R, 'hob'); bx(g, .58, .006, .5, cx - .29, y, cz - .25, M_GLASS, { ns: 1 });
    const rm = mat('ring', () => new THREE.MeshBasicMaterial({ color: '#3a3a3c' }));
    [[-.14, -.11], [.14, -.11], [-.14, .12], [.14, .12]].forEach(([dx, dz], i) => { const r = new THREE.Mesh(new THREE.RingGeometry(i === 1 ? .085 : .065, i === 1 ? .092 : .072, 40), rm); r.rotation.x = -Math.PI / 2; r.position.set(cx + dx, y + .0065, cz + dz); g.add(r); });
  };
  const talls = { none: [], oven: ['tall-oven'], ovenlarder: ['tall-oven', 'tall-larder'], full: ['tall-fridge', 'tall-oven', 'tall-larder'] }[o.tall];
  const runs = [];
  if (lay === 'straight' || lay === 'L' || lay === 'U') {
    const sp = [{ kind: 'sink', w: o.sink === 'belfast' ? .6 : .8, at: lay === 'straight' ? .35 : .5 }];
    if (!hobOnIsland && lay === 'straight') sp.push({ kind: 'hob', w: .6, at: .78 });
    runs.push({ len: X, pos: [0, 0], rot: 0, specials: sp, talls, window: true, flip: false });
    if (lay === 'L' || lay === 'U') runs.push({ len: B - .6, pos: [0, B], rot: Math.PI / 2, specials: !hobOnIsland ? [{ kind: 'hob', w: .6, at: .45 }] : [], talls: [], flip: true, corner: 1 });
    if (lay === 'U') runs.push({ len: B - .6, pos: [X, .6], rot: -Math.PI / 2, specials: [], talls: [], flip: false, corner: 0 });
  } else {
    runs.push({ len: A, pos: [0, A], rot: Math.PI / 2, specials: [{ kind: 'sink', w: o.sink === 'belfast' ? .6 : .8, at: .5 }], talls: [], flip: true });
    runs.push({ len: A, pos: [X, 0], rot: -Math.PI / 2, specials: [{ kind: 'hob', w: .6, at: .55 }], talls, tallStart: true, flip: false });
  }
  if (lay === 'galley' && S.room.kwin === 'sink') windowOn(p, X / 2, 1.05, 1.1, 1.15);
  runs.forEach(run => {
    if (run.len < .3) return;
    const R = new THREE.Group(); R.position.set(run.pos[0], 0, run.pos[1]); R.rotation.y = run.rot; p.add(R);
    const plan = planRun(run.len, run.specials.slice(), run.talls, run.tallStart);
    const baseUnits = plan.filter(u => u.kind.indexOf('tall') < 0);
    plan.forEach(u => unit(R, u, dm, run));
    aoStrip(R, plan.length ? plan[0].x : 0, .58, plan.length ? plan[plan.length - 1].x + plan[plan.length - 1].w - plan[0].x : 0, .32, 0, .3);
    const bx0 = baseUnits.length ? Math.min(...baseUnits.map(u => u.x)) : 0, bx1 = baseUnits.length ? Math.max(...baseUnits.map(u => u.x + u.w)) : 0;
    if (bx1 > bx0) tag(bx(R, bx1 - bx0, tt, .62, bx0, TOPY, 0, tm, { s: 1.2 }), 'worktop');
    const ends = [plan[0], plan[plan.length - 1]].filter(Boolean);
    if (ends.length) { const ex0 = ends[0].x, ex1 = ends[1].x + ends[1].w, h0 = ends[0].kind.indexOf('tall') === 0 ? 2.2 : TOPY, h1 = ends[1].kind.indexOf('tall') === 0 ? 2.2 : TOPY; if (run.corner !== 0) bx(R, .018, h0 - .001, .6, ex0 - .018, 0, 0, dm); if (!run.corner && !(lay === 'U' && run === runs[0])) bx(R, .018, h1 - .001, .6, ex1, 0, 0, dm); }
    const sk = plan.find(u => u.kind === 'sink'), hb = plan.find(u => u.kind === 'hob');
    if (sk) sinkOn(R, sk.x + sk.w / 2);
    if (hb) hobOn(R, hb.x + hb.w / 2, .32);
    const skip = [];
    if (run.window && sk && S.room.kwin === 'sink') { const cx = sk.x + sk.w / 2; windowOn(R, cx, 1.12, 1.0, Math.min(1.08, S.room.ceil / 100 - 1.3)); skip.push([cx - .62, cx + .62]); }
    if (hb && o.ext === 'hood') {
      const cx = hb.x + hb.w / 2, hm = metal('steel'), hg = part(R, 'hood'), ceil = S.room.ceil / 100;
      bx(hg, .6, .09, .5, cx - .3, 1.58, 0, hm); bx(hg, .3, ceil - 1.67, .26, cx - .15, 1.67, 0, hm); skip.push([cx - .32, cx + .32]);
    }
    if (bx1 > bx0 && o.spl !== 'paint') {
      const sm = o.spl === 'tiles' ? mat('tilesM', () => new THREE.MeshStandardMaterial({ map: tilesTex(), roughness: .25 })) : tm;
      tag(bx(R, bx1 - bx0, 1.45 - TOPY - tt, .012, bx0, TOPY + tt, 0, sm, { s: o.spl === 'tiles' ? .6 : 1.2, ns: 1 }), 'splash');
    }
    if (o.wall !== 'none' && bx1 > bx0) {
      let segs = [[bx0, bx1]];
      skip.forEach(([a, b]) => { segs = segs.flatMap(([s, e]) => b <= s || a >= e ? [[s, e]] : [[s, Math.max(s, a)], [Math.min(e, b), e]]).filter(([s, e]) => e - s > .25); });
      segs.forEach(([s, e]) => {
        if (o.wall === 'units') {
          const n = Math.max(1, Math.round((e - s) / .5)), w = (e - s) / n, wy = 1.45, wh = .72;
          for (let i = 0; i < n; i++) carc(R, s + i * w, wy, w, wh, .32, 0, { top: 1, shelves: [.5] });
          bx(R, .018, wh, .34, s - .018, wy, 0, dm); bx(R, .018, wh, .34, e, wy, 0, dm);
          for (let i = 0; i < n; i++) { const sd = i % 2 ? 'L' : 'R'; front(R, s + i * w, style === 'handleless' ? wy - .025 : wy, w, style === 'handleless' ? wh + .025 : wh, .345, style === 'handleless' ? 'flat' : style, dm, { hd, hf, side: sd, pos: 'bottom', len: .12, anim: hingeFor(sd), max: 1.5 }); }
          if (o.led === 'on') { bx(R, e - s - .04, .006, .02, s + .02, wy - .007, .26, M_LED, { ns: 1 }); light(R, (s + e) / 2, wy - .05, .35, null, .7, 1.6); }
        } else {
          const sm = woodMat('#B98B5B', true), sg = part(R, 'shelf');
          [1.55, 1.95].forEach((sy, k) => {
            bx(sg, e - s - .04, .04, .26, s + .02, sy, 0, sm, { s: 1 });
            if (o.led === 'on') bx(sg, e - s - .08, .004, .015, s + .04, sy - .005, .2, M_LED, { ns: 1 });
            const r = rnd(Math.round(s * 100) + k);
            for (let q = s + .12; q < e - .12; q += .2 + r() * .25) {
              if (r() < .45) cyl(sg, .04 + r() * .03, .1 + r() * .14, q, sy + .04 + .08, .13, paint(['#E9E4DA', '#B8B2A6', '#6E7A6C', '#2F3633', '#C9A96E'][Math.floor(r() * 5)]));
              else if (r() < .7) for (let b = 0; b < 3; b++) bx(sg, .2, .03, .16, q - .1, sy + .04 + b * .03, .04, paint(['#D9D2C3', '#8E9A87', '#B98B5B'][b]));
            }
          });
          if (o.led === 'on') light(R, (s + e) / 2, 1.5, .3, null, .6, 1.6);
        }
      });
    }
  });
  let iz0 = 0, IL = 0, icx = 0;
  if (isl) {
    IL = Math.max(1.5, Math.min(2.8, (lay === 'U' ? X - 2.4 : lay === 'L' ? X - 1.9 : X - 1.2)));
    icx = lay === 'L' ? .6 + 1.05 + IL / 2 + Math.max(0, (X - .6 - 1.05 - IL - .6) / 2) : X / 2;
    if (lay === 'L') icx = Math.min(icx, X - IL / 2 - .4);
    iz0 = 1.7;
    const R = new THREE.Group(); R.position.set(icx + IL / 2, 0, iz0 + .6); R.rotation.y = Math.PI; p.add(R);
    const plan = planRun(IL, hobOnIsland ? [{ kind: 'hob', w: .6, at: .5 }] : [], [], false);
    plan.forEach(u => unit(R, u, im, { flip: false, island: true }));
    const ov = .32, wf = o.isl === 'waterfall';
    tag(bx(p, IL, tt, .62 + ov, icx - IL / 2, TOPY, iz0 - .02, tm, { s: 1.2 }), 'worktop');
    tag(bx(p, IL, TOPY - .15, .02, icx - IL / 2, .15, iz0 + .6, im), 'island');
    bx(p, IL, .15, .02, icx - IL / 2, 0, iz0 + .55, plCol(o.col2 === 'same' ? o.col : o.col2));
    if (wf) { tag(bx(p, tt, TOPY + tt, .62 + ov, icx - IL / 2 - tt, 0, iz0 - .02, tm, { s: 1.2 }), 'worktop'); tag(bx(p, tt, TOPY + tt, .62 + ov, icx + IL / 2, 0, iz0 - .02, tm, { s: 1.2 }), 'worktop'); }
    else { tag(bx(p, .02, TOPY, .62, icx - IL / 2 - .02, 0, iz0 - .02, im), 'island'); tag(bx(p, .02, TOPY, .62, icx + IL / 2, 0, iz0 - .02, im), 'island'); }
    aoBlob(p, icx, iz0 + .4, IL + .1, .95, .55);
    if (hobOnIsland) hobOn(p, icx, iz0 + .3);
    if (o.stools === 'yes') {
      const n = Math.max(2, Math.min(4, Math.floor(IL / .58))), sm = woodMat('#6E4A33'), lm = metal(hf === 'chrome' ? 'chrome' : 'black'), sg = part(p, 'stools');
      for (let i = 0; i < n; i++) { const sx = icx - IL / 2 + IL * (i + .5) / n, sz = iz0 + .6 + .28; cyl(sg, .19, .05, sx, .66, sz, sm); cyl(sg, .022, .62, sx, .33, sz, lm); cyl(sg, .2, .015, sx, .008, sz, lm); bx(sg, .3, .02, .02, sx - .15, .3, sz - .01, lm); aoBlob(p, sx, sz, .4, .4, .4); }
    }
    if (o.pend === 'yes') {
      const n = IL > 2.1 ? 3 : 2, pg = part(p, 'pend'), ceil = S.room.ceil / 100;
      for (let i = 0; i < n; i++) {
        const px = icx - IL / 2 + IL * (i + .5) / n, pz = iz0 + .35;
        cyl(pg, .004, ceil - 1.82, px, (ceil + 1.82) / 2, pz, M_DARK);
        const sh = new THREE.Mesh(new THREE.CylinderGeometry(.03, .17, .2, 32, 1, true), mat('shade' + hf, () => { const c = metal(hf).clone(); c.side = THREE.DoubleSide; return c; }));
        sh.position.set(px, 1.72, pz); sh.castShadow = true; pg.add(sh);
        sph(pg, .045, px, 1.64, pz, M_BULB);
        if (i === Math.floor(n / 2) || n === 2) light(p, px, 1.55, pz, null, 1.1, 3.2, 2.2);
      }
    }
  }
  plant(p, Math.min(X - .35, X * .92), Z - .45);
  let ty = 1.0, tz = Math.min(Z, isl ? iz0 + 1.2 : 2.4) / 2, size = Math.max(X, isl ? iz0 + 1.4 : (lay === 'straight' ? 1.6 : B));
  if (lay === 'galley') { tz = A / 2 + .1; size = Math.max(A + .3, X); }
  if (lay === 'U') size *= 1.15;
  const eye = lay === 'galley' ? new THREE.Vector3(X / 2, 1.58, Z - .25) : new THREE.Vector3(X * .55, 1.58, Math.min(Z - .2, isl ? iz0 + 1.75 : 2.7));
  return { X, Z, target: new THREE.Vector3(X / 2, ty, tz), size, eye };
}

/* ================================================================== wardrobe interiors (shared) */
function rail(p, x0, w0, ry, len, seed, z) {
  const r = rnd(seed); cyl(p, .012, w0 - .02, x0 + w0 / 2, ry, z || .3, metal('chrome'), 'x');
  const n = Math.floor((w0 - .06) / .045), cols = ['#7C8A80', '#C9B79A', '#5F6B7A', '#B78D7A', '#D8D2C6', '#4B5A52', '#2F3633'];
  for (let i = 0; i < n; i++) { const l2 = len * (.7 + r() * .3); bx(p, .028, l2, .42, x0 + .03 + i * .045, ry - .03 - l2, (z || .3) - .21, paint(cols[Math.floor(r() * cols.length)])); }
}
function bayInside(p, kind, x0, w0, H, top, hf, seed, led) {
  const r = rnd(seed), shelfAt = sy => bx(p, w0, .022, .54, x0, sy, .02, M_INSIDE);
  if (kind === 'hang') { shelfAt(top - .3); rail(p, x0, w0, top - .38, 1.05, seed); }
  if (kind === 'double') { rail(p, x0, w0, top - .12, .78, seed); shelfAt(.08 + (H - .08) / 2 - .02); rail(p, x0, w0, .08 + (H - .08) / 2 - .1, .72, seed + 1); }
  if (kind === 'shelves') for (let i = 1; i <= 5; i++) { const sy = .08 + (H - .1) * i / 6; shelfAt(sy); const n = Math.floor(w0 / .34); for (let q = 0; q < n; q++) for (let s = 0; s < 3; s++) bx(p, .3, .05, .3, x0 + .02 + q * .34, sy + .022 + s * .05, .12, paint(['#D9D2C3', '#8E9A87', '#B9AE9E', '#5F7388', '#C9A96E'][Math.floor(r() * 5)])); }
  if (kind === 'drawers') { for (let k = 0; k < 3; k++) { bx(p, w0, .2, .5, x0, .1 + k * .22, .06, paint('#F0EBE2')); cyl(p, .006, .14, x0 + w0 / 2, .1 + k * .22 + .15, .565, metal(hf), 'x'); } shelfAt(.78); rail(p, x0, w0, top - .12, .9, seed); }
  if (led) bx(p, w0 - .04, .005, .015, x0 + .02, top - .03, .5, M_LED, { ns: 1 });
}
function wbays(o) { return Math.max(1, Math.round((o.W - (o.shelf === 'none' ? 0 : 45)) / 100)); }

/* ================================================================== wardrobe */
function wardrobe(p) {
  const o = S.w, ceil = S.room.ceil / 100, W = o.W / 100, H = Math.min(o.H / 100, ceil), X = W, Z = 3.4, inside = S.tab === 4;
  shell(p, X, Z, { left: true, right: true, wallH: H + .05, sideWin: true });
  const cm = colMat(o.col, false), hf = o.hf, sw = o.shelf === 'none' ? 0 : .45, dx = o.shelf === 'left' ? sw : 0, dw = W - sw;
  bx(p, W, .08, .54, 0, 0, 0, paint(shade(COL[o.col][1], -.12)));
  bx(p, W, H - .08, .02, 0, .08, 0, cm); bx(p, .02, H - .08, .6, 0, .08, 0, cm); bx(p, .02, H - .08, .6, W - .02, .08, 0, cm);
  bx(p, W, .025, .6, 0, H - .025, 0, cm); bx(p, W, .02, .58, 0, .08, 0, cm);
  aoStrip(p, 0, .6, W, .35, 0, .3);
  const led = o.led === 'on';
  if (sw) {
    const sx = o.shelf === 'left' ? 0 : W - sw, lh = (H - .08) * .34, oy = .08 + lh, sg = part(p, 'shelf');
    bx(sg, sw - .04, H - oy - .04, .02, sx + .02, oy, .02, M_INSIDE);
    for (let i = 0; i <= 4; i++) {
      const sy = oy + (H - oy - .04) * i / 4.4;
      bx(sg, sw - .04, .025, .55, sx + .02, sy, .02, M_INSIDE);
      if (led && i < 4) bx(sg, sw - .08, .004, .015, sx + .04, sy + (H - oy - .04) / 4.4 - .006, .45, M_LED, { ns: 1 });
      if (i < 4) { if (i % 2) for (let b = 0; b < 4; b++) bx(sg, .3, .045, .28, sx + .07, sy + .025 + b * .045, .12, paint(['#D9D2C3', '#8E9A87', '#B9AE9E', '#5F7388'][b])); else { cyl(sg, .07, .18, sx + sw * .35, sy + .115, .3, paint('#E9E4DA')); bx(sg, .14, .16, .22, sx + sw * .55, sy + .025, .15, mat('basket', () => new THREE.MeshStandardMaterial({ color: '#B08A5A', roughness: 1 }))); } }
    }
    bx(p, .02, H - .08, .6, sx + (o.shelf === 'left' ? sw - .02 : 0), .08, 0, cm);
    carc(p, sx + .02, .08, sw - .04, lh, .56, .02, {});
    const sd = o.shelf === 'left' ? 'R' : 'L';
    front(p, sx, .08, sw, lh, .6, o.style === 'mirror' || o.style === 'handleless' ? 'flat' : o.style, cm, { hd: o.style === 'handleless' || o.hd === 'none' ? 'none' : (o.hd === 'long' ? 'bar' : o.hd), hf, side: sd, pos: 'top', anim: hingeFor(sd) });
    if (led) light(p, sx + sw / 2, H * .7, .45, null, .8, 2);
  }
  const nb = wbays(o), bw = dw / nb, top = H - .02, ig = part(p, 'inside');
  bx(ig, dw, H - .1, .015, dx, .08, .02, M_INSIDE);
  for (let b = 0; b <= nb; b++) bx(ig, .018, H - .1, .56, dx + b * bw - (b === nb ? .018 : 0), .08, .02, M_INSIDE);
  for (let b = 0; b < nb; b++) bayInside(ig, o.bays[b % o.bays.length], dx + b * bw + .02, bw - .04, H, top, hf, b * 7 + 1, led);
  if (led) light(p, dx + dw / 2, top - .15, .55, null, .8, 2);
  const st = o.style, hdk = st === 'handleless' || o.open === 'sliding' ? 'none' : o.hd;
  if (o.open === 'sliding') {
    const n = Math.max(2, Math.min(4, Math.round(o.W / 95))), ov = .03, w1 = (dw + ov * (n - 1)) / n, fr = metal(hf === 'brass' ? 'brass' : hf === 'chrome' ? 'chrome' : 'black');
    bx(p, dw, .04, .09, dx, top - .04, .56, fr); bx(p, dw, .02, .09, dx, .08, .56, fr);
    for (let i = 0; i < n; i++) {
      const px = dx + i * (w1 - ov), fz = i % 2 ? .65 : .615, g = part(p, 'door');
      front(g, px, .1, w1, top - .14, fz, st === 'handleless' ? 'flat' : st, cm, {}); bx(g, .02, top - .14, .022, px, .1, fz - .021, fr); bx(g, .02, top - .14, .022, px + w1 - .02, .1, fz - .021, fr);
      anim(g, 'slide', 0, { dx: (i < n - 1 ? 1 : -1) * (w1 - ov) * .95 });
      g.userData.slider = 1; if (inside) g.visible = false;
    }
  } else {
    const n = Math.max(2, Math.round(dw / .5)), w1 = dw / n;
    for (let i = 0; i < n; i++) {
      const hingeL = i % 2 === 0, px = dx + i * w1;
      const d = front(p, px, .08, w1, top - .08, .6, st === 'handleless' ? 'flat' : st, cm, { hd: hdk, hf, side: hingeL ? 'R' : 'L', pos: 'mid', len: o.hd === 'long' ? 1.2 : .3, anim: hingeL ? 'L' : 'R', open: inside ? 1 : 0, max: 1.75 });
      if (d) d.userData.wdoor = 1;
      if (st === 'handleless') bx(p, .012, top - .12, .006, hingeL ? px + w1 - .012 : px, .1, .6, M_DARK, { ns: 1 });
    }
  }
  rug(p, W / 2, 1.9, Math.min(2.4, W * .8), 1.6);
  const bw2 = Math.min(1.2, W * .45), bg = part(p, 'bench'); bx(bg, bw2, .1, .42, W / 2 - bw2 / 2, .36, 2.0, fabricMat('#6E7A6C')); bx(bg, bw2, .04, .42, W / 2 - bw2 / 2, .32, 2.0, woodMat('#6E4A33'));
  [[.04, .04], [bw2 - .08, .04], [.04, .34], [bw2 - .08, .34]].forEach(([a, b]) => bx(bg, .04, .32, .04, W / 2 - bw2 / 2 + a, 0, 2.0 + b, woodMat('#6E4A33')));
  aoBlob(p, W / 2, 2.21, bw2, .42, .4);
  plant(p, W - .3, Z - .5);
  return { X, Z, target: new THREE.Vector3(W / 2, H * .5, inside ? 1.0 : .9), size: Math.max(W, H * 1.35), eye: new THREE.Vector3(W / 2, 1.6, Z - .35) };
}

/* ================================================================== media wall */
function media(p) {
  const o = S.m, ceil = S.room.ceil / 100, W = o.W / 100, H = Math.min(o.H / 100, ceil), X = W, Z = 3.8, D = .28, led = o.led === 'on';
  shell(p, X, Z, { left: true, right: true, wallH: H + .05, sideWin: true });
  const cm = colMat(o.col, false), sw = o.side === 'none' ? 0 : Math.min(.55, W * .16), cx0 = sw, cw = W - 2 * sw, cx = W / 2;
  const slatM = woodMat('#B88E63'), backM = paint('#2A2622');
  const slats = (g, x0, w0, y0, h0, z0) => {
    bx(g, w0, h0, .012, x0, y0, z0, backM, { ns: 1 });
    const step = .045, n = Math.floor((w0 - .01) / step), inst = new THREE.InstancedMesh(uvBox(.03, h0, .02, 1), slatM, n), m4 = new THREE.Matrix4();
    for (let i = 0; i < n; i++) { m4.makeTranslation(x0 + .008 + i * step + .015 + (w0 - n * step) / 2, y0 + h0 / 2, z0 + .012 + .01); inst.setMatrixAt(i, m4); }
    inst.castShadow = true; inst.receiveShadow = true; g.add(inst);
  };
  const pg = part(p, 'panel');
  bx(pg, W, H, D - .02, 0, 0, 0, o.fin === 'paint' ? paint(COL[o.col][1]) : paint('#E2DBCF'));
  if (o.fin === 'slat') slats(pg, cx0, cw, 0, H, D - .02);
  else if (o.fin === 'marble') bx(pg, cw, H, .02, cx0, 0, D - .02, mat('marbleWall', () => new THREE.MeshPhysicalMaterial({ map: marbleTex('mw', '#F0EEEA', 'rgba(150,150,160,A)', 1), roughness: .2, clearcoat: .6 })), { s: 1.6 });
  else bx(pg, cw, H, .02, cx0, 0, D - .02, paint(COL[o.col][1]));
  aoStrip(p, 0, D, W, .35, 0, .3);
  const lts = [];
  if (sw) [0, W - sw].forEach((sx, k) => {
    const sg = part(p, 'side');
    if (o.side === 'slats') { slats(sg, sx, sw, 0, H, D - .02); return; }
    bx(sg, sw, H, .03, sx, 0, D - .03, cm);
    const ox = sx + .05, ow = sw - .1, oy = .62, oh = H - oy - .12;
    bx(sg, ow, oh, .02, ox, oy, D - .01, mat('niche', () => new THREE.MeshStandardMaterial({ color: '#2D2A27', roughness: .9 })), { ns: 1 });
    for (let i = 0; i < 4; i++) {
      const sy = oy + oh * (i + 1) / 4.6; bx(sg, ow, .03, .26, ox, sy, D, cm);
      if (led) bx(sg, ow - .04, .004, .012, ox + .02, sy - .005, D + .2, M_LED, { ns: 1 });
      const r = rnd(i + k * 9); if (r() < .5) cyl(sg, .05, .14 + r() * .1, ox + ow * .4, sy + .03 + .09, D + .13, paint(['#E9E4DA', '#B8B2A6', '#C9A96E', '#2F3633'][i])); else for (let b = 0; b < 3; b++) bx(sg, .16, .03, .2, ox + ow * .25, sy + .03 + b * .03, D + .03, paint(['#D9D2C3', '#8E9A87', '#B98B5B'][b]));
    }
    const bg = part(p, 'base'); carc(bg, sx, 0, sw, oy, .32, D, { top: 1 });
    front(bg, sx, .0, sw, oy, D + .32 + .02, 'flat', cm, { part: 'base', anim: k ? 'R' : 'L' });
    if (led) lts.push([sx + sw / 2, oy + oh * .6, D + .3]);
  });
  let baseTop = 0;
  if (o.base === 'float') {
    const bw = Math.max(1.2, cw - .1), by = .22, bh = .32, bg = part(p, 'base'); carc(bg, cx - bw / 2, by, bw, bh, .4, D, { top: 1 });
    const n = Math.max(2, Math.round(bw / .9)); for (let i = 0; i < n; i++) front(bg, cx - bw / 2 + i * bw / n, by, bw / n, bh, D + .4 + .02, 'flat', cm, { part: 'base', anim: 'drawer', depth: .36 });
    if (led) { bx(bg, bw - .1, .005, .02, cx - bw / 2 + .05, by - .006, D + .3, M_LED, { ns: 1 }); lts.push([cx, .12, D + .5]); }
    baseTop = by + bh;
  } else if (o.base === 'cabinets') {
    const bh = .5, bg = part(p, 'base'); carc(bg, cx0, .06, cw, bh - .06, .42, D, { top: 1, shelves: [.5] });
    const n = Math.max(2, Math.round(cw / .8)); for (let i = 0; i < n; i++) front(bg, cx0 + i * cw / n, .06, cw / n, bh - .06, D + .42 + .02, 'flat', cm, { part: 'base', anim: i % 2 ? 'R' : 'L' });
    bx(bg, cw, .06, .38, cx0, 0, D, M_DARK); aoStrip(p, cx0, D + .42, cw, .3, 0, .3); baseTop = bh;
  }
  const diag = o.tv * .0254, tw = diag * .872, th = diag * .49;
  let fireTop = baseTop;
  if (o.fire === 'yes') {
    const fg = part(p, 'fire'), fw = Math.min(cw - .2, Math.max(tw * .9, 1.4)), fh = .3, fy = Math.max(baseTop + .14, .42);
    bx(fg, fw + .06, fh + .06, .03, cx - fw / 2 - .03, fy - .03, D, M_DARK);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh * .8), mat('flameM', () => new THREE.MeshBasicMaterial({ map: flameTex() }))); fl.position.set(cx, fy + fh * .45, D + .028); fg.add(fl);
    bx(fg, fw, .02, .01, cx - fw / 2, fy + .02, D + .025, mat('crystal', () => new THREE.MeshBasicMaterial({ color: '#ffc27a' })), { ns: 1 });
    light(p, cx, fy + .2, D + .35, '#FF9A4A', .9, 2.2, 3);
    fireTop = fy + fh;
  }
  const ty = Math.min(H - th - .18, Math.max(fireTop + .22, 1.05 - th / 2 + .2)), tg = part(p, 'tv');
  if (led) { const gl = new THREE.Mesh(new THREE.PlaneGeometry(tw + .55, th + .55), mat('glowM', () => new THREE.MeshBasicMaterial({ map: glowTex(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .55 }))); gl.position.set(cx, ty + th / 2, D + .002); tg.add(gl); }
  bx(tg, tw, th, .035, cx - tw / 2, ty, D + .02, M_GLASS);
  const sc = new THREE.Mesh(new THREE.PlaneGeometry(tw - .015, th - .015), mat('scr', () => new THREE.MeshBasicMaterial({ map: screenTex(), color: '#bfbfbf' }))); sc.position.set(cx, ty + th / 2, D + .056); tg.add(sc);
  lts.slice(0, 3).forEach(([x, y, z]) => light(p, x, y, z, null, .6, 1.8));
  rug(p, cx, 2.2, Math.min(2.8, W * .75), 1.9);
  const tb = part(p, 'decor'); cyl(tb, .45, .04, cx, .38, 2.25, woodMat('#6E4A33', true)); cyl(tb, .3, .36, cx, .18, 2.25, M_DARK); sph(tb, .06, cx + .15, .45, 2.2, paint('#C9A96E'));
  aoBlob(p, cx, 2.25, .75, .75, .45);
  plant(p, W - .35, 1.2);
  return { X, Z, target: new THREE.Vector3(W / 2, H * .48, 1.1), size: Math.max(W * 1.02, H * 1.3), eye: new THREE.Vector3(W / 2, 1.25, Z - .45) };
}

/* ================================================================== fitted bedroom */
function bedroom(p) {
  const o = S.b, ceil = S.room.ceil / 100, W = o.W / 100, X = W, Z = 4.4, Hw = Math.min(2.4, ceil), led = o.led === 'on';
  shell(p, X, Z, { left: true, right: true, wallH: 2.3, sideWin: true });
  const cm = colMat(o.col, false), hf = o.hf, st = o.style === 'handleless' ? 'flat' : o.style, hdk = o.style === 'handleless' ? 'none' : o.hd;
  const bedW = { double: 1.35, king: 1.5, super: 1.8 }[o.bed] + .1;
  let bsw = o.bside === 'none' ? .15 : .55, ww = 0;
  const nW = o.wards === 'both' ? 2 : o.wards === 'one' ? 1 : 0;
  if (nW) { ww = Math.min(1.2, (W - bedW - 2 * bsw) / nW); if (ww < .5) { ww = .5; bsw = Math.max(.15, (W - bedW - nW * ww) / 2); } }
  const xs = nW === 2 ? [[0, ww], [W - ww, W]] : nW === 1 ? [[W - ww, W]] : [];
  const zoneL = nW === 2 ? ww : 0, zoneR = nW ? W - ww : W, bc = (zoneL + zoneR) / 2;
  /* wardrobes either side, doors open, simple insides */
  xs.forEach(([a, b], k) => {
    const w0 = b - a; bx(p, w0, .08, .54, a, 0, 0, paint(shade(COL[o.col][1], -.12)));
    bx(p, w0, Hw - .08, .02, a, .08, 0, cm); bx(p, .02, Hw - .08, .6, a, .08, 0, cm); bx(p, .02, Hw - .08, .6, b - .02, .08, 0, cm); bx(p, w0, .025, .6, a, Hw - .025, 0, cm); bx(p, w0, .02, .58, a, .08, 0, cm);
    const ig = part(p, 'inside'); bx(ig, w0 - .04, Hw - .1, .015, a + .02, .08, .02, M_INSIDE);
    bayInside(ig, k ? 'shelves' : 'hang', a + .03, w0 - .06, Hw, Hw - .02, hf, 30 + k, led);
    aoStrip(p, a, .6, w0, .35, 0, .3);
    const n = Math.max(1, Math.round(w0 / .5)), w1 = w0 / n;
    for (let i = 0; i < n; i++) { const hingeL = (i % 2 === 0) !== (n === 1 && k === 0); front(p, a + i * w1, .08, w1, Hw - .1, .6, st, cm, { hd: hdk, hf, side: hingeL ? 'R' : 'L', pos: 'mid', len: o.hd === 'long' ? 1.2 : .3, anim: hingeL ? 'L' : 'R', max: 1.75 }); if (o.style === 'handleless') bx(p, .012, Hw - .14, .006, hingeL ? a + (i + 1) * w1 - .012 : a + i * w1, .1, .6, M_DARK, { ns: 1 }); }
    if (led) light(p, (a + b) / 2, Hw - .2, .5, null, .6, 1.8);
  });
  /* bridge units over the bed */
  if (o.bridge === 'yes' && nW) {
    const a = zoneL, b = zoneR, bh = .42, by = Hw - bh, bg = part(p, 'bridge'), n = Math.max(1, Math.round((b - a) / .6));
    for (let i = 0; i < n; i++) carc(bg, a + i * (b - a) / n, by, (b - a) / n, bh, .36, 0, { top: 1 });
    for (let i = 0; i < n; i++) front(bg, a + i * (b - a) / n, by, (b - a) / n, bh, .38, st, cm, { part: 'bridge', hd: hdk === 'long' ? 'bar' : hdk, hf, pos: 'bottom', anim: i % 2 ? 'R' : 'L', max: 1.4 });
    if (led) { bx(bg, b - a - .06, .005, .02, a + .03, by - .006, .3, M_LED, { ns: 1 }); light(p, bc, by - .1, .45, null, .5, 2); }
  }
  /* headboard */
  const hg = part(p, 'head'), hx0 = nW === 2 ? zoneL : Math.max(0, bc - bedW / 2 - bsw), hx1 = Math.min(nW ? zoneR : W, bc + bedW / 2 + bsw);
  if (o.head === 'panel') { const n = Math.max(2, Math.round((hx1 - hx0) / .55)); for (let i = 0; i < n; i++) front(hg, hx0 + i * (hx1 - hx0) / n, .1, (hx1 - hx0) / n, 1.25, .03, 'shaker', cm, { part: 'head' }); bx(hg, hx1 - hx0, .04, .05, hx0, 1.35, 0, cm); }
  else if (o.head === 'fluted') { const fm = mat('flh' + o.col, () => { const c = cm.clone(); c.bumpMap = fluteTex(); c.bumpScale = 3; return c; }); bx(hg, bedW + .5, 1.35, .04, bc - bedW / 2 - .25, 0, 0, fm, { s: .045 }); if (led) { bx(hg, bedW + .4, .006, .015, bc - bedW / 2 - .2, 1.34, .03, M_LED, { ns: 1 }); } }
  else if (o.head === 'upholstered') { const um = mat('uph' + o.col, () => new THREE.MeshStandardMaterial({ color: mix(COL[o.col][1], '#B9AE9E', .45), roughness: 1, bumpMap: fluteTex(), bumpScale: 4 })); bx(hg, bedW + .25, 1.3, .09, bc - bedW / 2 - .125, .3, .01, um, { s: .16 }); }
  /* bed */
  const bdg = part(p, 'bed'), bz = o.head === 'upholstered' ? .1 : .06, bl = 2.1;
  bx(bdg, bedW, .3, bl, bc - bedW / 2, .03, bz, fabricMat('#8F8A83'));
  bx(bdg, bedW - .08, .2, bl - .08, bc - bedW / 2 + .04, .33, bz + .02, fabricMat('#F3F0EA'));
  bx(bdg, bedW + .02, .07, 1.38, bc - bedW / 2 - .01, .5, bz + bl - 1.4, fabricMat('#E9E2D6'));
  bx(bdg, .02, .28, 1.38, bc - bedW / 2 - .02, .28, bz + bl - 1.4, fabricMat('#E9E2D6')); bx(bdg, .02, .28, 1.38, bc + bedW / 2, .28, bz + bl - 1.4, fabricMat('#E9E2D6'));
  bx(bdg, bedW + .04, .075, .42, bc - bedW / 2 - .02, .505, bz + bl - .5, fabricMat(mix(COL[o.col][1], '#9C6B53', .35)));
  const np = o.bed === 'double' ? 2 : 3;
  for (let i = 0; i < np; i++) { const pl = sph(bdg, 1, bc - bedW / 2 + (i + .5) * bedW / np, .6, bz + .3, fabricMat(i === 1 && np === 3 ? mix(COL[o.col][1], '#E9E2D6', .3) : '#F6F3EE')); pl.scale.set(bedW / np / 2 - .03, .09, .16); }
  aoBlob(p, bc, bz + bl / 2, bedW + .1, bl, .55);
  rug(p, bc, bz + 1.6, Math.min(W - .4, bedW + 1.2), 2.0);
  /* bedside units + lamps */
  if (o.bside !== 'none') [-1, 1].forEach(sd => {
    const ux = sd < 0 ? bc - bedW / 2 - bsw + (bsw - .48) / 2 : bc + bedW / 2 + (bsw - .48) / 2, uw = Math.min(.48, bsw - .04), sg = part(p, 'bside');
    if (uw < .3) return;
    const flt = o.bside === 'float', uy = flt ? .42 : 0, uh = flt ? .2 : .55;
    carc(sg, ux, uy, uw, uh, .4, 0, { top: 1 });
    if (flt) front(sg, ux, uy, uw, uh, .42, st, cm, { part: 'bside', hd: hdk === 'long' ? 'bar' : hdk, hf, pos: 'mid', anim: 'drawer', depth: .34 });
    else { front(sg, ux, .3, uw, .25, .42, st, cm, { part: 'bside', hd: hdk === 'long' ? 'bar' : hdk, hf, pos: 'mid', anim: 'drawer', depth: .34 }); front(sg, ux, .05, uw, .25, .42, st, cm, { part: 'bside', hd: hdk === 'long' ? 'bar' : hdk, hf, pos: 'mid', anim: 'drawer', depth: .34 }); }
    if (flt && led) bx(sg, uw - .06, .004, .015, ux + .03, uy - .005, .3, M_LED, { ns: 1 });
    const lx = ux + uw / 2, ly = uy + uh;
    cyl(sg, .06, .18, lx, ly + .09, .2, paint('#E2D9CA')); const sh = new THREE.Mesh(new THREE.CylinderGeometry(.1, .13, .16, 24, 1, true), mat('lampsh', () => new THREE.MeshStandardMaterial({ color: '#F4EBDD', roughness: 1, side: THREE.DoubleSide, emissive: '#3a2a12' }))); sh.position.set(lx, ly + .26, .2); sg.add(sh);
    light(p, lx, ly + .28, .25, '#FFC98C', .35, 2.2, 4);
    if (!flt) aoBlob(p, lx, .2, uw, .4, .4);
  });
  /* dressing table under the side window wall */
  if (o.dress === 'yes') {
    const zc = Math.min(Z - 2.6, 1.9), g = part(p, 'dress', 0, 0, zc + .5, Math.PI / 2);
    carc(g, 0, .6, 1.0, .16, .45, 0, { top: 1 }); front(g, 0, .6, 1.0, .16, .47, st, cm, { part: 'dress', hd: hdk === 'long' ? 'bar' : hdk, hf, pos: 'mid', anim: 'drawer', depth: .38 });
    bx(g, 1.04, .03, .48, -.02, .76, 0, cm);
    bx(g, .035, .6, .035, .03, 0, .4, metal(hf)); bx(g, .035, .6, .035, .935, 0, .4, metal(hf));
    const mr = cyl(g, .36, .015, .5, 1.35, .015, M_MIRROR, 'z'); mr.castShadow = false; cyl(g, .375, .01, .5, 1.35, .008, metal(hf), 'z');
    cyl(g, .19, .06, .5, .46, .7, fabricMat('#C9B9A4')); cyl(g, .025, .43, .5, .215, .7, metal(hf));
    plant(g, .9, .2, .79);
  }
  plant(p, W - .35, Z - .5);
  const size = Math.max(W, 3.0);
  return { X, Z, target: new THREE.Vector3(bc, 1.0, 1.5), size, eye: new THREE.Vector3(bc + .3, 1.6, Z - .3) };
}

/* ================================================================== camera */
const C = { az: .55, pol: 1.1, zoom: 1, t: new THREE.Vector3(1.5, 1, 1), fit: 6, tw: null, mode: 'orbit', yaw: 0, pitch: -.08, fov: 58 };
const VIEWS = { angle: [.55, 1.08], front: [0, 1.32], top: [.12, .42] };
function viewOf(n) { if (n === 'angle' && S.t === 'k' && (S.k.lay === 'U' || S.k.lay === 'galley')) return [.2, .86]; return VIEWS[n] || VIEWS.angle; }
function camPos(az, pol, dist, t) { const s = Math.sin(pol); return new THREE.Vector3(t.x + dist * s * Math.sin(az), t.y + dist * Math.cos(pol), t.z + dist * s * Math.cos(az)); }
function applyCam() {
  if (C.mode === 'eye' && info) {
    C.yaw = Math.max(-1.35, Math.min(1.35, C.yaw)); C.pitch = Math.max(-.75, Math.min(.5, C.pitch)); C.fov = Math.max(35, Math.min(75, C.fov));
    if (cam.fov !== C.fov) { cam.fov = C.fov; cam.updateProjectionMatrix(); }
    cam.position.copy(info.eye);
    const cp = Math.cos(C.pitch); cam.lookAt(info.eye.x + Math.sin(C.yaw) * cp, info.eye.y + Math.sin(C.pitch), info.eye.z - Math.cos(C.yaw) * cp);
  } else {
    if (cam.fov !== 38) { cam.fov = 38; cam.updateProjectionMatrix(); }
    C.az = Math.max(-1.2, Math.min(1.2, C.az)); C.pol = Math.max(.32, Math.min(1.48, C.pol)); C.zoom = Math.max(.45, Math.min(1.8, C.zoom));
    cam.position.copy(camPos(C.az, C.pol, C.fit * C.zoom, C.t)); cam.lookAt(C.t);
  }
  cutaway();
}
function cutaway() {
  const c = G && G.userData.cut; if (!c) return;
  const eye = C.mode === 'eye', hr = !eye && C.az > .1, hl = !eye && C.az < -.1;
  c.R.forEach(m => m.visible = !hr); c.Rs.forEach(m => m.visible = hr);
  c.L.forEach(m => m.visible = !hl); c.Ls.forEach(m => m.visible = hl);
}
function fitDist(size) {
  const a = cam.aspect, vf = THREE.MathUtils.degToRad(38), hf = 2 * Math.atan(Math.tan(vf / 2) * a);
  return Math.max(size * .55 / Math.tan(hf / 2), size * .42 / Math.tan(vf / 2)) + 1.0;
}
let info = null;
function frame(resetView) {
  if (!info) return;
  C.fit = fitDist(info.size);
  if (resetView && C.mode !== 'eye') { const v = viewOf(S.view || 'angle'); C.az = v[0]; C.pol = v[1]; C.zoom = 1; }
  C.t.copy(info.target);
  applyCam();
  sun.position.set(info.X * .5 - 3.5, 6.5, info.Z + 3.5); sun.target.position.set(info.X / 2, 0, info.Z / 2.4);
  const sc = sun.shadow.camera, ext = Math.max(info.X, info.Z) * .85 + 1; sc.left = -ext; sc.right = ext; sc.top = ext; sc.bottom = -ext; sc.near = .5; sc.far = 25; sc.updateProjectionMatrix();
}
function setView(view) {
  const was = C.mode; S.view = view;
  root.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', b.dataset.view === view));
  if (view === 'eye') {
    fade(() => { C.mode = 'eye'; C.yaw = 0; C.pitch = -.2; C.fov = 60; C.tw = null; applyCam(); }); ev('eye'); UI.hint(); return;
  }
  const go = () => {
    C.mode = 'orbit'; const v = viewOf(view), from = [C.az, C.pol, C.zoom], t0 = performance.now();
    C.tw = now => { const k = Math.min(1, (now - t0) / 650), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; C.az = from[0] + (v[0] - from[0]) * e; C.pol = from[1] + (v[1] - from[1]) * e; C.zoom = from[2] + (1 - from[2]) * e; applyCam(); return k < 1; };
    req();
  };
  if (was === 'eye') fade(() => { C.mode = 'orbit'; applyCam(); go(); }); else go();
  UI.hint();
}
function fade(fn) { cv.style.opacity = '0'; setTimeout(() => { fn(); R.render(scene, cam); cv.style.opacity = '1'; }, 200); }
function spin() { if (C.mode === 'eye') return; const v = viewOf(S.view || 'angle'), t0 = performance.now(), a0 = v[0] - .45; C.tw = now => { const k = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - k, 3); C.az = a0 + (v[0] - a0) * e; C.pol = v[1]; C.zoom = 1; applyCam(); return k < 1; }; req(); }

/* ================================================================== lighting mood */
function mood() {
  scene.environment = EVE ? ENV.eve : ENV.day;
  scene.background.set(EVE ? '#15171a' : '#E9E3D8');
  hemi.intensity = EVE ? .07 : .55; hemi.color.set(EVE ? '#9fb3d9' : '#fffaf2');
  sun.intensity = EVE ? .14 : 1.55; sun.color.set(EVE ? '#9fb3d9' : '#fff3e3');
  R.toneMappingExposure = EVE ? 1.25 : 1.02;
  LIGHTS.forEach(l => { l.intensity = l.userData.base * (EVE ? l.userData.eve : 1); });
  if (MT.skyM) { MT.skyM.map = skyTex(EVE); MT.skyM.needsUpdate = true; }
  if (MT.glowM) MT.glowM.opacity = EVE ? .9 : .55;
  if (MT.lampsh) MT.lampsh.emissive.set(EVE ? '#8a5a20' : '#3a2a12');
  const b = $('d3-mood'); if (b) { b.setAttribute('aria-pressed', EVE); b.setAttribute('aria-label', EVE ? 'Switch to daylight' : 'Switch to evening lighting'); b.title = EVE ? 'Daylight' : 'Evening'; }
  stage.classList.toggle('d3-eve', EVE);
  req();
}

/* ================================================================== build + render loop */
let need = false, raf = 0, lastT = 0, slow = 0, lastT0 = null;
function req() { need = true; if (!raf) raf = requestAnimationFrame(tick); }
function tick(now) {
  raf = 0; const dt = lastT ? Math.min(200, now - lastT) : 16; lastT = now;
  let more = false;
  if (C.tw) { if (C.tw(now)) more = true; else C.tw = null; }
  for (const g of ANIMS) { const a = g.userData.anim; if (a.v !== a.t) { const d = a.t - a.v, st = dt / 480; a.v = Math.abs(d) <= st ? a.t : a.v + Math.sign(d) * st; applyAnim(g); more = true; } }
  if (need || more) { R.render(scene, cam); need = false; }
  if (more || ptrs.size) { if (dt > 50) slow++; else slow = Math.max(0, slow - .5); if (slow > 10 && PR > 1) { PR = Math.max(1, PR - .35); R.setPixelRatio(PR); resize(); slow = 0; } }
  if (more) raf = requestAnimationFrame(tick); else lastT = 0;
}
function rebuild(resetView) {
  if (G) { scene.remove(G); G.traverse(o => { if (o.isInstancedMesh) o.dispose(); if (o.geometry && o.geometry !== BOX && o.geometry !== CYL && o.geometry !== SPH && !Object.values(GEO).includes(o.geometry)) o.geometry.dispose(); }); }
  ANIMS = []; LIGHTS = [];
  G = new THREE.Group(); scene.add(G);
  info = S.t === 'k' ? kitchen(G) : S.t === 'w' ? wardrobe(G) : S.t === 'm' ? media(G) : bedroom(G);
  const typeChanged = lastT0 !== S.t; lastT0 = S.t;
  frame(resetView || typeChanged);
  mood(); remember();
}
let pend = 0;
function soon() { if (pend) return; pend = requestAnimationFrame(() => { pend = 0; rebuild(false); }); }
function resize() {
  const r = stage.getBoundingClientRect(); if (!r.width || !r.height) return;
  R.setSize(r.width, r.height, false); cam.aspect = r.width / r.height; cam.updateProjectionMatrix();
  if (info) { C.fit = fitDist(info.size); applyCam(); } req();
}
new ResizeObserver(resize).observe(stage);

/* ================================================================== pointer: drag to look, tap to change */
const ptrs = new Map(); let pinch0 = 0, hintGone = false, down = null;
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function hideHint() { if (hintGone) return; hintGone = true; UI.hint(true); ev('rotate'); }
cv.addEventListener('pointerdown', e => {
  cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  down = ptrs.size === 1 ? { x: e.clientX, y: e.clientY, t: performance.now() } : null;
  if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = Math.hypot(a[0] - b[0], a[1] - b[1]); }
  C.tw = null;
});
cv.addEventListener('pointermove', e => {
  if (!ptrs.has(e.pointerId)) return;
  const prev = ptrs.get(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 7) { down = null; UI.pop(null); }
  if (down) return;
  if (ptrs.size === 1) {
    if (C.mode === 'eye') { C.yaw -= (e.clientX - prev[0]) * .0042; C.pitch += (e.clientY - prev[1]) * .0036; }
    else { C.az -= (e.clientX - prev[0]) * .0065; C.pol -= (e.clientY - prev[1]) * .0055; }
    hideHint();
  } else if (ptrs.size === 2) { const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch0) { if (C.mode === 'eye') C.fov *= pinch0 / d; else C.zoom *= pinch0 / d; } pinch0 = d; hideHint(); }
  applyCam(); req();
});
const up = e => {
  const wasTap = down && ptrs.size === 1 && performance.now() - down.t < 600 && e.type === 'pointerup';
  ptrs.delete(e.pointerId); pinch0 = 0;
  if (wasTap) tap(e.clientX, e.clientY);
  down = null;
};
cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
cv.addEventListener('wheel', e => { e.preventDefault(); const k = 1 + Math.max(-.2, Math.min(.2, e.deltaY * .0012)); if (C.mode === 'eye') C.fov *= k; else C.zoom *= k; applyCam(); req(); hideHint(); UI.pop(null); }, { passive: false });
cv.addEventListener('keydown', e => {
  const k = e.key; if (k === 'Escape') { UI.pop(null); return; } if (!/Arrow|^[+-]$/.test(k)) return; e.preventDefault();
  if (C.mode === 'eye') { if (k === 'ArrowLeft') C.yaw -= .08; if (k === 'ArrowRight') C.yaw += .08; if (k === 'ArrowUp') C.pitch += .06; if (k === 'ArrowDown') C.pitch -= .06; if (k === '+') C.fov *= .9; if (k === '-') C.fov *= 1.1; }
  else { if (k === 'ArrowLeft') C.az += .08; if (k === 'ArrowRight') C.az -= .08; if (k === 'ArrowUp') C.pol -= .06; if (k === 'ArrowDown') C.pol += .06; if (k === '+') C.zoom *= .9; if (k === '-') C.zoom *= 1.1; }
  applyCam(); req(); hideHint();
});
function shown(o) { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; }
function tap(x, y) {
  const r = cv.getBoundingClientRect(); ndc.set((x - r.left) / r.width * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, cam);
  const hit = ray.intersectObject(G, true).find(h => shown(h.object) && h.object.material !== M_AO && !(h.object.material && h.object.material.alphaMap));
  if (!hit) { UI.pop(null); return; }
  let pt = null, mover = null;
  for (let q = hit.object; q && q !== G; q = q.parent) { if (!pt && q.userData.part) pt = q.userData.part; if (!mover && q.userData.anim) mover = q; }
  if (mover) { const a = mover.userData.anim; a.t = a.t > .5 ? 0 : 1; req(); }
  if (pt) { UI.pop(pt, x - r.left, y - r.top); ev('tap'); } else UI.pop(null);
}
function setDoors(open) { ANIMS.forEach(g => { if (g.userData.wdoor) { g.userData.anim.t = open ? 1 : 0; } if (g.userData.slider) g.visible = !open; }); req(); }

root.addEventListener('click', e => {
  const b = e.target.closest('[data-view],[data-zoom],#d3-snap,#d3-share,#d3-mood,#d3-pop-x,[data-share]'); if (!b) return;
  if (b.dataset.view) setView(b.dataset.view);
  else if (b.dataset.zoom) { const k = b.dataset.zoom === '1' ? .85 : 1.18; if (C.mode === 'eye') C.fov *= k; else C.zoom *= k; applyCam(); req(); }
  else if (b.id === 'd3-snap') snap();
  else if (b.id === 'd3-mood') { EVE = !EVE; mood(); ev(EVE ? 'evening' : 'daylight'); }
  else if (b.id === 'd3-share') share();
  else if (b.id === 'd3-pop-x') UI.pop(null);
  else if (b.dataset.share === 'copy') { const u = link(); try { navigator.clipboard.writeText(u).then(() => UI.toast('Link copied. Paste it into a message to send it.')); } catch (er) { UI.toast(u); } }
});
function share() {
  const u = link(), txt = 'Have a look at the ' + NAME[S.t] + ' I designed on the ABJ Kitchens & Bedrooms website:';
  ev('share');
  if (navigator.share && small) { navigator.share({ title: 'My ABJ ' + NAME[S.t] + ' design', text: txt, url: u }).catch(() => {}); return; }
  UI.pop('share');
}
function snap() {
  R.render(scene, cam);
  const a = document.createElement('a'); a.href = cv.toDataURL('image/jpeg', .92); a.download = 'abj-my-' + NAME[S.t].replace(' ', '-') + '-design.jpg';
  document.body.appendChild(a); a.click(); a.remove(); ev('save_picture');
}

UI.onChange = k => { if (k === 'lay' || k === 'isl' || k === 'preset') rebuild(true); else soon(); if (k === 'preset') spin(); };
UI.onType = () => { UI.pop(null); if (C.mode === 'eye') { C.mode = 'orbit'; S.view = 'angle'; root.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', b.dataset.view === 'angle')); } rebuild(true); };
UI.onReset = () => rebuild(true);
UI.onTab = (prev) => { if (S.t === 'w' && (prev === 4 || S.tab === 4)) setDoors(S.tab === 4); };
UI.link = link;
rebuild(true); resize();
if (/d3debug/.test(location.search)) window.__d3 = { R, scene, cam, S: () => S, info: () => info };
load.style.display = 'none';
UI.all();
if (fromLink) setTimeout(() => UI.toast('You are looking at a shared design. Change anything you like.'), 600);

/* ================================================================== UI */
function setupUI() {
  const E = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const api = { onChange() {}, onType() {}, onReset() {}, onTab() {}, link: () => location.href };
  let popPart = null, popXY = [0, 0];
  const own = k => k in S.room ? S.room : S[S.t];
  const chips = (lab, k, map, cur, dis) => { let h = '<div class="dz-fl"><span>' + lab + '</span><div class="dz-ch" role="group" aria-label="' + lab + '">'; for (const v in map) h += '<button type="button" data-k="' + k + '" data-v="' + v + '" aria-pressed="' + (cur === v) + '"' + (dis && dis(v) ? ' disabled' : '') + '>' + map[v] + '</button>'; return h + '</div></div>'; };
  const sws = (lab, k, map, cur, extra) => { let h = '<div class="dz-fl"><span>' + lab + ' <output>' + (map[cur] ? map[cur][0] : extra && extra[cur] ? extra[cur][0] : '') + '</output></span><div class="dz-sw" role="group" aria-label="' + lab + '">'; const all = Object.assign({}, extra || {}, map); for (const v in all) h += '<button type="button" data-k="' + k + '" data-v="' + v + '" aria-pressed="' + (cur === v) + '" aria-label="' + all[v][0] + '" title="' + all[v][0] + '" style="background:' + all[v][1] + '"></button>'; return h + '</div></div>'; };
  const rng = (lab, k, min, max, step, cur, unit, pre) => { const id = (pre || 'd3-') + k; return '<div class="dz-fl"><label for="' + id + '">' + lab + ' <output id="' + id + 'o">' + cur + ' ' + unit + '</output></label><input type="range" id="' + id + '" data-k="' + k + '" data-u="' + unit + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + cur + '"></div>'; };
  const hint = t => '<p class="dz-hint">' + t + '</p>';
  const WOOD_BG = { oak: 'linear-gradient(100deg,#c79f70,#b3895c 40%,#cfa878 60%,#ad8457)', walnut: 'linear-gradient(100deg,#76503a,#5f402c 45%,#7c5640 60%,#583b29)' };
  const COLS = () => { const m = {}; for (const k in COL) m[k] = [COL[k][0], WOOD_BG[k] || COL[k][1]]; return m; };
  const TOPS = { quartzw: ['White quartz', 'linear-gradient(135deg,#f3f1ec 40%,#c9c9cf 42%,#f3f1ec 46%)'], calacatta: ['Calacatta gold quartz', 'linear-gradient(135deg,#f3f0ea 38%,#b08a48 41%,#d6d3cf 44%,#f3f0ea 48%)'], quartzb: ['Black quartz', 'radial-gradient(#555 1px,transparent 1.5px) 0 0/6px 6px,#1e1f21'], oak: ['Solid oak', 'linear-gradient(90deg,#c39566,#a97b4f 50%,#c99c6c)'], concrete: ['Concrete grey', 'radial-gradient(#7a7874 1px,transparent 2px) 0 0/7px 7px,#8e8c88'] };
  const FLOORS = { oak: ['Natural oak', 'repeating-linear-gradient(0deg,#c49a6c 0 9px,#b58a5d 9px 10px)'], greyoak: ['Grey oak', 'repeating-linear-gradient(0deg,#a39b90 0 9px,#958d82 9px 10px)'], herring: ['Oak chevron', 'repeating-linear-gradient(45deg,#c79f70 0 6px,#b3895c 6px 7px)'], tile: ['Grey porcelain', 'linear-gradient(#7d7b77,#7d7b77) 50% 0/2px 100% no-repeat,linear-gradient(#7d7b77,#7d7b77) 0 50%/100% 2px no-repeat,#9c9a96'], stone: ['Limestone', 'linear-gradient(#c4b8a3,#c4b8a3) 50% 0/2px 100% no-repeat,#dcd0bc'] };
  const WALLS = () => { const m = {}; for (const k in WALLC) m[k] = WALLC[k]; return m; };
  const isl = () => S.k.isl !== 'none' && S.k.lay !== 'galley';
  /* fields per thing you can tap; also used by the side panel */
  const F = {
    col: () => sws(S.t === 'k' ? 'Cupboard colour' : S.t === 'm' ? (S.m.fin === 'paint' ? 'Colour' : 'Cupboard colour') : 'Door colour', 'col', COLS(), S[S.t].col),
    col2: () => sws('Island colour', 'col2', COLS(), S.k.col2, { same: ['Same as cupboards', 'linear-gradient(135deg,#F3EEE6 49%,#0E1B1A 51%)'] }),
    kstyle: () => chips('Door style', 'style', L.kstyle, S.k.style), wstyle: () => chips('Door style', 'style', L.wstyle, S.w.style), bstyle: () => chips('Door style', 'style', L.bstyle, S.b.style),
    top: () => sws('Worktop', 'top', TOPS, S.k.top), spl: () => chips('Behind the worktop', 'spl', L.spl, S.k.spl),
    khd: () => S.k.style === 'handleless' ? hint('Handleless doors open from a recessed rail, so no handles. Pick the rail and tap finish.') + sws('Rail and tap finish', 'hf', HF, S.k.hf) : chips('Handle', 'hd', L.khd, S.k.hd) + sws('Handle and tap finish', 'hf', HF, S.k.hf),
    whd: () => { const o = S[S.t]; if (S.t === 'w' && o.open === 'sliding') return hint('Sliding doors need no handles.') + sws('Track and frame finish', 'hf', HF, o.hf); if (o.style === 'handleless') return hint('Handleless doors need no handles. Choose another door style to add them.'); return chips('Handle', 'hd', L.whd, o.hd) + (o.hd === 'none' ? '' : sws('Handle finish', 'hf', HF, o.hf)); },
    floor: () => sws('Floor', 'floor', FLOORS, S.room.floor), wall: () => sws('Wall colour', 'wallc', WALLS(), S.room.wallc),
    win: () => S.t === 'k' ? chips('Window', 'kwin', L.kwin, S.room.kwin) : chips('Window', 'swin', L.swin, S.room.swin),
    ceil: pre => rng('Ceiling height', 'ceil', 230, 300, 5, S.room.ceil, 'cm', pre)
  };
  const POP = {
    k: { door: ['Cupboards', () => F.col() + F.kstyle()], island: ['Island', () => F.col2()], worktop: ['Worktop', () => F.top()], splash: ['Behind the worktop', () => F.spl()], handle: ['Handles and taps', () => F.khd()],
         sink: ['Sink', () => chips('Sink', 'sink', L.sink, S.k.sink)], hob: ['Hob', () => isl() ? chips('Hob', 'hob', L.hob, S.k.hob) : hint('Your hob sits on the worktop.')], hood: ['Extractor', () => chips('Extractor', 'ext', L.ext, S.k.ext)],
         pend: ['Pendant lights', () => chips('Pendant lights', 'pend', L.yn, S.k.pend) + sws('Finish', 'hf', HF, S.k.hf)], stools: ['Bar stools', () => chips('Bar stools', 'stools', L.yn, S.k.stools)], shelf: ['Above the worktop', () => chips('Above the worktop', 'wall', L.wall, S.k.wall) + chips('LED lights', 'led', L.onoff, S.k.led)], oven: ['Tall units', () => chips('Tall units', 'tall', L.tall, S.k.tall)] },
    w: { door: ['Doors', () => F.col() + F.wstyle()], handle: ['Handles', () => F.whd()], shelf: ['Open shelves', () => chips('Open shelves', 'shelf', L.shelf, S.w.shelf) + chips('LED lighting', 'led', L.onoff, S.w.led)], inside: ['Inside', () => hint('Plan what goes in each section.') + '<button type="button" class="d3-pbtn" data-tab="4">Plan the inside</button>'], bench: ['Room', () => F.floor() + F.wall()] },
    m: { panel: ['Centre panel', () => chips('Centre panel', 'fin', L.mfin, S.m.fin) + (S.m.fin === 'paint' ? F.col() : '')], side: ['Either side of the TV', () => chips('Either side of the TV', 'side', L.side, S.m.side)], base: ['Below the TV', () => chips('Below the TV', 'base', L.base, S.m.base) + F.col()],
         tv: ['TV', pre => rng('TV size', 'tv', 43, 85, 1, S.m.tv, 'inch', pre) + chips('Fire', 'fire', L.fire, S.m.fire)], fire: ['Fire', () => chips('Fire', 'fire', L.fire, S.m.fire)], decor: ['Room', () => F.floor() + F.wall()] },
    b: { door: ['Wardrobe doors', () => F.col() + F.bstyle()], handle: ['Handles', () => F.whd()], head: ['Headboard', () => chips('Headboard', 'head', L.head, S.b.head) + F.col()], bed: ['Bed', () => chips('Bed size', 'bed', L.bed, S.b.bed) + chips('Headboard', 'head', L.head, S.b.head)],
         bside: ['Bedside units', () => chips('Bedside units', 'bside', L.bside, S.b.bside)], bridge: ['Over the bed', () => chips('Bridge units over the bed', 'bridge', L.yn, S.b.bridge, () => S.b.wards === 'none') + chips('LED lighting', 'led', L.onoff, S.b.led)], dress: ['Dressing table', () => chips('Dressing table', 'dress', L.yn, S.b.dress)], inside: ['Wardrobes', () => chips('Wardrobes', 'wards', L.bwards, S.b.wards)] }
  };
  const COMMON = { floor: ['Floor', () => F.floor()], wall: ['Walls', pre => F.wall() + F.ceil(pre)], window: ['Window', () => F.win()], plant: ['Room', () => F.floor() + F.wall()] };
  function panel() {
    const t = S.t, o = S[t], i = S.tab; let h = '';
    if (TABS[t][i] === 'Room') h = F.floor() + F.wall() + F.ceil() + F.win() + hint('Floor and walls are just to set the scene. They are not part of the quote.');
    else if (t === 'k') {
      if (i === 0) h = chips('Layout', 'lay', L.lay, o.lay) + chips('Island', 'isl', L.isl, o.lay === 'galley' ? 'none' : o.isl, v => o.lay === 'galley' && v !== 'none')
        + rng(o.lay === 'galley' ? 'Length of each run' : 'Main wall', 'A', 200, 600, 10, o.A, 'cm') + (o.lay === 'L' || o.lay === 'U' ? rng('Side wall', 'B', 180, 450, 10, o.B, 'cm') : '')
        + hint('Rough sizes are fine. Our surveyor measures everything at your free design visit.');
      if (i === 1) h = F.kstyle() + chips('Finish', 'fin', L.fin, o.fin, v => v === 'gloss' && (o.style === 'shaker' || o.style === 'inframe')) + chips('Tall units', 'tall', L.tall, o.tall) + chips('Above the worktop', 'wall', L.wall, o.wall);
      if (i === 2) h = F.col() + (isl() ? F.col2() : '') + hint('A guide to the look. The surveyor brings real door samples and swatches to your visit.');
      if (i === 3) h = F.top() + F.spl();
      if (i === 4) h = F.khd();
      if (i === 5) { const il = isl(); h = chips('Sink', 'sink', L.sink, o.sink) + (il ? chips('Hob', 'hob', L.hob, o.hob) : '') + ((!il || o.hob === 'run') ? chips('Extractor', 'ext', L.ext, o.ext) : '') + (il ? chips('Pendant lights', 'pend', L.yn, o.pend) + chips('Bar stools', 'stools', L.yn, o.stools) : '') + chips('LED lights under cupboards', 'led', L.onoff, o.led); }
    } else if (t === 'w') {
      if (i === 0) h = rng('Width', 'W', 100, 450, 5, o.W, 'cm') + rng('Height', 'H', 200, 300, 5, o.H, 'cm') + hint('Not sure of the sizes? A rough guess is fine. Our surveyor measures everything at the visit.');
      if (i === 1) h = chips('How the doors open', 'open', L.open, o.open) + F.wstyle() + chips('Open shelves', 'shelf', L.shelf, o.shelf);
      if (i === 2) h = F.col() + hint('A guide to the look. At your visit the surveyor brings real swatches so you can see the colours in your own light.');
      if (i === 3) h = F.whd();
      if (i === 4) { const nb = wbays(o); h = hint('The doors are open so you can plan the inside. Choose what goes in each section, left to right.'); for (let b = 0; b < nb; b++) h += chips('Section ' + (b + 1), 'bay' + b, L.bay, o.bays[b % o.bays.length]); h += chips('LED lighting', 'led', L.onoff, o.led); }
    } else if (t === 'm') {
      if (i === 0) h = rng('Width', 'W', 180, 450, 5, o.W, 'cm') + rng('Height', 'H', 200, 300, 5, o.H, 'cm') + hint('Most media walls run the full width of the wall. A rough guess is fine for now.');
      if (i === 1) h = rng('TV size', 'tv', 43, 85, 1, o.tv, 'inch') + chips('Fire', 'fire', L.fire, o.fire) + hint('We build the wall around your TV and our fitters hang it for you.');
      if (i === 2) h = chips('Either side of the TV', 'side', L.side, o.side) + chips('Below the TV', 'base', L.base, o.base);
      if (i === 3) h = chips('Centre panel', 'fin', L.mfin, o.fin) + F.col() + chips('LED lighting', 'led', L.onoff, o.led);
    } else {
      if (i === 0) h = rng('Width of the wall', 'W', 300, 550, 10, o.W, 'cm') + chips('Bed size', 'bed', L.bed, o.bed) + hint('Measure the wall behind the bed. A rough guess is fine, our surveyor measures everything.');
      if (i === 1) h = chips('Headboard', 'head', L.head, o.head) + chips('Bedside units', 'bside', L.bside, o.bside);
      if (i === 2) h = chips('Wardrobes', 'wards', L.bwards, o.wards) + chips('Bridge units over the bed', 'bridge', L.yn, o.wards === 'none' ? 'no' : o.bridge, () => o.wards === 'none') + chips('Dressing table', 'dress', L.yn, o.dress) + chips('LED lighting', 'led', L.onoff, o.led);
      if (i === 3) h = F.bstyle() + F.col() + F.whd();
    }
    $('d3-pan').innerHTML = h;
  }
  function tabs() { let h = ''; TABS[S.t].forEach((t, i) => { h += '<button type="button" role="tab" data-tab="' + i + '" aria-selected="' + (S.tab === i) + '">' + t + '</button>'; }); const tb = $('d3-tabs'); tb.innerHTML = h; const fit = () => tb.classList.toggle('d3-more', tb.scrollWidth > tb.clientWidth + 2 && tb.scrollLeft + tb.clientWidth < tb.scrollWidth - 4); fit(); if (!tb.dataset.f) { tb.dataset.f = 1; tb.addEventListener('scroll', fit, { passive: true }); addEventListener('resize', fit); } }
  function insp() { const el = $('d3-insp'); if (!el) return; let h = '<span>Inspire me</span><div>'; PRESETS[S.t].forEach((p, i) => { h += '<button type="button" data-preset="' + i + '"><i style="background:' + p[1] + '"></i>' + p[0] + '</button>'; }); el.innerHTML = h + '</div>'; const d = el.lastChild, fit = () => d.classList.toggle('d3-more', d.scrollLeft + d.clientWidth < d.scrollWidth - 4); fit(); d.addEventListener('scroll', fit, { passive: true }); }
  function popRender() {
    const el = $('d3-pop'); if (!el) return;
    if (!popPart) { el.hidden = true; return; }
    let title = '', body = '';
    if (popPart === 'share') {
      const u = api.link(), wa = 'https://wa.me/?text=' + encodeURIComponent('Have a look at the ' + NAME[S.t] + ' I designed on the ABJ Kitchens & Bedrooms website: ' + u);
      title = 'Share your design'; body = '<p class="dz-hint">Send this link and they will see exactly what you designed, in 3D.</p><a class="d3-pbtn" data-share="wa" target="_blank" rel="noopener" href="' + E(wa) + '">Send on WhatsApp</a><button type="button" class="d3-pbtn d3-pbtn2" data-share="copy">Copy link</button>';
    } else {
      const d = (POP[S.t] && POP[S.t][popPart]) || COMMON[popPart]; if (!d) { popPart = null; el.hidden = true; return; }
      title = d[0]; body = d[1]('d3p-');
    }
    $('d3-pop-t').textContent = title; $('d3-popb').innerHTML = body; el.hidden = false;
    const sr = stage.getBoundingClientRect();
    if (small || sr.width < 600) { el.style.left = el.style.top = ''; el.classList.add('d3-dock'); }
    else { el.classList.remove('d3-dock'); const pw = 300, ph = Math.min(el.offsetHeight || 220, sr.height - 20); el.style.left = Math.max(10, Math.min(popXY[0] + 14, sr.width - pw - 10)) + 'px'; el.style.top = Math.max(56, Math.min(popXY[1] - 20, sr.height - ph - 10)) + 'px'; }
  }
  let popAt = 0;
  api.pop = (p, x, y) => { if (p && p !== popPart) popAt = performance.now(); popPart = p; if (x != null) popXY = [x, y]; popRender(); };
  api.toast = (msg) => { const t = $('d3-toast'); if (!t) return; t.textContent = msg; t.hidden = false; clearTimeout(api._tt); api._tt = setTimeout(() => { t.hidden = true; }, 4200); };
  let hintGoneUI = false;
  api.hint = (gone) => { if (gone) hintGoneUI = true; const h = $('d3-hint'); if (!h) return; h.textContent = hintGoneUI ? '3D illustration' : S.view === 'eye' ? 'Drag to look around' : (small ? 'Drag to turn, tap to change' : 'Drag to turn the room, tap anything to change it'); };
  function summary() {
    const lc = s => s.toLowerCase();
    const room = ' Room shown with ' + lc(FLOOR[S.room.floor][0]) + ' floor and ' + lc(WALLC[S.room.wallc][0]) + ' walls, ' + S.room.ceil + ' cm ceiling.';
    if (S.t === 'k') {
      const o = S.k, il = isl();
      return lc(L.lay[o.lay]).replace(/^./, c => c.toUpperCase()) + ' kitchen' + (il ? (o.isl === 'waterfall' ? ' with a waterfall island' : ' with an island') : '') + ', about ' + o.A + ' cm' + (o.lay === 'L' || o.lay === 'U' ? ' by ' + o.B + ' cm' : '')
        + '. ' + L.kstyle[o.style] + ' doors in ' + lc(COL[o.col][0]) + (o.fin === 'gloss' && (o.style === 'handleless' || o.style === 'flat') ? ' gloss' : '') + (il && o.col2 !== 'same' ? ', island in ' + lc(COL[o.col2][0]) : '')
        + '. ' + TOP[o.top][0] + ' worktop, ' + lc(L.spl[o.spl]) + '. ' + (o.style === 'handleless' ? HF[o.hf][0] + ' rail' : HF[o.hf][0] + ' ' + lc(L.khd[o.hd]) + ' handles')
        + '. Tall units: ' + lc(L.tall[o.tall]) + '. Above the worktop: ' + lc(L.wall[o.wall]) + '. ' + L.sink[o.sink] + ' sink' + (il ? ', hob ' + lc(L.hob[o.hob]) : '') + ((!il || o.hob === 'run') ? ', ' + lc(L.ext[o.ext]) : '')
        + (il ? (o.pend === 'yes' ? ', pendant lights' : '') + (o.stools === 'yes' ? ', bar stools' : '') : '') + ', LED under cupboards ' + o.led + '.' + room;
    }
    if (S.t === 'w') {
      const o = S.w, nb = wbays(o), ins = []; for (let b = 0; b < nb; b++) ins.push(lc(L.bay[o.bays[b % o.bays.length]]));
      return 'Fitted wardrobe, ' + o.W + ' cm wide by ' + o.H + ' cm high, ' + lc(L.open[o.open]) + ' ' + lc(L.wstyle[o.style]) + ' doors in ' + lc(COL[o.col][0])
        + (o.open === 'hinged' && o.style !== 'handleless' && o.hd !== 'none' ? ', ' + lc(HF[o.hf][0]) + ' ' + lc(L.whd[o.hd]) + ' handles' : '') + (o.shelf === 'none' ? '' : ', open shelves on the ' + o.shelf)
        + '. Inside, left to right: ' + ins.join(', ') + '. LED lighting ' + o.led + '.' + room;
    }
    if (S.t === 'm') {
      const m = S.m;
      return 'Media wall, ' + m.W + ' cm wide by ' + m.H + ' cm high, for a ' + m.tv + ' inch TV, ' + (m.fire === 'yes' ? 'with an electric fire' : 'no fire') + ', ' + lc(L.side[m.side]) + ' at the sides, '
        + (m.base === 'none' ? 'no unit below' : lc(L.base[m.base])) + ', ' + lc(L.mfin[m.fin]) + ' centre panel' + (m.fin === 'paint' ? ' in ' + lc(COL[m.col][0]) : ', cupboards in ' + lc(COL[m.col][0])) + ', LED lighting ' + m.led + '.' + room;
    }
    const b = S.b;
    return 'Fitted bedroom on a ' + b.W + ' cm wall: ' + lc(L.bed[b.bed]) + ' bed' + (b.head === 'none' ? '' : ' with a ' + lc(L.head[b.head]) + ' headboard') + ', '
      + (b.wards === 'none' ? 'no wardrobes' : 'wardrobes ' + (b.wards === 'both' ? 'either side of the bed' : 'on one side')) + (b.wards !== 'none' && b.bridge === 'yes' ? ' with bridge units over the bed' : '')
      + ', ' + (b.bside === 'none' ? 'no bedside units' : lc(L.bside[b.bside]) + ' bedside units') + (b.dress === 'yes' ? ', dressing table' : '') + '. ' + L.bstyle[b.style] + ' doors in ' + lc(COL[b.col][0])
      + (b.style !== 'handleless' && b.hd !== 'none' ? ', ' + lc(HF[b.hf][0]) + ' ' + lc(L.whd[b.hd]) + ' handles' : '') + ', LED lighting ' + b.led + '.' + room;
  }
  function text(say) {
    const sm = summary(); $('d3-sum').innerHTML = '<b>Your design:</b> ' + E(sm); if (say) $('d3-live').textContent = sm;
    const c = $('d3-cv'); if (c) c.setAttribute('aria-label', '3D view of your design: ' + sm + ' Drag, or use the arrow keys, to look around.');
  }
  api.all = say => {
    root.querySelectorAll('.dz-seg button').forEach(x => x.setAttribute('aria-pressed', x.dataset.t === S.t));
    insp(); tabs(); panel(); text(say); api.hint();
  };
  api.summary = summary;
  const r = root;
  const after = (k, from) => {
    panel(); text(1); popRender();
    const box = from && from.closest('#d3-pop') ? $('d3-popb') : $('d3-pan');
    const f = box && box.querySelector('[data-k="' + k + '"][aria-pressed="true"]'); f && f.focus({ preventScroll: true });
  };
  r.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || b.closest('.d3-bar') || b.closest('.d3-foot')) return;
    if (b.closest('#d3-pop') && performance.now() - popAt < 450) return;
    if (b.dataset.t) { if (b.dataset.t === S.t) return; S.t = b.dataset.t; S.tab = 0; api.all(1); api.onType(); ev('type'); return; }
    if (b.dataset.tab) { const prev = S.tab; S.tab = +b.dataset.tab; tabs(); panel(); api.onTab(prev); if (b.closest('#d3-pop')) { popPart = null; popRender(); } return; }
    if (b.dataset.preset != null) { const p = PRESETS[S.t][+b.dataset.preset]; if (!p) return; Object.assign(S[S.t], copy(p[2])); Object.assign(S.room, p[3]); popPart = null; api.all(1); api.onChange('preset'); ev('inspire'); return; }
    if (b.id === 'd3-rs') { const t = S.t; S = copy(DEF); S.t = t; try { localStorage.removeItem('abj_d3'); } catch (er) {} api.all(1); api.onReset(); ev('reset'); return; }
    const k = b.dataset.k; if (!k || b.disabled) return; const o = own(k);
    if (k.indexOf('bay') === 0) { const nb = wbays(S.w), a = []; for (let i = 0; i < Math.max(nb, S.w.bays.length); i++) a.push(S.w.bays[i % S.w.bays.length]); a[+k.slice(3)] = b.dataset.v; S.w.bays = a.slice(0, 6); }
    else o[k] = b.dataset.v;
    if (S.t === 'k' && k === 'style' && (b.dataset.v === 'shaker' || b.dataset.v === 'inframe')) S.k.fin = 'matt';
    if (S.t === 'b' && k === 'wards' && b.dataset.v === 'none') S.b.bridge = 'no';
    after(k, b); api.onChange(k); ev('change');
  });
  r.addEventListener('input', e => {
    const x = e.target; if (x.type !== 'range') return; const k = x.dataset.k; own(k)[k] = +x.value;
    const out = $(x.id + 'o'); if (out) out.textContent = x.value + ' ' + x.dataset.u; text();
    if (x.closest('#d3-pop')) { const p = $('d3-' + k), po = $('d3-' + k + 'o'); if (p) { p.value = x.value; po.textContent = out.textContent; } }
    else { const p = $('d3p-' + k), po = $('d3p-' + k + 'o'); if (p) { p.value = x.value; po.textContent = out.textContent; } }
    api.onChange(k); ev('change');
  });
  r.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popPart) { popPart = null; popRender(); return; }
    if (!e.target.closest('#d3-tabs') || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return; const n = TABS[S.t].length, prev = S.tab; S.tab = (S.tab + (e.key === 'ArrowRight' ? 1 : n - 1)) % n; tabs(); panel(); api.onTab(prev); $('d3-tabs').querySelector('[aria-selected="true"]').focus();
  });
  $('d3-book').addEventListener('click', () => { try { sessionStorage.setItem('abj_design', summary() + ' Open my 3D design: ' + api.link()); } catch (e) {} ev('book'); });
  $('d3-wa').addEventListener('click', e => { e.currentTarget.href = 'https://wa.me/447479219421?text=' + encodeURIComponent('Hi ABJ, I designed this on your website: ' + summary() + ' Open my 3D design: ' + api.link()); ev('whatsapp'); });
  r.addEventListener('pointerdown', e => { if (popPart && !e.target.closest('#d3-pop') && !e.target.closest('#d3-cv') && !e.target.closest('#d3-share')) { popPart = null; popRender(); } });
  return api;
}
}
const sent = {};
function ev(a) {
  if (a === 'change' || a === 'rotate' || a === 'tap') { if (sent[a]) return; sent[a] = 1; }
  try { const t = document.querySelector('#d3 .dz-seg [aria-pressed="true"]'); window.gtag && gtag('event', 'room_designer_3d', { action: a, type: t ? t.textContent.toLowerCase() : '' }); } catch (e) {}
}
