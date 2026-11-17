"""Optional customer-pack pages, each switched on by a key in the project file:
finishes, appliance_checklist, team, cross_sell, next_step, payments / finance_example (on the payment page).
Imported by build.py; uses its helpers (pic, b64, qr_svg, c_page, E)."""
import build as B

E = B.E


def img_tag(path, hmm, pos='50% 50%', radius=2):
    return '<div style="width:100%%;height:%.1fmm;border-radius:%smm;background:url(%s) %s/cover"></div>' % (
        hmm, radius, B.pic(path, 82, hmm, pos, q=90, ppm=11.8), pos)


def finishes_page(p, n):
    F = p['finishes']
    tiles = []
    for f in F['items']:
        if f.get('img'):
            sw = ('<div style="height:80mm;border-radius:2mm;background:url(%s) center/cover;'
                  'border:.25mm solid rgba(14,27,26,.15)"></div>') % B.pic(f['img'], 48, 80, f.get('pos', '50% 50%'), q=92, ppm=11.8)
        else:
            sw = ('<div style="height:80mm;border-radius:2mm;border:.35mm dashed #a7864c;display:flex;align-items:center;'
                  'justify-content:center;text-align:center;padding:4mm;font:500 8pt/1.45 \'DM Sans\';color:#5f6866;'
                  'background:repeating-linear-gradient(135deg,#F7F3EA 0 3mm,#efe8da 3mm 6mm)">%s</div>') % E(f.get('placeholder', 'See the sample at our showroom'))
        tiles.append(
            '<div>%s<div class="kick" style="margin-top:3.4mm">%s</div>'
            '<div class="serif" style="font-size:15pt;line-height:1.1;margin-top:1.4mm;color:#0E1B1A">%s</div>'
            '<p style="font-size:7.9pt;line-height:1.45;margin-top:1.4mm;color:#3d4644;min-height:12.6mm">%s</p>'
            '<div style="margin-top:2.6mm;display:flex;align-items:center;gap:2mm;font:600 6.2pt/1 \'DM Sans\';letter-spacing:.12em;'
            'text-transform:uppercase;color:#5f6866"><span class="tick"></span>Approved, initials '
            '<span style="flex:1;border-bottom:.25mm solid #b9bfbd;height:3mm"></span></div></div>' % (sw, E(f['where']), E(f['name']), E(f['text'])))
    body = ('<p style="max-width:205mm;font-size:9.4pt">%s</p>'
            '<div style="display:grid;grid-template-columns:repeat(%d,1fr);gap:5mm;margin-top:4mm">%s</div>'
            '<div class="note" style="margin-top:6mm">%s</div>') % (E(F['intro']), len(F['items']), ''.join(tiles), E(F['small']))
    return B.c_page(p, F.get('title', 'Your finishes'), F.get('kicker', 'The colours and materials you are signing off'), body, n)


def appliances_page(p, n):
    A = p['appliance_checklist']
    line = 'border-bottom:.25mm solid #b9bfbd'
    head = ('<tr><th>Appliance</th><th>Goes in</th><th style="width:34mm">Make</th><th style="width:44mm">Model number</th>'
            '<th style="width:28mm">Built-in or freestanding</th><th style="width:10mm">Sent</th></tr>')
    rows = ''.join('<tr style="height:11.2mm"><td style="vertical-align:middle"><b>%s</b></td><td style="vertical-align:middle">%s</td>'
                   '<td style="%s"></td><td style="%s"></td><td style="%s"></td><td style="vertical-align:middle"><span class="tick"></span></td></tr>' % (
                       E(a), E(b), line, line, line) for a, b in A['rows'])
    body = ('<div class="cols" style="grid-template-columns:1fr 66mm;gap:7mm;align-items:start">'
            '<div class="card" style="padding:4mm 5mm"><table class="tbl" style="font-size:8.2pt">%s%s</table></div>'
            '<div><div class="card dark"><h3 style="color:#C9A96E">Why we need these</h3>%s</div>'
            '<div class="note" style="margin-top:4mm">%s</div></div></div>') % (
        head, rows, ''.join('<p style="font-size:8.2pt;color:#e8e1d3">%s</p>' % E(x) for x in A['why']), E(A['how']))
    return B.c_page(p, A.get('title', 'Your appliance checklist'), A.get('kicker', 'What we need before production'), body, n)


