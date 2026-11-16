"""Measured line drawings for the sloping-ceiling wardrobes page (#176).
Writes drawings/slope_section.html: a section with two inline SVG drawings (no raster images, so nothing is ever upscaled).
Run: python3 drawings/slope_drawings.py   then build.py picks the section up from pages/sloping-wardrobes.html."""
import math, os

G, G2, GO, GD, INK, MUT, LIN, LIN2 = '#0E1B1A', '#16302C', '#C9A96E', '#8A6A2F', '#1b2321', '#5d6663', '#F3EEE6', '#ECE5DA'
SAGE = ['#DCE6DA', '#C9D9C8', '#E7E0CF', '#D8CDB4']  # zone fills: long hang, double hang, short hang + shelf, drawers
F = 'font-family:DM Sans,system-ui,sans-serif'


FS = 1.45  # text scale, so labels stay readable when the drawing is shown at phone width


def t(x, y, s, size=13, anchor='middle', fill=INK, weight=400, extra=''):
    size = size * FS
    return '<text x="%g" y="%g" text-anchor="%s" style="%s;font-size:%gpx;font-weight:%d" fill="%s"%s>%s</text>' % (x, y, anchor, F, size, weight, fill, extra, s)


def dim_h(x1, x2, y, label):  # horizontal dimension line with ticks
    return ('<g stroke="%s" stroke-width="1.2"><line x1="%g" y1="%g" x2="%g" y2="%g"/>'
            '<line x1="%g" y1="%g" x2="%g" y2="%g"/><line x1="%g" y1="%g" x2="%g" y2="%g"/></g>' % (GD, x1, y, x2, y, x1, y - 7, x1, y + 7, x2, y - 7, x2, y + 7)
            + '<rect x="%g" y="%g" width="%g" height="28" fill="%s"/>' % ((x1 + x2) / 2 - 50, y - 14, 100, LIN)
            + t((x1 + x2) / 2, y + 7, label, 13, fill=GD, weight=500))


def dim_v(x, y1, y2, label, side=-1):
    return ('<g stroke="%s" stroke-width="1.2"><line x1="%g" y1="%g" x2="%g" y2="%g"/>'
            '<line x1="%g" y1="%g" x2="%g" y2="%g"/><line x1="%g" y1="%g" x2="%g" y2="%g"/></g>' % (GD, x, y1, x, y2, x - 7, y1, x + 7, y1, x - 7, y2, x + 7, y2)
            + '<rect x="%g" y="%g" width="76" height="28" fill="%s"/>' % (x - 38, (y1 + y2) / 2 - 14, LIN)
            + t(x, (y1 + y2) / 2 + 7, label, 13, fill=GD, weight=500))


def lab(x, y, s, size=12.5):
    w = len(s) * size * FS * .56 + 18
    size = size  # t() applies FS
    return '<rect x="%g" y="%g" width="%g" height="%g" rx="%g" fill="%s" opacity=".92"/>' % (x - w / 2, y - size * FS - 4, w, size * FS + 12, (size * FS + 12) / 2, LIN) + t(x, y, s, size, weight=600)


def hangers(x1, x2, y, n, drop):
    """rail with garments hanging from it"""
    out = '<line x1="%g" y1="%g" x2="%g" y2="%g" stroke="%s" stroke-width="3" stroke-linecap="round"/>' % (x1 + 5, y, x2 - 5, y, G)
    step = (x2 - x1 - 30) / max(n - 1, 1)
    for i in range(n):
        cx = x1 + 15 + i * step
        out += ('<path d="M%g %g v5 M%g %g l-10 7 h20 z" fill="none" stroke="%s" stroke-width="1.1"/>' % (cx, y, cx, y + 5, G2)
                + '<rect x="%g" y="%g" width="16" height="%g" rx="3" fill="%s" opacity=".13"/>' % (cx - 8, y + 12, drop, G2))
    return out


