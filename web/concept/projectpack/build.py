#!/usr/bin/env python3
"""ABJ project packs: a customer pack and a fitter's pack (A4 landscape PDFs) from one project JSON.

  python3 build.py projects/sample-kitchen.json <outdir>

Env (same as the brochures): ABJ_IMG (source photos), ABJ_FONTS (@fontsource folder), ABJ_LOGO (roundel png).
Customer pack: sizes in cm, plain-English pages, the T&Cs word for word (data/terms.txt, copied from the live site).
Fitter's pack: sizes in mm, numbered plans and elevations per stage, delivery check, snagging and handover sign-off.
Every page is checked for anything running off the page; the build fails if something does.
"""
import json, os, sys, io, base64, html, re
from PIL import Image
import segno
import draw

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.environ.get('ABJ_IMG', 'img')
FONTS = os.environ.get('ABJ_FONTS', '')
LOGO = os.environ.get('ABJ_LOGO', '')
E = html.escape
SITE = 'https://abjkitchensandbedrooms.co.uk/'
SHORT = 'abjinteriors.co.uk'
PHONE, WA, EMAIL = '01733 686767', '07479 219421', 'info@abjkitchensandbedrooms.co.uk'
ADDR = '3 Brassey Close, Peterborough PE1 2AZ'


def b64(path, mime):
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(path, 'rb').read()).decode())


def pic(name, wmm, hmm, pos='50% 50%', q=80, ppm=7.0):
    f = [name] if os.path.isfile(name) else [p for p in (os.path.join(IMG, name + x) for x in ('.webp', '.jpg', '.png')) if os.path.exists(p)]
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


def fonts():
    cg = 'cormorant-garamond/files/cormorant-garamond-latin-%d-%s.woff2'
    dm = 'dm-sans/files/dm-sans-latin-%d-normal.woff2'
    return ''.join([face('Cormorant Garamond', cg % (400, 'normal'), 400), face('Cormorant Garamond', cg % (500, 'normal'), 500),
                    face('Cormorant Garamond', cg % (400, 'italic'), 400, 'italic'),
                    face('DM Sans', dm % 400, 400), face('DM Sans', dm % 500, 500), face('DM Sans', dm % 600, 600)])


def qr_svg(url, dark='#0E1B1A', light='#F3EEE6'):
    q = segno.make(url, error='m')
    buf = io.BytesIO(); q.save(buf, kind='png', scale=12, border=0, dark=dark, light=light)
    return '<img class="qr" src="data:image/png;base64,%s">' % base64.b64encode(buf.getvalue()).decode()


def cm(v):
    c = v / 10
    return ('%d' % round(c)) if c >= 10 else ('%g' % round(c, 1))


CSS = '''
@page{size:297mm 210mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font:400 9.4pt/1.5 'DM Sans',sans-serif;color:#1b2321}
.pg{width:297mm;height:210mm;position:relative;overflow:hidden;page-break-after:always;break-after:page}
.serif{font-family:'Cormorant Garamond',serif}
.kick{font:600 6.9pt/1 'DM Sans';letter-spacing:.24em;text-transform:uppercase;color:#a7864c}
h1{font:500 24pt/1.06 'Cormorant Garamond',serif;color:#0E1B1A;letter-spacing:-.005em}
h2{font:500 14.5pt/1.15 'Cormorant Garamond',serif;color:#0E1B1A;margin:0 0 2.2mm}
h3{font:600 8pt/1.3 'DM Sans';letter-spacing:.12em;text-transform:uppercase;color:#a7864c;margin:0 0 1.6mm}
p{margin:0 0 2mm}
.mute{color:#5f6866}
.sample{display:inline-block;font:600 6.4pt/1 'DM Sans';letter-spacing:.18em;color:#8a2f2f;border:.3mm solid #8a2f2f;border-radius:1mm;padding:1mm 1.6mm;margin-left:3mm;vertical-align:middle}
/* customer pages */
.c{background:#F3EEE6;padding:14mm 17mm 13mm}
.c .hd{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:.35mm solid #C9A96E;padding-bottom:3.2mm;margin-bottom:6mm}
.c .hd .r{text-align:right;font:500 7.4pt/1.5 'DM Sans';color:#5f6866}
.c .ft{position:absolute;left:17mm;right:17mm;bottom:7mm;display:flex;justify-content:space-between;font:400 6.8pt/1 'DM Sans';color:#7a817f}
.card{background:#fff;border:.25mm solid rgba(14,27,26,.12);border-radius:2mm;padding:5mm 5.5mm}
.dark{background:#0E1B1A;color:#F3EEE6}
.dark h2{color:#F3EEE6}
.spec{width:100%;border-collapse:collapse}
.spec td{padding:2.25mm 0;border-bottom:.25mm solid rgba(14,27,26,.1);vertical-align:top}
.spec td:first-child{width:42%;font:600 6.9pt/1.6 'DM Sans';letter-spacing:.12em;text-transform:uppercase;color:#a7864c}
.tbl{width:100%;border-collapse:collapse;font-size:7.9pt;line-height:1.35}
.tbl th{font:600 6.3pt/1.2 'DM Sans';letter-spacing:.12em;text-transform:uppercase;color:#a7864c;text-align:left;padding:0 1.6mm 1.4mm 0;border-bottom:.3mm solid #C9A96E}
.tbl td{padding:1.05mm 1.6mm 1.05mm 0;border-bottom:.2mm solid rgba(14,27,26,.09);vertical-align:top}
.tbl td.n{width:8mm}
.tbl .mute{font-size:7.2pt}
.tbl .grp td{font:600 7pt/1.2 'DM Sans';color:#0E1B1A;padding-top:2.6mm;border-bottom:.2mm solid rgba(14,27,26,.18)}
.num{display:inline-block;min-width:5.2mm;height:5.2mm;line-height:5.2mm;border-radius:1.2mm;background:#0E1B1A;color:#F3EEE6;font:600 6.8pt/5.2mm 'DM Sans';text-align:center;padding:0 1mm}
.num.g{background:#C9A96E;color:#0E1B1A}
.by{font:600 6pt/1 'DM Sans';letter-spacing:.1em;text-transform:uppercase;padding:.8mm 1.4mm;border-radius:.8mm;background:#E8E1D3;color:#5f6866;white-space:nowrap}
.by.you{background:#0E1B1A;color:#F3EEE6}
.cols{display:grid;gap:7mm}
.legend{display:grid;grid-template-columns:7mm 1fr;gap:1.8mm 2.5mm;align-items:center;font-size:7.9pt}
.sw{width:7mm;height:4.2mm;border:.25mm solid #4b5452;border-radius:.6mm}
.plan,.elev{width:100%;height:100%;display:block}
.steps{display:grid;grid-template-columns:repeat(7,1fr);gap:3.2mm;position:relative;margin-top:4mm}
.steps:before{content:'';position:absolute;left:4%;right:4%;top:6.5mm;height:.35mm;background:#C9A96E}
.step{position:relative}
.step .dot{width:13mm;height:13mm;border-radius:50%;background:#0E1B1A;color:#C9A96E;font:500 15pt/13mm 'Cormorant Garamond';text-align:center;margin:0 0 3.4mm;position:relative}
.step h4{font:600 8.4pt/1.3 'DM Sans';color:#0E1B1A;margin:0 0 1.3mm}
.step p{font-size:7.9pt;line-height:1.45;color:#3d4644}
.chk{list-style:none}
.chk li{position:relative;padding:1.5mm 0 1.5mm 7mm;border-bottom:.2mm solid rgba(14,27,26,.08);font-size:8.4pt}
.chk li:before{content:'';position:absolute;left:0;top:2mm;width:3.4mm;height:3.4mm;border:.35mm solid #0E1B1A;border-radius:.6mm;background:#fff}
.qa h4{font:500 13pt/1.2 'Cormorant Garamond',serif;color:#0E1B1A;margin:0 0 1.4mm}
.qa p{font-size:8.9pt;line-height:1.55;color:#3d4644;margin:0 0 5.5mm}
.sig{display:grid;grid-template-columns:1fr 1fr 34mm;gap:6mm;margin-top:5mm}
.sig div{border-top:.3mm solid #0E1B1A;padding-top:1.4mm;font:600 6.4pt/1 'DM Sans';letter-spacing:.12em;text-transform:uppercase;color:#5f6866}
.terms{column-count:3;column-gap:7mm;font-size:6.9pt;line-height:1.42;color:#2c3432;column-fill:auto}
.terms h2{font:600 7.3pt/1.3 'DM Sans';color:#0E1B1A;margin:2.2mm 0 .8mm;break-after:avoid}
.terms h3{font:600 6.6pt/1.3 'DM Sans';letter-spacing:.04em;text-transform:none;color:#0E1B1A;margin:1.4mm 0 .5mm;break-after:avoid}
.terms p{margin:0 0 1.1mm}
.terms .lead{font-size:7.1pt;color:#1b2321}
.qr{width:100%;height:auto;display:block}
.qsec{margin:0 0 4.5mm}
.qsec h3{margin-bottom:1.2mm}
.ql{font-size:8.2pt;line-height:1.5;margin:0 0 1.6mm}
.qb{margin:0 0 1.6mm 4mm;font-size:8.2pt;line-height:1.5}
.qt,.qsum{width:100%;border-collapse:collapse;font-size:8.4pt}
.qt td{padding:1.25mm 0;border-bottom:.2mm solid rgba(14,27,26,.1)}
.qt tr.tot td{font-weight:600;color:#0E1B1A;border-bottom:.35mm solid #C9A96E}
.qsum td{padding:1.8mm 0;border-bottom:.2mm solid rgba(201,169,110,.35);font-size:9pt}
.qsum tr:last-child td{border-bottom:0;color:#C9A96E;font-weight:600;padding-top:2.6mm}
.qsum tr:last-child td:last-child{font:500 18pt/1 'Cormorant Garamond',serif}
/* fitter pages */
.f{background:#fff;padding:11mm 12mm 10mm 30mm}
.f .rail{position:absolute;left:0;top:0;bottom:0;width:20mm;background:#0E1B1A;color:#F3EEE6;padding:9mm 0 0;text-align:center}
.f .rail .st{font:500 26pt/1 'Cormorant Garamond',serif;color:#C9A96E}
.f .rail .lab{position:absolute;left:50%;top:32mm;transform:rotate(-90deg) translateX(-100%);transform-origin:0 0;white-space:nowrap;font:600 7pt/1 'DM Sans';letter-spacing:.24em;text-transform:uppercase;color:#F3EEE6}
.f .rail .ref{position:absolute;bottom:8mm;left:0;right:0;font:500 5.8pt/1.4 'DM Sans';color:#9fb0aa}
.f .hd{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:4.5mm;border-bottom:.3mm solid #0E1B1A;padding-bottom:2.4mm}
.f h1{font-size:20pt}
.f .hd .r{text-align:right;font:500 7.2pt/1.45 'DM Sans';color:#5f6866}
.f .ft{position:absolute;left:30mm;right:12mm;bottom:5.5mm;display:flex;justify-content:space-between;font:400 6.4pt/1 'DM Sans';color:#7a817f}
.note{border-left:1.4mm solid #C9A96E;background:#F7F3EA;padding:2.6mm 3.4mm;font-size:7.9pt;line-height:1.45;margin:0 0 3mm}
.note.warn{border-left-color:#8a2f2f;background:#F8EFEE}
.tick{display:inline-block;width:3.6mm;height:3.6mm;border:.35mm solid #0E1B1A;border-radius:.5mm;vertical-align:middle}
.lines div{border-bottom:.25mm solid #b9bfbd;height:7.2mm;font:600 6.4pt/7.2mm 'DM Sans';letter-spacing:.1em;text-transform:uppercase;color:#7a817f}
'''

