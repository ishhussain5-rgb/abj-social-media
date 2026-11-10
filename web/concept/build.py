#!/usr/bin/env python3
"""ABJ new-standard page generator (DEV).

Each page in pages/<slug>.html starts with a META comment:
  <!--META {"slug":"home","nav":"/home-dev-r7m3k","ft":"Let&rsquo;s design your space"} -->
followed by the page sections (hero first). build.py wraps them with the shared
theme (theme.css), header, full-screen menu, footer and script, and writes one
self-contained Tilda T123 block to out/<slug>.html.

Usage: python3 build.py            (all pages)
       python3 build.py home       (one page)
"""
import json, re, sys, pathlib

HERE = pathlib.Path(__file__).parent
TILE = "https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@74e75bd623438e99a5f6d391a3a69adb1561e56a/media/"
KC = "https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@69dbc3e188cebfa373bcfe64fceb39654b3a684a/media/"
LOGO = "https://static.tildacdn.net/tila3033-3866-4332-b431-333831333166/ABJ-logo-roundel-256.webp"
BOOK = "/bookingform-dev-k9b4"

NAV = [("/bespoke-kitchens-dev-k7q2", "Kitchens"), ("/bespoke-wardrobes-dev-w4m8", "Wardrobes"),
       ("/bespoke-bedrooms-dev-b3n6", "Bedrooms"), ("/media-walls-dev-m9t5", "Media walls"),
       ("/case-study-kings-road-kitchen-peterborough-dev-c3k8", "Projects")]

MENU = [("/bespoke-kitchens-dev-k7q2", "Kitchens", KC + "kc-run-s.webp"),
        ("/bespoke-wardrobes-dev-w4m8", "Wardrobes", TILE + "abj-wardrobes-t-fitted.webp"),
        ("/bespoke-bedrooms-dev-b3n6", "Bedrooms", TILE + "abj-bedrooms-t-slopes.webp"),
        ("/media-walls-dev-m9t5", "Media walls", TILE + "abj-mediawalls-t-minimal.webp"),
        ("/luxury-worktops-dev-t6p3", "Worktops", KC + "kc-kr-island-s.webp"),
        ("/decors-dev-d8r4", "Wall panelling", TILE + "abj-decors-t-slatted.webp"),
        ("/bespoke-storage-dev-s2k7", "Storage", TILE + "abj-storage-t-pantry.webp"),
        ("/office-renovations-dev-o3f7", "Home offices", TILE + "abj-office-t-home.webp"),
        ("/bespoke-hallways-dev-h4j8", "Hallways", KC + "kc-shaker-s.webp"),
        ("/bathroom-cabinetry-dev-c6v2", "Bathrooms", KC + "kc-inframe-s.webp"),
        ("/case-study-kings-road-kitchen-peterborough-dev-c3k8", "Projects", KC + "kc-kr-bar-s.webp"),
        ("/about-abj-dev-a5b9", "About ABJ", KC + "kc-detail-s.webp")]

LG = ('<a class="lg" href="/home-dev-r7m3k" aria-label="ABJ Kitchens &amp; Bedrooms home"><img src="%s" alt="ABJ Kitchens &amp; Bedrooms logo" width="48" height="48"%s><span class="lgt">ABJ Kitchens<span>&amp; Bedrooms</span></span></a>')


def header(nav):
    links = "".join('<a%s href="%s">%s</a>' % (' class="on"' if h == nav else "", h, t) for h, t in NAV)
    # div role="banner", not <header>: the old site's head scripts (kept for rollback) rewrite the first <header> on desktop.
    # data-abj-links stops the old link script adding FAQs/Gallery/Privacy links to our navs.
    return ('<script>document.documentElement.setAttribute(\'data-abj-links\',\'1\')</script>'
            '<div class="hd" id="kc-hd" role="banner"><div class="w">\n ' + LG % (LOGO, "") +
            '\n <nav aria-label="Main">' + links + '</nav>\n'
            ' <div class="hr"><a class="ph" href="tel:+441733686767">01733 686767</a><a class="lnk" href="' + BOOK +
            '">Book a design visit</a><button class="mb" type="button" aria-expanded="false" aria-controls="kc-mm" aria-label="Open menu"><span>Menu</span><i></i></button></div>\n</div></div>')


