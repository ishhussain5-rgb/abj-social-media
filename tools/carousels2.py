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


def step(img, n, t1, t2, line, pos='50% 50%'):
    return photo(img, f'Step {n}', t1, t2, line, pos)

def textcard(t1, t2, lines):
    li = ''.join(f'<div style="margin-top:34px;font:400 40px/1.4 DM;color:rgba(243,238,230,.86);display:flex;gap:22px"><span style="color:#C9A96E">&#10003;</span><span>{x}</span></div>' for x in lines)
    return f"""<div style="position:absolute;inset:0;background:radial-gradient(1100px 1000px at 50% 30%,#16302C,#0E1B1A 65%)"></div>
<div style="position:absolute;left:96px;right:110px;top:420px">
 <div class=kick><span></span>ABJ Kitchens &amp; Bedrooms</div>
 <div style="margin-top:34px;font:500 100px/1.02 CG">{t1}<br><em>{t2}</em></div>
 <div style="margin-top:40px">{li}</div>
</div>"""

C = {
 'c7_lantern': [
   cover(PH(25), 'Kitchens under', 'a roof lantern.', 'Daylight from above changes everything.'),
   photo(PH(24), '', 'Dining', 'in the light.', 'A long table right under the glass.'),
   photo(PH(31), '', 'Island', 'centre stage.', 'Handleless runs that keep the view clean.'),
   photo(PH(57), '', 'Garden', 'views.', 'Bi-folds, glass above and a sink with a view.'),
   photo(PH(51), '', 'Dark timber,', 'bright room.', 'Bold finishes still feel light and airy.'),
   cta('Let the', 'light in.')],
 'c8_bedroom_office': [
   cover(PH(69), 'Bedroom meets', 'home office.', 'One room, two jobs, zero clutter.'),
   photo(PH(63), '', 'Sleek', 'sliding doors.', 'Full-height wardrobes that glide shut.'),
   photo(PH(67), '', 'A desk', 'that fits.', 'Built in to the millimetre, cables hidden.'),
   photo(PH(71), '', 'Open', 'shelving.', 'Warm oak shelves for books and plants.'),
   photo(PH(66), '', 'Clock off,', 'lights down.', 'Close the doors and it is a bedroom again.'),
   cta('Work smarter,', 'sleep better.')],
 'c9_loft': [
   cover(PH(1), 'Loft storage,', 'sorted.', 'Awkward eaves turned into fitted space.'),
   photo(PH(0), '', 'Wardrobes', 'under the eaves.', 'Every angle measured and filled.'),
   photo(PH(3), '', 'Deep', 'drawers.', 'Soft-close storage built into the slope.'),
   photo(PH(5), '', 'An LED', 'mirror.', 'A dressing area that glows.'),
   photo(PH(10), '', 'Lift-up', 'bed storage.', 'Even the bed is hiding space.'),
   cta('Every inch,', 'put to work.')],
 'c10_hallway': [
   cover(PH(107), 'First impressions', 'start at the door.', 'Hallways that welcome you home.'),
   photo(PH(108), '', 'Mirrored', 'storage.', 'Bounce the light and hide the coats.'),
   photo(PH(110), '', 'Clever', 'coat hooks.', 'Somewhere for everything by the door.'),
   photo(PH(118), '', 'Under-stair', 'cupboards.', 'Flush doors that disappear into the wall.'),
   photo(PH(123), '', 'Pull-out', 'drawers.', 'Shoes, bags and boots, out of sight.'),
   cta('Come home', 'to calm.')],
 'c11_charcoal': [
   cover(PH(114), 'Charcoal,', 'copper & oak.', 'A kitchen with real presence.'),
   photo(PH(111), '', 'Handleless', 'runs.', 'Clean lines from end to end.'),
   photo(PH(112), '', 'The hidden', 'pantry.', 'Open the doors and everything is there.'),
   photo(PH(113), '', 'Tall', 'storage.', 'Floor-to-ceiling units that keep worktops clear.'),
   photo(PH(117), '', 'Ovens at', 'eye level.', 'No bending, no fuss.'),
   cta('Bold kitchens,', 'built to last.')],
 'c12_myths': [
   cover(PH(30), '3 myths about', 'bespoke kitchens.', 'Let us clear a few things up.'),
   photo(PH(28), 'Myth 01', '“Bespoke means', 'it takes forever.”', 'We design, make and fit with clear timings from day one.'),
   photo(PH(29), 'Myth 02', '“It only works', 'in big rooms.”', 'Made-to-measure is at its best in awkward spaces.'),
   photo(PH(32), 'Myth 03', '“You can’t see it', 'before it’s built.”', 'Your free design visit shows you how it all fits together.'),
   cta('Got a question?', 'Just ask us.')],
 'c13_process': [
   cover(PH(34), 'How it works,', 'start to finish.', 'Four simple steps to your new room.'),
   step(PH(104), 1, 'Free', 'design visit.', 'We come to you, measure up and talk ideas.'),
   step(PH(35), 2, 'Your', 'design.', 'Layouts, finishes and storage planned around you.'),
   step(PH(126), 3, 'Made in', 'our workshop.', 'Built by our own joiners in Peterborough.'),
   step(PH(132), 4, 'Fitted by', 'our own team.', 'No subcontractors. Just a finished room you love.'),
   cta('Step one?', 'Book your visit.')],
 'c14_wardrobes': [
   cover(PH(72), 'Wardrobes', 'with a wow.', 'Fitted wall to wall, floor to ceiling.'),
   photo(PH(73), '', 'Room for', 'the TV too.', 'Wardrobes, drawers and a media space in one.'),
   photo(PH(82), '', 'Marble-effect', 'doors.', 'Soft, light and beautifully finished.'),
   photo(PH(130), '', 'Mirrored', 'sliders.', 'Make a small room feel twice the size.'),
   photo(PH(128), '', 'Inside', 'and out.', 'Hanging, shelves and drawers planned around you.'),
   cta('Your wardrobe,', 'made to measure.')],
 'c15_living': [
   cover(PH(21), 'Living rooms', 'that feel finished.', 'TV walls, storage and warm oak.'),
   photo(PH(14), '', 'Under a', 'skylight.', 'A media wall that suits the room.'),
   photo(PH(16), '', 'Oak slat', 'detail.', 'A warm feature that frames the TV.'),
   photo(PH(40), '', 'Floating', 'units.', 'Storage that keeps the floor clear.'),
   photo(PH(41), '', 'Lit', 'display shelves.', 'Your favourite things, beautifully shown.'),
   cta('Your living room,', 'made to measure.')],
 'c16_dark_light': [
   cover(PH(53), 'Dark or light?', 'You decide.', 'Which kitchen are you? Comment below.'),
   letter(PH(53), 'A', 'Dark timber &amp;<br><em>moody lighting</em>'),
   letter(PH(31), 'B', 'Bright white &amp;<br><em>sky-lit island</em>'),
   cta('Whatever your style,', 'we’ll build it.')],
 'c17_dressing': [
   cover(PH(104), 'A dressing table', 'just for you.', 'Your own space to get ready.'),
   photo(PH(102), '', 'Lit glass', 'display.', 'Bags, shoes and perfumes on show.'),
   photo(PH(103), '', 'Shelves', 'that frame.', 'Storage built around the window.'),
   photo(PH(105), '', 'Glass', 'shelving.', 'Light, open and easy to keep tidy.'),
   photo(PH(106), '', 'Brass', 'finishing touches.', 'The little details make the room.'),
   cta('Get ready', 'in style.')],
 'c18_tips': [
   cover(PH(33), '5 questions to ask', 'before you buy.', 'Save this for your kitchen search.'),
   textcard('Ask every', 'kitchen company:', ['Who actually makes the units?', 'Will your own team fit it?', 'Is the design visit free?', 'How long is the guarantee?', 'Can I see real finished jobs?']),
   photo(PH(42), '', 'Our answers?', 'Easy.', 'Made in our workshop, fitted by our own team, with a free design visit.'),
   photo(PH(43), '', 'Real jobs,', 'real homes.', 'Every photo on this page is a kitchen we built.'),
   cta('Ask us', 'anything.')],
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
