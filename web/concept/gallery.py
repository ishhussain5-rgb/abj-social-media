#!/usr/bin/env python3
"""Builds pages/gallery.html from gallery_data.txt (category|tilda path|alt). Run before build.py."""
import html, pathlib
HERE = pathlib.Path(__file__).parent
rows = [l.split('|', 2) for l in (HERE / 'gallery_data.txt').read_text().splitlines() if l.strip()]
cats = []
for c, _, _ in rows:
    if c not in cats: cats.append(c)
def thumb(p):
    i, n = p.split('/', 1)
    return ('https://thb.tildacdn.com/%s/-/resize/720x/-/format/webp/%s' % (i, n)) if i.startswith('tild') else 'https://static.tildacdn.net/' + p
items = '\n'.join('  <a class="gi" data-c="%s" href="https://static.tildacdn.net/%s"><img loading="lazy" src="%s" alt="%s"></a>'
                  % (html.escape(c), p, thumb(p), html.escape(a, quote=True)) for c, p, a in rows)
chips = '<button type="button" class="on" data-f="*">All <i>%d</i></button>' % len(rows) + ''.join(
    '<button type="button" data-f="%s">%s <i>%d</i></button>' % (html.escape(c), html.escape(c), sum(1 for r in rows if r[0] == c)) for c in cats)
page = '''<!--META {"slug":"gallery","title":"Gallery","nav":"/gallery-dev-g7l3","ft":"Like what you see?"} -->
<section class="ih" aria-label="Gallery">
 <div class="w">
  <div>
   <span class="kick">Gallery &middot; Peterborough</span>
   <h1>Kitchen &amp; bedroom gallery: rooms we have made</h1>
   <p>Kitchens, bedrooms, wardrobes, media walls and storage, designed, made and fitted by our own team from our Peterborough workshop.</p>
   <div class="acts"><a class="bt" href="{BOOK}">Book a free design visit</a><a class="bt o" href="#kc-gal">Browse the gallery</a></div>
  </div>
  <div class="side rv"><b>%d</b><span>Projects to explore, from Peterborough and beyond</span><small>2,500+ bespoke projects since we started</small></div>
 </div>
</section>

<section class="sec" id="kc-gal" aria-label="Project gallery"><div class="w">
 <div class="gf rv" role="toolbar" aria-label="Filter by room">%s</div>
 <div class="gg" id="kc-gg">
%s
 </div>
 <div class="gm"><button type="button" class="bt d" id="kc-gm">Show more photos</button></div>
</div></section>

<section class="sec alt" aria-label="Case studies"><div class="w">
 <div class="sh rv"><div><span class="kick">Case studies</span><h2 style="margin-top:16px">See how two kitchens came together</h2></div><p>From the first visit to the final fitting, with the decisions along the way.</p></div>
 <div class="ofg">
  <a class="of rv" href="/case-study-kings-road-kitchen-peterborough"><figure><img loading="lazy" src="https://static.tildacdn.net/tila6131-3661-4863-b433-336364646331/abj-open-plan-kitche.webp" alt="Open-plan handleless kitchen with a downdraft island on Kings Road, Peterborough"><span>Case study</span></figure><div class="b"><span class="kick">Kings Road, Peterborough</span><h3>An open-plan kitchen with a downdraft island</h3><div class="ft"><span class="lnk">Read the case study</span></div></div></a>
  <a class="of rv" href="/case-study-handleless-island-kitchen"><figure><img loading="lazy" src="https://static.tildacdn.net/tila6530-3531-4466-a365-333134386564/abj-handleless-islan.webp" alt="Handleless gloss kitchen with a marble-effect waterfall island"><span>Case study</span></figure><div class="b"><span class="kick">Handleless kitchen</span><h3>A gloss kitchen with a waterfall island</h3><div class="ft"><span class="lnk">Read the case study</span></div></div></a>
 </div>
</div></section>

<section class="bk" id="kc-book" aria-label="Book a design visit">
 <figure><img loading="lazy" src="{KC}kc-shaker-l.webp" alt="Shaker kitchen designed and made by ABJ" style="object-position:50%% 60%%"></figure>
 <div class="t rv">
  <span class="kick">Free design visit</span>
  <h2>Let&rsquo;s design yours</h2>
  <p>Send us photos on WhatsApp or book a free design visit. You will see your room in 3D with an itemised quote, with no pressure to go ahead.</p>
  <div class="acts"><a class="bt" href="{BOOK}">Book a design visit</a><a class="bt o" href="tel:+441733686767">Call 01733 686767</a><a class="bt o" href="https://wa.me/447479219421">WhatsApp photos</a></div>
 </div>
</section>
<div class="lb" id="kc-lb" role="dialog" aria-modal="true" aria-label="Photo viewer" hidden><button type="button" class="x" aria-label="Close">&times;</button><button type="button" class="pv" aria-label="Previous photo">&larr;</button><figure><img alt=""><figcaption></figcaption></figure><button type="button" class="nx" aria-label="Next photo">&rarr;</button></div>
<script>
(function(){var g=document.getElementById('kc-gg');if(!g)return;var bs=document.querySelectorAll('#kc .gf button'),it=[].slice.call(g.querySelectorAll('.gi'));
var F='*',N=16,gm=document.getElementById('kc-gm');var draw=function(){var m=it.filter(function(a){return F==='*'||a.dataset.c===F});it.forEach(function(a){a.hidden=true});m.forEach(function(a,i){a.hidden=i>=N});var left=m.length-N;gm.parentNode.style.display=left>0?'':'none';gm.textContent='Show more photos ('+left+')'};
gm.addEventListener('click',function(){N+=16;draw()});
bs.forEach(function(b){b.addEventListener('click',function(){F=b.dataset.f;N=16;bs.forEach(function(x){x.classList.toggle('on',x===b)});draw()})});draw();
var lb=document.getElementById('kc-lb'),im=lb.querySelector('img'),cp=lb.querySelector('figcaption'),cur=0,vis=function(){return it.filter(function(a){return !a.hidden})};
var show=function(i){var v=vis();cur=(i+v.length)%%v.length;var a=v[cur];im.src=a.href;im.alt=a.querySelector('img').alt;cp.textContent=im.alt};
it.forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();lb.hidden=false;document.documentElement.style.overflow='hidden';show(vis().indexOf(a));lb.querySelector('.x').focus()})});
var close=function(){lb.hidden=true;document.documentElement.style.overflow=''};
lb.querySelector('.x').addEventListener('click',close);lb.querySelector('.pv').addEventListener('click',function(){show(cur-1)});lb.querySelector('.nx').addEventListener('click',function(){show(cur+1)});
lb.addEventListener('click',function(e){if(e.target===lb)close()});
addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
var sx=0;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});lb.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)show(cur+(d<0?1:-1))})})();
</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"CollectionPage","name":"Kitchen & bedroom gallery","about":{"@id":"https://abjkitchensandbedrooms.co.uk/#business"}}</script>
''' % (len(rows), chips, items)
(HERE / 'pages' / 'gallery.html').write_text(page)
print('pages/gallery.html', len(rows))
