/* Editor helper: apply abjLight to every switched-on block of this page, save, then publish this one page. */
(function () {
  const W = ms => new Promise(r => setTimeout(r, ms));
  window.abjRunLight = async function (publish) {
    if (/DEV|private/.test(document.title)) throw new Error('DEV page');
    for (let i = 0; i < 20 && !document.querySelector('.record pre code'); i++) await W(500);
    const out = []; let saved = 0;
    for (const rec of document.querySelectorAll('.record')) {
      if (rec.getAttribute('off') === 'y') continue;
      const c = (rec.querySelector('pre code') || {}).textContent || '';
      if (!c.includes('abj-social-media@')) continue;
      const n = window.abjLight(c); const k = window.abjLight.last;
      if (!k) continue;
      if (/10-year guarantee|10 yrs/.test(n)) throw new Error('10-year in ' + rec.getAttribute('recordid'));
      const r = await tp__fetch({ url: '/page/submit/', body: { comm: 'saverecord', pageid: window.pageid, recordid: rec.getAttribute('recordid'), onlythisfield: 'code', code: n, csrf: getCSRF() }, explanation: 'save', silent: true });
      if (String(r).trim() !== 'OK') throw new Error('save failed ' + rec.getAttribute('recordid'));
      out.push(k); saved++;
    }
    let pub = '';
    if (saved && publish !== false) { const p = JSON.parse(await tp__fetch({ url: '/page/publish/', body: { comm: 'pagepublish', pageid: window.pageid, csrf: getCSRF(), returnjson: 'yes' }, explanation: 'page publishing', silent: true })); pub = 'pub ' + (p.pageid == window.pageid); }
    return window.pageid + ' ' + document.title.slice(7, 30) + ' swaps:' + out.join('+') + ' ' + pub;
  };
})();