def elevation():
    # 2 px per cm. Floor at y=560, wall from x=90. Ceiling 230 cm flat for 200 cm, then slopes to a 100 cm knee wall at 360 cm.
    s, X0, Y0 = 2.0, 96, 560
    X = lambda cm: X0 + cm * s
    Y = lambda cm: Y0 - cm * s
    tan = 130 / 160
    H = lambda cm: 230 if cm <= 200 else 230 - tan * (cm - 200)
    pitch = round(math.degrees(math.atan(tan)))
    o = []
    o.append('<path d="M%g %g H%g V%g L%g %g H%g Z" fill="%s"/>' % (X(0), Y(0), X(360), Y(100), X(200), Y(230), X(0), LIN2))
    o.append('<path d="M%g %g H%g L%g %g" fill="none" stroke="%s" stroke-width="2.4"/>' % (X(-12), Y(230), X(200), X(372), Y(H(372)), G))
    o.append('<line x1="%g" y1="%g" x2="%g" y2="%g" stroke="%s" stroke-width="2.4"/>' % (X(-12), Y(0), X(372), Y(0), G))
    o.append('<line x1="%g" y1="%g" x2="%g" y2="%g" stroke="%s" stroke-width="2.4"/>' % (X(360), Y(0), X(360), Y(100), G))
    bays = [(0, 90, 0), (90, 200, 1), (200, 290, 2), (290, 360, 3)]
    pl = 8
    for a, b, k in bays:
        o.append('<path d="M%g %g V%g L%g %g V%g Z" fill="%s" stroke="%s" stroke-width="1.6"/>' % (X(a), Y(pl), Y(H(a)), X(b), Y(H(b)), Y(pl), SAGE[k], G2))
    o.append('<rect x="%g" y="%g" width="%g" height="%g" fill="%s"/>' % (X(0), Y(pl), 360 * s, pl * s, G2))
    hl = lambda a, b, h: '<line x1="%g" y1="%g" x2="%g" y2="%g" stroke="%s" stroke-width="1.4"/>' % (X(a), Y(h), X(b), Y(h), G2)
    # A long hanging under a top shelf
    o.append(hl(0, 90, 200) + hangers(X(0), X(90), Y(185), 4, 2 * 130))
    # B double hanging
    o.append(hl(90, 200, 205) + hangers(X(90), X(200), Y(192), 5, 2 * 72) + hl(90, 200, 104) + hangers(X(90), X(200), Y(96), 5, 2 * 72))
    # C shelf with short hanging below
    o.append(hl(200, 290, 128) + hangers(X(200), X(290), Y(116), 4, 2 * 80))
    # D drawers with an angled cupboard above
    for lo, hi in [(8, 30), (30, 52), (52, 74), (74, 96)]:
        o.append('<rect x="%g" y="%g" width="%g" height="%g" fill="none" stroke="%s" stroke-width="1.2"/>' % (X(293), Y(hi - 1), 64 * s, (hi - lo - 2) * s, G2))
        o.append('<line x1="%g" y1="%g" x2="%g" y2="%g" stroke="%s" stroke-width="2.4" stroke-linecap="round"/>' % (X(316), Y((lo + hi) / 2), X(334), Y((lo + hi) / 2), GD))
    o.append(hl(290, 360, 98))
    o.append(lab(X(45), Y(214), 'Long hanging', 12) + lab(X(145), Y(216), 'Double hanging', 12) + lab(X(245), Y(150), 'Shelf', 12)
             + lab(X(245), Y(28), 'Short hanging', 12) + lab(X(325), Y(58), 'Drawers', 12))
    o.append(dim_h(X(0), X(360), Y(0) + 40, '360 cm'))
    o.append(dim_v(X(0) - 50, Y(0), Y(230), '230 cm'))
    o.append(dim_v(X(360) + 52, Y(0), Y(100), '100 cm'))
    o.append(dim_h(X(0), X(200), Y(230) - 30, '200 cm'))
    # roof pitch, drawn outside the wardrobe where the slope carries on past the knee wall
    cx, cy, r = X(360), Y(100), 34
    a = math.atan(tan)
    o.append('<line x1="%g" y1="%g" x2="%g" y2="%g" stroke="%s" stroke-width="1" stroke-dasharray="4 4"/>' % (cx, cy, cx + 46, cy, GD))
    o.append('<path d="M%g %g A%g %g 0 0 1 %g %g" fill="none" stroke="%s" stroke-width="1.2"/>' % (cx + r, cy, r, r, cx + r * math.cos(a), cy + r * math.sin(a), GD))
    o.append(t(cx + 22, cy - 12, '%d&deg;' % pitch, 13, fill=GD, weight=600))
    o.append(t(X(0) - 60, 34, 'FRONT VIEW, DOORS OFF', 11, 'start', GD, 600, ' letter-spacing="2.5"'))
    return ('<svg viewBox="0 0 920 670" role="img" aria-labelledby="sd1t" xmlns="http://www.w3.org/2000/svg">'
            '<title id="sd1t">Design drawing: front view of a fitted wardrobe following a sloping ceiling, 360 cm wide and 230 cm high, '
            'stepping down to a 100 cm knee wall at about %d degrees, with long hanging, double hanging, short hanging under a shelf, and drawers where the ceiling is lowest</title>'
            '<rect width="920" height="670" fill="%s"/>' % (pitch, LIN) + ''.join(o) + '</svg>')


