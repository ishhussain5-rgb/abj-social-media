/* Text rules applied to Tilda page code by replace.js (14 Nov 2026).
   Every rule is idempotent: running it twice changes nothing the second time.
   The ABJ MOBILE layer is masked out (it is replaced from mobile.html instead). */
window.ABJ_RULES = (function () {
  const WD = {
    'Stamford': ['Q1000662', 'Stamford,_Lincolnshire'], 'Oundle': ['Q263497', 'Oundle'], 'Market Deeping': ['Q1850360', 'Market_Deeping'],
    'Bourne': ['Q2223229', 'Bourne,_Lincolnshire'], 'Spalding': ['Q1185203', 'Spalding,_Lincolnshire'], 'Huntingdon': ['Q685640', 'Huntingdon'],
    'St Ives': ['Q2569095', 'St_Ives,_Cambridgeshire'], 'Ely': ['Q209176', 'Ely,_Cambridgeshire'], 'Wisbech': ['Q1012031', 'Wisbech'],
    'Grantham': ['Q846683', 'Grantham'], 'Oakham': ['Q1001942', 'Oakham'], 'Cambridge': ['Q350', 'Cambridge'], 'St Neots': ['Q1018225', 'St_Neots'],
    'Corby': ['Q994925', 'Corby'], 'Kettering': ['Q984613', 'Kettering'], 'King’s Lynn': ['Q157341', 'King%27s_Lynn'],
    'Peterborough': ['Q172438', 'Peterborough'], 'March': ['Q2569076', 'March,_Cambridgeshire'], 'Whittlesey': ['Q2335054', 'Whittlesey'], 'Chatteris': ['Q2636013', 'Chatteris']
  };
  const same = n => '"sameAs": ["https://www.wikidata.org/wiki/' + WD[n][0] + '", "https://en.wikipedia.org/wiki/' + WD[n][1] + '"]';
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rules = [
    // guarantee: "minimum 12-month guarantee" in sentences, "12-month+" on fact tiles
    { re: /<b>12-month<\/b>(\s*)guarantee/g, to: '<b>12-month+</b>$1guarantee' },
    { re: /<span class="fk">12-month<\/span>/g, to: '<span class="fk">12-month+</span>' },
    { re: /<b>12 months<\/b><span>Guarantee on our work<\/span>/g, to: '<b>12 months+</b><span>Guarantee on our work</span>' },
    { re: /(<li>(?:<i>\d+<\/i>)?)12-month guarantee/g, to: '$1Minimum 12-month guarantee' },
    { re: /<h3>12-month guarantee<\/h3>/g, to: '<h3>Minimum 12-month guarantee</h3>' },
    { re: /\b(our|a|and|with|reassuring) 12-month guarantee/gi, to: '$1 minimum 12-month guarantee' },
    { re: /(&middot;|·) 12-month guarantee/g, to: '$1 minimum 12-month guarantee' },
    { re: /(visit|design|survey), 12-month guarantee/g, to: '$1, minimum 12-month guarantee' },
    // payment terms page (Ish OK 14 Nov)
    { re: /Finance is offered via our partner \(e\.g\. Ideal4Finance\)\./g, to: 'Finance is offered through our partner, Ideal4Finance.' },
    // offers terms: 50% deposit, 50% before delivery (Ish 14 Nov)
    { re: /The balance is payable 40% on delivery of furniture to site and 10% on completion\./g, to: 'The remaining 50% is payable before delivery.' },
    // structured data: King&rsquo;s inside JSON-LD is not decoded by search engines
    { ld: true, re: /King&rsquo;s/g, to: 'King’s' },
    // Fenland page: one "City" called Fenland -> the three towns it covers
    { ld: true, re: /\{\s*"@type":\s*"City",\s*"name":\s*"Fenland"\s*\}/g,
      to: '[{"@type": "City", "name": "March", ' + same('March') + '}, {"@type": "City", "name": "Whittlesey", ' + same('Whittlesey') +
          '}, {"@type": "City", "name": "Chatteris", ' + same('Chatteris') + '}]' }
  ];
  Object.keys(WD).filter(n => !/^(March|Whittlesey|Chatteris)$/.test(n)).forEach(n => rules.push({
    ld: true, re: new RegExp('("@type":\\s*"City",\\s*"name":\\s*"' + esc(n) + '")(?!,\\s*"sameAs")', 'g'), to: '$1, ' + same(n) }));
  return rules;
})();

/* apply rules to one record's code; the ABJ MOBILE layer is left untouched */
window.abjApplyRules = function (code, rules) {
  const a = code.search(/<!-- ABJ MOBILE \(phone layer/), b = code.indexOf('<!-- /ABJ MOBILE -->');
  const parts = (a > -1 && b > a) ? [code.slice(0, a), code.slice(a, b + 20), code.slice(b + 20)] : [code];
  const hits = {};
  const run = s => {
    rules.forEach((r, i) => {
      const f = t => t.replace(r.re, function () { hits[i] = (hits[i] || 0) + 1; const args = arguments;
        return r.to.replace(/\$(\d)/g, (m, d) => args[+d] === undefined ? '' : args[+d]); });
      if (r.ld) s = s.replace(/(<script[^>]*application\/ld\+json[^>]*>)([\s\S]*?)(<\/script>)/g, (m, o, body, c) => o + f(body) + c);
      else s = f(s);
    });
    return s;
  };
  const out = parts.length === 3 ? run(parts[0]) + parts[1] + run(parts[2]) : run(parts[0]);
  return { code: out, hits };
};
