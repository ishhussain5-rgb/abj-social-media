#!/usr/bin/env python3
"""ABJ brochure builder (A4 PDF with clickable links, rendered with Playwright Chromium).

  python3 build.py town <slug> <out.pdf>     one location brochure (slug as in data/towns*.json)
  python3 make_all.py <outdir>               every brochure and catalogue, with checks

Env: ABJ_IMG (folder of source photos), ABJ_FONTS (@fontsource folder), ABJ_LOGO (roundel png).
Photos are cropped to their slot and saved as JPEG (about 178 dpi), so each PDF stays near 1.5 MB.
A photo (or another crop of the same shot) may only be used once per brochure: build() fails otherwise.
"""
import json, os, re, sys, io, base64, html, glob
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.environ.get('ABJ_IMG', 'img')
FONTS = os.environ.get('ABJ_FONTS', '')
LOGO = os.environ.get('ABJ_LOGO', '')
SITE = 'https://abjkitchensandbedrooms.co.uk'
E = html.escape

# different files that show the same shot: count as one photo
SAME = [{'abj-b-fluted-cashmere', 'abj-b-fluted-niche', 'abj-home-bedroom-panel'}, {'abj-b-fluted-sage', 'abj-bedrooms-tile-luxury'},
        {'abj-b-slatted-dark', 'abj-bedrooms-tile-contemporary'}, {'abj-kitchens-t-handleless', 'kc-book-l'},
        {'abj-mediawalls-t-storage', 'abj-st-living-alcove'}, {'abj-b-slatted-shelves', 'abj-dc-slat-shelves'},
        {'abj-b-study-nook', 'abj-of-desk-nook'}, {'kc-kr-detail-l', 'abj-st-lit-shelf'}, {'abj-w-sliding-mirror', 'abj-w-sliding-study'},
        {'abj-kitchens-t-inframe', 'kc-inframe-l'}, {'abj-kitchens-t-shaker', 'kc-shaker-l'}]
USED = []

def b64(path, mime):
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(path, 'rb').read()).decode())

