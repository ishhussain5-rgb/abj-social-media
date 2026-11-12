/* Internal links to the 12 Nov 2026 gap pages (Ish approved). Runs in the Tilda projects page.
   abjLinks(code, alias) -> {code, done}: in the shared footer adds St Neots, Corby and Kettering to "Areas we cover",
   "Kitchen design" under Rooms, "Utility & boot rooms" under More, and links "Showroom & workshop" to the showroom page.
   On the kitchens, storage and hallways pages it also adds related links to the "In detail" link row. Only inserts; idempotent.
   abjLinkRun(ids) patches the switched-on new-design block of each page, keeps a backup in IndexedDB abj_svc_bak
   ('<page>-before-links-20261112'), saves and publishes that one page. Progress in window.__lk. */
window.abjLinks = function (c, alias) {
  const done = [];
  const fi = c.indexOf('<div class="ft" role="contentinfo"');
  if (fi < 0) return { code: c, done: ['no footer'] };
  let ft = c.slice(fi);
  const kit = ft.match(/<li><a href="(\/bespoke-kitchens(?:-dev-k7q2)?)">(?:Bespoke kitchens|Kitchens)<\/a><\/li>/g);
  const dev = kit && kit.length === 1 ? kit[0].includes('-dev-') : null;
  const U = (live, d) => dev ? live + '-dev-' + d : live;
  if (dev === null) done.push('rooms:not found');
  else if (ft.includes('kitchen-design-peterborough')) done.push('rooms:already');
  else { ft = ft.replace(kit[0], kit[0] + '<li><a href="' + U('/kitchen-design-peterborough', 'd4k8') + '">Kitchen design</a></li>'); done.push('rooms'); }
  const hall = ft.match(/<li><a href="\/bespoke-hallways(?:-dev-h4j8)?">Hallways &amp; stairs<\/a><\/li>/g);
  if (ft.includes('utility-boot-rooms')) done.push('more:already');
  else if (hall && hall.length === 1 && dev !== null) { ft = ft.replace(hall[0], hall[0] + '<li><a href="' + (dev ? '/utility-boot-rooms-dev-u3b9' : '/utility-boot-rooms-peterborough') + '">Utility &amp; boot rooms</a></li>'); done.push('more'); }
  else done.push('more:not found');
  const ad = '<address>Showroom &amp; workshop<br>';
  if (ft.includes('kitchen-showroom-peterborough')) done.push('visit:already');
  else if (ft.split(ad).length === 2 && dev !== null) { ft = ft.replace(ad, '<address><a href="' + (dev ? '/kitchen-showroom-peterborough-dev-r8m4' : '/kitchen-showroom-peterborough') + '">Showroom &amp; workshop</a><br>'); done.push('visit'); }
  else done.push('visit:not found');
  const ai = ft.indexOf('<div class="ft-a">'), aj = ai < 0 ? -1 : ft.indexOf('</div>', ai);
  if (ai < 0 || aj < 0) done.push('areas:not found');
  else {
    const seg = ft.slice(ai, aj);
    const cam = seg.match(/<a href="\/fitted-kitchens-bedrooms-cambridge(-dev-s4w2)?">Cambridge<\/a>/);
    if (seg.includes('st-neots')) done.push('areas:already');
    else if (!cam) done.push('areas:no cambridge');
    else {
      const d = !!cam[1];
      const add = [['st-neots', 'St Neots', 'n3s7'], ['corby', 'Corby', 'c9r2'], ['kettering', 'Kettering', 'k4t6']]
        .map(([s, n, k]) => '<a href="/fitted-kitchens-bedrooms-' + s + (d ? '-dev-' + k : '') + '">' + n + '</a>').join('');
      ft = ft.slice(0, ai) + seg.replace(cam[0], cam[0] + add) + ft.slice(aj); done.push('areas');
    }
  }
  c = c.slice(0, fi) + ft;
  // related links in the "In detail" section of three room pages
  const REL = {
    kitchens: [['/kitchen-design-peterborough', 'd4k8', 'Kitchen design service'], ['/kitchen-cabinets-peterborough', 'c5u2', 'Kitchen cabinets'],
      ['/supply-only-kitchens', 's7q3', 'Supply-only kitchens'], ['/bespoke-vs-off-the-shelf-kitchens', 'v6g2', 'Bespoke vs off-the-shelf'],
      ['/kitchen-showroom-peterborough', 'r8m4', 'Visit our showroom']],
    storage: [['/utility-boot-rooms', 'u3b9', 'Utility &amp; boot rooms']],
    hallways: [['/utility-boot-rooms', 'u3b9', 'Utility &amp; boot rooms']]
  };
  const page = /^\/bespoke-kitchens/.test(alias) ? 'kitchens' : /^\/bespoke-storage/.test(alias) ? 'storage' : /^\/bespoke-hallways/.test(alias) ? 'hallways' : null;
  if (page) {
    const ri = c.indexOf('<div class="rel">');
    if (ri < 0) done.push('rel:not found');
    else if (c.slice(ri, c.indexOf('</div>', ri)).includes(REL[page][0][2].replace('&amp;', '&')) || c.slice(ri, c.indexOf('</div>', ri)).includes(REL[page][0][2])) done.push('rel:already');
    else {
      const LIVE = { '/supply-only-kitchens': '/supply-only-kitchens-peterborough', '/utility-boot-rooms': '/utility-boot-rooms-peterborough' };
      const add = REL[page].map(([u, k, t]) => '<a href="' + (dev ? u + '-dev-' + k : (LIVE[u] || u)) + '">' + t + '</a>').join('');
      c = c.slice(0, ri) + '<div class="rel">' + add + c.slice(ri + '<div class="rel">'.length); done.push('rel+' + REL[page].length);
    }
  }
  return { code: c, done };
};