MENU_ALT = {  # descriptive alt text for the menu photos (same text as abjSeoFix in tilda_golive.js)
    "kc-run-s.webp": "Fitted kitchen run with tall larder units", "abj-wardrobes-t-fitted.webp": "Fitted wardrobes",
    "abj-bedrooms-t-slopes.webp": "Fitted bedroom furniture under a sloping ceiling", "abj-mediawalls-t-minimal.webp": "Media wall with a floating TV unit",
    "kc-kr-island-s.webp": "Kitchen island with a stone worktop", "abj-decors-t-slatted.webp": "Slatted timber wall panelling",
    "abj-storage-t-pantry.webp": "Pantry cupboard with open shelving", "abj-office-t-home.webp": "Fitted home office",
    "kc-shaker-s.webp": "Shaker-style cabinetry", "kc-inframe-s.webp": "In-frame cabinetry",
    "kc-kr-bar-s.webp": "Bar wall from the Kings Road kitchen", "kc-detail-s.webp": "Cabinet detail from our Peterborough workshop"}


def menu(nav):
    on = next((i for i, m in enumerate(MENU) if m[0] == nav), -1)
    items = "".join('<li><a href="%s" data-i="%d"%s style="transition-delay:%.2fs"><small>%02d</small>%s</a></li>'
                    % (h, i, ' class="on"' if i == on else "", .05 + i * .03, i + 1, t) for i, (h, t, _) in enumerate(MENU))
    imgs = "".join('<img src="%s" alt="%s" loading="lazy"%s>' % (im, MENU_ALT.get(im.rsplit('/', 1)[-1], t), ' class="on"' if i == max(on, 0) else "") for i, (_, t, im) in enumerate(MENU))
    return ('<div class="mm" id="kc-mm" role="dialog" aria-modal="true" aria-label="Menu">\n <div class="mm-l">\n'
            '  <div class="mm-t">' + LG % (LOGO, "") + '<button class="x" type="button"><span>Close</span><i></i></button></div>\n'
            '  <ol>' + items + '</ol>\n'
            '  <div class="mm-c"><a href="tel:+441733686767">01733 686767</a><a href="https://wa.me/447479219421">WhatsApp</a>'
            '<a href="mailto:info@abjkitchensandbedrooms.co.uk">Email</a><span>3 Brassey Close, Peterborough</span>'
            '<a class="bt" href="' + BOOK + '">Book a design visit</a></div>\n </div>\n'
            ' <div class="mm-r" aria-hidden="true">' + imgs + '<span>Designed, made &amp; fitted in Peterborough</span></div>\n</div>')


AREAS = [("/home-dev-r7m3k", "Peterborough")] + [("/fitted-kitchens-bedrooms-%s" % s, n) for s, n in [
    ("stamford-dev-h9t1", "Stamford"), ("oundle-dev-r4w9", "Oundle"), ("market-deeping-dev-n4o5", "Market Deeping"),
    ("bourne-dev-z1y3", "Bourne"), ("spalding-dev-w7k5", "Spalding"), ("oakham-dev-e4y6", "Oakham"),
    ("grantham-dev-d2m2", "Grantham"), ("huntingdon-dev-l6t5", "Huntingdon"), ("st-ives-dev-z1x8", "St Ives"),
    ("ely-dev-r2m2", "Ely"), ("wisbech-dev-r5u6", "Wisbech"), ("cambridge-dev-s4w2", "Cambridge")]]


