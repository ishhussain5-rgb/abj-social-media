"""Plan and elevation drawings (SVG) generated from a project JSON (all sizes in mm).

Plan coordinates: origin at the inside corner of wall A (top) and wall D (left); x runs right along wall A,
y runs down along wall D. Wall-run units carry "wall" + "at" (distance from that wall's start in plan order);
island units and island panels carry x, y. Customer drawings label sizes in cm, fitter drawings in mm.
"""
import html

E = html.escape
GREEN, GREEN2, CREAM, GOLD, INK = '#0E1B1A', '#16302C', '#F3EEE6', '#C9A96E', '#1b2321'
FILL = {'base': '#EFE6D6', 'appliance': '#FFFFFF', 'tall': '#E2D2AE', 'wall': '#DDE7E3', 'island': '#D9DCDB',
        'panel': '#7E8582', 'filler': '#A8ADAB'}


def fmt(v, unit):
    if unit == 'cm':
        c = v / 10
        return ('%d' % round(c)) if c >= 10 else ('%g' % round(c, 1))
    return '%d' % v


def rect_of(u, room):
    """Plan rectangle (x, y, w, h) of a unit."""
    if 'x' in u:
        return u['x'], u['y'], u['w'], u['d']
    if u['wall'] == 'A':
        return u['at'], 0, u['w'], u['d']
    if u['wall'] == 'D':
        return 0, u['at'], u['d'], u['w']
    if u['wall'] == 'B':
        return room['w'] - u['d'], u['at'], u['d'], u['w']
    return u['at'], room['d'] - u['d'], u['w'], u['d']  # wall C


def badge(cx, cy, label, r=95, dark=True, fs=None):
    fs = fs or (120 if len(str(label)) < 3 else 100)
    w = max(r * 2, len(str(label)) * fs * 0.62 + 70)
    bg, fg = (GREEN, CREAM) if dark else (GOLD, GREEN)
    return ('<rect x="%.0f" y="%.0f" width="%.0f" height="%.0f" rx="38" fill="%s"/>'
            '<text x="%.0f" y="%.0f" font-size="%d" font-weight="600" fill="%s" text-anchor="middle" '
            'dominant-baseline="central" font-family="DM Sans">%s</text>') % (
        cx - w / 2, cy - r, w, 2 * r, bg, cx, cy + 4, fs, fg, E(str(label)))


def dim(x1, y1, x2, y2, text, side=-1, off=0, fs=110, col='#5f6866'):
    """Dimension line between two points (horizontal or vertical) with end ticks."""
    s = []
    if y1 == y2:  # horizontal
        y = y1 + off
        s.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="8"/>' % (x1, y, x2, y, col))
        for x in (x1, x2):
            s.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="8"/>' % (x - 35, y + 35, x + 35, y - 35, col))
        s.append('<text x="%d" y="%d" font-size="%d" fill="%s" text-anchor="middle" font-family="DM Sans">%s</text>' % (
            (x1 + x2) / 2, y - 40, fs, col, E(text)))
    else:  # vertical
        x = x1 + off
        s.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="8"/>' % (x, y1, x, y2, col))
        for y in (y1, y2):
            s.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="8"/>' % (x - 35, y + 35, x + 35, y - 35, col))
        s.append('<text x="%d" y="%d" font-size="%d" fill="%s" text-anchor="middle" font-family="DM Sans" '
                 'transform="rotate(-90 %d %d)">%s</text>' % (x - 40, (y1 + y2) / 2, fs, col, x - 40, (y1 + y2) / 2, E(text)))
    return ''.join(s)


