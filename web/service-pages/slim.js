/* ABJ slim service pages v2 (Nov 2026): calm, editorial service pages (Nordiska Kök inspired, ABJ brand).
   One linen canvas, few big moments: video hero, three key points, photo tiles with label boxes,
   a film (reel) with a short story, process, proof, enquiry, FAQ. All original words stay on the page. */
(function(){
var D=document,P=location.pathname;
var MAP={
 'bespoke-kitchens-dev-k7q2':'kitchens','bespoke-wardrobes-dev-w4m8':'wardrobes','bespoke-bedrooms-dev-b3n6':'bedrooms',
 'media-walls-dev-m9t5':'mediawalls','bespoke-storage-dev-s2k7':'storage','luxury-worktops-dev-t6p3':'worktops',
 'decors-dev-d8r4':'decors','upholstery-dev-u5h9':'upholstery','office-renovations-dev-o3f7':'office',
 'bespoke-hallways-dev-h4j8':'hallways','bathroom-cabinetry-dev-c6v2':'bathroom','hmo-makeover-dev-m2x5':'hmo'};
/* Full-width desktop layout (Nov 2026): every DEV page (slug ends -dev-xxxx) uses the screen width, not a 1200px column. */
if(/-dev-[a-z0-9]{4,6}\/?$/.test(P))wide();
var key=MAP[P.replace(/^\/|\/$/g,'')];if(!key)return;
var WIDE=window.matchMedia&&matchMedia('(min-width:1024px)').matches;
/* Videos are silent, slow ambient footage, so they start by themselves even when the phone has Reduce Motion switched on (iOS otherwise shows a play button). */
var RM=false;
var MEDIA=(window.ABJ_SLIM_MEDIA||{})[key]||null;

function css(){if(D.getElementById('abjs-slim-css'))return;var st=D.createElement('style');st.id='abjs-slim-css';var X='html.abjsl:not(#x1):not(#x2):not(#x3) ';st.textContent=(
'.abjsl video::-webkit-media-controls-start-playback-button{display:none!important;-webkit-appearance:none!important;opacity:0!important}'+'.abjsl video::-webkit-media-controls{display:none!important;opacity:0!important}'+'.abjsl video::-webkit-media-controls-overlay-play-button{display:none!important;opacity:0!important}'+'.abjsl video::-webkit-media-controls-panel{display:none!important}'+
'.abjsl{--lin:#F4F0E9;--ink:#0E1B1A;--mut:#5E6765;--hair:rgba(14,27,26,.14);--gold:#B08D57}'+
'.abjsl-gone{display:none!important}'+
'.abjsl .hero .abjs-hero-points{display:none}.abjsl .hero .hero-body{max-width:34em}'+
/* one calm canvas, hairline rules between blocks */
'html.abjsl:not(#x1):not(#x2):not(#x3) body .abjsl-lin{background:var(--lin)!important;background-image:none!important;position:relative}'+
'html.abjsl:not(#x1):not(#x2):not(#x3) body .abjsl-lin:after{display:none!important}'+
'html.abjsl:not(#x1):not(#x2):not(#x3) body .abjsl-lin:before{content:none;background:none!important;opacity:1!important}'+
'html.abjsl:not(#x1):not(#x2):not(#x3) body .abjsl-rule:before{content:"";position:absolute;inset:auto;top:0;left:50%;width:min(720px,84%);height:0;transform:translateX(-50%);border-top:1px solid var(--hair);z-index:1}'+
'.abjsl .abjsl-lin .section-header{margin-left:auto;margin-right:auto;max-width:760px}'+
'.abjsl .abjsl-lin .section-header .body-lg,.abjsl-intro{font-size:15px;line-height:1.75;color:var(--mut);letter-spacing:.01em}'+
/* key points */
'.abjsl-keys{padding:clamp(64px,8vw,112px) 0 clamp(48px,6vw,88px)!important}'+
'.abjsl-keys .section-header{margin-bottom:clamp(30px,4vw,52px)}.abjsl-keys .section-header .body-lg{display:none}'+
'.abjsl-kg{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(28px,4vw,72px);max-width:1080px;margin:0 auto;text-align:center}'+
'.abjsl-k b{display:block;font:400 13px/1 "DM Sans",sans-serif;letter-spacing:.24em;color:var(--gold);margin-bottom:14px}'+
'.abjsl-k h3{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:clamp(23px,2vw,28px);line-height:1.15;margin:0 0 10px;color:var(--ink)}'+
'.abjsl-k p{margin:0 auto;max-width:22em;font-size:14.5px;line-height:1.7;color:var(--mut)}'+
/* options: understated tabs + photo tiles with label boxes */
'.abjsl-opts{padding:clamp(64px,8vw,112px) 0!important}.abjsl-opts .section-header{margin-bottom:22px}'+
'.abjsl-tabs{display:flex;gap:clamp(18px,3vw,40px);justify-content:center;margin:0 auto 26px;max-width:760px;border-bottom:1px solid var(--hair)}'+
'.abjsl-tab{appearance:none;border:0;border-bottom:1px solid transparent;margin-bottom:-1px;background:none;color:var(--mut);padding:14px 0;font:500 12px/1 "DM Sans",sans-serif;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;transition:color .25s,border-color .25s;white-space:nowrap}'+
'.abjsl-tab:hover{color:var(--ink)}.abjsl-tab[aria-selected=true]{color:var(--ink);border-bottom-color:var(--ink)}'+
'.abjsl-panel[hidden]{display:none}.abjsl-intro{max-width:44em;margin:0 auto 34px;text-align:center}.abjsl-intro strong{color:var(--ink);font-weight:500}'+
'.abjsl-row{display:flex;gap:22px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding:0 0 6px;-webkit-overflow-scrolling:touch}'+
'.abjsl-row::-webkit-scrollbar{display:none}'+
'.abjsl-row{--n:3}.abjsl-row .p-card{flex:0 0 calc((100% - 22px*(var(--n) - 1))/var(--n));scroll-snap-align:start;margin:0!important;max-width:none!important;background:none!important;box-shadow:none!important;border:0!important;border-radius:0!important;transform:none!important;cursor:pointer}'+
'.abjsl-row .p-card-img{position:relative!important;aspect-ratio:4/5!important;height:auto!important;padding:0!important;overflow:hidden;border-radius:0!important;background:#e7e1d6}'+
'.abjsl-row .p-card-img img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-height:none!important;aspect-ratio:auto!important;object-fit:cover!important;transition:transform 1.4s cubic-bezier(.2,.7,.2,1)}'+
'.abjsl-row .p-card:hover .p-card-img img{transform:scale(1.035)}'+
'.abjsl-lab{position:absolute;left:50%;top:auto;bottom:clamp(14px,1.8vw,24px);transform:translateX(-50%);background:#fff;color:var(--ink);padding:12px 20px;font:500 11.5px/1.25 "DM Sans",sans-serif;letter-spacing:.2em;text-transform:uppercase;white-space:normal;text-align:center;max-width:82%;width:max-content;pointer-events:none}'+
'.abjsl-row .p-card-body{padding:16px 8px 0!important;text-align:center;background:none!important}'+
'.abjsl-row .abjs-tag,.abjsl-row .p-card-title,.abjsl-row .abjs-mini,.abjsl-row .p-card-link{display:none!important}'+
'.abjsl-row .p-card-sub{font-size:13.5px;line-height:1.65;color:var(--mut);display:block;overflow:visible;margin:0}'+
'.abjsl-few{display:none!important}'+
'.abjsl-nav{display:flex;justify-content:center;gap:10px;margin-top:26px}'+
'.abjsl-nav button{width:44px;height:44px;border-radius:50%;border:1px solid var(--hair);background:transparent;color:var(--ink);font-size:16px;cursor:pointer}'+
'.abjsl-nav button:disabled{opacity:.3;cursor:default}'+
/* in-detail points: flat text grid */
'.abjsl-points{padding:clamp(64px,8vw,104px) 0!important}.abjsl-pts .section-header{margin-bottom:14px}'+
'.abjsl-ph2{font-family:"Cormorant Garamond",Georgia,serif!important;font-weight:400!important;font-size:clamp(28px,2.8vw,40px)!important;line-height:1.12!important;text-align:center;margin:8px auto 12px!important;max-width:20em;color:var(--ink)!important;opacity:1!important;transform:none!important}'+
'.abjsl-pg{--c:3;display:grid;grid-template-columns:repeat(var(--c),minmax(0,1fr));gap:30px clamp(24px,3.5vw,56px);max-width:1080px;margin:8px auto 0}'+
'.abjsl-pg>*{background:none!important;box-shadow:none!important;border:0!important;border-top:1px solid var(--hair)!important;border-radius:0!important;padding:20px 2px 0!important;min-height:0!important;opacity:1!important;transform:none!important;text-align:left}'+
'.abjsl-pg h3{font-family:"Cormorant Garamond",Georgia,serif!important;font-weight:500!important;font-size:22px!important;line-height:1.2!important;margin:0 0 8px!important;color:var(--ink)!important}'+
'.abjsl-pg p{font-size:14px!important;line-height:1.7!important;color:var(--mut)!important;margin:0!important}'+
'.abjsl-pg .abjp-svc-link{display:none!important}'+
'.abjsl-pg .abjp-svc-no{color:var(--gold)!important;font-size:13px!important;letter-spacing:.2em}.abjsl-pg i{display:none!important}'+
'.abjsl-pg a{display:inline-block;margin-top:10px;font-size:11.5px!important;letter-spacing:.16em;text-transform:uppercase;color:var(--ink)!important}'+
'.abjsl-tbar{padding:clamp(48px,6vw,80px) 0 0}.abjsl-tbar .abjsl-tabs{margin-bottom:0}'+
'.abjsl-more section{padding:0 0 22px!important;background:none!important;min-height:0!important}.abjsl-more section h2,.abjsl-more section .display{font-size:24px!important;text-align:left!important;margin:0 0 8px!important}.abjsl-more section .body-lg{text-align:left!important;font-size:15px!important;margin:0 0 10px!important}.abjsl-more section .eyebrow{display:none!important}.abjsl-more section .container{padding:0!important;max-width:none!important}'+
/* film: a reel with a short story */
'.abjsl-film{padding:clamp(64px,8vw,112px) 0}'+
'.abjsl-fg{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(32px,6vw,96px);align-items:center;max-width:1080px;margin:0 auto}'+
'.abjsl-fv{position:relative;margin:0;aspect-ratio:4/5;overflow:hidden;background:#d9d2c5;max-height:78vh;justify-self:end;width:100%;max-width:520px}'+
'.abjsl-fv video,.abjsl-fv img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}'+
'.abjsl-fv .abjsl-lab{top:auto;bottom:22px;transform:translateX(-50%)}'+
'.abjsl-ft{max-width:440px}.abjsl-ft .eyebrow{display:inline-block;margin-bottom:18px}'+
'.abjsl-ft h2{font-family:"Cormorant Garamond",Georgia,serif;font-weight:400;font-size:clamp(32px,3.4vw,46px);line-height:1.08;margin:0 0 20px;color:var(--ink)}'+
'.abjsl-ft p{font-size:15px;line-height:1.8;color:var(--mut);margin:0 0 30px}'+
'.abjsl-btn{display:inline-flex;align-items:center;gap:10px;background:var(--ink);color:#F3EEE6!important;padding:15px 24px;font:500 11.5px/1 "DM Sans",sans-serif;letter-spacing:.2em;text-transform:uppercase;text-decoration:none!important;border:0;cursor:pointer;transition:background .25s}'+
'.abjsl-btn:hover{background:#16302C}'+
/* process + proof + FAQ: flat and quiet */
'.abjsl .journey-steps{gap:clamp(20px,3vw,44px)!important}'+
'.abjsl .journey-step{background:none!important;box-shadow:none!important;border:0!important;border-top:1px solid var(--hair)!important;border-radius:0!important;padding:22px 2px 0!important}'+
'.abjsl .journey-step .step-line{display:none!important}.abjsl .journey-step .step-num{color:var(--gold)!important}'+
'.abjsl .journey-step .step-desc{display:block;overflow:visible;font-size:14px;line-height:1.7;color:var(--mut)}'+
'.abjsl .review-card{background:transparent!important;box-shadow:none!important;border:0!important;border-top:1px solid var(--hair)!important;border-radius:0!important}'+
'.abjsl .faq-item{background:transparent!important;box-shadow:none!important;border:0!important;border-bottom:1px solid var(--hair)!important;border-radius:0!important;margin:0!important}'+
'.abjsl .faq-item:first-child{border-top:1px solid var(--hair)!important}'+'.abjsl .faq-item{max-width:860px!important;margin:0 auto!important}'+'.abjsl .faq-btn{font-family:"Cormorant Garamond",Georgia,serif!important;font-size:clamp(19px,1.7vw,23px)!important;font-weight:500!important;color:var(--ink)!important;letter-spacing:0!important;padding:24px 2px!important;background:none!important;display:flex!important;justify-content:space-between!important;align-items:center!important;gap:24px!important;text-align:left!important;line-height:1.3!important}'+'.abjsl .faq-btn .faq-icon{display:none!important}.abjsl .faq-btn:after{content:"+";flex:none;font:300 26px/1 "DM Sans",sans-serif;color:var(--gold);transition:transform .3s}'+'.abjsl .faq-btn[aria-expanded=true]:after{content:"\\2013"}.abjsl .faq-btn:hover{color:var(--gold)!important}'+'.abjsl .faq-body-text{font-size:16px!important;line-height:1.75!important;color:var(--mut)!important;max-width:720px;padding:0 2px 26px!important;margin:0!important}'+
/* folded long copy */
'.abjsl-more{padding:clamp(40px,5vw,72px) 20px}.abjsl-more>details{max-width:820px;margin:0 auto;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)}'+
'.abjsl-more summary{cursor:pointer;list-style:none;padding:22px 0;font-family:"Cormorant Garamond",Georgia,serif;font-size:24px;color:var(--ink);display:flex;justify-content:space-between;align-items:center}'+
'.abjsl-more summary::-webkit-details-marker{display:none}.abjsl-more summary:after{content:"+";font:300 26px/1 "DM Sans",sans-serif;color:var(--gold)}'+
'.abjsl-more details[open] summary:after{content:"\\2013"}'+'.abjsl-more summary{pointer-events:none;cursor:default;font-size:clamp(28px,3vw,38px);padding:30px 0 18px}.abjsl-more summary:after{content:none!important}.abjsl-more>details{border-bottom:0}'+
'.abjsl-more .abjs-prose{padding:0 0 26px}.abjsl-more .abjs-figure{display:none}'+'.abjsl-more>details{max-width:1000px!important;border:0!important}'+'.abjsl-more summary{justify-content:center!important;text-align:center;font-size:clamp(32px,3.2vw,46px)!important;line-height:1.15;padding:0 0 clamp(26px,3vw,44px)!important}'+'.abjsl-more .abjs-prose{display:grid!important;grid-template-columns:minmax(200px,300px) 1fr;column-gap:56px;row-gap:14px;align-items:start;padding:30px 0!important;margin:0!important;border-top:1px solid var(--hair);max-width:none!important}'+'.abjsl-more .abjs-prose:last-of-type{border-bottom:1px solid var(--hair)}'+'.abjsl-more .abjs-prose>h2,.abjsl-more .abjs-prose>h3,.abjsl-more .abjs-prose>h4{grid-column:1!important;font-family:"Cormorant Garamond",Georgia,serif!important;font-size:clamp(21px,1.8vw,25px)!important;font-weight:500!important;line-height:1.25!important;color:var(--ink)!important;margin:0!important;text-align:left!important}'+'.abjsl-more .abjs-prose>:not(h2):not(h3):not(h4){grid-column:2!important;margin:0!important;font-size:16px!important;line-height:1.75!important;color:var(--mut)!important;text-align:left!important;max-width:640px}'+'.abjsl-more .abjs-prose a{color:var(--ink)!important;text-decoration:underline;text-underline-offset:3px;text-decoration-color:var(--gold)}'+'@media(max-width:760px){.abjsl-more .abjs-prose{grid-template-columns:1fr;row-gap:10px;padding:24px 0!important}.abjsl-more .abjs-prose>*{grid-column:1!important}}'+'.abjsl #home .abjs-lead2{display:none!important}'+'.abjsl-kv{display:block;margin:0 0 6px}.abjsl-kv b{display:inline-block;min-width:74px;font-weight:600;color:var(--ink);font-size:11px;letter-spacing:.14em;text-transform:uppercase;margin-right:8px}'+'.abjsl .trust-strip:after{display:none!important}.abjsl .section-header .body-lg,.abjsl .body-lg{-webkit-line-clamp:unset!important;line-clamp:unset!important;display:block!important;overflow:visible!important;max-height:none!important}'+'.abjsl .faq-list{display:block!important;max-width:860px!important;margin:0 auto!important;columns:auto!important}.abjsl .faq-list>.faq-item{width:auto!important;max-width:none!important;flex:none!important}'+
'@media (max-width:1023px){.abjsl-row .p-card{flex-basis:calc((100% - 22px)/2.15)}.abjsl-fg{grid-template-columns:1fr 1fr;gap:36px}}'+
'@media (max-width:767px){.abjsl-kg{grid-template-columns:1fr;gap:0;text-align:left}.abjsl-k{display:grid;grid-template-columns:40px 1fr;column-gap:6px;padding:18px 0;border-top:1px solid var(--hair)}.abjsl-k:last-child{border-bottom:1px solid var(--hair)}.abjsl-k b{grid-row:span 2;margin:6px 0 0}.abjsl-k h3{font-size:22px;margin-bottom:6px}.abjsl-k p{font-size:14px;line-height:1.6;max-width:none;margin:0}.abjsl-keys{padding:56px 0 48px!important}'+
' .abjsl-row{gap:14px;margin:0 -20px;padding:0 20px 6px;scroll-padding:0 20px}.abjsl-row .p-card{flex-basis:80%}.abjsl-nav{display:none}'+
' .abjsl-tabs{overflow-x:auto;justify-content:flex-start;gap:24px;margin:0 -20px 22px;padding:0 20px;scrollbar-width:none}.abjsl-tabs::-webkit-scrollbar{display:none}.abjsl-tab{flex:0 0 auto}'+
' '+X+'.abjsl-pg{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:16px;margin:8px -20px 0;padding:0 20px 6px;scrollbar-width:none}.abjsl-pg::-webkit-scrollbar{display:none}'+X+'.abjsl-pg>*{flex:0 0 78%;scroll-snap-align:start}.abjsl-tbar .abjsl-tabs{justify-content:flex-start}'+
' .abjsl-lab{letter-spacing:.14em;padding:10px 14px;font-size:11px}'+
' .abjsl-fg{grid-template-columns:1fr;gap:30px}.abjsl-fv{justify-self:stretch;max-width:none;max-height:none;margin:0 -20px;width:auto}.abjsl-ft{max-width:none;text-align:center}'+
' .abjsl .hero .hero-body{font-size:16px}}').replace(/(^|\})\.abjsl (?=\.(journey|review|faq))/g,'$1'+X).replace(/(^|\})(\.abjsl-row \.p-card|\.abjsl-pg|\.abjsl-ph2)/g,'$1'+X+'$2');
D.head.appendChild(st)}

