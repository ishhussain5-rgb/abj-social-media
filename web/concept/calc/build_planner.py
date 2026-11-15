#!/usr/bin/env python3
"""Budget planner: the cost guide turned round. The visitor picks a budget and sees what it typically covers.

It uses the SAME price bands as the cost guides (SERVICES in build_calc.py), so there is one set of numbers to keep up to date.
The planner never shows a price of ours: only the visitor's own budget and what that usually buys.

  python3 build_planner.py     writes calc/planner.html (full section, three rooms)
                               and calc/planner_<key>.html (short strip for a service page)
                               and refreshes the planner inside pages/budget-planner.html (between the PLANNER markers)
"""
import json, html, os, re
from build_calc import SERVICES

HERE = os.path.dirname(os.path.abspath(__file__))
PAGE = '/budget-planner-dev-p6k3'          # where the short strips link to (change at go-live)
T = lambda id_, name: 'https://thb.tildacdn.com/%s/-/resize/1200x/-/format/webp/%s' % (id_, name)
S = lambda id_, name: 'https://static.tildacdn.net/%s/%s' % (id_, name)

# Real ABJ photos (one per size where we have them, otherwise one for the room), captioned as what the photo shows.
J = lambda sha, path: 'https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@%s/%s' % (sha, path)
EL = 'Electrical connections are priced separately.'
# tpl: how a suggestion reads ({sz} size, {st} style or finish, {wt} worktop). art: put "A"/"An" in front.
# pref: the order most people choose in (first = most popular). est: no direct quote behind the bands yet.
ROOMS = {
 'kitchen': dict(tab='Kitchen', a='a kitchen', plural='kitchens', tpl='{sz} {st} kitchen with {wt} worktops', pref=dict(wt=[2, 0, 1, 3], st=[1, 0, 2, 3]),
  excl='Appliances, sink and tap, plumbing, electrics and building work are priced separately.',
  photos=[(S('tila6664-3632-4562-b164-393964383962', 'abj-kitchen-cream-gl.webp'), 'Cream gloss handleless L-shaped kitchen'),
          (T('tild6433-6635-4239-a236-363531366664', 'abj-kitchen-navy-sha.jpg'), 'Navy Shaker U-shaped kitchen with oak worktops'),
          (T('tild3330-3561-4463-a638-333464383539', 'abj-kitchen-grey-sha.jpg'), 'Light grey Shaker kitchen with a navy island'),
          (S('tila6131-3661-4863-b433-336364646331', 'abj-open-plan-kitche.webp'), 'Open-plan handleless kitchen with an island')]),
 'wardrobe': dict(tab='Fitted wardrobes', a='fitted wardrobes', plural='fitted wardrobes', tpl='{sz} fitted wardrobe with {st} doors', pref=dict(st=[1, 0, 2]), excl=EL,
  photos=[(T('tild6566-3663-4431-a234-373934646231', 'BespokeFittedWardrob.jpg'), 'Walnut-effect fitted wardrobe with a lit alcove'),
          (T('tild6439-3461-4735-a639-616138666364', 'BespokeFittedWardrob.jpg'), 'White Shaker fitted wardrobes with a chest of drawers'),
          (T('tild6365-3032-4562-a630-376262383035', 'BespokeFittedWardrob.jpg'), 'A wall of white Shaker fitted wardrobes'),
          (T('tild3237-3062-4838-a238-396133343433', 'abj-bed53.jpg'), 'Light grey Shaker wardrobes along a full bedroom wall')]),
 'sliding': dict(tab='Sliding wardrobes', a='a sliding wardrobe', plural='sliding wardrobes', tpl='{sz} sliding wardrobe with {st} doors', pref=dict(st=[0, 2, 1, 3]), excl=EL,
  photos=[(T('tild3666-3062-4630-b662-303130386639', 'abj-war37.jpg'), 'Sliding wardrobe doors with mirror and black glass panels')]),
 'walkin': dict(tab='Walk-in wardrobes', a='a walk-in wardrobe', plural='walk-in wardrobes', tpl='{sz} walk-in wardrobe {st}', szw=['small', 'medium', 'large', 'dressing-suite'], pref=dict(st=[0, 1, 2]), excl=EL,
  photos=[(T('tild3431-3662-4062-b833-396339626633', 'abj-war92.jpg'), 'Walk-in dressing room with walnut shelving and pull-out drawers')]),
 'sloping': dict(tab='Sloping ceilings', a='sloping-ceiling wardrobes', plural='sloping-ceiling wardrobes', tpl='{sz} run of sloping-ceiling wardrobes with {st} doors', pref=dict(st=[1, 0, 2]), excl=EL,
  photos=[(S('tila6337-6339-4734-a237-306631373133', 'BespokeBedrooms30.webp'), 'White gloss fitted wardrobes built into a sloped loft ceiling')]),
 'bedroom': dict(tab='Fitted bedroom', a='a fitted bedroom', plural='fitted bedrooms', tpl='Fitted bedroom with {sz} in a {st} finish', art=False, szw=['a single wardrobe', 'medium wardrobes', 'large wardrobes', 'wall-to-wall wardrobes'], pref=dict(st=[1, 0, 2]), excl=EL,
  photos=[(S('tila6162-3235-4265-a535-653331656565', 'BespokeBedrooms25.webp'), 'Navy fitted bedroom with overhead cabinets and a padded headboard')]),
 'mediawall': dict(tab='Media wall', a='a media wall', plural='media walls', tpl='{sz} media wall in a {st} finish', pref=dict(st=[0, 1, 2]),
  excl='The electric fire, TV set-up and electrical connections are priced separately.',
  photos=[(T('tild3761-3562-4439-b837-386439613861', 'abj-med36.jpg'), 'Grey media wall with a low TV unit'),
          (T('tild3331-6337-4834-b466-343262386465', 'abj-med3.jpg'), 'Cream media wall with display shelving'),
          (S('tila6334-3364-4937-b632-623438633735', 'BespokeMediaWalls43.webp'), 'Walnut slatted media wall with a backlit TV panel'),
          (S('tila6435-3766-4165-a532-663637336638', 'WhatsApp_Image_2024-.webp'), 'Large media wall with lit glass display cabinets')]),
 'alcove': dict(tab='Alcove units', a='alcove units', plural='alcove units', tpl='Alcove units for {sz} in a {st} finish', art=False, pref=dict(st=[1, 0, 2]), excl=EL, est=True,
  photos=[(S('tila3938-3335-4239-b730-623234363739', 'abj-cab75.webp'), 'Living room alcove cabinetry with an inset fire and TV')]),
 'understairs': dict(tab='Under-stairs', a='under-stairs storage', plural='under-stairs storage designs', tpl='{sz} under-stairs design with {st} storage', pref=dict(st=[1, 0, 2]), excl=EL, est=True,
  photos=[(S('tila6661-3436-4835-b261-343631313434', 'UnderStair28.webp'), 'Under-stairs pull-out shelving towers')]),
 'storage': dict(tab='Storage & utility', a='fitted storage', plural='fitted storage designs', tpl='{sz} of {st} storage', art=False, szw=['One tall unit', 'A small run', 'A utility or boot room', 'A full room'], pref=dict(st=[1, 0, 2]), est=True,
  excl='Appliances, plumbing and electrical connections are priced separately.',
  photos=[(T('tild3132-3061-4665-b162-666361386636', 'UnderStair22.jpg'), 'Fitted loft cupboards around a round window')]),
 'office': dict(tab='Home office', a='a home office', plural='home offices', tpl='{sz} with {st} doors', szw=['desk nook', 'study wall', 'two-wall home office', 'full home office'], pref=dict(st=[0, 1, 2]), excl=EL, est=True,
  photos=[(S('tila6631-6662-4265-a564-653935613632', 'Cabinet35.webp'), 'Fitted oak home office with a desk, bookshelves and tall cupboards')]),
 'hallway': dict(tab='Hallway', a='hallway storage', plural='hallway storage designs', tpl='{sz} with {st} doors', art=False, szw=['A hallway shoe cabinet', 'A coat and shoe unit', 'A full wall of hallway cupboards', 'Hallway and under-stairs storage'], pref=dict(st=[0, 1, 2]), excl=EL, est=True,
  photos=[(T('tild3735-6338-4530-b333-303330336334', 'UnderStair21.jpg'), 'Pull-out drawers under the stairs in a hallway')]),
 'bathroom': dict(tab='Bathroom', a='bathroom cabinetry', plural='bathroom cabinetry designs', tpl='{sz} in a {st} finish', art=False, pref=dict(st=[0, 1, 2]), est=True,
  excl='Basins, taps, plumbing and electrical connections are priced separately.',
  photos=[('https://static.tildacdn.net/tild3164-3131-4532-b163-633561633337/2-1600x0_1.webp', 'Grey vanity unit with deep drawers')]),
 'worktop': dict(tab='Worktops', a='new worktops', plural='worktops', tpl='{wt} worktops for a {sz} kitchen', art=False, pref=dict(wt=[2, 0, 1, 3]), est=True,
  excl='Removing old worktops, plumbing and electrics are priced separately.',
  photos=[(J('f58f336440de04a809f3750794a9529ad9469251', 'media/l/c9b6a43-abj-wt-quartz-sink.webp'), 'Quartz worktop with an undermount sink under a window')]),
 'decor': dict(tab='Feature walls', a='a feature wall', plural='feature walls', tpl='{sz} {st} feature wall', szw=['narrow', 'medium', 'full-wall', 'large'], pref=dict(st=[0, 1, 2]), excl=EL, est=True,
  photos=[(S('tila3736-3466-4231-b934-376164303364', 'Cabinet57.webp'), 'Oak slat wall panel with floating black display shelves')]),
}


