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
FIN = 'Prices include VAT. 0% finance is available on projects over &pound;6,000 (subject to status).'


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


MEDIA_FINISH = dict(n='st', legend='Finish', ev='finish',
        opts=[('Woodgrain or matt', 'Oak, walnut, larch or plain'), ('Painted-look doors', 'Shaker or panelled doors'),
              ('High gloss', 'Gloss or premium finishes')],
        mult=[1, 1.1, 1.2],
        words=[('woodgrain|wood grain|oak|walnut|larch|matt|matte|plain|white|grey|gray|black|handleless|gola|modern', 0),
               ('painted|shaker|panelled|paneled|framed|classic|linen', 1), ('gloss|glossy|high gloss|acrylic|marble|galaxy|shiny', 2)],
        lbl=['Woodgrain / matt', 'Painted-look', 'High gloss'], say=['woodgrain', 'painted-look', 'high-gloss'], q='Finish? pick below')

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
               ('large|big|biggish|u[\\s-]?shaped?|u[\\s-]?shape|spacious|bank of tall|long', 2),
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
 'alcove': dict(
  noun='alcove units', ev='alcove_cost_guide', title='What could your alcove units cost?',
  lead=('Tell us about your alcoves in a sentence: one or both, cupboards, shelves or a desk. We&rsquo;ll show you a guide price worked out '
        'from our real quotes for fitted furniture made in our Peterborough workshop and fitted by our team.'),
  ph='e.g. cupboards with floating shelves in both alcoves either side of the chimney, painted doors and LED lights',
  ex=[('Both alcoves, painted', 'Cupboards and shelves in both alcoves either side of the chimney breast, painted doors'),
      ('One alcove desk', 'A built-in desk with shelving in one alcove'),
      ('Full wall with slats', 'A full wall of alcove units across the chimney breast, oak slats and LED lighting')],
  groups=[
   dict(n='sz', legend='How much?', ev='size', checked=1,
        opts=[('One alcove', 'Cupboard and shelves'), ('Both alcoves', 'Cupboards below, shelves above'),
              ('Both, full height', 'Floor-to-ceiling units'), ('Full wall', 'Alcoves joined across the chimney')],
        svg=['<svg viewBox="0 0 46 30"><rect x="3" y="3" width="40" height="24"/><path d="M15 3v24M31 3v24M3 18h12M3 11h12"/></svg>',
             '<svg viewBox="0 0 46 30"><rect x="3" y="3" width="40" height="24"/><path d="M13 3v24M33 3v24M3 18h10M33 18h10M3 11h10M33 11h10"/></svg>',
             '<svg viewBox="0 0 46 30"><rect x="3" y="3" width="40" height="24"/><path d="M13 3v24M33 3v24M8 3v24M38 3v24"/></svg>',
             '<svg viewBox="0 0 46 30"><rect x="3" y="3" width="40" height="24"/><path d="M13 3v24M33 3v24M13 9h20M8 3v24M38 3v24"/></svg>'],
        words=[('one alcove|single alcove|an alcove|one side', 0), ('both alcoves|two alcoves|either side|both sides|pair', 1),
               ('full height|floor to ceiling|floor-to-ceiling|bookcases?|tall', 2), ('whole wall|full wall|over the chimney|across the chimney|wall to wall', 3)],
        lbl=['One alcove', 'Both alcoves', 'Full height', 'Full wall'], say=['one alcove', 'both alcoves', 'both alcoves, full height', 'a full wall'],
        q='How much? pick below'),
   dict(MEDIA_FINISH),
  ],
  base=[[500, 850], [900, 1500], [1300, 2000], [1800, 2600]],
  inst=[[200, 300], [300, 450], [400, 600], [500, 750]],
  ext={'led': X_LED, 'glass': E('glass doors', 'Glass doors', [245, 600], 'glass|glazed|display'),
       'shelves': E('floating shelves', 'Floating shelves', [100, 300], 'floating shel(f|ves)|floating'),
       'desk': E('a built-in desk', 'Built-in desk', [300, 700], 'desk|study|work from home|home office'),
       'slats': E('slatted panels', 'Slatted panels', [125, 400], 'slat|slats|slatted|acoustic|fluted'),
       'drawers': E('drawers', 'Drawers', [150, 400], 'drawers?')},
  lbl=dict(base='Cabinets &amp; shelving', ext='Extras', inst='Delivery &amp; fitting'), notes=[],
  say=r"function(s,w){return 'Alcove units for '+w('sz')+' in a '+w('st')+' finish'}",
  tip=r"""function(s,gbp,rnd){
 if(s.v.st===2)return 'Gloss and premium finishes make a real statement. A matt or woodgrain finish costs a little less.';
 if(!s.has('led'))return 'LED lighting under the shelves makes alcoves glow in the evening, and it is one of the cheaper extras.';
 if(s.lo>=6000)return 'This is eligible for 0% finance, so you can spread the cost (50% deposit, subject to status).';
 return 'Every alcove is a different size, so we measure each one and make the units to fit, wall to wall.';
}""", fine=FINE_FURN.format(what='fitted furniture', x='').replace('based on recent quotes for fitted furniture', 'worked out from our recent quotes for fitted furniture')),

 'understairs': dict(
  noun='under-stairs storage', ev='understairs_cost_guide', title='What could your under-stairs storage cost?',
  lead=('Tell us about your stairs in a sentence and what you&rsquo;d like to keep there. We&rsquo;ll show you a guide price worked out from our '
        'real quotes for fitted furniture made in our Peterborough workshop and fitted by our team.'),
  ph='e.g. pull-out shoe and coat towers under the whole staircase, painted Shaker doors and lighting',
  ex=[('Pull-outs for shoes and coats', 'Three pull-out towers under the stairs for shoes and coats'),
      ('Full staircase of drawers', 'Drawers and pull-outs along the whole staircase, handleless'),
      ('Open stairs with a desk', 'An open-plan staircase with a built-in desk and shelving')],
  groups=[
   dict(n='sz', legend='How much space?', ev='size', checked=1,
        opts=[('Small', 'A cupboard or two pull-outs'), ('Medium', 'Three or four pull-outs'),
              ('Full staircase', 'Pull-outs and drawers all along'), ('Feature', 'Open stairs with shelving or a desk')],
        svg=['<svg viewBox="0 0 46 30"><path d="M3 27h40V3L3 27z" fill="none"/><path d="M31 27V10M37 27V6"/></svg>',
             '<svg viewBox="0 0 46 30"><path d="M3 27h40V3L3 27z"/><path d="M25 27V16M31 27V12M37 27V7"/></svg>',
             '<svg viewBox="0 0 46 30"><path d="M3 27h40V3L3 27z"/><path d="M13 27v-6M19 27V18M25 27V15M31 27V11M37 27V7"/></svg>',
             '<svg viewBox="0 0 46 30"><path d="M3 27h40V3L3 27z"/><path d="M15 27V20h14v7M31 12h10"/></svg>'],
        words=[('small|cupboard|one door|two pull[\\s-]?outs?|2 pull[\\s-]?outs?', 0), ('medium|three|four|3 pull|4 pull', 1),
               ('whole staircase|whole stair|full staircase|all along|entire|full length|large|big', 2), ('open[\\s-]?plan|open stairs|feature|desk|study|wine', 3)],
        lbl=['Small', 'Medium', 'Full staircase', 'Feature'], say=['small', 'medium', 'full-length', 'feature'], q='Size? pick below'),
   dict(n='st', legend='What kind of storage?', ev='type',
        opts=[('Cupboards &amp; shelves', 'Doors with shelving behind'), ('Pull-out towers', 'Full-depth towers that slide out'),
              ('Drawers', 'Deep drawers cut to the stairs')],
        mult=[1, 1.2, 1.25],
        words=[('cupboards?|doors?|shelves|shelving', 0), ('pull[\\s-]?outs?|towers?|slide out', 1), ('drawers?', 2)],
        lbl=['Cupboards', 'Pull-outs', 'Drawers'], say=['cupboard', 'pull-out', 'drawer'], q='Type? pick below'),
  ],
  base=[[600, 1000], [1000, 1600], [1500, 2300], [2000, 3000]],
  inst=[[200, 300], [250, 400], [350, 550], [450, 700]],
  ext={'led': X_LED, 'shoes': E('shoe racks', 'Shoe racks', [100, 300], 'shoes?|shoe racks?|trainers|boots'),
       'coats': E('coat hanging', 'Coat hanging', [50, 150], 'coats?|jackets?|hanging|hooks'),
       'wine': E('wine storage', 'Wine storage', [150, 400], 'wine|bottles'),
       'desk': E('a built-in desk', 'Built-in desk', [300, 700], 'desk|study|work from home|home office'),
       'gola': E('a handleless finish', 'Handleless', [50, 150], 'handle[\\s-]?less|push to open|push-to-open|gola')},
  lbl=dict(base='Units &amp; doors', ext='Extras', inst='Delivery &amp; fitting'), notes=[],
  say=r"function(s,w){return 'A '+w('sz')+' under-stairs design with '+w('st')+' storage'}",
  tip=r"""function(s,gbp,rnd){
 if(s.v.st===0&&s.sz>=1)return 'Pull-out towers bring everything to the front, so nothing gets lost at the back. They cost about a fifth more.';
 if(!s.has('led'))return 'A little LED lighting makes deep under-stairs space much easier to use.';
 if(s.lo>=6000)return 'This is eligible for 0% finance, so you can spread the cost (50% deposit, subject to status).';
 return 'Every staircase is different, so we cut each unit to the angle of yours.';
}""", fine=FINE_FURN.format(what='fitted furniture', x='').replace('based on recent quotes for fitted furniture', 'worked out from our recent quotes for fitted furniture')),

 'storage': dict(
  noun='storage', ev='storage_cost_guide', title='What could your storage cost?',
  lead=('Tell us what you&rsquo;d like in a sentence: a larder, a utility room, a boot room or living room storage. We&rsquo;ll show you a guide '
        'price worked out from our real quotes for fitted furniture made in our Peterborough workshop and fitted by our team.'),
  ph='e.g. a utility room with tall units, a laminate worktop, a pull-out bin and a boot bench',
  ex=[('A tall larder', 'One tall larder cupboard with pull-out shelves'),
      ('Utility room', 'A utility room with tall units, a laminate worktop and a pull-out bin'),
      ('Boot room', 'A boot room with tall cupboards, a bench and coat storage, painted Shaker')],
  groups=[
   dict(n='sz', legend='How much?', ev='size', checked=1,
        opts=[('Single unit', 'One tall larder or cupboard'), ('Small run', 'About 2&ndash;3&nbsp;m of units'),
              ('Utility or boot room', 'A room&rsquo;s worth of units'), ('Full room', 'Two or three walls')],
        svg=[panels(1), panels(3), panels(5), panels(8)], metres=[1.2, 3.2, 5],
        words=[('single|one unit|one cupboard|a larder|larder cupboard|tall cupboard|pantry cupboard', 0), ('small|run|wall of|living room|lounge', 1),
               ('utility|boot room|bootroom|laundry|pantry room|walk-in pantry', 2), ('full room|whole room|two walls|three walls|large|big', 3)],
        lbl=['Single unit', 'Small run', 'Utility / boot room', 'Full room'], say=['single-unit', 'small', 'utility-size', 'full-room'], q='Size? pick below'),
   dict(n='st', legend='Which style?', ev='style',
        opts=[('Handleless or matt', 'Clean, modern lines'), ('Shaker', 'Framed doors in any colour'), ('Gloss', 'High-gloss acrylic')],
        mult=[1, 1.1, 1.15],
        words=[('handle[\\s-]?less|matt|matte|modern|plain|woodgrain|oak|white|grey', 0), ('shaker|painted|classic|cottage|framed', 1), ('gloss|glossy|acrylic', 2)],
        lbl=['Handleless / matt', 'Shaker', 'Gloss'], say=['handleless', 'Shaker', 'gloss'], q='Style? pick below'),
  ],
  base=[[500, 900], [1300, 2100], [2200, 3500], [3300, 5000]],
  inst=[[150, 250], [350, 550], [550, 850], [800, 1200]],
  ext={'worktop': E('a laminate worktop', 'Worktop', [250, 600], 'worktops?|counter|work surface|sink'),
       'larder': E('larder pull-outs', 'Larder pull-outs', [300, 700], 'pull[\\s-]?outs?|spice|larder fittings'),
       'led': X_LED, 'bin': E('a pull-out bin', 'Pull-out bin', [235, 300], 'bins?|recycling|waste'),
       'bench': E('a boot bench', 'Boot bench', [250, 500], 'bench|seat|boots?|coats?'),
       'glass': E('a glass display cabinet', 'Glass display', [300, 650], 'glass|display|glazed')},
  lbl=dict(base='Cabinets &amp; panels', ext='Extras', inst='Delivery &amp; fitting'),
  notes=[dict(words='washing machine|dryer|appliances?|sink|tap', chip='Appliances: not included',
              tip='Appliances, sinks and taps aren’t in this guide price. We design the units around the ones you have.')],
  say=r"function(s,w){return 'A '+w('sz')+' '+w('st')+' storage design'}",
  tip=r"""function(s,gbp,rnd){
 if(s.sz===0&&!s.has('larder'))return 'Larder pull-outs bring tins and jars to the front, so nothing is lost at the back.';
 if(s.sz>=2&&!s.has('worktop'))return 'Most utility rooms we make have a worktop for folding and sorting. Add it to see the difference.';
 if(s.lo>=6000)return 'This is eligible for 0% finance, so you can spread the cost (50% deposit, subject to status).';
 return 'Every unit is drawn around the space and the things you want to keep in it.';
}""", fine=FINE_FURN.format(what='fitted furniture', x='').replace('based on recent quotes for fitted furniture', 'worked out from our recent quotes for fitted furniture').replace('Electrical connections are', 'Appliances, plumbing and electrical connections are')),

 'office': dict(
  noun='home office', ev='office_cost_guide', title='What could your home office cost?',
  lead=('Tell us about your workspace in a sentence: a desk nook, a study wall or a full room. We&rsquo;ll show you a guide price worked out '
        'from our real quotes for fitted furniture made in our Peterborough workshop and fitted by our team.'),
  ph='e.g. a built-in desk with shelving and cupboards along a 3 m wall, oak finish with LED lighting',
  ex=[('Desk nook', 'A compact desk with shelving built into a bedroom alcove'),
      ('Study wall', 'A 3 m study wall with a desk, cupboards, drawers and shelving'),
      ('Library office', 'A full home office with library shelving, glass doors and LED lighting')],
  groups=[
   dict(n='sz', legend='How big?', ev='size', checked=1,
        opts=[('Desk nook', 'Desk and shelves, up to 1.5&nbsp;m'), ('Study wall', 'Desk and storage, 2&ndash;3&nbsp;m'),
              ('Two walls', 'Desk, storage and shelving'), ('Full office', 'A whole room or library wall')],
        svg=[panels(2), panels(4), panels(6), panels(8)], metres=[1.6, 3.2, 5],
        words=[('nook|compact|small|alcove|bedroom', 0), ('study wall|one wall|medium', 1), ('two walls|l[\\s-]?shaped?|large|big', 2),
               ('full office|whole room|library|entire room|huge', 3)],
        lbl=['Desk nook', 'Study wall', 'Two walls', 'Full office'], say=['desk-nook', 'study-wall', 'two-wall', 'full-room'], q='Size? pick below'),
   DOOR_FINISH,
  ],
  base=[[700, 1100], [1500, 2400], [2400, 3800], [3500, 5500]],
  inst=[[200, 300], [300, 450], [450, 750], [700, 1100]],
  ext={'drawers': E('drawers or filing', 'Drawers / filing', [150, 400], 'drawers?|filing|files|paperwork'),
       'glass': E('glass display doors', 'Glass doors', [245, 600], 'glass|glazed|display'),
       'led': X_LED, 'shelves': E('extra shelving', 'Extra shelving', [100, 300], 'shel(f|ves)|bookcase|books|library'),
       'kit': E('a hidden equipment cupboard', 'Equipment cupboard', [200, 450], 'printer|router|equipment|hidden|chargers?|cables?')},
  lbl=dict(base='Desk, cabinets &amp; doors', ext='Extras', inst='Delivery &amp; fitting'),
  notes=[dict(words='business|commercial|team|staff|reception|boardroom|company', chip='Business office',
              tip='For a business office, our office fit-out page covers commercial work, priced from a site visit.')],
  say=r"function(s,w){return 'A '+w('sz')+' home office with '+w('st')+' doors'}",
  tip=r"""function(s,gbp,rnd){
 if(s.v.st===2)return 'High-gloss acrylic gives a mirror-like finish. A matt door in the same colour costs about a fifth less.';
 if(!s.has('kit'))return 'A ventilated cupboard for the printer and router keeps the room calm and clear.';
 if(s.lo>=6000)return 'This is eligible for 0% finance, so you can spread the cost (50% deposit, subject to status).';
 return 'We plan sockets, cables and screen height into the design, so the desk works as well as it looks.';
}""", fine=FINE_FURN.format(what='fitted furniture', x='').replace('based on recent quotes for fitted furniture', 'worked out from our recent quotes for fitted furniture')),

 'hallway': dict(
  noun='hallway storage', ev='hallway_cost_guide', title='What could your hallway storage cost?',
  lead=('Tell us about your hallway in a sentence: coats, shoes, a bench or a full wall of cupboards. We&rsquo;ll show you a guide price '
        'worked out from our real quotes for fitted furniture made in our Peterborough workshop and fitted by our team.'),
  ph='e.g. a floor-to-ceiling coat and shoe wall with a bench, oak slats and a mirror',
  ex=[('Shoe cabinet', 'A slim shoe cabinet for the hallway'),
      ('Coats, shoes and a bench', 'A coat and shoe unit with a bench seat and hooks'),
      ('Mirrored full wall', 'A full wall of hallway cupboards with mirrored sliding doors and lighting')],
  groups=[
   dict(n='sz', legend='How much?', ev='size', checked=1,
        opts=[('Shoe cabinet', 'A slim unit for shoes'), ('Coat &amp; shoe unit', 'Hanging, shoes and a shelf'),
              ('Full wall', 'Floor-to-ceiling cupboards'), ('Hall &amp; under-stairs', 'A full wall plus under the stairs')],
        svg=[panels(1), panels(2), panels(5), panels(7)],
        words=[('shoe cabinet|slim|small|narrow', 0), ('coat|coats|shoes?|unit|hooks', 1), ('full wall|floor to ceiling|floor-to-ceiling|whole wall|tall', 2),
               ('under[\\s-]?stairs|under the stairs|whole hallway|entire', 3)],
        lbl=['Shoe cabinet', 'Coat &amp; shoe unit', 'Full wall', 'Hall &amp; under-stairs'], say=['shoe-cabinet', 'coat-and-shoe', 'full-wall', 'hall-and-under-stairs'],
        q='Size? pick below'),
   dict(n='st', legend='Door finish', ev='finish',
        opts=[('Matt or woodgrain', 'Plain colours, oak and walnut'), ('Painted-look', 'Shaker or panelled doors'),
              ('Mirrored sliding', 'Full-height mirror doors')],
        mult=[1, 1.15, 1.2],
        words=[('matt|matte|woodgrain|oak|walnut|plain|white|grey', 0), ('painted|shaker|panelled|classic', 1), ('mirror|mirrored|sliding', 2)],
        lbl=['Matt / woodgrain', 'Painted-look', 'Mirrored sliding'], say=['matt', 'painted-look', 'mirrored sliding'], q='Finish? pick below'),
  ],
  base=[[400, 700], [900, 1400], [1500, 2300], [2300, 3500]],
  inst=[[150, 250], [250, 400], [350, 550], [500, 800]],
  ext={'bench': E('a bench seat', 'Bench seat', [200, 450], 'bench|seat'),
       'slats': E('a slatted coat wall', 'Slatted coat wall', [200, 500], 'slat|slats|slatted|hooks'),
       'mirror': E('a mirror', 'Mirror', [155, 300], 'mirror'), 'led': X_LED, 'shoes': X_SHOES},
  lbl=dict(base='Cabinets &amp; doors', ext='Extras', inst='Delivery &amp; fitting'), notes=[],
  say=r"function(s,w){return 'A '+w('sz')+' hallway design with '+w('st')+' doors'}",
  tip=r"""function(s,gbp,rnd){
 if(s.sz>=1&&!s.has('bench'))return 'A bench to sit and change shoes is the most popular addition in a hallway.';
 if(s.v.st!==2&&s.sz>=2)return 'Mirrored sliding doors reflect light into a dark hallway and need no room to swing open.';
 if(s.lo>=6000)return 'This is eligible for 0% finance, so you can spread the cost (50% deposit, subject to status).';
 return 'We build around radiators, meters and door frames, so every centimetre of the hall is used.';
}""", fine=FINE_FURN.format(what='fitted furniture', x='').replace('based on recent quotes for fitted furniture', 'worked out from our recent quotes for fitted furniture')),

 'bathroom': dict(
  noun='bathroom cabinetry', ev='bathroom_cost_guide', title='What could your bathroom cabinetry cost?',
  lead=('Tell us about your bathroom in a sentence: a vanity, tall storage or a whole wall. We&rsquo;ll show you a guide price worked out from '
        'our real quotes for fitted furniture made in our Peterborough workshop and fitted by our team.'),
  ph='e.g. a floating vanity with drawers, a tall unit and a lit mirror in a walnut finish',
  ex=[('Floating vanity', 'A floating vanity unit with two drawers'),
      ('Vanity and tall unit', 'A vanity with a tall storage unit and a lit mirror'),
      ('Whole en-suite', 'Fitted cabinetry for a whole en-suite, fluted fronts and LED lighting')],
  groups=[
   dict(n='sz', legend='How much?', ev='size', checked=1,
        opts=[('Vanity unit', 'One vanity, wall-hung or standing'), ('Vanity &amp; tall unit', 'A vanity plus tall storage'),
              ('Full wall', 'A wall of cabinetry'), ('Whole room', 'Cabinetry around the room')],
        svg=[panels(1), panels(3), panels(5), panels(8)],
        words=[('vanity|basin unit|sink unit|small|single', 0), ('tall unit|tall storage|tallboy|vanity and|plus', 1),
               ('full wall|wall of|whole wall|floor to ceiling|large', 2), ('whole room|en[\\s-]?suite|entire|whole bathroom', 3)],
        lbl=['Vanity unit', 'Vanity &amp; tall unit', 'Full wall', 'Whole room'], say=['a vanity unit', 'a vanity and tall unit', 'a full wall of cabinetry', 'cabinetry for the whole room'],
        q='Size? pick below'),
   dict(n='st', legend='Finish', ev='finish',
        opts=[('Matt or woodgrain', 'Plain colours, oak and walnut'), ('Fluted or slatted', 'Textured fronts'), ('High gloss', 'Gloss acrylic')],
        mult=[1, 1.15, 1.2],
        words=[('matt|matte|woodgrain|oak|walnut|plain|white|grey', 0), ('fluted|slatted|slats|ribbed|textured', 1), ('gloss|glossy|acrylic', 2)],
        lbl=['Matt / woodgrain', 'Fluted', 'High gloss'], say=['matt', 'fluted', 'high-gloss'], q='Finish? pick below'),
  ],
  base=[[500, 900], [900, 1500], [1500, 2400], [2200, 3500]],
  inst=[[150, 250], [250, 400], [350, 550], [450, 700]],
  ext={'top': E('a stone or quartz top', 'Quartz top', [300, 800], 'quartz|stone|marble|top|worktop'),
       'mirror': E('a lit mirror', 'Lit mirror', [275, 450], 'mirror'), 'led': X_LED,
       'drawers': E('extra drawers', 'Extra drawers', [150, 400], 'drawers?'), 'glass': X_GLASS},
  lbl=dict(base='Cabinets &amp; panels', ext='Extras', inst='Delivery &amp; fitting'),
  notes=[dict(words='basin|sink|tap|toilet|wc|shower|bath|plumbing', chip='Sanitaryware: not included',
              tip='Basins, taps, toilets and plumbing aren’t in this guide price. We make the cabinetry around the ones you choose.')],
  say=r"function(s,w){var a=w('sz');return a.charAt(0).toUpperCase()+a.slice(1)+' in a '+w('st')+' finish'}",
  tip=r"""function(s,gbp,rnd){
 if(!s.has('mirror'))return 'A lit mirror finishes a vanity beautifully and is one of the most popular extras.';
 if(s.lo>=6000)return 'This is eligible for 0% finance, so you can spread the cost (50% deposit, subject to status).';
 return 'We use moisture-resistant boards and edging made for bathrooms.';
}""", fine=FINE_FURN.format(what='fitted furniture', x='').replace('based on recent quotes for fitted furniture', 'worked out from our recent quotes for fitted furniture').replace('Electrical connections are', 'Basins, taps, plumbing and electrical connections are')),

 'worktop': dict(
  noun='worktops', ev='worktop_cost_guide', title='What could your worktops cost?',
  lead=('Tell us about your kitchen and the worktop you like in a sentence. We&rsquo;ll show you a guide price based on real quotes for '
        'worktops and splashbacks we&rsquo;ve supplied and fitted.'),
  ph='e.g. quartz worktops with full-height splashbacks for a medium L-shaped kitchen',
  ex=[('Quartz for a medium kitchen', 'Quartz worktops and full-height splashbacks for a medium L-shaped kitchen'),
      ('Laminate for a small kitchen', 'Laminate worktops for a small galley kitchen'),
      ('Stone with a waterfall', 'Natural stone worktops for a large kitchen with a waterfall end')],
  groups=[
   dict(n='sz', legend='How big is the kitchen?', ev='size', checked=1,
        opts=[('Compact', 'Galley or small L, up to 4&nbsp;m'), ('Medium', 'L-shape, about 5&ndash;7&nbsp;m'),
              ('Large', 'U-shape or a long run'), ('Statement', 'Large, with an island')],
        svg=KITCHEN_SVG, metres=[4, 7, 10],
        words=[('compact|small|galley|narrow|tiny', 0), ('medium|average|l[\\s-]?shaped?|standard|decent', 1), ('large|big|u[\\s-]?shaped?|long', 2),
               ('statement|island|open[\\s-]?plan|huge|kitchen[\\s-]?diner', 3)],
        lbl=['Compact', 'Medium', 'Large', 'Statement'], say=['compact', 'medium', 'large', 'statement'], q='Size? pick below'),
   dict(n='wt', legend='Worktop', ev='worktop', label='Worktops &amp; splashbacks', checked=2,
        opts=[('Laminate', 'Matching splashback included'), ('Solid wood', 'Oak or walnut staves'),
              ('Quartz', 'With full-height splashbacks'), ('Natural stone', 'Quartzite, granite or sintered')],
        add=[[[450, 800], [1000, 1400], [1300, 1900], [1700, 2500]],
             [[800, 1400], [1300, 2200], [1900, 3000], [2600, 4000]],
             [[2000, 2800], [3000, 4000], [3300, 4500], [4500, 6500]],
             [[2300, 3200], [3300, 4400], [3700, 5000], [5000, 7200]]],
        words=[('laminate|egger|budget|cheap', 0), ('wood|wooden|oak|walnut|timber|butcher|iroko|solid wood', 1),
               ('quartz|silestone|caesarstone|marble[\\s-]?effect|compac|stone', 2),
               ('sintered|dekton|ceramic|porcelain|neolith|real marble|natural marble|natural stone|quartzite|taj mahal|granite', 3)],
        lbl=['Laminate', 'Solid wood', 'Quartz', 'Natural stone'], say=['laminate', 'solid wood', 'quartz', 'natural stone'], q='Worktop? pick below'),
  ],
  base=[[0, 0], [0, 0], [0, 0], [0, 0]], inst=[[0, 0], [0, 0], [0, 0], [0, 0]],
  ext={'waterfall': E('a waterfall end', 'Waterfall end', [300, 700], 'waterfall'),
       'glass': E('a glass splashback behind the hob', 'Glass hob splashback', [150, 250], 'glass splashback|glass|behind the hob|behind the cooker')},
  lbl=dict(base='', ext='Extras', inst=''),
  notes=[dict(words='sink|tap|hob|appliances?|units|cabinets|doors', chip='Worktops only',
              tip='This guide is for worktops only. For a whole kitchen, use the cost guide on our kitchens page.')],
  say=r"function(s,w){return w('wt').charAt(0).toUpperCase()+w('wt').slice(1)+' worktops for a '+w('sz')+' kitchen'}",
  tip=r"""function(s,gbp,rnd){
 if(s.v.wt===3)return 'Natural stone is one of a kind. Quartz gives a similar look for a little less.';
 if(s.v.wt===0&&s.sz>=1)return 'Upgrading to quartz with full-height splashbacks adds about '+['£1,550 to £2,000','£2,000 to £2,600','£2,000 to £2,600','£2,800 to £4,000'][s.sz]+' on a kitchen this size.';
 if(s.v.wt===1)return 'Solid wood needs oiling now and then. Quartz is the low-maintenance choice.';
 return 'We bring samples to your home so you can compare them in your own light.';
}""",
  fine=('A rough guide based on recent quotes for worktops we&rsquo;ve supplied and fitted, not a quote. Your exact price comes after we measure and '
        'template your kitchen. Removing old worktops, plumbing and electrics are extra. ' + FIN)),

 'decor': dict(
  noun='feature wall', ev='featurewall_cost_guide', title='What could your feature wall cost?',
  lead=('Tell us about your wall in a sentence: where it is, how wide, and the look you like. We&rsquo;ll show you a guide price worked out from '
        'our real quotes for panelling we&rsquo;ve supplied and fitted.'),
  ph='e.g. oak slatted panels behind the bed, about 3 m wide, with LED lighting',
  ex=[('Slats behind the bed', 'Oak slatted panels behind the bed, about 3 m wide'),
      ('Living room wall', 'A full living room wall of black slats with floating shelves'),
      ('Painted panelling', 'Painted panelling on a 4 m wall')],
  groups=[
   dict(n='sz', legend='How wide?', ev='size', checked=1,
        opts=[('Feature strip', 'Up to about 1.2&nbsp;m'), ('Behind a bed or TV', 'About 2&ndash;3&nbsp;m'),
              ('Full wall', 'About 4&nbsp;m'), ('Large wall', '5&nbsp;m or more')],
        svg=[panels(2), panels(5), panels(8), panels(11)], metres=[1.4, 3.2, 4.6],
        words=[('strip|small|narrow|feature strip', 0), ('behind the bed|behind the tv|headboard|medium', 1), ('full wall|whole wall|living room|lounge', 2),
               ('large|big|huge|two walls|massive', 3)],
        lbl=['Feature strip', 'Behind a bed / TV', 'Full wall', 'Large wall'], say=['feature-strip', 'medium', 'full-wall', 'large-wall'], q='Width? pick below'),
   dict(n='st', legend='Which look?', ev='look',
        opts=[('Slatted timber', 'Oak, walnut or black slats'), ('Fluted panels', 'Rounded, textured fronts'), ('Painted panelling', 'Framed panels in any colour')],
        mult=[1, 1.15, 1.25],
        words=[('slat|slats|slatted|acoustic|oak|walnut|black', 0), ('fluted|ribbed|reeded', 1), ('painted|panelling|paneling|panelled|shaker|frame', 2)],
        lbl=['Slatted', 'Fluted', 'Painted'], say=['slatted', 'fluted', 'painted'], q='Look? pick below'),
  ],
  base=[[250, 450], [450, 800], [750, 1250], [1100, 1800]],
  inst=[[100, 200], [150, 300], [250, 450], [350, 600]],
  ext={'led': X_LED, 'shelves': E('floating shelves', 'Floating shelves', [100, 300], 'shel(f|ves)|floating'),
       'units': E('storage units below', 'Storage below', [400, 900], 'storage|cupboards?|units?|cabinets?|tv unit')},
  lbl=dict(base='Panels', ext='Extras', inst='Delivery &amp; fitting'), notes=[],
  say=r"function(s,w){return 'A '+w('sz')+' '+w('st')+' feature wall'}",
  tip=r"""function(s,gbp,rnd){
 if(!s.has('led'))return 'An LED glow behind or between the panels brings a feature wall to life in the evening.';
 if(s.v.st===0)return 'Acoustic slat panels also soften echo, which helps in rooms with hard floors.';
 return 'We bring samples so you can see the finish against your own walls and light.';
}""", fine=FINE_FURN.format(what='panelling', x='').replace('based on recent quotes for panelling', 'worked out from our recent quotes for panelling')),
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