/* Premium layer (Nov 2026): Poliform / Molteni / Sola cues. Space instead of lines, quiet small type,
   captions under photos, numbered editorial items, thin outline buttons. Presentation only; every word stays. */
function lux(){if(D.getElementById('abjs-lux-css'))return;var X='html.abjsl:not(#x1):not(#x2):not(#x3):not(#x4):not(#x5):not(#x6) body ';
var pre=function(sel){return sel.split(',').map(function(q){return X+q.trim()}).join(',')};
var CG='"Cormorant Garamond",Georgia,serif',DM='"DM Sans",sans-serif';
var R=[
['.abjsl-lin','padding-top:clamp(30px,3vw,52px)!important;padding-bottom:clamp(30px,3vw,52px)!important'],
['.abjsl-rule:before','content:none!important;display:none!important'],
['.abjsl-lin .eyebrow,.abjsl-lin .abjp-eb','font:500 11px/1.4 '+DM+'!important;letter-spacing:.3em!important;text-transform:uppercase!important;color:var(--mut)!important;background:none!important;padding:0!important;gap:0!important'],
['.abjsl-lin .eyebrow:before,.abjsl-lin .eyebrow:after,.abjsl-lin .abjp-eb:before,.abjsl-lin .abjp-eb:after','content:none!important;display:none!important'],
['.abjsl-lin .section-header','margin-bottom:clamp(24px,2.6vw,40px)!important'],
['.abjsl-lin .section-header .eyebrow','display:inline-block!important;margin-bottom:16px!important'],
['.abjsl-lin .section-header h2,.abjsl-lin h2.display,.abjsl-lin .abjsl-ph2,.abjsl-ft h2,.abjsl-more summary','font-family:'+CG+'!important;font-weight:400!important;font-size:clamp(34px,3.5vw,54px)!important;line-height:1.06!important;letter-spacing:-.012em!important;color:var(--ink)!important'],
['.abjsl-lin .section-header .body-lg','font-size:15px!important;line-height:1.8!important;max-width:34em!important;margin:14px auto 0!important;color:var(--mut)!important'],
/* three key points: editorial, numbered */
['.abjsl-kg','max-width:1200px!important;text-align:left!important;gap:clamp(32px,5vw,88px)!important'],
['.abjsl-k','border-top:1px solid var(--hair);padding-top:28px'],
['.abjsl-k b','font:italic 400 19px/1 '+CG+'!important;letter-spacing:0!important;color:var(--gold)!important;margin-bottom:24px!important'],
['.abjsl-k h3','font-weight:400!important;font-size:clamp(24px,2.1vw,30px)!important;margin:0 0 12px!important'],
['.abjsl-k p','margin:0!important;max-width:26em!important;font-size:14.5px!important;line-height:1.75!important'],
/* tabs + tiles: caption below the photo, staggered row */
['.abjsl-tab','font-size:11px!important;letter-spacing:.26em!important;padding:16px 0!important'],
['.abjsl-intro','font-size:15px!important;line-height:1.8!important;margin-bottom:clamp(24px,2.6vw,40px)!important'],
['.abjsl-row','align-items:flex-start!important'],
['.abjsl-row .p-card-body','text-align:left!important;padding:20px 0 0!important'],
['.abjsl-cap','display:flex;align-items:baseline;gap:12px;margin:0 0 10px;font:500 11px/1.35 '+DM+';letter-spacing:.24em;text-transform:uppercase;color:var(--ink)'],
['.abjsl-cap i','font:italic 400 17px/1 '+CG+';letter-spacing:0;text-transform:none;color:var(--gold)'],
['.abjsl-row .p-card-sub','font-size:14px!important;line-height:1.7!important;max-width:30em'],
['.abjsl-row .p-card-img img','transition:transform 1.4s cubic-bezier(.2,.7,.2,1)!important'],
/* film: large picture, caption beneath, text set low to the side */
['.abjsl-fg','grid-template-columns:minmax(0,7fr) minmax(0,5fr)!important;max-width:1240px!important;gap:clamp(40px,7vw,120px)!important;align-items:end!important'],
['.abjsl-fv','aspect-ratio:auto!important;overflow:visible!important;background:none!important;max-height:none!important;max-width:620px!important;width:100%!important;justify-self:end!important'],
['.abjsl-fvi','position:relative;aspect-ratio:4/5;max-height:76vh;overflow:hidden;background:#d9d2c5'],
['.abjsl-fvi video','position:absolute;inset:0;width:100%;height:100%;object-fit:cover'],
['.abjsl-fcap','margin-top:18px'],
['.abjsl-ft','max-width:420px!important;padding-bottom:clamp(0px,3vw,40px)'],
['.abjsl-ft .eyebrow','margin-bottom:24px!important'],
['.abjsl-ft h2','margin-bottom:24px!important'],
['.abjsl-ft p','font-size:15px!important;line-height:1.85!important;margin-bottom:36px!important'],
/* buttons: thin outline pills */
['.abjsl-btn,.testimonials .btn,.journey .btn','background:transparent!important;color:var(--ink)!important;border:1px solid var(--ink)!important;border-radius:999px!important;padding:16px 30px!important;font:500 11px/1 '+DM+'!important;letter-spacing:.24em!important;text-transform:uppercase!important;box-shadow:none!important;transition:background .35s,color .35s!important;-webkit-text-fill-color:currentColor!important'],
['.abjsl-btn:hover,.testimonials .btn:hover,.journey .btn:hover','background:var(--ink)!important;color:#F3EEE6!important;-webkit-text-fill-color:#F3EEE6!important'],
['.testimonials .btn svg','display:none!important'],
/* process */
['.journey .step-line','display:none!important'],
['.journey .step-num','font:italic 400 19px/1 '+CG+'!important;color:var(--gold)!important;background:none!important;border:0!important;width:auto!important;height:auto!important;box-shadow:none!important;margin-bottom:22px!important;display:block!important'],
['.journey .step-num:before','content:"("!important;display:inline!important;position:static!important;width:auto!important;height:auto!important;background:none!important;border:0!important;margin:0!important'],
['.journey .step-num:after','content:")"!important;position:static!important;display:inline!important;width:auto!important;height:auto!important;background:none!important;border:0!important;margin:0!important'],
['.journey .step-title','font-family:'+CG+'!important;font-weight:400!important;font-size:clamp(22px,1.9vw,27px)!important;line-height:1.2!important;color:var(--ink)!important;margin-bottom:10px!important'],
/* reviews: words first, no avatars or quote graphics */
['.review-card:before,.review-card:after','content:none!important;display:none!important'],
['.review-avatar','display:none!important'],
['.review-stars','font-size:11px!important;letter-spacing:.32em!important;color:var(--gold)!important;margin-bottom:18px!important'],
['.review-text','font-family:'+CG+'!important;font-style:italic!important;font-size:clamp(20px,1.7vw,24px)!important;line-height:1.45!important;color:var(--ink)!important'],
['.review-author','border:0!important;padding-top:4px!important;gap:0!important'],
/* numbers band: quiet figures on linen */
['.stats-section','background:var(--lin)!important;background-image:none!important;padding:clamp(36px,3.6vw,56px) 0!important;border-top:1px solid var(--hair)!important;border-bottom:1px solid var(--hair)!important'],
['.stats-section:before,.stats-section:after','content:none!important;display:none!important'],
['.stat-num,.stat-num span','font-family:'+CG+'!important;font-weight:300!important;font-size:clamp(44px,4.4vw,64px)!important;line-height:1!important;color:var(--ink)!important;text-shadow:none!important;background:none!important;-webkit-text-fill-color:currentColor!important'],
['.stat-num span[aria-hidden]','font-size:.5em!important;vertical-align:.7em;color:var(--gold)!important;margin-left:4px'],
['.stat-label','font:500 11px/1.4 '+DM+'!important;letter-spacing:.28em!important;text-transform:uppercase!important;color:var(--mut)!important;margin-top:16px!important'],
/* "More about": heading to the left, numbered notes to the right */
['.abjsl-more>details','display:grid!important;grid-template-columns:minmax(0,5fr) minmax(0,7fr);column-gap:clamp(40px,7vw,120px);max-width:1200px!important;margin:0 auto!important;align-items:start;counter-reset:abjm'],
['.abjsl-more summary','display:block!important;text-align:left!important;position:sticky;top:120px;padding:0!important;grid-column:1;grid-row:1 / span 30;font-size:clamp(34px,3.4vw,50px)!important'],
['.abjsl-more summary:before','content:"In detail";display:block;font:500 11px/1.4 '+DM+';letter-spacing:.3em;text-transform:uppercase;color:var(--mut);margin-bottom:22px'],
['.abjsl-more .abjs-prose','grid-column:2!important;display:block!important;border:0!important;padding:0!important;margin:0!important'],
['.abjsl-more .abjs-prose>h2,.abjsl-more .abjs-prose>h3,.abjsl-more .abjs-prose>h4','font-weight:400!important;font-size:clamp(22px,1.9vw,27px)!important;border-top:1px solid var(--hair);padding-top:20px!important;margin:0 0 8px!important'],
['.abjsl-more .abjs-prose>h2:before,.abjsl-more .abjs-prose>h3:before,.abjsl-more .abjs-prose>h4:before','counter-increment:abjm;content:"(" counter(abjm,decimal-leading-zero) ")";display:block;font:italic 400 17px/1 '+CG+';color:var(--gold);margin-bottom:16px'],
['.abjsl-more .abjs-prose>:not(h2):not(h3):not(h4)','font-size:15px!important;line-height:1.75!important;margin:0 0 20px!important;max-width:36em'],
['.abjsl-lin,.stats-section,.abjp-duo','font-variant-numeric:lining-nums proportional-nums'],
/* finance + enquiry: solid ink panel, no badges or patterns */
['.abjp-fin','background:#0E1B1A!important;background-image:none!important;border-radius:0!important;box-shadow:none!important'],
['.abjp-fin:before,.abjp-fin:after','content:none!important;display:none!important'],
['.abjp-fin-chip','background:none!important;border:0!important;padding:0!important;border-radius:0!important;color:#C9A96E!important;font:500 11px/1.4 '+DM+'!important;letter-spacing:.3em!important;text-transform:uppercase!important'],
['.abjp-fin-ico','display:none!important'],
['.abjp-fin ol li b','background:none!important;border:0!important;box-shadow:none!important;width:auto!important;min-width:30px!important;height:auto!important;font:italic 400 18px/1 '+CG+'!important;color:#C9A96E!important;justify-content:flex-start!important'],
['.abjp-fin .btn-primary,#quick-enquiry .abjp-fin-acts .btn.btn-primary','background:#F3EEE6!important;background-image:none!important;color:#0E1B1A!important;border:1px solid #F3EEE6!important;border-radius:999px!important;padding:16px 30px!important;font:500 11px/1 '+DM+'!important;letter-spacing:.24em!important;box-shadow:none!important;-webkit-text-fill-color:currentColor!important'],
['.abjp-fin .btn-primary:hover,#quick-enquiry .abjp-fin-acts .btn.btn-primary:hover','background:transparent!important;color:#F3EEE6!important'],
['.abjp-duo-grid>:last-child','box-shadow:none!important;border-radius:0!important'],
/* FAQ: heading to the left, questions to the right */
['.faq-section .section-header,.faq-section h2.display','text-align:left!important'],
['.faq-section h2.display:before','content:"Questions";display:block;font:500 11px/1.4 '+DM+';letter-spacing:.3em;text-transform:uppercase;color:var(--mut);margin-bottom:22px'],
['@media (min-width:1024px)',[['.faq-section>.container','display:grid!important;grid-template-columns:minmax(0,5fr) minmax(0,7fr);column-gap:clamp(40px,7vw,120px);max-width:1200px!important;align-items:start'],
 ['.faq-section>.container>h2','grid-column:1;grid-row:1;margin:0!important;position:sticky;top:120px'],
 ['.faq-section>.container>.body-lg','grid-column:1;grid-row:2;text-align:left!important;margin:22px 0 0!important;max-width:30em!important'],
 ['.faq-section>.container>.faq-list','grid-column:2;grid-row:1 / span 3;max-width:none!important;margin:0!important;width:100%']]],
['.abjsl-k b,.abjsl-cap i,.journey .step-num,.journey .step-num:before,.journey .step-num:after,.abjsl-more .abjs-prose>h2:before,.abjsl-more .abjs-prose>h3:before,.abjsl-more .abjs-prose>h4:before,.abjp-fin ol li b,.stat-num,.stat-num span','font-feature-settings:"lnum" 1!important;font-variant-numeric:lining-nums!important'],
['#home.abjsl-k-upholstery .hero-visual img','transform:scale(1.28)!important;transform-origin:12% 50%!important'],
['@media (min-width:1024px)',[['.abjsl-row .p-card:nth-child(3n+2)','margin-top:clamp(24px,3vw,48px)!important']]],
['@media (max-width:767px)',[
 ['.abjsl-fg','grid-template-columns:1fr!important;gap:32px!important'],
 ['.abjsl-fv','max-width:none!important;justify-self:stretch!important;margin:0 -20px!important;width:auto!important'],
 ['.abjsl-fcap','padding:0 20px'],
 ['.abjsl-ft','text-align:left!important;padding-bottom:0'],
 ['.abjsl-k b','margin-bottom:0!important'],
 ['.abjsl-more>details','grid-template-columns:1fr'],
 ['.abjsl-more summary','position:static;grid-row:auto;margin-bottom:28px!important'],
 ['.abjsl-more .abjs-prose','grid-column:1!important'],
 ['.stat-item + .stat-item','border-left:0!important']]]
];
var out='';R.forEach(function(r){if(r[0].charAt(0)==='@'){out+=r[0]+'{'+r[1].map(function(q){return pre(q[0])+'{'+q[1]+'}'}).join('')+'}'}else out+=pre(r[0])+'{'+r[1]+'}'});
var st=D.createElement('style');st.id='abjs-lux-css';st.textContent=out;D.head.appendChild(st)}

