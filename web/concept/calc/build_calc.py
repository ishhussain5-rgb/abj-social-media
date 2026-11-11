#!/usr/bin/env python3
"""Builds the cost-guide sections (calc/<key>_calc.html) from one template.

Prices are calibrated from real ABJ quotes (Alex, Nov 2026). Each [low, high] pair is a rough range,
by size option (4 sizes). Edit the numbers in SERVICES below, then run:  python3 build_calc.py
"""
import json, html, os

HERE = os.path.dirname(os.path.abspath(__file__))
CSS = open(os.path.join(HERE, 'calc.css.part')).read()
ENGINE = open(os.path.join(HERE, 'calc_engine.js.part')).read()
INC = ['3D design &amp; site survey', 'Made in Peterborough', 'Fitted by our own team', '12-month guarantee']
FIN = '0% finance is available on projects over &pound;6,000 (subject to status).'


def panels(n, top=False):
    """Simple line drawing: a run of n door panels (wardrobe / media wall size icons)."""
    w = 40 / n
    p = ''.join(f'M{3 + w * i:.1f} 3v24' for i in range(1, n))
    return f'<svg viewBox="0 0 46 30"><rect x="3" y="3" width="40" height="24"/><path d="{p}"/></svg>'


KITCHEN_SVG = [
    '<svg viewBox="0 0 46 30"><rect x="3" y="3" width="40" height="24"/><path d="M3 3h40v6H3z"/></svg>',
    '<svg viewBox="0 0 46 30"><rect x="3" y="3" width="40" height="24"/><path d="M3 3h40v6H3zM3 9h6v18H3z"/></svg>',
    '<svg viewBox="0 0 46 30"><rect x="3" y="3" width="40" height="24"/><path d="M3 3h40v6H3zM3 9h6v18H3zM37 9h6v18h-6z"/></svg>',
    '<svg viewBox="0 0 46 30"><rect x="3" y="3" width="40" height="24"/><path d="M3 3h40v6H3zM3 9h6v18H3zM17 15h14v6H17z"/></svg>',
]

WARD_SIZES = dict(
    opts=[('Single', 'Up to about 1.2&nbsp;m, 2 doors'), ('Medium', 'About 2&ndash;2.5&nbsp;m wide'),
          ('Large', 'About 3&ndash;4&nbsp;m wide'), ('Wall to wall', '5&nbsp;m or more, or two walls')],
    svg=[panels(2), panels(4), panels(6), panels(8)],
    words=[('single|small|one door|two door|2 door|narrow|alcove', 0), ('medium|double|four door|4 door|average|standard', 1),
           ('large|big|long|three walls', 2), ('wall to wall|wall-to-wall|whole wall|entire wall|full wall|two walls|huge|massive|whole room', 3)],
    lbl=['Single', 'Medium', 'Large', 'Wall to wall'], say=['single', 'medium', 'large', 'wall-to-wall'],
    q='Width? pick below', metres=[1.4, 2.7, 4.4], ev='size')

DOOR_FINISH = dict(
    n='st', legend='Door finish', ev='finish',
    opts=[('Matt or woodgrain', 'Plain colours, oak and walnut effects'), ('Shaker or painted-look', 'Framed or panelled doors'),
          ('High gloss', 'Acrylic gloss doors')],
    mult=[1, 1.15, 1.25],
    words=[('matt|matte|woodgrain|wood grain|oak|walnut|white|grey|gray|plain|flat|slab|handleless|modern', 0),
           ('shaker|painted|framed|classic|traditional|cottage|period|two panel|2 panel', 1),
           ('gloss|glossy|high gloss|acrylic|shiny', 2)],
    lbl=['Matt / woodgrain', 'Shaker', 'High gloss'], say=['matt', 'Shaker-style', 'high-gloss'], q='Finish? pick below')

E = lambda name, lbl, p, words, **k: dict(name=name, lbl=lbl, p=p, words=words, **k)
X_DRAWERS = E('a drawer unit', 'Drawer unit', [200, 450], 'drawers?|drawer unit|chest of drawers')
X_SHOES = E('a shoe carousel', 'Shoe carousel', [275, 550], 'shoe carousel|carousel|shoe rack|shoes?|shoe storage|trainers')
X_MIRROR = E('a mirror', 'Mirror', [155, 300], 'mirror|mirrored|mirrors')
X_LED = E('LED lighting', 'LED lighting', [185, 450], 'led|lighting|lights|lit|light|sensor light')
X_DRESS = E('a dressing table', 'Dressing table', [700, 1000], 'dressing table|vanity|make[\\s-]?up (desk|table)|dresser')
X_GLASS = E('glass shelves', 'Glass shelves', [100, 300], 'glass shel(f|ves)|display shel(f|ves)|display')

