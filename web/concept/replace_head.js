/* Run on any tilda.cc tab (e.g. /projects/editheadcode/...). Needs replace_rules.js loaded (ABJ_RULES, abjApplyRules).
   await HEADX(ids, {publish:true, dry:false})
   Applies ABJ_RULES to each page's own HEAD code (Page settings > More > HTML code for the HEAD), where the
   service-page JSON-LD lives. Saves the old head code to IndexedDB abj_home_bak/b as '<id>-head-before-rules-20261114',
   saves only when something changed, then publishes that one page. Results in window.RESH. */
window.RESH = window.RESH || [];
window.HEADX = async function (ids, o) {
  o = o || {};
  const enc = obj => Object.entries(obj).map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&');
  const post = async (url, body) => (await fetch(url, { method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' }, body: enc(body) })).text();
  const db = await new Promise((res, rej) => { const r = indexedDB.open('abj_home_bak'); r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains('b')) r.result.createObjectStore('b'); }; r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const put = (k, v) => new Promise((res, rej) => { const t = db.transaction('b', 'readwrite'); t.objectStore('b').put(v, k); t.oncomplete = res; t.onerror = () => rej(t.error); });
  for (const id of ids) {
    try {
      // same call the head-code editor makes; the stored code comes back HTML-escaped, decoded once like the editor does
      const j = JSON.parse(await post('/projects/get/getheadcode/', { comm: 'getheadcode', projectid: '6121364', pageid: String(id), csrf: getCSRF() }));
      if (!j.page || typeof j.page.headcode !== 'string') throw new Error('no headcode');
      const ta = document.createElement('textarea'); ta.innerHTML = j.page.headcode;
      const old = ta.value;
      const { code, hits } = abjApplyRules(old, ABJ_RULES);
      if (code === old) { RESH.push({ id, saved: 0 }); continue; }
      if (code.length < old.length) throw new Error('shrunk');
      let p = '';
      if (!o.dry) {
        await put(id + '-head-before-rules-20261114', old);
        const r = await post('/projects/submit/', { comm: 'editpageheadcode', projectid: '6121364', pageid: String(id), headcode: code, csrf: getCSRF() });
        if (r.trim() !== 'OK') throw new Error('save ' + r.slice(0, 60));
        if (o.publish !== false) {
          const q = await post('/page/publish/', { comm: 'pagepublish', pageid: String(id), csrf: getCSRF(), returnjson: 'yes' });
          p = q.includes('publishonepage') ? 'pub' : 'PUBFAIL ' + q.slice(0, 40);
        }
      }
      RESH.push({ id, saved: 1, hits, p });
    } catch (e) { RESH.push({ id, err: String(e.message || e).slice(0, 120) }); }
    await new Promise(r => setTimeout(r, 400));
  }
  RESH.push({ done: ids.length });
};
