/* Go-live helpers, 19 Nov 2026 (Ish: "Please make these live").
   Copies finished snippet blocks from a DEV page's code into the matching live page's code, unchanged.
   tfCopy(devCode, spec) returns a transform for abjRec on the live page. spec is a list of
     {m:'PHONE SHORT3', at:'end'|'beforeBook', onlyIfMissing:true|false}
   - 'end': appended after everything else (after /ABJ MOBILE), replacing any older copy of the same block.
   - 'beforeBook': inserted just before the booking band (<section ... id="kc-book">).
   Refuses (throws) if a DEV block links to a DEV page, so DEV links can never reach the live site.
   Insert-only: nothing else in the live code changes. Used with abjRec (backups in IndexedDB abj_svc_bak). */
window.abjBlock = function (code, m) {
  var re = new RegExp('<!-- ABJ ' + m + '[ (][\\s\\S]*?<!-- /ABJ ' + m + ' -->');
  var x = code.match(re); return x ? x[0] : null;
};
window.tfCopy = function (devCode, spec) {
  var blocks = spec.map(function (s) {
    var b = abjBlock(devCode, s.m); if (!b) throw 'DEV has no ' + s.m;
    if (/-dev-[a-z0-9]+/.test(b)) throw 'DEV link inside ' + s.m;
    return b;
  });
  return function (c) {
    if (c.indexOf('<!-- /ABJ MOBILE -->') < 0) return null;
    var n = c;
    spec.forEach(function (s, i) {
      var has = abjBlock(n, s.m);
      if (has && s.onlyIfMissing) return;
      if (has) n = n.replace(has, '');
      if (s.at === 'beforeBook') {
        var k = n.indexOf('id="kc-book"'); if (k < 0) throw 'no #kc-book';
        var st = n.lastIndexOf('<section', k); if (st < 0) throw 'no section';
        n = n.slice(0, st) + blocks[i] + '\n' + n.slice(st);
      } else {
        n = n.replace(/\s*$/, '') + '\n' + blocks[i];
      }
    });
    return n === c ? null : n;
  };
};