WARD_TIP = r'''function(s,gbp,rnd){
 if(s.v.st===2)return 'High-gloss acrylic gives a mirror-like finish. A matt door in the same colour costs about a fifth less.';
 if(s.sz>=1&&!s.has('drawers'))return 'Most of our wardrobes this size have a drawer unit inside for folded clothes and accessories. Add it to see the difference.';
 if(s.sz>=2&&!s.has('shoes'))return 'A rotating shoe carousel holds a lot of pairs in a narrow space, and costs less than you might think.';
 if(s.lo>=6000)return 'This is eligible for 0% finance, so you can spread the cost (50% deposit, subject to status).';
 return 'All our wardrobes are made floor to ceiling, so there is no dusty gap on top.';
}'''

FINE_FURN = ('A rough guide based on recent quotes for {what} we&rsquo;ve made and fitted, not a quote. Your exact price comes with your '
             '3D design after a free home visit. It covers making, delivering and fitting{x}. Electrical connections are extra unless agreed. ' + FIN)


def lead(what):
    return (f'Tell us about your {what} in a sentence, the way you&rsquo;d describe it to a friend. We&rsquo;ll pick out the details and '
            f'show you a guide price based on real quotes for {what}s we&rsquo;ve made in our Peterborough workshop and fitted ourselves.')


