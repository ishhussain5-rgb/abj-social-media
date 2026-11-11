/* Town pages (11 Nov 2026): replace the sections that were word-for-word the same on all 10 town pages
   (second intro paragraph, "What we make" line, How it works, booking text, "Serving ..." text, FAQs + FAQPage schema)
   with copy written for each town. Data: towns/<slug>.json. Everything else in the block is left exactly as it was.
   Usage in the Tilda editor: abjTownCopy(code, data) -> new code (throws if any section is not found exactly once). */
(function () {
  const plain = h => { const t = document.createElement('textarea'); t.innerHTML = h.replace(/<[^>]+>/g, ''); return t.value; };
  const once = (code, rx, fn, label) => {
    const m = code.match(new RegExp(rx.source, rx.flags.includes('g') ? rx.flags : rx.flags + 'g')) || [];
    if (m.length !== 1) throw new Error(label + ': found ' + m.length + ' times');
    return code.replace(rx, fn);
  };
  window.abjTownCopy = function (code, d) {
    let c = code;
    c = once(c, /(<p style="color:var\(--mut\);max-width:44em;margin-top:28px">)[\s\S]*?(<\/p>)/, (m, a, b) => a + d.intro2 + b, 'intro2');
    c = once(c, /(<h2 style="margin-top:16px">What we make[^<]*<\/h2><\/div><div class="rv" style="display:flex;align-items:flex-end;gap:40px"><p>)[\s\S]*?(<\/p>)/, (m, a, b) => a + d.sty + b, 'sty');
    const steps = d.steps.map((s, i) => '\n  <div class="rv"><i>0' + (i + 1) + '</i><h3>' + s[0] + '</h3><p>' + s[1] + '</p></div>').join('');
    c = once(c, /(<section class="proc">[\s\S]*?<h2 style="margin-top:16px">From first visit to final fitting<\/h2><\/div><p>)[\s\S]*?(<\/p><\/div>\s*<div class="ps">)[\s\S]*?(\s*<\/div>\s*<\/div><\/section>)/,
      (m, a, b, e) => a + d.proc_lead + b + steps + e, 'proc');
    c = once(c, /(<section class="bk"[\s\S]*?<h2>Book your free design visit in [^<]*<\/h2>\s*<p>)[\s\S]*?(<\/p>)/, (m, a, b) => a + d.bk + b, 'bk');
    c = once(c, /(<h2>Serving [^<]*<\/h2>\s*<p>)[\s\S]*?(<\/p>\s*<div class="rel">)/, (m, a, b) => a + d.det + b, 'det');
    const faqHtml = d.faqs.map(q => '<details><summary>' + q[0] + '</summary><p>' + q[1] + '</p></details>').join('\n  ');
    c = once(c, /(<section class="det">[\s\S]*?<div class="rv">\s*)<details>[\s\S]*<\/details>(\s*<\/div>\s*<\/div><\/section>)/, (m, a, b) => a + faqHtml + b, 'faqs');
    c = once(c, /<script type="application\/ld\+json">(\s*\{[\s\S]*?"@type"\s*:\s*"FAQPage"[\s\S]*?)<\/script>/, (m, j) => {
      const o = JSON.parse(j);
      o.mainEntity = d.faqs.map(q => ({ '@type': 'Question', name: plain(q[0]), acceptedAnswer: { '@type': 'Answer', text: plain(q[1]) } }));
      return '<script type="application/ld+json">\n' + JSON.stringify(o, null, 1) + '\n</script>';
    }, 'faq schema');
    return c;
  };
})();