CHECK = '''() => {
  const bad = [];
  document.querySelectorAll('.pg').forEach((pg, i) => {
    const r = pg.getBoundingClientRect();
    pg.querySelectorAll('*').forEach(e => {
      if (e.closest('svg') && e.tagName.toLowerCase() !== 'svg') return;
      if (e.closest('.bleed')) return;
      const b = e.getBoundingClientRect();
      if (!b.width || !b.height) return;
      if (b.bottom > r.bottom - 3 || b.right > r.right + 0.5 || b.left < r.left - 0.5)
        bad.push('page ' + (i + 1) + ': ' + (e.className || e.tagName) + ' ' + (e.textContent || '').trim().slice(0, 50));
    });
    // a multi-column block that overflows its height shows extra columns to the right
    pg.querySelectorAll('.terms').forEach(t => { if (t.scrollWidth > t.clientWidth + 2) bad.push('page ' + (i + 1) + ': terms run past 3 columns'); });
  });
  return bad;
}'''


# ------------------------------------------------------------------ shared bits
def sample_tag(p):
    return '<span class="sample">SAMPLE</span>' if p.get('sample') else ''


def c_page(p, title, kicker, body, n):
    return ('<section class="pg c"><div class="hd"><div><div class="kick">%s</div><h1>%s%s</h1></div>'
            '<div class="r">%s<br>%s</div></div>%s'
            '<div class="ft"><span>ABJ Kitchens &amp; Bedrooms · %s · %s</span><span>%s · page %d</span></div></section>') % (
        E(kicker), E(title), sample_tag(p), E(p['project']), E(refline(p)), body, E(ADDR), PHONE, SHORT, n)


def refline(p):
    return ' · '.join(x for x in (p.get('ref'), p.get('version')) if x)


def quote_check(q):
    """Add up the quote's lines and report any total that does not match (the quote is printed as written either way)."""
    num = lambda v: float(re.sub(r'[^0-9.]', '', v)) * (-1 if re.match(r'\s*[-−–]', v) else 1)
    warn, grand = [], 0
    for sec in q['sections']:
        if sec.get('items') and sec.get('total'):
            t = sum(num(a) for _, a in sec['items'])
            if abs(t - num(sec['total'][1])) > 0.005: warn.append('%s: lines add up to £%.2f, total says %s' % (sec['title'], t, sec['total'][1]))
        if sec.get('total'): grand += num(sec['total'][1])
    if q.get('summary') and abs(grand - num(q['summary'][0][1])) > 0.005:
        warn.append('grand total: sections add up to £%.2f, quote says %s' % (grand, q['summary'][0][1]))
    return warn