def room_shell(room, unit):
    W, D = room['w'], room['d']
    t = 120
    s = ['<rect x="%d" y="%d" width="%d" height="%d" fill="#3a4240"/>' % (-t, -t, W + 2 * t, D + 2 * t),
         '<rect x="0" y="0" width="%d" height="%d" fill="#ffffff"/>' % (W, D)]
    for o in room.get('openings', []):
        a, w = o['at'], o['w']
        if o['wall'] in 'AC':
            y = -t if o['wall'] == 'A' else D
            s.append('<rect x="%d" y="%d" width="%d" height="%d" fill="#ffffff"/>' % (a, y, w, t))
            if o['type'] == 'window':
                for yy in (y + 40, y + 80):
                    s.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#3a4240" stroke-width="10"/>' % (a, yy, a + w, yy))
            else:  # door swinging into the room
                hx = a + w if o.get('hinge') == 'right' else a
                if o['wall'] == 'C':
                    s.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#3a4240" stroke-width="12"/>' % (hx, D, hx, D - w))
                    sweep = 0 if hx == a + w else 1
                    ex = a if hx == a + w else a + w
                    s.append('<path d="M %d %d A %d %d 0 0 %d %d %d" fill="none" stroke="#9aa19e" stroke-width="8" stroke-dasharray="30 22"/>' % (
                        hx, D - w, w, w, sweep, ex, D))
        else:
            x = -t if o['wall'] == 'D' else W
            s.append('<rect x="%d" y="%d" width="%d" height="%d" fill="#ffffff"/>' % (x, a, t, w))
    # overall wall sizes
    s.append(dim(0, -t, W, -t, 'Wall A  %s' % fmt(W, unit), off=-330, fs=125, col=INK))
    s.append(dim(-t, 0, -t, D, 'Wall D  %s' % fmt(D, unit), off=-330, fs=125, col=INK))
    s.append('<text x="%d" y="%d" font-size="125" fill="%s" text-anchor="middle" font-family="DM Sans" font-weight="600">Wall C</text>' % (
        W / 2, D + t + 230, INK))
    s.append('<text x="%d" y="%d" font-size="125" fill="%s" text-anchor="middle" font-family="DM Sans" font-weight="600" '
             'transform="rotate(90 %d %d)">Wall B</text>' % (W + t + 200, D / 2, INK, W + t + 200, D / 2))
    for o in room.get('openings', []):
        if o['wall'] == 'A':
            s.append(dim(o['at'], -t, o['at'] + o['w'], -t, '%s %s' % (o['type'].capitalize(), fmt(o['w'], unit)), off=-120, fs=100))
        if o['wall'] == 'C':
            s.append(dim(o['at'], D + t, o['at'] + o['w'], D + t, 'Door %s' % fmt(o['w'], unit), off=110, fs=100))
    return s


def unit_shape(u, room, unit, faint=False, label_size=True, dashed=False):
    x, y, w, h = rect_of(u, room)
    cat = u['cat']
    fill = FILL.get(cat, '#eee')
    op = ' opacity="0.28"' if faint else ''
    dash = ' stroke-dasharray="40 26"' if dashed else ''
    s = ['<g%s><rect x="%d" y="%d" width="%d" height="%d" fill="%s" stroke="#4b5452" stroke-width="10"%s/>' % (
        op, x, y, w, h, fill, dash)]
    if cat in ('base', 'tall', 'island', 'appliance') and not faint:
        # front edge marker (the side the doors open)
        if 'x' in u:
            fy = y if u.get('face', 'up') == 'up' else y + h
            s.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="22"/>' % (x, fy, x + w, fy, GOLD))
        elif u['wall'] == 'A':
            s.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="22"/>' % (x, y + h, x + w, y + h, GOLD))
        elif u['wall'] == 'D':
            s.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="22"/>' % (x + w, y, x + w, y + h, GOLD))
    if label_size and not faint and cat not in ('panel', 'filler') and u['d'] >= 400:
        long_side = u['w']
        cx, cy = x + w / 2, y + h / 2
        if 'x' not in u and u['wall'] == 'D':
            s.append('<text x="%d" y="%d" font-size="105" fill="#4b5452" text-anchor="middle" font-family="DM Sans" '
                     'transform="rotate(-90 %d %d)">%s</text>' % (x + 110, cy, x + 110, cy, fmt(long_side, unit)))
        else:
            ty = y + 140 if ('x' in u or u['wall'] == 'A') else cy
            s.append('<text x="%d" y="%d" font-size="105" fill="#4b5452" text-anchor="middle" font-family="DM Sans">%s</text>' % (
                cx, ty, fmt(long_side, unit)))
    s.append('</g>')
    return ''.join(s)


def unit_badge_pos(u, room):
    x, y, w, h = rect_of(u, room)
    if u['cat'] in ('panel', 'filler'):
        # badge outside the thin piece, into the room
        if 'x' in u:
            if w < h:
                return x + w / 2, y + h + 150
            return x + w / 2, y + h + 150
        if u['wall'] == 'A':
            return x + w / 2, y + h + 170
        return x + w + 170, y + h / 2
    return x + w / 2, y + h / 2 + 40