function txt(e){return (e&&e.textContent||'').replace(/\s+/g,' ').trim()}
function firstSentence(s){var m=s.match(/^(.{40,220}?[.!?])(\s|$)/);return m?m[1]:s}
function top(){return [].slice.call(D.querySelectorAll('section')).filter(function(s){return !s.parentElement.closest('section')})}
function gone(e){e.classList.add('abjsl-gone');e.style.setProperty('display','none','important')}
function hideExcept(root,keep){[].slice.call(root.children).forEach(function(ch){if(keep.indexOf(ch)>=0)return;if(keep.some(function(k){return ch.contains(k)})){hideExcept(ch,keep);return}gone(ch)})}
function lab(t){var l=D.createElement('span');l.className='abjsl-lab';l.textContent=t;return l}

function keys(sec){ // first image-card section -> three numbered key points, no photos
 var cards=[].slice.call(sec.querySelectorAll('.p-card')).slice(0,3);if(cards.length<2)return false;
 var g=D.createElement('div');g.className='abjsl-kg';
 cards.forEach(function(c,i){var k=D.createElement('div');k.className='abjsl-k';
  k.innerHTML='<b>(0'+(i+1)+')</b><h3></h3><p></p>';k.querySelector('h3').textContent=txt(c.querySelector('.p-card-title'));
  k.querySelector('p').textContent=firstSentence(txt(c.querySelector('.p-card-sub')));g.appendChild(k)});
 var hd=sec.querySelector('.section-header'),ct=sec.querySelector('.container')||sec;
 ct.appendChild(g);hideExcept(sec,[hd,g].filter(Boolean));sec.classList.add('abjsl-keys');return true}

