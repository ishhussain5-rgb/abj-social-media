/* Design your room (20 Nov 2026). window.DZ_HTML = designer.html, window.DZ_PROC = proc.html, window.DZ_FILL = designfill.html.
   tfDesigner(code): turns a duplicate of the Budget planner DEV block into the Design your room page (main swapped, bk heading + footer headline reworded).
   tfDesignFill(code): booking form DEV/live - appends the snippet that puts a saved design into the notes box. Both for abjRec. */
window.tfDesigner = function (c) {
  if (c.indexOf('<!-- /ABJ MOBILE -->') < 0 || c.indexOf('<main>') < 0) return null;
  var a = c.indexOf('<main>') + 6, b = c.indexOf('<section class="bk"'), e = c.indexOf('</main>');
  if (a < 6 || b < a || e < b) throw 'anchors';
  var bkEnd = c.indexOf('</section>', b) + 10; if (bkEnd < 10 || bkEnd > e) throw 'bk end';
  var bk = c.slice(b, bkEnd);
  if (bk.indexOf('Get the exact price for your room') >= 0) bk = bk.replace('Get the exact price for your room', 'Ready to see it for real?');
  var n = c.slice(0, a) + '\n' + window.DZ_HTML.trim() + '\n' + window.DZ_PROC.trim() + '\n' + bk + '\n' + c.slice(e);
  n = n.replace('Design it around your budget', 'Like what you have designed?');
  return n === c ? null : n;
};
window.tfDesignFill = function (c) {
  if (c.indexOf('abj-booking-form') < 0 || c.indexOf('id="abj-notes"') < 0) return null;
  var n = c.replace(/\n?<!-- ABJ DESIGNFILL -->[\s\S]*?<!-- \/ABJ DESIGNFILL -->\n?/g, '').replace(/\s*$/, '') + '\n' + window.DZ_FILL.trim();
  return n === c ? null : n;
};