def symbols(units, room, codes=True):
    s = []
    for u in units:
        x, y, w, h = rect_of(u, room)
        if u.get('sink'):
            s.append('<rect x="%d" y="%d" width="%d" height="%d" rx="60" fill="#ffffff" stroke="#4b5452" stroke-width="10"/>' % (
                x + w / 2 - 250, y + 90, 500, 380))
            s.append('<circle cx="%d" cy="%d" r="28" fill="#4b5452"/>' % (x + w / 2, y + 60))
        if u.get('hob'):
            cx, cy = x + w / 2, y + h / 2
            vert = 'x' not in u and u['wall'] in 'BD'
            for a, b, r in ((-120, -200, 95), (120, -200, 80), (-120, 200, 80), (120, 200, 95)):
                px, py = (cx + a, cy + b) if vert else (cx + b, cy + a)
                s.append('<circle cx="%d" cy="%d" r="%d" fill="none" stroke="#4b5452" stroke-width="10"/>' % (px, py, r))
        if u.get('app') and codes:
            cx, cy = x + w / 2, y + h / 2
            s.append('<text x="%d" y="%d" font-size="120" fill="#4b5452" font-weight="600" text-anchor="middle" font-family="DM Sans">%s</text>' % (
                cx, cy + 210, E(u['app'])))
    return s


def svg(content, room, extra=(700, 700, 500, 520), cls='plan'):
    W, D = room['w'], room['d']
    l, t, r, b = extra
    return ('<svg class="%s" viewBox="%d %d %d %d" xmlns="http://www.w3.org/2000/svg" '
            'preserveAspectRatio="xMidYMid meet">%s</svg>') % (cls, -l, -t, W + l + r, D + t + b, ''.join(content))


def plan(p, layer, unit='mm', numbers=True):
    """layer: overview | base | wall | island | appliances | tops"""
    room, units = p['room'], p['units']
    s = room_shell(room, unit)
    base_like = [u for u in units if u['cat'] in ('base', 'appliance', 'tall', 'panel', 'filler') and 'x' not in u]
    walls = [u for u in units if u['cat'] == 'wall']
    isl = [u for u in units if u['cat'] == 'island' or ('x' in u and u['cat'] == 'panel')]
    show = []
    if layer == 'overview':
        for u in base_like + isl:
            s.append(unit_shape(u, room, unit, label_size=False))
        for u in walls:
            s.append(unit_shape(u, room, unit, label_size=False, dashed=True))
        s += symbols(units, room, codes=False)
        s += overview_labels(p)
        s += clearances(p, unit)
        return svg(s, room)
    if layer == 'base':
        for u in base_like:
            s.append(unit_shape(u, room, unit))
        for u in isl:
            s.append(unit_shape(u, room, unit, faint=True))
        s += symbols([u for u in base_like], room)
        show = base_like
    elif layer == 'wall':
        for u in base_like + isl:
            s.append(unit_shape(u, room, unit, faint=True))
        for u in walls:
            s.append(unit_shape(u, room, unit))
        show = walls
    elif layer == 'island':
        for u in base_like:
            s.append(unit_shape(u, room, unit, faint=True))
        for u in isl:
            s.append(unit_shape(u, room, unit))
        s += symbols(isl, room)
        s += clearances(p, unit)
        show = isl
    elif layer == 'appliances':
        for u in base_like + isl:
            s.append(unit_shape(u, room, unit, faint=True))
        s += symbols(units, room)
        tags = {}
        for a in p.get('appliances', []) + p.get('sink', []):
            n = a['at'].replace('Above unit', '').replace('Unit', '').strip()
            tags.setdefault(n, []).append(a['n'])
        for u in units:
            if str(u['n']) in tags:
                x, y, w, h = rect_of(u, room)
                lab = ', '.join(tags[str(u['n'])])
                s.append(badge(x + w / 2, y + h / 2 - 60, lab, dark=False, fs=100))
        return svg(s, room)
    elif layer == 'tops':
        for u in base_like + isl:
            s.append(unit_shape(u, room, unit, faint=True))
        s += tops(p, unit)
        return svg(s, room)
    if numbers:
        for u in show:
            cx, cy = unit_badge_pos(u, room)
            s.append(badge(cx, cy, u['n']))
    return svg(s, room)


