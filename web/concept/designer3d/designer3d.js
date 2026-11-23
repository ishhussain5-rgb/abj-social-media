/* ABJ 3D room designer (23 Nov 2026). Kitchen, wardrobe and media wall built live in three.js.
   Markup + styles: designer3d.html (section #d3). Hands the design text to the booking form via sessionStorage 'abj_design'
   (same key the 2D designer used, read by ABJ DESIGNFILL on /bookingform). GA event: room_designer_3d. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

const $ = i => document.getElementById(i);
const root = $('d3');
if (root && !root.dataset.on) { root.dataset.on = '1'; start(); }

function start() {
/* ------------------------------------------------------------------ data */
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
  whd: { bar: 'Bar', long: 'Full length', knob: 'Knob', none: 'None' },
  shelf: { none: 'None', left: 'Left', right: 'Right' },
  bay: { hang: 'Long hanging', double: 'Double hanging', shelves: 'Shelves', drawers: 'Drawers + hanging' },
  fire: { yes: 'Electric fire', no: 'No fire' },
  side: { shelves: 'Lit shelves', slats: 'Slat panels', none: 'Clean wall' },
  base: { float: 'Floating unit', cabinets: 'Base cupboards', none: 'None' },
  mfin: { slat: 'Wood slats', paint: 'Painted', marble: 'Marble effect' }
};
const DEF = {
  t: 'k', tab: 0,
  k: { lay: 'L', isl: 'island', A: 380, B: 280, style: 'handleless', fin: 'matt', col: 'sage', col2: 'walnut', top: 'calacatta', spl: 'match',
       hd: 'bar', hf: 'brass', tall: 'ovenlarder', wall: 'shelves', sink: 'under', hob: 'island', ext: 'hood', pend: 'yes', led: 'on', stools: 'yes' },
  w: { W: 260, H: 240, open: 'hinged', style: 'shaker', col: 'sage', hd: 'bar', hf: 'brass', shelf: 'right', led: 'on', bays: ['hang', 'shelves', 'drawers', 'double', 'hang'] },
  m: { W: 340, H: 250, tv: 65, fire: 'yes', side: 'shelves', base: 'float', fin: 'slat', col: 'charcoal', led: 'on' }
};
let S = JSON.parse(JSON.stringify(DEF));
const TABS = { k: ['Layout', 'Style', 'Colours', 'Worktop', 'Handles', 'Extras'], w: ['Size', 'Doors', 'Colour', 'Handles', 'Inside'], m: ['Size', 'TV & fire', 'Layout', 'Finish'] };

/* ------------------------------------------------------------- renderer */
const cv = $('d3-cv'), stage = $('d3-stage'), load = $('d3-load');
let R;
try {
  R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' });
} catch (e) { R = null; }
const small = matchMedia('(max-width:899px)').matches;
const UI = setupUI();
if (!R) { load.innerHTML = '<span>Your browser can&#39;t show the 3D view, but your choices below still go with your enquiry.</span>'; UI.all(); return; }
R.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.6 : 2));
R.outputColorSpace = THREE.SRGBColorSpace;
R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.02;
R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); scene.background = new THREE.Color('#E9E3D8');
const cam = new THREE.PerspectiveCamera(38, 1.6, 0.05, 60);
const pm = new THREE.PMREMGenerator(R);
scene.environment = pm.fromScene(envScene(), 0.035).texture;
const hemi = new THREE.HemisphereLight('#fffaf2', '#a88d6f', 0.55); scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff3e3', 1.55); sun.castShadow = true;
sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.025;
scene.add(sun, sun.target);
let G = null;

function envScene() {
  const s = new THREE.Scene(), g = new THREE.BoxGeometry();
  const room = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: 0x8a847b }));
  room.scale.set(30, 12, 30); room.position.y = 5; s.add(room);
  const lt = (i, x, y, z, sx, sy, sz) => { const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: new THREE.Color().setScalar(i) })); m.position.set(x, y, z); m.scale.set(sx, sy, sz); s.add(m); };
  lt(7, 0, 10.8, 0, 12, .2, 10); lt(3.5, -14.8, 5, 2, .2, 5, 9); lt(2.8, 14.8, 5, -3, .2, 4, 7); lt(2.2, 0, 5, 14.8, 10, 4, .2);
  s.add(new THREE.AmbientLight(0xffffff, .5));
  return s;
}

/* -------------------------------------------------------------- textures */
const TX = {};
function rnd(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function canvasTex(key, w, h, draw, srgb = true) {
  if (TX[key]) return TX[key];
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  return TX[key] = t;
}
function shade(hex, a) { const c = new THREE.Color(hex); const h = {}; c.getHSL(h); c.setHSL(h.h, h.s, Math.max(0, Math.min(1, h.l + a))); return '#' + c.getHexString(); }
function woodTex(hex, horiz) {
  return canvasTex('w' + hex + (horiz ? 'h' : ''), 512, 512, (x, w, h) => {
    const r = rnd(7); x.fillStyle = hex; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 46; i++) { x.fillStyle = shade(hex, (r() - .5) * .08) + '55'; const px = r() * w, pw = 6 + r() * 30; x.fillRect(px, 0, pw, h); }
    for (let i = 0; i < 160; i++) {
      x.strokeStyle = (r() < .6 ? 'rgba(40,22,8,' : 'rgba(255,240,215,') + (0.04 + r() * .12) + ')'; x.lineWidth = .6 + r() * 2.2;
      let px = r() * w; x.beginPath(); x.moveTo(px, 0);
      for (let y = 0; y <= h; y += 16) { px += (r() - .5) * 2.4; x.lineTo(px + Math.sin(y / 40 + i) * 1.6, y); }
      x.stroke();
    }
    if (horiz) { const d = x.getImageData(0, 0, w, h), o = x.createImageData(w, h); for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) { const s = (xx * w + y) * 4, t = (y * w + xx) * 4; o.data[t] = d.data[s]; o.data[t + 1] = d.data[s + 1]; o.data[t + 2] = d.data[s + 2]; o.data[t + 3] = 255; } x.putImageData(o, 0, 0); }
  });
}
function floorTex() {
  return canvasTex('floor', 1024, 1024, (x, w, h) => {
    const r = rnd(3), rows = 8, rh = h / rows;
    for (let i = 0; i < rows; i++) {
      let px = -r() * 300;
      while (px < w) {
        const len = 280 + r() * 340, base = shade('#C49A6C', (r() - .5) * .1);
        x.fillStyle = base; x.fillRect(px, i * rh, len, rh);
        for (let k = 0; k < 22; k++) { x.strokeStyle = 'rgba(60,35,15,' + (0.05 + r() * .1) + ')'; x.lineWidth = .8 + r() * 1.6; const yy = i * rh + r() * rh; x.beginPath(); x.moveTo(px, yy); x.bezierCurveTo(px + len * .3, yy + (r() - .5) * 6, px + len * .6, yy + (r() - .5) * 6, px + len, yy + (r() - .5) * 4); x.stroke(); }
        x.fillStyle = 'rgba(40,25,12,.45)'; x.fillRect(px, i * rh, 2, rh);
        px += len;
      }
      x.fillStyle = 'rgba(40,25,12,.35)'; x.fillRect(0, i * rh, w, 2);
    }
  });
}
function marbleTex(key, base, vein, gold) {
  return canvasTex(key, 1024, 1024, (x, w, h) => {
    const r = rnd(11); x.fillStyle = base; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 14; i++) { const g = x.createRadialGradient(r() * w, r() * h, 0, r() * w, r() * h, 120 + r() * 260); g.addColorStop(0, 'rgba(140,140,150,.07)'); g.addColorStop(1, 'rgba(140,140,150,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); }
    const veins = (n, cw, alpha, col) => { for (let i = 0; i < n; i++) { let px = -50, py = r() * h; x.strokeStyle = col.replace('A', alpha * (0.5 + r() * .5)); x.lineWidth = cw * (0.4 + r()); x.beginPath(); x.moveTo(px, py); while (px < w + 50) { px += 18 + r() * 30; py += (r() - .5) * 46; x.lineTo(px, py); } x.stroke(); } };
    x.filter = 'blur(2px)'; veins(5, 5, .35, vein); x.filter = 'none'; veins(9, 1.4, .55, vein);
    if (gold) { x.filter = 'blur(1px)'; veins(4, 2.2, .7, 'rgba(176,138,72,A)'); x.filter = 'none'; }
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
  }, false);
}
function glowTex() {
  return canvasTex('glow', 128, 128, (x, w, h) => {
    const g = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,210,150,1)'); g.addColorStop(.45, 'rgba(255,190,120,.45)'); g.addColorStop(1, 'rgba(255,180,110,0)');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
  });
}
function screenTex() {
  return canvasTex('tv', 512, 288, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1d3448'); g.addColorStop(.55, '#d58a5a'); g.addColorStop(.62, '#2b2a35'); g.addColorStop(1, '#101218');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = 'rgba(255,214,160,.9)'; x.beginPath(); x.arc(w * .68, h * .5, 26, 0, 7); x.fill();
    x.fillStyle = '#15171d'; x.beginPath(); x.moveTo(0, h * .62); for (let i = 0; i <= 10; i++) x.lineTo(w * i / 10, h * (.56 + Math.sin(i * 1.7) * .05)); x.lineTo(w, h); x.lineTo(0, h); x.fill();
  });
}
function flameTex() {
  return canvasTex('flame', 512, 64, (x, w, h) => {
    const r = rnd(4); x.fillStyle = '#120a06'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { const px = r() * w, fh = h * (.35 + r() * .6), g = x.createLinearGradient(0, h, 0, h - fh); g.addColorStop(0, 'rgba(255,220,120,.95)'); g.addColorStop(.4, 'rgba(255,120,30,.8)'); g.addColorStop(1, 'rgba(160,30,0,0)'); x.fillStyle = g; x.beginPath(); x.ellipse(px, h, 6 + r() * 10, fh, 0, Math.PI, 2 * Math.PI); x.fill(); }
    x.fillStyle = 'rgba(255,240,220,.9)'; x.fillRect(0, h - 5, w, 5);
  });
}
function skyTex() {
  return canvasTex('sky', 256, 256, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#cfe0ea'); g.addColorStop(.65, '#eef3f2'); g.addColorStop(.66, '#a9b99a'); g.addColorStop(1, '#8fa181');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
  });
}
function rugTex() {
  return canvasTex('rug', 512, 512, (x, w, h) => {
    const r = rnd(8); x.fillStyle = '#D8CFC0'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 6000; i++) { x.fillStyle = 'rgba(' + (r() < .5 ? '120,105,90' : '250,245,235') + ',' + r() * .18 + ')'; x.fillRect(r() * w, r() * h, 2, 2); }
    x.strokeStyle = 'rgba(110,95,80,.5)'; x.lineWidth = 6; x.strokeRect(26, 26, w - 52, h - 52); x.lineWidth = 2; x.strokeRect(44, 44, w - 88, h - 88);
  });
}

