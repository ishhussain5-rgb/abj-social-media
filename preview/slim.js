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
var key=MAP[P.replace(/^\/|\/$/g,'')];if(!key)return;
var WIDE=window.matchMedia&&matchMedia('(min-width:1024px)').matches;
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var MEDIA=(window.ABJ_SLIM_MEDIA||{})[key]||null;

function css(){if(D.getElementById('abjs-slim-css'))return;var st=D.createElement('style');st.id='abjs-slim-css';st.textContent=
'.abjsl{--lin:#F4F0E9;--ink:#0E1B1A;--mut:#5E6765;--hair:rgba(14,27,26,.14);--gold:#B08D57}'+
'.abjsl-gone{display:none!important}'+
'.abjsl .hero .abjs-hero-points{display:none}.abjsl .hero .hero-body{max-width:34em}'+
/* one calm canvas, hairline rules between blocks */
'.abjsl .abjsl-lin{background:var(--lin)!important;background-image:none!important;position:relative}'+
'.abjsl .abjsl-rule:before{content:"";position:absolute;top:0;left:50%;width:min(720px,84%);transform:translateX(-50%);border-top:1px solid var(--hair)}'+
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
'.abjsl-row .p-card-img{position:relative;aspect-ratio:4/5;height:auto!important;overflow:hidden;border-radius:0!important;background:#e7e1d6}'+
'.abjsl-row .p-card-img img{width:100%;height:100%;object-fit:cover;transition:transform 1.4s cubic-bezier(.2,.7,.2,1)}'+
'.abjsl-row .p-card:hover .p-card-img img{transform:scale(1.035)}'+
'.abjsl-lab{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;color:var(--ink);padding:12px 20px;font:500 11.5px/1.25 "DM Sans",sans-serif;letter-spacing:.2em;text-transform:uppercase;white-space:nowrap;max-width:84%;overflow:hidden;text-overflow:ellipsis;pointer-events:none}'+
'.abjsl-row .p-card-body{padding:16px 8px 0!important;text-align:center;background:none!important}'+
'.abjsl-row .abjs-tag,.abjsl-row .p-card-title,.abjsl-row .abjs-mini,.abjsl-row .p-card-link{display:none!important}'+
'.abjsl-row .p-card-sub{font-size:13.5px;line-height:1.65;color:var(--mut);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:0}'+
'.abjsl-few{display:none!important}'+
'.abjsl-nav{display:flex;justify-content:center;gap:10px;margin-top:26px}'+
'.abjsl-nav button{width:44px;height:44px;border-radius:50%;border:1px solid var(--hair);background:transparent;color:var(--ink);font-size:16px;cursor:pointer}'+
'.abjsl-nav button:disabled{opacity:.3;cursor:default}'+
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
'.abjsl .journey-step .step-desc{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;font-size:14px;line-height:1.7;color:var(--mut)}'+
'.abjsl .review-card{background:transparent!important;box-shadow:none!important;border:0!important;border-top:1px solid var(--hair)!important;border-radius:0!important}'+
'.abjsl .faq-item{background:transparent!important;box-shadow:none!important;border:0!important;border-bottom:1px solid var(--hair)!important;border-radius:0!important;margin:0!important}'+
'.abjsl .faq-item:first-child{border-top:1px solid var(--hair)!important}'+
/* folded long copy */
'.abjsl-more{padding:clamp(40px,5vw,72px) 20px}.abjsl-more>details{max-width:820px;margin:0 auto;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)}'+
'.abjsl-more summary{cursor:pointer;list-style:none;padding:22px 0;font-family:"Cormorant Garamond",Georgia,serif;font-size:24px;color:var(--ink);display:flex;justify-content:space-between;align-items:center}'+
'.abjsl-more summary::-webkit-details-marker{display:none}.abjsl-more summary:after{content:"+";font:300 26px/1 "DM Sans",sans-serif;color:var(--gold)}'+
'.abjsl-more details[open] summary:after{content:"\\2013"}'+
'.abjsl-more .abjs-prose{padding:0 0 26px}.abjsl-more .abjs-figure{display:none}'+
'@media (max-width:1023px){.abjsl-row .p-card{flex-basis:calc((100% - 22px)/2.15)}.abjsl-fg{grid-template-columns:1fr 1fr;gap:36px}}'+
'@media (max-width:767px){.abjsl-kg{grid-template-columns:1fr;gap:30px}.abjsl-k p{font-size:14.5px}'+
' .abjsl-row{gap:14px;margin:0 -20px;padding:0 20px 6px;scroll-padding:0 20px}.abjsl-row .p-card{flex-basis:80%}.abjsl-nav{display:none}'+
' .abjsl-tabs{overflow-x:auto;justify-content:flex-start;gap:24px;margin:0 -20px 22px;padding:0 20px;scrollbar-width:none}.abjsl-tabs::-webkit-scrollbar{display:none}.abjsl-tab{flex:0 0 auto}'+
' .abjsl-fg{grid-template-columns:1fr;gap:30px}.abjsl-fv{justify-self:stretch;max-width:none;max-height:none;margin:0 -20px;width:auto}.abjsl-ft{max-width:none;text-align:center}'+
' .abjsl .hero .hero-body{font-size:16px}}';
D.head.appendChild(st)}

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
  k.innerHTML='<b>0'+(i+1)+'</b><h3></h3><p></p>';k.querySelector('h3').textContent=txt(c.querySelector('.p-card-title'));
  k.querySelector('p').textContent=firstSentence(txt(c.querySelector('.p-card-sub')));g.appendChild(k)});
 var hd=sec.querySelector('.section-header'),ct=sec.querySelector('.container')||sec;
 ct.appendChild(g);hideExcept(sec,[hd,g].filter(Boolean));sec.classList.add('abjsl-keys');return true}