SERVICES = {
 'kitchen': dict(
  noun='kitchen', ev='kitchen_cost_guide', title='What could your kitchen cost?',
  lead=lead('kitchen'),
  ph='e.g. a U-shaped Shaker kitchen with quartz worktops, an island and a larder',
  ex=[('Medium handleless with quartz', 'A medium L-shaped handleless kitchen with quartz worktops and a breakfast bar'),
      ('Large Shaker with an island', 'A large Shaker kitchen with an island, quartz worktops and a larder'),
      ('Small galley kitchen', 'A small galley kitchen in a modern style with a laminate worktop')],
  groups=[
   dict(n='sz', legend='How big is the room?', ev='size',
        opts=[('Compact', 'Galley or small L, up to 4&nbsp;m of units'), ('Medium', 'L-shape, about 5&ndash;7&nbsp;m of units'),
              ('Large', 'U-shape or floor-to-ceiling tall units'), ('Statement', 'Large open-plan with an island')],
        svg=KITCHEN_SVG, checked=1, metres=[4, 7, 10],
        words=[('compact|small|smallish|little|tiny|galley|narrow|studio|flat|apartment|budget', 0),
               ('medium|mid[\\s-]?sized?|average|normal|regular|decent(ly)?[\\s-]?sized?|good[\\s-]?sized?|family|l[\\s-]?shaped?|l[\\s-]?shape|standard', 1),
               ('large|big|biggish|u[\\s-]?shaped?|u[\\s-]?shape|spacious|tall units|bank of tall|long|floor[\\s-]?to[\\s-]?ceiling', 2),
               ('statement|huge|massive|very (big|large)|open[\\s-]?plan|kitchen[\\s-]?diner|extension', 3)],
        lbl=['Compact', 'Medium', 'Large', 'Statement'], say=['compact', 'medium', 'large', 'statement'], q='Size? pick below'),
   dict(n='st', legend='Which style?', ev='style',
        opts=[('Handleless', 'Gola rail, clean lines'), ('Shaker', 'Framed doors in any colour'),
              ('Gloss acrylic', 'Mirror-like high gloss'), ('In-frame', 'Doors set in a solid frame')],
        mult=[1, 1.1, 1.15, 1.35],
        words=[('handle[\\s-]?less|modern|sleek|minimal|contemporary|j[\\s-]?pull|true handleless|gola|matt|matte', 0),
               ('shaker|classic|painted|cottage|country|farmhouse', 1), ('gloss|glossy|high gloss|acrylic|shiny', 2),
               ('in[\\s-]?frame|heritage|period|traditional|georgian|victorian', 3)],
        lbl=['Handleless', 'Shaker', 'Gloss acrylic', 'In-frame'], say=['handleless', 'Shaker', 'gloss acrylic', 'in-frame'],
        q='Style? pick below'),
   dict(n='wt', legend='Worktop', ev='worktop', label='Worktops &amp; splashbacks', checked=2,
        opts=[('Laminate', 'Matching splashback included'), ('Solid wood', 'Oak or walnut staves'),
              ('Quartz', 'With full-height splashbacks'), ('Natural stone', 'Quartzite, marble or sintered')],
        add=[[[450, 800], [1000, 1400], [1300, 1900], [1700, 2500]],
             [[800, 1400], [1300, 2200], [1900, 3000], [2600, 4000]],
             [[2000, 2800], [3000, 4000], [3300, 4500], [4500, 6500]],
             [[2300, 3200], [3300, 4400], [3700, 5000], [5000, 7200]]],
        words=[('laminate|egger|budget|cheap', 0), ('wood|wooden|oak|walnut|timber|butcher|iroko|solid wood', 1),
               ('quartz|silestone|caesarstone|marble[\\s-]?effect|compac|stone', 2),
               ('sintered|dekton|ceramic|porcelain|neolith|lapitec|real marble|natural marble|natural stone|quartzite|taj mahal|granite', 3)],
        lbl=['Laminate', 'Solid wood', 'Quartz', 'Natural stone'], say=['laminate', 'solid wood', 'quartz', 'natural stone'],
        q='Worktop? pick below'),
  ],
  base=[[1300, 2300], [2800, 4000], [4500, 6500], [6500, 9500]],
  inst=[[600, 900], [1100, 1400], [1700, 2200], [2200, 3000]],
  ext={
   'island': E('an island', 'Island', [1500, 3000], 'island', mult=True, incl=[3], sizeIf=3),
   'bar': E('a breakfast bar', 'Breakfast bar', [400, 900], 'breakfast bar|peninsula|bar area|breakfast counter'),
   'larder': E('a larder unit', 'Larder unit', [500, 1000], 'larder|pantry|tall cupboard', mult=True),
   'glass': E('a glass display cabinet', 'Glass display', [300, 650], 'glass|display|glazed|vitrine'),
   'led': X_LED,
   'store': E('clever storage', 'Corner or bin pull-out', [250, 550], 'corner|carousel|le[\\s-]?mans|magic corner|fly moon|pull[\\s-]?out bin|waste bin|bin'),
  },
  lbl=dict(base='Cabinets &amp; panels', ext='Extras', inst='Delivery &amp; fitting'),
  notes=[dict(words='appliances?|oven|ovens|hob|fridge|freezer|dishwasher|integrated|neff|bosch|siemens|miele|aeg|range cooker|extractor|sink|tap|quooker|boiling',
              chip='Appliances: not included', tip='Appliances, sinks and taps aren’t in this guide price. We design the units around the ones you choose.')],
  say=r"function(s,w){return 'A '+w('sz')+' '+w('st')+' kitchen with '+w('wt')+' worktops'}",
  tip=r'''function(s,gbp,rnd){
 if(s.v.st===3)return 'In-frame is our most hand-crafted style. Shaker gives a very similar look for noticeably less.';
 if(s.v.wt===3)return 'Natural stone is one of a kind. Quartz gives a similar look for a little less.';
 if(s.v.wt===0&&s.sz>=1)return 'Upgrading to quartz with full-height splashbacks adds about '+['£1,550 to £2,000','£2,000 to £2,600','£2,000 to £2,600','£2,800 to £4,000'][s.sz]+' on a kitchen this size.';
 if(s.sz>=2&&!s.has('larder'))return 'Kitchens this size usually have room for a larder unit, which is the best value storage you can add.';
 if(s.sz===1&&!s.has('island'))return 'If your room is over about 4.5 m wide, an island is often possible. Add it to see the difference.';
 if(s.lo>=6000)return 'This is eligible for 0% finance, so you can spread the cost (50% deposit, subject to status).';
 return 'Appliances, sinks and taps aren’t in this price, so you can choose your own.';
}''',
  fine=('A rough guide based on recent quotes for kitchens we&rsquo;ve made and fitted, not a quote. Your exact price comes with your 3D design '
        'after a free home visit. It covers making, delivering and fitting the units and worktops. Appliances, sink and tap, plumbing, '
        'electrics, gas, building work and flooring are extra. ' + FIN)),

 'wardrobe': dict(
  noun='wardrobes', ev='wardrobe_cost_guide', title='What could your wardrobes cost?',
  lead=lead('wardrobe').replace('your wardrobe in a', 'your wardrobes in a'),
  ph='e.g. floor-to-ceiling wardrobes across a 3 m wall with Shaker doors, drawers and a shoe carousel',
  ex=[('2.5 m with Shaker doors', 'Fitted wardrobes about 2.5 m wide with painted Shaker doors'),
      ('Wall to wall with drawers', 'Wall-to-wall wardrobes with drawers, a shoe carousel and LED lighting'),
      ('Single white wardrobe', 'A single wardrobe in white with a mirror')],
  groups=[dict(n='sz', legend='How wide?', checked=1, **WARD_SIZES), DOOR_FINISH],
  base=[[700, 1100], [1300, 2000], [2200, 3300], [3400, 5000]],
  inst=[[200, 300], [300, 450], [450, 800], [800, 1400]],
  ext={'drawers': X_DRAWERS, 'shoes': X_SHOES, 'mirror': X_MIRROR, 'led': X_LED, 'dress': X_DRESS, 'glass': X_GLASS},
  lbl=dict(base='Cabinets &amp; doors', ext='Extras', inst='Delivery &amp; fitting'),
  notes=[dict(words='sliding|slider|sliders', chip='Sliding doors',
              tip='Sliding doors are priced a little differently. Our sliding wardrobes page has its own cost guide.')],
  say=r"function(s,w){return 'A '+w('sz')+' fitted wardrobe with '+w('st')+' doors'}",
  tip=WARD_TIP, fine=FINE_FURN.format(what='wardrobes', x='')),

 'sliding': dict(
  noun='sliding wardrobe', ev='sliding_cost_guide', title='What could your sliding wardrobe cost?',
  lead=lead('sliding wardrobe'),
  ph='e.g. a 3-door sliding wardrobe with mirror and woodgrain doors, drawers and LED lights',
  ex=[('2 doors, one mirrored', 'A 2-door sliding wardrobe with one mirror door and one woodgrain door'),
      ('Wall to wall in glass', 'A wall-to-wall sliding wardrobe with black lacquered glass doors and drawers'),
      ('3 mirror doors', 'A 3-door mirrored sliding wardrobe with a shoe carousel')],
  groups=[
   dict(n='sz', legend='How many doors?', ev='size', checked=1,
        opts=[('2 doors', 'Up to about 1.8&nbsp;m wide'), ('3 doors', 'About 2.4&nbsp;m wide'),
              ('4 doors', 'About 3&ndash;3.6&nbsp;m wide'), ('Wall to wall', '4&nbsp;m or more')],
        svg=[panels(2), panels(3), panels(4), panels(6)], metres=[2, 2.8, 3.8],
        words=[('2 doors?|two doors?|2[\\s-]door|two[\\s-]door|small|single', 0), ('3 doors?|three doors?|3[\\s-]door|three[\\s-]door|medium', 1),
               ('4 doors?|four doors?|4[\\s-]door|four[\\s-]door|large|big', 2),
               ('wall to wall|wall-to-wall|whole wall|full wall|5 doors?|five doors?|6 doors?|six doors?|huge', 3)],
        lbl=['2 doors', '3 doors', '4 doors', 'Wall to wall'], say=['2-door', '3-door', '4-door', 'wall-to-wall'], q='Doors? pick below'),
   dict(n='st', legend='Door panels', ev='doors',
        opts=[('Woodgrain or colour', 'Oak, walnut or a plain colour'), ('Mirror', 'Full-height mirror doors'),
              ('Mirror &amp; panels', 'A mix of mirror and woodgrain'), ('Lacquered glass', 'Black, white or coloured glass')],
        mult=[1, 1.06, 1.04, 1.15],
        words=[('woodgrain|wood grain|oak|walnut|white|grey|gray|colour|color|painted|plain', 0), ('mirror|mirrored|mirrors', 1),
               ('mix|mixed|mirror and|and mirror|one mirror|1 mirror|split', 2), ('glass|lacquered|black glass|white glass', 3)],
        lbl=['Woodgrain', 'Mirror', 'Mirror &amp; panels', 'Lacquered glass'], say=['woodgrain', 'mirror', 'mirror-and-panel', 'lacquered glass'],
        q='Doors? pick below'),
  ],
  base=[[1200, 1800], [1600, 2400], [2100, 3200], [2900, 4400]],
  inst=[[250, 350], [300, 450], [400, 600], [550, 900]],
  ext={'drawers': X_DRAWERS, 'shoes': X_SHOES, 'led': X_LED, 'dress': X_DRESS, 'glass': X_GLASS},
  lbl=dict(base='Cabinets &amp; sliding doors', ext='Extras', inst='Delivery &amp; fitting'),
  notes=[],
  say=r"function(s,w){return 'A '+w('sz')+' sliding wardrobe with '+w('st')+' doors'}",
  tip=r'''function(s,gbp,rnd){
 if(s.v.st===3)return 'Lacquered glass is our most striking door. Mirror doors cost a little less and make the room feel bigger.';
 if(s.sz>=1&&!s.has('drawers'))return 'A drawer unit behind the doors is the most popular addition. Add it to see the difference.';
 if(s.lo>=6000)return 'This is eligible for 0% finance, so you can spread the cost (50% deposit, subject to status).';
 return 'Sliding doors need no room to swing open, so they suit smaller bedrooms and beds close to the wardrobe.';
}''', fine=FINE_FURN.format(what='sliding wardrobes', x=', including the doors and tracks')),

 'walkin': dict(
  noun='walk-in wardrobe', ev='walkin_cost_guide', title='What could your walk-in wardrobe cost?',
  lead=lead('walk-in wardrobe'),
  ph='e.g. a walk-in wardrobe in a box room with open hanging, drawers, a shoe wall and lighting',
  ex=[('Box room walk-in', 'A small walk-in wardrobe in a box room, plain white with drawers'),
      ('Dressing room in walnut', 'A large walnut dressing room with drawers, shoe storage and LED lighting'),
      ('Dressing suite with island', 'A dressing suite with an island, a lit mirror and a dressing table')],
  groups=[
   dict(n='sz', legend='How big is it?', ev='size', checked=1,
        opts=[('Box room', 'One wall and a corner'), ('Medium', 'Two walls of storage'),
              ('Large', 'Three walls, a full dressing room'), ('Dressing suite', 'A large room with an island')],
        svg=['<svg viewBox="0 0 46 30"><rect x="3" y="3" width="40" height="24"/><path d="M3 3h40v6H3zM37 9h6v8h-6z"/></svg>',
             '<svg viewBox="0 0 46 30"><rect x="3" y="3" width="40" height="24"/><path d="M3 3h40v6H3zM3 9h6v18H3z"/></svg>',
             '<svg viewBox="0 0 46 30"><rect x="3" y="3" width="40" height="24"/><path d="M3 3h40v6H3zM3 9h6v18H3zM37 9h6v18h-6z"/></svg>',
             '<svg viewBox="0 0 46 30"><rect x="3" y="3" width="40" height="24"/><path d="M3 3h40v6H3zM3 9h6v18H3zM37 9h6v18h-6zM18 15h10v6H18z"/></svg>'],
        words=[('box room|boxroom|small|compact|tiny|corner|one wall', 0), ('medium|two walls|2 walls|l[\\s-]?shaped?|average|spare room', 1),
               ('large|big|three walls|3 walls|u[\\s-]?shaped?|full dressing room|dressing room', 2), ('suite|huge|massive|whole room|luxury', 3)],
        lbl=['Box room', 'Medium', 'Large', 'Dressing suite'], say=['box-room', 'medium', 'large', 'dressing-suite'], q='Size? pick below'),
   dict(n='st', legend='Which style?', ev='style',
        opts=[('Open, plain colour', 'White, grey, cashmere or black'), ('Open, woodgrain', 'Walnut, oak or larch effects'),
              ('With doors', 'Some sections behind doors')],
        mult=[1, 1.05, 1.25],
        words=[('white|grey|gray|cashmere|black|plain|colour|color|open', 0), ('woodgrain|wood grain|walnut|oak|larch|wood', 1),
               ('doors|with doors|closed|cupboards|hidden', 2)],
        lbl=['Plain colour', 'Woodgrain', 'With doors'], say=['in a plain colour', 'in woodgrain', 'with some sections behind doors'], q='Style? pick below'),
  ],
  base=[[1000, 1600], [1800, 2800], [2800, 4200], [4000, 6000]],
  inst=[[300, 450], [400, 650], [600, 900], [900, 1400]],
  ext={'island': E('a dressing island', 'Dressing island', [900, 1800], 'island|centre unit|center unit', mult=True, incl=[3], sizeIf=3),
       'drawers': X_DRAWERS, 'shoes': E('shoe storage', 'Shoe storage', [275, 550], 'shoe wall|shoe carousel|carousel|shoe rack|shoes?|shoe storage|trainers|handbags?|bags'),
       'led': X_LED, 'dress': X_DRESS,
       'mirror': E('a lit mirror', 'Lit mirror', [275, 450], 'mirror|mirrored|mirrors')},
  lbl=dict(base='Cabinets &amp; shelving', ext='Extras', inst='Delivery &amp; fitting'),
  notes=[],
  say=r"function(s,w){return 'A '+w('sz')+' walk-in wardrobe '+w('st')}",
  tip=r'''function(s,gbp,rnd){
 if(s.v.st===2)return 'Open shelving keeps everything in sight and costs about a fifth less than putting it behind doors.';
 if(!s.has('led'))return 'LED lighting in the shelves and rails makes a walk-in feel like a boutique, and it is one of the cheaper extras.';
 if(s.sz>=2&&!s.has('drawers'))return 'Drawers with dividers are ideal for jewellery and accessories. Add them to see the difference.';
 if(s.lo>=6000)return 'This is eligible for 0% finance, so you can spread the cost (50% deposit, subject to status).';
 return 'We plan the hanging, drawers and shoe storage around what you actually own.';
}''', fine=FINE_FURN.format(what='walk-in wardrobes', x='')),

 'sloping': dict(
  noun='sloping-ceiling wardrobe', ev='sloping_cost_guide', title='What could your sloping-ceiling wardrobes cost?',
  lead=('Tell us about your room in a sentence: the slope, the space and what you&rsquo;d like to store. We&rsquo;ll show you a guide price '
        'based on real quotes for sloping-ceiling wardrobes we&rsquo;ve made in our Peterborough workshop and fitted ourselves.'),
  ph='e.g. wardrobes under a 3 m sloping ceiling in a loft room, with drawers and LED lights',
  ex=[('Eaves cupboards', 'Small eaves cupboards under a sloping ceiling, about 2 m wide'),
      ('Full wall in a loft', 'Wardrobes along a 3 m sloping wall in a loft conversion with drawers and lighting'),
      ('Whole loft room in gloss', 'A whole loft bedroom of high-gloss wardrobes with a dressing table')],
  groups=[
   dict(n='sz', legend='How much space?', ev='size', checked=1,
        opts=[('Small', 'One eaves run, up to 2&nbsp;m'), ('Medium', 'A full wall, 2&ndash;3.5&nbsp;m'),
              ('Large', 'Two walls or a dormer'), ('Whole loft', 'A loft room, wall to wall')],
        svg=['<svg viewBox="0 0 46 30"><path d="M3 27h40M3 27V15l12-12h28v24"/><path d="M3 15h10v12"/></svg>',
             '<svg viewBox="0 0 46 30"><path d="M3 27h40M3 27V15l12-12h28v24"/><path d="M3 15h24v12M15 3v24"/></svg>',
             '<svg viewBox="0 0 46 30"><path d="M3 27h40M3 27V15l12-12h28v24"/><path d="M3 15h40M15 3v24M29 3v24"/></svg>',
             '<svg viewBox="0 0 46 30"><path d="M3 27h40M3 27V15l12-12h16l12 12v12"/><path d="M3 15h40M15 3v24M31 3v24"/></svg>'],
        metres=[2.2, 3.7, 5.2],
        words=[('small|eaves|cupboard|knee wall|compact|little', 0), ('medium|one wall|full wall|average', 1),
               ('large|big|two walls|dormer|both sides', 2), ('whole loft|loft room|entire|wall to wall|wall-to-wall|whole room|huge', 3)],
        lbl=['Small', 'Medium', 'Large', 'Whole loft'], say=['small', 'medium', 'large', 'whole-loft'], q='Size? pick below'),
   DOOR_FINISH,
  ],
  base=[[1000, 1600], [1600, 2600], [2600, 4000], [4000, 6000]],
  inst=[[300, 450], [450, 650], [650, 1000], [1000, 1500]],
  ext={'drawers': X_DRAWERS, 'led': X_LED, 'dress': X_DRESS,
       'gola': E('a handleless rail', 'Handleless rail', [90, 200], 'handle[\\s-]?less|gola|no handles'),
       'mirror': X_MIRROR},
  lbl=dict(base='Angled cabinets &amp; doors', ext='Extras', inst='Delivery &amp; fitting'),
  notes=[],
  say=r"function(s,w){return 'A '+w('sz')+' run of sloping-ceiling wardrobes with '+w('st')+' doors'}",
  tip=r'''function(s,gbp,rnd){
 if(s.v.st===2)return 'High-gloss doors bounce light around a loft room. A matt door in the same colour costs about a fifth less.';
 if(!s.has('led'))return 'Deep eaves corners are hard to see into. LED lighting fixes that and is one of the cheaper extras.';
 if(!s.has('drawers'))return 'Low drawers fit neatly where the ceiling is too low for hanging. Add them to see the difference.';
 if(s.lo>=6000)return 'This is eligible for 0% finance, so you can spread the cost (50% deposit, subject to status).';
 return 'We measure the exact angle of your roof, so the doors follow the slope with no gaps.';
}''', fine=FINE_FURN.format(what='sloping-ceiling wardrobes', x='')),

 'mediawall': dict(
  noun='media wall', ev='mediawall_cost_guide', title='What could your media wall cost?',
  lead=lead('media wall'),
  ph='e.g. a floor-to-ceiling media wall with alcove units either side, LED lights and slatted panels',
  ex=[('TV unit with shelves', 'A compact TV unit with floating shelves and LED lighting'),
      ('Alcove units', 'Media wall units in the alcoves either side of the chimney breast, painted doors'),
      ('Wall to wall with glass', 'A wall-to-wall floor-to-ceiling media wall with glass display doors and lighting')],
  groups=[
   dict(n='sz', legend='How big is it?', ev='size', checked=1,
        opts=[('Compact', 'A TV unit with shelving'), ('Alcoves', 'Units either side of a chimney breast'),
              ('Full wall', 'Floor to ceiling, one wall'), ('Wall to wall', 'Floor to ceiling, wall to wall')],
        svg=['<svg viewBox="0 0 46 30"><rect x="3" y="19" width="40" height="8"/><path d="M14 5h18v11H14z"/></svg>',
             '<svg viewBox="0 0 46 30"><rect x="3" y="3" width="40" height="24"/><path d="M12 3v24M34 3v24M15 6h16v10H15z"/></svg>',
             '<svg viewBox="0 0 46 30"><rect x="3" y="3" width="40" height="24"/><path d="M10 3v24M36 3v24M3 21h40M14 6h18v11H14z"/></svg>',
             '<svg viewBox="0 0 46 30"><rect x="3" y="3" width="40" height="24"/><path d="M9 3v24M15 3v24M31 3v24M37 3v24M3 21h40M17 6h12v11H17z"/></svg>'],
        metres=[2.6, 3.6, 4.6],
        words=[('compact|small|tv unit|tv stand|low unit|floating unit|sideboard', 0), ('alcoves?|chimney|either side|both sides', 1),
               ('full wall|floor to ceiling|floor-to-ceiling|large|big|tall', 2), ('wall to wall|wall-to-wall|whole wall|entire wall|huge|massive', 3)],
        lbl=['Compact', 'Alcoves', 'Full wall', 'Wall to wall'], say=['compact', 'alcove', 'full-wall', 'wall-to-wall'], q='Size? pick below'),
   dict(n='st', legend='Finish', ev='finish',
        opts=[('Woodgrain or matt', 'Oak, walnut, larch or plain'), ('Painted-look doors', 'Shaker or panelled doors'),
              ('High gloss', 'Gloss or premium finishes')],
        mult=[1, 1.1, 1.2],
        words=[('woodgrain|wood grain|oak|walnut|larch|matt|matte|plain|white|grey|gray|black|handleless|gola|modern', 0),
               ('painted|shaker|panelled|paneled|framed|classic|linen', 1), ('gloss|glossy|high gloss|acrylic|marble|galaxy|shiny', 2)],
        lbl=['Woodgrain / matt', 'Painted-look', 'High gloss'], say=['woodgrain', 'painted-look', 'high-gloss'], q='Finish? pick below'),
  ],
  base=[[700, 1100], [1400, 2100], [1800, 2600], [2400, 3400]],
  inst=[[300, 450], [500, 700], [700, 900], [800, 1100]],
  ext={'led': E('LED lighting', 'LED lighting', [200, 480], 'led|lighting|lights|lit|light|glow|backlit'),
       'glass': E('glass display doors', 'Glass display doors', [245, 600], 'glass|display|glazed|bronze|tinted'),
       'panels': E('slatted acoustic panels', 'Slatted panels', [125, 400], 'slat|slats|slatted|acoustic|panelling|paneling|panels?|fluted'),
       'drawers': E('drawers', 'Drawers', [150, 400], 'drawers?')},
  lbl=dict(base='Cabinets &amp; panels', ext='Extras', inst='Delivery &amp; fitting'),
  notes=[dict(words='fire|fireplace|electric fire|inset fire|flame', chip='Fire: priced separately',
              tip='The electric fire itself isn’t in this guide price. We build it into the joinery and price it with your design.'),
         dict(words='mount|mounting|bracket|hang the tv|wall mount', chip='TV mounting',
              tip='We can mount your TV on the wall as part of fitting, on a suitable wall with a bracket you supply.')],
  say=r"function(s,w){return 'A '+w('sz')+' media wall in a '+w('st')+' finish'}",
  tip=r'''function(s,gbp,rnd){
 if(s.v.st===2)return 'Gloss and premium finishes make a real statement. A matt or woodgrain finish costs a little less.';
 if(!s.has('led'))return 'LED lighting is what makes a media wall glow in the evening. Add it to see the difference.';
 if(s.sz>=2&&!s.has('glass'))return 'Glass display doors with lighting are a lovely way to show off ornaments and keep the dust off.';
 if(s.lo>=6000)return 'This is eligible for 0% finance, so you can spread the cost (50% deposit, subject to status).';
 return 'We plan power, HDMI and network cables before designing the joinery, so nothing trails across the wall.';
}''', fine=FINE_FURN.format(what='media walls', x='').replace('Electrical connections are extra unless agreed.',
       'Electrical connections, TV set-up and the fire itself are extra unless agreed.')),

 'bedroom': dict(
  noun='fitted bedroom', ev='bedroom_cost_guide', title='What could your fitted bedroom cost?',
  lead=('Tell us about the room in a sentence: the wardrobes, bedside units, dressing table, anything you&rsquo;d like. We&rsquo;ll show you a '
        'guide price based on real quotes for bedrooms we&rsquo;ve made in our Peterborough workshop and fitted ourselves.'),
  ph='e.g. wall-to-wall wardrobes with Shaker doors, two floating bedside units and a dressing table',
  ex=[('Wardrobes and bedsides', 'Medium fitted wardrobes with matt doors and a pair of floating bedside units'),
      ('The full room', 'Wall-to-wall wardrobes, bedside units, a panelled headboard wall and a dressing table'),
      ('Gloss with a lit mirror', 'High-gloss wardrobes with a dressing table, a mirror and LED lighting')],
  groups=[dict(n='sz', legend='How much wardrobe?', checked=1, **dict(WARD_SIZES, lbl=['Single', 'Medium', 'Large', 'Wall to wall'])), DOOR_FINISH],
  base=[[700, 1100], [1300, 2000], [2200, 3300], [3400, 5000]],
  inst=[[200, 300], [300, 450], [450, 800], [800, 1400]],
  ext={'bedside': E('bedside units', 'Bedside units (pair)', [400, 750], 'bedside|bed side|nightstand|night stand|side tables?', mult=True),
       'dress': X_DRESS,
       'head': E('a panelled headboard wall', 'Headboard wall', [300, 800], 'headboard|head board|panelled wall|paneled wall|panelling|paneling|slat|slatted|fluted|niche'),
       'led': X_LED, 'mirror': X_MIRROR, 'drawers': X_DRAWERS},
  lbl=dict(base='Wardrobes &amp; doors', ext='Bedside, dressing &amp; extras', inst='Delivery &amp; fitting'),
  notes=[],
  say=r"function(s,w){return 'A fitted bedroom with '+w('sz')+' wardrobes in a '+w('st')+' finish'}",
  tip=r'''function(s,gbp,rnd){
 if(s.v.st===2)return 'High-gloss acrylic gives a mirror-like finish. A matt door in the same colour costs about a fifth less.';
 if(!s.has('bedside'))return 'Bedside units made to match the wardrobes make the room feel designed as a whole. Add them to see the difference.';
 if(s.has('bedside')&&!s.has('led'))return 'LED niches and reading lights built into the joinery cost less than most people expect.';
 if(s.lo>=6000)return 'This is eligible for 0% finance, so you can spread the cost (50% deposit, subject to status).';
 return 'We design the wardrobes, headboard wall, bedside units and lighting together, so the room feels finished.';
}''', fine=FINE_FURN.format(what='fitted bedrooms', x='')),
}

