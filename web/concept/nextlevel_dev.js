/* 18 Nov 2026 "next level" items, DEV pages only. Load after abjrec.js and set window.B2H (b2h.html), window.SAMPLES (samples section).
   tfHome / tfKitchens / tfOakham / tfGallery return the new block code or null. */
(function () {
  const MEDIA = 'https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@52a2e9e7fd4f4ca563501151396dc921acdf56a5/films/';
  const film = (v, room) => '<figure class="b2v"><video autoplay muted loop playsinline preload="metadata" poster="' + MEDIA + 'abj-board-to-home-' + v + '-poster.webp" aria-label="From board to your home: CNC cutting, panel saw, edgebanding, stacked panels and a finished ' + room + '"><source src="' + MEDIA + 'abj-board-to-home-' + v + '.mp4" type="video/mp4"></video><ol class="b2c" aria-hidden="true"><li class="on">Cut</li><li>Edge</li><li>Make</li><li>Fit</li></ol></figure>';
  const FILM = film('v2', 'kitchen with a quartz island'), WIDE = film('wide', 'handleless kitchen');
  const STEPS = '<ol class="b2s"><li><i>01</i><b>Cut</b><span>Boards cut to the millimetre on the CNC by our sister company, Cut &amp; Edge Express.</span></li><li><i>02</i><b>Edge</b><span>Every panel edged in-house to match its decor.</span></li><li><i>03</i><b>Make</b><span>Built in our Peterborough workshop with GTV, Blum and H&auml;fele hardware.</span></li><li><i>04</i><b>Fit</b><span>Fitted in your home by the team that made it.</span></li></ol>';
  const QUOTE = '<p class="b2n">&ldquo;Everyone we dealt with, from the office team and designers to the manufacturing and fitting teams, was professional, conscientious, and clearly took great pride in their work.&rdquo; <span style="white-space:nowrap">&mdash; M Rich, Google review</span></p>';
  const LNG = '<p class="lng">We speak English, <span lang="pl">Polski</span>, <span lang="lt">Lietuvi&#371;</span> and <span lang="ru">&#1056;&#1091;&#1089;&#1089;&#1082;&#1080;&#1081;</span>.</p>';
  const BAND = '<section class="b2h" aria-label="From board to your home"><div class="w">' + FILM + '<div><span class="kick">From board to your home</span><h2>One team, from the first cut to the last screw</h2>' + STEPS + '</div></div></section>\n';
  const snip = c => c.replace(/\n?<!-- ABJ B2H[\s\S]*?<!-- \/ABJ B2H -->\n?/g, '').replace(/\s*$/, '') + '\n' + window.B2H;
  const once = (c, a, b, what) => { if (c.split(a).length !== 2) throw 'anchor ' + what; return c.replace(a, () => b); };
  const lng = c => c.includes('class="lng"') ? c : once(c, '<p class="fin">', LNG + '<p class="fin">', 'fin');
  const isKc = c => c.includes('<!-- /ABJ MOBILE -->');
  window.tfHome = c => {
    if (!isKc(c)) return null;
    if (!c.includes('class="b2v"')) {
      c = c.replace(/(<div class="ws-a">\s*)<figure>[\s\S]*?<\/figure>/, (m, a) => a + WIDE);
      if (!c.includes('class="b2v"')) throw 'ws figure';
      c = once(c, 'in our showroom at Brassey Close.</p>', 'in our showroom at Brassey Close.</p>' + STEPS.replace('class="b2s"', 'class="b2s b2s-ws"') + QUOTE, 'ws text');
    }
    return snip(lng(c));
  };
  window.tfKitchens = c => {
    if (!isKc(c)) return null;
    if (!c.includes('class="b2h"')) c = once(c, '<section class="proc"', BAND + '<section class="proc"', 'proc');
    return snip(lng(c));
  };
  window.tfOakham = c => {
    if (!isKc(c)) return null;
    const R = (q, n, d, k) => '<figure class="rv"><div><span class="sr" aria-label="5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span><blockquote>&ldquo;' + q + '&rdquo;</blockquote></div><figcaption><b>' + n + '</b> &middot; Google review &middot; ' + k + '</figcaption></figure>';
    const G = '<div class="rvg">\n  ' + [
      R('ABJ Kitchens and Bedrooms Ltd designed and fitted me a lovely kitchen with quality units and quartz worktop. Great attention to detail. The finished result is better than we could have imagined.', 'Olga I.', '', 'Kitchen'),
      R('I had my kitchen fitted in 2021 and now have had wardrobes for 3 rooms. Great prices and quality materials. From the drawings to completion all in 3 weeks.', 'Iftikhar A.', '', 'Kitchen &amp; wardrobes'),
      R('From the office team and designers to the manufacturing and fitting teams, everyone was professional, conscientious, and clearly took great pride in their work.', 'M Rich', '', 'Media wall')
    ].join('\n  ') + '\n </div>';
    if (!c.includes('Olga I.')) { c = c.replace(/<div class="rvg">[\s\S]*?<\/figure>\s*<\/div>/, G); if (!c.includes('Olga I.')) throw 'reviews'; }
    return snip(lng(c));
  };
  window.JOBS = [
    { town: 'Kings Road, Peterborough', title: 'Open-plan handleless kitchen with a downdraft island', img: 'https://static.tildacdn.net/tila6131-3661-4863-b433-336364646331/abj-open-plan-kitche.webp', alt: 'Open-plan handleless kitchen with a downdraft island on Kings Road, Peterborough', url: '/case-study-kings-road-kitchen-peterborough', cost: '', time: '' },
    { town: 'Park Road, Peterborough', title: 'Two bespoke media walls for one home', img: 'https://static.tildacdn.net/tila3532-3562-4236-a534-353332323839/abj-med1.webp', alt: 'Oak slat media wall with floating oak shelf and lit side shelving', url: '/project-media-walls-park-road-peterborough', cost: '', time: '' },
    { town: 'Handleless kitchen', title: 'Gloss kitchen with a marble-effect waterfall island', img: 'https://static.tildacdn.net/tila6530-3531-4466-a365-333134386564/abj-handleless-islan.webp', alt: 'Handleless gloss kitchen with a marble-effect waterfall island', url: '/case-study-handleless-island-kitchen', cost: '', time: '' }
  ];
  window.jobsHtml = live => { const priced = JOBS.some(j => j.cost); return '<section class="sec alt jobs" aria-label="Real jobs"><div class="w"><div class="sh rv"><div><span class="kick">' + (priced ? 'Real jobs, real prices' : 'Real jobs') + '</span><h2 style="margin-top:16px">' + (priced ? 'What our clients spent, and how long it took' : 'Rooms we have made and fitted') + '</h2></div><p>' + (priced ? 'Real rooms we have made and fitted, with the town, the rough cost and the time from sign-off to finished.' : 'Real projects from around Peterborough, from the first visit to the final fitting.') + '</p></div>' +
    (live ? '' : '<p class="jdev">DEV preview: costs and timings appear on each card once Ish sends the job list.</p>') + '<div class="jg">' +
    JOBS.map(j => '<a class="jc rv" href="' + j.url + '"><figure><img loading="lazy" src="' + j.img + '" alt="' + j.alt + '"></figure><div class="jb"><span class="kick">' + j.town + '</span><h3>' + j.title + '</h3>' +
      ((j.cost || j.time) ? '<dl>' + (j.cost ? '<div><dt>Cost</dt><dd>' + j.cost + '</dd></div>' : '') + (j.time ? '<div><dt>Time</dt><dd>' + j.time + '</dd></div>' : '') + '</dl>' : '') +
      '<span class="lnk">See the project</span></div></a>').join('') + '</div></div></section>\n'; };
  window.JOBS_CSS = '<!-- ABJ JOBS --><style>#kc .jobs .jdev{display:inline-block;margin:0 0 18px;padding:6px 12px;border:1px dashed var(--go);font-size:12.5px;color:var(--mut)}#kc .jg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(16px,1.8vw,28px)}#kc .jc{display:flex;flex-direction:column;background:#fff;color:inherit}#kc .jc figure{aspect-ratio:3/2;overflow:hidden;margin:0}#kc .jc img{width:100%;height:100%;object-fit:cover;transition:transform 1s cubic-bezier(.2,.7,.2,1)}#kc .jc:hover img{transform:scale(1.03)}#kc .jc .jb{display:flex;flex-direction:column;flex:1;padding:clamp(18px,1.8vw,26px)}#kc .jc h3{font-size:clamp(22px,1.7vw,28px);margin:10px 0 12px}#kc .jc dl{display:flex;gap:24px;margin:0 0 14px;padding:12px 0;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)}#kc .jc dt{font:500 10.5px/1.4 var(--sans);letter-spacing:.2em;text-transform:uppercase;color:var(--mut)}#kc .jc dd{margin:4px 0 0;font:400 22px/1.1 var(--serif)}#kc .jc .lnk{margin-top:auto;align-self:flex-start}@media (max-width:760px){#kc .jg{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:14px;margin:0 calc(-1*var(--pad));padding:0 var(--pad) 6px;scrollbar-width:none}#kc .jg::-webkit-scrollbar{display:none}#kc .jc{flex:0 0 82%;scroll-snap-align:start}}</style><!-- /ABJ JOBS -->';
  window.tfGallery = (c, live) => {
    if (!isKc(c)) return null;
    if (!c.includes('class="sec alt jobs"')) c = once(c, '<section class="sec alt" aria-label="Case studies">', jobsHtml(live) + '<section class="sec alt" aria-label="Case studies" style="display:none">', 'case studies');
    c = c.replace(/\n?<!-- ABJ JOBS -->[\s\S]*?<!-- \/ABJ JOBS -->\n?/g, '');
    return c.replace(/\s*$/, '') + '\n' + JOBS_CSS;
  };
})();