def footer(ft):
    areas = "".join('<a href="%s">%s</a>' % a for a in AREAS)
    return '''<div class="ft" role="contentinfo" aria-label="Site footer"><div class="w">
 <div class="ft-top">
  <h2>''' + ft + '''</h2>
  <div class="acts"><a class="ph" href="tel:+441733686767">01733 686767</a><a class="bt" href="''' + BOOK + '''">Book a free design visit</a></div>
 </div>
 <div class="ft-g">
  <div class="ft-b">
   ''' + LG % (LOGO, ' loading="lazy"') + '''
   <p>Bespoke kitchens, wardrobes, bedrooms and media walls, designed, made and fitted from our Peterborough workshop.</p>
   <a class="rt" href="https://share.google/wadbR4QCwRXxM5fcm" target="_blank" rel="noopener">4.9 from 100+ Google reviews</a>
  </div>
  <div><h4>Rooms</h4><ul><li><a href="/bespoke-kitchens-dev-k7q2">Kitchens</a></li><li><a href="/bespoke-wardrobes-dev-w4m8">Wardrobes</a></li><li><a href="/bespoke-bedrooms-dev-b3n6">Bedrooms</a></li><li><a href="/media-walls-dev-m9t5">Media walls</a></li><li><a href="/luxury-worktops-dev-t6p3">Worktops</a></li><li><a href="/decors-dev-d8r4">Wall panelling</a></li></ul></div>
  <div><h4>More</h4><ul><li><a href="/bespoke-storage-dev-s2k7">Storage</a></li><li><a href="/bespoke-hallways-dev-h4j8">Hallways &amp; stairs</a></li><li><a href="/office-renovations-dev-o3f7">Home offices</a></li><li><a href="/bathroom-cabinetry-dev-c6v2">Bathroom cabinetry</a></li><li><a href="/upholstery-dev-u5h9">Upholstery</a></li><li><a href="/hmo-makeover-dev-m2x5">HMO fit-outs</a></li></ul></div>
  <div><h4>ABJ</h4><ul><li><a href="/about-abj-dev-a5b9">About us</a></li><li><a href="/gallery-dev-g7l3">Gallery</a></li><li><a href="/case-study-kings-road-kitchen-peterborough-dev-c3k8">Projects</a></li><li><a href="/offers-dev-o8f2">Offers</a></li><li><a href="/flexible-finance-dev-f3n7">Finance</a></li><li><a href="/faq-abj-dev-q4z6">FAQs</a></li><li><a href="/abjfeeds-dev-b2f8">Guides</a></li></ul></div>
  <div class="ft-v"><h4>Visit</h4><address>Showroom &amp; workshop<br>3 Brassey Close<br>Peterborough PE1 2AZ<br><a href="tel:+441733686767">01733 686767</a><br><a href="https://wa.me/447479219421">WhatsApp 07479 219421</a><br><a href="mailto:info@abjkitchensandbedrooms.co.uk">Email us</a></address><a class="lnk" href="https://www.google.com/maps/search/?api=1&amp;query=ABJ+Kitchens+%26+Bedrooms+3+Brassey+Close+Peterborough+PE1+2AZ" target="_blank" rel="noopener">Get directions</a></div>
 </div>
 <div class="ft-ar" style="padding-bottom:36px"><h4 style="font:500 10.5px/1.4 var(--sans);letter-spacing:.3em;text-transform:uppercase;color:var(--go);margin-bottom:16px">Areas we cover</h4><div class="ft-a">''' + areas + '''</div></div>
 <div class="ft-s"><a href="https://www.instagram.com/abjkitchensbedrooms/" target="_blank" rel="noopener">Instagram</a><a href="https://www.facebook.com/ABJKitchensBedrooms" target="_blank" rel="noopener">Facebook</a><a href="https://www.tiktok.com/@abjkitchenandbedroomltd" target="_blank" rel="noopener">TikTok</a><a href="https://www.youtube.com/@abjkitchensandbedrooms" target="_blank" rel="noopener">YouTube</a><a href="https://www.linkedin.com/company/abj-kitchens-and-bedrooms/" target="_blank" rel="noopener">LinkedIn</a><a href="https://x.com/_ABJKitchens" target="_blank" rel="noopener">X</a></div>
 <div class="ft-l"><span>&copy; 2026 AB Joinery Kitchens and Bedrooms Ltd &middot; Registered in England and Wales, company no. 11100736 &middot; 3 Brassey Close, Peterborough PE1 2AZ<br>Part of the ABJ group: <a href="https://abjaccessories.co.uk/" target="_blank" rel="noopener">ABJ Accessories</a> &middot; <a href="https://www.cutandedgexpress.com/" target="_blank" rel="noopener">Cut &amp; Edge Express</a></span><nav aria-label="Legal"><a href="/payment-terms-abj-dev-h4e2">Payment terms</a><a href="/terms-and-conditions-dev-v9c7">Terms &amp; conditions</a><a href="/privacypolicy-dev-b1c4">Privacy policy</a><a href="#cookie-settings">Cookie settings</a></nav></div>
</div></div>'''


FTJS = '<script>(function(){var r=document.getElementById("kc");if(!r)return;r.querySelectorAll(".ft .acc>h4").forEach(function(h){if(h.getAttribute("data-acc"))return;h.setAttribute("data-acc","1");h.setAttribute("role","button");h.setAttribute("tabindex","0");h.setAttribute("aria-expanded","false");var t=function(){var o=h.parentNode.classList.toggle("op");h.setAttribute("aria-expanded",o?"true":"false")};h.addEventListener("click",t);h.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();t()}})})})();</script>'