/* ------------------------------------------------------------- materials */
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
const M_WALL = new THREE.MeshStandardMaterial({ color: '#ECE6DC', roughness: .95, envMapIntensity: .3 });
const M_SKIRT = new THREE.MeshStandardMaterial({ color: '#F4F1EB', roughness: .6 });
const M_DARK = new THREE.MeshStandardMaterial({ color: '#1A1A1A', roughness: .6 });
const M_GLASS = new THREE.MeshPhysicalMaterial({ color: '#0d0d0f', roughness: .05, metalness: .2, clearcoat: 1 });
const M_CERAMIC = new THREE.MeshPhysicalMaterial({ color: '#F6F5F1', roughness: .2, clearcoat: .8 });
const M_FABRIC = new THREE.MeshStandardMaterial({ color: '#B9AE9E', roughness: 1 });
const M_FABRIC2 = new THREE.MeshStandardMaterial({ color: '#6E7A6C', roughness: 1 });
const M_PLANT = new THREE.MeshStandardMaterial({ color: '#4F6B45', roughness: .9 });
const M_LED = new THREE.MeshBasicMaterial({ color: '#FFE2B5' });
const M_MIRROR = new THREE.MeshPhysicalMaterial({ color: '#E8EEF0', metalness: .7, roughness: .1, envMapIntensity: 2, clearcoat: 1, clearcoatRoughness: .05 });
const M_INSIDE = woodMat('#D2B48C');

/* ------------------------------------------------------------- geometry */
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

/* handles: drawn on a front whose face is at z = fz (local), facing +z */
function handle(p, kind, fin, cx, cy, fz, ori, len) {
  const m = metal(fin);
  if (kind === 'knob') { cyl(p, .006, .022, cx, cy, fz + .011, m, 'z'); sph(p, .013, cx, cy, fz + .026, m); return; }
  if (kind === 'cup') { bx(p, .095, .012, .028, cx - .0475, cy + .006, fz, m); bx(p, .095, .022, .004, cx - .0475, cy - .016, fz + .024, m); bx(p, .004, .034, .028, cx - .0475, cy - .016, fz, m); bx(p, .004, .034, .028, cx + .0435, cy - .016, fz, m); return; }
  const l = len || .16;
  if (ori === 'v') { cyl(p, .0058, l, cx, cy, fz + .032, m); cyl(p, .004, .032, cx, cy + l / 2 - .02, fz + .016, m, 'z'); cyl(p, .004, .032, cx, cy - l / 2 + .02, fz + .016, m, 'z'); }
  else { cyl(p, .0058, l, cx, cy, fz + .032, m, 'x'); cyl(p, .004, .032, cx + l / 2 - .02, cy, fz + .016, m, 'z'); cyl(p, .004, .032, cx - l / 2 + .02, cy, fz + .016, m, 'z'); }
}

/* one door / drawer front: rect x..x+w, y..y+h, face at z = fz (front surface), thickness t behind it */
function front(p, x, y, w, h, fz, style, m, o) {
  o = o || {}; const g = .0035, t = .019, X = x + g, Y = y + g, W = w - 2 * g, H = h - 2 * g;
  if (W <= .02 || H <= .02) return;
  if (style === 'shaker' || style === 'inframe') {
    const f = Math.min(.068, W * .2, H * .2);
    bx(p, W, H, t - .012, X, Y, fz - t, m);
    bx(p, W, f, t, X, Y + H - f, fz - t, m); bx(p, W, f, t, X, Y, fz - t, m);
    bx(p, f, H - 2 * f, t, X, Y + f, fz - t, m); bx(p, f, H - 2 * f, t, X + W - f, Y + f, fz - t, m);
  } else if (style === 'fluted') {
    const fm = mat('fl' + m.uuid, () => { const c = m.clone(); c.bumpMap = fluteTex(); c.bumpScale = 3; c.map = m.map || null; return c; });
    bx(p, W, H, t, X, Y, fz - t, fm, { s: .03 });
  } else if (style === 'mirror') {
    bx(p, W, H, t - .004, X, Y, fz - t, m);
    bx(p, W - .05, H - .05, .004, X + .025, Y + .025, fz - .004, M_MIRROR);
  } else bx(p, W, H, t, X, Y, fz - t, m);
  if (o.glass) bx(p, W * .64, H * .7, .002, X + W * .18, Y + H * .15, fz + .001, M_GLASS, { ns: 1 });
  if (o.hd && o.hd !== 'none') {
    let cx = X + W / 2, cy = Y + H / 2, ori = 'h', len = o.len;
    if (o.pos === 'top') cy = Y + H - .05; else if (o.pos === 'bottom') cy = Y + .05;
    if (o.side === 'L') { cx = X + .04; ori = 'v'; } else if (o.side === 'R') { cx = X + W - .04; ori = 'v'; }
    if (ori === 'v' && o.pos === 'top') cy = Y + H - (len || .16) / 2 - .04;
    if (ori === 'v' && o.pos === 'bottom') cy = Y + (len || .16) / 2 + .04;
    if (o.hd === 'cup' && ori === 'v') handle(p, 'knob', o.hf, cx, cy, fz, ori);
    else handle(p, o.hd, o.hf, cx, cy, fz, ori, ori === 'h' && o.hd === 'bar' ? Math.min(.32, Math.max(.12, W * .45)) : len);
  }
}

/* ------------------------------------------------------------- room shell */
function shell(p, X, Z, o) {
  const wh = o.wallH || 2.55;
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(X, Z), mat('floorM', () => new THREE.MeshStandardMaterial({ map: floorTex(), roughness: .55, envMapIntensity: .4 })));
  const ft = fl.material.map; ft.repeat.set(1, 1);
  fl.geometry.attributes.uv.array.forEach((v, i, a) => { a[i] = v * (i % 2 ? Z / 2.4 : X / 2.4); });
  fl.rotation.x = -Math.PI / 2; fl.position.set(X / 2, 0, Z / 2); fl.receiveShadow = true; p.add(fl);
  bx(p, X + .2, .08, Z + .1, -.1, -.082, 0, M_SKIRT, { ns: 1 });
  bx(p, X + .2, wh, .1, -.1, 0, -.1, M_WALL, { ns: 1 });
  bx(p, X, .1, .015, 0, 0, 0, M_SKIRT, { ns: 1 });
  /* side walls: the one between the camera and the room is cut down to a low stub (see cutaway) */
  const cut = { L: [], R: [], Ls: [], Rs: [] };
  const side = (x, sk, list, stub) => { list.push(bx(p, .1, wh, Z, x, 0, 0, M_WALL, { ns: 1 })); const s2 = bx(p, .1, .12, Z, x, 0, 0, M_WALL, { ns: 1 }); s2.visible = false; stub.push(s2); bx(p, .015, .1, Z, sk, 0, 0, M_SKIRT, { ns: 1 }); };
  if (o.left !== false) side(-.1, 0, cut.L, cut.Ls);
  if (o.right) side(X, X - .015, cut.R, cut.Rs);
  p.userData.cut = cut;
}
function windowOn(p, cx, y0, w, h) {
  const fm = paint('#F4F2EE');
  bx(p, w + .12, h + .12, .03, cx - w / 2 - .06, y0 - .06, 0, fm, { ns: 1 });
  const sk = mat('skyM', () => new THREE.MeshBasicMaterial({ map: skyTex() }));
  const pl = new THREE.Mesh(new THREE.PlaneGeometry(w, h), sk); pl.position.set(cx, y0 + h / 2, .031); p.add(pl);
  bx(p, .035, h, .02, cx - .0175, y0, .03, fm, { ns: 1 }); bx(p, w, .035, .02, cx - w / 2, y0 + h * .62, .03, fm, { ns: 1 });
  bx(p, w + .16, .03, .08, cx - w / 2 - .08, y0 - .06, 0, fm);
}
function plant(p, x, z, y) { y = y || 0; cyl(p, .1, .2, x, y + .1, z, paint('#E9E4DA')); for (let i = 0; i < 7; i++) sph(p, .09 + (i % 3) * .02, x + Math.sin(i * 2.1) * .08, y + .3 + (i % 4) * .06, z + Math.cos(i * 2.1) * .08, M_PLANT); }

