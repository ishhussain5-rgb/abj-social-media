/* Visual review fixes (11 Nov 2026). window.abjFix.{gallery, booking, ihTop, projects}(code) -> code. Each throws if its target is missing. */
(function () {
  const W = typeof window !== 'undefined' ? window : globalThis;
  // Gallery: show the room types mixed (round-robin by category, in filter order) so the first screen is not 16 kitchens;
  // the white-bordered photo with the old "Made by" watermark goes to the end of the kitchens.
  const LAST = ['abj-white-handleless.jpg'];
  const gallery = code => {
    const m = code.match(/(<div class="gg" id="kc-gg">)([\s\S]*?)(\n <\/div>\s*<div class="gm">)/);
    if (!m) throw new Error('gallery grid not found');
    const items = m[2].match(/<a class="gi"[\s\S]*?<\/a>/g) || [];
    if (items.length < 20) throw new Error('only ' + items.length + ' gallery items');
    const cats = []; const by = {};
    for (const it of items) { const c = (it.match(/data-c="([^"]+)"/) || [])[1]; if (!by[c]) { by[c] = []; cats.push(c); } by[c].push(it); }
    for (const c of cats) { const keep = by[c].filter(i => !LAST.some(n => i.includes(n))), last = by[c].filter(i => LAST.some(n => i.includes(n))); by[c] = keep.concat(last); }
    const out = []; for (let i = 0; out.length < items.length; i++) for (const c of cats) if (by[c][i]) out.push(by[c][i]);
    return code.replace(m[0], m[1] + '\n  ' + out.join('\n  ') + m[3]);
  };
  // Booking: the postcode result line picked up the white product-card style (#kc .pc) and showed as an empty white box.
  const booking = code => {
    const old = '#kc .bf .pc{margin-top:6px;font-size:12.5px;color:var(--g2);min-height:0}';
    if (!code.includes(old)) { if (code.includes('#kc .bf .pc:empty{display:none}')) return code; throw new Error('booking .pc rule not found'); }
    return code.replace(old, '#kc .bf .pc{margin-top:6px;font-size:12.5px;color:var(--g2);min-height:0;background:none;padding:0;display:block}#kc .bf .pc:empty{display:none}');
  };
  // Pages whose first section is the dark .ih intro: the old site head adds "kd-first" (padding-top:48px !important on desktop),
  // which pushed the label under the fixed header. Restore the intended spacing.
  const IH = '#kc .ih{position:relative;';
  const ihTop = code => {
    if (code.includes('#kc .ih.kd-first')) return code;
    const i = code.indexOf('</style>'); if (i < 0) throw new Error('no style');
    return code.slice(0, i) + '@media (min-width:821px){html:not(#kd-a):not(#kd-b) #kc .ih.kd-first{padding-top:calc(86px + clamp(56px,7vw,120px))!important}}' + code.slice(i);
  };
  // "Projects" in the header and the menu: the gallery instead of the Kings Road case study.
  const projects = code => {
    // the footer already lists Gallery, so its Projects link becomes "Case study" (still Kings Road)
    code = code.split('<li><a href="/case-study-kings-road-kitchen-peterborough">Projects</a></li>').join('<li><a href="/case-study-kings-road-kitchen-peterborough">Case study</a></li>');
    const n0 = (code.match(/href="\/case-study-kings-road-kitchen-peterborough"[^>]*>(\s*<[^>]+>\s*\d+\s*<\/[^>]+>\s*)?Projects</g) || []).length;
    return { n: n0, code: code.replace(/href="\/case-study-kings-road-kitchen-peterborough"([^>]*>(?:\s*<[^>]+>\s*\d+\s*<\/[^>]+>\s*)?Projects<)/g, 'href="/gallery"$1') };
  };
  W.abjFix = { gallery, booking, ihTop, projects };
})();
