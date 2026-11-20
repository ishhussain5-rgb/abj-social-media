/* Language DEV pages (20 Nov 2026): tfLang(MAIN, FT) replaces the whole <main> of a Budget planner DEV duplicate with
   lang/<code>.html (no English booking band or finance small print) and sets the footer headline. For abjRec. */
window.tfLang = function (MAIN, FT) {
  return function (c) {
    if (c.indexOf('<!-- /ABJ MOBILE -->') < 0 || c.indexOf('<main>') < 0) return null;
    var a = c.indexOf('<main>') + 6, b = c.indexOf('</main>');
    if (a < 6 || b < a) throw 'anchors';
    var n = c.slice(0, a) + '\n' + MAIN.trim() + '\n' + c.slice(b);
    n = n.replace('Design it around your budget', FT);
    return n === c ? null : n;
  };
};
