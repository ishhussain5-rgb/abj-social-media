/* Booking form transform (19 Nov 2026): adds optional email + best time to call, passes them to web3forms
   (and so to ABJ Factory), validates the email if given, and appends the ABJ FORMSTEP snippet (window.FS).
   Insert-only edits; returns null if already applied. Used with abjRec from a Tilda editor tab. */
window.tfBook = function (c) {
  if (c.indexOf('<!-- /ABJ MOBILE -->') < 0 || c.indexOf('abj-booking-form') < 0) return null;
  var once = function (s, a, b, w) { var n = s.split(a).length - 1; if (n !== 1) throw 'anchor ' + w + ' x' + n; return s.replace(a, function () { return b; }); };
  var n = c;
  if (n.indexOf('id="f-email"') < 0) {
    var NEWF = '<div class="g2"><div class="f" id="f-email"><label for="abj-email">Email (optional)</label>' +
      '<input id="abj-email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="So we can email your confirmation">' +
      '<span class="em">Please check your email address.</span></div>' +
      '<div class="f" id="f-calltime"><label for="abj-calltime">Best time to call (optional)</label>' +
      '<select id="abj-calltime" name="call_time"><option value="">Any time</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select></div></div>\n';
    n = once(n, '<div class="f"><label for="abj-notes">', NEWF + '<div class="f"><label for="abj-notes">', 'notes html');
    n = once(n, "nt=$('abj-notes').value.trim();",
      "nt=$('abj-notes').value.trim(),em=($('abj-email')||{value:''}).value.trim(),ct=($('abj-calltime')||{value:''}).value;", 'nt var');
    n = once(n, "'Notes: '+(nt||'None')]",
      "'Notes: '+(nt||'None'),'Email: '+(em||'Not given'),'Best time to call: '+(ct||'Any time')]", 'body');
    n = once(n, 'notes:nt,', "notes:nt,email:em||undefined,call_time:ct||'Any time',", 'json');
    n = once(n, "if(!$('abj-src').value)bad('f-src');",
      "if(!$('abj-src').value)bad('f-src');\n var em0=$('abj-email');if(em0&&em0.value.trim()&&!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(em0.value.trim()))bad('f-email');", 'check');
  }
  n = n.replace(/\n?<!-- ABJ FORMSTEP[\s\S]*?<!-- \/ABJ FORMSTEP -->\n?/g, '').replace(/\s*$/, '') + '\n' + window.FS;
  return n === c ? null : n;
};
