#!/usr/bin/env python3
"""ABJ brochure builder: python3 build.py <spec.json> <out.pdf>
Env: ABJ_IMG (folder of source photos), ABJ_FONTS (@fontsource folder), ABJ_LOGO (roundel png).
Renders A4 pages with Playwright (Chromium) and writes a PDF with clickable links."""
import json, os, sys, io, base64, html
from PIL import Image

IMG = os.environ.get('ABJ_IMG', 'img')
FONTS = os.environ['ABJ_FONTS']
LOGO = os.environ['ABJ_LOGO']
SITE = 'https://abjkitchensandbedrooms.co.uk'

def b64(path, mime):
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(path, 'rb').read()).decode())

_cache = {}
def img(name, w=1500, q=80):
    key = (name, w)
    if key not in _cache:
        im = Image.open(os.path.join(IMG, name + '.webp')).convert('RGB')
        if im.width > w:
            im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        buf = io.BytesIO(); im.save(buf, 'JPEG', quality=q, optimize=True, progressive=True)
        _cache[key] = 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()
    return _cache[key]

def face(fam, file, weight, style='normal'):
    return "@font-face{font-family:'%s';font-weight:%d;font-style:%s;src:url(%s) format('woff2')}" % (
        fam, weight, style, b64(os.path.join(FONTS, file), 'font/woff2'))

E = html.escape