def rnd(n, hi=None):
    s = 50 if (hi or n) < 5000 else 250
    return int(n / s + 0.5) * s


def combos(key):
    """Every size x option combination with its guide range, worked out exactly as the cost guide does."""
    c, r = SERVICES[key], ROOMS[key]
    groups = c['groups']
    out = []

    def walk(gi, pick):
        if gi == len(groups):
            sz = pick[groups[0]['n']]
            m = 1
            for g in groups:
                if g.get('mult'): m *= g['mult'][pick[g['n']]]
            lo, hi = c['base'][sz][0] * m + c['inst'][sz][0], c['base'][sz][1] * m + c['inst'][sz][1]
            for g in groups:
                if g.get('add'):
                    a = g['add'][pick[g['n']]][sz]; lo += a[0]; hi += a[1]
            hi = rnd(hi); lo = rnd(lo, hi)
            w = {g['n']: html.unescape(g['say'][pick[g['n']]]) for g in groups}
            if r.get('szw'): w['sz'] = r['szw'][sz]
            t = r['tpl'].format(**w)
            if r.get('art', True): t = ('An ' if t[0].lower() in 'aeio' else 'A ') + t
            t = t[0].upper() + t[1:]
            rk = 0
            for n, order in r['pref'].items():   # first key matters most (worktop before door style)
                rk = rk * 10 + order.index(pick[n])
            out.append(dict(s=sz, lo=lo, hi=hi, t=t, m=round(m, 3), r=rk))
            return
        g = groups[gi]
        for i in range(len(g['opts'])):
            walk(gi + 1, dict(pick, **{g['n']: i}))
    walk(0, {})
    return out


