# Two cost guides (12 Nov 2026, Ish: "build the two pages and use the prices i gave you from Alex").
# Kitchen prices: Alex's guide (compact from around £2,500, typical medium with quartz £7,000-£9,500).
# Media wall prices: the bands in calc/build_calc.py 'mediawall', calibrated from Alex's real media wall quotes
# (cabinets & panels + delivery & fitting): compact £1,000-1,550, alcoves £1,900-2,800, full wall £2,500-3,500,
# wall to wall £3,200-4,500; extras LED £200+, glass doors £245+, slatted panels £125+, drawers £150+; fire priced with the design.
# python3 gen_new3.py && python3 build.py kitchen-cost media-wall-cost
from new_pages_data import U, AREAS
from services_data import REV_OLGA, REV_RICH

def H(name):  # hero / booking photo at 1600px
    return U(name).replace("/-/resize/1200x/", "/-/resize/1600x/")

STEPS = [["Design visit", "We measure the room and talk through what you want. Free, with no obligation."],
         ["3D design &amp; quote", "You see it in 3D with an itemised quote, so you know the exact price."],
         ["Made in Peterborough", "Everything is made to your room in our own workshop."],
         ["Fitted by our team", "Our own fitters install it, covered by our 12-month guarantee."]]

KCOST = ("A compact bespoke kitchen, made and fitted, starts from around £2,500, and a typical medium kitchen with quartz worktops "
         "comes to around £7,000 to £9,500. Larger kitchens, islands, premium worktops and appliances cost more, and your itemised "
         "quote gives the exact price.")
MCOST = ("A compact TV unit with shelves, made and fitted, starts from around £1,000. Units either side of a chimney breast usually "
         "come to around £1,900 to £2,800, a floor-to-ceiling wall around £2,500 to £3,500, and a wall-to-wall media wall around "
         "£3,200 to £4,500. Lighting, glass doors, slatted panels and the electric fire are extra.")
FIN = ("Yes. Interest-free finance for 12 months is available through Ideal4Finance on projects over £6,000 with a 50% deposit, "
       "subject to status.")

