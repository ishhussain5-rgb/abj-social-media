import json,sys,html
COPY={
 'kitchens':dict(tab='Kitchens',h2='Seven details our clients ask for',p='The small things that make a kitchen easier to live with, filmed in kitchens we made and fitted.',vname='Seven kitchen details by ABJ Kitchens & Bedrooms, Peterborough',vdesc='seven details from kitchens made and fitted by ABJ Kitchens & Bedrooms in Peterborough'),
 'wardrobes':dict(tab='Wardrobes',h2='Open the doors on a fitted wardrobe',p='Sliding or hinged on the outside, planned shelf by shelf on the inside. Filmed in bedrooms we fitted.',vname='Inside a made-to-measure fitted wardrobe by ABJ, Peterborough',vdesc='the doors and interiors of fitted wardrobes made and fitted by ABJ Kitchens & Bedrooms in Peterborough'),
 'bedrooms':dict(tab='Bedrooms',h2='One bedroom, fitted wall to wall',p='Dressing table, panelling, bed storage and wardrobes designed together, so the whole room reads as one piece.',vname='A fitted bedroom by ABJ Kitchens & Bedrooms, Peterborough',vdesc='fitted bedroom furniture made and fitted by ABJ Kitchens & Bedrooms in Peterborough'),
 'mediawalls':dict(tab='Media walls',h2='Two media walls, two moods',p='One warm and built in around the fire, one light with marble-effect panels and oak slats. Both made to the wall they sit on.',vname='Two bespoke media walls by ABJ Kitchens & Bedrooms, Peterborough',vdesc='two bespoke TV media walls made and fitted by ABJ Kitchens & Bedrooms in Peterborough'),
 'storage':dict(tab='Storage',h2='Behind two plain doors',p='A full pantry and coffee station that closes away to a flat, quiet wall of doors.',vname='A fitted pantry cupboard by ABJ Kitchens & Bedrooms, Peterborough',vdesc='a fitted pantry and coffee-station cupboard made and fitted by ABJ Kitchens & Bedrooms in Peterborough'),
 'office':dict(tab='Home offices',h2='A desk that belongs in the room',p='Built-in desks and shelving for bedrooms, alcoves and kitchen corners, made to the exact space.',vname='Built-in home office desks by ABJ Kitchens & Bedrooms, Peterborough',vdesc='built-in desks and shelving made and fitted by ABJ Kitchens & Bedrooms in Peterborough'),
 'worktops':dict(tab='Worktops',h2='Worktops, up close',p='Edges, sinks and finishes from kitchens we have fitted, plus the samples you can handle in our showroom.',vname='Kitchen worktops up close by ABJ Kitchens & Bedrooms, Peterborough',vdesc='worktop edges, sinks and finishes in kitchens fitted by ABJ Kitchens & Bedrooms in Peterborough'),
 'decors':dict(tab='Wall panelling',h2='Slats, flutes and panels',p='Wall panelling we have made for bedrooms and living rooms, from oak slats around a lit arch to a panelled headboard wall.',vname='Slatted and panelled walls by ABJ Kitchens & Bedrooms, Peterborough',vdesc='slatted, fluted and panelled walls made and fitted by ABJ Kitchens & Bedrooms in Peterborough'),
}
CSS="""#kc .csv.vf{padding:clamp(64px,6vw,120px) 0}
#kc .csv.vf .w{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:clamp(36px,4.6vw,96px);align-items:center}
#kc .csv.vf h2{font-size:clamp(32px,2.9vw,52px);margin:18px 0 20px}
#kc .csv.vf .ft p{max-width:24em}
#kc .csv.vf .pl{aspect-ratio:9/16;width:clamp(380px,27vw,460px);cursor:default;box-shadow:0 30px 80px -30px rgba(0,0,0,.75)}
#kc .csv.vf .pl video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000}
#kc .csv.vf .fl{max-width:23em;width:100%}
#kc .csv.vf .fl .kick{margin:0 0 16px}
#kc .csv.vf ol{list-style:none;margin:0;padding:0;border-bottom:1px solid rgba(243,238,230,.16)}
#kc .csv.vf li{border-top:1px solid rgba(243,238,230,.16);margin:0}
#kc .csv.vf li button{all:unset;box-sizing:border-box;display:flex;gap:16px;align-items:baseline;width:100%;padding:13px 0;cursor:pointer;font:400 clamp(14px,1.02vw,16.5px)/1.35 var(--sans);color:rgba(243,238,230,.68);transition:color .3s,padding .3s,box-shadow .3s}
#kc .csv.vf li button b{font:400 17px/1 var(--serif);color:var(--go);min-width:1.6em}
#kc .csv.vf li button:hover,#kc .csv.vf li.on button{color:var(--lin)}
#kc .csv.vf li.on button{padding-left:14px;box-shadow:inset 2px 0 0 var(--go)}
#kc .csv.vf li button:focus-visible{outline:2px solid var(--go);outline-offset:2px}
#kc .csv.vf .tabs{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:8px 10px;justify-content:center;margin-bottom:clamp(4px,1vw,18px)}
#kc .csv.vf .tabs button{all:unset;box-sizing:border-box;cursor:pointer;font:500 11px/1 var(--sans);letter-spacing:.2em;text-transform:uppercase;padding:12px 18px;border:1px solid rgba(243,238,230,.22);color:rgba(243,238,230,.75);transition:background .3s,color .3s,border-color .3s}
#kc .csv.vf .tabs button:hover{border-color:var(--go);color:var(--lin)}
#kc .csv.vf .tabs button[aria-selected=true]{background:var(--lin);border-color:var(--lin);color:var(--g)}
#kc .csv.vf .tabs button:focus-visible{outline:2px solid var(--go);outline-offset:2px}
@media (max-width:1100px){#kc .csv.vf .w{grid-template-columns:minmax(0,1fr);justify-items:start}#kc .csv.vf .pl{width:100%;max-width:400px}#kc .csv.vf .fl{max-width:400px}#kc .csv.vf .tabs{justify-content:flex-start}}
@media (max-width:760px){#kc .csv.vf .pl,#kc .csv.vf .fl{max-width:none}#kc .csv.vf .tabs{flex-wrap:nowrap;overflow-x:auto;margin:0 calc(-1*var(--pad));padding:0 var(--pad) 4px;scrollbar-width:none;width:calc(100% + 2*var(--pad));box-sizing:border-box}#kc .csv.vf .tabs::-webkit-scrollbar{display:none}#kc .csv.vf .tabs button{flex:0 0 auto;padding:11px 14px}}"""
JS="""(function(){var s=document.getElementById('kc-film');if(!s||s.dataset.on)return;s.dataset.on=1;var v=s.querySelector('video'),ol=s.querySelector('ol'),F=null;try{F=JSON.parse(s.querySelector('script[type="application/json"]').textContent)}catch(e){}
function bs(){return [].slice.call(ol.querySelectorAll('button'))}
function act(){var t=v.currentTime,k=-1,b=bs();b.forEach(function(x,i){if(t>=+x.dataset.t-.05)k=i});if(v.paused&&t<.1)k=-1;b.forEach(function(x,i){x.parentNode.classList.toggle('on',i===k)})}
function go(t){function f(){try{v.currentTime=t}catch(e){}var p=v.play();if(p&&p.catch)p.catch(function(){})}if(v.readyState>0)f();else{v.addEventListener('loadedmetadata',f,{once:true});v.load()}}
ol.addEventListener('click',function(e){var x=e.target.closest('button');if(x)go(+x.dataset.t?+x.dataset.t+.25:0)});
v.addEventListener('timeupdate',act);v.addEventListener('seeked',act);v.addEventListener('ended',act);
if(F){var tb=[].slice.call(s.querySelectorAll('.tabs button'));tb.forEach(function(x,i){x.addEventListener('click',function(){var f=F[i];tb.forEach(function(y,j){y.setAttribute('aria-selected',j===i?'true':'false')});v.pause();s.querySelector('h2').textContent=f.h;s.querySelector('.ft p:not(.kick)').textContent=f.p;s.querySelector('.ft .kick').textContent='Watch \\u00b7 '+f.s+' seconds';var l=s.querySelector('.ft .lnk');if(l&&f.u){l.href=f.u;l.textContent=f.l}v.poster=f.o;v.src=f.v;v.setAttribute('aria-label',f.h+': short film');v.load();ol.innerHTML=f.c.map(function(c,n){return '<li><button type="button" data-t="'+c[0]+'"><b>'+('0'+(n+1)).slice(-2)+'</b><span>'+c[1]+'</span></button></li>'}).join('')})})}})();"""
def lis(m):
    return ''.join(f'<li><button type="button" data-t="{round(t+0.2,2) if t else 0}"><b>{i+1:02d}</b><span>{html.escape(l)}</span></button></li>' for i,(t,l) in enumerate(zip(m['starts'],m['labels'])))