def team_page(p, n):
    T = p['team']
    who = T['designer']
    revs = ''.join(
        '<div class="card" style="padding:4mm 5mm;margin-bottom:3.4mm"><div style="color:#C9A96E;font-size:9pt;letter-spacing:.12em">&#9733;&#9733;&#9733;&#9733;&#9733;</div>'
        '<p class="serif" style="font-size:12pt;line-height:1.3;color:#0E1B1A;margin:1.6mm 0">&ldquo;%s&rdquo;</p>'
        '<div style="font:600 6.6pt/1 \'DM Sans\';letter-spacing:.12em;text-transform:uppercase;color:#a7864c">%s &middot; Google review &middot; %s</div></div>' % (
            E(r['text']), E(r['name']), E(r['room'])) for r in T['reviews'])
    body = '''<div class="cols" style="grid-template-columns:1fr 1fr;gap:9mm;align-items:start">
<div>
 <div class="card dark" style="display:grid;grid-template-columns:50mm 1fr;gap:6mm;align-items:center;padding:6mm">
  <div style="width:50mm;height:62mm;border-radius:2mm;background:#F3EEE6 url(%s) center bottom/contain no-repeat"></div>
  <div><div class="kick" style="color:#C9A96E">Your designer</div>
   <div class="serif" style="font-size:24pt;line-height:1.05;margin-top:2mm">%s</div>
   <div style="font:500 8.6pt/1.45 'DM Sans';color:#C9A96E;margin-top:1.4mm">%s</div>
   <p style="font-size:8.3pt;line-height:1.5;color:#e8e1d3;margin-top:3mm">%s</p></div>
 </div>
 <div class="card" style="margin-top:4mm"><h3>Your fitting team</h3><p style="font-size:8.4pt;margin:0">%s</p></div>
</div>
<div><h3>%s</h3>%s
 <div style="display:grid;grid-template-columns:28mm 1fr;gap:5mm;align-items:center;margin-top:1mm">
  <div style="background:#fff;padding:2.4mm;border-radius:2mm;border:.25mm solid rgba(14,27,26,.12)">%s</div>
  <div><div class="serif" style="font-size:15pt;line-height:1.1;color:#0E1B1A">%s</div><p class="mute" style="font-size:7.8pt;margin:1.4mm 0 0">%s</p></div>
 </div>
</div></div>''' % (B.b64(who['photo'], 'image/png'), E(who['name']), E(who['title']), E(who['bio']), E(T['fitters']),
                    E(T.get('reviews_kick', 'What our customers say')), revs, B.qr_svg(T['reviews_url'], light='#ffffff'),
                    E(T['reviews_title']), E(T['reviews_note']))
    return B.c_page(p, T.get('title', 'Meet your team'), T.get('kicker', 'The people behind your kitchen'), body, n)


def crosssell_page(p, n):
    X = p['cross_sell']
    cards = ''.join(
        '<div class="card" style="padding:0;overflow:hidden">%s<div style="padding:4.4mm 5mm 5mm">'
        '<div class="kick">%s</div><div class="serif" style="font-size:15pt;line-height:1.12;margin-top:1.6mm;color:#0E1B1A">%s</div>'
        '<p style="font-size:8.1pt;line-height:1.5;margin:1.8mm 0 0;color:#3d4644">%s</p></div></div>' % (
            img_tag(c['img'], 70, c.get('pos', '50% 50%'), radius=0), E(c['kick']), E(c['title']), E(c['text'])) for c in X['cards'])
    body = ('<p style="max-width:210mm;font-size:9.4pt">%s</p>'
            '<div style="display:grid;grid-template-columns:repeat(%d,1fr);gap:6mm;margin-top:4mm">%s</div>'
            '<div class="note" style="margin-top:5mm">%s</div>') % (E(X['intro']), len(X['cards']), cards, E(X['small']))
    return B.c_page(p, X.get('title', 'While we are here'), X.get('kicker', 'More from ABJ'), body, n)


