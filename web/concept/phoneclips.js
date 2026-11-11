/* Phone hero re-cuts (11 Nov 2026, visual review 2). Phones only: desktop clips, posters and captions are untouched.
   abjPhoneClips(code, 'kitchens'|'home') -> new block code. Throws unless every change lands exactly once. Idempotent. */
(function () {
  const M = 'https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@ba414cdaa7ec55ee3b2973bc6448034aefdd2351/media/';
  const once = (c, rx, to, label) => {
    const n = (c.match(new RegExp(rx.source, rx.flags.includes('g') ? rx.flags : rx.flags + 'g')) || []).length;
    if (n !== 1) throw new Error(label + ': found ' + n + ' times');
    return c.replace(rx, to);
  };
  // phone-only caption(s): data-capm (single clip) and data-capsm (timed list) win over data-cap / data-caps on phones
  const JS_OLD = 'if(mob&&v.dataset.mp)v.poster=v.dataset.mp;';
  const JS_NEW = 'if(mob&&v.dataset.mp)v.poster=v.dataset.mp;if(mob&&v.dataset.capm)v.dataset.cap=v.dataset.capm;if(mob&&v.dataset.capsm)v.dataset.caps=v.dataset.capsm;';
  window.abjPhoneClips = function (code, page) {
    let c = code;
    if (c.includes('ba414cdaa7ec55ee3b2973bc6448034aefdd2351')) return c;
    c = once(c, new RegExp(JS_OLD.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), JS_NEW, 'js');
    if (page === 'kitchens') {
      c = once(c, /(<video data-cap="Dining area &amp; brass sunburst light")/, '$1 data-capm="Sage drinks cabinet, lit glass shelves" data-mp="' + M + 'abj-kitchens-B2-v-poster.webp"', 'B video');
      c = once(c, /(<source media="\(max-width:760px\)" src=")[^"]*abj-kitchens-B-v\.mp4(")/, '$1' + M + 'abj-kitchens-B2-v.mp4$2', 'B phone source');
    } else if (page === 'home') {
      const capsm = '[[0, &quot;Handleless kitchen &amp; copper pendants&quot;], [2.7, &quot;Fitted wardrobes &amp; study desk&quot;], [5.1, &quot;Slatted media wall&quot;], [7.5, &quot;Fluted bedroom wall &amp; display niche&quot;], [9.9, &quot;Hidden drinks cabinet&quot;], [11.4, &quot;Full-height fitted wardrobes&quot;]]';
      c = once(c, /data-mp="[^"]*abj-home-montage-v-poster\.webp"/, 'data-capsm="' + capsm + '" data-mp="' + M + 'abj-home-montage2-v-poster.webp"', 'home poster');
      c = once(c, /(<source media="\(max-width:760px\)" src=")[^"]*abj-home-montage-v\.mp4(")/, '$1' + M + 'abj-home-montage2-v.mp4$2', 'home phone source');
    } else throw new Error('page?');
    return c;
  };
})();