def overview_labels(p):
    room = p['room']
    s = []
    lab = {'sink': 'Sink', 'hob': 'Hob'}
    for u in p['units']:
        x, y, w, h = rect_of(u, room)
        name = None
        if u.get('sink'): name = 'Sink'
        elif u.get('hob'): name = 'Hob'
        elif u.get('app') == 'DW': name = 'Dishwasher'
        elif u.get('app') == 'WC': name = 'Wine cooler'
        elif 'oven' in u['name'].lower(): name = 'Ovens'
        elif 'fridge' in u['name'].lower(): name = 'Fridge freezer'
        elif 'larder' in u['name'].lower(): name = 'Larder'
        if not name: continue
        cx, cy = x + w / 2, y + h / 2
        if 'x' not in u and u['wall'] == 'D':
            s.append('<text x="%d" y="%d" font-size="118" fill="%s" font-weight="600" text-anchor="middle" font-family="DM Sans" '
                     'transform="rotate(-90 %d %d)">%s</text>' % (cx + 40, cy, GREEN, cx + 40, cy, name))
        else:
            ty = y + h - 110 if u.get('sink') else cy + 40
            s.append('<text x="%d" y="%d" font-size="118" fill="%s" font-weight="600" text-anchor="middle" font-family="DM Sans">%s</text>' % (
                cx, ty if not u.get('sink') else y + h + 170, GREEN, name))
    # seating side of the island
    isl = [u for u in p['units'] if u['cat'] == 'island']
    if isl:
        x0 = min(u['x'] for u in isl); x1 = max(u['x'] + u['w'] for u in isl); y1 = max(u['y'] + u['d'] for u in isl)
        s.append('<rect x="%d" y="%d" width="%d" height="%d" fill="none" stroke="%s" stroke-width="10" stroke-dasharray="36 24"/>' % (
            x0 - 18, y1 - 580, x1 - x0 + 36, 1000, GOLD))
        s.append('<text x="%d" y="%d" font-size="118" fill="%s" text-anchor="middle" font-family="DM Sans">Seating side</text>' % (
            (x0 + x1) / 2, y1 + 230, GREEN))
    return s


def clearances(p, unit):
    room = p['room']
    isl = [u for u in p['units'] if u['cat'] == 'island']
    if not isl: return []
    x0 = min(u['x'] for u in isl) - 18; y0 = min(u['y'] for u in isl)
    frontA = max((u['d'] for u in p['units'] if u.get('wall') == 'A' and u['cat'] in ('base', 'appliance')), default=0)
    frontD = max((u['d'] for u in p['units'] if u.get('wall') == 'D' and u['cat'] in ('base', 'tall')), default=0)
    s = []
    cxA = (x0 + max(u['x'] + u['w'] for u in isl)) / 2 + 500
    s.append(dim(cxA, frontA, cxA, y0, 'Walkway %s' % fmt(y0 - frontA, unit), off=0, fs=100, col='#8a6d3b'))
    cyD = y0 + 350
    s.append(dim(frontD, cyD, x0, cyD, 'Walkway %s' % fmt(x0 - frontD, unit), off=0, fs=100, col='#8a6d3b'))
    return s


