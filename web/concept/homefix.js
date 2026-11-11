/* Homepage (11 Nov 2026, from the visual review): featured project straight after the four main rooms, "Everywhere else in your
   home" after it; a slightly darker fade behind the hero text (video and wording unchanged). abjHome(code) -> code. */
(function () {
  const W = typeof window !== 'undefined' ? window : globalThis;
  W.abjHome = function (code) {
    let c = code;
    if (!c.includes('aria-label="More rooms"')) {
      const m = c.match(/\n <div class="more">[\s\S]*?\n <\/div>\n(?=<\/section>\s*<section class="fp")/);
      if (!m) throw new Error('"Everywhere else" block not found');
      c = c.replace(m[0], '\n');
      const f = c.match(/<section class="fp"[\s\S]*?<\/div><\/section>/);
      if (!f) throw new Error('featured project not found');
      c = c.replace(f[0], f[0] + '\n\n<section class="rooms rooms-more" aria-label="More rooms">' + m[0].replace(/\n$/, '') + '\n</section>');
    }
    if (!c.includes('#kc .hero.hm:not(.sm):after')) {
      const css = '#kc .hero.hm:not(.sm):after{background:linear-gradient(90deg,rgba(8,14,13,.72) 0%,rgba(8,14,13,.4) 45%,rgba(8,14,13,0) 75%),linear-gradient(0deg,rgba(8,14,13,.6) 0%,rgba(8,14,13,0) 50%)}'
        + '#kc .hero.hm:not(.sm) h1,#kc .hero.hm:not(.sm) p{text-shadow:0 1px 18px rgba(0,0,0,.28)}'
;
      const i = c.indexOf('</style>'); if (i < 0) throw new Error('no style');
      c = c.slice(0, i) + css + c.slice(i);
    }
    return c;
  };
})();
