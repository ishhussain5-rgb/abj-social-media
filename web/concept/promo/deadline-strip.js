/* ABJ deadline strip (21 Nov 2026). Site HEAD item. Self-contained; removes itself after 12 Dec 2026.
     Shows a slim bottom strip (once the visitor scrolls past the first screen): Jan-Feb fitting slots, order by 12 December, link to /bookingform.
     On phones, pages with the bottom Call/WhatsApp/Book bar (.mbar) get a slim band docked just above that bar, without its own button.
     Hidden while the menu, cookie notice or a guide-price pill (.pill) is showing. Not shown on /bookingform, the language pages (/pl /lt /ru) or after the visitor closes it.
   Loaded from the site HEAD: <script src="https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@<commit>/web/concept/promo/deadline-strip.js" defer></script>
   Source of truth for the look: deadline-strip.html (same CSS and JS). */
(function(){
  var END = new Date('2026-12-12T23:59:59Z').getTime(), KEY = 'abj-dl-closed-20261212';
  if (Date.now() > END) return;
  var p = location.pathname.replace(/\/+$/, '');
  if (/^\/(bookingform|pl|lt|ru)(\/|$)/.test(p)) return;
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}
  if (!document.getElementById('abj-dl-css')) { var st = document.createElement('style'); st.id = 'abj-dl-css';
    st.textContent = '#abj-dl{position:fixed;left:50%;bottom:16px;z-index:75;display:flex;align-items:center;gap:14px;width:max-content;max-width:calc(100vw - 160px);padding:10px 10px 10px 16px;background:#0E1B1A;color:#F3EEE6;border:1px solid rgba(201,169,110,.45);border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.28);font:500 14px/1.35 "DM Sans",system-ui,sans-serif;opacity:0;transform:translate(-50%,12px);pointer-events:none;transition:opacity .35s ease,transform .35s ease}#abj-dl.on{opacity:1;transform:translate(-50%,0);pointer-events:auto}#abj-dl .t{flex:1 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#abj-dl .t b{color:#C9A96E;font-weight:600}#abj-dl a.c{flex:0 0 auto;white-space:nowrap;color:#1B2321;background:#F3EEE6;text-decoration:none;font-weight:600;font-size:13px;letter-spacing:.02em;padding:8px 12px;border-radius:6px}#abj-dl a.c:hover,#abj-dl a.c:focus-visible{background:#C9A96E;color:#0E1B1A}#abj-dl button{flex:0 0 auto;width:30px;height:30px;border:0;border-radius:6px;background:transparent;color:#F3EEE6;font-size:20px;line-height:1;cursor:pointer;opacity:.75}#abj-dl button:hover,#abj-dl button:focus-visible{opacity:1;background:rgba(243,238,230,.1)}#abj-dl .m{display:none}@media (max-width:640px){#abj-dl{left:10px;bottom:10px;gap:8px;padding:8px 6px 8px 12px;font-size:13px;width:auto;max-width:none;right:62px;transform:translate(0,12px)}#abj-dl.on{transform:none}#abj-dl .t{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}#abj-dl .d{display:none}#abj-dl .m{display:inline}#abj-dl a.c{font-size:12px;padding:7px 10px}#abj-dl button{width:26px;height:26px;font-size:18px}#abj-dl.dock{left:0;right:0;border-radius:0;border-width:1px 0 0;box-shadow:none;padding:6px 6px 6px 14px;font-size:12.5px;transition:opacity .25s ease}#abj-dl.dock,#abj-dl.dock.on{transform:none}#abj-dl.dock a.c{display:none}}@media print{#abj-dl{display:none!important}}@media (prefers-reduced-motion:reduce){#abj-dl{transition:none}}';
    (document.head || document.documentElement).appendChild(st); }
  function build(){
    if (document.getElementById('abj-dl')) return;
    var d = document.createElement('div');
    d.id = 'abj-dl'; d.setAttribute('role', 'region'); d.setAttribute('aria-label', 'Fitting slots');
    d.innerHTML = '<span class="t"><span class="d"><b>January&ndash;February fitting slots:</b> order by 12 December to secure yours</span>'
      + '<span class="m"><b>Jan&ndash;Feb fitting:</b> order by 12&nbsp;Dec</span></span>'
      + '<a class="c" href="/bookingform">Book a free design visit</a>'
      + '<button type="button" aria-label="Close">&times;</button>';
    var mob = d.querySelector('a.c');
    if (window.matchMedia && matchMedia('(max-width:640px)').matches) mob.textContent = 'Book a visit';
    d.querySelector('button').addEventListener('click', function(){
      d.classList.remove('on'); setTimeout(function(){ d.remove(); }, 400);
      try { localStorage.setItem(KEY, '1'); } catch (e) {}
    });
    mob.addEventListener('click', function(){ try { (window.dataLayer = window.dataLayer || []).push({event:'deadline_strip_click'}); } catch (e) {} });
    document.body.appendChild(d);
    function v(e){ if (!e) return false; var s = getComputedStyle(e); return s.visibility !== 'hidden' && s.display !== 'none' && parseFloat(s.opacity) > 0.05 && e.offsetHeight > 0; }
    function blocked(){
      return v(document.querySelector('.ck')) || v(document.querySelector('.mm')) || v(document.querySelector('.pill'));
    }
    function dock(){
      var mb = document.querySelector('.mbar'), small = window.matchMedia && matchMedia('(max-width:640px)').matches;
      if (small && v(mb)) { d.classList.add('dock'); d.style.bottom = Math.round(window.innerHeight - mb.getBoundingClientRect().top) + 'px'; }
      else { d.classList.remove('dock'); d.style.bottom = ''; }
    }
    function tick(){
      if (!document.body.contains(d)) return;
      if (Date.now() > END) { d.remove(); return; }
      var past = (window.scrollY || document.documentElement.scrollTop || 0) > window.innerHeight * 0.6;
      dock();
      if (blocked() || !past) d.classList.remove('on'); else d.classList.add('on');
    }
    setInterval(tick, 500); window.addEventListener('scroll', tick, {passive:true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