/* ------------------------------------------------------------- kitchen */
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
  shell(p, X, Z, { left: true, right: lay === 'U' || lay === 'galley' });
  const lights = [];
  const unit = (R, u, cm, runInfo) => {
    const x = u.x, w = u.w;
    const isTall = u.kind.indexOf('tall') === 0;
    const plM = paint(shade(COL[o.col] ? COL[o.col][1] : '#888', -.12));
    bx(R, w, .148, .52, x, 0, .03, isTall || style !== 'handleless' ? plM : M_DARK);
    const topH = isTall ? 2.2 : TOPY;
    bx(R, w, topH - .15, .57, x, .15, .01, cm);
    const fz = .6, base = .15;
    if (style === 'inframe') { const f = .03; bx(R, w, f, .02, x, topH - f, .58, cm); bx(R, w, f, .02, x, base, .58, cm); bx(R, f, topH - base, .02, x, base, .58, cm); bx(R, f, topH - base, .02, x + w - f, base, .58, cm); }
    const ins = style === 'inframe' ? .03 : 0, fx = x + ins, fw = w - 2 * ins;
    const fst = style === 'handleless' ? 'flat' : style;
    const opt = (q) => Object.assign({ hd, hf }, q);
    if (isTall) {
      const tH = 2.2 - base - ins;
      if (u.kind === 'tall-oven') {
        front(R, fx, base + ins, fw, .55, fz, fst, cm, opt({ pos: 'top', side: null }));
        const oy = base + ins + .56;
        bx(R, fw - .02, .58, .02, fx + .01, oy, fz - .02, M_GLASS); bx(R, fw * .7, .3, .003, fx + fw * .15, oy + .12, fz, mat('ovw', () => new THREE.MeshStandardMaterial({ color: '#2a2b2e', roughness: .2 })), { ns: 1 });
        cyl(R, .008, fw * .7, fx + fw / 2, oy + .5, fz + .03, metal('steel'), 'x');
        bx(R, fw - .02, .44, .02, fx + .01, oy + .6, fz - .02, M_GLASS); cyl(R, .008, fw * .7, fx + fw / 2, oy + .98, fz + .03, metal('steel'), 'x');
        front(R, fx, oy + 1.05, fw, 2.2 - ins - (oy + 1.05), fz, fst, cm, opt({ pos: 'bottom' }));
      } else {
        const split = u.kind === 'tall-fridge' ? 1.05 : .95;
        front(R, fx, base + ins, fw, split, fz, fst, cm, opt({ side: runInfo.flip ? 'L' : 'R', pos: 'top', len: .3 }));
        front(R, fx, base + ins + split, fw, tH - split, fz, fst, cm, opt({ side: runInfo.flip ? 'L' : 'R', pos: 'bottom', len: .3 }));
      }
      if (style === 'handleless') bx(R, .02, tH, .02, runInfo.flip ? x : x + w - .02, base, .58, metal(hf === 'brass' ? 'brass' : 'black'));
      return;
    }
    const fh = (style === 'handleless' ? .685 : .72) - ins * 2;
    if (style === 'handleless') bx(R, w, .035, .025, x, base + .685, .555, metal(hf === 'brass' ? 'brass' : hf === 'chrome' ? 'steel' : 'black'), { ns: 1 });
    if (u.kind === 'filler') { bx(R, w, fh, .02, x, base, .58, cm); return; }
    if (u.kind === 'drawers' || u.kind === 'hob') {
      const hs = [.18, .27, fh - .45].map(v => v * 1);
      let yy = base + ins + fh - hs[0];
      front(R, fx, yy, fw, hs[0], fz, fst, cm, opt({ pos: 'top' })); yy -= hs[1];
      front(R, fx, yy, fw, hs[1], fz, fst, cm, opt({ pos: 'top' })); front(R, fx, base + ins, fw, hs[2], fz, fst, cm, opt({ pos: 'top' }));
      return;
    }
    let fh2 = fh, by = base + ins;
    if (u.kind === 'sink' && o.sink === 'belfast') { fh2 = fh - .24; bx(R, w - .02, .245, .55, x + .01, TOPY - .245, .08, M_CERAMIC); }
    if (fw > .62) { front(R, fx, by, fw / 2, fh2, fz, fst, cm, opt({ side: 'R', pos: 'top' })); front(R, fx + fw / 2, by, fw / 2, fh2, fz, fst, cm, opt({ side: 'L', pos: 'top' })); }
    else front(R, fx, by, fw, fh2, fz, fst, cm, opt({ side: runInfo.flip ? 'L' : 'R', pos: 'top' }));
  };
  const worktop = (R, x0, x1, depth, info) => {
    bx(R, x1 - x0, tt, depth, x0, TOPY, 0, tm, { s: 1.2 });
  };
  const sinkOn = (R, cx) => {
    const y = TOPY + tt;
    if (o.sink === 'belfast') bx(R, .5, .002, .4, cx - .25, y, .12, mat('bsin', () => new THREE.MeshStandardMaterial({ color: '#DCDAD5', roughness: .3 })), { ns: 1 });
    else { bx(R, .52, .002, .4, cx - .26, y, .12, metal('steel'), { ns: 1 }); bx(R, .46, .0025, .34, cx - .23, y, .15, mat('sinkin', () => new THREE.MeshStandardMaterial({ color: '#6d7174', metalness: .9, roughness: .35 })), { ns: 1 }); }
    const tm2 = metal(hf); cyl(R, .022, .05, cx, y + .025, .07, tm2); cyl(R, .012, .3, cx, y + .17, .07, tm2);
    const tor = new THREE.Mesh(new THREE.TorusGeometry(.09, .011, 10, 24, Math.PI), tm2); tor.position.set(cx, y + .32, .16); tor.rotation.y = Math.PI / 2; tor.castShadow = true; R.add(tor);
    cyl(R, .012, .06, cx, y + .29, .25, tm2);
  };
  const hobOn = (R, cx, cz) => {
    const y = TOPY + tt; bx(R, .58, .006, .5, cx - .29, y, cz - .25, M_GLASS, { ns: 1 });
    const rm = mat('ring', () => new THREE.MeshBasicMaterial({ color: '#3a3a3c' }));
    [[-.14, -.11], [.14, -.11], [-.14, .12], [.14, .12]].forEach(([dx, dz], i) => { const r = new THREE.Mesh(new THREE.RingGeometry(i === 1 ? .085 : .065, i === 1 ? .092 : .072, 40), rm); r.rotation.x = -Math.PI / 2; r.position.set(cx + dx, y + .0065, cz + dz); R.add(r); });
  };
  /* runs */
  const talls = { none: [], oven: ['tall-oven'], ovenlarder: ['tall-oven', 'tall-larder'], full: ['tall-fridge', 'tall-oven', 'tall-larder'] }[o.tall];
  const runs = [];
  if (lay === 'straight' || lay === 'L' || lay === 'U') {
    const sp = [{ kind: 'sink', w: o.sink === 'belfast' ? .6 : .8, at: lay === 'straight' ? .35 : .5 }];
    if (!hobOnIsland && lay === 'straight') sp.push({ kind: 'hob', w: .6, at: .78 });
    runs.push({ len: X, pos: [0, 0], rot: 0, specials: sp, talls, window: true, flip: false });
    if (lay === 'L' || lay === 'U') runs.push({ len: B - .6, pos: [0, B], rot: Math.PI / 2, specials: !hobOnIsland ? [{ kind: 'hob', w: .6, at: .45 }] : [], talls: [], flip: true });
    if (lay === 'U') runs.push({ len: B - .6, pos: [X, .6], rot: -Math.PI / 2, specials: [], talls: [], flip: false });
  } else {
    runs.push({ len: A, pos: [0, A], rot: Math.PI / 2, specials: [{ kind: 'sink', w: o.sink === 'belfast' ? .6 : .8, at: .5 }], talls: [], flip: true });
    runs.push({ len: A, pos: [X, 0], rot: -Math.PI / 2, specials: [{ kind: 'hob', w: .6, at: .55 }], talls, tallStart: true, flip: false });
  }
  if (lay === 'galley') windowOn(p, X / 2, 1.05, 1.1, 1.15);
  runs.forEach(run => {
    if (run.len < .3) return;
    const R = new THREE.Group(); R.position.set(run.pos[0], 0, run.pos[1]); R.rotation.y = run.rot; p.add(R);
    const plan = planRun(run.len, run.specials.slice(), run.talls, run.tallStart);
    const baseUnits = plan.filter(u => u.kind.indexOf('tall') < 0);
    plan.forEach(u => unit(R, u, dm, run));
    const bx0 = baseUnits.length ? Math.min(...baseUnits.map(u => u.x)) : 0, bx1 = baseUnits.length ? Math.max(...baseUnits.map(u => u.x + u.w)) : 0;
    if (bx1 > bx0) worktop(R, bx0, bx1, .62, run);
    const sk = plan.find(u => u.kind === 'sink'), hb = plan.find(u => u.kind === 'hob');
    if (sk) sinkOn(R, sk.x + sk.w / 2);
    if (hb) hobOn(R, hb.x + hb.w / 2, .32);
    const skip = [];
    if (run.window && sk) { const cx = sk.x + sk.w / 2; windowOn(R, cx, 1.12, 1.0, 1.08); skip.push([cx - .62, cx + .62]); }
    if (hb && o.ext === 'hood') {
      const cx = hb.x + hb.w / 2, hm = metal('steel');
      bx(R, .6, .09, .5, cx - .3, 1.58, 0, hm); bx(R, .3, 2.55 - 1.67, .26, cx - .15, 1.67, 0, hm); skip.push([cx - .32, cx + .32]);
    }
    if (bx1 > bx0 && o.spl !== 'paint') {
      const sm = o.spl === 'tiles' ? mat('tilesM', () => new THREE.MeshStandardMaterial({ map: tilesTex(), roughness: .25 })) : tm;
      bx(R, bx1 - bx0, 1.45 - TOPY - tt, .012, bx0, TOPY + tt, 0, sm, { s: o.spl === 'tiles' ? .6 : 1.2, ns: 1 });
    }
    if (o.wall !== 'none' && bx1 > bx0) {
      let segs = [[bx0, bx1]];
      skip.forEach(([a, b]) => { segs = segs.flatMap(([s, e]) => b <= s || a >= e ? [[s, e]] : [[s, Math.max(s, a)], [Math.min(e, b), e]]).filter(([s, e]) => e - s > .25); });
      segs.forEach(([s, e]) => {
        if (o.wall === 'units') {
          const n = Math.max(1, Math.round((e - s) / .5)), w = (e - s) / n, wy = 1.45, wh = .72;
          bx(R, e - s, wh, .32, s, wy, 0, dm);
          for (let i = 0; i < n; i++) front(R, s + i * w, style === 'handleless' ? wy - .025 : wy, w, style === 'handleless' ? wh + .025 : wh, .345, style === 'handleless' ? 'flat' : style, dm, { hd, hf, side: i % 2 ? 'L' : 'R', pos: 'bottom', len: .12 });
          if (o.led === 'on') { bx(R, e - s - .04, .006, .02, s + .02, wy - .007, .26, M_LED, { ns: 1 }); lights.push([R, (s + e) / 2, wy - .05, .35]); }
        } else {
          const sm = woodMat('#B98B5B', true);
          [1.55, 1.95].forEach((sy, k) => {
            bx(R, e - s - .04, .04, .26, s + .02, sy, 0, sm, { s: 1 });
            if (o.led === 'on') bx(R, e - s - .08, .004, .015, s + .04, sy - .005, .2, M_LED, { ns: 1 });
            const r = rnd(Math.round(s * 100) + k);
            for (let q = s + .12; q < e - .12; q += .2 + r() * .25) {
              if (r() < .45) cyl(R, .04 + r() * .03, .1 + r() * .14, q, sy + .04 + .08, .13, paint(['#E9E4DA', '#B8B2A6', '#6E7A6C', '#2F3633', '#C9A96E'][Math.floor(r() * 5)]));
              else if (r() < .7) for (let b = 0; b < 3; b++) bx(R, .2, .03, .16, q - .1, sy + .04 + b * .03, .04, paint(['#D9D2C3', '#8E9A87', '#B98B5B'][b]));
            }
          });
          if (o.led === 'on') lights.push([R, (s + e) / 2, 1.5, .3]);
        }
      });
    }
  });
  /* island */
  let iz0 = 0, IL = 0, icx = 0;
  if (isl) {
    const front0 = lay === 'straight' ? .6 : Math.min(B, 3.2) > 2.2 ? .6 : .6;
    IL = Math.max(1.5, Math.min(2.8, (lay === 'U' ? X - 2.4 : lay === 'L' ? X - 1.9 : X - 1.2)));
    icx = lay === 'L' ? .6 + 1.05 + IL / 2 + Math.max(0, (X - .6 - 1.05 - IL - .6) / 2) : X / 2;
    if (lay === 'L') icx = Math.min(icx, X - IL / 2 - .4);
    iz0 = front0 + 1.1;
    const R = new THREE.Group(); R.position.set(icx + IL / 2, 0, iz0 + .6); R.rotation.y = Math.PI; p.add(R);
    const plan = planRun(IL, hobOnIsland ? [{ kind: 'hob', w: .6, at: .5 }] : [], [], false);
    plan.forEach(u => unit(R, u, im, { flip: false }));
    const ov = .32, wf = o.isl === 'waterfall';
    bx(p, IL, tt, .62 + ov, icx - IL / 2, TOPY, iz0 - .02, tm, { s: 1.2 });
    bx(p, IL - (wf ? 0 : 0), TOPY - .15, .02, icx - IL / 2, .15, iz0 + .6, im);
    bx(p, IL, .15, .02, icx - IL / 2, 0, iz0 + .55, paint(shade(COL[o.col2 === 'same' ? o.col : o.col2][1], -.12)));
    if (wf) { bx(p, tt, TOPY + tt, .62 + ov, icx - IL / 2 - tt, 0, iz0 - .02, tm, { s: 1.2 }); bx(p, tt, TOPY + tt, .62 + ov, icx + IL / 2, 0, iz0 - .02, tm, { s: 1.2 }); }
    else { bx(p, .02, TOPY, .62, icx - IL / 2 - .02, 0, iz0 - .02, im); bx(p, .02, TOPY, .62, icx + IL / 2, 0, iz0 - .02, im); }
    if (hobOnIsland) hobOn(p, icx, iz0 + .3);
    if (o.stools === 'yes') {
      const n = Math.max(2, Math.min(4, Math.floor(IL / .58))), sm = woodMat('#6E4A33'), lm = metal(hf === 'chrome' ? 'chrome' : 'black');
      for (let i = 0; i < n; i++) { const sx = icx - IL / 2 + IL * (i + .5) / n, sz = iz0 + .6 + .28; cyl(p, .19, .05, sx, .66, sz, sm); cyl(p, .022, .62, sx, .33, sz, lm); cyl(p, .2, .015, sx, .008, sz, lm); bx(p, .3, .02, .02, sx - .15, .3, sz - .01, lm); }
    }
    if (o.pend === 'yes') {
      const n = IL > 2.1 ? 3 : 2, pm2 = metal(hf), bulb = mat('bulb', () => new THREE.MeshBasicMaterial({ color: '#FFE9C4' }));
      for (let i = 0; i < n; i++) {
        const px = icx - IL / 2 + IL * (i + .5) / n, pz = iz0 + .35;
        cyl(p, .004, 2.55 - 1.82, px, (2.55 + 1.82) / 2, pz, M_DARK);
        const sh = new THREE.Mesh(new THREE.CylinderGeometry(.03, .17, .2, 32, 1, true), mat('shade' + hf, () => { const c = metal(hf).clone(); c.side = THREE.DoubleSide; return c; }));
        sh.position.set(px, 1.72, pz); sh.castShadow = true; p.add(sh);
        sph(p, .045, px, 1.64, pz, bulb);
        if (i === Math.floor(n / 2) || n === 2) lights.push([p, px, 1.55, pz, 1]);
      }
    }
  }
  /* warm lights (kept few for speed) */
  lights.slice(0, 4).forEach(([par, x, y, z, pend]) => {
    const l = new THREE.PointLight('#FFD6A0', pend ? 1.1 : .7, pend ? 3.2 : 1.6, 2); l.position.set(x, y, typeof z === 'number' ? z : .35); par.add(l);
  });
  plant(p, Math.min(X - .35, X * .92), Z - .45);
  let ty = 1.0, tz = Math.min(Z, isl ? iz0 + 1.2 : 2.4) / 2, size = Math.max(X, isl ? iz0 + 1.4 : (lay === 'straight' ? 1.6 : B));
  if (lay === 'galley') { tz = A / 2 + .1; size = Math.max(A + .3, X); }
  if (lay === 'U') size *= 1.15;
  return { X, Z, target: new THREE.Vector3(X / 2, ty, tz), size };
}

