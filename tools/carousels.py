"""Render ABJ TikTok photo-carousel slides (1080x1920 JPG)."""
import json, os
from playwright.sync_api import sync_playwright

R = os.path.dirname(os.path.abspath(__file__))
POOL = json.load(open(os.path.join(R, 'pool.json')))
BASE = '/mnt/user-data/uploads/ABJ/Content/'
PH = lambda i: 'file://' + BASE + POOL[i]
FONTS = os.path.join(R, '..', 'social', 'node_modules', '@fontsource')
F = lambda p: 'file://' + os.path.abspath(os.path.join(FONTS, p))
LOGO = 'file://' + os.path.abspath(os.path.join(R, '..', 'logo', 'abj-logo-roundel-web-512.png'))
REV = '/mnt/user-data/outputs/abj-highlights/stories/'
OUT = os.path.join(R, 'car'); os.makedirs(OUT, exist_ok=True)
CSS = f"""
@font-face{{font-family:CG;src:url({F('cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2')});font-weight:500}}
@font-face{{font-family:CG;src:url({F('cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2')});font-weight:500;font-style:italic}}
@font-face{{font-family:DM;src:url({F('dm-sans/files/dm-sans-latin-400-normal.woff2')});font-weight:400}}
@font-face{{font-family:DM;src:url({F('dm-sans/files/dm-sans-latin-600-normal.woff2')});font-weight:600}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:1080px;height:1920px;overflow:hidden;color:#F3EEE6;font-family:DM;background:#0E1B1A}}
.kick{{font:600 25px/1 DM;letter-spacing:.34em;color:#C9A96E;text-transform:uppercase;display:flex;align-items:center;gap:20px}}
.kick span{{display:inline-block;width:56px;height:2px;background:#C9A96E}}
.ph{{position:absolute;left:0;top:0;width:1080px;object-fit:cover;filter:saturate(1.04) contrast(1.04)}}
em{{font-style:italic;color:#9FD3AE}}
"""

def cover(img, t1, t2, sub, pos='50% 50%'):
    return f"""<img class=ph src="{img}" style="height:1260px;object-position:{pos}">
<div style="position:absolute;left:0;right:0;top:0;height:1262px;background:linear-gradient(180deg,rgba(14,27,26,.5) 0%,rgba(14,27,26,0) 20%,rgba(14,27,26,0) 50%,rgba(14,27,26,.9) 84%,#0E1B1A 100%)"></div>
<div style="position:absolute;left:84px;right:170px;top:1040px">
 <div class=kick><span></span>ABJ Kitchens &amp; Bedrooms</div>
 <div style="margin-top:30px;font:500 112px/1.0 CG;letter-spacing:-.01em">{t1}<br><em>{t2}</em></div>
 <div style="margin-top:34px;font:400 36px/1.4 DM;color:rgba(243,238,230,.78)">{sub}</div>
 <div style="margin-top:44px;font:600 28px/1 DM;letter-spacing:.12em;color:#C9A96E">SWIPE &rarr;</div>
</div>"""

def photo(img, n, cap1, cap2, line, pos='50% 50%'):
    num = f'<div style="font:500 70px/1 CG;color:#C9A96E">{n}</div>' if n else ''
    return f"""<img class=ph src="{img}" style="height:1920px;object-position:{pos}">
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,18,17,.35) 0%,rgba(8,18,17,0) 16%,rgba(8,18,17,0) 46%,rgba(8,18,17,.82) 72%,rgba(8,18,17,.92) 100%)"></div>
<div style="position:absolute;left:84px;right:170px;top:1120px">{num}
 <div style="margin-top:18px;font:500 80px/1.04 CG">{cap1}<br><em>{cap2}</em></div>
 <div style="margin-top:26px;font:400 34px/1.42 DM;color:rgba(243,238,230,.8)">{line}</div>
</div>"""

def letter(img, L, name, pos='50% 50%'):
    return f"""<img class=ph src="{img}" style="height:1920px;object-position:{pos}">
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,18,17,.3) 0%,rgba(8,18,17,0) 20%,rgba(8,18,17,0) 55%,rgba(8,18,17,.88) 85%)"></div>
<div style="position:absolute;left:84px;top:1150px;width:190px;height:190px;border:4px solid #C9A96E;border-radius:50%;display:flex;align-items:center;justify-content:center;font:500 130px/1 CG;background:rgba(8,18,17,.5)">{L}</div>
<div style="position:absolute;left:84px;right:170px;top:1380px;font:500 74px/1.05 CG">{name}</div>"""