def ft_upgrade(html):
    """Folding footer on phones: mark the link columns, Visit and Areas as accordions and add the tap handler.
       Same replacements as abjFooterUpgrade() in tilda_golive.js, so editor-filled pages get it at go-live."""
    if 'class="acc"' in html: return html
    for a, b in [('<div><h4>Rooms</h4>', '<div class="acc"><h4>Rooms</h4>'), ('<div><h4>More</h4>', '<div class="acc"><h4>More</h4>'),
                 ('<div><h4>ABJ</h4>', '<div class="acc"><h4>ABJ</h4>'), ('<div class="ft-v"><h4>Visit</h4>', '<div class="ft-v acc"><h4>Visit</h4>'),
                 ('<div class="ft-ar" style="padding-bottom:36px">', '<div class="ft-ar acc">')]:
        assert html.count(a) == 1, a
        html = html.replace(a, b)
    assert html.count('<div class="ft-l">') == 1
    return html.replace('<div class="ft-l">', FTJS + '\n <div class="ft-l">')

CK = ('<div class="ck" id="kc-ck" role="dialog" aria-live="polite" aria-label="Cookie consent"><p><b>Our use of cookies</b>We use cookies to analyse traffic and improve your visit. Analytics only load after you accept. <a href="/privacypolicy-dev-b1c4">Privacy policy</a></p><div><button type="button" class="ck-n">Decline</button><button type="button" class="ck-y">Accept</button></div></div>\n'
      '<nav class="mbar" id="kc-mbar" aria-label="Quick contact"><a href="tel:+441733686767">Call</a><a href="https://wa.me/447479219421">WhatsApp</a><a class="b" href="' + BOOK + '">Book a visit</a></nav>')


JS = r'''<script>
(function(){var R=document.getElementById('kc');if(!R)return;R.classList.add('js');
var hd=document.getElementById('kc-hd'),mm=document.getElementById('kc-mm'),ly=0;
var hs=function(){var y=window.scrollY;hd.classList.toggle('s',y>40);hd.classList.toggle('up',y>ly&&y>window.innerHeight*.6&&!mm.classList.contains('o'));ly=y};
var mb=R.querySelector('.mb'),mi=mm.querySelectorAll('.mm-r img'),ma=mm.querySelectorAll('ol a');
var openM=function(){mm.classList.add('o');mb.setAttribute('aria-expanded','true');document.documentElement.style.overflow='hidden';mi.forEach(function(i){i.loading='eager'})};
var closeM=function(){mm.classList.remove('o');mb.setAttribute('aria-expanded','false');document.documentElement.style.overflow=''};
mb.addEventListener('click',openM);mm.querySelector('.x').addEventListener('click',closeM);addEventListener('keydown',function(e){if(e.key==='Escape')closeM()});
ma.forEach(function(a){a.addEventListener('mouseenter',function(){var i=+a.dataset.i;ma.forEach(function(x){x.classList.toggle('on',x===a)});mi.forEach(function(m,j){m.classList.toggle('on',j===i)})})});
hs();addEventListener('scroll',hs,{passive:true});
/* hero clips crossfade, caption follows the clip */
var V=R.querySelectorAll('.hero video'),cap=R.querySelector('.hero .cap'),cur=0;
V.forEach(function(v){v.addEventListener('ended',function(){if(V.length<2){v.currentTime=0;v.play();return}var n=V[(cur+1)%V.length];n.preload='auto';n.currentTime=0;var p=n.play();var sw=function(){n.classList.add('on');v.classList.remove('on');cur=(cur+1)%V.length;if(cap&&n.dataset.cap)cap.textContent=n.dataset.cap};p&&p.then?p.then(sw,function(){v.currentTime=0;v.play()}):sw()})});
setTimeout(function(){V[1]&&(V[1].preload='auto')},4000);
/* make sure the hero video plays on phones: set muted in script too (iOS), retry on load, on the first touch or scroll, and when the tab comes back */
var kick=function(){V.forEach(function(v){if(!v.classList.contains('on')||!v.paused)return;v.muted=true;v.defaultMuted=true;v.setAttribute('muted','');v.setAttribute('playsinline','');try{var p=v.play();p&&p.catch&&p.catch(function(){})}catch(e){}})};
kick();document.addEventListener('DOMContentLoaded',kick);addEventListener('load',kick);addEventListener('pageshow',kick);
['touchstart','touchend','pointerdown','scroll','click','keydown'].forEach(function(t){addEventListener(t,kick,{passive:true,capture:true})});
document.addEventListener('visibilitychange',function(){if(!document.hidden)kick()});
/* montage: phone poster, and the caption follows the room on screen */
var mob=window.matchMedia&&matchMedia('(max-width:760px)').matches;
V.forEach(function(v){if(mob&&v.dataset.mp)v.poster=v.dataset.mp;if(!v.dataset.caps)return;var cs;try{cs=JSON.parse(v.dataset.caps)}catch(e){return}var last=0;v.addEventListener('timeupdate',function(){var t=v.currentTime,i=0;for(var k=0;k<cs.length;k++)if(t>=cs[k][0])i=k;if(i!==last&&cap){last=i;cap.style.opacity=0;setTimeout(function(){cap.innerHTML=cs[i][1];cap.style.opacity=1},250)}})});
/* rail arrows */
R.querySelectorAll('.arw').forEach(function(w){var rail=document.getElementById(w.dataset.for);if(!rail)return;w.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){var c=rail.querySelector('.card');rail.scrollBy({left:(c?c.offsetWidth+24:400)*2*(+b.dataset.d),behavior:'smooth'})})})});
/* cookie consent: same storage key as the existing site, so a choice made on any page carries over */
var CKK='abj_cookie_consent',ck=document.getElementById('kc-ck');var gs=function(k){try{return localStorage.getItem(k)}catch(e){return null}};var ss=function(k,v){try{localStorage.setItem(k,v)}catch(e){}};
var cons=function(){var v=gs(CKK);if(!v&&gs('abj_cookie')==='1'){v='accepted';ss(CKK,v)}return v};var ok=function(){return cons()==='accepted'};
var ev=function(n,p){if(!ok())return;try{typeof gtag==='function'&&gtag('event',n,p||{})}catch(e){}try{window.dataLayer&&dataLayer.push(Object.assign({event:n},p||{}))}catch(e){}};
var showC=function(){ck&&ck.classList.add('o')},hideC=function(){ck&&ck.classList.remove('o')};
if(ck){var c0=cons();if(c0!=='accepted'&&c0!=='declined')setTimeout(showC,2500);ck.querySelector('.ck-y').addEventListener('click',function(){ss(CKK,'accepted');hideC();ev('cookie_accept',{event_category:'Consent'})});ck.querySelector('.ck-n').addEventListener('click',function(){ss(CKK,'declined');hideC()})}
R.querySelectorAll('a[href="#cookie-settings"]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();showC()})});
R.querySelectorAll('a[href^="tel:"]').forEach(function(a){a.addEventListener('click',function(){ev('phone_call',{event_category:'Contact',event_label:a.href.replace('tel:',''),value:1})})});
R.querySelectorAll('a[href*="wa.me"]').forEach(function(a){a.addEventListener('click',function(){ev('whatsapp_click',{event_category:'Contact',event_label:'WhatsApp'})})});
/* phone action bar appears once the hero has scrolled away */
var mbar=document.getElementById('kc-mbar'),hero=R.querySelector('.hero');var mb2=function(){mbar&&mbar.classList.toggle('o',window.scrollY>(hero?hero.offsetHeight*.7:400))};mb2();addEventListener('scroll',mb2,{passive:true});
/* undo what the old site-wide head scripts add to this page */
var cln=function(){document.documentElement.classList.remove('abjm','abj-dock-hide','kit');R.querySelectorAll('.abjm-hide').forEach(function(e){e.classList.remove('abjm-hide')})};cln();document.addEventListener('DOMContentLoaded',cln);addEventListener('load',cln);setTimeout(cln,1200);setTimeout(cln,3000);
/* gentle reveal */
if('IntersectionObserver'in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});R.querySelectorAll('.rv').forEach(function(el){io.observe(el)})}else{R.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')})}
})();
</script>'''