def nextstep_page(p, n):
    N = p['next_step']
    steps = ''.join(
        '<div style="display:grid;grid-template-columns:13mm 1fr;gap:4mm;align-items:start;padding:3mm 0;border-bottom:.25mm solid rgba(14,27,26,.1)">'
        '<div class="step"><div class="dot" style="margin:0">%d</div></div>'
        '<div><div style="font:600 10pt/1.3 \'DM Sans\';color:#0E1B1A;margin-top:1mm">%s</div>'
        '<p style="font-size:8.3pt;line-height:1.5;margin:1mm 0 0;color:#3d4644">%s</p></div></div>' % (i + 1, E(a), E(b))
        for i, (a, b) in enumerate(N['steps']))
    rows = ''.join('<tr><td>%s</td><td style="text-align:right;white-space:nowrap">%s</td></tr>' % (E(a), E(b)) for a, b in N['box_rows'])
    opts = ''.join('<li>%s</li>' % E(x) for x in N.get('options', []))
    body = '''<div class="cols" style="grid-template-columns:1fr 92mm;gap:9mm;align-items:start">
<div>%s</div>
<div><div class="card dark" style="padding:6mm">
 <div class="kick" style="color:#C9A96E">%s</div>
 <div class="serif" style="font-size:21pt;line-height:1.08;margin-top:2.4mm">%s</div>
 <table class="qsum ns" style="margin-top:4mm">%s</table>
 <p style="font-size:7.8pt;color:#c9d3cf;margin:3mm 0 0">%s</p></div>
 %s
</div></div>''' % (steps, E(N['box_kick']), E(N['box_title']), rows, E(N['box_note']),
                    ('<div class="card" style="margin-top:4mm"><h3>%s</h3><ul class="chk">%s</ul></div>' % (E(N.get('options_title', 'Also price for me')), opts)) if opts else '')
    return B.c_page(p, N.get('title', 'Your next step'), N.get('kicker', 'Ready when you are'), body, n)


def payment_extra(p, part):
    """Payment schedule with figures and an Ideal4Finance calculator example, for the payment page."""
    P, F = p.get('payments'), p.get('finance_example')
    out = ''
    if P and part == 'schedule':
        hd = ''.join('<td style="text-align:right;font:600 6.3pt/1.2 \'DM Sans\';letter-spacing:.12em;text-transform:uppercase;color:#a7864c">%s</td>' % E(h) for h in P['head'][1:])
        rows = ''.join('<tr><td>%s</td>%s</tr>' % (E(r[0]), ''.join('<td style="text-align:right;white-space:nowrap">%s</td>' % E(v) for v in r[1:])) for r in P['rows'])
        out += ('<div class="card" style="margin-top:3mm;padding:3.6mm 5mm"><h3>%s</h3><table class="qt" style="font-size:7.9pt"><tr><td></td>%s</tr>%s</table>%s</div>') % (
            E(P['title']), hd, rows, ('<p class="mute" style="font-size:7pt;margin:1.4mm 0 0">%s</p>' % E(P['note'])) if P.get('note') else '')
    if F and part == 'finance':
        rows = ''.join('<tr><td>%s</td><td style="text-align:right;white-space:nowrap">%s</td></tr>' % (E(a), E(b)) for a, b in F['rows'])
        out += ('<div class="card" style="margin-top:3mm;padding:3.6mm 5mm"><h3>%s</h3><table class="qt" style="font-size:7.9pt">%s</table>'
                '<p style="font-size:6.9pt;line-height:1.4;margin:1.6mm 0 0;color:#3d4644">%s</p></div>') % (E(F['title']), rows, E(F['text']))
    return out
