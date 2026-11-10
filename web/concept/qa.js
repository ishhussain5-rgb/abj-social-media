/* Automatic page checks for the DEV pages. Load on the site origin, then:
     abjQARun(['/home-dev-r7m3k', ...])   -> results collect in window.__qa (window.__qaDone when finished)
   Each page is opened in an off-screen iframe at 1905x911 and 390x844 and checked for:
   low-contrast text, horizontal overflow, broken or blurry images, leftover placeholders and empty links. */
(function () {
  const lum = c => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r, g, b] = m.slice(0, 3).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return { L: .2126 * r + .7152 * g + .0722 * b, a: m[3] === undefined ? 1 : +m[3] }; };
  const ratio = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  window.abjQA = function (doc, win, W) {
    const out = [], root = doc.getElementById('kc'); if (!root) return ['no #kc'];
    doc.querySelectorAll('#kc .rv').forEach(e => e.classList.add('in'));
    doc.querySelectorAll('#kc details').forEach(d => d.open = true);
    if (doc.documentElement.scrollWidth > W + 1) out.push('page overflows sideways (' + doc.documentElement.scrollWidth + 'px)');
    const hidden = e => e.closest('.mm,.ck,[hidden],template,noscript,.lb') || win.getComputedStyle(e).visibility === 'hidden';
    // contrast
    const seen = new Set();
    for (const e of root.querySelectorAll('*')) {
      const own = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1); if (!own) continue;
      const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || hidden(e)) continue;
      const cs = win.getComputedStyle(e); if (+cs.opacity === 0) continue;
      let p = e, bg = null, img = false;
      while (p && p.nodeType === 1) {
        const s = win.getComputedStyle(p);
        if (s.backgroundImage && s.backgroundImage !== 'none') { img = true; break; }
        const l = lum(s.backgroundColor); if (l && l.a > .5) { bg = l; break; }
        if (p.matches('figure,.hero,.pan a,.card figure,.bk figure')) { img = true; break; }
        p = p.parentElement;
      }
      if (img) continue;
      if (e.closest('.hero,.pan,.bk figure')) continue;
      const fg = lum(cs.color); if (!fg) continue;
      const bgL = bg ? bg.L : 1;
      const k = ratio(fg.L, bgL);
      if (k < 2.6) { const t = e.textContent.trim().replace(/\s+/g, ' ').slice(0, 50); if (!seen.has(t)) { seen.add(t); out.push('hard to read (' + k.toFixed(1) + ':1): "' + t + '"'); } }
    }
    // images
    for (const i of root.querySelectorAll('img')) {
      if (hidden(i)) continue; const r = i.getBoundingClientRect();
      if (i.complete && i.naturalWidth === 0 && i.getAttribute('src')) out.push('broken image: ' + i.getAttribute('src').slice(-60));
      else if (i.naturalWidth && r.width > 240 && r.width > i.naturalWidth * 1.35) out.push('blurry image (' + i.naturalWidth + 'px shown at ' + Math.round(r.width) + 'px): ' + i.getAttribute('src').slice(-50));
    }
    // text placeholders
    const txt = root.innerText;
    for (const re of [/\{[A-Z0-9]{2,}\}/, /%%[A-Z0-9]+%%/, /\bundefined\b/, /\bNaN\b/, /&amp;|&[a-z]+;/]) { const m = txt.match(re); if (m) out.push('leftover text: ' + m[0]); }
    for (const a of root.querySelectorAll('a,button')) { const r = a.getBoundingClientRect(); if (hidden(a) || r.width < 2) continue; if (!a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('img')) out.push('empty link/button: ' + (a.getAttribute('href') || a.className)); }
    // wide elements (not inside sideways rails)
    for (const e of root.querySelectorAll('section *')) {
      const r = e.getBoundingClientRect(); if (r.width < 2 || hidden(e) || e.closest('.rail,.pan,.gg,.mm,.rooms,.proj')) continue;
      if (r.right > W + 4 && r.left < W) { out.push('element runs off screen: ' + e.tagName.toLowerCase() + '.' + (e.className || '').toString().split(' ')[0]); break; }
    }
    return out;
  };
  window.abjQARun = async function (paths, sizes) {
    sizes = sizes || [[1905, 911], [390, 844]]; window.__qa = []; window.__qaDone = false;
    for (const p of paths) for (const [w, h] of sizes) {
      try {
        const f = document.createElement('iframe'); f.style.cssText = 'position:fixed;left:-' + (w + 50) + 'px;top:0;width:' + w + 'px;height:' + h + 'px;border:0';
        f.src = p + (p.includes('?') ? '&' : '?') + 'qa=' + Date.now(); document.body.appendChild(f);
        await Promise.race([new Promise(r => f.onload = r), new Promise(r => setTimeout(r, 20000))]);
        const d = f.contentDocument; d.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager');
        await new Promise(r => setTimeout(r, 3500));
        const res = window.abjQA(d, f.contentWindow, w);
        window.__qa.push((w > 500 ? 'desktop ' : 'phone   ') + p + (res.length ? '\n   - ' + res.join('\n   - ') : '  OK'));
        f.remove();
      } catch (e) { window.__qa.push(p + ' ERROR ' + e); }
    }
    window.__qaDone = true;
  };
})();