def pic(name, wmm, hmm, pos='50% 50%', q=77, ppm=7.0):
    """Photo cropped to a wmm x hmm slot (object-position semantics), as a JPEG data URI."""
    key = name
    for g in SAME:
        if name in g: key = sorted(g)[0]
    USED.append(key)
    f = [p for p in (os.path.join(IMG, name + x) for x in ('.webp', '.jpg', '.png')) if os.path.exists(p)]
    if not f: raise SystemExit('missing photo: ' + name)
    im = Image.open(f[0]).convert('RGB')
    px, py = [float(v.strip('%')) / 100 for v in pos.split()]
    a = wmm / hmm
    if im.width / im.height > a:
        cw = round(im.height * a); x = round((im.width - cw) * px); im = im.crop((x, 0, x + cw, im.height))
    else:
        ch = round(im.width / a); y = round((im.height - ch) * py); im = im.crop((0, y, im.width, y + ch))
    tw = round(wmm * ppm)
    if im.width > tw: im = im.resize((tw, round(tw / a)), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'JPEG', quality=q, optimize=True, progressive=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()

def face(fam, file, weight, style='normal'):
    return "@font-face{font-family:'%s';font-weight:%d;font-style:%s;src:url(%s) format('woff2')}" % (
        fam, weight, style, b64(os.path.join(FONTS, file), 'font/woff2'))

# Guide "from" prices. Kitchens and media walls: ABJ's own published figures. The rest: UK market averages
# (Which? Aug 2026, Checkatrade, Hammonds price guide), to be confirmed by ABJ.
PRICES = [
    ('Kitchens', 'From around £2,500', 'Compact kitchen. Typical medium kitchen with quartz: £7,000 to £9,500.'),
    ('Fitted wardrobes', 'From around £1,500', 'Typical three-door fitted wardrobe: around £2,900.'),
    ('Fitted bedrooms', 'From around £3,000', 'Wardrobes and bedside units for a small room.'),
    ('Media walls', 'From around £1,000', 'TV unit with shelves. Wall-to-wall designs: £3,200 to £4,500.'),
    ('Storage', 'From around £1,000', 'Under-stairs storage. Alcove units: around £1,900 to £2,800.'),
    ('Home offices', 'Priced at your visit', 'Fitted desks and shelving, quoted after a free design visit.'),
]
FINE = ('AB Joinery Kitchens and Bedrooms Ltd t/a ABJ Kitchens and Bedrooms is an introducer appointed representative of Ideal Sales Solutions Ltd '
        'T/A Ideal4Finance. Ideal Sales Solutions is a credit broker and not a lender (FRN 703401). Finance is available subject to status. '
        'The rate offered is provisional and will depend upon personal circumstances, the loan amount and term.')
# word for word from the website (Google reviews); no names
REVIEWS = {
    'kitchen': ('ABJ Kitchens and Bedrooms designed and fitted me a lovely kitchen with quality units and quartz worktop. Great attention to detail. The finished result is better than we could have imagined.', 'Google review · Kitchen'),
    'wardrobes': ('I had my kitchen fitted in 2021 and now have had wardrobes for 3 rooms. Great prices and quality materials. From the drawings to completion all in 3 weeks.', 'Google review · Wardrobes'),
    'media': ('We cannot recommend ABJ Joinery highly enough. From our very first enquiry through to the completed installation of our media wall, every member of the team provided a truly first-class service.', 'Google review · Media wall'),
}

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
.dk{background:var(--g);color:var(--lin)}.dk .k{color:var(--go)}.dk p{color:rgba(243,238,230,.8)}.dk h3{color:var(--lin)}
p{color:var(--mut)}p+p{margin-top:3.2mm}
.lead{font:300 17.5pt/1.36 'Cormorant Garamond',serif;color:#1b2321}
.dk .lead{color:var(--lin)}
img{display:block;width:100%;height:100%;object-fit:cover}
.fo{position:absolute;left:18mm;right:18mm;bottom:9mm;display:flex;justify-content:space-between;font:500 7.9pt/1 'DM Sans';letter-spacing:.24em;text-transform:uppercase;white-space:nowrap;color:rgba(27,35,33,.5)}
.dk .fo{color:rgba(243,238,230,.5)}
.sl .fo{left:102mm}.sr .fo{right:98mm}.sl .fb,.sr .fb{display:none}
a{color:inherit;text-decoration:none}
.cap{font:500 7.9pt/1.3 'DM Sans';letter-spacing:.22em;text-transform:uppercase;color:var(--mut);margin-top:2.4mm}
.dk .cap{color:rgba(243,238,230,.62)}
/* cover */
.cv .ph{position:absolute;inset:0}
.cv .ph:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,14,13,.62) 0%,rgba(8,14,13,.08) 28%,rgba(8,14,13,.3) 50%,rgba(8,14,13,.92) 100%)}
.cv .top{position:absolute;left:18mm;right:18mm;top:16mm;display:flex;align-items:center;justify-content:space-between;color:#fff}
.lg{display:flex;align-items:center;gap:4mm}.lg img{width:15mm;height:15mm;border-radius:50%}
.lg b{display:block;font:400 19.2pt/1 'Cormorant Garamond',serif}.lg span{display:block;margin-top:1.2mm;font:500 7.7pt/1 'DM Sans';letter-spacing:.3em;text-transform:uppercase;opacity:.85}
.cv .ed{font:500 8.1pt/1.5 'DM Sans';letter-spacing:.28em;text-transform:uppercase;text-align:right;color:rgba(255,255,255,.85)}
.cv .bt{position:absolute;left:18mm;right:18mm;bottom:20mm;color:#fff;text-shadow:0 .3mm 4mm rgba(0,0,0,.5)}
.cv .k{color:#E3C994}
.cv h1{font-size:47pt;font-weight:300;max-width:164mm}
.cv h1 em{color:#9FD3AE}
.cv .sub{margin-top:7mm;max-width:124mm;font-size:12.3pt;color:rgba(255,255,255,.86)}
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
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:5mm}
.g3 figure div,.g2 figure div,.g4 figure div{overflow:hidden}
.g3 h3,.g2 h3,.g4 h3{margin-top:4mm;font-size:16.9pt}
.g3 p,.g2 p,.g4 p{font-size:10.2pt;margin-top:1.4mm;line-height:1.55}
.g4 h3{font-size:15pt}.g4 p{font-size:9.6pt}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:6mm}
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:7mm;position:relative;margin-top:9mm}
.steps:before{content:"";position:absolute;left:5.5mm;right:20mm;top:5.5mm;height:.3mm;background:rgba(201,169,110,.5)}
.steps div i{position:relative;display:flex;align-items:center;justify-content:center;width:11mm;height:11mm;border-radius:50%;background:var(--go);color:var(--g);font:italic 400 13.6pt/1 'Cormorant Garamond',serif}
.steps h3{margin:5mm 0 2mm;font-size:16.9pt}.steps p{font-size:10.2pt;line-height:1.55}
.pr{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:.25mm solid var(--hair);border-left:.25mm solid var(--hair);margin-top:6mm;background:rgba(255,255,255,.45)}
.pr div{padding:3.6mm 4.4mm 3.4mm;border-right:.25mm solid var(--hair);border-bottom:.25mm solid var(--hair)}
.pr span{font:600 7.7pt/1.4 'DM Sans';letter-spacing:.24em;text-transform:uppercase;color:var(--gd)}
.pr b{display:block;font:400 17pt/1.1 'Cormorant Garamond',serif;margin:1.2mm 0 .8mm}
.pr p{font-size:8.3pt;line-height:1.4}
.tag{display:inline-block;margin-top:5mm;padding:2.2mm 4mm;border:.25mm solid var(--go);font:600 7.6pt/1 'DM Sans';letter-spacing:.2em;text-transform:uppercase;color:var(--gd)}
.dk .tag{color:var(--go)}
.fr{display:block;margin-top:1.4mm;font:600 7.4pt/1.3 'DM Sans';letter-spacing:.18em;text-transform:uppercase;color:var(--gd)}
.dk .fr{color:var(--go)}
.fine{font-size:8.2pt;line-height:1.5;color:var(--mut);margin-top:4mm}
.qs{display:grid;grid-template-columns:repeat(3,1fr);gap:7mm;margin-top:8mm}
.qs blockquote{padding-top:5mm;border-top:.3mm solid var(--go);font:300 14.7pt/1.34 'Cormorant Garamond',serif;color:var(--lin)}
.qs cite,.q1 cite{display:block;margin-top:4mm;font:500 7.7pt/1.5 'DM Sans';font-style:normal;letter-spacing:.22em;text-transform:uppercase;color:rgba(243,238,230,.6)}
.q1{margin-top:8mm;padding-top:6mm;border-top:.3mm solid var(--go);max-width:160mm}
.q1 blockquote{font:300 20.5pt/1.3 'Cormorant Garamond',serif;color:var(--lin)}
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
.ct b{font:400 13.4pt/1.25 'Cormorant Garamond',serif;color:var(--lin);white-space:nowrap}
'''

# ---------- page parts ----------
def page(inner, cls='', n=None, loc=''):
    fo = ''
    if n:
        fo = '<div class="fo"><span><span class="fb">ABJ Kitchens &amp; Bedrooms · </span>%s</span><span>%02d</span></div>' % (E(loc), n)
    return '<section class="pg %s">%s%s</section>' % (cls, inner, fo)

def fig(name, w, h, cap=None, pos='50% 50%'):
    c = '<p class="cap">%s</p>' % E(cap) if cap else ''
    return '<figure><div style="height:%smm"><img src="%s"></div>%s</figure>' % (h, pic(name, w, h, pos), c)

def ul(items):
    return '<ul class="ul">%s</ul>' % ''.join('<li><i>%02d</i><div>%s%s</div></li>' % (
        i + 1, E(t), '<span>%s</span>' % E(d) if d else '') for i, (t, d) in enumerate(items))

def tiles(facts, cols=2):
    return '<div class="tiles" style="grid-template-columns:repeat(%d,1fr)">%s</div>' % (
        cols, ''.join('<div><b>%s</b>%s</div>' % (E(a), E(b)) for a, b in facts))

COLW = {2: 84.0, 3: 54.67, 4: 39.75}
def cards(items, h, cols=3, style=''):
    """items: (photo, pos, title, text[, from])"""
    out = []
    for it in items:
        i, pos, t, p = it[:4]; fr = it[4] if len(it) > 4 else None
        out.append('<figure><div style="height:%smm"><img src="%s"></div><h3>%s</h3>%s%s</figure>' % (
            h, pic(i, COLW[cols], h, pos), E(t), '<span class="fr">%s</span>' % E(fr) if fr else '', '<p>%s</p>' % E(p) if p else ''))
    return '<div class="g%d"%s>%s</div>' % (cols, ' style="%s"' % style if style else '', ''.join(out))

def p_cover(photo, pos, edition, kick, title, sub, row=None):
    row = row or [('2,500+', 'Bespoke projects'), ('4.9', 'On Google · 100+ reviews'), ('12-month', 'Guarantee'), ('Free', '3D design visit')]
    return page('''<div class="ph"><img src="%s"></div>
<div class="top"><div class="lg"><img src="%s"><div><b>ABJ Kitchens</b><span>&amp; Bedrooms</span></div></div><div class="ed">%s<br>2026 / 27</div></div>
<div class="bt"><div class="k">%s</div><h1>%s</h1><p class="sub">%s</p>
<div class="row">%s</div></div>''' % (pic(photo, 210, 297, pos, q=80), b64(LOGO, 'image/png'), E(edition), E(kick), title, E(sub),
        ''.join('<div><b>%s</b>%s</div>' % (E(a), E(b)) for a, b in row)), 'cv dk')

def p_split(photo, pos, inner, n, loc, right=False, dark=False):
    im = '<div><img src="%s"></div>' % pic(photo, 84, 297, pos)
    tx = '<div class="tx">%s</div>' % inner
    return page('<div class="split%s">%s</div>' % (' r' if right else '', tx + im if right else im + tx), ('dk ' if dark else '') + ('sr' if right else 'sl'), n, loc)

def p_hero(photo, h, pos, inner, n, loc, dark=False):
    return page('<div style="height:%smm"><img src="%s"></div><div class="pad" style="padding-top:12mm">%s</div>' % (
        h, pic(photo, 210, h, pos, q=79), inner), 'dk' if dark else '', n, loc)

def head(kick, title, intro=None):
    if intro:
        return '<div class="k">%s</div><div class="hd2"><h2>%s</h2><p>%s</p></div>' % (E(kick), title, E(intro))
    return '<div class="k">%s</div><h2 style="margin-bottom:8mm">%s</h2>' % (E(kick), title)

def p_process(steps, prices, n, loc, intro=None, note=None, cols=3, band=118):
    intro = intro or 'Every room is priced individually. After your free design visit you receive an itemised quote, so you can see exactly where the money goes.'
    note = note or 'Guide prices are for made-to-measure furniture, fitted; larger rooms, premium finishes, worktops and appliances add to them.'
    return page('''<div class="pad dk" style="height:%dmm"><div class="k">How it works</div><h2>From first visit to final fitting</h2>
<div class="steps">%s</div></div>
<div class="pad" style="padding-top:12mm"><div class="k">Guide prices</div><div class="hd2" style="margin-bottom:0"><h2>What to budget</h2><p>%s</p></div>
<div class="pr" style="grid-template-columns:repeat(%d,1fr)">%s</div>
<p style="margin-top:4mm;font-size:9.6pt;color:#1b2321"><b style="font-weight:600">Interest-free finance</b> is available on projects over £6,000 with a 50%% deposit, subject to status.</p>
<p class="fine">%s %s</p></div>''' % (band,
        ''.join('<div><i>%02d</i><h3>%s</h3><p>%s</p></div>' % (i + 1, E(t), E(p)) for i, (t, p) in enumerate(steps)), E(intro), cols,
        ''.join('<div><span>%s</span><b>%s</b><p>%s</p></div>' % (E(a), E(b), E(c)) for a, b, c in prices), E(note), E(FINE)), '', n, loc)

def p_reviews(quotes, faq_kick, faqs, n, loc):
    if len(quotes) == 1:
        q = '<div class="q1"><div class="st">★★★★★</div><blockquote>“%s”</blockquote><cite>%s</cite></div>' % (E(quotes[0][0]), E(quotes[0][1]))
        hh = 124
    else:
        q = '<div class="qs">%s</div>' % ''.join('<div><div class="st">★★★★★</div><blockquote>“%s”</blockquote><cite>%s</cite></div>' % (E(a), E(b)) for a, b in quotes)
        hh = 148
    return page('''<div class="pad dk" style="height:%dmm"><div class="k">Reviews</div><h2>Rated 4.9 on Google, from 100+ reviews</h2>%s</div>
<div class="pad" style="padding-top:12mm"><div class="k">%s</div><h2>Your questions, answered</h2><div class="fq">%s</div></div>''' % (
        hh, q, E(faq_kick), ''.join('<div><h3>%s</h3><p>%s</p></div>' % (E(a), E(b)) for a, b in faqs)), '', n, loc)

def p_back(photo, pos, title, text, link, kick='Free design visit'):
    return page('''<div style="height:112mm;position:relative"><img src="%s"><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,27,26,0) 55%%,#0E1B1A 100%%)"></div></div>