def cta(t1='Your room,', t2='made to measure.'):
    return f"""<div style="position:absolute;inset:0;background:radial-gradient(1100px 1000px at 50% 40%,#16302C,#0E1B1A 65%)"></div>
<div style="position:absolute;left:0;right:0;top:470px;text-align:center">
 <img src="{LOGO}" style="width:240px;height:240px;border-radius:50%;background:#fff;padding:6px;box-shadow:0 0 0 3px #C9A96E">
 <div style="margin-top:64px;font:500 104px/1.02 CG">{t1}<br><em>{t2}</em></div>
 <div style="margin-top:44px;font:400 36px/1.45 DM;color:rgba(243,238,230,.8)">Designed, made &amp; fitted by our own<br>Peterborough team &middot; 10-year guarantee</div>
 <div style="margin:64px auto 0;display:inline-block;padding:28px 50px;background:#C9A96E;color:#0E1B1A;border-radius:999px;font:600 34px/1 DM;letter-spacing:.04em">Book a free design visit</div>
 <div style="margin-top:40px;font:600 34px/1.5 DM;letter-spacing:.04em">01733 686767<br><span style="font-weight:400;color:rgba(243,238,230,.75)">abjkitchensandbedrooms.co.uk</span></div>
</div>"""

def revcard(path):
    return f'<img src="file://{path}" style="position:absolute;inset:0;width:1080px;height:1920px">'

C = {
 'c1_reviews': [
   cover(PH(52), 'Don’t take', 'our word for it.', 'Real reviews from homes across Peterborough.'),
   revcard(REV + 's-reviews-1.png'), revcard(REV + 's-reviews-2.png'), revcard(REV + 's-reviews-3.png'),
   cta('Join them.', 'Start with a free visit.')],
 'c2_which': [
   cover(PH(114), 'Which kitchen', 'would you choose?', 'A, B or C? Tell us in the comments.'),
   letter(PH(50), 'A', 'Dark timber &amp;<br><em>roof lantern</em>'),
   letter(PH(114), 'B', 'Navy &amp;<br><em>copper pendants</em>'),
   letter(PH(31), 'C', 'Bright white<br><em>handleless island</em>'),
   cta()],
 'c3_details': [
   cover(PH(53), '5 details that', 'feel expensive.', 'Small choices, big difference.'),
   photo(PH(36), '01', 'Hidden', 'LED lighting.', 'A soft glow under worktops and inside shelving.'),
   photo(PH(52), '02', 'Light from', 'above.', 'A roof lantern pours daylight onto the island.'),
   photo(PH(58), '03', 'Statement', 'pendants.', 'Two bold lights to anchor the island.'),
   photo(PH(117), '04', 'A tall', 'appliance wall.', 'Ovens at eye level, everything else hidden away.'),
   photo(PH(62), '05', 'Somewhere', 'to sit.', 'A built-in bench turns the kitchen into the heart of the home.'),
   cta()],
 'c4_mediawalls': [
   cover(PH(92), 'Media walls,', 'the room’s centrepiece.', 'Storage, lighting and a home for every cable.'),
   photo(PH(87), '', 'Backlit', 'oak slats.', 'Warm light that makes every film night feel cinematic.'),
   photo(PH(37), '', 'Fire', 'built in.', 'An electric fire framed in clean, flat panels.'),
   photo(PH(94), '', 'Floating', 'storage.', 'Everything tucked away, nothing on show.'),
   photo(PH(133), '', 'Lit', 'feature panels.', 'Designed around your TV, your room, your layout.'),
   cta('Your wall,', 'reimagined.')],
 'c5_bedrooms': [
   cover(PH(101), 'Bedrooms,', 'built around you.', 'Wardrobes fitted to the millimetre.'),
   photo(PH(72), '', 'Floor to', 'ceiling.', 'Every inch of the wall used beautifully.'),
   photo(PH(76), '', 'The little', 'details.', 'Brass handles on soft marble-effect doors.'),
   photo(PH(67), '', 'Work meets', 'wardrobe.', 'A built-in desk and shelving in one run.'),
   photo(PH(102), '', 'Lit display', 'shelving.', 'Glass, timber and warm light for the things you love.'),
   cta('Your bedroom,', 'made to measure.')],
 'c6_storage': [
   cover(PH(122), 'Storage you’d', 'never notice.', 'Clever space hiding in plain sight.'),
   photo(PH(119), '', 'Under the', 'stairs.', 'Pull-out drawers in the space everyone forgets.'),
   photo(PH(120), '', 'Hallway', 'storage.', 'Shoes, coats and clutter, gone.'),
   photo(PH(109), '', 'Slatted', 'coat wall.', 'Hooks, panels and a bench by the front door.'),
   photo(PH(43), '', 'Lit', 'shelving.', 'A reading nook built into the kitchen.'),
   cta('Every inch,', 'put to work.')],
}

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1080, 'height': 1920})
    tmp = os.path.join(R, 'tmp_c.html')
    for cid, slides in C.items():
        for i, body in enumerate(slides, 1):
            open(tmp, 'w').write(f'<html><head><style>{CSS}</style></head><body>{body}</body></html>')
            pg.goto('file://' + tmp); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(250)
            pg.screenshot(path=os.path.join(OUT, f'abj_tt_{cid}_{i:02d}.jpg'), type='jpeg', quality=90)
    b.close()
print('ok', len(os.listdir(OUT)))