function tile(c){ // card -> Nordiska-style tile: tall photo, white label box, one-line caption
 c.classList.remove('reveal');c.classList.add('visible');
 var im=c.querySelector('.p-card-img'),t=txt(c.querySelector('.p-card-title'));
 var IM=(MEDIA&&MEDIA.img)||{},ov=IM[t]||IM[t.split(/\s*[:–—]\s*|\s+with\s+/)[0]];if(ov&&im&&im.querySelector('img')){var i=im.querySelector('img');i.src=ov;i.removeAttribute('srcset')}
 if(t){var bd=c.querySelector('.p-card-body');if(!bd){bd=D.createElement('div');bd.className='p-card-body';c.appendChild(bd)}if(!bd.querySelector('.abjsl-cap')){var cp=D.createElement('div');cp.className='abjsl-cap';cp.innerHTML='<i></i><span></span>';cp.lastChild.textContent=t.split(/\s*[:–—]\s*|\s+with\s+/)[0];bd.insertBefore(cp,bd.firstChild)}}
 var sub=c.querySelector('.p-card-sub');if(sub){sub.textContent=txt(sub).replace(/\s*[\u2192\u279D>]+\s*$/,'').replace(/\s*(Explore|View|See)\s[^.]*$/,'')}
 return c}

function options(secs){ // remaining image-card sections -> one tabbed, swipeable row of tiles
 if(!secs.length)return null;
 var host=secs[0],ct=host.querySelector('.container')||host;
 var wrap=D.createElement('div');var tabs=D.createElement('div');tabs.className='abjsl-tabs';tabs.setAttribute('role','tablist');
 var panels=[];
 secs.forEach(function(s,i){
  var h2=s.querySelector('h2'),eb=s.querySelector('.eyebrow,.abjp-eb'),intro=s.querySelector('.section-header .body-lg, .body-lg');
  var label=short(txt(eb)||txt(h2)||('Option '+(i+1)));
  var b=D.createElement('button');b.type='button';b.className='abjsl-tab';b.setAttribute('role','tab');b.textContent=label;b.setAttribute('aria-selected',i?'false':'true');tabs.appendChild(b);
  var p=D.createElement('div');p.className='abjsl-panel';p.setAttribute('role','tabpanel');if(i)p.hidden=true;
  if(s.id&&s!==host){p.id=s.id;s.removeAttribute('id')}else if(s.id){p.setAttribute('data-anchor',s.id)}
  var it=D.createElement('p');it.className='abjsl-intro';it.innerHTML=(h2&&secs.length>1?'<strong>'+h2.innerHTML+'.</strong> ':'')+(intro?firstSentence(txt(intro)):'');if(txt(it))p.appendChild(it);
  var row=D.createElement('div');row.className='abjsl-row';
  [].slice.call(s.querySelectorAll('.p-card')).forEach(function(c){row.appendChild(tile(c))});
  [].forEach.call(row.querySelectorAll('.abjsl-cap i'),function(e,k){e.textContent='('+(k<9?'0':'')+(k+1)+')'});
  if(row.children.length<3)row.style.justifyContent='center';p.appendChild(row);
  var nav=D.createElement('div');nav.className='abjsl-nav';nav.innerHTML='<button type="button" aria-label="Previous">&#8592;</button><button type="button" aria-label="Next">&#8594;</button>';
  var bs=nav.querySelectorAll('button');var upd=function(){bs[0].disabled=row.scrollLeft<8;bs[1].disabled=row.scrollLeft+row.clientWidth>row.scrollWidth-8};
  bs[0].onclick=function(){row.scrollBy({left:-row.clientWidth*0.9,behavior:'smooth'})};bs[1].onclick=function(){row.scrollBy({left:row.clientWidth*0.9,behavior:'smooth'})};
  row.addEventListener('scroll',upd,{passive:true});setTimeout(upd,300);p.appendChild(nav);
  if(row.children.length<=3)nav.classList.add('abjsl-few');
  panels.push(p);
  b.addEventListener('click',function(){[].forEach.call(tabs.children,function(t,k){t.setAttribute('aria-selected',k===i?'true':'false')});panels.forEach(function(q,k){q.hidden=k!==i});setTimeout(function(){var r=p.querySelector('.abjsl-row');r&&r.dispatchEvent(new Event('scroll'))},50)});
  if(s!==host)gone(s);
 });
 var hd=host.querySelector('.section-header');
 if(hd){hd.querySelector('.body-lg')&&gone(hd.querySelector('.body-lg'));var h2=hd.querySelector('h2');if(h2&&secs.length>1){h2.textContent='Explore the options';var eb=hd.querySelector('.eyebrow');if(eb)eb.textContent='Styles, layouts & projects'}}
 if(secs.length>1)wrap.appendChild(tabs);panels.forEach(function(p){wrap.appendChild(p)});ct.appendChild(wrap);hideExcept(host,[hd,wrap].filter(Boolean));host.classList.add('abjsl-opts');
 D.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;var id=a.getAttribute('href').slice(1);
  panels.forEach(function(p,k){if(p.id===id||p.getAttribute('data-anchor')===id){e.preventDefault();tabs.children[k]&&tabs.children[k].click();window.scrollTo({top:host.getBoundingClientRect().top+pageYOffset-70,behavior:'smooth'})}})},true);
 return host}