<div class="pad" style="padding-top:6mm"><div class="k">%s</div><h2 style="font-size:38pt;font-weight:300">%s</h2>
<p style="margin-top:6mm;max-width:124mm">%s</p>
<p style="margin-top:8mm;display:flex;gap:3mm"><a class="btn" href="%s/bookingform">Book a design visit</a><a class="btn o" href="tel:+441733686767">Call 01733 686767</a><a class="btn o" href="https://wa.me/447479219421">WhatsApp photos</a></p>
<div class="ct"><div><span>Showroom &amp; workshop</span><b>3 Brassey Close, Peterborough, PE1 2AZ</b></div>
<div><span>Opening hours</span><b>Mon to Fri 8am to 6pm · Sat 10am to 2pm</b></div>
<div><span>Email</span><b><a href="mailto:info@abjkitchensandbedrooms.co.uk">info@abjkitchensandbedrooms.co.uk</a></b></div>
<div><span>Online</span><b><a href="%s%s">abjkitchensandbedrooms.co.uk</a></b></div></div></div>''' % (
        pic(photo, 210, 112, pos, q=79), E(kick), title, E(text), SITE, SITE, link), 'dk')

def document(title, pages):
    faces = [face('Cormorant Garamond', 'cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff2', 300),
             face('Cormorant Garamond', 'cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2', 400),
             face('Cormorant Garamond', 'cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2', 400, 'italic'),
             face('Cormorant Garamond', 'cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff2', 300, 'italic'),
             face('DM Sans', 'dm-sans/files/dm-sans-latin-400-normal.woff2', 400),
             face('DM Sans', 'dm-sans/files/dm-sans-latin-500-normal.woff2', 500),
             face('DM Sans', 'dm-sans/files/dm-sans-latin-600-normal.woff2', 600)]
    dup = sorted(set(u for u in USED if USED.count(u) > 1))
    if dup: raise SystemExit('photo used twice in "%s": %s' % (title, ', '.join(dup)))
    return '<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>%s</title><style>%s%s</style></head><body>%s</body></html>' % (
        E(title), ''.join(faces), CSS, ''.join(pages))

# ---------- location brochures ----------
STEPS = [('Design visit', 'We measure your room and talk through how you live and what you need to store. Free and without obligation.'),
         ('3D design & quote', 'You see your room in 3D before anything is made, with a clear, itemised quotation.'),
         ('Made in Peterborough', 'Every piece is built to order in our own workshop, usually in four to six weeks.')]
# cover, welcome photo, back-cover photo
COVERS = [('kc-kr-dining-l', '50% 50%', 'kc-shaker-l', '50% 50%', 'kc-book-l', '50% 62%'), ('kc-run-l', '50% 50%', 'kc-detail-l', '50% 50%', 'kc-book-l', '50% 62%'),
          ('kc-shaker-l', '50% 50%', 'kc-run-l', '40% 50%', 'kc-book-l', '50% 62%'), ('kc-book-l', '50% 50%', 'kc-detail-l', '50% 50%', 'kc-kr-dining-l', '50% 55%')]
# photos for the local page: one from each group per brochure
LOCAL_A = [('abj-kitchens-tile-traditional', '50% 40%', 'Kitchens with a place to sit', 'Banquette seating and a breakfast table planned into the cabinetry.'),
           ('abj-wt-island-dining', '50% 62%', 'Open-plan kitchens', 'Islands with seating that link the cooking and dining space.'),
           ('abj-home-montage-v-poster', '50% 45%', 'Kitchens with an island', 'Deep colours, pendant lighting and a long breakfast bar.')]
LOCAL_B = [('abj-bedrooms-t-slopes', '50% 45%', 'Loft rooms', 'Dressing tables and drawers built in under the slope of the roof.'),
           ('abj-wardrobes-t-fitted', '50% 50%', 'Sloping ceilings', 'Doors cut to follow the roofline, so no space is lost.'),
           ('abj-wardrobes-tile-walkin', '50% 55%', 'Dressing rooms', 'Open hanging, drawers and shelving around the whole room.')]
LOCAL_C = [('abj-st-us-white', '50% 50%', 'Under the stairs', 'Drawers and cupboards in space that usually goes unused.'),
           ('abj-hl-bench-mirror', '50% 50%', 'Hallways', 'A bench, a mirror and coat storage for the first room you walk into.'),
           ('abj-dc-lit-display', '50% 45%', 'Display cabinets', 'Glass doors and lit shelves for the things you want on show.'),
           ('abj-mediawalls-t-display', '50% 50%', 'Living rooms', 'Floating cabinets and shelving around the television.')]
DIST = {'oakham': ('25 miles', 'From our workshop'), 'cambridge': ('45 minutes', 'From our workshop'),
        'march-whittlesey-chatteris': ('From 6 miles', 'From our workshop'), 'peterborough': ('80-mile', 'Service radius')}
FILE = {'march-whittlesey-chatteris': 'abj-fenland-brochure', 'peterborough': 'abj-brochure'}

def towns():
    d = {}
    for f in sorted(glob.glob(os.path.join(HERE, 'data', 'towns*.json'))):
        d.update(json.load(open(f)))
    return d

def villages(t):
    if t.get('ar'): return list(t['ar'])
    m = re.search(r'design and fit in (.+?)\.', t['dp'])
    out = []
    for v in re.split(r', and | and |, ', m.group(1) if m else ''):
        v = v.strip()
        if not v or v.startswith('the villages'): continue
        v = re.sub(r'^across to ', '', v)
        out.append(v[0].upper() + v[1:])
    return out

def town_spec(slug, t, idx):
    pl = t['pl']; short = t.get('short', pl); gen = t.get('general')
    cv = COVERS[idx % 4]
    m = re.search(r'(?:around|about) (\d+) miles from', t['dp'])
    dist = DIST.get(slug) or ((m.group(1) + ' miles', 'From our workshop') if m else ('80-mile', 'Service radius'))
    first = ['March', 'Whittlesey', 'Chatteris'] if slug.startswith('march') else ([] if gen else [pl])
    s = {
        'place': 'Peterborough' if gen else short, 'file': FILE.get(slug, 'abj-%s-brochure' % slug),
        'page': '/' if gen else '/fitted-kitchens-bedrooms-' + slug,
        'pdf_title': 'ABJ Kitchens & Bedrooms: the brochure' if gen else 'ABJ Kitchens & Bedrooms: the %s brochure' % short,
        'edition': 'The ABJ brochure' if gen else 'The %s brochure' % short,
        'cover': cv[0], 'cover_pos': cv[1], 'welcome_img': cv[2], 'welcome_pos': cv[3], 'back': cv[4], 'back_pos': cv[5],
        'cover_kick': t.get('hk', '%s · made in Peterborough' % pl),
        'cover_title': 'Bespoke kitchens, wardrobes &amp; bedrooms, made in <em>Peterborough</em>' if gen else
                       'Bespoke kitchens, wardrobes &amp; bedrooms for <em>%s</em> homes' % E(short).replace(' ', '&nbsp;'),
        'cover_sub': t['hp'],
        'welcome_kick': 'Welcome',
        'welcome_title': 'Designed, made and fitted by <em>one</em> team' if gen else 'Made to measure for %s homes' % E(short).replace(' ', '&nbsp;'),
        'welcome_lead': t['big'],
        'welcome_body': 'Every kitchen, wardrobe and bedroom is made to your room’s exact sizes, so chimney breasts, sloping ceilings and awkward corners are no problem. We’re a Peterborough workshop, not a national chain: the same team designs your room, makes it at Brassey Close and fits it.',
        'facts': [('2,500+', 'Bespoke projects'), ('4.9', 'On Google · 100+ reviews'), ('12-month', 'Guarantee'), dist],
        'local_kick': 'About ABJ' if gen else 'Local know-how',
        'local_title': 'Made here, <em>not</em> ordered in' if gen else 'Planning a kitchen or wardrobe in %s' % E(t.get('in', short)).replace(' ', '&nbsp;'),
        'local_intro': 'Every room is measured, drawn in 3D and made to order, so the furniture fits the house rather than the other way round.',
        'local_cards': [LOCAL_A[idx % 3], LOCAL_B[(idx // 3 + idx) % 3], LOCAL_C[idx % 4]],
        'local_note_title': 'In-house, from start to finish' if gen else '%s homes' % short,
        'local_paras': t['kp'],
        'area_title': 'Where we work', 'area_text': t['dp'], 'villages': first + villages(t),
        'kitchen_text': 'Designed in 3D, made to the millimetre in our workshop and fitted by our own team, with quartz, granite, solid wood or laminate worktops.',
        'wardrobe_text': 'Made to measure from floor to ceiling and wall to wall, so there are no dusty gaps above, no wasted corners and no filler panels where a standard wardrobe would stop short.',
        'bedroom_text': 'Everything is designed in 3D first, so you can see the finished room before we make it.',
        'fit_text': 'Our own fitters install everything, usually in one to two weeks, and the same team is on hand if anything needs adjusting.',
        'faq_kick': 'Common questions' if gen else '%s questions' % short,
        'faqs': [tuple(x) for x in t['fq']] + [('Can I see your work before I book?', 'Yes. Our showroom and workshop are at 3 Brassey Close, Peterborough PE1 2AZ, open Monday to Friday 8am to 6pm and Saturday 10am to 2pm. Call 01733 686767 to arrange a time.')],
        'cta_text': 'Tell us about your room and we will arrange a visit to your %shome to measure, listen and talk through ideas. You will receive a 3D design and an itemised quote, with no pressure to go ahead.' % ('' if gen else short + ' '),
    }
    hand = os.path.join(HERE, 'specs', slug + '.json')
    if os.path.exists(hand): s.update(json.load(open(hand)))
    return s

def build(s):
    del USED[:]
    L = s['place']; P = []
    P.append(p_cover(s['cover'], s.get('cover_pos', '50% 50%'), s['edition'], s['cover_kick'], s['cover_title'], s['cover_sub']))
    P.append(p_split(s['welcome_img'], s.get('welcome_pos', '50% 50%'),
        '<div class="k">%s</div><h2>%s</h2><p class="lead" style="margin-top:7mm">%s</p><p style="margin-top:5mm">%s</p>%s' % (
            E(s['welcome_kick']), s['welcome_title'], E(s['welcome_lead']), E(s['welcome_body']), tiles(s['facts'])), 2, L))
    P.append(page('''<div class="pad">%s%s