def tops(p, unit):
    room = p['room']
    wt = {w['n']: w for w in p.get('worktops', [])}
    # positions for the sample layout: derived from the runs
    a_run = [u for u in p['units'] if u.get('wall') == 'A' and u['cat'] in ('base', 'appliance', 'panel')]
    d_run = [u for u in p['units'] if u.get('wall') == 'D' and u['cat'] in ('base', 'filler') and u['at'] < 2400]
    isl = [u for u in p['units'] if 'x' in u]
    s = []
    def piece(x, y, w, h, n, rx=0, bx=None):
        s.append('<rect x="%d" y="%d" width="%d" height="%d" rx="%d" fill="#F7F4EE" stroke="%s" stroke-width="22"/>' % (x, y, w, h, rx, GOLD))
        s.append(badge(x + w / 2 if bx is None else bx, y + h / 2, n, dark=False))
    if 'W1' in wt: piece(0, 0, wt['W1']['len'], wt['W1']['dep'], 'W1')
    if 'W2' in wt:
        x = wt['W1']['len'] if 'W1' in wt else 0
        piece(x, 0, wt['W2']['len'], wt['W2']['dep'], 'W2', bx=x + wt['W2']['len'] - 380)
        for u in a_run:
            if u.get('sink'):
                ux = u['at'] + u['w'] / 2
                s.append('<rect x="%d" y="%d" width="500" height="380" rx="50" fill="#ffffff" stroke="#4b5452" stroke-width="10"/>' % (ux - 250, 110))
                for i in range(5):
                    gx = ux + 330 + i * 70
                    s.append('<line x1="%d" y1="140" x2="%d" y2="460" stroke="#4b5452" stroke-width="8"/>' % (gx, gx))
    if 'W3' in wt:
        y = wt['W1']['dep'] if 'W1' in wt else 0
        piece(0, y, wt['W3']['dep'], wt['W3']['len'], 'W3')
        for u in d_run:
            if u.get('hob'):
                uy = u['at'] + u['w'] / 2
                s.append('<rect x="%d" y="%d" width="490" height="750" rx="20" fill="#ffffff" stroke="#4b5452" stroke-width="10" stroke-dasharray="30 20"/>' % (55, uy - 375))
    if 'W4' in wt and isl:
        x0 = min(u['x'] for u in isl); y0 = min(u['y'] for u in isl)
        piece(x0, y0 - 20, wt['W4']['len'], wt['W4']['dep'], 'W4', rx=40)
    # upstands
    if 'U1' in wt:
        s.append('<rect x="0" y="0" width="%d" height="45" fill="%s"/>' % (wt['U1']['len'], GREEN2))
    if 'U2' in wt:
        y = wt['W1']['dep'] if 'W1' in wt else 0
        s.append('<rect x="0" y="%d" width="45" height="%d" fill="%s"/>' % (y, wt['U2']['len'], GREEN2))
    s.append(dim(0, 0, 0, 0, '', 0) if False else '')
    return s


# ---------------------------------------------------------------- elevations
def wall_items(p, wall):
    room, H = p['room'], p['heights']
    L = room['w'] if wall in 'AC' else room['d']
    out = []
    for u in p['units']:
        if u.get('wall') != wall: continue
        s = u['at'] if wall == 'A' else L - u['at'] - u['w']
        out.append(dict(u, s=s))
    # units of the adjoining run seen end-on in the corner (hatched)
    if wall == 'D':
        for u in p['units']:
            if u.get('wall') == 'A' and u['at'] == 0 and u['cat'] in ('base', 'wall'):
                out.append(dict(u, s=L - u['d'], w=u['d'], cat=u['cat'], ghost=True))
    return L, out


