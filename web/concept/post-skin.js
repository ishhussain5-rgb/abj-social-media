/* ABJ guide articles in the new design.
   Tilda renders blog posts (/abjfeeds/tpost/...) itself, outside our page blocks. This script re-renders the
   post inside the new-design header, footer and theme, using the post's own title, date, author, image and text.
   It only runs on /tpost/ pages and only when switched on:
     - for go-live: put  <script>window.ABJ_POST_SKIN=true</script>  before this script in the site head
     - to preview before then: add ?preview=new to any article URL (remembered for that browser), ?preview=old to stop.
   If anything goes wrong it leaves the original Tilda page untouched. */
(function () {
  if (!/\/tpost\//.test(location.pathname) || document.getElementById('kc')) return;
  var q = location.search, on = window.ABJ_POST_SKIN === true;
  try {
    if (/preview=new/.test(q)) localStorage.setItem('abj_post_skin', '1');
    if (/preview=old/.test(q)) localStorage.removeItem('abj_post_skin');
    if (localStorage.getItem('abj_post_skin') === '1') on = true;
  } catch (e) {}
  if (!on) return;
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/post-skin\.js.*$/, '') ||
    'https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@main/web/concept/';
  var BLOG = window.ABJ_POST_SKIN === true ? '/abjfeeds' : '/abjfeeds-dev-b2f8';
  var BOOK = window.ABJ_POST_SKIN === true ? '/bookingform' : '/bookingform-dev-k9b4';
  var de = document.documentElement;
  de.classList.add('abjpost-wait');
  var st = document.createElement('style');
  st.textContent = 'html.abjpost-wait #allrecords{opacity:0}';
  document.head.appendChild(st);
  var give = setTimeout(function () { de.classList.remove('abjpost-wait'); }, 9000);
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
  var tries = 0;
  (function wait() {
    var art = document.querySelector('.t-cms__page'), body = art && art.querySelector('.t-redactor__tte-view'), h1 = art && art.querySelector('h1');
    if (!art || !body || !h1) { if (++tries < 80) return setTimeout(wait, 100); de.classList.remove('abjpost-wait'); return; }
    fetch(BASE + (window.ABJ_POST_SKIN === true ? 'out-live/' : 'out/') + 'post-chrome.html').then(function (r) { return r.text(); }).then(function (html) {
      var title = h1.textContent.trim();
      var time = art.querySelector('time'), up = art.querySelector('.t-uptitle');
      var date = (time && time.textContent.trim()) || (up && up.textContent.trim()) || '';
      var au = art.querySelector('.k-lead a, a[rel=author]');
      var author = au ? '<a href="' + esc(au.getAttribute('href') || '#') + '">' + esc(au.textContent.trim()) + '</a>' : 'ABJ Kitchens &amp; Bedrooms';
      var md = document.querySelector('meta[name=description]');
      var lead = md ? md.getAttribute('content') : '';
      var imgEl = art.querySelector('.t-cms__page__image'), hero = '';
      if (imgEl) hero = imgEl.getAttribute('data-original') || ((getComputedStyle(imgEl).backgroundImage || '').match(/url\("?([^")]+)"?\)/) || [])[1] || '';
      if (!hero) { var k = document.querySelector('.k-hv img'); if (k) hero = k.getAttribute('src').replace('thb.tildacdn.com', 'static.tildacdn.com').replace(/\/-\/resize\/[^/]+\//, '/'); }
      var heroAlt = (document.querySelector('.k-hv img') || {}).alt || title;
      var b = body.cloneNode(true);
      b.querySelectorAll('[data-original]').forEach(function (i) { if (i.tagName === 'IMG') { i.src = i.getAttribute('data-original'); i.removeAttribute('data-original'); } });
      b.querySelectorAll('img').forEach(function (i) { i.loading = 'lazy'; i.removeAttribute('style'); i.classList.remove('t-img'); });
      b.querySelectorAll('script,style').forEach(function (s) { s.remove(); });
      var d = new DOMParser().parseFromString(html, 'text/html');
      var css = d.querySelector('style'), kc = d.getElementById('kc'), js = [].slice.call(d.querySelectorAll('script')).pop();
      if (!css || !kc || !js) throw new Error('chrome incomplete');
      d.querySelectorAll('link[rel=stylesheet],link[rel=preconnect]').forEach(function (l) { document.head.appendChild(l.cloneNode(true)); });
      var s2 = document.createElement('style'); s2.textContent = css.textContent +
        'html.abjnew #abjb-hd,html.abjnew #abjb-ft,html.abjnew #allrecords{display:none!important}'; document.head.appendChild(s2);
      kc.querySelectorAll('a[href="/abjfeeds-dev-b2f8"]').forEach(function (a) { a.setAttribute('href', BLOG); });
      kc.querySelectorAll('a[href="/bookingform-dev-k9b4"]').forEach(function (a) { a.setAttribute('href', BOOK); });
      var slot = kc.querySelector('#kc-post');
      slot.outerHTML = '<section class="cs pg" aria-label="' + esc(title) + '"><div class="t"><span class="kick">Guide' + (date ? ' &middot; ' + esc(date) : '') + '</span><h1>' + esc(title) + '</h1>' +
        (lead ? '<p>' + esc(lead) + '</p>' : '') + '<div class="pmeta">By ' + author + '</div></div>' +
        (hero ? '<figure><img src="' + esc(hero) + '" alt="' + esc(heroAlt) + '" fetchpriority="high"></figure>' : '') + '</section>' +
        '<section class="pbw"><div class="w"><article class="pbody" id="kc-pbody"></article><div class="pnav"><a class="lnk" href="' + BLOG + '">All guides</a><a class="bt d" href="' + BOOK + '">Book a free design visit</a></div></div></section>';
      kc.querySelector('#kc-pbody').appendChild(document.importNode(b, true));
      de.classList.add('abjnew'); de.setAttribute('data-abjm-native', 'abjnew');
      document.body.insertBefore(document.importNode(kc, true), document.body.firstChild);
      (new Function(js.textContent.replace(/^\s*<script>|<\/script>\s*$/g, '')))();
      clearTimeout(give); de.classList.remove('abjpost-wait');
    }).catch(function (e) { clearTimeout(give); de.classList.remove('abjpost-wait'); if (window.console) console.warn('ABJ post skin', e); });
  })();
})();
