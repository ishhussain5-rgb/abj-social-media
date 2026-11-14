#!/usr/bin/env python3
"""ABJ product catalogues: kitchens, bedrooms & wardrobes, media walls.
Copy and prices come from the live website pages (kitchens, worktops, bedrooms, wardrobes, media walls and the two
cost guides). Wardrobe and bedroom prices are UK market averages, as in build.PRICES."""
from build import *
import build as B

FACTS = [('Free', '3D design visit'), ('12-month+', 'Guarantee'), ('4.9', 'On Google · 100+ reviews'), ('Made in', 'Peterborough')]
ROW = [('Made in', 'Peterborough'), ('4.9', 'On Google · 100+ reviews'), ('12-month+', 'Guarantee'), ('Free', '3D design visit')]

def kitchens():
    del B.USED[:]; L = 'Kitchens'; P = []
    P.append(p_cover('kc-book-l', '50% 50%', 'The kitchen collection', 'Bespoke kitchens · made in Peterborough',
        'Kitchens made for the way <em>you</em> live', 'Designed in 3D, made to the millimetre in our Peterborough workshop and fitted by our own team.', ROW))
    P.append(p_split('kc-shaker-l', '50% 50%', '<div class="k">The ABJ approach</div><h2>One team, from first sketch to final fitting</h2>'
        '<p class="lead" style="margin-top:7mm">We measure your room, design it with you in 3D, build every cabinet in our own workshop and install it ourselves, so the kitchen you approve is exactly the kitchen you get.</p>'
        '<p style="margin-top:5mm">Because every cabinet is made to order, we can work to non-standard sizes, awkward corners, sloping ceilings and older properties where off-the-shelf units would leave gaps.</p>'
        + tiles(FACTS), 2, L))
    P.append(page('<div class="pad">%s%s%s</div>' % (
        head('Styles', 'Find your <em>style</em>', 'Every door, colour, handle and worktop is chosen with you. These are the looks our clients ask for most.'),
        cards([('kc-kr-light-l', '50% 70%', 'Handleless', 'Clean lines and integrated rails, made for open-plan living.'),
               ('abj-kitchens-tile-shaker', '50% 55%', 'Shaker', 'Timeless framed doors, painted in any colour from navy to sage.'),
               ('kc-inframe-l', '50% 40%', 'Traditional & in-frame', 'Furniture-quality detailing for period and country homes.')], 64),
        cards([('abj-home-montage-v-poster', '50% 50%', 'Islands', 'Hob islands, waterfall ends and seating for the whole family.'),
               ('abj-hmo-B-v-poster', '50% 45%', 'Light & minimal', 'Pale finishes and long runs that open up the whole room.'),
               ('kc-detail-l', '50% 50%', 'The details', 'Soft-close runners, cup handles and hardware you choose by hand.')], 64, 3, 'margin-top:8mm')), '', 3, L))
    P.append(page('<div class="pad">%s%s%s</div>' % (
        head('Worktops', 'Worktops made to be <em>lived</em> on', 'We help you choose a material for the way you cook and clean, then template it on site so every joint, cut-out and edge sits exactly where it should.'),
        cards([('abj-worktops-tile-quartz', '50% 70%', 'Quartz & granite', 'Quartz for consistent colour and easy cleaning; granite for natural stone with its own pattern in every slab.'),
               ('abj-worktops-t-wood', '50% 60%', 'Solid wood', 'Warm oak and walnut that softens with age and can be refinished.')], 78, 2),
        cards([('abj-worktops-t-laminate', '50% 40%', 'Compact laminate', 'Thin, tough and affordable, with integrated sink options.'),
               ('abj-wt-island-dining', '50% 70%', 'Waterfall islands', 'The worktop carried down the side of the island to the floor.'),
               ('abj-worktops-t-quartz', '50% 50%', 'Sinks & splashbacks', 'Undermount sinks, drainer grooves, upstands and full-height splashbacks.')], 52, 3, 'margin-top:8mm')), 'dk', 4, L))
    P.append(p_split('kc-kr-island-l', '50% 50%', '''<div class="k">Featured project</div><h2>An open-plan kitchen, bar &amp; dining space</h2>
<p style="margin-top:6mm">A handleless light grey kitchen with a hob island, a dark bar wall with lit shelving and a dining table for ten, all designed around one long, bright room at King’s Road, Peterborough.</p>%s
<div class="g2" style="margin-top:8mm">%s%s</div>''' % (ul([
        ('Induction hob island', 'With a pop-up downdraft extractor and an illuminated breakfast bar'),
        ('Bar wall with lit shelving', 'Dark woodgrain units, made and fitted by our own team'),
        ('Storage that disappears', 'Organised cutlery drawers and tall larder housings')]),
        fig('kc-kr-bar-l', 44, 46, 'The bar wall'), fig('kc-kr-detail-l', 44, 46, 'Lit breakfast bar')), 5, L, right=True))
    P.append(p_hero('kc-handleless-l', 130, '50% 60%', head('Planned around you', 'Storage and seating,<br>built <em>in</em>', 'Larder units, pull-out storage and integrated appliances are drawn into the 3D design, so everything has a place before we make a single cabinet.') + cards([
        ('abj-storage-t-pantry', '50% 40%', 'Larders & pantries', 'Shelves, racks and drawers behind a pair of doors.'),
        ('kc-booth-l', '50% 50%', 'Built-in seating', 'A dining booth made to fit the corner of the room.'),
        ('kc-run-l', '50% 60%', 'Appliance walls', 'Ovens and tall housings lined up in a single run.')], 62), 6, L))
    P.append(p_process([('Design visit', 'We measure your room and talk through how you cook, store and live. Free and without obligation.'),
        ('3D design & quote', 'You see your kitchen in photorealistic 3D, with a clear, itemised quotation.'),
        ('Made in Peterborough', 'Every cabinet is built to order in our own workshop, to the millimetre.'),
        ('Fitted by our team', 'The team that made it fits it, backed by a minimum 12-month guarantee.')],
        [('Compact kitchens', 'From around £2,500', 'Made in our Peterborough workshop and fitted by our own team.'),
         ('Medium kitchens', '£7,000 to £9,500', 'A typical medium kitchen with quartz worktops.'),
         ('Larger kitchens', 'Priced at your visit', 'Bigger rooms, premium worktops and appliances add to the price.'),
         ('Kitchen islands', 'Priced with your design', 'Depends on its size, the cabinets inside it, the worktop and any seating or sink.'),
         ('Worktops', 'Priced at your visit', 'Quartz, granite, solid wood and laminate, for a new kitchen or your existing cabinets.'),
         ('Supply only', 'Priced line by line', 'The same made-to-measure kitchen for your own fitter, without the installation.')], 7, L,
        intro='Our surveyor gives you a rough idea of cost at the free visit, and the designer’s itemised quote that follows shows the actual price, including fitting.',
        note='Prices include cabinets made to measure in our workshop, doors, handles, plinths and end panels, the worktops listed on your quote, and delivery and fitting by our own team. Appliances, plumbing and electrics, building work, plastering and flooring are extra unless they are on your quote.', band=112))
    P.append(p_reviews([REVIEWS['kitchen']], 'Kitchen questions', [
        ('How much does a bespoke kitchen cost?', 'A compact bespoke kitchen, made and fitted, starts from around £2,500, and a typical medium kitchen with quartz worktops comes to around £7,000 to £9,500. Larger kitchens, islands, premium worktops and appliances cost more, and your itemised quote gives the exact price.'),
        ('Do you manufacture your own kitchens?', 'Yes. Every cabinet is made to order in our Peterborough workshop. This allows us to create non-standard sizes, work around awkward spaces and maintain direct control over quality.'),
        ('Which worktops can you supply?', 'We can supply and install quartz, granite, solid wood, compact laminate and high-pressure laminate worktops, together with matching upstands, splashbacks and full-height stone options where suitable.'),
        ('How much does a kitchen island add?', 'It depends on the size of the island, the cabinets inside it, the worktop and whether it has seating or a sink. We price it as part of your design, so you can see the difference it makes before you decide.')], 8, L))
    P.append(p_back('kc-kr-dining-l', '50% 55%', 'Start with a conversation<br>at <em>home</em>',
        'Tell us about your room and we will arrange a visit to measure, listen and talk through ideas. You will receive a 3D design and an itemised quote, with no pressure to go ahead.', '/bespoke-kitchens'))
    return document('ABJ Kitchens & Bedrooms: the kitchen collection', P)

