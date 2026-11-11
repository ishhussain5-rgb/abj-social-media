/* abjCalcInsert(code, html): put the kitchen cost guide before "How it works" (idempotent: replaces an existing one). */
window.abjCalcInsert = function (code, html) {
  let c = code.replace(/<section class="calc[^"]*" id="kc-cost"[\s\S]*?<\/script>\n<\/section>\n*/, '');
  const i = c.indexOf('<section class="proc">'); if (i < 0) throw new Error('no proc section');
  return c.slice(0, i) + html.trim() + '\n\n' + c.slice(i);
};