def elevation(p, wall, unit='mm', numbers=True):
    room, H = p['room'], p['heights']
    L, items = wall_items(p, wall)
    C = room['h']
    y = lambda h: C - h  # svg y from height above floor
    pl, bh, wt, up, wb, wh, th = H['plinth'], H['base'], H['worktop'], H['upstand'], H['wall_bottom'], H['wall'], H['tall']
    top_base = pl + bh
    s = ['<defs><pattern id="hatch" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">'
         '<line x1="0" y1="0" x2="0" y2="60" stroke="#9aa19e" stroke-width="12"/></pattern></defs>']
    s.append('<rect x="0" y="0" width="%d" height="%d" fill="#ffffff" stroke="#3a4240" stroke-width="14"/>' % (L, C))
    # openings in this wall
    for o in room.get('openings', []):
        if o['wall'] != wall: continue
        if o['type'] == 'window':
            s.append('<rect x="%d" y="%d" width="%d" height="%d" fill="#EEF3F2" stroke="#3a4240" stroke-width="12"/>' % (
                o['at'], y(o['head']), o['w'], o['head'] - o['sill']))
            s.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#3a4240" stroke-width="8"/>' % (
                o['at'] + o['w'] / 2, y(o['head']), o['at'] + o['w'] / 2, y(o['sill'])))
    run = [i for i in items if i['cat'] in ('base', 'appliance') and not i.get('ghost')]
    if run:
        x0 = min(i['s'] for i in run); x1 = max(i['s'] + i['w'] for i in run)
        hob = [i for i in run if i.get('hob')]
        # upstand / splashback
        s.append('<rect x="%d" y="%d" width="%d" height="%d" fill="#E9E4DA" stroke="#9aa19e" stroke-width="6"/>' % (
            x0, y(top_base + wt + up), x1 - x0 + (18 if wall == 'A' else 0), up))
        for h_ in hob:
            s.append('<rect x="%d" y="%d" width="%d" height="600" fill="#DDE7E3" stroke="#6b7a75" stroke-width="8"/>' % (
                h_['s'], y(top_base + wt + 600), h_['w']))
            s.append('<text x="%d" y="%d" font-size="95" fill="#4b5452" text-anchor="middle" font-family="DM Sans">Glass splashback</text>' % (
                h_['s'] + h_['w'] / 2, y(top_base + wt + 330)))
            cx = h_['s'] + h_['w'] / 2
            s.append('<path d="M %d %d L %d %d L %d %d L %d %d Z" fill="#c9cfcd" stroke="#4b5452" stroke-width="10"/>' % (
                cx - 450, y(wb), cx + 450, y(wb), cx + 160, y(wb + 220), cx - 160, y(wb + 220)))
            s.append('<rect x="%d" y="0" width="320" height="%d" fill="#c9cfcd" stroke="#4b5452" stroke-width="10"/>' % (cx - 160, y(wb + 220)))
            s.append('<text x="%d" y="%d" font-size="90" fill="#4b5452" text-anchor="middle" font-family="DM Sans">Extractor</text>' % (
                cx, y(wb + 90)))
        # worktop
        s.append('<rect x="%d" y="%d" width="%d" height="%d" fill="#F2EFEA" stroke="#4b5452" stroke-width="8"/>' % (
            x0, y(top_base + wt), x1 - x0 + (18 if wall == 'A' else 0), wt))
        # plinth
        s.append('<rect x="%d" y="%d" width="%d" height="%d" fill="#E7DDC9" stroke="#9aa19e" stroke-width="6"/>' % (x0, y(pl), x1 - x0, pl - 20))
    for i in items:
        cat = i['cat']
        if i.get('ghost'):
            if cat == 'base':
                s.append('<rect x="%d" y="%d" width="%d" height="%d" fill="url(#hatch)" stroke="#9aa19e" stroke-width="8"/>' % (
                    i['s'], y(top_base + wt), i['w'], top_base + wt))
            else:
                s.append('<rect x="%d" y="%d" width="%d" height="%d" fill="url(#hatch)" stroke="#9aa19e" stroke-width="8"/>' % (
                    i['s'], y(wb + wh), i['w'], wh))
            continue
        if cat in ('base', 'appliance'):
            s.append(fronts(i, i['s'], y(top_base), i['w'], bh, i.get('fronts', '1'), FILL[cat if cat != 'appliance' else 'base']))
            if i.get('sink'):
                cx = i['s'] + i['w'] / 2
                s.append('<path d="M %d %d L %d %d Q %d %d %d %d L %d %d" fill="none" stroke="#4b5452" stroke-width="22"/>' % (
                    cx, y(top_base + wt), cx, y(top_base + wt + 300), cx, y(top_base + wt + 380), cx + 150, y(top_base + wt + 380),
                    cx + 150, y(top_base + wt + 300)))
            if i.get('hob'):
                s.append('<rect x="%d" y="%d" width="%d" height="14" fill="#1b2321"/>' % (i['s'] + 50, y(top_base + wt + 14), i['w'] - 100))
        elif cat == 'tall':
            s.append(fronts(i, i['s'], y(pl + th), i['w'], th, i.get('fronts', '2t'), FILL['tall']))
            s.append('<rect x="%d" y="%d" width="%d" height="%d" fill="#E7DDC9" stroke="#9aa19e" stroke-width="6"/>' % (i['s'], y(pl), i['w'], pl - 20))
        elif cat == 'wall':
            s.append(fronts(i, i['s'], y(wb + wh), i['w'], wh, i.get('fronts', '1'), FILL['wall'], rail=False))
        elif cat in ('panel', 'filler'):
            hh = top_base + wt if cat == 'panel' else (top_base if i['at'] < 2380 or wall == 'A' else pl + th)
            if cat == 'filler' and i['at'] >= 2380 and wall == 'D':
                hh = pl + th
            s.append('<rect x="%d" y="%d" width="%d" height="%d" fill="%s" stroke="#4b5452" stroke-width="6"/>' % (
                i['s'], y(hh), max(i['w'], 18), hh, FILL[cat]))
    if numbers:
        for i in items:
            if i.get('ghost'): continue
            cat = i['cat']
            if cat in ('base', 'appliance'): cy = y(pl + bh / 2) + 120
            elif cat == 'tall': cy = y(pl + th / 2)
            elif cat == 'wall': cy = y(wb + wh / 2)
            else: cy = y(pl + 260)
            cx = i['s'] + max(i['w'], 18) / 2
            if cat in ('panel', 'filler'):
                cx = i['s'] + (170 if wall == 'D' else -170) if i['s'] + 400 > L else i['s'] + 190
            s.append(badge(cx, cy, i['n'], r=85, fs=105))
    # widths along the bottom
    for i in items:
        if i['cat'] in ('panel', 'filler') or i.get('ghost') or i['cat'] == 'wall': continue
        s.append('<text x="%d" y="%d" font-size="100" fill="#4b5452" text-anchor="middle" font-family="DM Sans">%s</text>' % (
            i['s'] + i['w'] / 2, C + 150, fmt(i['w'], unit)))
    for i in items:
        if i['cat'] == 'wall':
            s.append('<text x="%d" y="%d" font-size="95" fill="#4b5452" text-anchor="middle" font-family="DM Sans">%s</text>' % (
                i['s'] + i['w'] / 2, y(wb + wh) - 40, fmt(i['w'], unit)))
    # height chain on the right
    marks = [0, pl, top_base, top_base + wt, wb, wb + wh, C]
    for a, b in zip(marks, marks[1:]):
        if b - a < 20: continue
        s.append(dim(L + 220, y(a), L + 220, y(b), fmt(b - a, unit), off=0, fs=92))
    s.append(dim(L + 520, y(0), L + 520, y(C), 'Ceiling %s' % fmt(C, unit), off=0, fs=100, col=INK))
    vb = '%d %d %d %d' % (-160, -60, L + 820, C + 300)
    return '<svg class="elev" viewBox="%s" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">%s</svg>' % (vb, ''.join(s))


