"""Render transparent 1080x1920 overlay PNGs (hook + end card) for ABJ TikTok edits."""
import json, os, sys
from playwright.sync_api import sync_playwright

R = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(R, '..', 'social', 'node_modules', '@fontsource')
LOGO = 'file://' + os.path.abspath(os.path.join(R, '..', 'logo', 'abj-logo-roundel-web-512.png'))
OUT = os.path.join(R, 'ov')
os.makedirs(OUT, exist_ok=True)
F = lambda p: 'file://' + os.path.abspath(os.path.join(FONTS, p))
CSS = f"""
@font-face{{font-family:CG;src:url({F('cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2')});font-weight:500}}
@font-face{{font-family:CG;src:url({F('cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2')});font-weight:500;font-style:italic}}
@font-face{{font-family:DM;src:url({F('dm-sans/files/dm-sans-latin-400-normal.woff2')});font-weight:400}}
@font-face{{font-family:DM;src:url({F('dm-sans/files/dm-sans-latin-600-normal.woff2')});font-weight:600}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1920px;background:transparent;overflow:hidden;color:#F3EEE6}}
.kick{{font:600 25px/1 DM;letter-spacing:.34em;color:#C9A96E;text-transform:uppercase;display:flex;align-items:center;gap:20px}}
.kick span{{display:inline-block;width:56px;height:2px;background:#C9A96E}}
"""

def hook_html(l1, l2):
    return f"""<html><head><style>{CSS}</style></head><body>
<div style="position:absolute;left:0;right:0;top:0;height:900px;background:linear-gradient(180deg,rgba(8,18,17,.86) 0%,rgba(8,18,17,.62) 38%,rgba(8,18,17,0) 100%)"></div>
<div style="position:absolute;left:84px;right:150px;top:270px">
 <div class="kick"><span></span>ABJ Kitchens &amp; Bedrooms</div>
 <div style="margin-top:30px;font:500 98px/1.02 CG;letter-spacing:-.01em;text-shadow:0 2px 18px rgba(0,0,0,.35)">{l1}<br><em style="font-style:italic;color:#9FD3AE">{l2}</em></div>
</div></body></html>"""

def end_html():
    return f"""<html><head><style>{CSS}</style></head><body>
<div style="position:absolute;inset:0;background:radial-gradient(900px 900px at 50% 45%,rgba(14,32,29,.80),rgba(8,18,17,.92))"></div>
<div style="position:absolute;left:0;right:0;top:560px;text-align:center">
 <img src="{LOGO}" style="width:230px;height:230px;border-radius:50%;background:#fff;padding:6px;box-shadow:0 0 0 3px #C9A96E">
 <div style="margin-top:56px;font:500 84px/1.04 CG">Designed, made &amp; fitted<br><em style="font-style:italic;color:#9FD3AE">by our own team.</em></div>
 <div style="margin-top:44px;font:400 34px/1.4 DM;color:rgba(243,238,230,.82)">Peterborough &middot; 20 years of joinery</div>
 <div style="margin:56px auto 0;display:inline-block;padding:24px 44px;border:2px solid #C9A96E;border-radius:999px;font:600 32px/1 DM;letter-spacing:.06em;color:#F3EEE6">Free design visit &middot; 01733 686767</div>
</div></body></html>"""

def main(spec_path):
    spec = json.load(open(spec_path))
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1080, 'height': 1920})
        tmp = os.path.join(R, 'tmp_ov.html')
        jobs = [('end.png', end_html())] + [(f"hook_{s['id']}.png", hook_html(s['l1'], s['l2'])) for s in spec]
        for name, html in jobs:
            open(tmp, 'w').write(html); pg.goto('file://' + tmp)
            pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(150)
            pg.screenshot(path=os.path.join(OUT, name), omit_background=True)
        b.close()
    print('overlays', len(jobs))

if __name__ == '__main__':
    main(sys.argv[1])