def section():
    # Side section through the knee wall, 2.4 px per cm. Room on the left, eaves void on the right of the knee wall.
    s, KX, Y0 = 2.8, 372, 612
    X = lambda cm: KX + cm * s  # cm measured from the knee wall, + into the void
    Y = lambda cm: Y0 - cm * s
    tan = 130 / 160
    R = lambda d: 100 - tan * d  # roof underside height
    xr = 100 / tan
    xc = -(230 - 100) / tan  # where the slope meets the 230 cm flat ceiling
    o = []
    o.append('<path d="M%g %g V%g L%g %g Z" fill="%s"/>' % (X(0), Y(0), Y(100), X(xr), Y(0), LIN2))
    o.append('<path d="M%g %g H%g L%g %g" fill="none" stroke="%s" stroke-width="2.4"/>' % (X(-112), Y(R(-112)), X(-112), X(xr), Y(0), G))
    o.append('<path d="M%g %g L%g %g" fill="none" stroke="%s" stroke-width="12" opacity=".1"/>' % (X(-112) + 6, Y(R(-112)) - 8, X(xr) + 8, Y(0) - 6, G))
    o.append('<line x1="%g" y1="%g" x2="%g" y2="%g" stroke="%s" stroke-width="2.4"/>' % (X(-112), Y(0), X(xr) + 16, Y(0), G))
    # knee wall above the drawer opening
    o.append('<rect x="%g" y="%g" width="8" height="%g" fill="%s"/>' % (X(0) - 4, Y(100), 46 * s, G))
    # drawer carcass: 8 cm plinth to 52 cm, running 45 cm back into the void (roof is still 63 cm high at the back)
    dep, top = 45, 52
    o.append('<path d="M%g %g H%g V%g H%g Z" fill="%s" stroke="%s" stroke-width="1.6"/>' % (X(0), Y(8), X(dep), Y(top), X(0), SAGE[3], G2))
    o.append('<rect x="%g" y="%g" width="%g" height="%g" fill="%s"/>' % (X(0), Y(8), dep * s, 8 * s, G2))
    o.append('<line x1="%g" y1="%g" x2="%g" y2="%g" stroke="%s" stroke-width="1.2"/>' % (X(0), Y(30), X(dep), Y(30), G2))
    o.append('<rect x="%g" y="%g" width="5" height="%g" fill="%s"/>' % (X(0) - 5, Y(top), (top - 8) * s, G2))
    # top drawer pulled out into the room (dashed)
    o.append('<path d="M%g %g h%g v%g h%g" fill="none" stroke="%s" stroke-width="1.3" stroke-dasharray="6 5"/>' % (X(0) - 5, Y(top - 1), -(dep - 6) * s, (top - 31) * s, (dep - 6) * s, GD))
    o.append(t(X(0) - 14, Y(31) + 30, 'Drawer pulled out', 12, 'end', GD, 500))
    # access hatch in the knee wall above the drawers
    o.append('<rect x="%g" y="%g" width="8" height="%g" fill="%s" stroke="%s" stroke-width="1.2"/>' % (X(0) - 4, Y(92), 34 * s, LIN, G2))
    o.append('<line x1="%g" y1="%g" x2="%g" y2="%g" stroke="%s" stroke-width="1"/>' % (X(0) - 8, Y(75), X(-30), Y(112), MUT))
    o.append(t(X(-31), Y(112) - 6, 'Access hatch kept', 12, 'end', MUT, 500))
    o.append(t(X(78), Y(5), 'Eaves void', 12, fill=MUT, weight=600))
    o.append(t(X(-90), Y(128), 'Loft room', 13, fill=MUT, weight=600))
    # dimensions
    o.append('<line x1="%g" y1="%g" x2="%g" y2="%g" stroke="%s" stroke-width="1" stroke-dasharray="3 4"/>' % (X(0) - 8, Y(100), X(-96), Y(100), GD))
    o.append(dim_v(X(-96), Y(0), Y(100), '100 cm'))
    o.append(dim_h(X(0), X(dep), Y(0) + 34, '45 cm'))
    o.append(t(X(-112), 34, 'SIDE SECTION THROUGH THE EAVES', 11, 'start', GD, 600, ' letter-spacing="2.5"'))
    return ('<svg viewBox="0 0 760 670" role="img" aria-labelledby="sd2t" xmlns="http://www.w3.org/2000/svg">'
            '<title id="sd2t">Design drawing: side section through a loft room, showing drawers built into a 100 cm knee wall that run 45 cm back into the eaves void, '
            'with an access hatch kept above them</title>'
            '<rect width="760" height="670" fill="%s"/>' % LIN + ''.join(o) + '</svg>')


