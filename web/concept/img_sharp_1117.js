/* 17 Nov 2026: sharper photos at 1920 wide. Run in a Tilda editor tab after abjrec.js.
   window.__sharpPlan = {pageid: [op, ...]}; op = {key, src, alt, w, h, srcset, sizes, ifNoSrcset}
   key: text that identifies the <img> tag (file name or Tilda folder id). Only the listed attributes change. */
(function () {
  const JD = 'https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@';
  const L = JD + 'f58f336440de04a809f3750794a9529ad9469251/media/l/';
  const O = JD + '69dbc3e188cebfa373bcfe64fceb39654b3a684a/media/';
  const C9 = JD + 'c9b6a43e8a2c02ad59b5f96be569168331082850/media/';
  const BOOK = [{ key: 'kc-book-s.webp', ifNoSrcset: true, srcset: O + 'kc-book-s.webp 733w, ' + L + '69dbc3e-kc-book-l.webp 1200w', sizes: '(max-width:760px) 100vw, 50vw' }];
  const hero = (name, have) => [{ key: '69dbc3e-' + name + '.webp', ifNoSrcset: true, srcset: L + '69dbc3e-' + name + '.webp ' + have + 'w, ' + O + name + '.webp 2200w', sizes: '100vw' }];
  const town = (file, orig, small) => [{ key: file + '-m', srcsetAppend: ', ' + orig + ' 1680w', sizes: '(max-width:760px) 88vw, 783px', needs: small }];
  window.__sharpPlan = {
    73279037: BOOK, 383065903: BOOK, 389698703: BOOK, 343215603: BOOK,
    112290576: hero('kc-booth-l', 1800),
    381737403: hero('kc-handleless-l', 1524),
    381512403: hero('kc-kr-detail-l', 1800).concat([{ key: 'abj-kitchen-copper-g.webp', src: L + '69dbc3e-kc-inframe-l.webp', w: 1200, h: 1800,
      alt: 'Cream in-frame kitchen with glazed wall cabinets and an oak worktop' }]),
    150457663: town('abj-stamford-3', 'https://static.tildacdn.net/tila6139-6538-4266-b035-643637353031/abj-stamford-3.webp', 'w743'),
    150783143: town('abj-bourne-3', 'https://static.tildacdn.net/tila3933-3937-4634-b034-376132333764/abj-bourne-3.webp', 'w654'),
    377674303: [{ key: 'UnderStair36.webp', src: C9 + 'abj-st-us-drawers.webp', w: 1040, h: 1300, alt: 'Deep under-stairs pull-out drawers open' }],
    377674603: [{ key: 'tila3363-3439-4839-b735-393133376232/BespokeSlidingWardro', src: JD + '123050832ba2be74a77bf0f7c632826f8cc5c439/media/abj-w-walkin-drawers.webp', w: 1935, h: 1119,
      alt: 'Walk-in wardrobe with open shelving, shoe racks and pull-out drawers' }],
    377674903: [{ key: 'abj-cab75.webp', src: C9 + 'abj-st-living-alcove.webp', w: 866, h: 1300, alt: 'Living room alcove cabinetry with fluted doors beside an inset fire and TV' }],
    381512703: [{ key: 'abj-kitchen-cream-is.webp', src: L + '69dbc3e-kc-handleless-l.webp', w: 1524, h: 1016, alt: 'Handleless kitchen with a white quartz island under a roof lantern' }],
    383066003: [
      { key: 'BespokeMediaWalls43.webp', src: JD + '0fb9e3f0782074177762b0222e7a4c55feeb00dd/media/abj-mediawalls-A-v-poster.webp', w: 1080, h: 1350,
        alt: 'Media wall with a backlit TV recess, lit shelving and low drawer units' },
      { key: 'BespokeMediaWalls30.webp', src: JD + '0fb9e3f0782074177762b0222e7a4c55feeb00dd/media/abj-mediawalls-B-v-poster.webp', w: 1080, h: 1350,
        alt: 'Media wall with a marble-effect TV panel, slatted timber and lit display cabinets' }]
  };
  const setAttr = (tag, name, val) => {
    const re = new RegExp('\\s' + name + '="[^"]*"');
    return re.test(tag) ? tag.replace(re, ' ' + name + '="' + val + '"') : tag.replace(/^<img/, '<img ' + name + '="' + val + '"');
  };
  /* returns [newCode, count]; throws if an op matches nothing */
  window.__sharpTf = function (code, ops, rec) {
    let n = 0;
    for (const op of ops) {
      let hit = 0;
      code = code.replace(/<img\b[^>]*>/g, tag => {
        if (!tag.includes(op.key)) return tag;
        if (op.needs && !tag.includes(op.needs)) return tag;
        const hasSS = /\ssrcset="/.test(tag);
        if (op.ifNoSrcset && hasSS) return tag;
        let t = tag;
        if (op.src) {
          const old = (t.match(/\ssrc="([^"]*)"/) || [])[1];
          t = setAttr(t, 'src', op.src);
          if (hasSS && old) t = t.replace(/\ssrcset="[^"]*"/, '');
        }
        if (op.w) { t = setAttr(t, 'width', op.w); t = setAttr(t, 'height', op.h); }
        if (op.alt) t = setAttr(t, 'alt', op.alt);
        if (op.srcset) t = setAttr(t, 'srcset', op.srcset);
        if (op.srcsetAppend) { if (t.includes(op.srcsetAppend.trim().split(' ')[0])) return tag; t = t.replace(/\ssrcset="([^"]*)"/, (m, s) => ' srcset="' + s + op.srcsetAppend + '"'); }
        if (op.sizes) t = setAttr(t, 'sizes', op.sizes);
        if (t !== tag) hit++;
        return t;
      });
      n += hit;
    }
    return [code, n];
  };
})();