<div class="two" style="margin-top:8mm;padding-top:7mm;border-top:.25mm solid rgba(243,238,230,.18)"><div><h3>%s</h3>%s</div>
<div><h3>%s</h3><p style="margin-top:3mm;font-size:10.6pt">%s</p><div class="chips">%s</div></div></div></div>''' % (
        head(s['local_kick'], s['local_title'], s['local_intro']), cards([tuple(c) for c in s['local_cards']], 62),
        E(s['local_note_title']), ''.join('<p style="margin-top:3mm;font-size:10.6pt">%s</p>' % E(p) for p in s['local_paras']),
        E(s.get('area_title', 'Where we work')), E(s['area_text']), ''.join('<span>%s</span>' % E(v) for v in s['villages'])), 'dk', 3, L))
    P.append(p_hero('kc-handleless-l', 128, '50% 60%', head('Bespoke kitchens', 'Kitchens made for<br>the way <em>you</em> live', s['kitchen_text']) + cards([
        ('kc-kr-light-l', '50% 70%', 'Handleless', 'Clean lines and integrated rails, made for open-plan living.'),
        ('abj-kitchens-tile-shaker', '50% 55%', 'Shaker', 'Timeless framed doors, painted in any colour from navy to sage.'),
        ('kc-inframe-l', '50% 40%', 'In-frame', 'Furniture-quality detailing for period and country homes.')], 44)
        + '<span class="tag">Kitchens from around £2,500</span>', 4, L))
    P.append(p_split('kc-kr-island-l', '50% 50%', '''<div class="k">Featured project</div><h2>An open-plan kitchen, bar &amp; dining space</h2>