PAGES = [
# ---------------------------------------------------------------- kitchen cost guide
{
 "slug": "kitchen-cost", "name": "Kitchen cost guide", "url": "/kitchen-cost-peterborough",
 "footer": "Get your own kitchen price",
 "videos": [], "hero_img": (H("abj-kitchen-cashmere.webp"), "Cashmere bespoke kitchen with an island, made and fitted by ABJ in Peterborough"),
 "hero_cap": "Made-to-measure kitchen with an island",
 "kicker": "Cost guide &middot; Kitchens",
 "h1": "How much does a bespoke kitchen cost in Peterborough?",
 "lead": "Guide prices from our own quotes: what a made-to-measure kitchen costs, what the price includes and what pushes it up or down.",
 "explore": "What changes the price",
 "intro_kick": "The short answer",
 "statement": "A compact bespoke kitchen, made in our Peterborough workshop and fitted by our own team, starts from around &pound;2,500. A typical medium kitchen with quartz worktops comes to around &pound;7,000 to &pound;9,500. Bigger rooms, islands, premium worktops and appliances add to that, and your itemised quote gives the exact figure.",
 "facts": ["Compact from <b>&pound;2,500</b>", "Medium <b>&pound;7,000&ndash;&pound;9,500</b>", "<b>0%</b> finance over &pound;6,000", "<b>Free</b> 3D design &amp; quote"],
 "styles_h": "Six things that change the price", "styles_p": "Two kitchens the same size can cost very different amounts. These are the choices that make the difference.",
 "styles": [(U("abj-kitchen-copper-g.webp"), "Galley kitchen with copper-effect units and built-in ovens", "Size &amp; layout", "How many cabinets the room needs, and whether the layout stays the same."),
            (U("abj-kitchen-sage-sha.webp"), "Sage green Shaker kitchen with an island", "Doors &amp; finish", "Slab, Shaker or in-frame, painted, gloss or woodgrain."),
            (U("c9b6a43-abj-wt-quartz-sink.webp"), "Quartz worktop with an undermount sink under a window", "Worktops", "Laminate costs least; quartz and natural stone cost more."),
            (U("abj-kitchen-marble-i.jpg"), "Kitchen with a marble-effect waterfall island and green velvet bar stools", "Islands &amp; breakfast bars", "An island adds cabinets, a worktop and often seating."),
            (U("IntelligentStorageSo.webp"), "Bespoke kitchen with pull-out drawers and internal storage", "Storage inside", "Larders, deep drawers and corner pull-outs."),
            (U("abj-kitchen-dark-isl.webp"), "Dark kitchen island with a copper tap and industrial pendant lights", "Appliances &amp; extras", "Appliances, sinks, taps and lighting are priced on top.")],
 "cta_card": "Send us a photo for a guide price",
 "feature": {"kick": "What the price includes", "h": "What you are paying for",
             "p": "Our guide prices cover the kitchen itself, made to measure in our own workshop, delivered and fitted by our own team. Appliances, plumbing and electrics, building work, plastering and flooring are not included unless they are listed on your quote. That way you can compare our quote line by line with any other.",
             "points": ["Cabinets made to your room, assembled in our workshop", "Doors, handles, plinths and end panels", "Worktops, as listed on your quote", "Delivery and fitting by our own team", "Covered by our 12-month guarantee"],
             "big": (U("kc-kr-island-s.webp"), "Kitchen island with seating, made and fitted by ABJ in Peterborough", "50% 50%"),
             "small": [(U("kc-detail-s.webp"), "Kitchen cabinet and drawer detail made in the ABJ workshop", "Made in our workshop"),
                       (U("abj-kitchen-cream-is.webp"), "Cream kitchen island with a quartz worktop and brushed brass tap", "Quartz worktop and island")],
             "link": ("/bespoke-kitchens#kc-cost", "Try our kitchen cost guide")},
 "quote": REV_OLGA,
 "book": (H("kc-book-s.webp"), "White quartz island with black pendant lights at dusk", "50% 50%"),
 "book_h": "Get the exact price for your kitchen",
 "book_p": "Book a free design visit or send a few photos on WhatsApp. Our surveyor measures the room and gives you a rough idea of cost, then our designers send a 3D design with an itemised quote, including fitting.",
 "proc_p": "Once you approve the design, your kitchen takes four to six weeks to make and usually one to two weeks to fit.",
 "steps": STEPS,
 "seo_h": "Kitchen prices in Peterborough: how to compare quotes",
 "seo": ["The fairest way to compare kitchen prices is to compare like for like. Ask each company for an itemised quote for the same room, then check the board thickness, whether the cabinets arrive assembled or flat-packed, the make of hinges and drawer runners, the worktop, and whether delivery and fitting are included. A low headline price can grow once fillers, end panels and fitting are added.",
         "We can only give an exact price after a visit, because every kitchen is made to the room. Our surveyor measures up and gives you a rough idea of cost on the day, and the designer's quote that follows shows the actual price, including fitting. Interest-free finance is available on projects over &pound;6,000 with a 50% deposit, subject to status. See also <a href=\"/bespoke-vs-off-the-shelf-kitchens\">bespoke vs off-the-shelf kitchens</a> and <a href=\"/kitchen-design-peterborough\">how our design visit works</a>."],
 "related": [("/bespoke-kitchens", "Bespoke kitchens"), ("/kitchen-design-peterborough", "Kitchen design"), ("/bespoke-vs-off-the-shelf-kitchens", "Bespoke vs off-the-shelf"), ("/flexible-finance", "Finance"), ("/kitchen-showroom-peterborough", "Our showroom")],
 "service_name": "Bespoke kitchens", "service_type": "Guide: bespoke kitchen prices in Peterborough",
 "faqs": [("How much does a bespoke kitchen cost in Peterborough?", KCOST),
          ("What is included in your kitchen prices?", "The cabinets made to measure in our workshop, doors, handles, plinths and end panels, the worktops listed on your quote, and delivery and fitting by our own team. Appliances, plumbing and electrics, building work, plastering and flooring are extra unless they are on your quote."),
          ("Why can you not give an exact price before a visit?", "Every kitchen is made to the room, so the price depends on the measurements and the choices you make. Our surveyor gives you a rough idea of cost at the free visit, and our designer's itemised quote gives the actual price, including fitting."),
          ("How much does a kitchen island add?", "It depends on the size of the island, the cabinets inside it, the worktop and whether it has seating or a sink. We price it as part of your design, so you can see the difference it makes before you decide."),
          ("Is finance available on a new kitchen?", FIN),
          ("Is a bespoke kitchen more expensive than Wren, Howdens or Magnet?", "Not always. Prices vary a lot between ranges, so compare itemised quotes for the same room rather than headline prices. Our compact kitchens start from around £2,500 made and fitted."),
          ("How long does a bespoke kitchen take?", "Four to six weeks to make once you approve the design, then usually one to two weeks to fit.")]},

# ---------------------------------------------------------------- media wall cost guide
{
 "slug": "media-wall-cost", "name": "Media wall cost guide", "url": "/media-wall-cost-peterborough",
 "footer": "Get your own media wall price",
 "videos": [], "hero_img": (H("BespokeMediaWalls29.webp"), "Bespoke media wall with a TV, lit shelves and storage, made by ABJ in Peterborough"),
 "hero_cap": "Media wall with lit shelves",
 "kicker": "Cost guide &middot; Media walls",
 "h1": "How much does a media wall cost in Peterborough?",
 "lead": "Guide prices from our own quotes, from a simple TV unit to a wall-to-wall media wall with lighting and an electric fire.",
 "explore": "Media wall prices",
 "intro_kick": "The short answer",
 "statement": "A compact TV unit with shelves, made in our Peterborough workshop and fitted by our team, starts from around &pound;1,000. Units either side of a chimney breast usually come to around &pound;1,900 to &pound;2,800, and a floor-to-ceiling wall around &pound;2,500 to &pound;3,500. A wall-to-wall design is around &pound;3,200 to &pound;4,500.",
 "facts": ["From around <b>&pound;1,000</b>", "Made in <b>Peterborough</b>", "<b>Free</b> 3D design visit", "<b>12-month</b> guarantee"],
 "styles_h": "Media wall prices by size", "styles_p": "Guide prices include making, delivery and fitting. Painted-look or gloss finishes add roughly 10 to 20%.",
 "styles": [(U("74e75bd-abj-mediawalls-t-minimal.webp"), "Low TV unit with floating shelves", "TV unit &amp; shelves", "From around &pound;1,000 to &pound;1,550 for a compact unit with shelving."),
            (U("abj-mediawalls-t-alcove.webp"), "Media wall units built into the alcoves either side of a chimney breast", "Alcove units", "Around &pound;1,900 to &pound;2,800 for cupboards and shelves either side."),
            (U("74e75bd-abj-mediawalls-t-storage.webp"), "Floor-to-ceiling media wall with storage cupboards", "Full wall", "Around &pound;2,500 to &pound;3,500, floor to ceiling on one wall."),
            (U("74e75bd-abj-mediawalls-t-display.webp"), "Wall-to-wall media wall with display shelving", "Wall to wall", "Around &pound;3,200 to &pound;4,500, filling the whole wall."),
            (U("74e75bd-abj-mediawalls-t-fire.webp"), "Media wall with an inset electric fire under the TV", "Electric fire", "Built into the joinery and priced with your design."),
            (U("abj-dc-dark-slat.webp"), "Dark slatted panel wall with integrated lighting", "Lights &amp; slats", "LED lighting from around &pound;200, slatted panels from around &pound;125.")],
 "cta_card": "Send us a photo of your wall",
 "feature": {"kick": "What adds to the price", "h": "Extras, and what they cost",
             "p": "The size of the wall and the finish set most of the price. These extras are the ones people ask about most. Your 3D design shows each one separately, so you can see what it adds before you decide.",
             "points": ["LED lighting: from around &pound;200", "Glass display doors: from around &pound;245", "Slatted acoustic panels: from around &pound;125", "Drawers: from around &pound;150", "Electric fire: priced with your design"],
             "big": (U("BespokeMediaWalls43.webp"), "Media wall with an electric fire, TV recess and lit shelving", "50% 50%"),
             "small": [(U("74e75bd-abj-mediawalls-t-timber.webp"), "Media wall with timber slatted panels", "Timber slats"),
                       (U("BespokeMediaWalls86.webp"), "White media wall with cupboards and open shelving", "Cupboards and shelves")],
             "link": ("/media-walls#kc-cost", "Try our media wall cost guide")},
 "quote": REV_RICH,
 "book": (H("BespokeMediaWalls30.webp"), "Bespoke media wall with a TV and lit display shelves", "50% 50%"),
 "book_h": "Get the exact price for your media wall",
 "book_p": "Book a free design visit or send a photo of your wall on WhatsApp. We measure up, plan the TV, cables and storage with you, and send a 3D design with an itemised quote.",
 "proc_p": "Once you approve the design, your media wall is made in our Peterborough workshop and fitted by our own team. We confirm the timings with your quote.",
 "steps": STEPS,
 "seo_h": "Media wall prices in Peterborough: what to ask",
 "seo": ["When you compare media wall quotes, check what each one includes: the cabinets and panels, the finish, lighting, glass doors, where the cables run, whether the electric fire is supplied and built in, and whether delivery and fitting are included. Ask whether plastering, painting and any electrical work are part of the price or extra.",
         "Every media wall we make is built around your screen and your room, with the cable routes planned at the design visit. See finished walls on our <a href=\"/media-walls\">media walls page</a>, or have a look at <a href=\"/alcove-units\">alcove units</a> and <a href=\"/bespoke-decors-peterborough\">wall panelling</a>. Interest-free finance is available on projects over &pound;6,000 with a 50% deposit, subject to status."],
 "related": [("/media-walls", "Media walls"), ("/alcove-units", "Alcove units"), ("/bespoke-decors-peterborough", "Wall panelling"), ("/gallery", "Our projects"), ("/flexible-finance", "Finance")],
 "service_name": "Media walls", "service_type": "Guide: media wall prices in Peterborough",
 "faqs": [("How much does a media wall cost in Peterborough?", MCOST),
          ("What is included in your media wall prices?", "The cabinets and panels made to measure in our workshop, the finish you choose, and delivery and fitting by our own team. Lighting, glass doors, slatted panels, drawers and the electric fire are priced as extras, and each one is shown on your quote."),
          ("How much does it cost to add an electric fire?", "The fire itself depends on the make and size you choose. We build it into the joinery and price it with your design, so you can see the full cost before you decide."),
          ("Do painted or gloss finishes cost more?", "Yes, a little. Woodgrain and matt finishes cost least; painted-look doors add around 10% and high gloss around 20%."),
          ("Can you hide the TV cables?", "Yes. We plan the cable routes at the design visit so the wires run inside the media wall rather than across it."),
          ("Is finance available on a media wall?", FIN),
          ("Which areas do you cover?", AREAS)]},
]
