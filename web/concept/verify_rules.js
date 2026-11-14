/* Run on the live site (any abjkitchensandbedrooms.co.uk tab). await abjVerify(paths, sha)
   Checks each published page for the 14 Nov 2026 wording and data changes:
   no "10-year", every "12-month guarantee" sentence says "minimum" (tiles say 12-month+),
   payment terms / offers deposit wording, JSON-LD parses, town City objects carry sameAs,
   and the phone layer is the expected commit. Writes a report into <article id="dd">. */
window.abjVerify = async function (paths, sha) {
  const out = [];
  for (const p of paths) {
    try {
      const r = await fetch(p + '?nc=' + Date.now(), { cache: 'no-store' });
      if (r.status !== 200) { out.push(p + ' HTTP ' + r.status); continue; }
      const h = await r.text();
      const a = h.search(/<!-- ABJ MOBILE \(phone layer/), b = h.indexOf('<!-- /ABJ MOBILE -->');
      const body = (a > -1 && b > a) ? h.slice(0, a) + h.slice(b) : h;
      const txt = body.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|\s+/g, ' ');
      const issues = [];
      if (/10-year|10 yrs|ten-year/i.test(txt)) issues.push('10-year');
      const bare = (txt.match(/.{0,25}(?<!minimum |Minimum )12-month guarantee/g) || []).filter(s => !/12-month\+/.test(s));
      if (bare.length) issues.push('bare12:' + bare.slice(0, 2).join(' / '));
      if (/40% on delivery|10% on completion/.test(txt)) issues.push('old-deposit');
      if (/e\.g\. Ideal4Finance/.test(txt)) issues.push('old-finance');
      const ld = [...h.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
      let cities = 0, cityNoSame = 0, bad = 0;
      ld.forEach(s => { try { const j = JSON.parse(s); JSON.stringify(j, (k, v) => { if (v && v['@type'] === 'City') { cities++; if (!v.sameAs) cityNoSame++; } return v; }); } catch (e) { bad++; } });
      if (bad) issues.push('LD-parse x' + bad);
      if (cityNoSame) issues.push('city-no-sameAs x' + cityNoSame);
      if (/King&rsquo;s/.test(ld.join(''))) issues.push('LD-rsquo');
      const layer = (h.match(/abj-social-media@([0-9a-f]{7})\/brochures/) || [])[1] || '-';
      if (sha && a > -1 && layer !== sha) issues.push('layer@' + layer);
      out.push(p + ' | cities ' + cities + ' | ' + (issues.length ? 'ISSUES ' + issues.join(' ; ') : 'ok'));
    } catch (e) { out.push(p + ' ERR ' + e.message); }
  }
  let d = document.getElementById('dd'); if (!d) { d = document.createElement('article'); d.id = 'dd'; document.body.prepend(d); }
  d.textContent = out.join('\n');
  return out.filter(l => !/\| ok$/.test(l)).length + ' with issues of ' + out.length;
};
