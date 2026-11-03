/* ABJ slim service pages (Nov 2026): Neptune-style editing of the DEV service pages.
   Fewer, bigger moments: video hero, three key points, one tabbed swipe row of options,
   proof, process, enquiry, FAQ. All original words stay on the page (long copy folds away). */
(function(){
var D=document,P=location.pathname;
var MAP={
 'bespoke-kitchens-dev-k7q2':'kitchens','bespoke-wardrobes-dev-w4m8':'wardrobes','bespoke-bedrooms-dev-b3n6':'bedrooms',
 'media-walls-dev-m9t5':'mediawalls','bespoke-storage-dev-s2k7':'storage','luxury-worktops-dev-t6p3':'worktops',
 'decors-dev-d8r4':'decors','upholstery-dev-u5h9':'upholstery','office-renovations-dev-o3f7':'office',
 'bespoke-hallways-dev-h4j8':'hallways','bathroom-cabinetry-dev-c6v2':'bathroom','hmo-makeover-dev-m2x5':'hmo'};
var key=MAP[P.replace(/^\/|\/$/g,'')];if(!key)return;
var WIDE=window.matchMedia&&matchMedia('(min-width:1024px)').matches;
var MEDIA=(window.ABJ_SLIM_MEDIA||{})[key]||null;

function css(){if(D.getElementById('abjs-slim-css'))return;var st=D.createElement('style');st.id='abjs-slim-css';st.textContent=
'.abjsl-gone{display:none!important}'+
'.abjsl .hero .abjs-hero-points{display:none}'+
'.abjsl .hero .hero-body{max-width:34em}'+
/* key points */
'.abjsl-keys{padding:clamp(56px,7vw,96px) 0 clamp(40px,5vw,72px);background:#F9F7F5}'+
'.abjsl-keys .section-header{margin-bottom:clamp(28px,4vw,48px)}'+
'.abjsl-keys .section-header .body-lg{display:none}'+
'.abjsl-kg{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(24px,4vw,64px);max-width:1120px;margin:0 auto}'+
'.abjsl-k{border-top:1px solid rgba(14,27,26,.18);padding-top:22px}'+
'.abjsl-k b{display:block;font:500 15px/1 "DM Sans",sans-serif;letter-spacing:.16em;color:#B08D57;margin-bottom:16px}'+
'.abjsl-k h3{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:clamp(24px,2.2vw,30px);line-height:1.12;margin:0 0 10px;color:#0E1B1A}'+
'.abjsl-k p{margin:0;font-size:15.5px;line-height:1.6;color:#55605E}'+
/* tabbed swipe row */
'.abjsl-opts{padding:clamp(56px,7vw,96px) 0;background:#fff}'+
'.abjsl-opts .section-header{margin-bottom:24px}'+
'.abjsl-tabs{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:0 auto 28px}'+
'.abjsl-tab{appearance:none;border:1px solid rgba(14,27,26,.2);background:transparent;color:#0E1B1A;border-radius:999px;padding:10px 20px;font:500 14px/1 "DM Sans",sans-serif;letter-spacing:.02em;cursor:pointer;transition:all .25s}'+
'.abjsl-tab[aria-selected=true]{background:#0E1B1A;color:#F3EEE6;border-color:#0E1B1A}'+
'.abjsl-panel[hidden]{display:none}'+
'.abjsl-intro{max-width:46em;margin:0 auto 26px;text-align:center;color:#55605E;font-size:16px;line-height:1.6}'+
'.abjsl-row{display:flex;gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding:4px 2px 8px;-webkit-overflow-scrolling:touch}'+
'.abjsl-row::-webkit-scrollbar{display:none}'+
'.abjsl-row .p-card{flex:0 0 calc((100% - 60px)/4);scroll-snap-align:start;margin:0!important;max-width:none!important}'+
'.abjsl-row .p-card-img{aspect-ratio:4/5;overflow:hidden}.abjsl-row .p-card-img img{width:100%;height:100%;object-fit:cover}'+
'.abjsl-row .p-card-sub{font-size:14.5px;line-height:1.55}'+
'.abjsl-row .abjs-mini{display:none}'+
'.abjsl-nav{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}'+
'.abjsl-nav button{width:46px;height:46px;border-radius:50%;border:1px solid rgba(14,27,26,.25);background:#fff;color:#0E1B1A;font-size:18px;cursor:pointer}'+
'.abjsl-nav button:disabled{opacity:.3;cursor:default}'+
/* folded long copy */
'.abjsl-more{max-width:860px;margin:0 auto;padding:0 20px clamp(48px,6vw,80px)}'+
'.abjsl-more details{border-top:1px solid rgba(14,27,26,.15);border-bottom:1px solid rgba(14,27,26,.15)}'+
'.abjsl-more summary{cursor:pointer;list-style:none;padding:22px 0;font-family:"Cormorant Garamond",Georgia,serif;font-size:24px;color:#0E1B1A;display:flex;justify-content:space-between;align-items:center}'+
'.abjsl-more summary::-webkit-details-marker{display:none}.abjsl-more summary:after{content:"+";font:300 26px/1 "DM Sans",sans-serif;color:#B08D57}'+
'.abjsl-more details[open] summary:after{content:"\\2013"}'+
'.abjsl-more .abjs-prose{padding:0 0 26px}.abjsl-more .abjs-figure{display:none}'+
'@media (max-width:1023px){.abjsl-row .p-card{flex-basis:calc((100% - 20px)/2.2)}}'+
'@media (max-width:767px){.abjsl-kg{grid-template-columns:1fr;gap:26px}.abjsl-k{padding-top:16px}.abjsl-k p{font-size:15px}'+
' .abjsl-row{gap:14px;margin:0 -20px;padding:4px 20px 8px;scroll-padding:0 20px}.abjsl-row .p-card{flex-basis:78%}.abjsl-nav{display:none}'+
' .abjsl-tabs{flex-wrap:nowrap;overflow-x:auto;justify-content:flex-start;margin:0 -20px 22px;padding:0 20px;scrollbar-width:none}.abjsl-tab{flex:0 0 auto}'+
' .abjsl .hero .hero-body{font-size:16px}}';
D.head.appendChild(st)}

function txt(e){return (e&&e.textContent||'').replace(/\s+/g,' ').trim()}
function firstSentence(s){var m=s.match(/^(.{40,220}?[.!?])(\s|$)/);return m?m[1]:s}
function top(){return [].slice.call(D.querySelectorAll('section')).filter(function(s){return !s.parentElement.closest('section')})}

function keys(sec){ // first image-card section -> three numbered key points, no photos
 var cards=[].slice.call(sec.querySelectorAll('.p-card')).slice(0,3);if(cards.length<2)return false;
 var g=D.createElement('div');g.className='abjsl-kg';
 cards.forEach(function(c,i){var k=D.createElement('div');k.className='abjsl-k';
  k.innerHTML='<b>0'+(i+1)+'</b><h3></h3><p></p>';k.querySelector('h3').textContent=txt(c.querySelector('.p-card-title'));
  k.querySelector('p').textContent=firstSentence(txt(c.querySelector('.p-card-sub')));g.appendChild(k)});
 var hd=sec.querySelector('.section-header'),ct=sec.querySelector('.container')||sec;
 [].slice.call(ct.children).forEach(function(ch){if(ch!==hd)ch.classList.add('abjsl-gone')});
 ct.appendChild(g);sec.classList.add('abjsl-keys');
 var extra=[].slice.call(sec.querySelectorAll('.p-card')).slice(3);return extra}

function options(secs){ // remaining image-card sections -> one tabbed, swipeable row
 if(!secs.length)return;
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
  [].slice.call(s.querySelectorAll('.p-card')).forEach(function(c){c.classList.remove('reveal');c.classList.add('visible');row.appendChild(c)});
  p.appendChild(row);
  var nav=D.createElement('div');nav.className='abjsl-nav';nav.innerHTML='<button type="button" aria-label="Previous">&#8592;</button><button type="button" aria-label="Next">&#8594;</button>';
  var bs=nav.querySelectorAll('button');var upd=function(){bs[0].disabled=row.scrollLeft<8;bs[1].disabled=row.scrollLeft+row.clientWidth>row.scrollWidth-8};
  bs[0].onclick=function(){row.scrollBy({left:-row.clientWidth*0.9,behavior:'smooth'})};bs[1].onclick=function(){row.scrollBy({left:row.clientWidth*0.9,behavior:'smooth'})};
  row.addEventListener('scroll',upd,{passive:true});setTimeout(upd,300);p.appendChild(nav);
  if(row.children.length<=4)nav.classList.add('abjsl-few');
  var leftover=s.querySelector('.abjs-prose');if(leftover)p.__prose=leftover;
  panels.push(p);
  b.addEventListener('click',function(){[].forEach.call(tabs.children,function(t,k){t.setAttribute('aria-selected',k===i?'true':'false')});panels.forEach(function(q,k){q.hidden=k!==i});setTimeout(function(){var r=p.querySelector('.abjsl-row');r&&r.dispatchEvent(new Event('scroll'))},50)});
  if(s!==host)s.classList.add('abjsl-gone');
 });
 var hd=host.querySelector('.section-header');
 if(hd){hd.querySelector('.body-lg')&&hd.querySelector('.body-lg').classList.add('abjsl-gone');var h2=hd.querySelector('h2');if(h2&&secs.length>1){h2.textContent=WIDE?'Explore the options':'Explore the options';var eb=hd.querySelector('.eyebrow');if(eb)eb.textContent='Styles, layouts & projects'}}
 [].slice.call(ct.children).forEach(function(ch){if(ch!==hd)ch.classList.add('abjsl-gone')});
 if(secs.length>1)wrap.appendChild(tabs);panels.forEach(function(p){wrap.appendChild(p)});ct.appendChild(wrap);host.classList.add('abjsl-opts');
 // in-page links (e.g. hero "Explore styles") open the right tab
 D.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;var id=a.getAttribute('href').slice(1);
  panels.forEach(function(p,k){if(p.id===id||p.getAttribute('data-anchor')===id){e.preventDefault();tabs.children[k]&&tabs.children[k].click();window.scrollTo({top:host.getBoundingClientRect().top+pageYOffset-70,behavior:'smooth'})}})},true);
 return panels}