<p style="margin-top:6mm">A handleless light grey kitchen with a hob island, a dark bar wall with lit shelving and a dining table for ten, all designed around one long, bright room at King’s Road, Peterborough.</p>%s
<div class="g2" style="margin-top:8mm">%s%s</div>''' % (ul([
        ('Induction hob island', 'With a pop-up downdraft extractor and an illuminated breakfast bar'),
        ('Bar wall with lit shelving', 'Dark woodgrain units, made and fitted by our own team'),
        ('Storage that disappears', 'Organised cutlery drawers and tall larder housings')]),
        fig('kc-kr-bar-l', 44, 46, 'The bar wall'), fig('kc-kr-detail-l', 44, 46, 'Lit breakfast bar')), 5, L, right=True, dark=True))
    P.append(p_split('abj-w-sliding-white', '50% 50%', '''<div class="k">Fitted wardrobes</div><h2>Wardrobes that use <em>every</em> centimetre</h2>
<p style="margin-top:6mm">%s</p><span class="tag" style="align-self:flex-start">Wardrobes from around £1,500</span>%s
<div class="g2" style="margin-top:8mm">%s%s</div>''' % (E(s['wardrobe_text']), ul([
        ('Sliding wardrobes', 'Mirrored, glass or woodgrain doors on smooth, quiet runners'),
        ('Hinged wardrobes', 'Full-height doors scribed to walls, ceilings and slopes'),
        ('Walk-in wardrobes', 'Open hanging, drawers and shelving planned around what you own'),
        ('Interiors to order', 'Pull-down rails, internal drawers, shoe racks and lighting')]),
        fig('abj-w-walkin-oak', 44, 40, 'Walk-in wardrobe'), fig('abj-wardrobes-t-interiors', 44, 40, 'Internal drawers')), 6, L))
    P.append(page('<div class="pad">%s%s%s</div>' % (
        head('Bedrooms & media walls', 'One room, designed<br>as a <em>whole</em>', s['bedroom_text']),
        cards([('abj-b-white-oak', '50% 50%', 'Fitted bedrooms', 'Wardrobes, headboard walls, bedside units and dressing tables in one matching design.', 'From around £3,000'),
               ('abj-mediawalls-t-fire', '50% 50%', 'Media walls', 'Recessed screens, electric fires, hidden cables and lit shelving, built around your room.', 'From around £1,000')], 92, 2),
        cards([('abj-b-study-nook', '50% 50%', 'Home offices', 'Fitted desks and shelving for box rooms and alcoves.'),
               ('abj-storage-t-pantry', '50% 50%', 'Storage', 'Under-stairs, alcove, pantry and utility storage.'),
               ('abj-mediawalls-t-minimal', '50% 50%', 'Wall panelling', 'Slatted and fluted panels with built-in lighting.')], 54, 3, 'margin-top:8mm')), '', 7, L))
    P.append(p_process(STEPS + [('Fitted by our team', s['fit_text'])], PRICES, 8, L, band=124))
    P.append(p_reviews([REVIEWS['kitchen'], REVIEWS['wardrobes'], REVIEWS['media']], s['faq_kick'], s['faqs'], 9, L))
    P.append(p_back(s.get('back', 'kc-book-l'), s.get('back_pos', '50% 62%'), 'Start with a conversation<br>at <em>home</em>', s['cta_text'], s.get('page', '/')))
    return document(s['pdf_title'], P)

# ---------- render + checks ----------
CHECK = '''() => {const mm=96/25.4,out=[];document.querySelectorAll('.pg').forEach((pg,i)=>{const r=pg.getBoundingClientRect(),fo=pg.querySelector('.fo');
const lim=r.bottom-(fo?14:7)*mm;
pg.querySelectorAll('p,h1,h2,h3,li,blockquote,cite,.tag,.btn,.chips span,.tiles div,.pr div,.fr,.k,.ct div').forEach(e=>{if(e.closest('.fo'))return;const b=e.getBoundingClientRect();
const bd=e.closest('.pad[style*="height"]');if(bd&&b.bottom>bd.getBoundingClientRect().bottom-9*mm)out.push('p'+(i+1)+' band overflow "'+e.textContent.slice(0,30)+'"');if(b.bottom>lim+1||b.top<r.top+7*mm||b.right>r.right-9*mm||b.left<r.left+9*mm)out.push('p'+(i+1)+' '+e.tagName+'.'+e.className+' "'+e.textContent.slice(0,40)+'" b='+Math.round((b.bottom-r.top)/mm)+' t='+Math.round((b.top-r.top)/mm)+' r='+Math.round((b.right-r.left)/mm))});
pg.querySelectorAll('.btn,.cv .row div b').forEach(e=>{if(e.scrollWidth>e.clientWidth+1)out.push('p'+(i+1)+' clipped '+e.textContent)})});
return {pages:document.querySelectorAll('.pg').length,bad:out}}'''

def render(doc_html, out, browser=None):
    htmlp = out[:-4] + '.html'; open(htmlp, 'w').write(doc_html)
    own = browser is None
    if own:
        from playwright.sync_api import sync_playwright
        pw = sync_playwright().start(); browser = pw.chromium.launch()
    pg = browser.new_page(viewport={'width': 794, 'height': 1123})
    pg.goto('file://' + os.path.abspath(htmlp)); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(400)
    res = pg.evaluate(CHECK)
    pg.pdf(path=out, width='210mm', height='297mm', print_background=True, prefer_css_page_size=True)
    pg.close()
    if own: browser.close(); pw.stop()
    os.remove(htmlp)
    res['mb'] = round(os.path.getsize(out) / 1e6, 2)
    return res

if __name__ == '__main__':
    if sys.argv[1] == 'town':
        T = towns(); slug = sys.argv[2]
        print(render(build(town_spec(slug, T[slug], list(T).index(slug))), sys.argv[3]))
    else:
        raise SystemExit(__doc__)