# words for size groups that carry metres
for k in ('wardrobe', 'bedroom'):
    SERVICES[k]['groups'][0]['metres'] = WARD_SIZES['metres']


def build(key, c):
    groups_html = []
    for gi, g in enumerate(c['groups']):
        n = len(g['opts'])
        chk = g.get('checked', 0)
        labs = []
        for i, (b, sp) in enumerate(g['opts']):
            svg = g['svg'][i] if g.get('svg') else ''
            labs.append(f'     <label><input type="radio" name="{g["n"]}" value="{i}"{" checked" if i == chk else ""}>{svg}<b>{b}</b><span>{sp}</span></label>')
        groups_html.append(f'   <fieldset><legend><i>0{gi + 1}</i>{g["legend"]}</legend>\n    <div class="op op{n}">\n' + '\n'.join(labs) + '\n    </div>\n   </fieldset>')
    ext = c['ext']
    xl = [f'     <label{(" data-x=" + chr(34) + k + chr(34)) if v.get("incl") else ""}><input type="checkbox" name="x" value="{k}"><b>{v["lbl"]}</b></label>' for k, v in ext.items()]
    groups_html.append(f'   <fieldset class="xt"><legend><i>0{len(c["groups"]) + 1}</i>Anything else? <span style="letter-spacing:.1em;text-transform:none">(optional)</span></legend>\n    <div class="op op{len(ext)}">\n' + '\n'.join(xl) + '\n    </div>\n   </fieldset>')
    ex = ''.join(f'<button type="button" data-t="{html.escape(t)}">{b}</button>' for b, t in c['ex'])
    inc = ''.join(f'<li>{i}</li>' for i in INC)
    # config (data as JSON, functions as raw JS)
    cfg = dict(ev=c['ev'], base=c['base'], inst=c['inst'], lbl={k: html.unescape(v) for k, v in c['lbl'].items()}, metres=c['groups'][0].get('metres'), notes=c.get('notes', []),
               groups=[{k: (html.unescape(v) if isinstance(v, str) else [html.unescape(x) if isinstance(x, str) else x for x in v] if k in ('lbl', 'say') else v)
                        for k, v in g.items() if k in ('n', 'mult', 'add', 'label', 'words', 'lbl', 'say', 'q', 'ev')} for g in c['groups']],
               ext={k: {kk: (html.unescape(vv) if isinstance(vv, str) and kk != 'words' else vv) for kk, vv in v.items()} for k, v in ext.items()})
    for g in cfg['groups']:
        g.setdefault('ev', g['n'])
    js = 'window.__ABJ_CALC__=' + json.dumps(cfg, ensure_ascii=False, separators=(',', ':'))[:-1] + ',say:' + c['say'] + ',tip:' + c['tip'] + '};\n' + ENGINE
    out = f'''<section class="calc s1" id="kc-cost" aria-label="{c['noun'].capitalize()} cost guide">
{CSS}
<div class="w ch">
 <div class="rv">
  <span class="kick">Cost guide</span>
  <h2>{c['title']}</h2>
  <p class="lead">{c['lead']}</p>
  <form id="kc-calc" onsubmit="return false">
   <div class="ai"><div class="ai-in" onclick="if(event.target===this)document.getElementById('kc-say').focus()"><span class="ai-k"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l1.9 5.1 5.1 1.9-5.1 1.9L10 15.5l-1.9-5.1L3 8.5l5.1-1.9z"/><path d="M16 13l.8 2.2 2.2.8-2.2.8L16 19l-.8-2.2-2.2-.8 2.2-.8z"/></svg>Describe it in your own words</span>
    <textarea id="kc-say" rows="2" placeholder="{c['ph']}"></textarea>
    <span class="ai-go"><button type="button" class="bt" id="kc-go">Show my guide price</button></span></div>
    <div class="ai-out" id="kc-got" aria-live="polite"></div>
    <div class="ai-ex"><span>Try</span>{ex}</div>
    <button type="button" class="ai-skip" id="kc-skip">or choose the options yourself</button>
   </div>
   <div class="pk">
   <p class="or"><span id="kc-or">Adjust anything below</span></p>
{chr(10).join(groups_html)}
   </div>
  </form>
 </div>
 <aside class="res rv" aria-live="polite">
  <span class="kick">Your guide price</span>
  <div class="ph"><div class="pr">&pound;&thinsp;&ndash;</div><p>Describe your {c['noun']} and your guide price appears here, with what makes it up and how to bring it down.</p><ul class="inc">{inc}</ul></div>
  <div class="full">
  <div class="pr"><span id="kc-lo">&pound;0</span><em>to</em><span id="kc-hi">&pound;0</span></div>
  <p class="sum" id="kc-sum"></p>
  <p class="tip" id="kc-tip"></p>
  <div class="bars" id="kc-bars"></div>
  <ul class="inc">{inc}</ul>
  <div class="acts"><a class="bt" href="/bookingform" id="kc-cb">Book a free design visit</a><a class="bt o" id="kc-wa" href="https://wa.me/447479219421" target="_blank" rel="noopener">Send this to us</a></div>
  </div>
  <p class="fine">{c['fine']}</p>
 </aside>
</div>
<a class="pill" href="#kc-cost" aria-label="Jump to your guide price"><span>Guide price</span><b id="kc-pl">&pound;0</b></a>
<script>
{js}</script>
</section>
'''
    open(os.path.join(HERE, f'{key}_calc.html'), 'w').write(out)
    return len(out)


if __name__ == '__main__':
    for k, c in SERVICES.items():
        print(k, build(k, c))