function photoCards(sec){ // gallery photos -> plain photo tiles (no label)
 var grid=sec.querySelector('.abjs-photos,.bc-gallery-grid');if(!grid)return false;
 [].slice.call(grid.children).forEach(function(it){var im=it.querySelector('img');if(!im)return;
  var c=D.createElement('div');c.className='p-card abjsl-ph';var w=D.createElement('div');w.className='p-card-img';w.appendChild(im);c.appendChild(w);
  var cap=it.querySelector('figcaption,.abjs-cap,p');if(cap&&txt(cap)){var bd=D.createElement('div');bd.className='p-card-body';bd.innerHTML='<div class="p-card-sub"></div>';bd.firstChild.textContent=txt(cap);c.appendChild(bd)}
  grid.appendChild(c);gone(it)});
 return true}

function short(t){t=(t||'').replace(/^(the|our)\s+/i,'');t=t.charAt(0).toUpperCase()+t.slice(1);if(t.length<=28)return t;var w=t.split(/[,:–—-]/)[0].trim();if(w.length>28)w=w.slice(0,29).replace(/\s+\S*$/,'');return w.replace(/(\s+(we|to|the|and|of|for|a|an|in|on|with|your|that|is|are|it))+$/i,'')}

function points(secs){ // text-card grids -> one quiet, tabbed "in detail" section (original h2s move into the panels)
 if(!secs.length)return null;var host=secs[0],ct=host.querySelector('.container')||host;
 var wrap=D.createElement('div');wrap.className='abjsl-pts';var tabs=D.createElement('div');tabs.className='abjsl-tabs';tabs.setAttribute('role','tablist');var panels=[];
 var head=D.createElement('div');head.className='section-header text-center';head.innerHTML='<span class="eyebrow">In detail</span>';
 secs.forEach(function(s,i){
  var eb=s.querySelector('.eyebrow'),h2=s.querySelector('h2,.display'),bl=s.querySelector('.body-lg'),g=s.querySelector('.grid-3');
  var b=D.createElement('button');b.type='button';b.className='abjsl-tab';b.setAttribute('role','tab');b.textContent=short(txt(eb)||txt(h2)||('Detail '+(i+1)));b.setAttribute('aria-selected',i?'false':'true');tabs.appendChild(b);
  var p=D.createElement('div');p.className='abjsl-panel';p.setAttribute('role','tabpanel');if(i)p.hidden=true;
  if(s.id&&s!==host){p.id=s.id;s.removeAttribute('id')}else if(s.id){p.setAttribute('data-anchor',s.id)}
  if(h2){h2.classList.remove('reveal');h2.classList.add('abjsl-ph2');p.appendChild(h2)}
  if(bl&&txt(bl)){var it=D.createElement('p');it.className='abjsl-intro';it.textContent=firstSentence(txt(bl));p.appendChild(it)}
  var pg=D.createElement('div');pg.className='abjsl-pg';if(g)[].slice.call(g.children).forEach(function(c){c.classList.remove('reveal');c.classList.add('visible');pg.appendChild(c)});
  pg.style.setProperty('--c',Math.min(pg.children.length===4?2:3,pg.children.length||1));p.appendChild(pg);panels.push(p);
  b.addEventListener('click',function(){[].forEach.call(tabs.children,function(t,k){t.setAttribute('aria-selected',k===i?'true':'false')});panels.forEach(function(q,k){q.hidden=k!==i})});
  if(s!==host)gone(s)});
 if(secs.length>1){wrap.appendChild(head);wrap.appendChild(tabs)}
 panels.forEach(function(p){wrap.appendChild(p)});ct.appendChild(wrap);hideExcept(host,[wrap]);host.classList.add('abjsl-points');
 return host}

function toggles(secs){ // whole interactive sections (e.g. finishes explorer + price guide) shown one at a time
 secs=secs.filter(Boolean);if(secs.length<2)return null;
 var bar=D.createElement('section');bar.className='abjsl-tbar';bar.innerHTML='<div class="container"><div class="abjsl-tabs" role="tablist"></div></div>';var tabs=bar.querySelector('.abjsl-tabs');
 secs.forEach(function(s,i){var b=D.createElement('button');b.type='button';b.className='abjsl-tab';b.setAttribute('role','tab');b.textContent=short(txt(s.querySelector('.eyebrow,.section-header .badge'))||txt(s.querySelector('h2')));b.setAttribute('aria-selected',i?'false':'true');tabs.appendChild(b);
  if(i)gone(s);b.addEventListener('click',function(){[].forEach.call(tabs.children,function(t,k){t.setAttribute('aria-selected',k===i?'true':'false')});secs.forEach(function(q,k){if(k===i){q.classList.remove('abjsl-gone');q.style.removeProperty('display')}else gone(q)})})});
 secs[0].parentNode.insertBefore(bar,secs[0]);return bar}

function book(){ // the hero's own "Book your free design visit" control, so the film CTA behaves identically
 var a=[].slice.call(D.querySelectorAll('#home a, #home button')).filter(function(x){return /book/i.test(txt(x))})[0];return a||null}