CSS = '''
@page{size:210mm 297mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font:400 11.8pt/1.62 'DM Sans',sans-serif;color:#1b2321;background:#fff}
:root{--g:#0E1B1A;--g2:#16302C;--lin:#F3EEE6;--lin2:#EAE3D7;--go:#C9A96E;--gd:#8E6F3A;--mut:#5d6663;--hair:rgba(27,35,33,.16)}
.pg{position:relative;width:210mm;height:297mm;overflow:hidden;page-break-after:always;background:var(--lin)}
.pg:last-child{page-break-after:auto}
.pad{padding:19mm 18mm 20mm}
h1,h2,h3{font-family:'Cormorant Garamond',serif;font-weight:400;line-height:1.08;letter-spacing:-.005em}
h2{font-size:31pt}h3{font-size:19.2pt}
em{font-style:italic;color:var(--gd)}
.dk em{color:#9FD3AE}
.k{display:flex;align-items:center;gap:4mm;font:600 8.7pt/1.3 'DM Sans';letter-spacing:.32em;text-transform:uppercase;color:var(--gd);margin-bottom:6mm}
.k:before{content:"";width:11mm;height:.3mm;background:currentColor}
.dk{background:var(--g);color:var(--lin)}.dk .k{color:var(--go)}.dk p{color:rgba(243,238,230,.8)}
p{color:var(--mut)}p+p{margin-top:3.2mm}
.lead{font:300 17.5pt/1.36 'Cormorant Garamond',serif;color:#1b2321}
.dk .lead{color:var(--lin)}
img{display:block;width:100%;height:100%;object-fit:cover}
.fo{position:absolute;left:18mm;right:18mm;bottom:9mm;display:flex;justify-content:space-between;font:500 7.9pt/1 'DM Sans';letter-spacing:.24em;text-transform:uppercase;color:rgba(27,35,33,.5)}
.dk .fo{color:rgba(243,238,230,.5)}
a{color:inherit;text-decoration:none}
.cap{font:500 7.9pt/1.3 'DM Sans';letter-spacing:.22em;text-transform:uppercase;color:var(--mut);margin-top:2.4mm}
/* cover */
.cv .ph{position:absolute;inset:0}
.cv .ph:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,14,13,.62) 0%,rgba(8,14,13,.08) 30%,rgba(8,14,13,.1) 48%,rgba(8,14,13,.9) 100%)}
.cv .top{position:absolute;left:18mm;right:18mm;top:16mm;display:flex;align-items:center;justify-content:space-between;color:#fff}
.lg{display:flex;align-items:center;gap:4mm}.lg img{width:15mm;height:15mm;border-radius:50%}
.lg b{display:block;font:400 19.2pt/1 'Cormorant Garamond',serif}.lg span{display:block;margin-top:1.2mm;font:500 7.7pt/1 'DM Sans';letter-spacing:.3em;text-transform:uppercase;opacity:.85}
.cv .ed{font:500 8.1pt/1.5 'DM Sans';letter-spacing:.28em;text-transform:uppercase;text-align:right;color:rgba(255,255,255,.85)}
.cv .bt{position:absolute;left:18mm;right:18mm;bottom:20mm;color:#fff}
.cv .k{color:#E3C994}
.cv h1{font-size:47pt;font-weight:300;max-width:160mm}
.cv h1 em{color:#9FD3AE}
.cv .sub{margin-top:7mm;max-width:118mm;font-size:12.3pt;color:rgba(255,255,255,.86)}
.cv .row{margin-top:10mm;padding-top:5mm;border-top:.3mm solid rgba(255,255,255,.3);display:flex;gap:11mm;font:500 8.1pt/1.5 'DM Sans';letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.82)}
.cv .row b{display:block;font:400 16.9pt/1.1 'Cormorant Garamond',serif;letter-spacing:0;text-transform:none;color:#fff;margin-bottom:1mm}
/* generic layouts */
.two{display:grid;grid-template-columns:1fr 1fr;gap:10mm}
.tiles{display:grid;grid-template-columns:repeat(3,1fr);border-top:.25mm solid var(--hair);border-left:.25mm solid var(--hair);margin-top:8mm}
.tiles div{padding:4.6mm 4.4mm 4.4mm;border-right:.25mm solid var(--hair);border-bottom:.25mm solid var(--hair);background:rgba(255,255,255,.4);font:500 7.7pt/1.45 'DM Sans';letter-spacing:.16em;text-transform:uppercase;color:var(--mut)}
.tiles b{display:block;font:400 19.2pt/1.05 'Cormorant Garamond',serif;letter-spacing:0;text-transform:none;color:#1b2321;margin-bottom:1.6mm}
.split{display:grid;grid-template-columns:84mm 1fr;height:100%}
.split.r{grid-template-columns:1fr 84mm}
.split .tx{padding:19mm 14mm 20mm 18mm;display:flex;flex-direction:column;justify-content:center}
.split.r .tx{padding:19mm 18mm 20mm 14mm}
.ul{list-style:none;margin-top:6mm}
.ul li{display:grid;grid-template-columns:9mm 1fr;padding:3.1mm 0;border-top:.25mm solid var(--hair);font-size:11.1pt;color:#1b2321}
.dk .ul li{border-color:rgba(243,238,230,.16);color:var(--lin)}
.ul li i{font:italic 400 12.2pt/1.5 'Cormorant Garamond',serif;color:var(--gd)}.dk .ul li i{color:var(--go)}
.ul li span{display:block;color:var(--mut);font-size:10.2pt;margin-top:.6mm}.dk .ul li span{color:rgba(243,238,230,.66)}
.hd2{display:flex;justify-content:space-between;align-items:flex-end;gap:12mm;margin-bottom:8mm}
.hd2 p{max-width:74mm;font-size:10.9pt}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm}
.g3 figure div,.g2 figure div{overflow:hidden}
.g3 h3,.g2 h3{margin-top:4mm;font-size:16.9pt}
.g3 p,.g2 p{font-size:10.2pt;margin-top:1.4mm;line-height:1.55}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:6mm}
.band{position:absolute;left:0;right:0;bottom:0}
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:7mm;position:relative;margin-top:9mm}
.steps:before{content:"";position:absolute;left:5.5mm;right:20mm;top:5.5mm;height:.3mm;background:rgba(201,169,110,.5)}
.steps div i{position:relative;display:flex;align-items:center;justify-content:center;width:11mm;height:11mm;border-radius:50%;background:var(--go);color:var(--g);font:italic 400 13.6pt/1 'Cormorant Garamond',serif}
.steps h3{margin:5mm 0 2mm;font-size:16.9pt}.steps p{font-size:10.2pt;line-height:1.55}
.pr{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:.25mm solid var(--hair);margin-top:7mm;background:rgba(255,255,255,.45)}
.pr div{padding:5.4mm 5mm}.pr div+div{border-left:.25mm solid var(--hair)}
.pr span{font:600 7.7pt/1.4 'DM Sans';letter-spacing:.24em;text-transform:uppercase;color:var(--gd)}
.pr b{display:block;font:400 21.5pt/1.1 'Cormorant Garamond',serif;margin:1.8mm 0 1.4mm}
.pr p{font-size:9.7pt;line-height:1.5}
.fine{font-size:8.2pt;line-height:1.5;color:var(--mut);margin-top:4mm}
.qs{display:grid;grid-template-columns:repeat(3,1fr);gap:7mm;margin-top:8mm}
.qs blockquote{padding-top:5mm;border-top:.3mm solid var(--go);font:300 14.7pt/1.34 'Cormorant Garamond',serif;color:var(--lin)}
.qs cite{display:block;margin-top:4mm;font:500 7.7pt/1.5 'DM Sans';font-style:normal;letter-spacing:.22em;text-transform:uppercase;color:rgba(243,238,230,.6)}
.st{color:var(--go);letter-spacing:.3em;font-size:9.3pt;margin-bottom:3mm}
.fq{margin-top:6mm}.fq div{padding:3.6mm 0;border-top:.25mm solid var(--hair)}
.fq h3{font-size:15.3pt;margin-bottom:1.4mm}.fq p{font-size:10.3pt;line-height:1.55}
.chips{display:flex;flex-wrap:wrap;gap:2.2mm;margin-top:5mm}
.chips span{padding:1.9mm 3.4mm;border:.25mm solid var(--hair);font:500 7.9pt/1 'DM Sans';letter-spacing:.2em;text-transform:uppercase;color:#1b2321}
.dk .chips span{border-color:rgba(243,238,230,.25);color:var(--lin)}
.btn{display:inline-block;white-space:nowrap;padding:4.4mm 5.6mm;background:var(--lin);color:var(--g);font:600 8.7pt/1 'DM Sans';letter-spacing:.24em;text-transform:uppercase}
.btn.o{background:none;color:var(--lin);box-shadow:inset 0 0 0 .3mm rgba(243,238,230,.5)}
.ct{display:grid;grid-template-columns:1fr 1fr;gap:0 12mm;margin-top:10mm}
.ct div{padding:4mm 0;border-top:.25mm solid rgba(243,238,230,.18)}
.ct span{display:block;font:600 7.7pt/1.4 'DM Sans';letter-spacing:.26em;text-transform:uppercase;color:var(--go);margin-bottom:1.2mm}
.ct b{font:400 15.8pt/1.25 'Cormorant Garamond',serif;color:var(--lin)}
'''

