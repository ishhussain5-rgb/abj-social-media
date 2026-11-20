/* Generic DEV page builder (20 Nov 2026): turns a duplicate of the Budget planner DEV block into another page.
   tfPage(MAIN, FT)(code): <main> content up to the booking band replaced by MAIN; footer headline -> FT. For abjRec. */
window.tfPage = function (MAIN, FT) {
  return function (c) {
    if (c.indexOf('<!-- /ABJ MOBILE -->') < 0 || c.indexOf('<main>') < 0) return null;
    var a = c.indexOf('<main>') + 6, b = c.indexOf('<section class="bk"');
    if (a < 6 || b < a) throw 'anchors';
    var n = c.slice(0, a) + '\n' + MAIN.trim() + '\n' + c.slice(b);
    n = n.replace('Get the exact price for your room', 'Ready to see yours in 3D?');
    if (FT) n = n.replace('Design it around your budget', FT);
    return n === c ? null : n;
  };
};
