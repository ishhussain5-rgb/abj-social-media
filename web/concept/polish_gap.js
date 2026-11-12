/* Post-process the 9 gap pages for Tilda DEV (12 Nov 2026): node polish_gap.js
   abjLight + menu photo swap + booking photo de-dupe + footer titles, then the desktop compact CSS
   (booking buttons on one line, footer fits one screen). abjAnchors runs at go-live (needs live URLs). */
global.window = global; const fs = require('fs'); const D = __dirname + '/';
require(D + 'lighten.js'); require(D + 'site_polish.js'); const P = window.abjPolishParts;
const CSS = fs.readFileSync(D + 'desktop_compact.css', 'utf8').trim();
for (const s of ['kitchen-design', 'kitchen-cabinets', 'supply-only', 'utility-boot', 'showroom', 'bespoke-vs', 'st-neots', 'corby', 'kettering']) {
  let c = fs.readFileSync(D + 'out/' + s + '.html', 'utf8');
  c = window.abjLight(c); c = P.abjMenuImgs(c); const mi = P.abjMenuImgs.changed; c = P.abjBkDedupe(c); c = P.abjFootFh(c);
  if (!c.includes('desktop: booking buttons on one line')) { const i = c.indexOf('</style>'); if (i < 0) throw s + ' no style'; c = c.slice(0, i) + '\n' + CSS + '\n' + c.slice(i); }
  const urls = (c.match(/https?:\/\/[^"'\s,)]+\.(?:webp|jpe?g|png)/gi) || []).filter(u => !/logo|roundel/i.test(u));
  const cnt = {}; urls.forEach(u => { const b = P.base(u); cnt[b] = (cnt[b] || 0) + 1; });
  const rep = Object.entries(cnt).filter(([b, n]) => n > 1);
  fs.writeFileSync(D + 'out-new/' + s + '.html', c); console.log(s, 'menu swaps', mi, 'repeats', JSON.stringify(rep));
}