/* ------------------------------------------------------------- wardrobe */
function wbays(o) { return Math.max(1, Math.round((o.W - (o.shelf === 'none' ? 0 : 45)) / 100)); }
function wardrobe(p) {
  const o = S.w, W = o.W / 100, H = Math.min(o.H / 100, 2.7), D = .6, X = W, Z = 3.4, inside = S.tab === 4;
  shell(p, X, Z, { left: true, right: true, wallH: Math.max(2.55, H + .05) });
  const cm = colMat(o.col, false), hf = o.hf, sw = o.shelf === 'none' ? 0 : .45, dx = o.shelf === 'left' ? sw : 0, dw = W - sw;
  bx(p, W, .08, D - .06, 0, 0, 0, paint(shade(COL[o.col][1], -.12)));
  /* hollow carcass so the open shelves and the inside view show */
  bx(p, W, H - .08, .02, 0, .08, 0, cm); bx(p, .02, H - .08, .6, 0, .08, 0, cm); bx(p, .02, H - .08, .6, W - .02, .08, 0, cm);
  bx(p, W, .025, .6, 0, H - .025, 0, cm); bx(p, W, .02, .58, 0, .08, 0, cm);
  const led = o.led === 'on', ledLights = [];
  if (sw) {
    const sx = o.shelf === 'left' ? 0 : W - sw, lh = (H - .08) * .34, oy = .08 + lh;
    bx(p, sw - .04, H - oy - .04, .02, sx + .02, oy, .02, M_INSIDE);
    for (let i = 0; i <= 4; i++) {
      const sy = oy + (H - oy - .04) * i / 4.4;
      bx(p, sw - .04, .025, .55, sx + .02, sy, .02, M_INSIDE);
      if (led && i < 4) bx(p, sw - .08, .004, .015, sx + .04, sy + (H - oy - .04) / 4.4 - .006, .45, M_LED, { ns: 1 });
      if (i < 4) { const r = rnd(i + 3); if (i % 2) for (let b = 0; b < 4; b++) bx(p, .3, .045, .28, sx + .07, sy + .025 + b * .045, .12, paint(['#D9D2C3', '#8E9A87', '#B9AE9E', '#5F7388'][b])); else { cyl(p, .07, .18, sx + sw * .35, sy + .115, .3, paint('#E9E4DA')); bx(p, .14, .16, .22, sx + sw * .55, sy + .025, .15, mat('basket', () => new THREE.MeshStandardMaterial({ color: '#B08A5A', roughness: 1 }))); } }
    }
    bx(p, .02, H - .08, .6, sx + (o.shelf === 'left' ? sw - .02 : 0), .08, 0, cm);
    front(p, sx, .08, sw, lh, .6, o.style === 'mirror' ? 'flat' : o.style === 'handleless' ? 'flat' : o.style, cm, { hd: o.style === 'handleless' || o.hd === 'none' ? 'none' : (o.hd === 'long' ? 'bar' : o.hd), hf, side: o.shelf === 'left' ? 'R' : 'L', pos: 'top' });
    if (led) ledLights.push([sx + sw / 2, H * .7, .45]);
  }
  const nb = wbays(o), bw = dw / nb, top = H - .02;
  if (inside) {
    bx(p, dw, H - .1, .015, dx, .08, .02, M_INSIDE);
    for (let b = 0; b <= nb; b++) bx(p, .018, H - .1, .56, dx + b * bw - (b === nb ? .018 : 0), .08, .02, M_INSIDE);
    for (let b = 0; b < nb; b++) {
      const kind = o.bays[b % o.bays.length], x0 = dx + b * bw + .02, w0 = bw - .04, r = rnd(b * 7 + 1);
      const rail = (ry, len) => { cyl(p, .012, w0 - .02, x0 + w0 / 2, ry, .3, metal('chrome'), 'x'); const n = Math.floor((w0 - .06) / .045); const cols = ['#7C8A80', '#C9B79A', '#5F6B7A', '#B78D7A', '#D8D2C6', '#4B5A52', '#2F3633']; for (let i = 0; i < n; i++) { const l2 = len * (.7 + r() * .3); bx(p, .028, l2, .42, x0 + .03 + i * .045, ry - .03 - l2, .09, paint(cols[Math.floor(r() * cols.length)])); } };
      const shelfAt = sy => bx(p, w0, .022, .54, x0, sy, .02, M_INSIDE);
      if (kind === 'hang') { shelfAt(top - .3); rail(top - .38, 1.05); }
      if (kind === 'double') { rail(top - .12, .78); shelfAt(.08 + (H - .08) / 2 - .02); rail(.08 + (H - .08) / 2 - .1, .72); }
      if (kind === 'shelves') for (let i = 1; i <= 5; i++) { const sy = .08 + (H - .1) * i / 6; shelfAt(sy); const n = Math.floor(w0 / .34); for (let q = 0; q < n; q++) for (let s = 0; s < 3; s++) bx(p, .3, .05, .3, x0 + .02 + q * .34, sy + .022 + s * .05, .12, paint(['#D9D2C3', '#8E9A87', '#B9AE9E', '#5F7388', '#C9A96E'][Math.floor(r() * 5)])); }
      if (kind === 'drawers') { for (let k = 0; k < 3; k++) { bx(p, w0, .2, .5, x0, .1 + k * .22, .06, paint('#F0EBE2')); cyl(p, .006, .14, x0 + w0 / 2, .1 + k * .22 + .15, .565, metal(hf), 'x'); } shelfAt(.78); rail(top - .12, .9); }
      if (led) { bx(p, w0 - .04, .005, .015, x0 + .02, top - .03, .5, M_LED, { ns: 1 }); }
    }
    if (led) ledLights.push([dx + dw / 2, top - .15, .55]);
  } else bx(p, dw, H - .1, .02, dx, .08, .56, cm);
  /* doors */
  const st = o.style, hdk = st === 'handleless' || o.open === 'sliding' ? 'none' : o.hd;
  if (o.open === 'sliding') {
    if (!inside) {
      const n = Math.max(2, Math.min(4, Math.round(o.W / 95))), ov = .03, w1 = (dw + ov * (n - 1)) / n, fr = metal(hf === 'brass' ? 'brass' : hf === 'chrome' ? 'chrome' : 'black');
      bx(p, dw, .04, .09, dx, top - .04, .56, fr); bx(p, dw, .02, .09, dx, .08, .56, fr);
      for (let i = 0; i < n; i++) { const px = dx + i * (w1 - ov), fz = i % 2 ? .65 : .615; front(p, px, .1, w1, top - .14, fz, st === 'handleless' ? 'flat' : st, cm, {}); bx(p, .02, top - .14, .022, px, .1, fz - .021, fr); bx(p, .02, top - .14, .022, px + w1 - .02, .1, fz - .021, fr); }
    }
  } else {
    const n = Math.max(2, Math.round(dw / .5)), w1 = dw / n;
    for (let i = 0; i < n; i++) {
      const hingeL = i % 2 === 0, px = dx + i * w1, g = new THREE.Group();
      g.position.set(hingeL ? px : px + w1, 0, .6); p.add(g);
      front(g, hingeL ? 0 : -w1, .08, w1, top - .08, 0, st === 'handleless' ? 'flat' : st, cm, { hd: hdk, hf, side: hingeL ? 'R' : 'L', pos: 'mid', len: o.hd === 'long' ? 1.2 : .3 });
      if (st === 'handleless') bx(g, .012, top - .12, .006, hingeL ? w1 - .012 : -w1, .1, .001, M_DARK, { ns: 1 });
      if (inside) g.rotation.y = hingeL ? -1.75 : 1.75;
    }
  }
  ledLights.slice(0, 2).forEach(([x, y, z]) => { const l = new THREE.PointLight('#FFD6A0', .8, 2, 2); l.position.set(x, y, z); p.add(l); });
  /* room dressing */
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(Math.min(2.4, W * .8), 1.6), mat('rugM', () => new THREE.MeshStandardMaterial({ map: rugTex(), roughness: 1 })));
  rug.rotation.x = -Math.PI / 2; rug.position.set(W / 2, .004, 1.9); rug.receiveShadow = true; p.add(rug);
  const bw2 = Math.min(1.2, W * .45); bx(p, bw2, .1, .42, W / 2 - bw2 / 2, .36, 2.0, M_FABRIC2); bx(p, bw2, .04, .42, W / 2 - bw2 / 2, .32, 2.0, woodMat('#6E4A33'));
  [[.04, .04], [bw2 - .08, .04], [.04, .34], [bw2 - .08, .34]].forEach(([a, b]) => bx(p, .04, .32, .04, W / 2 - bw2 / 2 + a, 0, 2.0 + b, woodMat('#6E4A33')));
  plant(p, W - .3, Z - .5);
  return { X, Z, target: new THREE.Vector3(W / 2, H * .5, inside ? 1.0 : .9), size: Math.max(W, H * 1.35) };
}

