/* Automatic page checks for the DEV pages. Load on the site origin, then:
     abjQARun(['/home-dev-r7m3k', ...])   -> results collect in window.__qa (window.__qaDone when finished)
   Each page is opened in an off-screen iframe at 1905 and 390 wide. Each line of text is scrolled into view
   and what sits under it is read with elementsFromPoint (text over photos/video is skipped).
   Checks: hard-to-read text, sideways overflow, things running off screen, broken or blurry images, clipped text,
   leftover placeholders or HTML entities, empty links, US spellings in visible text. */
(function () {
  const lum = c => { const m = (c || '').match(/[\d.]+/g); if (!m) return null; const [r, g, b] = m.slice(0, 3).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return { L: .2126 * r + .7152 * g + .0722 * b, a: m[3] === undefined ? 1 : +m[3] }; };
  const ratio = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  const US = /\b(color|colors|colored|center|centered|centers|organize|organized|organizing|organization|favorite|favorites|gray|realize|realized|customize|customized|personalize|personalized|optimize|optimized|maximize|minimize|specialize|specialized|catalog|aluminum|cozy|jewelry|neighbor|neighbors|neighborhood|labor|honor|harbor|fulfill|inquire|inquiry|inquiries|license(?=d)|traveler|modeling|canceled|meters|liter|liters|tire|curb)\b/i;
  window.abjQA = function (doc, win, W) {
    const out = [], root = doc.getElementById('kc'); if (!root) return ['no #kc block on the page'];
    doc.documentElement.style.scrollBehavior = 'auto'; doc.body.style.scrollBehavior = 'auto';
    if (doc.documentElement.scrollWidth > W + 1) out.push('page overflows sideways (' + doc.documentElement.scrollWidth + 'px wide)');
    const hidden = e => e.closest('.mm,.ck,[hidden],template,noscript,.lb,.hd,.mbar') || win.getComputedStyle(e).visibility === 'hidden';
    const seen = new Set();
    for (const e of root.querySelectorAll('*')) {
      const own = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 0); if (!own) continue;
      if (hidden(e)) continue;
      const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || r.right < 0 || r.left > W) continue;
      const cs = win.getComputedStyle(e); if (+cs.opacity < .2) continue;
      const t = e.textContent.trim().replace(/\s+/g, ' ');
      if (/^[\d★·\s.()]{1,6}$/.test(t)) continue; // decorative step numbers and stars
      const absY = r.top + win.scrollY + r.height / 2;
      win.scrollTo({ top: Math.max(0, absY - win.innerHeight / 2), behavior: 'instant' });
      const r2 = e.getBoundingClientRect();
      const x = Math.min(Math.max(r2.left + 4, 1), W - 2), y = Math.min(Math.max(r2.top + r2.height / 2, 1), win.innerHeight - 2);
      const stack = doc.elementsFromPoint(x, y).filter(s => !s.closest('.hd,.mbar,.ck,.mm'));
      let bg = null, media = false;
      for (const s of stack) {
        if (s === e || e.contains(s)) continue;
        if (/^(IMG|VIDEO|CANVAS|PICTURE|IFRAME)$/.test(s.tagName)) { media = true; break; }
        const ss = win.getComputedStyle(s);
        if (ss.backgroundImage && ss.backgroundImage !== 'none' && !/gradient/.test(ss.backgroundImage)) { media = true; break; }
        const l = lum(ss.backgroundColor); if (l && l.a > .6) { bg = l; break; }
      }
      // the element's own background counts first
      const own2 = lum(cs.backgroundColor); if (own2 && own2.a > .6) { bg = own2; media = false; }
      if (media) continue;
      const fg = lum(cs.color); if (!fg) continue;
      const k = ratio(fg.L, bg ? bg.L : 1);
      if (k < 2.2) { const s = t.slice(0, 50); if (!seen.has(s)) { seen.add(s); out.push('hard to read (' + k.toFixed(1) + ':1): "' + s + '"'); } }
      // clipped text
      if ((cs.overflow === 'hidden' || cs.textOverflow === 'ellipsis') && (e.scrollWidth > e.clientWidth + 2 || e.scrollHeight > e.clientHeight + 4) && !e.closest('.rail,.pan,.px')) out.push('text cut off: "' + t.slice(0, 40) + '"');
    }
    for (const i of root.querySelectorAll('img')) {
      if (hidden(i)) continue; const r = i.getBoundingClientRect(); if (r.width < 2) continue;
      if (i.complete && i.naturalWidth === 0 && i.getAttribute('src')) out.push('broken image: ' + i.getAttribute('src').slice(-60));
      else if (i.naturalWidth && r.width > 240 && r.width > i.naturalWidth * 1.4) out.push('blurry image (' + i.naturalWidth + 'px file shown ' + Math.round(r.width) + 'px wide): ' + i.getAttribute('src').slice(-50));
    }
    const txt = root.innerText;
    for (const re of [/\{[A-Z0-9]{2,}\}/, /%%[A-Z0-9]+%%/, /\bundefined\b/, /\bNaN\b/, /&amp;|&[a-z]{2,8};/, /\bnull\b/]) { const m = txt.match(re); if (m) out.push('leftover text: ' + m[0]); }
    const us = txt.match(US); if (us) out.push('US spelling: ' + us[0]);
    for (const a of root.querySelectorAll('a,button')) { if (hidden(a)) continue; const r = a.getBoundingClientRect(); if (r.width < 2) continue; if (!a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('img')) out.push('empty link/button: ' + (a.getAttribute('href') || a.className)); const h = a.getAttribute('href') || ''; if (h.startsWith('#') && h.length > 1 && h !== '#cookie-settings' && !h.startsWith('#!/') && !doc.getElementById(h.slice(1))) out.push('link to missing section: ' + h); }
    for (const e of root.querySelectorAll('section *')) {
      const r = e.getBoundingClientRect(); if (r.width < 2 || hidden(e) || e.closest('.rail,.pan,.gg,.rooms,.proj,.hero,.bk figure,.rvg,.csg')) continue;
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
        d.querySelectorAll('#kc .rv').forEach(e => e.classList.add('in'));
        await new Promise(r => setTimeout(r, 3500));
        const res = window.abjQA(d, f.contentWindow, w);
        window.__qa.push((w > 500 ? 'desktop ' : 'phone   ') + p + (res.length ? '\n   - ' + res.join('\n   - ') : '  OK'));
        f.remove();
      } catch (e) { window.__qa.push(p + ' ERROR ' + e); }
    }
    window.__qaDone = true;
  };
})();
