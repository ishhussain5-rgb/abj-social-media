/* Editor helper: apply abjMenu to this page's new-design block, save and publish this one page. */
(async function () {
  const W = ms => new Promise(r => setTimeout(r, ms));
  window.abjRunMenu = async function () {
    if (/DEV|private/.test(document.title)) throw new Error('DEV page');
    for (let i = 0; i < 20 && !document.querySelector('.record pre code'); i++) await W(500);
    const out = [];
    for (const rec of document.querySelectorAll('.record')) {
      if (rec.getAttribute('off') === 'y') continue;
      const c = (rec.querySelector('pre code') || {}).textContent || '';
      if (!c.includes('id="kc-hd"')) continue;
      const n = window.abjMenu(c);
      if (n === c) { out.push('nochange'); continue; }
      if (Math.abs(n.length - c.length) > 40) throw new Error('diff ' + (n.length - c.length));
      const r = await tp__fetch({ url: '/page/submit/', body: { comm: 'saverecord', pageid: window.pageid, recordid: rec.getAttribute('recordid'), onlythisfield: 'code', code: n, csrf: getCSRF() }, explanation: 'save', silent: true });
      out.push('menu:' + String(r).trim());
    }
    let pub = '';
    if (out.some(x => /OK/.test(x))) { const p = JSON.parse(await tp__fetch({ url: '/page/publish/', body: { comm: 'pagepublish', pageid: window.pageid, csrf: getCSRF(), returnjson: 'yes' }, explanation: 'page publishing', silent: true })); pub = 'pub ' + (p.pageid == window.pageid); }
    return document.title.slice(7, 28) + ' ' + out.join(',') + ' ' + pub;
  };
})();