HEAD = '''<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">'''


GUARD = ('<script>/* opt this page out of the old site-wide mobile kit and menu scripts in the Tilda head */'
         '(function(){var d=document.documentElement;d.setAttribute("data-abjm-native","abjnew");d.classList.add("abjnew")})();</script>')


def build(slug):
    src = (HERE / "pages" / (slug + ".html")).read_text()
    m = re.match(r"<!--META (\{.*?\}) -->\n", src)
    meta = json.loads(m.group(1))
    body = src[m.end():].replace("{TILE}", TILE).replace("{KC}", KC).replace("{BOOK}", BOOK)
    css = (HERE / "theme.css").read_text()
    out = "\n".join([
        "<!-- ABJ %s (DEV, new standard) - one T123 block. Generated by web/concept/build.py from pages/%s.html; edit the source, not this file. -->" % (meta.get("title", slug), slug),
        GUARD, HEAD, "<style>", css.strip(), "</style>", "", '<div id="kc">', header(meta["nav"]), menu(meta["nav"]), "",
        "<main>", body.strip(), "</main>", ft_upgrade(footer(meta["ft"])), CK, "</div>", "", JS, ""])
    (HERE / "out" / (slug + ".html")).write_text(out)
    return slug, len(out.encode())


if __name__ == "__main__":
    names = sys.argv[1:] or sorted(p.stem for p in (HERE / "pages").glob("*.html"))
    for n in names:
        print("%s: %d bytes" % build(n))