def quote_page(p, n):
    q = p['quote']
    money = lambda a, b, strong=False: '<tr%s><td>%s</td><td style="text-align:right;white-space:nowrap">%s</td></tr>' % (' class="tot"' if strong else '', E(a), E(b))
    def sec(x):
        h = ['<div class="qsec"><h3>%s</h3>' % E(x['title'])]
        if x.get('lines'): h.append('<p class="ql">%s</p>' % '<br>'.join(E(l) for l in x['lines']))
        if x.get('bullets'): h.append('<ul class="qb">%s</ul>' % ''.join('<li>%s</li>' % E(l) for l in x['bullets']))
        rows = ''.join(money(a, b) for a, b in x.get('items', []))
        if x.get('total'): rows += money(x['total'][0], x['total'][1], True)
        if rows: h.append('<table class="qt">%s</table>' % rows)
        if x.get('note'): h.append('<div class="note" style="margin:2mm 0 0">%s</div>' % E(x['note']))
        h.append('</div>')
        return ''.join(h)
    S = q['sections']
    half = q.get('split', (len(S) + 1) // 2)
    summ = ''.join('<tr><td>%s</td><td style="text-align:right;white-space:nowrap">%s</td></tr>' % (E(a), E(b)) for a, b in q.get('summary', []))
    body = '''<div class="cols" style="grid-template-columns:1fr 1fr;gap:9mm;align-items:start">
<div><p style="font-size:8.6pt">%s</p>%s</div>
<div>%s
 <div class="card dark" style="margin-top:2mm"><h3 style="color:#C9A96E">Summary of costs</h3><table class="qsum">%s</table></div>
 <p class="mute" style="font-size:7pt;margin-top:3mm"><b>%s.</b> %s</p></div>
</div>''' % (E(q['intro']), ''.join(sec(x) for x in S[:half]), ''.join(sec(x) for x in S[half:]), summ,
             E(q.get('notice_title', 'Important notice')), E(q.get('notice', '')))
    return c_page(p, q.get('title', 'Your quotation'), 'Your quotation', body, n)


def renders_page(p, n):
    R = p['renders'][1:5]
    cells = ''.join('<div style="border-radius:2mm;background:url(%s) center/cover"></div>' % pic(r, 130, 71, q=82, ppm=8) for r in R)
    if len(R) == 3:
        cells += ('<div class="card" style="display:flex;flex-direction:column;justify-content:center"><h3>Your design in 3D</h3>'
                  '<p style="font-size:8.6pt">These views are rendered from your design, so you can see how the finishes, handles and worktops work together before anything is made.</p>'
                  '<p class="mute" style="font-size:7.6pt;margin:0">3D views are a guide to the look of your kitchen. Lighting, colours and props such as furniture and appliances shown may differ from the finished room.</p>%s</div>' % (('<div class="note" style="margin:3mm 0 0">%s</div>' % E(p['renders_note'])) if p.get('renders_note') else ''))
    body = '<div style="display:grid;grid-template-columns:1fr 1fr;grid-template-rows:71mm 71mm;gap:5mm">%s</div>' % cells
    return c_page(p, 'Your design in 3D', 'How your kitchen will look', body, n)


def f_page(p, stage, label, title, body, n):
    return ('<section class="pg f"><div class="rail bleed"><div class="st">%s</div><div class="lab">%s</div>'
            '<div class="ref">%s</div></div><div class="hd"><div><div class="kick">Fitter\'s pack · %s</div><h1>%s%s</h1></div>'
            '<div class="r">%s<br>%s · %s</div></div>%s'
            '<div class="ft"><span>Sizes in mm unless marked · check every size on site before cutting</span>'
            '<span>%s · fitter\'s pack page %d</span></div></section>') % (
        E(stage), E(label), E(p['ref']), E(p['project']), E(title), sample_tag(p), E(p['address']), E(p['ref']), E(p['version']), body, E(p['ref']), n)


def size_cm(u, H):
    h = {'base': H['base'], 'appliance': H['base'], 'island': H['base'], 'wall': H['wall'], 'tall': H['tall']}.get(u['cat'])
    if h is None:
        return '%s cm wide' % cm(u['w']) if u['w'] > 30 else '%s cm' % cm(u['w'])
    return '%s × %s × %s' % (cm(u['w']), cm(h), cm(u['d']))


def size_mm(u, H):
    h = {'base': H['base'], 'appliance': H['base'], 'island': H['base'], 'wall': H['wall'], 'tall': H['tall']}.get(u['cat'])
    if h is None:
        return '%d × %d' % (u['w'], u['d'])
    return '%d × %d × %d' % (u['w'], h, u['d'])


GROUPS = [('Wall A run', lambda u: u.get('wall') == 'A' and u['cat'] in ('base', 'appliance', 'panel')),
          ('Wall D run', lambda u: u.get('wall') == 'D' and u['cat'] in ('base', 'filler')),
          ('Tall units', lambda u: u['cat'] == 'tall'),
          ('Wall units', lambda u: u['cat'] == 'wall'),
          ('Island', lambda u: 'x' in u)]


def unit_rows(p, us, mm=False, tick=False, detail=True):
    H = p['heights']
    rows = []
    for u in sorted(us, key=lambda u: u['n']):
        sz = size_mm(u, H) if mm else size_cm(u, H)
        d = ('<br><span class="mute">%s</span>' % E(u['detail'])) if detail else ''
        rows.append('<tr><td class="n"><span class="num">%s</span></td><td><b>%s</b>%s</td><td style="white-space:nowrap">%s</td>%s</tr>' % (
            u['n'], E(u['name']), d, sz, '<td><span class="tick"></span></td>' if tick else ''))
    return ''.join(rows)


def grouped_table(p, groups, mm=False):
    out = ['<table class="tbl"><tr><th></th><th>Item</th><th>%s</th></tr>' % ('W × H × D mm' if mm else 'Size W × H × D cm')]
    for g, f in groups:
        us = [u for u in p['units'] if f(u)]
        if not us: continue
        out.append('<tr class="grp"><td colspan="3">%s</td></tr>' % E(g))
        out.append(unit_rows(p, us, mm))
    out.append('</table>')
    return ''.join(out)


def item_table(rows, head=('', 'Item', ''), by=True):
    out = ['<table class="tbl"><tr><th></th><th>%s</th><th>%s</th></tr>' % (E(head[1]), E(head[2]))]
    for r in rows:
        tag = ''
        if by and 'by' in r:
            tag = '<span class="by%s">%s</span>' % (' you' if r['by'] == 'Customer' else '', 'Supplied by you' if r['by'] == 'Customer' else 'Supplied by ABJ')
        right = r.get('qty') or r.get('at', '')
        out.append('<tr><td class="n"><span class="num g">%s</span></td><td><b>%s</b>%s</td><td style="white-space:nowrap">%s</td></tr>' % (
            E(r['n']), E(r['name']), (' ' + tag) if tag else '', E(right)))
    out.append('</table>')
    return ''.join(out)


def worktop_rows(p, mm=False):
    out = ['<table class="tbl"><tr><th></th><th>Piece</th><th>%s</th></tr>' % ('L × D × T mm' if mm else 'Size L × D cm')]
    for w in p['worktops']:
        sz = '%d × %d × %d' % (w['len'], w['dep'], w['thk']) if mm else '%s × %s' % (cm(w['len']), cm(w['dep']))
        out.append('<tr><td class="n"><span class="num g">%s</span></td><td><b>%s</b><br><span class="mute">%s · %s</span></td><td style="white-space:nowrap">%s</td></tr>' % (
            E(w['n']), E(w['name']), E(w['cut']), E(w['edge']), sz))
    out.append('</table>')
    return ''.join(out)


def terms_blocks():
    out = []
    for line in open(os.path.join(HERE, 'data', 'terms.txt'), encoding='utf-8').read().splitlines():
        m = re.match(r'\[(H1|H2|H3|P)\] (.*)', line)
        if not m: continue
        out.append((m.group(1), m.group(2)))
    return out


def terms_pages(p, start_n, npages=4):
    blocks = [b for b in terms_blocks() if b[0] != 'H1']
    total = sum(len(x) + 60 for _, x in blocks)
    pages, cur, done = [], [], 0
    for t, x in blocks:
        w = len(x) + 60
        # start a new page once this one has its share, but never straight after a heading
        if cur and len(pages) < npages - 1 and done + w / 2 > total * (len(pages) + 1) / npages and cur[-1][0] == 'P':
            pages.append(cur); cur = []
        cur.append((t, x)); done += w
    pages.append(cur)
    out = []
    for i, pg in enumerate(pages):
        h = []
        for t, x in pg:
            if t == 'H2': h.append('<h2>%s</h2>' % E(x))
            elif t == 'H3': h.append('<h3>%s</h3>' % E(x))
            else: h.append('<p%s>%s</p>' % (' class="lead"' if i == 0 and len(h) < 2 else '', E(x)))
        body = '<div class="terms" style="height:150mm">%s</div>' % ''.join(h)
        out.append(c_page(p, 'Terms and conditions' + (' (continued)' if i else ''), 'The terms that apply to every order', body, start_n + i))
    return out


# ------------------------------------------------------------------ customer pack
def fit_img(path, wmm, hmm, crop=None, ppm=10):
    """A drawing (plan or wall view) shown whole, as large as fits in wmm x hmm."""
    im = Image.open(path).convert('L')
    if crop:
        W, H = im.size; im = im.crop((round(crop[0] * W), round(crop[1] * H), round(crop[2] * W), round(crop[3] * H)))
    k = min(wmm / im.width, hmm / im.height)
    w, h = im.width * k, im.height * k
    if im.width > w * ppm: im = im.resize((round(w * ppm), round(h * ppm)), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return '<img src="data:image/png;base64,%s" style="width:%.1fmm;height:%.1fmm;display:block;margin:0 auto">' % (base64.b64encode(buf.getvalue()).decode(), w, h)


def design_page(p, d, n):
    """One page of the designer's own drawings: images stacked on the left, a short guide on the right."""
    im = d['images']
    gap, lab = 4, 6
    each = (150 - gap * (len(im) - 1)) / len(im)
    cells = ''.join('<div style="height:%.1fmm;background:#fff;border:.25mm solid rgba(14,27,26,.12);border-radius:2mm;padding:2mm 3mm;box-sizing:border-box%s">'
                    '<div style="font:600 6.6pt/%dmm \'DM Sans\';letter-spacing:.13em;text-transform:uppercase;color:#a7864c">%s</div>%s</div>' % (
                        each, ';margin-top:%dmm' % gap if i else '', lab, E(x.get('label', '')), fit_img(x['src'], 196, each - lab - 5, x.get('crop')))
                    for i, x in enumerate(im))
    c = d.get('card', {})
    side = '<div class="card"><h3>%s</h3>%s%s%s</div>' % (
        E(c.get('title', 'How to read this page')), ''.join('<p style="font-size:8.2pt">%s</p>' % E(t) for t in c.get('text', [])),
        ('<table class="spec">%s</table>' % ''.join('<tr><td>%s</td><td>%s</td></tr>' % (E(a), E(b)) for a, b in c['facts'])) if c.get('facts') else '',
        ('<p class="mute" style="font-size:7.4pt;margin:3mm 0 0">%s</p>' % E(c['small'])) if c.get('small') else '')
    body = '<div class="cols" style="grid-template-columns:1fr 62mm"><div>%s</div><div>%s</div></div>' % (cells, side)
    return c_page(p, d['title'], d.get('kicker', 'Your design drawings'), body, n)


def included_page(p, n):
    """What is in the price, as plain lists (for projects without full unit data)."""
    I = p['included']
    def grp(g):
        rows = ''.join('<tr><td><b>%s</b></td><td style="text-align:right;white-space:nowrap">%s</td></tr>' % (E(a), E(b)) for a, b in g.get('rows', []))
        return '<div style="margin-bottom:5mm"><h2>%s</h2>%s%s%s</div>' % (
            E(g['title']), ('<table class="tbl">%s</table>' % rows) if rows else '',
            ('<ul style="margin:1mm 0 0 4mm;font-size:8.2pt;line-height:1.6">%s</ul>' % ''.join('<li>%s</li>' % E(x) for x in g['bullets'])) if g.get('bullets') else '',
            ('<div class="note%s" style="margin:3mm 0 0">%s</div>' % (' warn' if g.get('warn') else '', E(g['note']))) if g.get('note') else '')
    cols = ''.join('<div>%s</div>' % ''.join(grp(g) for g in col) for col in I['columns'])
    body = '<div class="cols" style="grid-template-columns:%s;gap:8mm;align-items:start">%s</div>' % (' '.join(['1fr'] * len(I['columns'])), cols)
    return c_page(p, I.get('title', "What's included"), I.get('kicker', 'Everything in your price'), body, n)


def customer(p):
    H, room = p.get('heights'), p.get('room')
    has_plan = bool(p.get('units'))
    pages = []
    # 1 cover
    photo = pic(p['renders'][0] if p.get('renders') else p['cover_photo'], 185, 210, p.get('cover_pos', '50% 50%'))
    logo = b64(LOGO, 'image/png') if LOGO else ''
    pages.append('''<section class="pg" style="background:#0E1B1A;color:#F3EEE6">
<div class="bleed" style="position:absolute;left:0;top:0;bottom:0;width:112mm;padding:16mm 14mm 14mm 17mm">
 <img src="%s" style="width:24mm;height:24mm;border-radius:50%%;display:block">
 <div class="kick" style="margin-top:12mm;color:#C9A96E">ABJ Kitchens &amp; Bedrooms</div>
 <div class="serif" style="font-size:40pt;line-height:1;margin-top:4mm;font-weight:400">Your kitchen<br><i style="color:#C9A96E">pack</i></div>
 <div style="margin-top:7mm;font-size:10.5pt;line-height:1.45">%s%s</div>
 <table style="margin-top:9mm;border-collapse:collapse;font-size:8.4pt;line-height:1.55;width:100%%">%s</table>
 <div style="position:absolute;left:17mm;right:14mm;bottom:13mm;font:500 7.6pt/1.6 'DM Sans';color:#9fb0aa;border-top:.3mm solid rgba(201,169,110,.45);padding-top:3mm">Designed, made in our Peterborough workshop<br>and fitted by our own team.</div>
</div>
<div class="bleed" style="position:absolute;right:0;top:0;width:185mm;height:210mm;background:url(%s) center/cover"></div>
<div class="bleed" style="position:absolute;right:6mm;bottom:6mm;max-width:90mm;font:400 6.8pt/1.4 'DM Sans';color:#fff;background:rgba(14,27,26,.62);padding:1.6mm 2.4mm;border-radius:1mm">%s</div>
</section>''' % (logo, E(p['project']), sample_tag(p),
                 ''.join('<tr><td style="color:#C9A96E;font:600 6.4pt/1.9 \'DM Sans\';letter-spacing:.14em;text-transform:uppercase;width:28mm;vertical-align:top">%s</td><td>%s</td></tr>' % (E(a), E(b)) for a, b in (
                     ('Prepared for', p.get('client')), ('Address', p.get('address')), ('Your designer', p.get('designer')),
                     ('Reference', refline(p)), ('Issued', p.get('issued'))) if b),
                 photo, E(p.get('cover_note', ''))))
    n = 2
    # 2 welcome + design at a glance
    spec = ''.join('<tr><td>%s</td><td>%s</td></tr>' % (E(a), E(b)) for a, b in p['style'])
    body = '''<div class="cols" style="grid-template-columns:96mm 1fr">
<div>
 <h2>Everything about your kitchen, in one place</h2>
 <p>This pack brings your design together: how your kitchen will look, everything that is included, how we make and fit it, and the terms that apply.</p>
 <p>Your cabinets are made to measure in our Peterborough workshop and fitted by our own team, so one company looks after your kitchen from the first measure to the final handover.</p>
 <p>Please check every page. If anything is not as you expect, tell your designer before you sign off the design. Changes are easiest to make now.</p>
 <div class="card dark" style="margin-top:5mm">
  <h3 style="color:#C9A96E">Your ABJ team</h3>
  <table style="border-collapse:collapse;font-size:8.4pt;line-height:1.75">
   <tr><td style="width:27mm;color:#9fb0aa">Designer</td><td>%s</td></tr>
   <tr><td style="color:#9fb0aa">Showroom</td><td>%s</td></tr>
   <tr><td style="color:#9fb0aa">WhatsApp</td><td>%s (photos and quick questions)</td></tr>
   <tr><td style="color:#9fb0aa">Email</td><td>%s</td></tr>
   <tr><td style="color:#9fb0aa">Visit us</td><td>%s</td></tr>
  </table>
 </div>
</div>
<div class="card"><h3>Your design at a glance</h3><table class="spec">%s</table></div>
</div>''' % (E(p['designer']), PHONE, WA, EMAIL, E(ADDR), spec)
    pages.append(c_page(p, 'Welcome to your kitchen', 'Your design at a glance', body, n)); n += 1
    if p.get('renders') and len(p['renders']) > 1:
        pages.append(renders_page(p, n)); n += 1
    for d in p.get('design_pages', []):
        pages.append(design_page(p, d, n)); n += 1
    if not has_plan:
        if p.get('included'):
            pages.append(included_page(p, n)); n += 1
        if p.get('quote'):
            pages.append(quote_page(p, n)); n += 1
        return customer_rest(p, pages, n)
    # 3 floor plan
    isl = [u for u in p['units'] if u['cat'] == 'island']
    wA = min(u['y'] for u in isl) - 560 if isl else 0
    wD = min(u['x'] for u in isl) - 18 - 560 if isl else 0
    legend = ''.join('<div class="sw" style="background:%s%s"></div><div>%s</div>' % (c, ';border-style:dashed' if d else '', t) for c, d, t in (
        (draw.FILL['base'], 0, 'Base cabinets (under the worktop)'), (draw.FILL['tall'], 0, 'Tall cabinets'),
        (draw.FILL['wall'], 1, 'Wall cabinets (above the worktop)'), (draw.FILL['island'], 0, 'Island cabinets')))
    body = '''<div class="cols" style="grid-template-columns:1fr 70mm">
<div style="height:150mm">%s</div>
<div>
 <div class="card" style="margin-bottom:4mm"><h3>How to read your plan</h3><div class="legend">%s
  <div style="height:1.2mm;background:#C9A96E;margin:0 0 0 0"></div><div>Gold edge: the side the doors and drawers open</div>
  <div style="height:4.2mm;border:.35mm dashed #C9A96E"></div><div>Island worktop and seating area</div></div>
  <p class="mute" style="margin:3mm 0 0;font-size:7.6pt">Seen from above. Sizes in centimetres.</p></div>
 <div class="card"><h3>Key measurements</h3><table class="spec">
  <tr><td>Room</td><td>%s × %s cm</td></tr><tr><td>Ceiling height</td><td>%s cm</td></tr>
  <tr><td>Worktop height</td><td>%s cm</td></tr><tr><td>Walkway to island</td><td>%s cm and %s cm</td></tr></table></div>
</div></div>''' % (draw.plan(p, 'overview', 'cm'), legend, cm(room['w']), cm(room['d']), cm(room['h']),
                   cm(H['plinth'] + H['base'] + H['worktop']), cm(wA), cm(wD))
    pages.append(c_page(p, 'Your floor plan', 'The layout of your room', body, n)); n += 1
    # 4 elevations
    body = '''<div class="cols" style="grid-template-columns:1fr 62mm">
<div><div style="height:74mm">%s</div><div style="height:74mm;margin-top:3mm">%s</div></div>
<div>
 <div class="card"><h3>Your walls, face on</h3>
 <p style="font-size:8.2pt">These views show each wall as if you were standing in the room looking at it: the cabinets, the worktop and the space between them.</p>
 <p style="font-size:8.2pt"><b>Wall A</b> is the window wall, with the sink.<br><b>Wall D</b> has the hob, the ovens and the fridge freezer.</p>
 <p class="mute" style="font-size:7.6pt;margin:0">Sizes in centimetres. Hatched areas belong to the next wall, seen end-on.</p></div>
 <div class="card" style="margin-top:4mm"><h3>Heights</h3><table class="spec">
  <tr><td>Plinth</td><td>%s cm</td></tr><tr><td>Worktop</td><td>%s cm from the floor</td></tr>
  <tr><td>Wall cabinets</td><td>%s to %s cm</td></tr></table></div>
</div></div>''' % (draw.elevation(p, 'A', 'cm', numbers=False), draw.elevation(p, 'D', 'cm', numbers=False),
                   cm(H['plinth']), cm(H['plinth'] + H['base'] + H['worktop']), cm(H['wall_bottom']), cm(H['wall_bottom'] + H['wall']))
    pages.append(c_page(p, 'Your walls', 'Wall A and wall D', body, n)); n += 1
    # 5 cabinetry
    body = '<div class="cols" style="grid-template-columns:1fr 1fr 1fr;gap:6mm;align-items:start"><div>%s</div><div>%s</div><div>%s</div></div>' % (
        grouped_table(p, [GROUPS[0], GROUPS[2]]), grouped_table(p, [GROUPS[3], GROUPS[4]]), grouped_table(p, [GROUPS[1]]) +
        '<div class="card" style="margin-top:6mm"><h3>Reading the sizes</h3><p style="font-size:7.9pt;margin:0">Width × height × depth in centimetres. The numbers match the numbered squares on your plans, so you can find every cabinet in the room.</p></div>')
    pages.append(c_page(p, "What's included: cabinets", 'Every cabinet, panel and filler, numbered as on the plans', body, n)); n += 1
    # 6 appliances etc
    sup = ''.join('<li>%s</li>' % E(x) for x in p.get('customer_supplied', []))
    body = '''<div class="cols" style="grid-template-columns:1fr 1fr 1fr">
<div><h2>Appliances</h2>%s<h2 style="margin-top:5mm">Sink and tap</h2>%s</div>
<div><h2>Worktops</h2>%s</div>
<div><h2>Lighting</h2>%s<h2 style="margin-top:5mm">Finishing</h2>%s
 <div class="card" style="margin-top:5mm"><h3>Supplied by you</h3><ul style="margin-left:4mm;font-size:8pt">%s</ul></div></div>
</div>''' % (item_table(p['appliances'], ('', 'Appliance', 'Fitted in')), item_table(p['sink'], ('', 'Item', 'Fitted in')),
             worktop_rows(p), item_table(p['lighting'], ('', 'Item', 'Qty'), by=False), item_table(p['trims'], ('', 'Item', 'Qty'), by=False), sup)
    pages.append(c_page(p, "What's included: appliances, worktops and finishing", 'The rest of your kitchen', body, n)); n += 1
    if p.get('quote'):
        pages.append(quote_page(p, n)); n += 1
    return customer_rest(p, pages, n)


def customer_rest(p, pages, n):
    # 7 journey
    steps = [('Survey and measure', 'Our surveyor visits, measures the room and talks through what you want.'),
             ('Your design', 'Your designer turns the survey into your 3D design and an itemised quotation.'),
             ('Sign-off and deposit', 'You sign off the final design. The 50% deposit secures your production slot.'),
             ('Made in Peterborough', 'We make your cabinets in our own workshop. Fitting typically begins 4–6 weeks after sign-off.'),
             ('Delivery and fitting', 'Our own team fits your kitchen, typically in 1–2 weeks. The 50% balance is due the day before delivery, or on the day at the latest.'),
             ('Stone worktops', 'If you chose quartz or granite, our stone technicians laser-template once the cabinets are in. Worktops go in within 7–10 working days.'),
             ('Handover and aftercare', 'We walk you through your new kitchen. Your minimum 12-month guarantee runs from delivery.')]
    st = ''.join('<div class="step"><div class="dot">%d</div><h4>%s</h4><p>%s</p></div>' % (i + 1, E(a), E(b)) for i, (a, b) in enumerate(steps))
    body = '''<p style="max-width:170mm;font-size:9.6pt">From the first measure to the day we hand over, here is what happens and when. Your designer will confirm the dates for your kitchen.</p>
<div class="steps">%s</div>
<div class="cols" style="grid-template-columns:1fr 1fr;margin-top:9mm">
<div class="card"><h3>One team, start to finish</h3><p style="font-size:8.4pt;margin:0">The people who design your kitchen work alongside the people who make it and fit it. If you have a question at any stage, call the showroom or message us on WhatsApp and we will put you through to the right person.</p></div>
<div class="card"><h3>Before you sign off</h3><p style="font-size:8.4pt;margin:0">Your cabinets are made to your exact sizes, so production only starts once you have signed off the final design and the deposit has cleared. Read the bespoke goods note on the payment page before you sign.</p></div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm;margin-top:6mm">%s</div>''' % (st, ''.join(
        '<div style="height:44mm;border-radius:2mm;background:url(%s) center/cover"></div>' % pic(x, 85, 44, pos) for x, pos in (
            ('kc-kr-island-l', '50% 50%'), ('kc-detail-l', '50% 50%'), ('abj-worktops-t-quartz', '50% 50%'))))
    pages.append(c_page(p, 'Your journey', 'From survey to handover', body, n)); n += 1
    # 8 getting ready
    prep = ['Clear the room: empty the cupboards and move anything you want to keep out of the kitchen.',
            'Let us know about parking and access for our van, and the easiest way in for long worktops and tall cabinets.',
            'Plan where you will cook and wash up while the kitchen is out of action.',
            'Keep children and pets away from the work area while we are fitting.',
            'Tell your designer about anything that has changed in the room since the survey, such as new sockets, pipes or flooring.',
            'If you are supplying an appliance yourself, have it on site and boxed before fitting starts.',
            'Check with your designer whether new flooring goes down before or after the kitchen.']
    days = [('Day one', 'We protect your floors, check every delivery against your item list and start with the base cabinets.'),
            ('During fitting', 'Base, tall and wall cabinets go in, then the island, appliances, sink and lighting.'),
            ('Worktops', 'Laminate and timber tops are fitted by our team. Stone is templated, made and fitted within 7–10 working days.'),
            ('Finishing', 'Plinths, panels and lighting are finished, everything is adjusted and the room is cleaned.')]
    body = '''<div class="cols" style="grid-template-columns:1fr 1fr">
<div class="card"><h3>Getting ready</h3><ul class="chk">%s</ul></div>
<div><div class="card dark"><h3 style="color:#C9A96E">What happens on fitting days</h3>%s</div>
<div class="note" style="margin-top:4mm">The 50%% balance is due by cleared funds the day before delivery, or on the day of delivery at the latest. Delivery and fitting cannot go ahead until it has cleared.</div></div>
</div>''' % (''.join('<li>%s</li>' % E(x) for x in prep),
             ''.join('<div style="margin:0 0 3mm"><b style="color:#F3EEE6">%s</b><br><span style="color:#c9d3cf;font-size:8.3pt">%s</span></div>' % (E(a), E(b)) for a, b in days))
    pages.append(c_page(p, 'Getting ready for fitting', 'A smooth fit starts before we arrive', body, n)); n += 1
    # 9 aftercare
    faq = {q['q']: q['a'] for q in json.load(open(os.path.join(HERE, 'data', 'faq.json'), encoding='utf-8'))}
    terms = dict((x[:3], x) for t, x in terms_blocks() if t == 'P' and re.match(r'\d+\.\d', x))
    care = [('Doors and panels', 'Wipe with a soft, damp cloth and dry. Avoid abrasive pads, polish and strong cleaners, especially on matt finishes.'),
            ('Quartz worktops', 'Use a chopping board and trivets for hot pans. Clean with warm, soapy water and wipe up spills such as wine, oil and lemon juice promptly.'),
            ('Hinges and drawers', 'Doors and drawers can be fine-tuned. If one drops out of line, call us and we will adjust it.'),
            ('Around the sink', 'Dry standing water along joints and edges, and do not leave wet cloths over cabinet doors.')]
    body = '''<div class="cols" style="grid-template-columns:1fr 1fr">
<div>
 <div class="card dark"><h3 style="color:#C9A96E">Your guarantee</h3><p style="font-size:9pt">%s</p></div>
 <div class="card" style="margin-top:4mm"><h3>If something is not right</h3>
  <p style="font-size:8.2pt">Call %s, message us on WhatsApp (%s) or email %s. Send a photo if you can.</p>
  <p style="font-size:7.8pt" class="mute">From our terms: %s</p></div>
 <div style="height:52mm;border-radius:2mm;margin-top:4mm;background:url(%s) center/cover"></div>
</div>
<div class="card"><h3>Looking after your kitchen</h3>%s</div>
</div>''' % (E(faq['What guarantee do you give?']), PHONE, WA, EMAIL, E(terms.get('8.3', '')), pic('kc-kr-light-l', 125, 52, '50% 62%'),
             ''.join('<div style="margin:0 0 3.4mm"><b>%s</b><br><span style="font-size:8.3pt;color:#3d4644">%s</span></div>' % (E(a), E(b)) for a, b in care))
    pages.append(c_page(p, 'Aftercare and your guarantee', 'Looking after your kitchen', body, n)); n += 1
    # 10 questions (answers word for word from the website FAQ)
    qs = ['How long is the typical lead time from design to installation?', 'Do you provide quartz, granite and timber worktops?',
          'What materials are your cabinets made from?', 'Which appliance brands can I integrate into my design?',
          'Can you handle structural changes or plastering?', 'Do you offer flexible finance or interest-free credit?']
    half = len(qs) // 2
    col = lambda L: ''.join('<div class="qa"><h4>%s</h4><p>%s</p></div>' % (E(q), E(faq[q])) for q in L)
    body = '<div class="cols" style="grid-template-columns:1fr 1fr">%s%s</div>' % ('<div class="card">%s</div>' % col(qs[:half]), '<div class="card">%s</div>' % col(qs[half:]))
    pages.append(c_page(p, 'Questions customers often ask', 'Answers from our team', body, n)); n += 1
    # 11 payment, finance and sign-off
    pay = [x for t, x in terms_blocks() if t == 'P'][:0]
    tb = terms_blocks()
    find = lambda start: next(x for t, x in tb if x.startswith(start))
    bespoke = next(x for t, x in tb if x.startswith('"I understand and agree'))
    fin = next(x for t, x in tb if x.startswith('AB Joinery Kitchens & Bedrooms Limited is an introducer'))
    body = '''<div class="cols" style="grid-template-columns:1fr 1fr">
<div>
 <div class="card"><h3>Paying for your kitchen</h3>
  <p style="font-size:8.4pt"><b>Deposit.</b> %s</p>
  <p style="font-size:8.4pt"><b>Balance.</b> %s %s</p>
  <p style="font-size:8.4pt;margin:0"><b>Finance.</b> 0%% interest-free credit is available through Ideal4Finance on orders of £6,000 or more with a 50%% deposit, subject to status. Ask your designer for a quote.</p></div>
 <p class="mute" style="font-size:6.9pt;margin-top:3mm">%s</p>
</div>
<div class="card dark"><h3 style="color:#C9A96E">Design sign-off</h3>
 <p style="font-size:8.4pt">%s</p>
 <div style="border:.3mm solid rgba(201,169,110,.6);border-radius:1.5mm;padding:3mm 3.4mm;font-size:8pt;color:#e8e1d3;margin-top:3mm"><b style="color:#C9A96E">Bespoke goods.</b> %s</div>
 <div class="sig" style="margin-top:12mm"><div style="border-color:#C9A96E;color:#9fb0aa">Signed</div><div style="border-color:#C9A96E;color:#9fb0aa">Name</div><div style="border-color:#C9A96E;color:#9fb0aa">Date</div></div>
 <div class="sig" style="margin-top:12mm"><div style="border-color:#C9A96E;color:#9fb0aa">For ABJ Kitchens &amp; Bedrooms</div><div style="border-color:#C9A96E;color:#9fb0aa">Name</div><div style="border-color:#C9A96E;color:#9fb0aa">Date</div></div>
</div></div>''' % (E(find('4.1 ').replace('4.1 ', '')), E(find('The remaining 50% balance')), E(find('Delivery, installation, or collection will NOT')),
                   E(fin), E(p.get('signoff') or ('I have checked the plans, wall views and item lists in this pack (reference %s) and approve the design for production.' % refline(p))), E(bespoke))
    pages.append(c_page(p, 'Payment, finance and sign-off', 'Before production starts', body, n)); n += 1
    # 12+ terms
    tp = terms_pages(p, n); pages += tp; n += len(tp)
    # back cover
    pages.append('''<section class="pg" style="background:#0E1B1A;color:#F3EEE6;padding:22mm 24mm">
 <img src="%s" style="width:22mm;height:22mm;border-radius:50%%;display:block">
 <div class="serif" style="font-size:34pt;line-height:1.05;margin-top:10mm;max-width:150mm">Questions about your design?<br><i style="color:#C9A96E">We are here to help.</i></div>
 <table style="margin-top:12mm;border-collapse:collapse;font-size:10pt;line-height:2">
  <tr><td style="width:34mm;color:#C9A96E;font:600 6.8pt/2.9 'DM Sans';letter-spacing:.16em;text-transform:uppercase">Showroom</td><td>%s</td></tr>
  <tr><td style="color:#C9A96E;font:600 6.8pt/2.9 'DM Sans';letter-spacing:.16em;text-transform:uppercase">WhatsApp</td><td>%s</td></tr>
  <tr><td style="color:#C9A96E;font:600 6.8pt/2.9 'DM Sans';letter-spacing:.16em;text-transform:uppercase">Email</td><td>%s</td></tr>
  <tr><td style="color:#C9A96E;font:600 6.8pt/2.9 'DM Sans';letter-spacing:.16em;text-transform:uppercase">Visit</td><td>%s</td></tr>
  <tr><td style="color:#C9A96E;font:600 6.8pt/2.9 'DM Sans';letter-spacing:.16em;text-transform:uppercase">Online</td><td>%s</td></tr>
 </table>
 <div style="position:absolute;right:24mm;bottom:22mm;width:44mm;text-align:center">
  <div style="background:#F3EEE6;padding:4mm;border-radius:2mm">%s</div>
  <div style="font:500 7.2pt/1.4 'DM Sans';color:#9fb0aa;margin-top:2.4mm">Scan to visit our website</div></div>
 <div style="position:absolute;left:24mm;bottom:16mm;font:400 6.6pt/1.5 'DM Sans';color:#7f918b;max-width:170mm">AB Joinery Kitchens &amp; Bedrooms Limited · Company no. 11100736 · VAT no. 178 7286 83 · %s</div>
</section>''' % (b64(LOGO, 'image/png') if LOGO else '', PHONE, WA, EMAIL, E(ADDR), SHORT, qr_svg(SITE), E(ADDR)))
    return pages


# ------------------------------------------------------------------ fitter pack
def fitter(p):
    H, room = p['heights'], p['room']
    pages, n = [], 1
    stages = [('1', 'Base and tall units'), ('2', 'Wall units'), ('3', 'Island'), ('4', 'Elevations'),
              ('5', 'Appliances, sink and lighting'), ('6', 'Worktops and upstands'), ('7', 'Finishing'), ('8', 'Snagging and handover')]
    # job sheet
    keyh = [('Room', '%d × %d, ceiling %d' % (room['w'], room['d'], room['h'])), ('Plinth', '%d' % H['plinth']),
            ('Top of base carcass', '%d' % (H['plinth'] + H['base'])), ('Worktop height', '%d (%d thick)' % (H['plinth'] + H['base'] + H['worktop'], H['worktop'])),
            ('Wall units', 'bottom %d, top %d' % (H['wall_bottom'], H['wall_bottom'] + H['wall'])), ('Tall units', 'top %d' % (H['plinth'] + H['tall']))]
    body = '''<div class="cols" style="grid-template-columns:1fr 1fr 74mm">
<div><h3>Job</h3><table class="spec">%s</table>
 <h3 style="margin-top:5mm">Fit details</h3><div class="lines"><div>Fit start date</div><div>Fitter(s)</div><div>Expected finish</div><div>Stone templating date</div></div></div>
<div><h3>Site notes</h3><div class="lines"><div>Parking and access</div><div>Keys / alarm / who is home</div><div>Pets and children</div><div>Services: water, gas, power off points</div><div>Anything else</div></div>
 <div class="note" style="margin-top:4mm">Check the room against the plans before unloading. Any size that does not match the drawings: stop and call the office on %s before cutting anything.</div></div>
<div><h3>Key heights (mm)</h3><table class="spec">%s</table>
 <h3 style="margin-top:5mm">Stages in this pack</h3><table class="spec">%s</table></div>
</div>''' % (''.join('<tr><td>%s</td><td>%s</td></tr>' % (E(a), E(b)) for a, b in (
        ('Customer', p['client']), ('Address', p['address']), ('Reference', '%s · %s' % (p['ref'], p['version'])),
        ('Designer', p['designer']), ('Office', PHONE), ('Fitting', p['fit_weeks']))), PHONE,
        ''.join('<tr><td>%s</td><td>%s</td></tr>' % (E(a), E(b)) for a, b in keyh),
        ''.join('<tr><td>Stage %s</td><td>%s</td></tr>' % (a, E(b)) for a, b in stages))
    pages.append(f_page(p, '0', 'Job sheet', 'Job sheet', body, n)); n += 1
    # delivery check
    allu = sorted(p['units'], key=lambda u: u['n'])
    half = (len(allu) + 1) // 2
    tbl = lambda us: '<table class="tbl"><tr><th></th><th>Item</th><th>W × H × D</th><th>OK</th></tr>%s</table>' % unit_rows(p, us, mm=True, tick=True, detail=False)
    extra = p['appliances'] + p['sink'] + p['trims'] + p['lighting']
    ex = ''.join('<tr><td class="n"><span class="num g">%s</span></td><td><b>%s</b></td><td>%s</td><td><span class="tick"></span></td></tr>' % (
        E(r['n']), E(r['name']), E(r.get('qty') or r.get('at', '')), ) for r in extra)
    body = '''<div class="cols" style="grid-template-columns:1fr 1fr 1fr;gap:5mm">%s%s<div><table class="tbl"><tr><th></th><th>Appliances, sink, trims, lighting</th><th></th><th>OK</th></tr>%s</table>
<div class="note warn" style="margin-top:4mm">Note any damage on the delivery note and photograph it before the driver leaves. Report shortages to the office the same day.</div></div></div>''' % (
        tbl(allu[:half]), tbl(allu[half:]), ex)
    pages.append(f_page(p, '0', 'Delivery check', 'Delivery check', body, n)); n += 1
    # stage pages with plans
    def stage_plan(stage, label, title, layer, groups, notes, split=None):
        nb = ''.join('<div class="note">%s</div>' % E(x) for x in notes)
        if split:  # many units: smaller plan with the notes under it, table in two columns
            body = ('<div class="cols" style="grid-template-columns:104mm 1fr 1fr;gap:6mm"><div><div style="height:100mm">%s</div>'
                    '<div style="margin-top:4mm">%s</div></div><div>%s</div><div>%s</div></div>') % (
                draw.plan(p, layer, 'mm'), nb, grouped_table(p, groups[:split], mm=True), grouped_table(p, groups[split:], mm=True))
        else:
            body = '<div class="cols" style="grid-template-columns:1fr 104mm;gap:6mm"><div style="height:160mm">%s</div><div>%s<div style="margin-top:3mm">%s</div></div></div>' % (
                draw.plan(p, layer, 'mm'), grouped_table(p, groups, mm=True), nb)
        return f_page(p, stage, label, title, body, n)
    fn = p.get('fitter_notes', [])
    pages.append(stage_plan('1', 'Base and tall units', 'Stage 1 · Base and tall units', 'base',
                            [GROUPS[0], GROUPS[1], GROUPS[2]], [fn[2], fn[3]] if len(fn) > 3 else [], split=1)); n += 1
    pages.append(stage_plan('2', 'Wall units', 'Stage 2 · Wall units', 'wall', [GROUPS[3]],
                            ['Check the wall will carry a fully loaded cabinet and use fixings to suit it. Hang every wall unit on its brackets and tie neighbouring units together before loading.', fn[5]] if len(fn) > 5 else [])); n += 1
    pages.append(stage_plan('3', 'Island', 'Stage 3 · Island', 'island', [GROUPS[4]],
                            ['Fix the island to the floor through the plinth line so it cannot move when the stone top goes on. Keep the walkway sizes shown on the plan.'])); n += 1
    # elevations, one wall per page
    for w in 'AD':
        body = '<div style="height:158mm">%s</div>' % draw.elevation(p, w, 'mm')
        pages.append(f_page(p, '4', 'Elevations', 'Stage 4 · Elevation, wall %s' % w, body, n)); n += 1
    # appliances
    body = '''<div class="cols" style="grid-template-columns:1fr 104mm;gap:6mm"><div style="height:160mm">%s</div>
<div><h3>Appliances</h3>%s<h3 style="margin-top:3mm">Sink and tap</h3>%s<h3 style="margin-top:3mm">Lighting</h3>%s
<div class="note warn" style="margin-top:3mm">%s</div></div></div>''' % (
        draw.plan(p, 'appliances', 'mm'), item_table(p['appliances'], ('', 'Appliance', 'Goes in')), item_table(p['sink'], ('', 'Item', 'Goes in')),
        item_table(p['lighting'], ('', 'Item', 'Qty'), by=False), E(fn[6]) if len(fn) > 6 else '')
    pages.append(f_page(p, '5', 'Appliances, sink and lighting', 'Stage 5 · Appliances, sink and lighting', body, n)); n += 1
    # worktops
    faq = {q['q']: q['a'] for q in json.load(open(os.path.join(HERE, 'data', 'faq.json'), encoding='utf-8'))}
    body = '''<div class="cols" style="grid-template-columns:1fr 112mm;gap:6mm"><div style="height:160mm">%s</div>
<div>%s<div class="note" style="margin-top:3mm">%s</div><div class="note">Stone: %s</div></div></div>''' % (
        draw.plan(p, 'tops', 'mm'), worktop_rows(p, mm=True), E(fn[4]) if len(fn) > 4 else '', E(faq['Do you provide quartz, granite and timber worktops?']))
    pages.append(f_page(p, '6', 'Worktops and upstands', 'Stage 6 · Worktops and upstands', body, n)); n += 1
    # finishing
    body = '''<div class="cols" style="grid-template-columns:1fr 1fr;gap:8mm">
<div><h3>Plinths, panels and trims</h3>%s<h3 style="margin-top:4mm">Panels and fillers</h3>%s</div>
<div><h3>Lighting</h3>%s<h3 style="margin-top:4mm">Before you leave each day</h3><ul class="chk">
<li>Work area swept and safe; tools and offcuts away</li><li>Water and power left as you found them, or as agreed with the customer</li>
<li>Customer told what is done and what happens tomorrow</li><li>Photos of the day's work sent to the office</li></ul></div>
</div>''' % (item_table(p['trims'], ('', 'Item', 'Qty'), by=False),
             '<table class="tbl"><tr><th></th><th>Item</th><th>W × D</th></tr>%s</table>' % unit_rows(p, [u for u in p['units'] if u['cat'] in ('panel', 'filler')], mm=True),
             item_table(p['lighting'], ('', 'Item', 'Qty'), by=False))
    pages.append(f_page(p, '7', 'Finishing', 'Stage 7 · Plinths, panels and finishing', body, n)); n += 1
    # notes, snagging, handover
    snag = ['Every door and drawer aligned, gaps even, soft-close working', 'Cabinets level, fixed to the wall and tied together',
            'Worktop joints tight and sealed; sink and hob sealed', 'No leaks under the sink or at the dishwasher after a full run',
            'Every appliance powered and tested in front of the customer', 'Lights working on every run', 'End panels, fillers and plinths fitted and clean',
            'Protective film removed; cabinets wiped inside and out', 'Room swept and all packaging removed', 'Manuals and warranty cards handed to the customer']
    body = '''<div class="cols" style="grid-template-columns:1fr 1fr;gap:8mm">
<div><h3>Installer notes for this job</h3>%s</div>
<div><h3>Snagging check</h3><ul class="chk">%s</ul>
<div class="card" style="margin-top:4mm;padding:4mm 5mm"><h3>Handover</h3><p style="font-size:8pt;margin:0">The kitchen has been fitted and shown to me, and I have received the manuals and warranty information.</p>
<div class="sig" style="margin-top:10mm"><div>Customer signature</div><div>Fitter</div><div>Date</div></div></div></div>
</div>''' % (''.join('<div class="note">%s</div>' % E(x) for i, x in enumerate(fn) if i not in (2, 3, 4, 5, 6)),
             ''.join('<li>%s</li>' % E(x) for x in snag))
    pages.append(f_page(p, '8', 'Snagging and handover', 'Stage 8 · Notes, snagging and handover', body, n)); n += 1
    return pages


def render(pages, out, browser):
    doc = '<!doctype html><html><head><meta charset="utf-8"><style>%s%s</style></head><body>%s</body></html>' % (fonts(), CSS, ''.join(pages))
    pg = browser.new_page(viewport={'width': 1123, 'height': 794})
    pg.set_content(doc, wait_until='load')
    pg.evaluate('document.fonts.ready')
    bad = pg.evaluate(CHECK)
    pg.pdf(path=out, width='297mm', height='210mm', print_background=True, prefer_css_page_size=True)
    pg.close()
    return bad


def main():
    from playwright.sync_api import sync_playwright
    src, outdir = sys.argv[1], sys.argv[2]
    os.makedirs(outdir, exist_ok=True)
    p = json.load(open(src, encoding='utf-8'))
    slug = os.path.splitext(os.path.basename(src))[0]
    problems = []
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        if p.get('quote'):
            for w in quote_check(p['quote']): print('  ! quote check:', w)
        for name, fn in (('customer-pack', customer), ('fitter-pack', fitter)):
            if name == 'fitter-pack' and not p.get('units'):
                print('  (no unit data in the project file, so no fitter pack)'); continue
            out = os.path.join(outdir, '%s-%s.pdf' % (slug, name))
            bad = render(fn(p), out, b)
            print(out, os.path.getsize(out) // 1024, 'KB', 'OK' if not bad else 'PROBLEMS')
            seen = {}
            for x in bad:
                k = x.split(':')[0]
                if k not in seen: seen[k] = (x, 0)
                seen[k] = (seen[k][0], seen[k][1] + 1)
            for k, (x, c) in seen.items(): print('  ! %s (%d elements) e.g. %s' % (k, c, x[:110]))
            problems += bad
        b.close()
    sys.exit(1 if problems else 0)


if __name__ == '__main__':
    main()