def secs(m): return int(round(m["total"]))
def section(names,base,single_cta=('#kc-book','Book a free design visit'),links=None,ld=True,kick_list='In this film'):
    ms=[json.load(open(f'out/{n}.json')) for n in names];n0=names[0];m=ms[0];c=COPY[n0]
    for mm in ms: mm['labels']=[l.replace('The drawer within','A drawer within') for l in mm['labels']]
    tabs='';data=''
    if len(names)>1:
        tabs='<div class="tabs" role="tablist" aria-label="Choose a film">'+''.join(f'<button type="button" role="tab" aria-selected="{"true" if i==0 else "false"}">{COPY[n]["tab"]}</button>' for i,n in enumerate(names))+'</div>\n'
        arr=[dict(h=COPY[n]['h2'],p=COPY[n]['p'],s=secs(mm),v=base[n]+f'abj-{n}-film.mp4',o=base[n]+f'abj-{n}-film-poster.webp',c=[[round(t+0.2,2) if t else 0,l] for t,l in zip(mm['starts'],mm['labels'])],u=(links or {}).get(n,[None,None])[0],l=(links or {}).get(n,[None,None])[1]) for n,mm in zip(names,ms)]
        data='<script type="application/json">'+json.dumps(arr).replace('</','<\\/')+'</script>\n'
    href,ltxt=(links[n0] if links else single_cta)
    out=f'''<!-- ABJ FILM (DEV TEST 13 NOV) -->
<style>{CSS}</style>
<section class="csv vf" id="kc-film" aria-label="{html.escape(c['tab'])} film"><div class="w">
{tabs}<div class="ft"><p class="kick">Watch &middot; {secs(m)} seconds</p>
<h2>{html.escape(c['h2'])}</h2>
<p>{html.escape(c['p'])}</p>
<a class="lnk" href="{href}">{ltxt}</a></div>
<div class="pl"><video controls muted playsinline preload="none" width="1080" height="1920" poster="{base[n0]}abj-{n0}-film-poster.webp" aria-label="{html.escape(c['h2'])}: short film" src="{base[n0]}abj-{n0}-film.mp4"></video></div>
<div class="fl"><p class="kick">{kick_list}</p><ol>{lis(m)}</ol></div>
{data}</div></section>
<script>{JS}</script>
'''
    if ld:
        d={"@context":"https://schema.org","@type":"VideoObject","name":c['vname'],"description":f"A {secs(m)}-second film of {c['vdesc']}: "+', '.join((l[0].lower()+l[1:]) if l[1:2].islower() or l[1:2]==' ' else l for l in m['labels'])+'.',"thumbnailUrl":base[n0]+f'abj-{n0}-film-poster.jpg',"uploadDate":"2026-11-13T19:00:00+00:00","duration":f"PT{int(round(m['total']))}S","contentUrl":base[n0]+f'abj-{n0}-film.mp4',"publisher":{"@type":"Organization","name":"ABJ Kitchens & Bedrooms"}}
        out+='<script type="application/ld+json">'+json.dumps(d)+'</script>\n'
    return out+'<!-- /ABJ FILM -->\n'
