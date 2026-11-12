/* 12 Nov 2026 (second batch, Ish approved): footer "Areas we cover" + March & Whittlesey and King's Lynn after Kettering;
   kitchens page "In detail" row + Shaker and handleless kitchens after "Visit our showroom". Insert-only, idempotent. */
window.abjLinks2 = function (c, alias) {
  const done = [];
  const fi = c.indexOf('<div class="ft" role="contentinfo"'); if (fi < 0) return { code: c, done: ['no footer'] };
  const ai = c.indexOf('<div class="ft-a">', fi), aj = ai < 0 ? -1 : c.indexOf('</div>', ai);
  if (ai < 0 || aj < 0) done.push('areas:not found');
  else {
    const seg = c.slice(ai, aj);
    const k = seg.match(/<a href="\/fitted-kitchens-bedrooms-kettering(-dev-k4t6)?">Kettering<\/a>/);
    if (seg.includes('kings-lynn')) done.push('areas:already');
    else if (!k) done.push('areas:no kettering');
    else {
      const d = !!k[1];
      const add = '<a href="/fitted-kitchens-bedrooms-' + (d ? 'fenland-dev-f8m3' : 'march-whittlesey-chatteris') + '">March &amp; Whittlesey</a>' +
                  '<a href="/fitted-kitchens-bedrooms-kings-lynn' + (d ? '-dev-k2l7' : '') + '">King&rsquo;s Lynn</a>';
      c = c.slice(0, ai) + seg.replace(k[0], k[0] + add) + c.slice(aj); done.push('areas');
    }
  }
  if (/^\/bespoke-kitchens/.test(alias)) {
    const m = c.match(/<a href="(\/kitchen-showroom-peterborough(?:-dev-r8m4)?)">Visit our showroom<\/a>/);
    if (c.includes('>Shaker kitchens</a><a') && c.includes('>Handleless kitchens</a>')) done.push('rel:already');
    else if (!m) done.push('rel:not found');
    else {
      const d = m[1].includes('-dev-');
      c = c.replace(m[0], m[0] + '<a href="/shaker-kitchens-peterborough' + (d ? '-dev-s4h8' : '') + '">Shaker kitchens</a><a href="/handleless-kitchens-peterborough' + (d ? '-dev-h5d2' : '') + '">Handleless kitchens</a>');
      done.push('rel+2');
    }
  }
  return { code: c, done };
};