/* ------------------------------------------------------------- media wall */
function media(p) {
  const o = S.m, W = o.W / 100, H = Math.min(o.H / 100, 2.7), X = W, Z = 3.8, D = .28, led = o.led === 'on';
  shell(p, X, Z, { left: true, right: true, wallH: Math.max(2.55, H + .05) });
  const cm = colMat(o.col, false), sw = o.side === 'none' ? 0 : Math.min(.55, W * .16), cx0 = sw, cw = W - 2 * sw, cx = W / 2;
  const slatM = woodMat('#B88E63'), backM = paint('#2A2622');
  const slats = (x0, w0, y0, h0, z0) => {
    bx(p, w0, h0, .012, x0, y0, z0, backM, { ns: 1 });
    const step = .045, n = Math.floor((w0 - .01) / step), inst = new THREE.InstancedMesh(uvBox(.03, h0, .02, 1), slatM, n), m4 = new THREE.Matrix4();
    for (let i = 0; i < n; i++) { m4.makeTranslation(x0 + .008 + i * step + .015 + (w0 - n * step) / 2, y0 + h0 / 2, z0 + .012 + .01); inst.setMatrixAt(i, m4); }
    inst.castShadow = true; inst.receiveShadow = true; p.add(inst);
  };
  bx(p, W, H, D - .02, 0, 0, 0, o.fin === 'paint' ? paint(COL[o.col][1]) : paint('#E2DBCF'));
  if (o.fin === 'slat') slats(cx0, cw, 0, H, D - .02);
  else if (o.fin === 'marble') bx(p, cw, H, .02, cx0, 0, D - .02, mat('marbleWall', () => new THREE.MeshPhysicalMaterial({ map: marbleTex('mw', '#F0EEEA', 'rgba(150,150,160,A)', 1), roughness: .2, clearcoat: .6 })), { s: 1.6 });
  else bx(p, cw, H, .02, cx0, 0, D - .02, paint(COL[o.col][1]));
  const lights = [];
  if (sw) [0, W - sw].forEach((sx, k) => {
    if (o.side === 'slats') { slats(sx, sw, 0, H, D - .02); return; }
    if (o.side === 'none') return;
    bx(p, sw, H, .03, sx, 0, D - .03, cm);
    const ox = sx + .05, ow = sw - .1, oy = .62, oh = H - oy - .12;
    bx(p, ow, oh, .02, ox, oy, D - .01, mat('niche', () => new THREE.MeshStandardMaterial({ color: '#2D2A27', roughness: .9 })), { ns: 1 });
    for (let i = 0; i < 4; i++) {
      const sy = oy + oh * (i + 1) / 4.6; bx(p, ow, .03, .26, ox, sy, D, cm);
      if (led) bx(p, ow - .04, .004, .012, ox + .02, sy - .005, D + .2, M_LED, { ns: 1 });
      const r = rnd(i + k * 9); if (r() < .5) cyl(p, .05, .14 + r() * .1, ox + ow * .4, sy + .03 + .09, D + .13, paint(['#E9E4DA', '#B8B2A6', '#C9A96E', '#2F3633'][i])); else for (let b = 0; b < 3; b++) bx(p, .16, .03, .2, ox + ow * .25, sy + .03 + b * .03, D + .03, paint(['#D9D2C3', '#8E9A87', '#B98B5B'][b]));
    }
    bx(p, sw, oy, .32, sx, 0, D, cm);
    front(p, sx, .0, sw, oy, D + .32 + .02, 'flat', cm, {});
    if (led) lights.push([sx + sw / 2, oy + oh * .6, D + .3]);
  });
  /* base */
  let baseTop = 0;
  if (o.base === 'float') {
    const bw = Math.max(1.2, cw - .1), by = .22, bh = .32; bx(p, bw, bh, .4, cx - bw / 2, by, D, cm);
    const n = Math.max(2, Math.round(bw / .9)); for (let i = 0; i < n; i++) front(p, cx - bw / 2 + i * bw / n, by, bw / n, bh, D + .4 + .02, 'flat', cm, {});
    if (led) { bx(p, bw - .1, .005, .02, cx - bw / 2 + .05, by - .006, D + .3, M_LED, { ns: 1 }); lights.push([cx, .12, D + .5]); }
    baseTop = by + bh;
  } else if (o.base === 'cabinets') {
    const bh = .5; bx(p, cw, bh, .42, cx0, 0, D, cm);
    const n = Math.max(2, Math.round(cw / .8)); for (let i = 0; i < n; i++) front(p, cx0 + i * cw / n, .06, cw / n, bh - .06, D + .42 + .02, 'flat', cm, {});
    bx(p, cw, .06, .38, cx0, 0, D, M_DARK); baseTop = bh;
  }
  /* fire + TV */
  const diag = o.tv * .0254, tw = diag * .872, th = diag * .49;
  let fireTop = baseTop;
  if (o.fire === 'yes') {
    const fw = Math.min(cw - .2, Math.max(tw * .9, 1.4)), fh = .3, fy = Math.max(baseTop + .14, .42);
    bx(p, fw + .06, fh + .06, .03, cx - fw / 2 - .03, fy - .03, D, M_DARK);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh * .8), mat('flameM', () => new THREE.MeshBasicMaterial({ map: flameTex() }))); fl.position.set(cx, fy + fh * .45, D + .028); p.add(fl);
    bx(p, fw, .02, .01, cx - fw / 2, fy + .02, D + .025, mat('crystal', () => new THREE.MeshBasicMaterial({ color: '#ffc27a' })), { ns: 1 });
    const fl2 = new THREE.PointLight('#FF9A4A', .9, 2.2, 2); fl2.position.set(cx, fy + .2, D + .35); p.add(fl2);
    fireTop = fy + fh;
  }
  const ty = Math.min(H - th - .18, Math.max(fireTop + .22, 1.05 - th / 2 + .2));
  if (led) { const gl = new THREE.Mesh(new THREE.PlaneGeometry(tw + .55, th + .55), mat('glowM', () => new THREE.MeshBasicMaterial({ map: glowTex(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .55 }))); gl.position.set(cx, ty + th / 2, D + .002); p.add(gl); }
  bx(p, tw, th, .035, cx - tw / 2, ty, D + .02, M_GLASS);
  const sc = new THREE.Mesh(new THREE.PlaneGeometry(tw - .015, th - .015), mat('scr', () => new THREE.MeshBasicMaterial({ map: screenTex(), color: '#bfbfbf' }))); sc.position.set(cx, ty + th / 2, D + .056); p.add(sc);
  lights.slice(0, 3).forEach(([x, y, z]) => { const l = new THREE.PointLight('#FFD6A0', .6, 1.8, 2); l.position.set(x, y, z); p.add(l); });
  /* dressing */
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(Math.min(2.8, W * .75), 1.9), mat('rugM', () => new THREE.MeshStandardMaterial({ map: rugTex(), roughness: 1 })));
  rug.rotation.x = -Math.PI / 2; rug.position.set(cx, .004, 2.2); rug.receiveShadow = true; p.add(rug);
  cyl(p, .45, .04, cx, .38, 2.25, woodMat('#6E4A33', true)); cyl(p, .3, .36, cx, .18, 2.25, M_DARK);
  sph(p, .06, cx + .15, .45, 2.2, paint('#C9A96E'));
  plant(p, W - .35, 1.2);
  return { X, Z, target: new THREE.Vector3(W / 2, H * .48, 1.1), size: Math.max(W * 1.02, H * 1.3) };
}