function fold(prose,h1){ // all long copy kept, folded behind one line
 if(!prose.length)return;var faq=D.querySelector('.faq-section'),before=faq||D.querySelector('.abj-embed-form-section');if(!before)return;
 var box=D.createElement('section');box.className='abjsl-more';var d=D.createElement('details');var su=D.createElement('summary');
 su.textContent='More about '+(h1||'this service').replace(/\s+in Peterborough.*$/i,'').replace(/^Bespoke\s+/i,'bespoke ').toLowerCase();d.appendChild(su);
 prose.forEach(function(p){d.appendChild(p)});box.appendChild(d);before.parentNode.insertBefore(box,before)}

function hero(){ // two crossfading clips, same behaviour as the homepage hero
 if(!MEDIA)return;var h=D.getElementById('home'),vis=h&&h.querySelector('.hero-visual');if(!vis||vis.querySelector('.abjp-hv'))return;
 var C=(WIDE?MEDIA.wide:MEDIA.tall)||[];if(!C.length)return;var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 var cur=0,sw=false;var mk=function(c,k){var v=D.createElement('video');v.className='abjp-hv'+(k?'':' on');v.muted=true;v.defaultMuted=true;v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.setAttribute('disablepictureinpicture','');v.setAttribute('preload',k?'none':'auto');v.setAttribute('loop','');if(c.p)v.setAttribute('poster',c.p);v.setAttribute('aria-hidden','true');if(!k&&!rm){v.setAttribute('autoplay','');v.autoplay=true}var s=D.createElement('source');s.src=c.v;s.type='video/mp4';v.appendChild(s);return v};
 var V=C.map(mk);var shade=D.createElement('div');shade.className='abjp-hv-shade';var cap=D.createElement('div');cap.className='abjp-hv-cap';cap.textContent=(MEDIA.caps||[])[0]||'';
 if(V.length>1){V.forEach(function(v){v.removeAttribute('loop')});var go=function(){if(sw)return;var nx=(cur+1)%V.length,a=V[cur],n=V[nx];if(n.readyState<3){if(n.preload!=='auto'){n.preload='auto';n.load()}a.currentTime=0;a.play&&a.play();return}sw=true;n.currentTime=0;var pr;try{pr=n.play()}catch(e){}var swap=function(){n.classList.add('on');cap.classList.add('fade');setTimeout(function(){cap.textContent=(MEDIA.caps||[])[nx]||'';cap.classList.remove('fade')},450);setTimeout(function(){a.classList.remove('on');a.pause();a.currentTime=0;cur=nx;sw=false},900)};if(pr&&pr.then)pr.then(swap,function(){sw=false;a.currentTime=0;a.play()});else swap()};
  V.forEach(function(v,k){v.addEventListener('timeupdate',function(){if(k===cur&&v.duration&&v.currentTime>v.duration-0.75)go()});v.addEventListener('ended',function(){if(k===cur)go()})});
  V[0].addEventListener('playing',function(){setTimeout(function(){if(V[1].preload!=='auto'){V[1].preload='auto';V[1].load()}},2000)},{once:true})}
 var kick=function(){var v=V[cur];if(v&&v.paused&&!rm){var p=v.play();p&&p.catch&&p.catch(function(){})}};
 ['touchstart','scroll','pointerdown'].forEach(function(e){window.addEventListener(e,kick,{passive:true,once:true})});
 [].slice.call(vis.querySelectorAll('img')).forEach(function(i){i.classList.add('abjsl-under')});
 V.forEach(function(v){vis.appendChild(v)});vis.appendChild(shade);vis.appendChild(cap);h.classList.add('abjp-vid');if(!rm)kick()}

function run(){
 if(D.documentElement.classList.contains('abjsl'))return;D.documentElement.classList.add('abjsl');css();
 var S=top();var cardSecs=S.filter(function(s){return s.classList.contains('portfolio')&&s.querySelector('.p-card')});
 var prose=[].slice.call(D.querySelectorAll('.abjs-prose')).filter(function(p){return !p.closest('.faq-section')});
 if(cardSecs.length){keys(cardSecs[0]);options(cardSecs.slice(1))}
 S.forEach(function(s){var c=(s.className||'')+' '+(s.id||'');if(/areas-section|abj-sister|partners|trade-section-lower/.test(c))s.classList.add('abjsl-gone')});
 var h1=txt(D.querySelector('#home h1'));fold(prose,h1.split(/[,.]/)[0]);
 try{hero()}catch(e){}
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',run);else run();
})();