def bedrooms():
    del B.USED[:]; L = 'Bedrooms'; P = []
    P.append(p_cover('abj-bedrooms-A-v-poster', '50% 50%', 'The bedroom collection', 'Fitted bedrooms & wardrobes · made in Peterborough',
        'Bedrooms designed as one <em>calm</em> space', 'Wardrobes, headboard walls, bedside units and dressing tables, designed together and made to the millimetre in Peterborough.', ROW))
    P.append(p_hero('abj-b-fluted-sage', 124, '50% 55%', '<div class="k">The ABJ approach</div><h2>A bedroom works best when it is designed as a <em>whole</em></h2>'
        '<div class="two" style="margin-top:7mm"><p class="lead">We draw the wardrobes, headboard wall, bedside units, lighting and dressing table together, so storage disappears and the room feels finished.</p>'
        '<p>A fitted bedroom can include wardrobes, headboard walls, bedside units, dressing tables, desks and integrated lighting, all made to measure. Because we manufacture everything in our own Peterborough workshop, we can work around loft slopes, chimney breasts, box sections and uneven walls.</p></div>'
        + tiles(FACTS, 4), 2, L))
    P.append(page('<div class="pad">%s%s%s</div>' % (
        head('Bedroom styles', 'Find your bedroom <em>style</em>', 'From fluted panelling to classic Shaker, every finish and handle is chosen with you.'),
        cards([('abj-b-fluted-cashmere', '50% 40%', 'Fluted & panelled', 'Full-height fluted doors with a lit display niche over the bed.'),
               ('abj-b-slatted-dark', '60% 50%', 'Dark & dramatic', 'Deep woodgrain and graphite finishes with warm lighting.'),
               ('abj-b-classic-grey', '30% 50%', 'Classic Shaker', 'Framed doors and matching bedside chests for period homes.')], 64),
        cards([('abj-b-sage-loft', '50% 40%', 'Loft & eaves', 'Wardrobes and drawers that follow the roofline in loft rooms.'),
               ('abj-b-storage-bed', '50% 60%', 'Children & teens', 'Storage beds, desks and shelving that grow with them.'),
               ('abj-b-study-nook', '50% 50%', 'Desks & study nooks', 'A quiet place to work, built into the bedroom joinery.')], 64, 3, 'margin-top:8mm')), '', 3, L))
    P.append(p_split('abj-b-slatted-shelves', '50% 50%', '''<div class="k">Designed as a whole</div><h2>Storage that disappears into the room</h2>
<p style="margin-top:6mm">Headboard walls with built-in niches, bedside units that line up with the wardrobes, and lighting planned into the joinery. Everything is designed in 3D first, so you can see the finished room before we make it.</p>%s
<div class="g2" style="margin-top:8mm">%s%s</div>''' % (ul([
        ('Wardrobes, headboard wall and bedside units in one design', None),
        ('LED niches and reading lights built into the joinery', None),
        ('Made to fit sloping ceilings, alcoves and uneven walls', None)]),
        fig('abj-b-white-oak', 44, 46, 'Headboard wall', '35% 50%'), fig('abj-bedrooms-t-fitted', 44, 46, 'Television wall')), 4, L, right=True, dark=True))
    P.append(p_split('abj-w-sliding-white', '50% 50%', '''<div class="k">Fitted wardrobes</div><h2>Wardrobes built to make <em>every</em> inch count</h2>
<p style="margin-top:6mm">Hinged or sliding, painted or woodgrain, built wall to wall and floor to ceiling, even under a sloping roof.</p><span class="tag" style="align-self:flex-start">Wardrobes from around £1,500</span>%s
<div class="g2" style="margin-top:8mm">%s%s</div>''' % (ul([
        ('Fitted & hinged', 'Wall-to-wall doors that follow alcoves, chimney breasts and eaves'),
        ('Sliding', 'Space-saving doors in mirror, glass, woodgrain or painted panels'),
        ('Walk-in dressing rooms', 'Open hanging, island drawers and display shelving around the room'),
        ('Mirrors & light', 'Full-height mirrors and lighting that make a bedroom feel bigger')]),
        fig('abj-wardrobes-t-fitted', 44, 40, 'Under a sloping ceiling'), fig('abj-w-sliding-walnut', 44, 40, 'Woodgrain sliding doors')), 5, L))
    P.append(p_hero('abj-w-walkin-oak', 118, '50% 50%', head('Inside the doors', 'Planned around what you <em>actually</em> own', 'Before anything is made, we measure your clothes as well as the room. Long and short hanging, deep drawers for knitwear, shoe storage and accessory trays are drawn into the 3D design.') + cards([
        ('abj-wardrobes-t-interiors', '50% 50%', 'Drawers & trays', 'Soft-close runners and drawers set to your measurements.'),
        ('abj-w-walkin-shelves', '50% 55%', 'Shelving', 'Shoes, bags and folded clothes, each with a shelf of its own.'),
        ('abj-wardrobes-t-doors', '50% 50%', 'Handles & finishes', 'Slab, Shaker, mirrored, glass and woodgrain doors.')], 52), 6, L, dark=True))
    P.append(page('<div class="pad">%s%s%s</div>' % (
        head('Awkward spaces', 'Slopes, alcoves and box rooms, <em>used</em>', 'Made-to-measure furniture is at its best where standard units leave gaps: each piece is designed around the actual room.'),
        cards([('abj-bedrooms-t-slopes', '50% 45%', 'Loft rooms & eaves', 'We measure the pitch with a laser at the design visit and build angled carcasses and doors that follow your roofline.'),
               ('abj-wardrobes-t-mirror', '50% 50%', 'Dressing tables', 'A lit mirror, drawers and a seat built in under the slope.')], 84, 2),
        cards([('abj-wardrobes-tile-walkin', '50% 55%', 'Dressing rooms', 'Hanging, drawers and a desk around three walls.'),
               ('abj-wardrobes-tile-fitted', '50% 45%', 'Wall to wall', 'Full-height doors from one wall to the other.'),
               ('abj-bedrooms-t-teen', '50% 45%', 'Small bedrooms', 'A fitted wardrobe sized to the space beside the bed.')], 52, 3, 'margin-top:8mm')), '', 7, L))
    P.append(p_process([('Design visit', 'We measure the whole room, including slopes, chimney breasts and box sections, and talk through how you use it.'),
        ('3D design & quote', 'You see wardrobes, bedside units and any dressing table together in 3D, with a quote that lists each piece.'),
        ('Made in Peterborough', 'Every piece is made to your room’s measurements in our workshop, so the finishes match across the room.'),
        ('Fitted by our team', 'Our fitters install the whole room and finish it to the walls and ceiling, backed by our minimum 12-month guarantee.')],
        [('Fitted wardrobes', 'From around £1,500', 'Typical three-door fitted wardrobe: around £2,900.'),
         ('Fitted bedrooms', 'From around £3,000', 'Wardrobes and bedside units for a small room.'),
         ('Walk-in wardrobes', 'Priced at your visit', 'Depends on the room and the interior you choose.'),
         ('Alcove units', '£1,900 to £2,800', 'Cupboards and shelves either side of a chimney breast.'),
         ('Under-stairs storage', 'From around £1,000', 'Drawers and cupboards made to the staircase.'),
         ('Desks & study nooks', 'Priced at your visit', 'Fitted desks and shelving, quoted after a free design visit.')], 8, L,
        note='Guide prices are for made-to-measure furniture, fitted; larger rooms, premium finishes, mirrors and lighting add to them. A fitted bedroom usually takes four to six weeks to make after you sign off the design.', band=128))
    P.append(p_reviews([REVIEWS['wardrobes']], 'Bedroom & wardrobe questions', [
        ('What is included in a bespoke fitted bedroom?', 'A fitted bedroom can include made-to-measure wardrobes, bedside units, dressing tables, drawer packs, desks, shelves, headboards, beds, mirrors and integrated lighting. The exact combination is designed around your room and priorities.'),
        ('Can I customise the internal layout?', 'Absolutely. You can choose hanging rails, adjustable shelves, soft-close drawers, shoe storage, accessory trays, mirrors, lighting and other internal features to match how you use the bedroom.'),
        ('Which wardrobe door types are available?', 'We offer hinged and sliding doors, including slab, Shaker, mirrored, glass and woodgrain options. Your designer will recommend a system based on the room, available clearance and preferred look.'),
        ('Can you fit wardrobes under a sloping ceiling or in a loft conversion?', 'Yes. We measure the pitch with a laser at the free design visit and design angled carcasses and doors that follow your roofline, with hanging, shelves and drawers planned around the height available.')], 9, L))
    P.append(p_back('abj-upholstery-C-v-poster', '50% 62%', 'Let’s design your<br><em>bedroom</em>',
        'Tell us about the room and what needs to fit in it. We’ll visit, measure everything and send a 3D design of the finished bedroom with an itemised quote.', '/bespoke-bedrooms-abj'))
    return document('ABJ Kitchens & Bedrooms: the bedroom collection', P)

