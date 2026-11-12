/* Live block code for the 9 gap pages (12 Nov 2026): node golive_gap.js -> out-live/<slug>.html
   out-new (DEV-ready) -> DEV links to live (linkmap.json) -> link-text rewording (abjAnchors) -> abjSeoFix. Footer scripts are added in the editor. */
global.window = global; const fs = require('fs'); const D = __dirname + '/';
require(D + 'lighten.js'); require(D + 'site_polish.js'); require(D + 'tilda_golive.js'); const P = window.abjPolishParts;
window.__abjDims = JSON.parse(fs.readFileSync(D + 'imgdims.json', 'utf8'));
const map = JSON.parse(fs.readFileSync(D + 'linkmap.json', 'utf8'));
for (const s of (process.argv.slice(2).length ? process.argv.slice(2) : ['kitchen-design', 'kitchen-cabinets', 'supply-only', 'utility-boot', 'showroom', 'bespoke-vs', 'st-neots', 'corby', 'kettering'])) {
  let c = fs.readFileSync(D + 'out-new/' + s + '.html', 'utf8');
  const x = window.abjLive(c, map); if (x.left.length) throw s + ' DEV links left: ' + x.left.join(', ');
  c = P.abjAnchors(x.html); c = window.abjSeoFix(c);
  if (!c.includes('desktop: booking buttons on one line')) throw s + ' lost compact css';
  if ((c.match(/<h1\b/g) || []).length !== 1) throw s + ' h1';
  fs.writeFileSync(D + 'out-live/' + s + '.html', c);
  console.log(s, 'links changed', x.n, 'len', c.length, 'wh', (c.match(/ data-wh/g) || []).length);
}
