/* Guarantee wording (11 Nov 2026): the site said "10-year guarantee", but ABJ's own guarantee is 12 months (T&Cs 8.1).
   Longer warranties on doors, cabinets and fittings are the manufacturers' and depend on what the customer chooses (T&Cs 8.2).
   abjG.fix(text) rewrites block code, page settings and head code. Run in the Tilda editor (Claude in Chrome). */
(function () {
  const Q = "(?:’|&rsquo;|')";
  const T = [
    [/We offer a 10-year manufacturer guarantee on the furniture we make, covering defects in materials and workmanship, with project details confirmed in your quote\./g,
      'Our own work carries a 12-month guarantee covering defects in materials and workmanship. Doors, cabinets and fittings can also carry longer manufacturer warranties, depending on what you choose, and your quote lists them.'],
    [/What is the ABJ 10-year guarantee\?/g, 'What guarantee do you give?'],
    [new RegExp('Every project we install comes with a 10-year guarantee on cabinetry and installation quality\\. Hardware and appliances are also covered by their manufacturers' + Q + ' own warranties, which our team helps you register\\.', 'g'),
      m => 'Every project we install comes with our 12-month guarantee on the furniture we make and the installation. Doors, cabinets, hardware and appliances can also carry longer manufacturers' + (m.match(/manufacturers(’|&rsquo;|')/) || ['', '’'])[1] + ' warranties, depending on what you choose, and our team helps you register them.'],
    [/Furniture we manufacture carries a 10-year manufacturer guarantee covering defects in materials and workmanship\. Appliances, worktops and third-party components carry their own warranties, all confirmed in writing with your quotation\./g,
      'Furniture we manufacture carries our 12-month guarantee covering defects in materials and workmanship. Doors, cabinets, appliances, worktops and other components can carry longer manufacturer warranties, depending on what you choose, all confirmed in writing with your quotation.'],
    [/<h3>10-year manufacturer guarantee<\/h3><p>Covering defects in the materials and workmanship we produce\.<\/p>/g,
      '<h3>12-month guarantee</h3><p>Covering defects in the materials and workmanship we produce, with manufacturer warranties on top depending on what you choose.</p>'],
    [/comes with a 10-year manufacturer guarantee, along with 0% finance options/g,
      'comes with our 12-month guarantee, plus any manufacturer warranties on the doors, cabinets and fittings you choose, along with 0% finance options'],
    [/A 10-year manufacturer guarantee on our furniture, and 0% finance/g, 'A 12-month guarantee on our furniture, manufacturer warranties depending on what you choose, and 0% finance'],
    [/<b>10 yrs<\/b><span>Manufacturer guarantee<\/span>/g, '<b>12 months</b><span>Guarantee on our work</span>'],
    [/\ba 10-year manufacturer guarantee/g, 'our 12-month guarantee'],
    [/\b10-year manufacturer guarantee/g, '12-month guarantee'],
    [/<b>10-year<\/b>/g, '<b>12-month</b>'],
    [/\b10-year guarantee/g, '12-month guarantee'],
    [/\b10-Year Guarantee/g, '12-Month Guarantee'],
    [/\b10 year guarantee/gi, '12-month guarantee'],
  ];
  const LEFT = /\b(10|ten)[\s ‑-]*(year|yr)s?\b[^<]{0,40}(guarant|warrant)|(guarant|warrant)[^<]{0,30}\b(10|ten)[\s ‑-]*(year|yr)s?\b/i;
  const fix = s => T.reduce((a, [rx, to]) => a.replace(rx, to), s);
  const W = ms => new Promise(r => setTimeout(r, ms));
  const code = rec => ((rec.querySelector('pre code') || {}).textContent || '');
  window.abjG = {
    fix, LEFT,
    // 1) every switched-on block that mentions the old guarantee; returns what changed
    async blocks() {
      const out = [];
      for (const rec of document.querySelectorAll('.record')) {
        if (rec.getAttribute('off') === 'y') continue;
        const c = code(rec); if (!c || !LEFT.test(c) && !/10-year|10 yrs/.test(c)) continue;
        const n = fix(c);
        if (n === c) { out.push(rec.getAttribute('recordid') + ':unchanged'); continue; }
        if (LEFT.test(n)) throw new Error('old guarantee wording left in ' + rec.getAttribute('recordid') + ': ' + (n.match(LEFT) || [''])[0]);
        const r = await tp__fetch({ url: '/page/submit/', body: { comm: 'saverecord', pageid: window.pageid, recordid: rec.getAttribute('recordid'), onlythisfield: 'code', code: n, csrf: getCSRF() }, explanation: 'save', silent: true });
        if (String(r).trim() !== 'OK') throw new Error('save failed ' + rec.getAttribute('recordid'));
        out.push(rec.getAttribute('recordid') + ':' + (c.match(/10-year|10 yrs/g) || []).length + ' fixed');
      }
      return out;
    },
    // 2) page settings (title, descriptions, social text); submits the form only if something changed (the page reloads)
    async settings() {
      showformEditPageSettings_new(window.pageid); await W(3500);
      const f = document.querySelector('#formpageedit'); const ch = [];
      for (const n of ['title', 'descr', 'meta_title', 'meta_descr', 'fb_title', 'fb_descr']) {
        const e = f.querySelector('[name="' + n + '"]'); if (!e) continue;
        const v = fix(e.value); if (v !== e.value) { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); ch.push(n); }
      }
      if (ch.length) setTimeout(() => f.querySelector('.js-ps-popup-submit').click(), 300);
      else { const x = document.querySelector('#formpageedit').closest('.td-popup, .t-popup'); }
      return ch;
    },
    // 3) on the page's head-code editor
    async head() {
      await W(2500);
      const ed = ace.edit(document.querySelector('.ace_editor')); const v = ed.getValue(); const n = fix(v);
      if (n === v) return 'head unchanged';
      ed.setValue(n, -1); td__pageheadcode__saveCode(); await W(2500);
      return 'head fixed';
    },
    // 4) check settings are clean, then publish this one page
    async publish() {
      showformEditPageSettings_new(window.pageid); await W(3500);
      const f = document.querySelector('#formpageedit');
      const bad = ['title', 'descr', 'meta_title', 'meta_descr', 'fb_title', 'fb_descr'].filter(n => { const e = f.querySelector('[name="' + n + '"]'); return e && /10-year/i.test(e.value); });
      if (bad.length) throw new Error('settings still say 10-year: ' + bad.join(','));
      const left = [...document.querySelectorAll('.record')].filter(r => r.getAttribute('off') !== 'y' && /10-year guarantee|10-year manufacturer|<b>10-year<\/b>|10 yrs/.test(code(r))).length;
      if (left) throw new Error(left + ' block(s) still mention 10-year');
      const p = JSON.parse(await tp__fetch({ url: '/page/publish/', body: { comm: 'pagepublish', pageid: window.pageid, csrf: getCSRF(), returnjson: 'yes' }, explanation: 'page publishing', silent: true }));
      return 'published ' + (p.pageid == window.pageid);
    }
  };
})();