/* ------------------------------------------------------------- camera */
const C = { az: .55, pol: 1.1, zoom: 1, t: new THREE.Vector3(1.5, 1, 1), fit: 6, tw: null };
const VIEWS = { angle: [.55, 1.08], front: [0, 1.32], top: [.12, .42] };
function VIEWS_FN(n) { if (n === 'angle' && S.t === 'k' && (S.k.lay === 'U' || S.k.lay === 'galley')) return [.2, .86]; return VIEWS[n]; }
function camPos(az, pol, dist, t) { const s = Math.sin(pol); return new THREE.Vector3(t.x + dist * s * Math.sin(az), t.y + dist * Math.cos(pol), t.z + dist * s * Math.cos(az)); }
function applyCam() {
  C.az = Math.max(-1.2, Math.min(1.2, C.az)); C.pol = Math.max(.32, Math.min(1.48, C.pol)); C.zoom = Math.max(.45, Math.min(1.8, C.zoom));
  cam.position.copy(camPos(C.az, C.pol, C.fit * C.zoom, C.t)); cam.lookAt(C.t);
  cutaway();
}
function cutaway() {
  const c = G && G.userData.cut; if (!c) return;
  const hr = C.az > .1, hl = C.az < -.1;
  c.R.forEach(m => m.visible = !hr); c.Rs.forEach(m => m.visible = hr);
  c.L.forEach(m => m.visible = !hl); c.Ls.forEach(m => m.visible = hl);
}
function fitDist(size) {
  const a = cam.aspect, vf = THREE.MathUtils.degToRad(cam.fov), hf = 2 * Math.atan(Math.tan(vf / 2) * a);
  const need = Math.max(size * .55 / Math.tan(hf / 2), size * .42 / Math.tan(vf / 2));
  return need + 1.0;
}
let info = null;
function frame(resetView) {
  if (!info) return;
  C.fit = fitDist(info.size);
  if (resetView) { const v = VIEWS_FN(S.view || 'angle'); C.az = v[0]; C.pol = v[1]; C.zoom = 1; }
  C.t.copy(info.target);
  applyCam();
  const sx = info.X, sz = info.Z;
  sun.position.set(info.X * .5 - 3.5, 6.5, sz + 3.5); sun.target.position.set(info.X / 2, 0, sz / 2.4);
  const sc = sun.shadow.camera, ext = Math.max(sx, sz) * .85 + 1; sc.left = -ext; sc.right = ext; sc.top = ext; sc.bottom = -ext; sc.near = .5; sc.far = 25; sc.updateProjectionMatrix();
}
function tweenTo(view) { const viewOf = n => VIEWS_FN(n);
  S.view = view; const v = viewOf(view), from = [C.az, C.pol, C.zoom], t0 = performance.now();
  C.tw = now => { const k = Math.min(1, (now - t0) / 650), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; C.az = from[0] + (v[0] - from[0]) * e; C.pol = from[1] + (v[1] - from[1]) * e; C.zoom = from[2] + (1 - from[2]) * e; applyCam(); return k < 1; };
  req();
  root.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', b.dataset.view === view));
}

