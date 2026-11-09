/* Runs inside the Tilda page editor (tilda.cc/page/?pageid=...). Adds the new-standard block at the top of a DEV page
   and turns the old blocks off (never deletes them). Usage in the editor console:
     await abjSwap({src:'<jsDelivr url of out/<slug>.html>', must:'<text the new code must contain>', mode:'swap'|'legal'|'area'|'blog'})
   mode 'legal' and 'area' fill placeholders from the old blocks' own code, so page text is carried over word for word.
   mode 'blog' keeps Tilda's CMS article list (record type 3271) switched on; the new block moves it into the page.
   A key placeholder {W3F} is filled from the old booking form code so the key never sits in the public repo. */
window.abjSwap = async function (o) {
  const W = ms => new Promise(r => setTimeout(r, ms));
  const ids = () => [...document.querySelectorAll('.record')].map(r => r.getAttribute('recordid'));
  const rec = id => document.getElementById('record' + id);
  const code = id => ((document.querySelector('#record' + id + ' pre code') || {}).textContent || '');
  for (let i = 0; i < 30 && !(ids().length && ids().every(id => rec(id).hasAttribute('off'))); i++) await W(500);
  await W(800);
  let html = await (await fetch(o.src, { cache: 'no-store' })).text();
  if (!html.includes('(DEV, new standard)') || (o.must && !html.includes(o.must))) throw 'bad src ' + html.length;
  const before = ids();
  const keep = id => o.mode === 'blog' && /3271/.test(rec(id).getAttribute('data-record-type') || rec(id).getAttribute('recordtype') || rec(id).className);
  const live = before.filter(i => rec(i).getAttribute('off') !== 'y');
  if (!before.length || !live.length) throw 'records not loaded';
  if (before.some(i => code(i).includes('(DEV, new standard)'))) throw 'already has new block';
  const codes = live.map(code).filter(Boolean);
  if (html.includes('{W3F}')) {
    const k = (codes.join('\n').match(/(?:var W3F=|web3formsAccessKey:)['"]([0-9a-f-]{36})['"]/) || [])[1];
    if (!k) throw 'no form key found'; html = html.split('{W3F}').join(k);
  }
  if (o.mode === 'legal') {
    const x = window.abjLegal(codes[0]); if (!x || x.body.length < 1500) throw 'legal extract failed';
    html = html.replace('<!--LEGAL-->', x.body);
  }
  if (o.mode === 'area') {
    const x = window.abjArea(codes); if (!x.town || !x.INTRO1 || !x.LOCAL || !x.FAQ) throw 'area extract incomplete ' + JSON.stringify({ t: x.town, i: !!x.INTRO1, l: !!x.LOCAL, f: !!x.FAQ });
    for (const k of Object.keys(x)) html = html.split('%%' + k + '%%').join(x[k]);
    html = html.replace('ABJ Area page (DEV, new standard)', 'ABJ ' + x.town + ' (DEV, new standard)');
    if (/%%[A-Z0-9]+%%/.test(html)) throw 'placeholder left ' + html.match(/%%[A-Z0-9]+%%/)[0];
  }
  const small = live.filter(i => !keep(i)).sort((a, b) => code(a).length - code(b).length)[0];
  await tp__dublicateRecord(small); await W(3000);
  const nid = ids().find(i => !before.includes(i)); if (!nid) throw 'no new record';
  if (code(nid) !== code(small)) throw 'duplicate mismatch';
  const r = await tp__fetch({ url: '/page/submit/', body: { comm: 'saverecord', pageid: window.pageid, recordid: nid, onlythisfield: 'code', code: html }, explanation: 'save code' });
  await tp__updateRecord(nid); await W(2000);
  for (let i = 0; i < 12 && ids()[0] !== nid; i++) tp__upRecord(nid);
  await tp__saveRecordsSort(); await W(1500);
  for (const id of live) { if (keep(id)) continue; await tp__offRecord(id); await W(700); }
  return { title: document.title, nid, small, live: live.length, r: String(r).slice(0, 20), first: ids()[0], on: ids().filter(i => rec(i).getAttribute('off') !== 'y'), len: html.length };
};

window.abjLegal = function (code) {
  const d = new DOMParser().parseFromString('<div>' + code + '</div>', 'text/html');
  d.querySelectorAll('script,style,svg,noscript,button,form,input,select,textarea').forEach(s => s.remove());
  const h1 = d.querySelector('h1'); if (!h1) return null;
  const stop = /Serving Peterborough|Premium Interiors|Book Your Free|GTV hardware|Our expertise|Plan my project/i;
  const out = []; let started = false;
  const clean = n => {
    if (n.nodeType === 3) return n.textContent.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
    if (n.nodeType !== 1) return '';
    const t = n.tagName.toLowerCase(), inner = [...n.childNodes].map(clean).join('');
    if (t === 'strong' || t === 'b') return '<b>' + inner + '</b>';
    if (t === 'em' || t === 'i') return '<i>' + inner + '</i>';
    if (t === 'br') return '<br>';
    if (t === 'a') { const h = n.getAttribute('href') || ''; return /^(https?:|mailto:|tel:|\/)/.test(h) ? '<a href="' + h.replace(/"/g, '&quot;') + '">' + inner + '</a>' : inner; }
    if (['li', 'tr', 'td', 'th', 'ul', 'ol', 'p', 'h2', 'h3', 'h4', 'table', 'tbody', 'thead'].includes(t)) return '<' + t + '>' + inner.trim() + '</' + t + '>';
    return inner;
  };
  for (const e of d.querySelectorAll('h2,h3,h4,p,ul,ol,table')) {
    if (!started) { if (h1.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING) started = true; else continue; }
    if (/^H[234]$/.test(e.tagName) && stop.test(e.textContent)) break;
    if (e.parentElement.closest('ul,ol,table')) continue;
    if (e.tagName === 'P' && e.closest('li')) continue;
    const txt = e.textContent.trim();
    if (!txt || /^[“"].*ABJ were exceptional/.test(txt)) continue;
    out.push(clean(e).replace(/\s+/g, ' '));
  }
  return { h1: h1.textContent.trim(), body: out.join('\n') };
};

window.abjArea = function (codes) {
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const main = new DOMParser().parseFromString('<div>' + codes[0] + '</div>', 'text/html');
  main.querySelectorAll('script,style,svg,form').forEach(s => s.remove());
  const seq = [...main.querySelectorAll('h1,h2,h3,p')], T = e => e.textContent.trim().replace(/\s+/g, ' ');
  const h1 = seq.find(e => e.tagName === 'H1'), H1 = h1 ? T(h1) : '';
  const town = (H1.match(/ in (.+)$/) || [])[1] || '';
  const after = (re, tag) => { const i = seq.findIndex(e => e.tagName === tag && re.test(T(e))); if (i < 0) return []; const out = []; for (let j = i + 1; j < seq.length; j++) { if (seq[j].tagName === 'H2') break; if (seq[j].tagName === 'P' && T(seq[j])) out.push(seq[j]); } return out; };
  const lead = h1 ? seq.slice(seq.indexOf(h1) + 1).find(e => e.tagName === 'P' && T(e) && !/^[“"]/.test(T(e))) : null;
  const intro = after(/^Made to Measure for/i, 'H2');
  const local = after(/^Planning a/i, 'H2').filter(p => !/^Our showroom and workshop are in Peterborough, and we design|^Not sure if your home/.test(T(p)));
  const vill = after(/Surrounding Villages/i, 'H2');
  const dist = after(/^Made in Peterborough$/i, 'H3')[0], dt = dist ? T(dist) : '', m = dt.match(/around (\d+) miles/i);
  const lds = [], faqs = [];
  for (const c of codes) {
    const d = new DOMParser().parseFromString('<div>' + c + '</div>', 'text/html');
    for (const s of d.querySelectorAll('script[type="application/ld+json"]')) {
      const t = s.textContent.trim();
      if (/"LocalBusiness"|"WebSite"/.test(t) && !/FAQPage|WebPage/.test(t)) continue;
      lds.push(t);
      try { const w = o => { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(w); if (o['@type'] === 'FAQPage') o.mainEntity.forEach(q => faqs.push([q.name, q.acceptedAnswer.text])); Object.values(o).forEach(w); }; w(JSON.parse(t)); } catch (e) { }
    }
  }
  return {
    TOWN: esc(town), town, H1: esc(H1), LEAD: lead ? lead.innerHTML.trim() : '',
    INTRO1: intro[0] ? intro[0].innerHTML.trim() : '', INTRO2: intro.slice(1).map(p => p.innerHTML.trim()).join(' '),
    LOCAL: local.map(p => '<p>' + p.innerHTML.trim() + '</p>').join(''), VILLAGES: vill[0] ? vill[0].innerHTML.trim() : '',
    MILES: m ? m[1] : '80', DISTTXT: m ? 'miles from our Peterborough workshop' : 'mile radius around our Peterborough workshop',
    FAQ: faqs.map(f => '<details><summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p></details>').join('\n'),
    LD: lds.map(t => '<script type="application/ld+json">' + t + '</' + 'script>').join('\n')
  };
};
