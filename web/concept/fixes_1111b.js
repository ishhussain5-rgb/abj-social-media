/* 11 Nov 2026, second visual review.
   abjMenu(code): in the full-screen menu, Projects moves to straight after Media walls (same order as the desktop header);
   items renumbered 01-12, data-i and stagger delays rewritten, and the hover-preview photos reordered to match.
   abjHomeMobile(code): homepage only, phones (<=760px): a darker fade from the bottom (where the text sits) and a slightly
   smaller headline. Video and wording unchanged. */
(function () {
  const W = typeof window !== 'undefined' ? window : globalThis;
  W.abjMenu = function (code) {
    const rx = /<li><a href="[^"]*" data-i="\d+"(?: class="on")? style="transition-delay:[\d.]+s"><small>\d+<\/small>[^<]+<\/a><\/li>/g;
    const m = code.match(/(?:<li><a href="[^"]*" data-i="\d+"(?: class="on")? style="transition-delay:[\d.]+s"><small>\d+<\/small>[^<]+<\/a><\/li>)+/);
    if (!m) throw new Error('menu list not found');
    const items = m[0].match(rx);
    const label = s => s.match(/<\/small>([^<]+)<\/a>/)[1];
    const pi = items.findIndex(s => label(s) === 'Projects'), mi = items.findIndex(s => label(s) === 'Media walls');
    if (pi < 0 || mi < 0) throw new Error('Projects or Media walls missing');
    if (pi === mi + 1) return code;                       // already done
    const order = items.map((_, i) => i); order.splice(pi, 1); order.splice(mi + 1, 0, pi);
    const out = order.map((src, k) => items[src]
      .replace(/data-i="\d+"/, 'data-i="' + k + '"')
      .replace(/transition-delay:[\d.]+s/, 'transition-delay:' + (0.05 + 0.03 * k).toFixed(2) + 's')
      .replace(/<small>\d+<\/small>/, '<small>' + String(k + 1).padStart(2, '0') + '</small>')).join('');
    let c = code.replace(m[0], out);
    const r = c.match(/(<div class="mm-r" aria-hidden="true">)((?:<img [^>]*>)+)/);
    if (!r) throw new Error('menu photos not found');
    const imgs = r[2].match(/<img [^>]*>/g);
    if (imgs.length !== items.length) throw new Error('photos ' + imgs.length + ' vs items ' + items.length);
    const re = order.map(src => imgs[src]);
    c = c.replace(r[0], r[1] + re.join(''));
    return c;
  };
  W.abjHomeMobile = function (code) {
    const css = '/*abj-home-mobile*/@media (max-width:760px){#kc .hero.hm:not(.sm):after{background:linear-gradient(0deg,rgba(8,14,13,.8) 0%,rgba(8,14,13,.5) 40%,rgba(8,14,13,.12) 70%,rgba(8,14,13,0) 85%)}#kc .hero.hm:not(.sm) .kick{display:none}#kc .hero.hm:not(.sm) h1{font-size:32px;line-height:1.08;margin:0 0 16px}}/*/abj-home-mobile*/';
    let c = code.includes('/*/abj-home-mobile*/') ? code.replace(/\/\*abj-home-mobile\*\/[\s\S]*?\/\*\/abj-home-mobile\*\//, '')
      : code.replace(/\/\*abj-home-mobile\*\/@media \(max-width:760px\)\{[^{}]*(\{[^{}]*\}[^{}]*)*\}/, '');
    const i = c.indexOf('</style>'); if (i < 0) throw new Error('no style');
    return c.slice(0, i) + css + c.slice(i);
  };
})();