def page(inner, cls='', n=None, loc=''):
    fo = ''
    if n:
        fo = '<div class="fo"><span>ABJ Kitchens &amp; Bedrooms · %s</span><span>%02d</span></div>' % (E(loc), n)
    return '<section class="pg %s">%s%s</section>' % (cls, inner, fo)

def fig(name, h, cap=None, w=1100):
    c = '<p class="cap">%s</p>' % E(cap) if cap else ''
    return '<figure><div style="height:%smm"><img src="%s"></div>%s</figure>' % (h, img(name, w), c)

def build(s):
    L = s['place']; tag = s.get('edition', 'The %s brochure' % L)
    P = []
    # 1 cover
    P.append(page('''<div class="ph"><img src="%s" style="object-position:%s"></div>
<div class="top"><div class="lg"><img src="%s"><div><b>ABJ Kitchens</b><span>&amp; Bedrooms</span></div></div><div class="ed">%s<br>2026 / 27</div></div>
<div class="bt"><div class="k">%s</div><h1>%s</h1><p class="sub">%s</p>
<div class="row"><div><b>2,500+</b>Bespoke projects</div><div><b>4.9</b>On Google · 100+ reviews</div><div><b>12-month</b>Guarantee</div><div><b>Free</b>3D design visit</div></div></div>'''
        % (img(s['cover'], 1700, 82), s.get('cover_pos', '50% 50%'), b64(LOGO, 'image/png'), E(tag), E(s['cover_kick']), s['cover_title'], E(s['cover_sub'])), 'cv dk'))
    # 2 welcome
    P.append(page('''<div class="split"><div><img src="%s"></div><div class="tx"><div class="k">%s</div><h2>%s</h2>
<p class="lead" style="margin-top:7mm">%s</p><p style="margin-top:5mm">%s</p>
<div class="tiles" style="grid-template-columns:1fr 1fr">%s</div></div></div>'''
        % (img(s['welcome_img'], 1100), E(s['welcome_kick']), s['welcome_title'], E(s['welcome_lead']), E(s['welcome_body']),
           ''.join('<div><b>%s</b>%s</div>' % (E(a), E(b)) for a, b in s['facts'])), '', 2, L))
    # 3 local
    P.append(page('''<div class="pad"><div class="k">%s</div><div class="hd2"><h2>%s</h2><p>%s</p></div>
<div class="g3">%s</div>
<div class="two" style="margin-top:10mm;padding-top:8mm;border-top:.25mm solid rgba(243,238,230,.18)"><div><h3 style="color:#F3EEE6">%s</h3><p style="margin-top:3mm;font-size:10.9pt">%s</p></div>
<div><h3 style="color:#F3EEE6">Where we work</h3><p style="margin-top:3mm;font-size:10.9pt">%s</p><div class="chips">%s</div></div></div></div>'''
        % (E(s['local_kick']), s['local_title'], E(s['local_intro']),
           ''.join('<figure><div style="height:74mm"><img src="%s"></div><h3 style="color:#F3EEE6">%s</h3><p>%s</p></figure>' % (img(i, 800), E(t), E(p)) for i, t, p in s['local_cards']),
           E(s['local_note_title']), E(s['local_note']), E(s['area_text']), ''.join('<span>%s</span>' % E(v) for v in s['villages'])), 'dk', 3, L))
    # 4 kitchens
    P.append(page('''<div style="height:128mm"><img src="%s" style="object-position:50%% 60%%"></div>
<div class="pad" style="padding-top:12mm"><div class="k">Bespoke kitchens</div><div class="hd2"><h2>Kitchens made for<br>the way <em>you</em> live</h2><p>%s</p></div>
<div class="g3">%s</div></div>'''
        % (img('kc-handleless-l', 1700, 82), E(s['kitchen_text']),
           ''.join('<figure><div style="height:44mm"><img src="%s" style="object-position:%s"></div><h3>%s</h3><p>%s</p></figure>' % (img(i, 800), pos, E(t), E(p)) for i, pos, t, p in [
               ('kc-kr-light-l', '50% 70%', 'Handleless', 'Clean lines and integrated rails, made for open-plan living.'),
               ('kc-shaker-l', '50% 45%', 'Shaker', 'Timeless framed doors, painted in any colour from navy to sage.'),
               ('kc-inframe-l', '50% 40%', 'In-frame', 'Furniture-quality detailing for period and country homes.')])), '', 4, L))
    # 5 featured project
    P.append(page('''<div class="split r"><div class="tx"><div class="k">Featured project</div><h2>An open-plan kitchen, bar &amp; dining space</h2>
<p style="margin-top:6mm">A handleless light grey kitchen with a hob island, a dark bar wall with lit shelving and a dining table for ten, all designed around one long, bright room at King’s Road, Peterborough.</p>
<ul class="ul"><li><i>01</i><div>Induction hob island<span>With a pop-up downdraft extractor and an illuminated breakfast bar</span></div></li>
<li><i>02</i><div>Bar wall with lit shelving<span>Dark woodgrain units, made and fitted by our own team</span></div></li>
<li><i>03</i><div>Storage that disappears<span>Organised cutlery drawers and tall larder housings</span></div></li></ul>
<div class="g2" style="margin-top:8mm">%s%s</div></div><div><img src="%s"></div></div>'''
        % (fig('kc-kr-bar-l', 46, 'The bar wall', 700), fig('kc-kr-detail-l', 46, 'Lit breakfast bar', 700), img('kc-kr-island-l', 1100)), 'dk', 5, L))
    # 6 wardrobes
    P.append(page('''<div class="split"><div><img src="%s"></div><div class="tx"><div class="k">Fitted wardrobes</div><h2>Wardrobes that use <em>every</em> centimetre</h2>
<p style="margin-top:6mm">%s</p>
<ul class="ul"><li><i>01</i><div>Sliding wardrobes<span>Mirrored, glass or woodgrain doors on smooth, quiet runners</span></div></li>
<li><i>02</i><div>Hinged wardrobes<span>Full-height doors scribed to walls, ceilings and slopes</span></div></li>
<li><i>03</i><div>Walk-in wardrobes<span>Open hanging, drawers and shelving planned around what you own</span></div></li>
<li><i>04</i><div>Interiors to order<span>Pull-down rails, internal drawers, shoe racks and lighting</span></div></li></ul>
<div class="g2" style="margin-top:8mm">%s%s</div></div></div>'''
        % (img('abj-w-sliding-white', 1100), E(s['wardrobe_text']), fig('abj-w-walkin-oak', 40, 'Walk-in wardrobe', 700), fig('abj-wardrobes-t-interiors', 40, 'Internal drawers', 700)), '', 6, L))
    # 7 bedrooms + media walls
    P.append(page('''<div class="pad"><div class="k">Bedrooms &amp; media walls</div><div class="hd2"><h2>One room, designed<br>as a <em>whole</em></h2><p>%s</p></div>
<div class="g2">%s%s</div>
<div class="g3" style="margin-top:8mm">%s</div></div>'''
        % (E(s['bedroom_text']),
           '<figure><div style="height:92mm"><img src="%s"></div><h3>Fitted bedrooms</h3><p>Wardrobes, headboard walls, bedside units and dressing tables in one matching design.</p></figure>' % img('abj-b-white-oak', 1000),
           '<figure><div style="height:92mm"><img src="%s"></div><h3>Media walls</h3><p>Recessed screens, electric fires, hidden cables and lit shelving, built around your room.</p></figure>' % img('abj-mediawalls-t-fire', 1000),
           ''.join('<figure><div style="height:54mm"><img src="%s"></div><h3>%s</h3><p>%s</p></figure>' % (img(i, 700), E(t), E(p)) for i, t, p in [
               ('abj-b-study-nook', 'Home offices', 'Fitted desks and shelving for box rooms and alcoves.'),
               ('abj-storage-t-pantry', 'Storage', 'Under-stairs, alcove, pantry and utility storage.'),
               ('abj-mediawalls-t-minimal', 'Wall panelling', 'Slatted and fluted panels with built-in lighting.')])), '', 7, L))
    # 8 process + prices
    P.append(page('''<div class="pad dk" style="height:132mm"><div class="k">How it works</div><h2>From first visit to final fitting</h2>
<div class="steps">%s</div></div>
<div class="pad" style="padding-top:12mm"><div class="k">Guide prices</div><div class="hd2" style="margin-bottom:0"><h2>What to budget</h2><p>Every room is priced individually. After your free design visit you receive an itemised quote, so you can see exactly where the money goes.</p></div>
<div class="pr"><div><span>Compact kitchen</span><b>From around £2,500</b><p>Made in our workshop and fitted by our own team.</p></div>
<div><span>Medium kitchen</span><b>£7,000 to £9,500</b><p>A typical medium kitchen with quartz worktops.</p></div>
<div><span>Spread the cost</span><b>Interest-free finance</b><p>On projects over £6,000 with a 50%% deposit, subject to status.</p></div></div>
<p class="fine">Guide prices are from our own recent quotes; bigger rooms, islands, premium worktops and appliances add to them. AB Joinery Kitchens and Bedrooms Ltd t/a ABJ Kitchens and Bedrooms is an introducer appointed representative of Ideal Sales Solutions Ltd T/A Ideal4Finance. Ideal Sales Solutions is a credit broker and not a lender (FRN 703401). Finance is available subject to status. The rate offered is provisional and will depend upon personal circumstances, the loan amount and term.</p></div>'''
        % ''.join('<div><i>%02d</i><h3 style="color:#F3EEE6">%s</h3><p>%s</p></div>' % (i + 1, E(t), E(p)) for i, (t, p) in enumerate([
            ('Design visit', 'We measure your room and talk through how you live and what you need to store. Free and without obligation.'),
            ('3D design & quote', 'You see your room in 3D before anything is made, with a clear, itemised quotation.'),
            ('Made in Peterborough', 'Every piece is built to order in our own workshop, usually in four to six weeks.'),
            ('Fitted by our team', s['fit_text'])])), '', 8, L))
    # 9 reviews + local FAQ
    P.append(page('''<div class="pad dk" style="height:128mm"><div class="k">Reviews</div><h2>Rated 4.9 on Google, from 100+ reviews</h2>
<div class="qs">%s</div></div>
<div class="pad" style="padding-top:12mm"><div class="k">%s</div><h2>Your questions, answered</h2><div class="fq">%s</div></div>'''
        % (''.join('<div><div class="st">★★★★★</div><blockquote>“%s”</blockquote><cite>%s</cite></div>' % (E(q), E(c)) for q, c in [
            ('ABJ Kitchens and Bedrooms designed and fitted me a lovely kitchen with quality units and quartz worktop. Great attention to detail. The finished result is better than we could have imagined.', 'Google review · Kitchen'),
            ('I had my kitchen fitted in 2021 and now have had wardrobes for 3 rooms. Great prices and quality materials. From the drawings to completion all in 3 weeks.', 'Google review · Wardrobes'),
            ('We cannot recommend ABJ Joinery highly enough. From our very first enquiry through to the completed installation of our media wall, every member of the team provided a truly first-class service.', 'Google review · Media wall')]),
           E(s['faq_kick']), ''.join('<div><h3>%s</h3><p>%s</p></div>' % (E(q), E(a)) for q, a in s['faqs'])), '', 9, L))
    # 10 back cover
    P.append(page('''<div style="height:112mm;position:relative"><img src="%s" style="object-position:50%% 62%%"><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,27,26,0) 55%%,#0E1B1A 100%%)"></div></div>
<div class="pad" style="padding-top:6mm"><div class="k">Free design visit</div><h2 style="font-size:38pt;font-weight:300">Start with a conversation<br>at <em>home</em></h2>
<p style="margin-top:6mm;max-width:120mm">%s</p>
<p style="margin-top:8mm;display:flex;gap:3mm"><a class="btn" href="%s/bookingform">Book a design visit</a><a class="btn o" href="tel:+441733686767">Call 01733 686767</a><a class="btn o" href="https://wa.me/447479219421">WhatsApp photos</a></p>
<div class="ct"><div><span>Showroom &amp; workshop</span><b>3 Brassey Close, Peterborough, PE1 2AZ</b></div>
<div><span>Opening hours</span><b>Mon to Fri 8am to 6pm · Sat 10am to 2pm</b></div>
<div><span>Email</span><b><a href="mailto:info@abjkitchensandbedrooms.co.uk">info@abjkitchensandbedrooms.co.uk</a></b></div>
<div><span>Online</span><b><a href="%s%s">abjkitchensandbedrooms.co.uk</a></b></div></div></div>'''
        % (img('kc-book-l', 1700, 82), E(s['cta_text']), SITE, SITE, s.get('page', '/')), 'dk'))
    faces = [face('Cormorant Garamond', 'cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff2', 300),
             face('Cormorant Garamond', 'cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2', 400),
             face('Cormorant Garamond', 'cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2', 400, 'italic'),
             face('Cormorant Garamond', 'cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff2', 300, 'italic'),
             face('DM Sans', 'dm-sans/files/dm-sans-latin-400-normal.woff2', 400),
             face('DM Sans', 'dm-sans/files/dm-sans-latin-500-normal.woff2', 500),
             face('DM Sans', 'dm-sans/files/dm-sans-latin-600-normal.woff2', 600)]
    return '<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>%s</title><style>%s%s</style></head><body>%s</body></html>' % (
        E(s['pdf_title']), ''.join(faces), CSS, ''.join(P))

if __name__ == '__main__':
    spec = json.load(open(sys.argv[1])); out = sys.argv[2]
    htmlp = out.replace('.pdf', '.html'); open(htmlp, 'w').write(build(spec))
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page()
        pg.goto('file://' + os.path.abspath(htmlp)); pg.wait_for_timeout(800)
        pg.pdf(path=out, width='210mm', height='297mm', print_background=True, prefer_css_page_size=True)
        b.close()
    os.remove(htmlp)
    print(out, round(os.path.getsize(out) / 1e6, 2), 'MB')