CSS = ('<style>#kc .drw{padding:clamp(40px,3.6vw,64px) 0;background:var(--lin)}#kc .drw .sh{margin-bottom:clamp(20px,2vw,32px)}'
       '#kc .drw .s2b{display:none;margin-top:14px;width:100%;padding:13px 16px;background:none;border:1px solid var(--hair);font:500 11px/1.4 var(--sans);letter-spacing:.2em;text-transform:uppercase;color:var(--ink);cursor:pointer}'
       '#kc .drw .g2{display:grid;grid-template-columns:920fr 760fr;align-items:start;max-width:1180px;gap:clamp(20px,2.4vw,44px)}'
       '#kc .drw figure{margin:0;background:var(--lin);border:1px solid var(--hair);min-width:0}#kc .drw .sc{overflow-x:auto;-webkit-overflow-scrolling:touch}#kc .drw svg{display:block;width:100%;height:auto}'
       '#kc .drw .sw{display:none;padding:10px 20px 0;font:500 11px/1.4 var(--sans);letter-spacing:.2em;text-transform:uppercase;color:var(--gd,#8A6A2F)}'
       '#kc .drw figcaption{padding:16px 20px 20px;border-top:1px solid var(--hair);font:400 15px/1.55 var(--sans);color:var(--mut)}'
       '#kc .drw figcaption b{display:block;font-weight:600;color:var(--ink);margin-bottom:4px}'
       '#kc .drw .nt{margin-top:22px;font:400 13.5px/1.5 var(--sans);color:var(--mut)}'
       '@media(max-width:900px){#kc .drw .g2{grid-template-columns:1fr}}@media(max-width:640px){#kc .drw svg{width:560px;max-width:none}#kc .drw .s2 svg{width:530px}#kc .drw .sw{display:block}#kc .drw .s2b{display:block}#kc .drw .s2:not(.op){display:none}}</style>')


def html():
    return (CSS + '<section class="drw" aria-label="Design drawings: planning a wardrobe under a sloping ceiling"><div class="w">\n'
            ' <div class="sh rv"><div><span class="kick">Design drawings</span><h2 style="margin-top:16px">How we plan the space under a slope</h2></div>'
            '<p>Two drawings of a typical loft room, so you can see how the height of your ceiling decides what goes where.</p></div>\n'
            ' <div class="g2">\n'
            '  <figure class="rv"><div class="sw" aria-hidden="true">&larr; Swipe to see the full drawing</div><div class="sc">' + elevation() + '</div><figcaption><b>Front view: following the roofline</b>Long hanging goes where the ceiling is highest, double hanging next, then a shelf with short hanging, and drawers where the slope comes down to the knee wall.</figcaption></figure>\n'
            '  <figure class="rv s2"><div class="sw" aria-hidden="true">&larr; Swipe to see the full drawing &rarr;</div><div class="sc">' + section() + '</div><figcaption><b>Side view: using the eaves void</b>Drawers can be built into the knee wall and run back into the space behind it. We keep a hatch for access to the rest of the void and any pipework.</figcaption></figure>\n'
            ' </div>\n'
            ' <button class="s2b" type="button" aria-expanded="false">See the side view through the eaves</button>\n'
            ' <p class="nt rv">Drawings show a typical layout. Every design is measured to your room at the free design visit.</p>\n'
            '</div></section>\n'
            '<script>(function(){var r=document.querySelector("#kc .drw");if(!r)return;var s=r.querySelectorAll(".sc");if(s.length<2)return;var a=s[0],b=s[1];if(a.scrollWidth>a.clientWidth)a.scrollLeft=a.scrollWidth;var f=r.querySelector(".s2"),t=r.querySelector(".s2b");if(t&&f)t.addEventListener("click",function(){var o=f.classList.toggle("op");t.setAttribute("aria-expanded",o?"true":"false");t.textContent=o?"Hide the side view":"See the side view through the eaves";if(o&&b.scrollWidth>b.clientWidth)b.scrollLeft=Math.round(b.scrollWidth*.26)})})();</script>\n')


if __name__ == '__main__':
    d = os.path.dirname(os.path.abspath(__file__))
    open(os.path.join(d, 'slope_section.html'), 'w').write(html())
    open(os.path.join(d, 'slope_preview.html'), 'w').write('<!doctype html><meta charset=utf-8><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Cormorant+Garamond:wght@500&display=swap" rel="stylesheet">'
        '<style>:root{--lin:#F3EEE6;--hair:rgba(27,35,33,.14);--ink:#1b2321;--mut:#5d6663;--sans:"DM Sans",sans-serif;--go:#C9A96E}body{margin:0;background:#F3EEE6}#kc .w{max-width:1760px;margin:0 auto;padding:0 clamp(20px,4.2vw,88px)}#kc h2{font:500 clamp(36px,4.2vw,68px)/1.05 "Cormorant Garamond",serif;margin:0}#kc .kick{font:500 11px/1.4 var(--sans);letter-spacing:.32em;text-transform:uppercase;color:var(--mut)}#kc .sh{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;margin-bottom:40px}#kc .sh p{font:400 17px/1.6 var(--sans);color:var(--mut);max-width:520px}</style>'
        '<div id="kc">' + html() + '</div>')
    print('ok')
