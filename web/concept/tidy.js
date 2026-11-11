/* Last stock phrases (11 Nov 2026). abjTidy(code) -> code. Only touches the listed phrases; town hero dash -> comma. */
(function () {
  const R = [
    [/>The ABJ journey</g, '>Our story<'], [/aria-label="The ABJ journey"/g, 'aria-label="Our story"'],
    [/A simple, four-step journey from first idea to finished installation, all handled by one team\./g, 'Four steps from first idea to finished installation, all handled by one team.'],
    [/>Your journey</g, '>How it works<'],
    [/Ready to transform your home\?/g, 'Planning something similar?'],
  ];
  window.abjTidy = function (code) {
    let c = R.reduce((a, [rx, to]) => a.replace(rx, to), code);
    c = c.replace(/(<section class="hero[\s\S]*?<\/section>)/, s => s.replace(/<p>([^<]*?)\s(?:—|&mdash;)\s([^<]*?)<\/p>/, '<p>$1, $2</p>'));
    return c;
  };
})();