function film(after){ // a second reel with a short story, Nordiska-style split
 var F=MEDIA&&MEDIA.film;if(!F||!F.v||!after)return null;
 var s=D.createElement('section');s.className='abjsl-film abjsl-lin';s.id='abj-film';
 s.innerHTML='<div class="container"><div class="abjsl-fg"><figure class="abjsl-fv"></figure><div class="abjsl-ft"><span class="eyebrow"></span><h2></h2><p></p><a class="abjsl-btn" href="/bookingform">Book your free design visit <span aria-hidden="true">&#8594;</span></a></div></div></div>';
 var fig=s.querySelector('.abjsl-fv');var v=D.createElement('video');v.muted=true;v.defaultMuted=true;['muted','playsinline','webkit-playsinline','loop','disablepictureinpicture'].forEach(function(a){v.setAttribute(a,'')});
 v.setAttribute('preload','none');if(F.p)v.setAttribute('poster',F.p);v.setAttribute('aria-label',F.alt||F.title||'ABJ project film');
 var so=D.createElement('source');so.src=F.v;so.type='video/mp4';v.appendChild(so);var fi=D.createElement('div');fi.className='abjsl-fvi';fi.appendChild(v);fig.appendChild(fi);if(F.label){var fc=D.createElement('figcaption');fc.className='abjsl-cap abjsl-fcap';fc.textContent=F.label;fig.appendChild(fc)}
 s.querySelector('.eyebrow').textContent=F.kicker||'Made in Peterborough';s.querySelector('h2').textContent=F.title||'';s.querySelector('p').textContent=F.text||'';
 var cta=s.querySelector('.abjsl-btn'),hb=book();if(hb){cta.addEventListener('click',function(e){var h=hb.getAttribute('href');if(!h||h.charAt(0)==='#'||/^javascript/.test(h)){e.preventDefault();hb.click()}else{cta.href=h}})}
 after.parentNode.insertBefore(s,after.nextSibling);
 if(!RM&&'IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){v.preload='auto';v.autoplay=true;v.setAttribute('autoplay','');var p=v.play();p&&p.catch&&p.catch(function(){})}else{v.pause()}})},{rootMargin:'120px 0px'}).observe(fig)}
 /* phones that hold back autoplay (e.g. iPhone Low Power Mode): start on the first touch anywhere, no play button */
 if(!RM){var inV=function(){var r=fig.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight};var tap=function(){if(v.paused&&inV()){v.preload='auto';var p=v.play();p&&p.catch&&p.catch(function(){})}};['touchstart','touchend','pointerdown','click'].forEach(function(e){D.addEventListener(e,tap,{passive:true})});v.addEventListener('playing',function(){['touchstart','touchend','pointerdown','click'].forEach(function(e){D.removeEventListener(e,tap)})})}
 return s}

function fold(prose,h1){ // all long copy kept, folded behind one line
 if(!prose.length)return null;prose.forEach(function(p){p.classList.remove('abjsl-gone');p.style.removeProperty('display')});var faq=D.querySelector('.faq-section'),before=faq||D.querySelector('.abj-embed-form-section');if(!before)return null;
 var box=D.createElement('section');box.className='abjsl-more abjsl-lin';var d=D.createElement('details');d.open=true;d.addEventListener('toggle',function(){if(!d.open)d.open=true});var su=D.createElement('summary');su.setAttribute('tabindex','-1');
 su.textContent='More about '+(h1||'this service').replace(/\s+in Peterborough.*$/i,'').replace(/^Bespoke\s+/i,'bespoke ').toLowerCase();d.appendChild(su);
 prose.forEach(function(p){d.appendChild(p)});try{[].forEach.call(d.querySelectorAll('.abjs-prose'),function(p){[].slice.call(p.children).forEach(function(c){if(/^(load map|view map|read all .*reviews?|read our .*reviews?)$/i.test(c.textContent.trim()))c.remove()});var k=[].slice.call(p.children);k.forEach(function(c,i){if(/^H[2-4]$/.test(c.tagName)){var n=c.nextElementSibling;if(!n||/^H[2-4]$/.test(n.tagName))c.remove()}});if(p.textContent.replace(/\s+/g,' ').trim().length<25)p.remove()})}catch(e){}if(txt(d).length-txt(su).length<120)return null;box.appendChild(d);before.parentNode.insertBefore(box,before);return box}

function hero(){ // two crossfading clips, same behaviour as the homepage hero
 if(!MEDIA)return;var h=D.getElementById('home'),vis=h&&h.querySelector('.hero-visual');if(!vis||vis.querySelector('video.abjp-hv'))return;
 var C=(WIDE?MEDIA.wide:MEDIA.tall)||[];if(!C.length)return;
 var cur=0,sw=false;var mk=function(c,k){var v=D.createElement('video');v.className='abjp-hv'+(k?'':' on');v.muted=true;v.defaultMuted=true;v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.setAttribute('disablepictureinpicture','');v.setAttribute('preload',k?'none':'auto');v.setAttribute('loop','');if(c.p)v.setAttribute('poster',c.p);v.setAttribute('aria-hidden','true');if(!k&&!RM){v.setAttribute('autoplay','');v.autoplay=true}var s=D.createElement('source');s.src=c.v;s.type='video/mp4';v.appendChild(s);return v};
 var V=C.map(mk);var shade=vis.querySelector('.abjp-hv-shade'),cap=vis.querySelector('.abjp-hv-cap'),own=!shade;
 if(!shade){shade=D.createElement('div');shade.className='abjp-hv-shade'}if(!cap){cap=D.createElement('div');cap.className='abjp-hv-cap'}cap.textContent=(MEDIA.caps||[])[0]||'';
 [].slice.call(vis.querySelectorAll('img.abjp-hv')).forEach(function(i){i.classList.remove('on');i.style.opacity='0'});
 if(V.length>1){V.forEach(function(v){v.removeAttribute('loop')});var go=function(){if(sw)return;var nx=(cur+1)%V.length,a=V[cur],n=V[nx];if(n.readyState<3){if(n.preload!=='auto'){n.preload='auto';n.load()}a.currentTime=0;a.play&&a.play();return}sw=true;n.currentTime=0;var pr;try{pr=n.play()}catch(e){}var swap=function(){n.classList.add('on');cap.classList.add('fade');setTimeout(function(){cap.textContent=(MEDIA.caps||[])[nx]||'';cap.classList.remove('fade')},450);setTimeout(function(){a.classList.remove('on');a.pause();a.currentTime=0;cur=nx;sw=false},900)};if(pr&&pr.then)pr.then(swap,function(){sw=false;a.currentTime=0;a.play()});else swap()};
  V.forEach(function(v,k){v.addEventListener('timeupdate',function(){if(k===cur&&v.duration&&v.currentTime>v.duration-0.75)go()});v.addEventListener('ended',function(){if(k===cur)go()})});
  V[0].addEventListener('playing',function(){setTimeout(function(){if(V[1].preload!=='auto'){V[1].preload='auto';V[1].load()}},2000)},{once:true})}
 var kick=function(){var v=V[cur];if(v&&v.paused&&!RM){var p=v.play();p&&p.catch&&p.catch(function(){})}};
 ['touchstart','touchend','scroll','pointerdown','click'].forEach(function(e){window.addEventListener(e,kick,{passive:true})});
 [].slice.call(vis.querySelectorAll('img')).forEach(function(i){i.classList.add('abjsl-under')});
 V.forEach(function(v){shade.parentNode===vis?vis.insertBefore(v,shade):vis.appendChild(v)});if(own){vis.appendChild(shade);vis.appendChild(cap)}h.classList.add('abjp-vid');if(!RM){kick();['loadedmetadata','loadeddata','canplay','canplaythrough'].forEach(function(e){V[0].addEventListener(e,kick)});D.addEventListener('visibilitychange',function(){if(!D.hidden)kick()});window.addEventListener('pageshow',kick);var tries=0,iv=setInterval(function(){kick();if(++tries>16||!V[cur].paused)clearInterval(iv)},400);if('IntersectionObserver' in window)new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)kick()})}).observe(vis)}}