/* ------------------------------------------------------------- build + render */
let need = false, raf = 0, lastT = null;
function req() { need = true; if (!raf) raf = requestAnimationFrame(tick); }
function tick(now) {
  raf = 0;
  let more = false;
  if (C.tw) { more = C.tw(now); if (!more) C.tw = null; }
  if (need || more) { R.render(scene, cam); need = false; }
  if (more) raf = requestAnimationFrame(tick);
}
function rebuild(resetView) {
  if (G) { scene.remove(G); G.traverse(o => { if (o.isInstancedMesh) o.dispose(); }); }
  G = new THREE.Group(); scene.add(G);
  info = S.t === 'k' ? kitchen(G) : S.t === 'w' ? wardrobe(G) : media(G);
  const typeChanged = lastT !== S.t; lastT = S.t;
  frame(resetView || typeChanged);
  req();
}
let pend = 0;
function soon() { if (pend) return; pend = requestAnimationFrame(() => { pend = 0; rebuild(false); }); }
function resize() {
  const r = stage.getBoundingClientRect(); if (!r.width || !r.height) return;
  R.setSize(r.width, r.height, false); cam.aspect = r.width / r.height; cam.updateProjectionMatrix();
  if (info) { C.fit = fitDist(info.size); applyCam(); } req();
}
new ResizeObserver(resize).observe(stage);

/* ------------------------------------------------------------- pointer controls */
const ptrs = new Map(); let pinch0 = 0, hintGone = false;
function hideHint() { if (hintGone) return; hintGone = true; const h = $('d3-hint'); if (h) h.style.opacity = '0'; ev('rotate'); }
cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = Math.hypot(a[0] - b[0], a[1] - b[1]); } C.tw = null; });
cv.addEventListener('pointermove', e => {
  if (!ptrs.has(e.pointerId)) return;
  const prev = ptrs.get(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  if (ptrs.size === 1) { C.az -= (e.clientX - prev[0]) * .0065; C.pol -= (e.clientY - prev[1]) * .0055; hideHint(); }
  else if (ptrs.size === 2) { const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch0) C.zoom *= pinch0 / d; pinch0 = d; hideHint(); }
  applyCam(); req();
});
const up = e => { ptrs.delete(e.pointerId); pinch0 = 0; };
cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
cv.addEventListener('wheel', e => { e.preventDefault(); C.zoom *= 1 + Math.max(-.2, Math.min(.2, e.deltaY * .0012)); applyCam(); req(); hideHint(); }, { passive: false });
cv.addEventListener('keydown', e => {
  const k = e.key; if (!/Arrow|^[+-]$/.test(k)) return; e.preventDefault();
  if (k === 'ArrowLeft') C.az += .08; if (k === 'ArrowRight') C.az -= .08; if (k === 'ArrowUp') C.pol -= .06; if (k === 'ArrowDown') C.pol += .06;
  if (k === '+') C.zoom *= .9; if (k === '-') C.zoom *= 1.1; applyCam(); req(); hideHint();
});
root.addEventListener('click', e => {
  const b = e.target.closest('[data-view],[data-zoom],#d3-snap'); if (!b) return;
  if (b.dataset.view) tweenTo(b.dataset.view);
  else if (b.dataset.zoom) { C.zoom *= b.dataset.zoom === '1' ? .85 : 1.18; applyCam(); req(); }
  else snap();
});
function snap() {
  R.render(scene, cam);
  const a = document.createElement('a'); a.href = cv.toDataURL('image/jpeg', .92); a.download = 'abj-my-' + ({ k: 'kitchen', w: 'wardrobe', m: 'media-wall' }[S.t]) + '-design.jpg';
  document.body.appendChild(a); a.click(); a.remove(); ev('save_picture');
}

UI.onChange = k => (k === 'lay' || k === 'isl') ? rebuild(true) : soon(); UI.onType = () => rebuild(true); UI.onReset = () => rebuild(true); UI.onTab = () => { if (S.t === 'w') soon(); };
rebuild(true); resize();
load.style.display = 'none';
UI.all();

