/* ABJ tools (24 Nov 2026): "Find your style" quiz (modal), "Which service do I need?" chooser, and DEV link handling for the
   "Design it in 3D" sections. Loaded from jsDelivr by the ABJ D3CTA / ABJ CHOOSER blocks. Safe to load more than once.
   - Quiz opens from any [data-abj-quiz] element or a link to #style-quiz (data-abj-quiz="k|b|m" pre-picks the room).
   - Chooser runs on #abj-ch if the page has one.
   - On private DEV pages (/-dev-/ in the path) links to /design-your-room and /bookingform go to their DEV copies, query kept.
   - Booking hand-off: sessionStorage 'abj_design' (read by ABJ DESIGNFILL on the booking form). GA: style_quiz, service_chooser. */
(function () {
  'use strict';
  if (window.__abjTools) return; window.__abjTools = 1;
  var DEV = /-dev-|home-dev/.test(location.pathname);
  var DEVMAP = { '/design-your-room': '/design-your-room-dev-d4z8', '/bookingform': '/bookingform-dev-k9b4', '/budget-planner': '/budget-planner-dev-p6k3', '/gallery': '/gallery-dev-g7l3' };
  function link(p) { if (!DEV) return p; var m = p.match(/^(\/[a-z0-9-]*)(.*)$/); return m && DEVMAP[m[1]] ? DEVMAP[m[1]] + m[2] : p; }
  function fixLinks(root) { if (!DEV) return; [].forEach.call((root || document).querySelectorAll('a[href^="/design-your-room"],a[href^="/bookingform"],a[href^="/budget-planner"],a[href^="/gallery"]'), function (a) { a.setAttribute('href', link(a.getAttribute('href'))); }); }
  function ga(n, a, x) { try { var o = { action: a }; if (x) for (var k in x) o[k] = x[k]; window.gtag && gtag('event', n, o); } catch (e) {} }
  function E(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function store(t) { try { sessionStorage.setItem('abj_design', t); } catch (e) {} }
  var WA = 'https://wa.me/447479219421?text=';

  /* ------------------------------------------------------------------ photos (real ABJ jobs from the gallery; no renders) */
  function img(p, w) { return 'https://thb.tildacdn.com/' + p.replace(/\/([^/]+)$/, '/-/resize/' + (w || 720) + 'x/-/format/webp/$1'); }
  var P = { // id: [path, room, tone L/D, line S/C, material P/W, mood M/C, alt]
    k2: ['tild3365-6437-4663-b134-393931626234/abj-kitchen-dark-gre.jpg', 'k', 'D', 'S', 'P', 'M', 'Dark grey handleless kitchen with a marble-effect breakfast bar'],
    k5: ['tila3533-3138-4364-a336-626235386339/abj-kitchen-black-br.webp', 'k', 'D', 'C', 'W', 'C', 'Black kitchen with a brick-effect splashback, dark wood island and pendant lights'],
    k7: ['tila6238-3537-4561-b733-303431313136/abj-kitchen-copper-g.webp', 'k', 'D', 'S', 'W', 'C', 'Galley kitchen with copper-effect units and integrated ovens'],
    k8: ['tila3335-3465-4538-b264-316632643031/abj-kitchen-cream-is.webp', 'k', 'L', 'S', 'P', 'C', 'Cream kitchen island with a quartz worktop and brushed brass tap'],
    k9: ['tila6664-3632-4562-b164-393964383962/abj-kitchen-cream-gl.webp', 'k', 'L', 'S', 'P', 'M', 'Cream gloss handleless L-shaped kitchen'],
    k10: ['tild6630-6131-4730-a162-353535353562/abj-kitchen-marble-i.jpg', 'k', 'L', 'S', 'P', 'C', 'Kitchen with a marble-effect waterfall island and green velvet stools'],
    k11: ['tila3365-3536-4133-a235-656334386530/abj-kitchen-cashmere.webp', 'k', 'L', 'S', 'P', 'M', 'White and cashmere handleless kitchen under a skylight'],
    k12: ['tild3238-6432-4232-a231-373666396661/abj-kitchen-navy-win.jpg', 'k', 'D', 'C', 'P', 'M', 'Navy Shaker kitchen with white worktops'],
    k13: ['tild3038-3538-4836-b034-303362363366/abj-kitchen-grey-glo.jpg', 'k', 'L', 'S', 'P', 'M', 'Grey gloss kitchen with island seating'],
    k14: ['tild3231-3637-4438-a666-613162656437/abj-kitchen-navy-cop.jpg', 'k', 'D', 'S', 'W', 'C', 'Navy handleless kitchen with copper pendants and bar stools'],
    k15: ['tild6639-3330-4666-b839-323935633032/BespokeKitchens473.jpg', 'k', 'L', 'S', 'P', 'M', 'Grey gloss L-shaped kitchen with a metro tile splashback'],
    k16: ['tila3234-3739-4133-b831-373964353538/abj-kitchen-sage-sha.webp', 'k', 'L', 'C', 'P', 'C', 'Sage green Shaker kitchen with an island and bar stools'],
    k17: ['tila6131-3661-4863-b433-336364646331/abj-open-plan-kitche.webp', 'k', 'L', 'S', 'W', 'C', 'Open-plan handleless kitchen with warm wood details'],
    k18: ['tila6530-3531-4466-a365-333134386564/abj-handleless-islan.webp', 'k', 'L', 'S', 'P', 'M', 'Handleless kitchen with a marble-effect waterfall island'],
    b21: ['tild6133-6233-4063-a639-663961623837/abj-bed27.jpg', 'b', 'D', 'S', 'W', 'C', 'Loft bedroom with a walnut headboard panel'],
    b23: ['tila3139-6532-4630-b033-303363353633/BespokeBedrooms5.webp', 'b', 'L', 'C', 'P', 'C', 'Sage green fitted wardrobes with alcove shelving'],
    b24: ['tila3839-3466-4135-b938-353734356337/BespokeBedrooms19.webp', 'b', 'D', 'S', 'P', 'C', 'Green bedroom with a fitted fluted headboard and pendant lights'],
    b25: ['tila6162-3235-4265-a535-653331656565/BespokeBedrooms25.webp', 'b', 'D', 'C', 'P', 'C', 'Navy fitted bedroom with overhead cabinets and a padded headboard'],
    b27: ['tila6337-6339-4734-a237-306631373133/BespokeBedrooms30.webp', 'b', 'L', 'S', 'P', 'M', 'White gloss fitted wardrobes in a loft'],
    b29: ['tild6566-3663-4431-a234-373934646231/BespokeFittedWardrob.jpg', 'b', 'D', 'S', 'W', 'C', 'Walnut-effect fitted wardrobe with an LED-lit alcove'],
    b30: ['tild3431-3065-4631-b035-386230616331/BespokeFittedWardrob.jpg', 'b', 'L', 'S', 'P', 'M', 'Cashmere handleless wardrobes with a lit oak niche'],
    b31: ['tild3634-6132-4734-b062-663237613434/BespokeFittedWardrob.jpg', 'b', 'L', 'S', 'P', 'C', 'Fitted dressing table with a backlit mirror'],
    b32: ['tild6439-3461-4735-a639-616138666364/BespokeFittedWardrob.jpg', 'b', 'L', 'C', 'P', 'M', 'White Shaker wardrobes with a matching chest of drawers'],
    b33: ['tild6365-3032-4562-a630-376262383035/BespokeFittedWardrob.jpg', 'b', 'L', 'C', 'P', 'M', 'A wall of white Shaker fitted wardrobes'],
    b35: ['tild6431-6435-4138-b530-326430626138/abj-war29.jpg', 'b', 'L', 'C', 'P', 'C', 'Full-height white Shaker wardrobes in a bright bedroom'],
    b36: ['tild3666-3062-4630-b662-303130386639/abj-war37.jpg', 'b', 'L', 'S', 'P', 'M', 'Sliding wardrobe doors with mirror and black glass'],
    b37: ['tila3466-6631-4662-a234-313936323638/BespokeSlidingWardro.webp', 'b', 'D', 'S', 'W', 'M', 'Walnut-effect sliding wardrobe doors'],
    b39: ['tila6666-3030-4364-a563-646437633436/BespokeSlidingWardro.webp', 'b', 'D', 'S', 'W', 'C', 'Black and walnut sliding wardrobe with a home office alcove'],
    b41: ['tila3334-6365-4933-b533-656636666162/abj-war100.webp', 'b', 'L', 'S', 'P', 'M', 'Walk-in wardrobe with shelving towers'],
    m43: ['tild3665-3438-4730-b633-383936363437/abj-med0.jpg', 'm', 'D', 'S', 'W', 'M', 'Slatted media wall with a floating TV unit'],
    m44: ['tila3532-3562-4236-a534-353332323839/abj-med1.webp', 'm', 'L', 'S', 'W', 'C', 'Oak slat media wall with lit side shelving'],
    m45: ['tild3331-6337-4834-b466-343262386465/abj-med3.jpg', 'm', 'L', 'C', 'P', 'M', 'Cream media wall with a recessed TV panel'],
    m46: ['tild3762-6563-4761-b035-386364616130/abj-med4.jpg', 'm', 'D', 'C', 'W', 'C', 'Dark slatted media wall with a framed TV surround and fire'],
    m47: ['tila3865-3539-4734-a538-616434613366/abj-med5.webp', 'm', 'L', 'S', 'P', 'C', 'Media wall with a backlit TV panel'],
    m48: ['tila3164-3565-4662-a564-666130653535/abj-med10.webp', 'm', 'D', 'S', 'P', 'M', 'Media wall with a marble-effect TV panel and black slats'],
    m49: ['tila6435-3766-4165-a532-663637336638/WhatsApp_Image_2024-.webp', 'm', 'D', 'C', 'P', 'C', 'Large media wall with lit glass display cabinets'],
    m50: ['tild3666-6166-4661-b231-343937373935/BespokeMediaWalls15.jpg', 'm', 'L', 'C', 'P', 'M', 'White Shaker media wall with cupboards and lit shelves'],
    m51: ['tila3063-3130-4134-b135-646331383332/BespokeMediaWalls29.webp', 'm', 'D', 'S', 'W', 'C', 'Bronze-effect media wall with lit niches'],
    m52: ['tila3465-3338-4635-b364-663937396335/BespokeMediaWalls30.webp', 'm', 'L', 'S', 'W', 'M', 'Slatted feature wall with a wall-mounted TV'],
    m53: ['tila6334-3364-4937-b632-623438633735/BespokeMediaWalls43.webp', 'm', 'D', 'S', 'W', 'C', 'Walnut slatted media wall with a backlit stone TV panel'],
    m54: ['tild3162-3466-4966-a464-393266623636/BespokeMediaWalls45.jpg', 'm', 'D', 'S', 'W', 'C', 'Backlit TV panel on a walnut slat wall with a floating unit'],
    m55: ['tild3761-3562-4439-b837-386439613861/abj-med36.jpg', 'm', 'L', 'S', 'P', 'M', 'Grey media wall with a stone-effect panel and low TV unit']
  };
  var ROOMS = { k: 'kitchen', b: 'bedroom', m: 'media wall' };
  var D3ROOM = { k: 'kitchen', b: 'bedroom', m: 'mediawall' };
  /* questions: [dimension, title, [left id, label], [right id, label]] */
  var Q = {
    k: [['tone', 'Which feels more like you?', ['k11', 'Light & airy', 'L'], ['k2', 'Dark & dramatic', 'D']],
        ['line', 'Which doors do you prefer?', ['k9', 'Sleek, no handles', 'S'], ['k12', 'Classic, with handles', 'C']],
        ['mat', 'Colour or wood?', ['k16', 'Painted colour', 'P'], ['k17', 'Natural wood', 'W']],
        ['mood', 'How should it feel?', ['k15', 'Calm & clutter-free', 'M'], ['k14', 'Warm & cosy', 'C']]],
    b: [['tone', 'Which feels more like you?', ['b35', 'Light & airy', 'L'], ['b25', 'Dark & dramatic', 'D']],
        ['line', 'Which doors do you prefer?', ['b30', 'Sleek, no handles', 'S'], ['b23', 'Classic, with handles', 'C']],
        ['mat', 'Colour or wood?', ['b32', 'Painted colour', 'P'], ['b29', 'Natural wood', 'W']],
        ['mood', 'How should it feel?', ['b27', 'Calm & clutter-free', 'M'], ['b24', 'Warm & cosy', 'C']]],
    m: [['tone', 'Which feels more like you?', ['m45', 'Light & airy', 'L'], ['m53', 'Dark & dramatic', 'D']],
        ['line', 'Which look do you prefer?', ['m54', 'Floating & minimal', 'S'], ['m50', 'Built-in & panelled', 'C']],
        ['mat', 'Colour or wood?', ['m47', 'Painted & plain', 'P'], ['m44', 'Natural wood', 'W']],
        ['mood', 'How should it feel?', ['m55', 'Calm & clutter-free', 'M'], ['m49', 'Warm & cosy', 'C']]]
  };
  var STY = {
    LSP: ['Bright Modern', 'Clean lines, light painted doors and nothing out of place. It feels spacious, calm and easy to keep tidy.'],
    LSW: ['Warm Minimal', 'Pale, handleless doors softened with natural wood. Modern and uncluttered, but never cold.'],
    LCP: ['Timeless Classic', 'Light, painted Shaker-style doors with proper handles. A look that suits period homes and new builds alike, and won’t date.'],
    LCW: ['Country Charm', 'Classic panelled doors, natural wood and plenty of character. Relaxed, welcoming and made for real family life.'],
    DSP: ['Dark Modern Luxe', 'Deep colour on sleek handleless doors, with lighting doing the drama. Bold, smart and very grown-up.'],
    DSW: ['Moody Walnut', 'Dark tones and warm wood grain with seamless lines. Hotel-style luxury that still feels cosy.'],
    DCP: ['Heritage Colour', 'Navy, green or charcoal panelled doors with brass or black handles. Classic craftsmanship with real personality.'],
    DCW: ['Rich Traditional', 'Dark wood, panelled detail and warm lighting. Characterful, timeless and full of warmth.']
  };
  var MOOD = { M: 'Keep it calm: hidden storage, clear surfaces and soft, even light.', C: 'Make it cosy: warm LED lighting and a few open shelves for the things you love.' };
  var WORD = { L: 'light', D: 'dark', S: { k: 'handleless', b: 'handleless', m: 'floating' }, C: { k: 'classic doors', b: 'classic doors', m: 'built-in' }, P: 'painted', W: 'wood', M: 'calm', C2: 'cosy' };
  /* matching look in the 3D designer (index into its Inspire me list) */
  var LOOK = { k: { LSP: 4, LSW: 0, LCP: 3, LCW: 3, DSP: 2, DSW: 2, DCP: 1, DCW: 1 }, b: { LSP: 3, LSW: 3, LCP: 1, LCW: 0, DSP: 2, DSW: 2, DCP: 2, DCW: 2 }, m: { LSP: 1, LSW: 3, LCP: 3, LCW: 3, DSP: 0, DSW: 0, DCP: 2, DCW: 0 } };

  var CSS = '#abj-qz{position:fixed;inset:0;z-index:2147482000;background:#0E1B1A;color:#F3EEE6;font:400 16px/1.6 "DM Sans",system-ui,sans-serif;display:flex;flex-direction:column;opacity:0;transition:opacity .25s;-webkit-font-smoothing:antialiased}' +
    '#abj-qz.on{opacity:1}#abj-qz *{box-sizing:border-box;margin:0;padding:0}' +
    '#abj-qz .qh{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px clamp(16px,3vw,40px);flex:none}' +
    '#abj-qz .qk{font:500 11px/1.4 "DM Sans",sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#C9A96E}' +
    '#abj-qz .qd{display:flex;gap:6px}#abj-qz .qd i{width:26px;height:3px;background:rgba(243,238,230,.2);border-radius:2px}#abj-qz .qd i.on{background:#C9A96E}' +
    '#abj-qz .qx{width:44px;height:44px;border:1px solid rgba(243,238,230,.3);border-radius:50%;background:none;color:#F3EEE6;font-size:22px;line-height:1;cursor:pointer}#abj-qz .qx:hover{border-color:#F3EEE6}' +
    '#abj-qz .qb{flex:1 1 auto;min-height:0;overflow-y:auto;display:flex;flex-direction:column;padding:0 clamp(16px,3vw,40px) 20px}' +
    '#abj-qz h2{font:300 clamp(30px,3.6vw,54px)/1.05 "Cormorant Garamond",Georgia,serif;text-align:center;margin:6px 0 4px}' +
    '#abj-qz h2 em{font-style:italic;color:#C9A96E}' +
    '#abj-qz .qs{text-align:center;color:rgba(243,238,230,.7);font-size:14px;margin-bottom:18px}' +
    '#abj-qz .qp{flex:1 1 auto;min-height:260px;display:grid;grid-template-columns:1fr 1fr;gap:clamp(8px,1.4vw,20px);max-width:1180px;width:100%;margin:0 auto}' +
    '#abj-qz .qc{position:relative;display:block;width:100%;height:100%;min-height:220px;border:0;padding:0;background:#16302C;cursor:pointer;overflow:hidden;border-radius:4px;color:#F3EEE6;text-align:left}' +
    '#abj-qz .qc img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .6s ease}' +
    '#abj-qz .qc:hover img,#abj-qz .qc:focus-visible img{transform:scale(1.04)}' +
    '#abj-qz .qc span{position:absolute;left:0;right:0;bottom:0;padding:44px 18px 16px;background:linear-gradient(transparent,rgba(8,14,13,.85));font:400 clamp(20px,2vw,28px)/1.1 "Cormorant Garamond",Georgia,serif}' +
    '#abj-qz .qc:focus-visible{outline:3px solid #C9A96E;outline-offset:3px}' +
    '#abj-qz .qr{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(8px,1.4vw,20px);max-width:980px;width:100%;margin:6px auto 0}' +
    '#abj-qz .qr .qc{height:auto;min-height:0;aspect-ratio:1/1.12;padding:0;cursor:pointer}' +
    '#abj-qz .qr .qc span{font:500 14px/1.25 "DM Sans",sans-serif;letter-spacing:.02em;padding:40px 14px 14px}' +
    '#abj-qz .qr .qc svg{position:absolute;left:50%;top:42%;width:46%;height:auto;transform:translate(-50%,-50%);color:#C9A96E;opacity:.9}' +
    '#abj-qz .qbk{align-self:center;margin-top:14px;background:none;border:0;color:rgba(243,238,230,.7);font:500 11px/1 "DM Sans",sans-serif;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;padding:10px}#abj-qz .qbk:hover{color:#F3EEE6}' +
    '#abj-qz .qres{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:clamp(20px,3.5vw,56px);align-items:center;max-width:1240px;width:100%;margin:auto}' +
    '#abj-qz .qres h2{text-align:left;margin:10px 0 12px}#abj-qz .qres p{color:rgba(243,238,230,.82);max-width:34em}#abj-qz .qres .qm{margin-top:10px;color:#9FD3AE;font-size:14.5px}' +
    '#abj-qz .qch{display:flex;flex-wrap:wrap;gap:6px;margin:16px 0 0}#abj-qz .qch b{font:500 10.5px/1 "DM Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:7px 10px;border:1px solid rgba(201,169,110,.5);border-radius:99px;color:#F3EEE6}' +
    '#abj-qz .qg{display:grid;grid-template-columns:1.3fr 1fr;grid-template-rows:1fr 1fr;gap:8px;height:clamp(280px,52vh,520px)}#abj-qz .qg img{width:100%;height:100%;object-fit:cover;border-radius:4px;background:#16302C}#abj-qz .qg img:first-child{grid-row:1/3}' +
    '#abj-qz .qa{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}' +
    '#abj-qz .qa a,#abj-qz .qa button{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:50px;padding:0 22px;font:500 11px/1 "DM Sans",sans-serif;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;border:0;border-radius:0;cursor:pointer}' +
    '#abj-qz .qa .q1{background:#C9A96E;color:#0E1B1A}#abj-qz .qa .q1:hover{background:#F3EEE6}' +
    '#abj-qz .qa .q2{background:#F3EEE6;color:#1b2321}#abj-qz .qa .q2:hover{background:#C9A96E}' +
    '#abj-qz .qa .q3{background:none;color:#F3EEE6;box-shadow:inset 0 0 0 1px rgba(243,238,230,.45)}#abj-qz .qa .q3:hover{box-shadow:inset 0 0 0 1px #F3EEE6}' +
    '#abj-qz .qa svg{width:17px;height:17px}' +
    '@media(max-width:760px){#abj-qz .qh{padding:12px 14px}#abj-qz .qd i{width:18px}#abj-qz h2{font-size:30px}#abj-qz .qs{margin-bottom:12px;font-size:13px}' +
    '#abj-qz .qp{grid-template-columns:1fr;grid-template-rows:1fr 1fr;gap:8px}#abj-qz .qc{min-height:0}#abj-qz .qc span{font-size:22px;padding:34px 14px 12px}' +
    '#abj-qz .qr{grid-template-columns:1fr;gap:8px}#abj-qz .qr .qc{aspect-ratio:auto;height:92px}#abj-qz .qr .qc svg{left:46px;top:50%;width:52px}#abj-qz .qr .qc span{background:none;top:0;padding:0 16px 0 96px;display:flex;align-items:center;font-size:16px}' +
    '#abj-qz .qres{grid-template-columns:1fr;gap:14px;margin:0 auto}#abj-qz .qg{height:200px;order:-1}#abj-qz .qres h2{font-size:34px;margin:6px 0 8px}#abj-qz .qres p{font-size:14.5px}' +
    '#abj-qz .qa{margin-top:16px;gap:8px}#abj-qz .qa a,#abj-qz .qa button{flex:1 1 calc(50% - 4px);min-height:48px;padding:0 10px;letter-spacing:.12em;font-size:10.5px}#abj-qz .qa .q1{flex-basis:100%}#abj-qz .qkd{display:none}}' +
    '@media(prefers-reduced-motion:reduce){#abj-qz,#abj-qz .qc img{transition:none}}' +
    'html.abj-qz-open,html.abj-qz-open body{overflow:hidden}';

  var ICON = {
    k: '<svg viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 44h56M8 44V22h48v22M8 30h48M20 22v22M44 22v22M12 6h40v10H12zM30 12h4"/></svg>',
    b: '<svg viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 42h56M8 42V18M56 42V30H8M12 30v-6a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v6M40 8h16v22M48 8v22M44 18h1M51 18h1"/></svg>',
    m: '<svg viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 44h56M8 44V4h48v40M18 10h28v17H18zM14 36h36M22 32h20v8H22zM10 10v28M54 10v28"/></svg>'
  };
  var I3D = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/></svg>';
  var IWA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.6 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3.1s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.3.1.2.1.7-.1 1.4z"/></svg>';

  var st = null, box = null, lastFocus = null;
  function open(room) {
    if (!document.getElementById('abj-qz-css')) { var c = document.createElement('style'); c.id = 'abj-qz-css'; c.textContent = CSS; document.head.appendChild(c); }
    lastFocus = document.activeElement;
    box = document.createElement('div'); box.id = 'abj-qz'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Find your style quiz');
    document.body.appendChild(box); document.documentElement.classList.add('abj-qz-open');
    st = { room: ROOMS[room] ? room : null, step: 0, a: {} }; if (st.room) st.step = 1;
    render(); requestAnimationFrame(function () { box.classList.add('on'); });
    box.addEventListener('click', onClick); document.addEventListener('keydown', onKey, true);
    ga('style_quiz', 'open', { room: st.room || '' });
    preload();
  }
  function close() {
    if (!box) return; document.removeEventListener('keydown', onKey, true); box.remove(); box = null; document.documentElement.classList.remove('abj-qz-open');
    if (location.hash === '#style-quiz') try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    try { lastFocus && lastFocus.focus(); } catch (e) {}
  }
  function onKey(e) {
    if (!box) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') { var f = box.querySelectorAll('button,a[href]'); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  }
  function preload() { if (!st.room) return; Q[st.room].forEach(function (q) { [q[2][0], q[3][0]].forEach(function (id) { var i = new Image(); i.src = img(P[id][0]); }); }); }
  function dots() { var h = '<div class="qd" aria-hidden="true">'; for (var i = 0; i < 5; i++) h += '<i class="' + (i <= st.step ? 'on' : '') + '"></i>'; return h + '</div>'; }
  function head(k) { return '<div class="qh"><span class="qk">' + k.replace('Find your style &middot; ', '<span class="qkd">Find your style &middot; </span>') + '</span>' + (st.step <= 4 ? dots() : '') + '<button type="button" class="qx" data-q="x" aria-label="Close the quiz">&times;</button></div>'; }
  function render() {
    var h;
    if (st.step === 0) {
      h = head('Find your style &middot; 1 of 5') + '<div class="qb"><h2>What are we <em>designing?</em></h2><p class="qs">Five quick taps, no email needed.</p><div class="qr">' +
        ['k', 'b', 'm'].map(function (r) { return '<button type="button" class="qc" data-room="' + r + '">' + ICON[r] + '<span>' + { k: 'A kitchen', b: 'A bedroom or wardrobes', m: 'A media wall' }[r] + '</span></button>'; }).join('') + '</div></div>';
    } else if (st.step <= 4) {
      var q = Q[st.room][st.step - 1];
      h = head('Find your style &middot; ' + (st.step + 1) + ' of 5') + '<div class="qb"><h2>' + E(q[1]) + '</h2><p class="qs">Go with your gut. Tap the one you like more.</p><div class="qp">' +
        [q[2], q[3]].map(function (o) { var p = P[o[0]]; return '<button type="button" class="qc" data-v="' + o[2] + '"><img src="' + img(p[0]) + '" alt="' + E(p[6]) + '" decoding="async"><span>' + E(o[1]) + '</span></button>'; }).join('') +
        '</div><button type="button" class="qbk" data-q="back">&larr; Back</button></div>';
    } else h = result();
    box.innerHTML = h; fixLinks(box);
    var f = box.querySelector('.qc,.qa a'); if (f) try { f.focus({ preventScroll: true }); } catch (e) {}
  }
  function key() { return st.a.tone + st.a.line + st.a.mat; }
  function result() {
    var r = st.room, k = key(), s = STY[k], room = ROOMS[r], used = {};
    Q[r].forEach(function (q) { used[q[2][0]] = used[q[3][0]] = 1; });
    var want = [st.a.tone, st.a.line, st.a.mat, st.a.mood];
    var pics = Object.keys(P).filter(function (id) { return P[id][1] === r && !used[id]; }).map(function (id) {
      var p = P[id], sc = (p[2] === want[0] ? 3 : 0) + (p[3] === want[1] ? 2 : 0) + (p[4] === want[2] ? 2 : 0) + (p[5] === want[3] ? 1 : 0); return [sc, id];
    }).sort(function (a, b) { return b[0] - a[0]; }).slice(0, 3).map(function (x) { return x[1]; });
    var words = [WORD[st.a.tone], typeof WORD[st.a.line] === 'object' ? WORD[st.a.line][r] : WORD[st.a.line], WORD[st.a.mat], st.a.mood === 'C' ? 'cosy' : 'calm'];
    var title = room.charAt(0).toUpperCase() + room.slice(1);
    var note = 'Style quiz: ' + title + ', ' + s[0] + ' (' + words.join(', ') + ').';
    st.note = note;
    var d3 = '/design-your-room?room=' + D3ROOM[r] + '&look=' + LOOK[r][k];
    ga('style_quiz', 'result', { room: r, style: s[0] });
    return head('Your style') + '<div class="qb"><div class="qres"><div><span class="qk">Your ' + E(room) + ' style is</span><h2>' + E(s[0]).replace(/ (\S+)$/, ' <em>$1</em>') + '</h2><p>' + E(s[1]) + '</p><p class="qm">' + E(MOOD[st.a.mood]) + '</p>' +
      '<div class="qch">' + words.map(function (w) { return '<b>' + E(w) + '</b>'; }).join('') + '</div>' +
      '<div class="qa"><a class="q1" href="' + d3 + '" data-q="d3">' + I3D + 'Design it in 3D in this style</a><a class="q2" href="/bookingform" data-q="book">Book a free design visit</a>' +
      '<a class="q3" href="' + WA + encodeURIComponent('Hi ABJ, I did your style quiz. ' + note + ' Could you help me with my ' + room + '?') + '" target="_blank" rel="noopener" data-q="wa">' + IWA + 'WhatsApp us</a></div>' +
      '<button type="button" class="qbk" data-q="again" style="align-self:flex-start;margin-left:-10px">&#8635; Start again</button></div>' +
      '<div class="qg">' + pics.map(function (id, i) { return '<img src="' + img(P[id][0], i ? 600 : 900) + '" alt="' + E(P[id][6]) + ' by ABJ" decoding="async">'; }).join('') + '</div></div></div>';
  }
  function onClick(e) {
    var b = e.target.closest('button,a'); if (!b || !box) return;
    var q = b.getAttribute('data-q');
    if (q === 'x') { close(); return; }
    if (q === 'back') { st.step--; if (st.step === 0) st.room = null; render(); return; }
    if (q === 'again') { st = { room: null, step: 0, a: {} }; render(); ga('style_quiz', 'again'); return; }
    if (q === 'book' || q === 'd3' || q === 'wa') { store(st.note + (q === 'd3' ? ' (then opened the 3D designer)' : '')); ga('style_quiz', q, { room: st.room }); return; }
    if (b.hasAttribute('data-room')) { st.room = b.getAttribute('data-room'); st.step = 1; preload(); render(); ga('style_quiz', 'room', { room: st.room }); return; }
    if (b.hasAttribute('data-v') && st.step >= 1 && st.step <= 4) { st.a[Q[st.room][st.step - 1][0]] = b.getAttribute('data-v'); st.step++; render(); }
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-abj-quiz],a[href="#style-quiz"]'); if (!t) return;
    e.preventDefault(); open(t.getAttribute('data-abj-quiz') || '');
  });
  if (location.hash === '#style-quiz') setTimeout(function () { open(''); }, 400);
  window.abjQuiz = open;

  /* ------------------------------------------------------------------ "Which service do I need?" chooser */
  var CH = {
    rooms: [['k', 'Kitchen'], ['b', 'Bedroom'], ['w', 'Wardrobes'], ['m', 'Living room'], ['h', 'Hallway or stairs'], ['o', 'Home office'], ['u', 'Utility or boot room'], ['x', 'Bathroom'], ['r', 'Rental or HMO'], ['c', 'Office or business']],
    probs: [['out', 'It looks tired or dated'], ['sto', 'Not enough storage'], ['awk', 'An awkward space'], ['new', 'A new build or extension'], ['ideas', 'Just after ideas']],
    when: [['now', 'As soon as possible'], ['3m', 'In the next 3 months'], ['later', 'Later this year'], ['look', 'Just looking']],
    pages: {
      kitchens: ['/bespoke-kitchens', 'Bespoke kitchens', 'Designed, made in our Peterborough workshop and fitted by our own team.'],
      kdesign: ['/kitchen-design-peterborough', 'Kitchen design', 'A free design visit and a layout that makes the most of your room.'],
      kfit: ['/kitchen-fitters-peterborough', 'Kitchen fitters', 'Our own fitters, with plumbing, electrics and old-kitchen removal priced on the quote.'],
      worktops: ['/luxury-worktops-abj', 'Worktops', 'Quartz, granite and solid surfaces templated and fitted.'],
      bedrooms: ['/bespoke-bedrooms-abj', 'Fitted bedrooms', 'Wardrobes, bridging units, bedsides and dressing tables made to fit.'],
      wardrobes: ['/bespoke-wardrobes', 'Fitted wardrobes', 'Floor-to-ceiling storage built around your room and what you own.'],
      sliding: ['/sliding-wardrobes', 'Sliding wardrobes', 'Mirror, glass and wood sliding doors that save space.'],
      walkin: ['/walk-in-wardrobes', 'Walk-in wardrobes', 'Turn a spare room or alcove into a dressing room.'],
      sloping: ['/fitted-wardrobes-sloping-ceilings', 'Sloping ceilings', 'Wardrobes and drawers that follow lofts and eaves.'],
      alcove: ['/alcove-units', 'Alcove units', 'Cupboards and shelving made for the spaces beside a chimney breast.'],
      under: ['/under-stairs-storage', 'Under-stairs storage', 'Pull-out drawers and cupboards for the space under your stairs.'],
      media: ['/media-walls', 'Media walls', 'TV walls with fires, lighting, hidden cables and storage.'],
      hall: ['/bespoke-hallways', 'Hallways', 'Coat, shoe and bench storage that keeps the entrance tidy.'],
      storage: ['/bespoke-storage-solutions', 'Storage solutions', 'Clever built-in storage for any room.'],
      office: ['/bespoke-office-renovations', 'Home offices', 'Desks, shelving and storage built for the way you work.'],
      utility: ['/utility-boot-rooms-peterborough', 'Utility & boot rooms', 'Laundry, coats, boots and dogs, all with a place to go.'],
      bath: ['/bathroom-cabinetry', 'Bathroom cabinetry', 'Vanity units and storage made for your bathroom.'],
      hmo: ['/hmo-makeover', 'HMO & rental makeovers', 'Hard-wearing kitchens and rooms for landlords.'],
      fitout: ['/office-fit-out-peterborough', 'Office fit-outs', 'Offices, receptions and boardrooms for businesses.'],
      gallery: ['/gallery', 'Our gallery', 'Real ABJ kitchens, bedrooms and media walls for ideas.']
    }
  };
  var CHD3 = { k: 'kitchen', b: 'bedroom', w: 'wardrobe', m: 'mediawall' };
  function route(r, p) {
    var M = {
      k: { out: ['kitchens', 'kdesign', 'worktops'], sto: ['kdesign', 'kitchens', 'utility'], awk: ['kdesign', 'kitchens'], new: ['kdesign', 'kfit', 'kitchens'], ideas: ['kitchens', 'gallery'] },
      b: { out: ['bedrooms', 'wardrobes'], sto: ['bedrooms', 'wardrobes', 'walkin'], awk: ['sloping', 'bedrooms', 'alcove'], new: ['bedrooms', 'walkin'], ideas: ['bedrooms', 'gallery'] },
      w: { out: ['sliding', 'wardrobes'], sto: ['wardrobes', 'walkin', 'sliding'], awk: ['sloping', 'alcove', 'under'], new: ['wardrobes', 'walkin'], ideas: ['wardrobes', 'gallery'] },
      m: { out: ['media', 'alcove'], sto: ['alcove', 'media'], awk: ['alcove', 'media'], new: ['media', 'alcove'], ideas: ['media', 'gallery'] },
      h: { out: ['hall', 'under'], sto: ['under', 'hall'], awk: ['under', 'hall'], new: ['hall', 'under'], ideas: ['hall', 'under'] },
      o: { out: ['office', 'alcove'], sto: ['office', 'storage'], awk: ['office', 'sloping'], new: ['office'], ideas: ['office', 'gallery'] },
      u: { out: ['utility'], sto: ['utility', 'storage'], awk: ['utility', 'under'], new: ['utility', 'kdesign'], ideas: ['utility', 'gallery'] },
      x: { out: ['bath'], sto: ['bath', 'storage'], awk: ['bath'], new: ['bath'], ideas: ['bath', 'gallery'] },
      r: { out: ['hmo'], sto: ['hmo'], awk: ['hmo'], new: ['hmo', 'kitchens'], ideas: ['hmo'] },
      c: { out: ['fitout'], sto: ['fitout'], awk: ['fitout'], new: ['fitout'], ideas: ['fitout'] }
    };
    return ((M[r] || {})[p] || ['gallery']).map(function (k) { return CH.pages[k]; });
  }
  function chooser(el) {
    if (el.dataset.on) return; el.dataset.on = '1';
    var body = el.querySelector('.ch-b'), a = {}, step = 0;
    var NAMES = { r: 'room', p: 'problem', t: 'timing' };
    function lab(list, v) { for (var i = 0; i < list.length; i++) if (list[i][0] === v) return list[i][1]; return ''; }
    function chips(list, k) { return '<div class="ch-c" role="group">' + list.map(function (o) { return '<button type="button" data-k="' + k + '" data-v="' + o[0] + '"' + (a[k] === o[0] ? ' aria-pressed="true"' : '') + '>' + E(o[1]) + '</button>'; }).join('') + '</div>'; }
    function crumbs() { var h = ''; if (a.r) h += '<b>' + E(lab(CH.rooms, a.r)) + '</b>'; if (a.p) h += '<b>' + E(lab(CH.probs, a.p)) + '</b>'; if (a.t) h += '<b>' + E(lab(CH.when, a.t)) + '</b>'; return h ? '<div class="ch-cr">' + h + '<button type="button" data-k="reset">Start again</button></div>' : ''; }
    function draw() {
      var h = '<div class="ch-st" aria-hidden="true">' + [1, 2, 3].map(function (i) { return '<i class="' + (i <= step + 1 || step === 3 ? 'on' : '') + '"></i>'; }).join('') + '</div>';
      if (step === 0) h += '<p class="ch-q"><span>1</span>What would you like done?</p>' + chips(CH.rooms, 'r');
      else if (step === 1) h += crumbs() + '<p class="ch-q"><span>2</span>What&rsquo;s the main reason?</p>' + chips(CH.probs, 'p');
      else if (step === 2) h += crumbs() + '<p class="ch-q"><span>3</span>When are you hoping to start?</p>' + chips(CH.when, 't');
      else {
        var pg = route(a.r, a.p), soon = a.t === 'now' || a.t === '3m', d3 = CHD3[a.r];
        var note = 'Service chooser: ' + lab(CH.rooms, a.r) + ' / ' + lab(CH.probs, a.p) + ' / ' + lab(CH.when, a.t) + '.';
        el.dataset.note = note;
        var dl = Date.now() < new Date('2026-12-12T23:59:59Z').getTime() && soon;
        h += crumbs() + '<p class="ch-q ch-q2">We&rsquo;d start here</p><div class="ch-r">' + pg.map(function (p) { return '<a class="ch-card" href="' + p[0] + '" data-k="go"><strong>' + E(p[1]) + '</strong><span>' + E(p[2]) + '</span><em aria-hidden="true">&rarr;</em></a>'; }).join('') + '</div>' +
          '<div class="ch-a">' + (soon
            ? '<a class="bt d" href="/bookingform" data-k="book">Book a free design visit</a>' + (d3 ? '<a class="bt ch-o" href="/design-your-room?room=' + d3 + '" data-k="d3">Design it in 3D</a>' : '<a class="bt ch-o" href="/budget-planner" data-k="plan">Plan your budget</a>')
            : (d3 ? '<a class="bt d" href="/design-your-room?room=' + d3 + '" data-k="d3">Design it in 3D first</a>' : '<a class="bt d" href="/budget-planner" data-k="plan">Plan your budget</a>') + '<a class="bt ch-o" href="/bookingform" data-k="book">Book a free design visit</a>') +
          (a.r === 'k' || a.r === 'b' || a.r === 'w' || a.r === 'm' ? '<button type="button" class="ch-lk" data-abj-quiz="' + (a.r === 'w' ? 'b' : a.r) + '">Not sure of your style? Take the 5-tap quiz</button>' : '') + '</div>' +
          (dl ? '<p class="ch-n">Order by 12 December to secure a January&ndash;February fitting slot.</p>' : '');
      }
      body.innerHTML = h; fixLinks(body);
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-k]'); if (!b) return; var k = b.getAttribute('data-k');
      if (k === 'reset') { a = {}; step = 0; draw(); ga('service_chooser', 'reset'); var f = body.querySelector('button'); f && f.focus(); return; }
      if (k === 'book' || k === 'd3' || k === 'plan' || k === 'go') { store(el.dataset.note || ''); ga('service_chooser', k, { room: a.r, problem: a.p, when: a.t, page: b.getAttribute('href') }); return; }
      if (k === 'r' || k === 'p' || k === 't') {
        a[k] = b.getAttribute('data-v'); step = { r: 1, p: 2, t: 3 }[k]; draw(); ga('service_chooser', NAMES[k], { value: a[k] });
        var f2 = body.querySelector('.ch-c button,.ch-card'); if (f2) try { f2.focus({ preventScroll: true }); } catch (x) {}
      }
    });
    draw();
  }
  function init() { fixLinks(document); var c = document.getElementById('abj-ch'); if (c) chooser(c); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
