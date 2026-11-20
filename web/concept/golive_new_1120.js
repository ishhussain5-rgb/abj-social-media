/* 20 Nov 2026 go-live of the "world class" round. Load in a tilda.cc tab after abjrec.js. window.LMAP = linkmap.json.
   tfToLive(c): DEV links -> live (same rule as tilda_golive.js abjLive); throws if any -dev- link is left. */
window.tfToLive = function (c) {
  var map = window.LMAP, keys = Object.keys(map).sort(function (a, b) { return b.length - a.length; });
  var rx = new RegExp('(' + keys.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')(?![A-Za-z0-9_-])', 'g');
  var n = c.replace(rx, function (m) { return map[m]; }).split('https://abjkitchensandbedrooms.co.uk//').join('https://abjkitchensandbedrooms.co.uk/');
  var left = (n.match(/[\w/.:-]*-dev-[a-z0-9]{4,5}\b/g) || []).filter(function (x, i, a) { return a.indexOf(x) === i; });
  if (left.length) throw 'DEV links left: ' + left.slice(0, 5).join(', ');
  return n === c ? null : n;
};