function tile(c){ // card -> Nordiska-style tile: tall photo, white label box, one-line caption
 c.classList.remove('reveal');c.classList.add('visible');
 var im=c.querySelector('.p-card-img'),t=txt(c.querySelector('.p-card-title'));
 var ov=(MEDIA&&MEDIA.img||{})[t];if(ov&&im&&im.querySelector('img')){var i=im.querySelector('img');i.src=ov;i.removeAttribute('srcset')}
 if(im&&t&&!im.querySelector('.abjsl-lab'))im.appendChild(lab(t));
 var sub=c.querySelector('.p-card-sub');if(sub){sub.textContent=txt(sub).replace(/\s*(Explore|View|See)\s[^.]*$/,'')}
 return c}

function options(secs){ // remaining image-card sections -> one tabbed, swipeable row of tiles
 if(!secs.length)return null;
 var host=secs[0],ct=host.querySelector('.container')||host;
 var wrap=D.createElement('div');var tabs=D.createElement('div');tabs.className='abjsl-tabs';tabs.setAttribute('role','tablist');
 var panels=[];
 secs.forEach(function(s,i){
  var h2=s.querySelector('h2'),eb=s.querySelector('.eyebrow,.abjp-eb'),intro=s.querySelector('.section-header .body-lg, .body-lg');
  var label=txt(eb)||txt(h2)||('Option '+(i+1));label=label.replace(/^(the|our)\s+/i,'');label=label.charAt(0).toUpperCase()+label.slice(1);if(label.length>26)label=txt(h2).split(/[,:–-]/)[0].slice(0,26);
  var b=D.createElement('button');b.type='button';b.className='abjsl-tab';b.setAttribute('role','tab');b.textContent=label;b.setAttribute('aria-selected',i?'false':'true');tabs.appendChild(b);
  var p=D.createElement('div');p.className='abjsl-panel';p.setAttribute('role','tabpanel');if(i)p.hidden=true;
  if(s.id&&s!==host){p.id=s.id;s.removeAttribute('id')}else if(s.id){p.setAttribute('data-anchor',s.id)}
  var it=D.createElement('p');it.className='abjsl-intro';it.innerHTML=(h2?'<strong>'+h2.innerHTML+'.</strong> ':'')+(intro?firstSentence(txt(intro)):'');p.appendChild(it);
  var row=D.createElement('div');row.className='abjsl-row';
  [].slice.call(s.querySelectorAll('.p-card')).forEach(function(c){row.appendChild(tile(c))});
  row.style.setProperty('--n',Math.min(Math.max(row.children.length,1),3));p.appendChild(row);
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

function book(){ // the hero's own "Book your free design visit" control, so the film CTA behaves identically
 var a=[].slice.call(D.querySelectorAll('#home a, #home button')).filter(function(x){return /book/i.test(txt(x))})[0];return a||null}

function film(after){ // a second reel with a short story, Nordiska-style split
 var F=MEDIA&&MEDIA.film;if(!F||!F.v||!after)return null;
 var s=D.createElement('section');s.className='abjsl-film abjsl-lin';s.id='abj-film';
 s.innerHTML='<div class="container"><div class="abjsl-fg"><figure class="abjsl-fv"></figure><div class="abjsl-ft"><span class="eyebrow"></span><h2></h2><p></p><a class="abjsl-btn" href="/bookingform">Book your free design visit <span aria-hidden="true">&#8594;</span></a></div></div></div>';
 var fig=s.querySelector('.abjsl-fv');var v=D.createElement('video');v.muted=true;v.defaultMuted=true;['muted','playsinline','webkit-playsinline','loop','disablepictureinpicture'].forEach(function(a){v.setAttribute(a,'')});
 v.setAttribute('preload','none');if(F.p)v.setAttribute('poster',F.p);v.setAttribute('aria-label',F.alt||F.title||'ABJ project film');
 var so=D.createElement('source');so.src=F.v;so.type='video/mp4';v.appendChild(so);fig.appendChild(v);if(F.label)fig.appendChild(lab(F.label));
 s.querySelector('.eyebrow').textContent=F.kicker||'Made in Peterborough';s.querySelector('h2').textContent=F.title||'';s.querySelector('p').textContent=F.text||'';
 var cta=s.querySelector('.abjsl-btn'),hb=book();if(hb){cta.addEventListener('click',function(e){var h=hb.getAttribute('href');if(!h||h.charAt(0)==='#'||/^javascript/.test(h)){e.preventDefault();hb.click()}else{cta.href=h}})}
 after.parentNode.insertBefore(s,after.nextSibling);
 if(!RM&&'IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(v.preload!=='auto'){v.preload='auto';v.load()}var p=v.play();p&&p.catch&&p.catch(function(){})}else{v.pause()}})},{rootMargin:'200px 0px'}).observe(fig)}
 return s}

function fold(prose,h1){ // all long copy kept, folded behind one line
 if(!prose.length)return null;var faq=D.querySelector('.faq-section'),before=faq||D.querySelector('.abj-embed-form-section');if(!before)return null;
 var box=D.createElement('section');box.className='abjsl-more abjsl-lin';var d=D.createElement('details');var su=D.createElement('summary');
 su.textContent='More about '+(h1||'this service').replace(/\s+in Peterborough.*$/i,'').replace(/^Bespoke\s+/i,'bespoke ').toLowerCase();d.appendChild(su);
 prose.forEach(function(p){d.appendChild(p)});box.appendChild(d);before.parentNode.insertBefore(box,before);return box}

function hero(){ // two crossfading clips, same behaviour as the homepage hero
 if(!MEDIA)return;var h=D.getElementById('home'),vis=h&&h.querySelector('.hero-visual');if(!vis||vis.querySelector('.abjp-hv'))return;
 var C=(WIDE?MEDIA.wide:MEDIA.tall)||[];if(!C.length)return;
 var cur=0,sw=false;var mk=function(c,k){var v=D.createElement('video');v.className='abjp-hv'+(k?'':' on');v.muted=true;v.defaultMuted=true;v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.setAttribute('disablepictureinpicture','');v.setAttribute('preload',k?'none':'auto');v.setAttribute('loop','');if(c.p)v.setAttribute('poster',c.p);v.setAttribute('aria-hidden','true');if(!k&&!RM){v.setAttribute('autoplay','');v.autoplay=true}var s=D.createElement('source');s.src=c.v;s.type='video/mp4';v.appendChild(s);return v};
 var V=C.map(mk);var shade=D.createElement('div');shade.className='abjp-hv-shade';var cap=D.createElement('div');cap.className='abjp-hv-cap';cap.textContent=(MEDIA.caps||[])[0]||'';
 if(V.length>1){V.forEach(function(v){v.removeAttribute('loop')});var go=function(){if(sw)return;var nx=(cur+1)%V.length,a=V[cur],n=V[nx];if(n.readyState<3){if(n.preload!=='auto'){n.preload='auto';n.load()}a.currentTime=0;a.play&&a.play();return}sw=true;n.currentTime=0;var pr;try{pr=n.play()}catch(e){}var swap=function(){n.classList.add('on');cap.classList.add('fade');setTimeout(function(){cap.textContent=(MEDIA.caps||[])[nx]||'';cap.classList.remove('fade')},450);setTimeout(function(){a.classList.remove('on');a.pause();a.currentTime=0;cur=nx;sw=false},900)};if(pr&&pr.then)pr.then(swap,function(){sw=false;a.currentTime=0;a.play()});else swap()};
  V.forEach(function(v,k){v.addEventListener('timeupdate',function(){if(k===cur&&v.duration&&v.currentTime>v.duration-0.75)go()});v.addEventListener('ended',function(){if(k===cur)go()})});
  V[0].addEventListener('playing',function(){setTimeout(function(){if(V[1].preload!=='auto'){V[1].preload='auto';V[1].load()}},2000)},{once:true})}
 var kick=function(){var v=V[cur];if(v&&v.paused&&!RM){var p=v.play();p&&p.catch&&p.catch(function(){})}};
 ['touchstart','scroll','pointerdown'].forEach(function(e){window.addEventListener(e,kick,{passive:true,once:true})});
 [].slice.call(vis.querySelectorAll('img')).forEach(function(i){i.classList.add('abjsl-under')});
 V.forEach(function(v){vis.appendChild(v)});vis.appendChild(shade);vis.appendChild(cap);h.classList.add('abjp-vid');if(!RM)kick()}

function run(){
 if(D.documentElement.classList.contains('abjsl'))return;D.documentElement.classList.add('abjsl');css();
 var S=top();var cardSecs=S.filter(function(s){return s.classList.contains('portfolio')&&s.querySelector('.p-card')});
 var prose=[].slice.call(D.querySelectorAll('.abjs-prose')).filter(function(p){return !p.closest('.faq-section')});
 var host=null;if(cardSecs.length){keys(cardSecs[0]);host=options(cardSecs.slice(1))}
 S.forEach(function(s){var c=(s.className||'')+' '+(s.id||'');if(/areas-section|abj-sister|partners|trade-section-lower/.test(c))gone(s)});
 [].forEach.call(D.querySelectorAll('.abjs-extra'),function(e){if(!e.closest('.abjs-prose'))gone(e)});
 var h1=txt(D.querySelector('#home h1'));fold(prose,h1.split(/[,.]/)[0]);
 try{film(host||cardSecs[0])}catch(e){}
 // one linen canvas with hairline rules between consecutive light sections
 var prev=false;top().forEach(function(s){if(s.offsetParent===null&&getComputedStyle(s).position!=='fixed'){return}
  var light=/abjsl-keys|abjsl-opts|abjsl-film|abjsl-more|journey|testimonials|faq-section/.test(s.className);
  if(light){s.classList.add('abjsl-lin');if(prev)s.classList.add('abjsl-rule')}prev=light});
 try{hero()}catch(e){}
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',run);else run();
})();
