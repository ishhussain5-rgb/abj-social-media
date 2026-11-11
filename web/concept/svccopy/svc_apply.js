/* Service pages (11 Nov 2026): "How it works" steps and the booking heading/text were word for word the same on every
   service page. abjSvcCopy(code, data) swaps in the page's own copy from svccopy/<slug>.json and nothing else. */
(function () {
  const once = (code, rx, fn, label) => {
    const m = code.match(new RegExp(rx.source, rx.flags.includes('g') ? rx.flags : rx.flags + 'g')) || [];
    if (m.length !== 1) throw new Error(label + ': found ' + m.length + ' times');
    return code.replace(rx, fn);
  };
  window.abjSvcCopy = function (code, d) {
    let c = code;
    const steps = d.steps.map((s, i) => '\n  <div class="rv"><i>0' + (i + 1) + '</i><h3>' + s[0] + '</h3><p>' + s[1] + '</p></div>').join('');
    c = once(c, /(<section class="proc">[\s\S]*?<h2 style="margin-top:16px">From first visit to final fitting<\/h2><\/div><p>)[\s\S]*?(<\/p><\/div>\s*<div class="ps">)[\s\S]*?(\s*<\/div>\s*<\/div><\/section>)/,
      (m, a, b, e) => a + d.proc_p + b + steps + e, 'proc');
    if (d.book_h) c = once(c, /(<section class="bk"[\s\S]*?<span class="kick">Free design visit<\/span>\s*<h2>)[^<]*(<\/h2>\s*<p>)[\s\S]*?(<\/p>)/, (m, a, b, e) => a + d.book_h + b + d.book_p + e, 'bk');
    return c;
  };
})();