def fronts(u, x, ytop, w, h, code, fill, rail=True):
    s = ['<rect x="%d" y="%d" width="%d" height="%d" fill="%s" stroke="#4b5452" stroke-width="10"/>' % (x, ytop, w, h, fill)]
    def hline(yy): s.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#4b5452" stroke-width="8"/>' % (x, yy, x + w, yy))
    def vline(xx, y1, y2): s.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#4b5452" stroke-width="8"/>' % (xx, y1, xx, y2))
    def railat(yy):
        if rail: s.append('<rect x="%d" y="%d" width="%d" height="26" fill="#1b2321"/>' % (x + 6, yy, w - 12))
    if code == '2':
        vline(x + w / 2, ytop, ytop + h)
    elif code == '3d':
        hline(ytop + 180); hline(ytop + 450)
        railat(ytop); railat(ytop + 180); railat(ytop + 450)
        return ''.join(s)
    elif code == '2d':
        hline(ytop + h / 2)
        railat(ytop); railat(ytop + h / 2)
        return ''.join(s)
    elif code == 'oven2':
        # from the top: top door, combi, oven, drawer
        hline(ytop + 795); hline(ytop + 795 + 455); hline(ytop + 795 + 455 + 600)
        for oy, oh in ((ytop + 795, 455), (ytop + 795 + 455, 600)):
            s.append('<rect x="%d" y="%d" width="%d" height="%d" fill="#2b3331"/>' % (x + 40, oy + 40, w - 80, oh - 80))
            s.append('<rect x="%d" y="%d" width="%d" height="%d" fill="#55605d"/>' % (x + 110, oy + 120, w - 220, oh - 220))
        return ''.join(s)
    elif code == 'ff':
        hline(ytop + 400); hline(ytop + 1400)
        return ''.join(s)
    elif code == '2t':
        hline(ytop + h - 1350)
        return ''.join(s)
    if rail: railat(ytop)
    return ''.join(s)
