/* abjImgAudit(paths, width, height, thr): load each page in a hidden iframe of the given size and list images shown larger
   than their real pixel size (object-fit: cover aware). The real size is read by loading currentSrc on its own, because with
   srcset the browser reports a density-adjusted naturalWidth. Results in window.__ia. */
window.__ia = [];
window.abjImgAudit = async function (paths, WW, HH, thr) {
  const W = ms => new Promise(r => setTimeout(r, ms));
  const real = u => new Promise(r => { const i = new Image(); i.onload = () => r([i.naturalWidth, i.naturalHeight]); i.onerror = () => r([0, 0]); i.src = u; });
  for (const p of paths) {
    let f;
    try {
      f = document.createElement('iframe'); f.style.cssText = 'position:fixed;left:0;top:0;opacity:0;pointer-events:none;border:0;width:' + WW + 'px;height:' + HH + 'px';
      f.src = p + (p.includes('?') ? '&' : '?') + 'ia=' + Date.now(); document.body.append(f);
      for (let i = 0; i < 40; i++) { await W(500); try { if (f.contentDocument.readyState === 'complete' && f.contentDocument.querySelector('img')) break; } catch (e) {} }
      await W(2000);
      const d = f.contentDocument, w = f.contentWindow;
      d.querySelectorAll('img').forEach(i => { i.loading = 'eager'; });
      w.scrollTo(0, d.body.scrollHeight); await W(1800); w.scrollTo(0, 0); await W(700);
      const rows = [];
      for (const i of d.querySelectorAll('img')) {
        if (i.closest('.mm,header,nav')) continue;
        const r = i.getBoundingClientRect(); if (!r.width || !i.complete || !i.currentSrc) continue;
        const [nw, nh] = await real(i.currentSrc); if (!nw) continue;
        const cs = w.getComputedStyle(i);
        const sc = cs.objectFit === 'cover' ? Math.max(r.width / nw, r.height / nh) : r.width / nw;
        if (sc > thr) rows.push({ file: i.currentSrc.split('/').pop().split('?')[0], src: i.currentSrc, nw, nh, bw: Math.round(r.width), bh: Math.round(r.height),
          sc: +sc.toFixed(2), hero: i.classList.contains('hi'), srcset: !!i.getAttribute('srcset') || !!(i.parentElement && i.parentElement.tagName === 'PICTURE'), alt: (i.alt || '').slice(0, 60) });
      }
      window.__ia.push({ p, w: WW, rows });
    } catch (e) { window.__ia.push({ p, err: String(e) }); } finally { if (f) f.remove(); }
  }
  window.__ia.push('DONE');
};
