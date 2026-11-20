/* Inspiration gallery (20 Nov 2026): window.INSPO = inspo.html. tfInspo(code) removes the known 3D renders from the
   gallery grid (they belong in the 3D designs library, not with photos of finished rooms) and appends/replaces ABJ INSPO. */
window.INSPO_RENDERS = ['abj-kitchen-white-sh', 'abj-kitchen-navy-sha', 'abj-kitchen-grey-sha', 'abj-war92', 'abj-war104'];
window.tfInspo = function (c) {
  var a = c.indexOf('<div class="gg" id="kc-gg">'); if (a < 0) return null;
  var b = c.indexOf('</div>', a); var grid = c.slice(a, b);
  var g2 = grid.replace(/\n?<a class="gi"[^>]*>(?:(?!<\/a>)[\s\S])*<\/a>/g, function (m) {
    return window.INSPO_RENDERS.some(function (r) { return m.indexOf(r + '.') > -1; }) ? '' : m; });
  var n = c.slice(0, a) + g2 + c.slice(b);
  n = n.replace(/\n?<!-- ABJ INSPO -->[\s\S]*?<!-- \/ABJ INSPO -->\n?/g, '').replace(/\s*$/, '') + '\n' + window.INSPO.trim();
  return n === c ? null : n;
};