function wide(){if(D.getElementById('abjw-css'))return;D.documentElement.classList.add('abjw');
/* Desktop (1200px+) only: full-width containers, editorial split headings (title left, description right), hero text aligned with the logo, booking form and finance merged into one card. Phones unchanged. */
var X='html.abjw:not(#x1):not(#x2):not(#x3):not(#x4):not(#x5):not(#x6):not(#x7):not(#x8) body ';
var c="@media (min-width:1200px){html.abjw{--wmax:1760px;--wpad:clamp(32px,4.2vw,88px);--wg:#0E1B1A;--wg2:#16302C;--wcr:#F3EEE6;--wgo:#C9A96E;--wink:#1d2624;--wmut:#5f6866;--whair:rgba(14,27,26,.12)}X .container,X .header-inner,X .cookie-inner,X .abjf-w{max-width:var(--wmax)!important;width:100%!important;padding-left:var(--wpad)!important;padding-right:var(--wpad)!important;box-sizing:border-box!important;margin-left:auto!important;margin-right:auto!important}X .container .container{padding-left:0!important;padding-right:0!important}X .journey-steps,X .faq-list,X .faq-item,X .abjsl-kg,X .abjsl-pg{max-width:none!important}X #home.abjp-full .container{max-width:none!important;padding-left:0!important;padding-right:0!important}X #home.abjp-full .hero-content{left:0!important;margin-left:calc(max((100% - var(--wmax))/2,0px) + var(--wpad))!important;width:min(780px,46vw)!important;max-width:none!important;padding-left:0!important}X .section-header,X .cmp-intro{display:grid!important;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);column-gap:clamp(48px,6vw,128px);row-gap:12px;align-items:end;text-align:left!important;max-width:none!important;width:100%!important;margin:0 0 clamp(32px,3vw,52px)!important;padding:0!important}X .section-header>*,X .cmp-intro>*{grid-column:1;margin-left:0!important;margin-right:0!important;text-align:left!important;max-width:none!important;justify-self:start}X .section-header>h2,X .section-header>.display,X .cmp-intro>h2{margin:0!important;max-width:22em!important}X .section-header>p,X .section-header>.body-lg,X .cmp-intro>p{grid-column:2!important;grid-row:1 / span 3;align-self:end;max-width:34em!important;margin:0!important}X .section-header>.rating-row{justify-content:flex-start!important}X .abj-g-head{text-align:left!important;max-width:none!important;margin-left:0!important}X .abjsl-tabs{justify-content:flex-start!important;margin-left:0!important;margin-right:0!important;max-width:none!important}X .abjsl-panel>h2{text-align:left!important;margin:0 0 16px!important;max-width:22em!important}X .abjp-cmp{max-width:none!important;margin-left:0!important;margin-right:0!important}X .abjsl-intro{text-align:left!important;margin-left:0!important;max-width:52em!important}X .abjsl-fg{max-width:var(--wmax)!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;align-items:center!important;gap:clamp(48px,6vw,120px)!important}X .abjsl-fv{max-width:none!important;justify-self:stretch!important}X .abjsl-fv .abjsl-fvi{aspect-ratio:1/1!important;width:100%!important;max-height:74vh!important;max-width:none!important}X .abjsl-ft{max-width:560px!important}X .abjsl-more>details,X .faq-section>.container{max-width:var(--wmax)!important}X .abjsl-more{padding-left:0!important;padding-right:0!important}X .abjsl-more>details{padding-left:var(--wpad)!important;padding-right:var(--wpad)!important;box-sizing:border-box!important;width:100%!important}X .faq-section>.container>.display{position:static!important;margin-left:0!important;text-align:left!important;max-width:12em!important}X .faq-section>.container>.body-lg{margin-left:0!important;text-align:left!important}X .container>h2.text-center,X .container.text-center>.eyebrow,X .container.text-center>h2,X .container.text-center>p.body-lg{text-align:left!important;margin-left:0!important;margin-right:0!important}X .container.text-center{text-align:left!important}X .container.text-center>.grid-2{margin-left:0!important;margin-right:auto!important;justify-content:start!important}X .container>.abjp-eb,X .section-header>.abjp-eb{justify-content:flex-start!important;text-align:left!important;margin-left:0!important}X .brand-story>.container>*{max-width:760px!important}X .brand-story .proof-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:28px!important}X .brand-story .proof-card{padding:0!important}X .brand-story>.container>.text-center{text-align:left!important}X .abj-guides .abj-g-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}X .abjp-duo-grid{display:grid!important;grid-template-columns:minmax(0,5fr) minmax(0,6fr)!important;grid-template-rows:auto auto!important;gap:0!important;width:calc(100% - 2*var(--wpad))!important;max-width:calc(var(--wmax) - 2*var(--wpad))!important;margin:0 auto!important;padding:0!important;background:#fff!important;border:1px solid var(--whair)!important;box-shadow:0 30px 60px -40px rgba(14,27,26,.35)!important;border-radius:0!important;align-items:stretch!important}X .abjp-duo-grid>.abjw-l{grid-column:1;grid-row:1;background:var(--wg);padding:clamp(48px,3.6vw,64px) clamp(40px,3.8vw,76px);display:flex;flex-direction:column;justify-content:center;box-sizing:border-box;min-width:0}X .abjw-l>h2,X .abjw-l>p{text-align:left!important;margin:0!important;padding:0!important;max-width:none!important;opacity:1!important;transform:none!important}X .abjw-l>h2{color:var(--wcr)!important;-webkit-text-fill-color:var(--wcr)!important;font-size:clamp(30px,2.3vw,40px)!important;line-height:1.12!important}X .abjw-l>p:not(.abjs-form-note){margin-top:14px!important;color:rgba(243,238,230,.78)!important;-webkit-text-fill-color:rgba(243,238,230,.78)!important;font-size:15px!important;line-height:1.7!important}X .abjw-l>.abjs-form-note{margin-top:8px!important;color:rgba(243,238,230,.7)!important;-webkit-text-fill-color:rgba(243,238,230,.7)!important;font-size:14px!important;line-height:1.6!important}X .abjw-l>.abjs-form-note:first-of-type,X .abjw-l>p:not(.abjs-form-note)+.abjs-form-note{margin-top:16px!important}X .abjw-l>.abjs-form-note br{display:none}X .abjw-l>.abjs-form-note a{color:var(--wgo)!important;-webkit-text-fill-color:var(--wgo)!important;font-weight:600;margin-left:6px;text-decoration:none!important}X .abjw-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:18px 28px;margin-top:22px;padding-top:20px;border-top:1px solid rgba(243,238,230,.16)}X .abjw-steps>div>p{margin:0!important;padding:0!important;text-align:left!important;max-width:none!important}X .abjw-steps>div>p:first-child{color:var(--wcr)!important;-webkit-text-fill-color:var(--wcr)!important;font-size:14px!important;font-weight:600!important;line-height:1.4!important;margin-bottom:6px!important}X .abjw-steps>div>p+p{color:rgba(243,238,230,.66)!important;-webkit-text-fill-color:rgba(243,238,230,.66)!important;font-size:13px!important;line-height:1.55!important}X .abjp-duo-grid>.abj-embed-container{grid-column:2;grid-row:1;display:flex!important;flex-direction:column;justify-content:center;padding:clamp(48px,3.6vw,64px) clamp(40px,3.8vw,76px)!important;margin:0!important;max-width:none!important;width:auto!important;background:#fff!important;border:0!important;box-shadow:none!important;border-radius:0!important;opacity:1!important;transform:none!important;box-sizing:border-box;min-width:0}X .abjp-duo-grid>.abj-embed-container>form,X .abjp-duo-grid>.abj-embed-container>.abj-bk-suc{margin:0!important;padding:0!important;width:auto!important;max-width:none!important}X .abjp-duo-grid>.abj-embed-container>form .abj-bk-submit{margin-top:4px!important}X .abjp-duo-grid>.abj-embed-container>ul{order:9;margin:28px 0 0!important;padding:22px 0 0!important;border-top:1px solid var(--whair);list-style:none!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 32px!important;max-width:none!important;width:auto!important}X .abjp-duo-grid>.abj-embed-container>ul:empty{display:none!important}X .abjp-duo-grid>.abj-embed-container>ul li{color:var(--wmut)!important;-webkit-text-fill-color:var(--wmut)!important;font-size:13.5px!important;line-height:1.55!important;margin:0!important;padding:0!important;text-align:left!important}X .abjp-duo-grid>.abj-embed-container>ul li strong{color:var(--wink)!important;-webkit-text-fill-color:var(--wink)!important;font-weight:600}X .abjw-l>.abjp-fin{position:relative;display:grid!important;grid-template-columns:auto auto 1fr;column-gap:14px;row-gap:12px;align-items:center;margin:30px 0 0!important;padding:26px 0 0!important;min-height:0!important;height:auto!important;border-radius:0!important;background:none!important;box-shadow:none!important;border:0!important;border-top:1px solid rgba(243,238,230,.16)!important;width:auto!important;max-width:none!important}X .abjw-l>.abjp-fin>*{margin:0!important;grid-column:1 / -1}X .abjw-l>.abjp-fin>.finance-title{font-size:clamp(21px,1.5vw,25px)!important;line-height:1.2!important}X .abjw-l>.abjp-fin>.finance-body{font-size:13px!important;line-height:1.65!important;opacity:.85}X .abjw-l>.abjp-fin>ol{display:flex!important;flex-wrap:wrap;gap:8px 22px!important;padding:0!important}X .abjw-l>.abjp-fin>ol li{margin:0!important;font-size:13px!important}X .abjw-l>.abjp-fin>.abjp-fin-acts{grid-column:1 / 3;display:flex!important;flex-direction:row!important;gap:10px!important;align-items:center!important}X .abjw-l>.abjp-fin>.abjp-fin-prov{grid-column:3;justify-self:end;font-size:12px!important;padding:0!important;border:0!important}X .abjw-l>.abjp-fin>.abjp-fin-risk{font-size:11px!important;line-height:1.5!important;opacity:.7}X .abjp-duo-grid>.finance-disclaimer{grid-column:1 / -1;grid-row:2;margin:0!important;padding:16px clamp(40px,3.8vw,76px)!important;max-width:none!important;text-align:left!important;font-size:11px!important;border-top:1px solid var(--whair);background:#fff}}@media (min-width:1500px){X .abjsl-row:has(>:nth-child(4)){--n:4!important}X .abjsl-row:not(:has(>:nth-child(4))) .p-card-img{aspect-ratio:1/1!important}}X .sect-bg::before,X .sect-bg::after{background-attachment:scroll!important}X #home.abjp-full::before{display:none!important}".replace(/(^|[,{}])X /g,function(m,p){return p+X});
var st=D.createElement('style');st.id='abjw-css';st.textContent=c;(D.head||D.documentElement).appendChild(st);
/* DEV homepage polish (Nov 2026): real ABJ photos on the service cards, editorial cards/reviews, quiet partner logos, trade + sister-brand bands left to the footer links. Hero video untouched. */
if(/^\/home-dev-/.test(P)){D.documentElement.classList.add('abjw-home');var HP='html.abjw.abjw-home:not(#x1):not(#x2):not(#x3):not(#x4):not(#x5):not(#x6):not(#x7):not(#x8) body ';var hs=D.createElement('style');hs.id='abjw-home-css';hs.textContent="H .trade-section-lower,H .abj-sister{display:none!important}@media (min-width:1200px){H .portfolio .p-card{background:none!important;box-shadow:none!important;border:0!important;border-radius:0!important;transform:none!important}H .portfolio .p-card-img{border-radius:0!important;overflow:hidden}H .portfolio .p-card-img img{transition:transform 1.2s cubic-bezier(.2,.7,.2,1)!important}H .portfolio .p-card:hover .p-card-img img{transform:scale(1.04)!important}H .portfolio .p-card-body{padding:18px 0 0!important;background:none!important}H .portfolio .p-card-title{font-size:clamp(21px,1.4vw,25px)!important;margin:0 0 6px!important}H .portfolio .p-card-sub{font-size:13.5px!important;line-height:1.6!important;color:var(--wmut)!important;min-height:0!important;margin:0 0 12px!important}H .portfolio .p-card-cta{display:none!important}H .portfolio .p-card-page-link{display:inline-block!important;font:500 11px/1.4 \"DM Sans\",sans-serif!important;letter-spacing:.2em!important;text-transform:uppercase!important;color:var(--wink)!important;border-bottom:1px solid var(--wgo)!important;padding:0 0 4px!important;border-top:0!important;margin:0!important}H .services-detail .abjp-svc{background:none!important;border:0!important;border-top:1px solid var(--whair)!important;border-radius:0!important;box-shadow:none!important;padding:24px 0 0!important}H .testimonials .review-card{background:none!important;border:0!important;border-top:1px solid var(--whair)!important;box-shadow:none!important;border-radius:0!important;padding:26px 0 0!important}H .testimonials .review-card:before,H .testimonials .review-card:after{display:none!important;content:none!important}H .testimonials .review-text{font-family:\"Cormorant Garamond\",Georgia,serif!important;font-size:21px!important;line-height:1.45!important;font-style:normal!important;color:var(--wink)!important}H .testimonials .review-avatar,H .testimonials [class*=avatar]{display:none!important}H .partners{padding-top:30px!important;padding-bottom:30px!important}H .partners img{filter:grayscale(1)!important;opacity:.5!important;mix-blend-mode:multiply;height:30px!important;width:auto!important;transition:opacity .3s}H .partners img:hover{opacity:.9!important}}".replace(/(^|[,{}])H /g,function(m,p){return p+HP});(D.head||D.documentElement).appendChild(hs);var IMG={'Bespoke Kitchens':'abj-kitchens-t-handleless.webp','Fitted Wardrobes':'abj-wardrobes-t-fitted.webp','Fitted Bedrooms':'abj-bedrooms-t-slopes.webp','Media Walls':'abj-mediawalls-t-minimal.webp','Luxury Worktops':'abj-worktops-t-quartz.webp','Storage Solutions':'abj-storage-t-pantry.webp','Home Offices':'abj-office-t-home.webp'};var sw=function(){var MM=window.__ABJ_MEDIA_MAP||{};[].forEach.call(D.querySelectorAll('.portfolio .p-card'),function(c){var t=c.querySelector('.p-card-title'),i=c.querySelector('.p-card-img img');if(!t||!i)return;var f=IMG[t.textContent.trim()],u=f&&MM[f];if(!u||i.getAttribute('data-abjw')===f)return;i.removeAttribute('srcset');i.removeAttribute('data-original');i.src=u;i.setAttribute('data-abjw',f);i.style.objectFit='cover'})};if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',sw);else sw();setTimeout(sw,1500)}
/* Booking card: on desktop, the form intro and the finance panel share the green left column; the form (and its tick list) sits on the right. */
var bk=function(){if(!(window.matchMedia&&matchMedia('(min-width:1200px)').matches))return;[].forEach.call(D.querySelectorAll('.abjp-duo-grid'),function(g){if(g.querySelector(':scope>.abjw-l'))return;var c=g.querySelector(':scope>.abj-embed-container'),f=g.querySelector(':scope>.abjp-fin');if(!c)return;var l=D.createElement('div');l.className='abjw-l';[].slice.call(c.children).forEach(function(k){if(k.tagName==='H2'||k.tagName==='P')l.appendChild(k)});var ns=[].slice.call(l.querySelectorAll(':scope>.abjs-form-note'));if(ns.length&&/enquiry is on its way/i.test(ns[0].textContent)){ns.forEach(function(n){n.style.display='none'});ns=[]}[].forEach.call(c.querySelectorAll(':scope>ul'),function(u){if(/all set|share photos on whatsapp/i.test(u.textContent))u.style.setProperty('display','none','important')});if(ns.length>=4&&ns.length%2===0){var w=D.createElement('div');w.className='abjw-steps';ns[0].parentNode.insertBefore(w,ns[0]);for(var i=0;i<ns.length;i+=2){var it=D.createElement('div');it.appendChild(ns[i]);it.appendChild(ns[i+1]);w.appendChild(it)}}if(f)l.appendChild(f);g.insertBefore(l,g.firstChild)})};
var go=function(){bk();setTimeout(bk,600);setTimeout(bk,1800);setTimeout(bk,4000)};if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',go);else go()}

function run(){
 if(D.documentElement.classList.contains('abjsl'))return;D.documentElement.classList.add('abjsl');css();lux();try{var hm=D.getElementById('home');hm&&hm.classList.add('abjsl-k-'+key)}catch(e){}
 try{[].forEach.call(D.querySelectorAll('#home .reveal'),function(e){e.classList.add('visible')});var rv=function(){[].forEach.call(D.querySelectorAll('.reveal:not(.visible)'),function(e){var r=e.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)e.classList.add('visible')})};setTimeout(rv,700);setTimeout(rv,1600);addEventListener('scroll',rv,{passive:true})}catch(e){}
 try{[].forEach.call(D.querySelectorAll('.abjs-form-points li'),function(li){if(/^\s*(\d{1,2}|\u2713|✓)?\s*$/.test(li.textContent))li.remove()})}catch(e){}
 setTimeout(function(){try{[].forEach.call(D.querySelectorAll('.abjsl-pg>*'),function(c){var h=c.querySelector('h3,h4'),p=c.querySelector('p');if(!h||!p||!/quartz|granite|wood|laminate/i.test(h.textContent))return;var m=p.textContent.trim().match(/^(.*?)\s(Very low|Low|Medium|Higher|High)\s(.+)$/);if(!m)return;p.innerHTML='';[['Best for',m[1]],['Upkeep',m[2]],['Look',m[3]]].forEach(function(r){var l=D.createElement('span');l.className='abjsl-kv';l.innerHTML='<b>'+r[0]+'</b>';l.appendChild(D.createTextNode(r[1].replace(/^./,function(x){return x.toUpperCase()})));p.appendChild(l)})})}catch(e){}},0);
 setTimeout(function(){try{[].forEach.call(D.querySelectorAll('.abjp-svc h3,.abjsl-pg h3'),function(h){if(/^\s*[\u2713\u2714✓✔]?\s*$/.test(h.textContent))h.remove()})}catch(e){}},0);
 var S=top();
 var textSecs=S.filter(function(s){return s.classList.contains('abjs-text')});
 var prose=[].slice.call(D.querySelectorAll('.abjs-prose')).filter(function(p){return !p.closest('.faq-section')&&!p.closest('.abjs-text')});
 var h1=txt(D.querySelector('#home h1'));fold(prose.concat(textSecs),h1.split(/[,.]/)[0]);
 S.forEach(function(s){if(s.classList.contains('abjs-photo-sec')||s.classList.contains('bc-gallery'))photoCards(s)});
 var cardSecs=S.filter(function(s){return (s.classList.contains('portfolio')||s.classList.contains('bc-gallery'))&&s.querySelector('.p-card')});
 var gridSecs=S.filter(function(s){return s.classList.contains('services-detail')&&!s.classList.contains('abjs-text')&&s.querySelector('.grid-3')});
 var host=null,pts=null,k=false;
 if(cardSecs.length>1&&cardSecs[0].querySelectorAll('.p-card').length<=3){k=keys(cardSecs[0]);cardSecs=cardSecs.slice(1)}
 host=options(cardSecs);pts=points(gridSecs);
 toggles([D.getElementById('finishes'),D.getElementById('estimator')].filter(function(x){return x&&/bc-/.test(x.className)}));
 S.forEach(function(s){var c=(s.className||'')+' '+(s.id||'');if(/areas-section|abj-sister|partners|trade-section-lower|bc-photo-band/.test(c))gone(s)});
 [].forEach.call(D.querySelectorAll('.abjs-extra'),function(e){if(!e.closest('.abjs-prose'))gone(e)});
 try{film(host||pts||(cardSecs[0]))}catch(e){}
 var prev=false;top().forEach(function(s){if(s.offsetParent===null&&getComputedStyle(s).position!=='fixed'){return}
  var light=/abjsl-keys|abjsl-opts|abjsl-points|abjsl-film|abjsl-more|abjsl-tbar|bc-explorer|bc-estimator|journey|testimonials|faq-section/.test(s.className);
  if(light){s.classList.add('abjsl-lin');if(prev)s.classList.add('abjsl-rule')}prev=light});
 try{hero()}catch(e){}
 try{quick()}catch(e){}
}
/* tile pop-up: the page's own quick view reads data-img/title/description from the card; fill them from the card itself (just before it opens) */
function quick(){[].forEach.call(D.querySelectorAll('.p-card'),function(c){var fill=function(){var i=c.querySelector('.p-card-img img')||c.querySelector('img');var u=i?(i.currentSrc||i.getAttribute('src')||i.getAttribute('data-original')||''):'';if(u&&!/^data:/.test(u))c.dataset.img=u;if(!c.dataset.title){var t=c.querySelector('.p-card-title,h3,h4');if(t)c.dataset.title=txt(t)}if(!c.dataset.description){var d=c.querySelector('.p-card-sub,p');if(d)c.dataset.description=d.innerHTML}};c.addEventListener('click',fill,true);c.addEventListener('keydown',fill,true)})}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',run);else run();
})();
