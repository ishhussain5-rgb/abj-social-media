/* ABJ A11Y (20 Nov 2026): appends/replaces the accessibility snippet on new-design blocks (those with the #kc wrapper and
   the ABJ MOBILE layer). window.A11Y_HTML = a11y.html. For abjRec. */
window.tfA11y = function (c) {
  if (c.indexOf('<!-- /ABJ MOBILE -->') < 0 || c.indexOf('id="kc"') < 0) return null;
  var n = c.replace(/\n?<!-- ABJ A11Y -->[\s\S]*?<!-- \/ABJ A11Y -->\n?/g, '').replace(/\s*$/, '') + '\n' + window.A11Y_HTML.trim();
  return n === c ? null : n;
};