/* ------------------------------------------------------------- UI */
function setupUI() {
  const E = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const api = { onChange() {}, onType() {}, onReset() {}, onTab() {} };
  const chips = (lab, k, map, cur, dis) => { let h = '<div class="dz-fl"><span>' + lab + '</span><div class="dz-ch" role="group" aria-label="' + lab + '">'; for (const v in map) h += '<button type="button" data-k="' + k + '" data-v="' + v + '" aria-pressed="' + (cur === v) + '"' + (dis && dis(v) ? ' disabled' : '') + '>' + map[v] + '</button>'; return h + '</div></div>'; };
  const sws = (lab, k, map, cur, extra) => { let h = '<div class="dz-fl"><span>' + lab + ' <output>' + (map[cur] ? map[cur][0] : extra && extra[cur] ? extra[cur][0] : '') + '</output></span><div class="dz-sw" role="group" aria-label="' + lab + '">'; const all = Object.assign({}, extra || {}, map); for (const v in all) h += '<button type="button" data-k="' + k + '" data-v="' + v + '" aria-pressed="' + (cur === v) + '" aria-label="' + all[v][0] + '" title="' + all[v][0] + '" style="background:' + all[v][1] + '"></button>'; return h + '</div></div>'; };
  const rng = (lab, k, min, max, step, cur, unit) => '<div class="dz-fl"><label for="d3-' + k + '">' + lab + ' <output id="d3-' + k + 'o">' + cur + ' ' + unit + '</output></label><input type="range" id="d3-' + k + '" data-k="' + k + '" data-u="' + unit + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + cur + '"></div>';
  const hint = t => '<p class="dz-hint">' + t + '</p>';
  const WOOD_BG = { oak: 'linear-gradient(100deg,#c79f70,#b3895c 40%,#cfa878 60%,#ad8457)', walnut: 'linear-gradient(100deg,#76503a,#5f402c 45%,#7c5640 60%,#583b29)' };
  const COLS = () => { const m = {}; for (const k in COL) m[k] = [COL[k][0], WOOD_BG[k] || COL[k][1]]; return m; };
  const TOPS = { quartzw: ['White quartz', 'linear-gradient(135deg,#f3f1ec 40%,#c9c9cf 42%,#f3f1ec 46%)'], calacatta: ['Calacatta gold quartz', 'linear-gradient(135deg,#f3f0ea 38%,#b08a48 41%,#d6d3cf 44%,#f3f0ea 48%)'], quartzb: ['Black quartz', 'radial-gradient(#555 1px,transparent 1.5px) 0 0/6px 6px,#1e1f21'], oak: ['Solid oak', 'linear-gradient(90deg,#c39566,#a97b4f 50%,#c99c6c)'], concrete: ['Concrete grey', 'radial-gradient(#7a7874 1px,transparent 2px) 0 0/7px 7px,#8e8c88'] };
  function panel() {
    const t = S.t, o = S[t], i = S.tab; let h = '';
    if (t === 'k') {
      if (i === 0) h = chips('Layout', 'lay', L.lay, o.lay) + chips('Island', 'isl', L.isl, o.lay === 'galley' ? 'none' : o.isl, v => o.lay === 'galley' && v !== 'none')
        + rng(o.lay === 'galley' ? 'Length of each run' : 'Main wall', 'A', 200, 600, 10, o.A, 'cm') + (o.lay === 'L' || o.lay === 'U' ? rng('Side wall', 'B', 180, 450, 10, o.B, 'cm') : '')
        + hint('Rough sizes are fine. Our surveyor measures everything at your free design visit.');
      if (i === 1) h = chips('Door style', 'style', L.kstyle, o.style) + chips('Finish', 'fin', L.fin, o.fin, v => v === 'gloss' && (o.style === 'shaker' || o.style === 'inframe')) + chips('Tall units', 'tall', L.tall, o.tall) + chips('Above the worktop', 'wall', L.wall, o.wall);
      if (i === 2) h = sws('Cupboard colour', 'col', COLS(), o.col) + (o.isl !== 'none' && o.lay !== 'galley' ? sws('Island colour', 'col2', COLS(), o.col2, { same: ['Same as cupboards', 'linear-gradient(135deg,#F3EEE6 49%,#0E1B1A 51%)'] }) : '') + hint('A guide to the look. The surveyor brings real door samples and swatches to your visit.');
      if (i === 3) h = sws('Worktop', 'top', TOPS, o.top) + chips('Behind the worktop', 'spl', L.spl, o.spl);
      if (i === 4) h = o.style === 'handleless' ? hint('Handleless doors open from a recessed rail, so no handles. Pick the rail and tap finish.') + sws('Rail and tap finish', 'hf', HF, o.hf) : chips('Handle', 'hd', L.khd, o.hd) + sws('Handle and tap finish', 'hf', HF, o.hf);
      if (i === 5) { const isl = o.isl !== 'none' && o.lay !== 'galley'; h = chips('Sink', 'sink', L.sink, o.sink) + (isl ? chips('Hob', 'hob', L.hob, o.hob) : '') + ((!isl || o.hob === 'run') ? chips('Extractor', 'ext', L.ext, o.ext) : '') + (isl ? chips('Pendant lights', 'pend', L.yn, o.pend) + chips('Bar stools', 'stools', L.yn, o.stools) : '') + chips('LED lights under cupboards', 'led', L.onoff, o.led); }
    } else if (t === 'w') {
      if (i === 0) h = rng('Width', 'W', 100, 450, 5, o.W, 'cm') + rng('Height', 'H', 200, 270, 5, o.H, 'cm') + hint('Not sure of the sizes? A rough guess is fine. Our surveyor measures everything at the visit.');
      if (i === 1) h = chips('How the doors open', 'open', L.open, o.open) + chips('Door style', 'style', L.wstyle, o.style) + chips('Open shelves', 'shelf', L.shelf, o.shelf);
      if (i === 2) h = sws('Door colour', 'col', COLS(), o.col) + hint('A guide to the look. At your visit the surveyor brings real swatches so you can see the colours in your own light.');
      if (i === 3) h = (o.open === 'sliding' || o.style === 'handleless') ? hint((o.open === 'sliding' ? 'Sliding doors' : 'Handleless doors') + ' need no handles. Choose hinged doors in another style to add them.') + (o.open === 'sliding' ? sws('Track and frame finish', 'hf', HF, o.hf) : '') : chips('Handle', 'hd', L.whd, o.hd) + (o.hd === 'none' ? '' : sws('Handle finish', 'hf', HF, o.hf));
      if (i === 4) { const nb = wbays(o); h = hint('The doors are open so you can plan the inside. Choose what goes in each section, left to right.'); for (let b = 0; b < nb; b++) h += chips('Section ' + (b + 1), 'bay' + b, L.bay, o.bays[b % o.bays.length]); h += chips('LED lighting', 'led', L.onoff, o.led); }
    } else {
      if (i === 0) h = rng('Width', 'W', 180, 450, 5, o.W, 'cm') + rng('Height', 'H', 200, 270, 5, o.H, 'cm') + hint('Most media walls run the full width of the wall. A rough guess is fine for now.');
      if (i === 1) h = rng('TV size', 'tv', 43, 85, 1, o.tv, 'inch') + chips('Fire', 'fire', L.fire, o.fire) + hint('We build the wall around your TV and fitters hang it for you.');
      if (i === 2) h = chips('Either side of the TV', 'side', L.side, o.side) + chips('Below the TV', 'base', L.base, o.base);
      if (i === 3) h = chips('Centre panel', 'fin', L.mfin, o.fin) + sws(o.fin === 'paint' ? 'Colour' : 'Cupboard colour', 'col', COLS(), o.col) + chips('LED lighting', 'led', L.onoff, o.led);
    }
    $('d3-pan').innerHTML = h;
  }
  function tabs() { let h = ''; TABS[S.t].forEach((t, i) => { h += '<button type="button" role="tab" data-tab="' + i + '" aria-selected="' + (S.tab === i) + '">' + t + '</button>'; }); $('d3-tabs').innerHTML = h; }
  function summary() {
    const lc = s => s.toLowerCase();
    if (S.t === 'k') {
      const o = S.k, isl = o.isl !== 'none' && o.lay !== 'galley';
      return lc(L.lay[o.lay]).replace(/^./, c => c.toUpperCase()) + ' kitchen' + (isl ? (o.isl === 'waterfall' ? ' with a waterfall island' : ' with an island') : '') + ', about ' + o.A + ' cm' + (o.lay === 'L' || o.lay === 'U' ? ' by ' + o.B + ' cm' : '')
        + '. ' + L.kstyle[o.style] + ' doors in ' + lc(COL[o.col][0]) + (o.fin === 'gloss' && (o.style === 'handleless' || o.style === 'flat') ? ' gloss' : '') + (isl && o.col2 !== 'same' ? ', island in ' + lc(COL[o.col2][0]) : '')
        + '. ' + TOP[o.top][0] + ' worktop, ' + lc(L.spl[o.spl]) + '. ' + (o.style === 'handleless' ? HF[o.hf][0] + ' rail' : HF[o.hf][0] + ' ' + lc(L.khd[o.hd]) + ' handles')
        + '. Tall units: ' + lc(L.tall[o.tall]) + '. Above the worktop: ' + lc(L.wall[o.wall]) + '. ' + L.sink[o.sink] + ' sink' + (isl ? ', hob ' + lc(L.hob[o.hob]) : '') + ((!isl || o.hob === 'run') ? ', ' + lc(L.ext[o.ext]) : '')
        + (isl ? (o.pend === 'yes' ? ', pendant lights' : '') + (o.stools === 'yes' ? ', bar stools' : '') : '') + ', LED under cupboards ' + o.led + '.';
    }
    if (S.t === 'w') {
      const o = S.w, nb = wbays(o), ins = []; for (let b = 0; b < nb; b++) ins.push(lc(L.bay[o.bays[b % o.bays.length]]));
      return 'Fitted wardrobe, ' + o.W + ' cm wide by ' + o.H + ' cm high, ' + lc(L.open[o.open]) + ' ' + lc(L.wstyle[o.style]) + ' doors in ' + lc(COL[o.col][0])
        + (o.open === 'hinged' && o.style !== 'handleless' && o.hd !== 'none' ? ', ' + lc(HF[o.hf][0]) + ' ' + lc(L.whd[o.hd]) + ' handles' : '') + (o.shelf === 'none' ? '' : ', open shelves on the ' + o.shelf)
        + '. Inside, left to right: ' + ins.join(', ') + '. LED lighting ' + o.led + '.';
    }
    const m = S.m;
    return 'Media wall, ' + m.W + ' cm wide by ' + m.H + ' cm high, for a ' + m.tv + ' inch TV, ' + (m.fire === 'yes' ? 'with an electric fire' : 'no fire') + ', ' + lc(L.side[m.side]) + ' at the sides, '
      + (m.base === 'none' ? 'no unit below' : lc(L.base[m.base])) + ', ' + lc(L.mfin[m.fin]) + ' centre panel' + (m.fin === 'paint' ? ' in ' + lc(COL[m.col][0]) : ', cupboards in ' + lc(COL[m.col][0])) + ', LED lighting ' + m.led + '.';
  }
  function text(say) {
    const sm = summary(); $('d3-sum').innerHTML = '<b>Your design:</b> ' + E(sm); if (say) $('d3-live').textContent = sm;
    $('d3-wa').href = 'https://wa.me/447479219421?text=' + encodeURIComponent('Hi ABJ, I designed this on your website: ' + sm);
    const c = $('d3-cv'); if (c) c.setAttribute('aria-label', '3D view of your design: ' + sm + ' Drag, or use the arrow keys, to look around.');
  }
  api.all = say => { tabs(); panel(); text(say); };
  api.summary = summary;
  const r = root;
  r.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || b.closest('.d3-bar')) return;
    if (b.dataset.t) { S.t = b.dataset.t; S.tab = 0; r.querySelectorAll('.dz-seg button').forEach(x => x.setAttribute('aria-pressed', x === b)); api.all(1); api.onType(); ev('type'); return; }
    if (b.dataset.tab) { S.tab = +b.dataset.tab; tabs(); panel(); api.onTab(); return; }
    if (b.id === 'd3-rs') { const t = S.t; S = JSON.parse(JSON.stringify(DEF)); S.t = t; api.all(1); api.onReset(); ev('reset'); return; }
    const k = b.dataset.k; if (!k || b.disabled) return; const o = S[S.t];
    if (k.indexOf('bay') === 0) { const nb = wbays(o), a = []; for (let i = 0; i < Math.max(nb, o.bays.length); i++) a.push(o.bays[i % o.bays.length]); a[+k.slice(3)] = b.dataset.v; o.bays = a; }
    else o[k] = b.dataset.v;
    if (S.t === 'k' && k === 'style' && (b.dataset.v === 'shaker' || b.dataset.v === 'inframe')) o.fin = 'matt';
    panel(); text(1); const f = $('d3-pan').querySelector('[data-k="' + k + '"][data-v="' + b.dataset.v + '"]'); f && f.focus({ preventScroll: true });
    api.onChange(k); ev('change');
  });
  r.addEventListener('input', e => { const x = e.target; if (x.type !== 'range') return; S[S.t][x.dataset.k] = +x.value; $(x.id + 'o').textContent = x.value + ' ' + x.dataset.u; text(); api.onChange(x.dataset.k); ev('change'); });
  r.addEventListener('keydown', e => { if (!e.target.closest('#d3-tabs') || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return; const n = TABS[S.t].length; S.tab = (S.tab + (e.key === 'ArrowRight' ? 1 : n - 1)) % n; tabs(); panel(); api.onTab(); $('d3-tabs').querySelector('[aria-selected="true"]').focus(); });
  $('d3-book').addEventListener('click', () => { try { sessionStorage.setItem('abj_design', summary()); } catch (e) {} ev('book'); });
  $('d3-wa').addEventListener('click', () => ev('whatsapp'));
  return api;
}
}
const sent = {};
function ev(a) {
  if (a === 'change' || a === 'rotate') { if (sent[a]) return; sent[a] = 1; }
  try { const t = document.querySelector('#d3 .dz-seg [aria-pressed="true"]'); window.gtag && gtag('event', 'room_designer_3d', { action: a, type: t ? t.textContent.toLowerCase() : '' }); } catch (e) {}
}