def data(key):
    c, r = SERVICES[key], ROOMS[key]
    cs = combos(key)
    ext = [dict(n=html.unescape(e['name']), p=e['p'], m=1 if e.get('mult') else 0, i=e.get('incl', [])) for e in c['ext'].values()
           if isinstance(e['p'][0], (int, float))]
    lo_min, hi_max = min(x['lo'] for x in cs), max(x['hi'] for x in cs)
    step = 500 if hi_max > 10000 else 250 if hi_max > 4000 else 100
    up = lambda v: -(-v // step) * step
    lo, hi = max(step, (int(lo_min * 0.8) // step) * step), up(hi_max * 1.08)
    # quick picks: the budget at which the most popular choice becomes comfortable, size by size
    pre = sorted({up(min((x for x in cs if x['s'] == z), key=lambda x: x['r'])['hi']) for z in range(len(c['groups'][0]['opts']))})
    return dict(k=key, tab=r['tab'], a=r['a'], pl=r['plural'], lo=lo, hi=hi, st=pre[min(1, len(pre) - 1)], step=step, pre=pre, est=1 if r.get('est') else 0,
                from_=-(-lo_min // step) * step, c=cs, x=ext, ex=r['excl'],
                sz=[html.unescape(o[1]) for o in c['groups'][0]['opts']], sn=[html.unescape(o[0]) for o in c['groups'][0]['opts']], ph=[list(p) for p in r['photos']])


CSS = '''<style>
#kc .bp{background:var(--g);color:var(--lin);padding:clamp(64px,6.5vw,120px) 0}
#kc .bp .kick{color:var(--go)}
#kc .bp h2{margin:16px 0 16px;color:var(--lin)}
#kc .bp .lead{max-width:36em;color:rgba(243,238,230,.74);margin-bottom:clamp(24px,2.6vw,40px)}
#kc .bp .bg{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:clamp(36px,5vw,100px);align-items:start}
#kc .bp .tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:clamp(26px,3vw,44px)}
#kc .bp .selw{display:none}
#kc .bp .selw span{display:block;font:500 11px/1.4 var(--sans);letter-spacing:.24em;text-transform:uppercase;color:rgba(243,238,230,.55);margin-bottom:8px}
#kc .bp select.sel{width:100%;height:52px;padding:0 14px;border:1px solid var(--go);border-radius:0;background:var(--g);color:var(--lin);font:400 17px/1 var(--sans)}
#kc .bp .tabs button{border:1px solid rgba(243,238,230,.25);background:transparent;color:rgba(243,238,230,.85);padding:12px 18px;font:500 11.5px/1 var(--sans);letter-spacing:.18em;text-transform:uppercase;cursor:pointer;transition:.2s}
#kc .bp .tabs button[aria-pressed=true]{background:var(--go);border-color:var(--go);color:var(--g)}
#kc .bp .amt{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap}
#kc .bp .amt small{font:500 11px/1.4 var(--sans);letter-spacing:.24em;text-transform:uppercase;color:rgba(243,238,230,.55)}
#kc .bp .amt output{font:300 clamp(48px,5.4vw,84px)/1 var(--serif);color:var(--lin);font-variant-numeric:lining-nums}
#kc .bp input[type=range]{-webkit-appearance:none;appearance:none;display:block;width:100%;height:44px;margin:10px 0 0;background:transparent;cursor:pointer;--p:50%}
#kc .bp input[type=range]::-webkit-slider-runnable-track{height:3px;background:linear-gradient(90deg,var(--go) var(--p),rgba(243,238,230,.22) var(--p))}
#kc .bp input[type=range]::-moz-range-track{height:3px;background:rgba(243,238,230,.22)}
#kc .bp input[type=range]::-moz-range-progress{height:3px;background:var(--go)}
#kc .bp input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:26px;margin-top:-12px;border-radius:50%;background:var(--go);border:4px solid var(--g);box-shadow:0 0 0 1px var(--go)}
#kc .bp input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:var(--go);border:4px solid var(--g);box-shadow:0 0 0 1px var(--go)}
#kc .bp input[type=range]:focus-visible{outline:1px solid var(--go);outline-offset:4px}
#kc .bp .ends{display:flex;justify-content:space-between;font:400 12px/1 var(--sans);color:rgba(243,238,230,.5)}
#kc .bp .pre{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
#kc .bp .pre button{border:1px solid rgba(243,238,230,.22);background:transparent;color:rgba(243,238,230,.82);padding:9px 13px;font:400 13px/1.2 var(--sans);cursor:pointer;transition:.2s}
#kc .bp .pre button:hover{border-color:var(--go);color:var(--lin)}
#kc .bp figure{margin:clamp(26px,3vw,44px) 0 0}
#kc .bp figure img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover}
#kc .bp figcaption{margin-top:10px;font-size:12.5px;line-height:1.5;color:rgba(243,238,230,.6)}
#kc .bp .res{background:var(--lin);color:var(--ink);padding:clamp(24px,2.6vw,44px)}
#kc .bp .res .kick{color:#8a6d3b}
#kc .bp .res h3{font:400 clamp(26px,2.3vw,36px)/1.15 var(--serif);margin:12px 0 6px;color:var(--ink)}
#kc .bp .res .sub{font-size:14px;color:var(--mut);margin-bottom:18px}
#kc .bp .opt{padding:16px 0;border-top:1px solid rgba(27,35,33,.14)}
#kc .bp .opt .tg{display:inline-block;font-style:normal;font:500 10px/1.5 var(--sans);letter-spacing:.2em;text-transform:uppercase;color:#8a6d3b;margin-bottom:6px}
#kc .bp .opt.r .tg{color:var(--mut)}
#kc .bp .opt b{display:block;font:400 clamp(19px,1.5vw,23px)/1.25 var(--serif);color:var(--ink)}
#kc .bp .opt span{display:block;font-size:13.5px;line-height:1.5;color:var(--mut);margin-top:4px}
#kc .bp .tip{display:flex;gap:10px;margin-top:6px;padding:12px 14px;background:var(--lin2);font-size:13.5px;line-height:1.5;color:var(--ink)}
#kc .bp .tip:before{content:"";flex:0 0 7px;height:7px;margin-top:7px;background:var(--go);transform:rotate(45deg)}
#kc .bp .tip:empty{display:none}
#kc .bp .res .acts{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
#kc .bp .res .bt{background:var(--g);color:var(--lin);border:1px solid var(--g)}
#kc .bp .res .bt:hover{background:var(--go);border-color:var(--go);color:var(--g)}
#kc .bp .res .bt.o{background:transparent;border-color:rgba(27,35,33,.3);color:var(--ink)}
#kc .bp .res .bt.o:hover{background:transparent;border-color:var(--ink);color:var(--ink)}
#kc .bp .fine{margin-top:16px;font-size:12px;line-height:1.55;color:var(--mut)}
#kc .bp .fine b{font-weight:400}
#kc .bp.mini{padding:clamp(44px,4.5vw,76px) 0}
#kc .bp.mini .bg{align-items:center}
#kc .bp.mini h2{font-size:clamp(28px,2.6vw,42px)}
#kc .bp.mini .lead{margin-bottom:18px}
#kc .bp.mini .amt output{font-size:clamp(40px,4vw,60px)}
#kc .bp.mini .res h3{font-size:clamp(21px,1.7vw,26px);margin:10px 0 12px}
@media(max-width:1100px){#kc .bp .bg{grid-template-columns:1fr;gap:28px}#kc .bp figure{display:none}#kc .bp .tabs{display:none}#kc .bp .selw{display:block;margin-bottom:26px}}
</style>'''

ENGINE = r'''(function(){
 var root=document.getElementById('bp'),D=__D__,mini=root.classList.contains('mini'),cur=null,B=0;
 var q=function(s){return root.querySelector(s)},gbp=function(n){return '£'+n.toLocaleString('en-GB')};
 var esc=function(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')};
 var rng=q('input[type=range]'),out=q('output');
 function pick(){
  var rows=[],lc=function(t){return t.charAt(0).toLowerCase()+t.slice(1)};
  for(var z=cur.sz.length-1;z>=0&&rows.length<3;z--){
   var all=cur.c.filter(function(c){return c.s===z}),ok=all.filter(function(c){return c.hi<=B}),near=all.filter(function(c){return c.lo<=B&&c.hi>B});
   var byR=function(x,y){return x.r-y.r};
   if(ok.length===all.length){var top=all.slice().sort(function(x,y){return y.hi-x.hi})[0];rows.push({c:top,ok:1,n:all.length>1?'Every style and finish we offer at this size is comfortably within this budget.':'Comfortably within this budget.'})}
   else if(ok.length){var c=ok.sort(byR)[0],up=near.filter(function(n){return n.r<c.r}).sort(byR)[0]||near.sort(byR)[0];
    rows.push({c:c,ok:1,n:'Comfortably within this budget.'+(up?' A step up ('+lc(up.t)+') may be possible, depending on your room.':'')})}
   else if(near.length)rows.push({c:near.sort(byR)[0],n:'Possible, depending on your room and choices.'});
  }
  var okRows=rows.filter(function(r){return r.ok});
  var typ=okRows.filter(function(r){return r.c.r===0})[0]||okRows[0];
  return {o:rows.slice().reverse(),ok:okRows.length,A:okRows[0],typ:typ};
 }
 function extras(A){
  var left=B-A.hi,got=[];
  cur.x.forEach(function(e){var p=e.p[1]*(e.m?A.m:1);if(e.i.indexOf(A.s)<0&&p<=left&&got.length<3){got.push(e.n);left-=p}});
  return got;
 }
 function list(a){return a.length>1?a.slice(0,-1).join(', ')+' and '+a[a.length-1]:a[0]}
 function draw(){
  B=+rng.value;out.textContent=gbp(B);
  rng.style.setProperty('--p',((B-cur.lo)/(cur.hi-cur.lo)*100)+'%');
  var r=pick(),A=r.A||r.o[0],h3,sub='',body='',tip='';
  if(!A){
   h3='A little under our usual starting point for '+cur.pl;
   sub='Made to measure in our workshop and fitted by our own team, '+cur.pl+' typically start from around '+gbp(cur.from_)+'. Tell us what you have in mind and we will say honestly what is possible.';
  }else{
   h3=(r.ok?'Around '+gbp(B)+' typically covers':'Around '+gbp(B)+' is close to our starting point for '+cur.pl);
   sub='It depends on the size, so here is what to expect at each one. Made to measure in our Peterborough workshop and fitted by our own team.';
   body=r.o.map(function(x){return '<div class="opt'+(x.ok?'':' r')+'"><i class="tg">'+esc(cur.sn[x.c.s])+' &middot; '+esc(cur.sz[x.c.s])+'</i><b>'+esc(x.c.t)+'</b><span>'+esc(x.n)+'</span></div>'}).join('');
   if(r.ok){var ex=extras(r.A.c);if(ex.length)tip='At this budget there is usually room for extras too, such as '+list(ex)+'.'}
   if(!tip&&B>=6000)tip='0% finance is available on projects over £6,000 (subject to status).';
   A=A.c;
  }
  if(mini){
   q('.res h3').textContent=A?(r.ok?r.typ.c.t+', made and fitted.':'Close to our starting point for '+cur.pl+'. '+A.t+' may be possible.'):h3+'.';
   q('.res a').href='__PAGE__#'+cur.k+'-'+B;
  }else{
   q('.res h3').textContent=h3;q('.res .sub').textContent=sub;q('.opts').innerHTML=body;q('.tip').textContent=tip;
   var p=cur.ph[Math.min(A?A.s:0,cur.ph.length-1)],im=q('figure img');if(im.getAttribute('src')!==p[0]){im.src=p[0];im.alt=p[1]+', made and fitted by ABJ'}
   q('figcaption').textContent='One we made: '+p[1].charAt(0).toLowerCase()+p[1].slice(1)+'. Shown for style. Your own price depends on your room.';
   q('.fine i').textContent=cur.ex;q('.fine b').textContent=cur.est?'A guide worked out from our recent quotes, not a quote.':'A guide based on recent quotes, not a quote.';
   q('.wa').href='https://wa.me/447479219421?text='+encodeURIComponent('Hi ABJ, I used the budget planner on your website. My budget is around '+gbp(B)+' for '+cur.a+'. Could we arrange a free design visit?');
  }
 }
 function room(k,b){
  cur=D.filter(function(d){return d.k===k})[0]||D[0];
  [].forEach.call(root.querySelectorAll('.tabs button'),function(t){t.setAttribute('aria-pressed',t.value===cur.k?'true':'false')});var sl=q('select.sel');if(sl)sl.value=cur.k;
  rng.min=cur.lo;rng.max=cur.hi;rng.step=cur.step;rng.value=b||cur.st;
  var e=root.querySelectorAll('.ends span');if(e.length){e[0].textContent=gbp(cur.lo);e[1].textContent=gbp(cur.hi)+'+'}
  var pr=q('.pre');if(pr)pr.innerHTML=cur.pre.map(function(v){return '<button type="button" value="'+v+'">'+gbp(v)+'</button>'}).join('');
  draw();
 }
 var tm;function track(){clearTimeout(tm);tm=setTimeout(function(){try{if(window.gtag&&localStorage.getItem('abj_cookie_consent')==='accepted')gtag('event','budget_planner',{room:cur.k,budget:B,placement:mini?'strip':'page'})}catch(e){}},1500)}
 rng.addEventListener('input',function(){draw();track()});
 var sl0=q('select.sel');if(sl0)sl0.addEventListener('change',function(){room(sl0.value);track()});
 root.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
  if(b.parentNode.classList.contains('tabs')){room(b.value);track()}
  else if(b.parentNode.classList.contains('pre')){rng.value=b.value;draw();track()}});
 var h=(location.hash||'').match(/^#([a-z]+)-(\d+)$/);
 if(!mini&&h&&D.some(function(d){return d.k===h[1]})){room(h[1],Math.max(0,+h[2]));setTimeout(function(){root.scrollIntoView()},300)}else room(D[0].k);
})();'''


def js(keys):
    d = json.dumps([data(k) for k in keys], ensure_ascii=False, separators=(',', ':'))
    return ENGINE.replace('__D__', d).replace('__PAGE__', PAGE)


def full():
    keys = list(ROOMS)
    tabs = ''.join('<button type="button" value="%s" aria-pressed="%s">%s</button>' % (k, 'true' if i == 0 else 'false', ROOMS[k]['tab']) for i, k in enumerate(keys))
    opts = ''.join('<option value="%s">%s</option>' % (k, ROOMS[k]['tab']) for k in keys)
    p = ROOMS[keys[0]]['photos'][1]
    return f'''<section class="bp" id="bp" aria-label="Budget planner">
{CSS}
<div class="w">
 <div class="rv"><span class="kick">Budget planner</span>
 <h2>Tell us your budget. See what it could become.</h2>
 <p class="lead">Choose what you are planning and slide to the amount you would be comfortable spending. We will show what that typically covers, using the guide ranges from our recent quotes for work made in our Peterborough workshop and fitted by our own team.</p>
 <div class="tabs" role="group" aria-label="What are you planning?">{tabs}</div>
 <label class="selw"><span>I am planning</span><select class="sel" aria-label="What are you planning?">{opts}</select></label></div>
 <div class="bg">
  <div class="rv">
   <div class="amt"><small>My budget is around</small><output for="bp-r" aria-live="polite">&pound;8,000</output></div>
   <input type="range" id="bp-r" aria-label="Your budget in pounds" min="2000" max="25000" step="500" value="8000">
   <div class="ends"><span></span><span></span></div>
   <div class="pre" aria-label="Quick picks"></div>
   <figure><img loading="lazy" src="{p[0]}" alt="{html.escape(p[1])}, made and fitted by ABJ"><figcaption></figcaption></figure>
  </div>
  <aside class="res rv" aria-live="polite">
   <span class="kick">What it typically covers</span>
   <h3></h3><p class="sub"></p>
   <div class="opts"></div>
   <p class="tip"></p>
   <div class="acts"><a class="bt" href="{{BOOK}}">Book a free design visit</a><a class="bt o wa" href="https://wa.me/447479219421" target="_blank" rel="noopener">Send us your budget</a></div>
   <p class="fine"><b></b> Your exact price comes with your 3D design after a free home visit, and your designer works with the budget you give them. It covers making, delivering and fitting. <i></i> Prices include VAT.</p>
  </aside>
 </div>
</div>
<script>
{js(keys)}</script>
</section>
'''


def mini(key):
    r = ROOMS[key]; d = data(key)
    return f'''<section class="bp mini" id="bp" aria-label="Budget planner">
{CSS}
<div class="w"><div class="bg">
 <div class="rv"><span class="kick">Budget planner</span>
  <h2>Have a budget in mind?</h2>
  <p class="lead">Slide to the amount you would be comfortable spending and see what it typically covers.</p>
  <div class="amt"><small>Around</small><output for="bp-r" aria-live="polite"></output></div>
  <input type="range" id="bp-r" aria-label="Your budget in pounds" min="{d['lo']}" max="{d['hi']}" value="{d['st']}">
  <div class="ends"><span></span><span></span></div>
 </div>
 <aside class="res rv" aria-live="polite">
  <span class="kick">Typically covers</span>
  <h3></h3>
  <a class="lnk" href="{PAGE}">See everything this budget could cover</a>
  <p class="fine">{'A guide worked out from our recent quotes' if r.get('est') else 'A guide based on recent quotes'}, not a quote. {r['excl']}</p>
 </aside>
</div></div>
<script>
{js([key])}</script>
</section>
'''


if __name__ == '__main__':
    f = full()
    open(os.path.join(HERE, 'planner.html'), 'w').write(f)
    print('planner.html', len(f))
    for k in ROOMS:
        m = mini(k); open(os.path.join(HERE, 'planner_%s.html' % k), 'w').write(m); print('planner_%s.html' % k, len(m))
    pg = os.path.join(HERE, '..', 'pages', 'budget-planner.html')
    if os.path.exists(pg):
        s = open(pg).read()
        s2 = re.sub(r'<!--PLANNER-->.*?<!--/PLANNER-->', lambda _: '<!--PLANNER-->\n' + f + '<!--/PLANNER-->', s, flags=re.S)
        open(pg, 'w').write(s2); print('page refreshed' if s2 != s else 'page unchanged')
    for k in ROOMS:
        d = data(k)
        print(k, 'starts from', d['from_'], '| combos', len(d['c']), '| range', min(c['lo'] for c in d['c']), max(c['hi'] for c in d['c']))