def mediawalls():
    del B.USED[:]; L = 'Media walls'; P = []
    P.append(p_cover('abj-mediawalls-t-minimal', '50% 50%', 'The media wall collection', 'Bespoke media walls · made in Peterborough',
        'Media walls that hide everything but the <em>view</em>', 'Bespoke TV walls with fires, lighting, slatted panels and hidden cable runs, made in our Peterborough workshop.', ROW))
    P.append(p_hero('abj-mediawalls-A-wide-poster', 112, '50% 50%', '<div class="k">The ABJ approach</div><h2>A media wall should look calm and work <em>hard</em></h2>'
        '<div class="two" style="margin-top:7mm"><p class="lead">We plan the screen, fire, speakers, consoles and every cable before we design the joinery, so all you see is a beautiful wall.</p>'
        '<p>Every wall is built around your screen, with storage for consoles and speakers, LED lighting and an electric fire where suitable. Because we make the joinery in our own workshop, we can match wall panelling and storage elsewhere in the room.</p></div>'
        + tiles(FACTS, 4), 2, L))
    P.append(page('<div class="pad">%s%s%s</div>' % (
        head('Styles', 'Find your media <em>wall</em>', 'Every wall is drawn around your screen size, your room and what you want to store.'),
        cards([('abj-mediawalls-B-v-poster', '50% 50%', 'Slatted timber', 'Warm woodgrain slats with a soft LED glow behind the screen.'),
               ('abj-mediawalls-t-fire', '50% 55%', 'With a fire', 'An electric fire set into the joinery, with clearances planned in.')], 80, 2),
        cards([('abj-mediawalls-t-display', '50% 50%', 'Floating units', 'Long floating cabinets that keep the floor clear.'),
               ('abj-mediawalls-t-timber', '50% 60%', 'Lighting', 'LED strips and lit niches that set the mood in the evening.'),
               ('abj-st-fluted-living', '50% 50%', 'Storage', 'Fluted doors, drawers and display shelving for everything else.')], 54, 3, 'margin-top:8mm')), '', 3, L))
    P.append(p_split('abj-mediawalls-t-alcove', '45% 50%', '''<div class="k">Planned from the cables up</div><h2>Every wire, console and speaker has a place</h2>
<p style="margin-top:6mm">We plan power, HDMI, network cables, consoles and soundbars before designing the joinery, so nothing trails across the wall. Lighting, fire and storage are built around your screen size and room.</p>%s
<div class="g2" style="margin-top:8mm">%s%s</div>''' % (ul([
        ('Hidden cable routes and ventilated equipment space', None),
        ('Electric fires and LED lighting designed in', None),
        ('Made to fit alcoves, chimney breasts and full walls', None)]),
        fig('abj-decors-t-mediadetail', 44, 46, 'The detail'), fig('abj-decors-t-slatted', 44, 46, 'Slatted panelling')), 4, L, right=True, dark=True))
    P.append(page('<div class="pad">%s%s%s</div>' % (
        head('Sizes & guide prices', 'Four ways to <em>build</em> it', 'Guide prices include making, delivery and fitting. Painted-look or gloss finishes add roughly 10 to 20%.'),
        cards([('abj-st-unit', '50% 45%', 'TV unit & shelves', 'A compact unit with shelving.', 'From around £1,000 to £1,550'),
               ('abj-dc-slat-alcove', '50% 50%', 'Alcove units', 'Cupboards and shelves either side of a chimney breast.', 'Around £1,900 to £2,800')], 80, 2),
        cards([('abj-mediawalls-film-v-poster', '50% 50%', 'Full wall', 'Floor to ceiling on one wall.', 'Around £2,500 to £3,500'),
               ('abj-mediawalls-A-v-poster', '50% 55%', 'Wall to wall', 'A design that fills the whole wall.', 'Around £3,200 to £4,500')], 80, 2, 'margin-top:8mm')), '', 5, L))
    P.append(page('<div class="pad">%s%s<div class="two" style="margin-top:9mm;padding-top:7mm;border-top:.25mm solid rgba(243,238,230,.18)">'
        '<div><h3>What sets the price</h3><p style="margin-top:3mm;font-size:10.6pt">The size of the wall and the finish set most of the price. These extras are the ones people ask about most. Your 3D design shows each one separately, so you can see what it adds before you decide.</p></div>'
        '<div><h3>Electric fires</h3><p style="margin-top:3mm;font-size:10.6pt">The fire itself depends on the make and size you choose. We build it into the joinery and price it with your design, so you can see the full cost before you decide.</p></div></div></div>' % (
        head('Finishing touches', 'Extras, and what they <em>cost</em>', 'Woodgrain and matt finishes cost least; painted-look doors add around 10% and high gloss around 20%.'),
        cards([('abj-dc-dark-slat', '50% 50%', 'LED lighting', 'Lit niches and strips.', 'From around £200'),
               ('abj-dc-lit-display', '50% 45%', 'Glass display doors', 'For the things you want on show.', 'From around £245'),
               ('abj-dc-slat-shelves', '50% 50%', 'Slatted panels', 'Acoustic timber slats.', 'From around £125'),
               ('abj-decors-t-accents', '50% 50%', 'Drawers', 'Fitted where you need them.', 'From around £150')], 118, 4)), 'dk', 6, L))
    P.append(p_process([('Design visit', 'We measure the wall and check your TV size, sockets, aerial point and where the cables need to go.'),
        ('3D design & quote', 'You see the wall in 3D, with any fire, lighting and storage in place, and a quote that lists every part.'),
        ('Made in Peterborough', 'The frame, panels and cabinets are made to your wall in our workshop, with cable routes planned in.'),
        ('Fitted by our team', 'We install the wall and leave it ready for your TV, covered by our minimum 12-month guarantee.')],
        [('TV unit & shelves', '£1,000 to £1,550', 'A compact unit with shelving.'),
         ('Alcove units', '£1,900 to £2,800', 'Cupboards and shelves either side.'),
         ('Full wall', '£2,500 to £3,500', 'Floor to ceiling on one wall.'),
         ('Wall to wall', '£3,200 to £4,500', 'Filling the whole wall.'),
         ('Lights & slats', 'From around £125', 'LED lighting from around £200, slatted panels from around £125.'),
         ('Electric fire', 'Priced with your design', 'The fire depends on the make and size you choose.')], 7, L,
        intro='Send us a photo of the wall and your TV size, or book a visit. We measure up and send you a 3D design with an itemised quote.',
        note='Guide prices include the cabinets and panels made to measure in our workshop, the finish you choose, and delivery and fitting by our own team. Lighting, glass doors, slatted panels, drawers and the electric fire are priced as extras, and each one is shown on your quote. Most media walls take four to six weeks to make once the design is approved.'))
    P.append(p_reviews([REVIEWS['media']], 'Media wall questions', [
        ('Can you include an electric fireplace?', 'Yes, where suitable. We can design the joinery around an electric fireplace and consider clearances, access and ventilation. Appliance instructions must be followed.'),
        ('Can you hide all the TV cables?', 'Yes, cable management is planned into the design. We consider routes for power, HDMI, network cables, consoles, routers and other devices.'),
        ('Do you help with TV mounting?', 'We can design the media wall around your screen size and mounting requirements. If specialist electrical or AV work is required, it must be completed safely by a qualified person.'),
        ('How long does installation usually take?', 'Most installations take a few days, depending on size and specification. Larger media walls with lighting, storage and fireplace details may take longer.')], 8, L))
    P.append(p_back('abj-mediawalls-B-wide-poster', '50% 50%', 'Let’s plan your<br>media <em>wall</em>',
        'Send us a photo of the wall and your TV size on WhatsApp, or book a visit. We’ll measure up and send you a 3D design with an itemised quote.', '/media-walls'))
    return document('ABJ Kitchens & Bedrooms: the media wall collection', P)

CATALOGUES = {'abj-kitchens-catalogue': kitchens, 'abj-bedrooms-catalogue': bedrooms, 'abj-media-walls-catalogue': mediawalls}

if __name__ == '__main__':
    import sys
    for name, fn in CATALOGUES.items():
        print(name, render(fn(), os.path.join(sys.argv[1], name + '.pdf')))
