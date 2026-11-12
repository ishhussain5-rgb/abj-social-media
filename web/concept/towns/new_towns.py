#!/usr/bin/env python3
"""Three new town pages (12 Nov 2026): St Neots, Corby, Kettering.
Fills pages/area-template.html with each town's own copy (same sections abjTownCopy replaces on the other town pages),
adds Service + FAQPage schema, and writes pages/<slug>.html. Then run: python3 build.py st-neots corby kettering
Landmark photos are added later in the Tilda editor with abjLandmarks (tilda_update.js), like the other towns."""
import json, re, html, pathlib
HERE = pathlib.Path(__file__).resolve().parent.parent
R = "&rsquo;"
COST = ("A compact bespoke kitchen, made and fitted, starts from around &pound;2,500, and a typical medium kitchen with quartz worktops "
        "comes to around &pound;7,000 to &pound;9,500. You get an itemised quote after the free design visit.")

T = {}
T["st-neots"] = dict(
 town="St Neots", dev_url="/fitted-kitchens-bedrooms-st-neots-dev-n3s7", miles="30 miles",
 disttxt="from our Peterborough workshop, about 40 minutes down the A1",
 h1="Fitted kitchens, wardrobes &amp; bedrooms in St Neots",
 lead="Bespoke kitchens, wardrobes, bedrooms and media walls for St Neots homes, designed at your house, made in our Peterborough workshop and fitted by our own team.",
 intro1="From Victorian terraces near the Market Square to the new streets at Loves Farm and Wintringham, every St Neots room we fit gets furniture made for it.",
 intro2="We measure, design and make each kitchen, wardrobe and bedroom around the room, so alcoves, chimney breasts and full-height walls become storage rather than gaps. St Neots is about 30 miles from our Peterborough workshop, straight down the A1.",
 local=["Many St Neots homes fall into two groups. The older terraces and cottages around the town centre and the river have alcoves, uneven walls and narrow staircases, so we build larger pieces in sections and scribe them to the walls on site.",
        "The newer houses at Loves Farm, Wintringham and on the Eaton Socon estates usually come with a developer kitchen and empty bedrooms. Replacing the kitchen around the existing plumbing keeps costs down, and fitted wardrobes and a media wall are often added at the same time."],
 sty="A new kitchen for a Loves Farm house, wardrobes in a Victorian terrace or a media wall in Eaton Socon: each piece is drawn for its room.",
 proc_lead="Making takes four to six weeks once you approve the design. St Neots is about 40 minutes from the workshop on the A1, so visits and fitting days are easy to arrange.",
 steps=[["Design visit", "We visit your St Neots home, measure up and check where the plumbing and sockets are, because working around them can keep costs down. Free, with no obligation."],
        ["3D design &amp; quote", "You see the room in 3D, with a quote that lists every cabinet, door and fitting."],
        ["Made in Peterborough", "Every piece is built to your measurements in our Brassey Close workshop."],
        ["Fitted by our team", "The same team that made it fits it in St Neots, backed by our 12-month guarantee."]],
 bk="Send a few photos on WhatsApp or book a visit. We" + R + "ll come to your St Neots home, measure up and send you a 3D design with an itemised quote, free and with no obligation.",
 det="Our showroom and workshop are in Peterborough, about 30 miles from St Neots. As well as the town itself, we design and fit in Eaton Socon, Eaton Ford, Eynesbury, Little Paxton, Great Paxton and Buckden. We cover homes up to 80 miles from Peterborough, so if you" + R + "re further out, <a href=\"tel:01733686767\">call 01733 686767</a> and we" + R + "ll tell you straight away.",
 faqs=[["Do you cover St Neots, Eaton Socon and Eynesbury?", "Yes. St Neots is about 30 miles from our workshop, around 40 minutes down the A1, and we fit across Eaton Socon, Eaton Ford, Eynesbury, Little Paxton and the villages nearby."],
       ["Can you replace the developer kitchen in a Loves Farm or Wintringham home?", "Yes, it" + R + "s one of our most common jobs. Planning the new kitchen around the existing plumbing and sockets usually keeps the cost down, and we often add fitted wardrobes or a media wall at the same time."],
       ["Can you fit furniture in an older terrace with uneven walls?", "Yes. We measure carefully, build larger runs in sections so they fit up narrow stairs, and scribe panels to the walls on site so there are no gaps."],
       ["How much does a fitted kitchen cost?", COST],
       ["Can I see your work before I decide?", "Yes. Our showroom is at 3 Brassey Close, Peterborough PE1 2AZ, about 40 minutes from St Neots. Call 01733 686767 before you travel, or ask to see photos of similar jobs at your design visit."]])

T["corby"] = dict(
 town="Corby", dev_url="/fitted-kitchens-bedrooms-corby-dev-c9r2", miles="25 miles",
 disttxt="from our Peterborough workshop, about 45 minutes via Oundle",
 h1="Fitted kitchens, wardrobes &amp; bedrooms in Corby",
 lead="Bespoke kitchens, wardrobes, bedrooms and media walls for Corby homes, designed at your house, made in our Peterborough workshop and fitted by our own team.",
 intro1="Corby has grown fast, from the post-war new town estates to Priors Hall Park and Little Stanion, and every room we fit here gets furniture made to measure.",
 intro2="We design each kitchen, wardrobe and bedroom around the room and how you use it, so compact bedrooms get full-height storage and kitchens get every centimetre of worktop. Corby is about 25 miles from our Peterborough workshop.",
 local=["A lot of Corby" + R + "s housing was built when it became a new town in 1950, so many homes have similar layouts: compact kitchens, box rooms and straightforward living rooms that suit a media wall. Made-to-measure furniture gets far more out of these rooms than standard sizes.",
        "On the newer estates at Priors Hall Park, Little Stanion and Weldon, most of our work is replacing developer kitchens, adding fitted wardrobes to empty bedrooms and building media walls in open-plan living rooms."],
 sty="A bigger kitchen from a compact room, wardrobes in a Priors Hall Park bedroom or a media wall in Weldon: each piece is drawn for its room.",
 proc_lead="Making takes four to six weeks once you approve the design. Corby is around 45 minutes from the workshop, well inside the area we cover every week.",
 steps=[["Design visit", "We visit your Corby home, measure up and talk through how you use the room. Free, with no obligation."],
        ["3D design &amp; quote", "You see the room in 3D, with corner solutions and storage options, and a quote that lists every item."],
        ["Made in Peterborough", "Every piece is made to your measurements in our Brassey Close workshop."],
        ["Fitted by our team", "Our own fitters install it in Corby, backed by our 12-month guarantee."]],
 bk="Send a few photos on WhatsApp or book a visit. We" + R + "ll come to your Corby home, measure up and send you a 3D design with an itemised quote, free and with no obligation.",
 det="Our showroom and workshop are in Peterborough, about 25 miles from Corby. As well as Corby itself, we design and fit in Great Oakley, Weldon, Stanion, Little Stanion, Priors Hall Park, Cottingham and Gretton. We cover homes up to 80 miles from Peterborough, so if you" + R + "re further out, <a href=\"tel:01733686767\">call 01733 686767</a> and we" + R + "ll tell you straight away.",
 faqs=[["Do you cover Corby and the villages around it?", "Yes. Corby is about 25 miles from our workshop, around 45 minutes via Oundle, and we fit across Great Oakley, Weldon, Stanion, Little Stanion, Cottingham and Gretton."],
       ["Can you replace the kitchen in a new build at Priors Hall Park?", "Yes. Replacing a developer kitchen is one of our most common jobs. We plan around the existing plumbing and sockets where we can, which keeps the cost down."],
       ["How do you get more storage out of a small bedroom?", "With wardrobes built to the ceiling and wall to wall, sliding doors where there is no room to swing a door, and drawers and shelves planned around what you own. You see each option in 3D first."],
       ["How much does a fitted kitchen cost?", COST],
       ["Can I visit your showroom from Corby?", "Yes. We" + R + "re at 3 Brassey Close, Peterborough PE1 2AZ, about 45 minutes from Corby. Call 01733 686767 before you travel."]])

T["kettering"] = dict(
 town="Kettering", dev_url="/fitted-kitchens-bedrooms-kettering-dev-k4t6", miles="30 miles",
 disttxt="from our Peterborough workshop, about 45 minutes on the A14 and A605",
 h1="Fitted kitchens, wardrobes &amp; bedrooms in Kettering",
 lead="Bespoke kitchens, wardrobes, bedrooms and media walls for Kettering homes, designed at your house, made in our Peterborough workshop and fitted by our own team.",
 intro1="Kettering mixes Victorian terraces, inter-war semis and new streets at Hanwood Park, and each room we fit gets furniture made for it.",
 intro2="We design every kitchen, wardrobe and bedroom around the room, using alcoves, chimney breasts and full-height walls, in handleless, Shaker, in-frame or traditional styles. Kettering is about 30 miles from our Peterborough workshop.",
 local=["Kettering" + R + "s Victorian and Edwardian terraces often have narrow kitchens, chimney alcoves and steep stairs. We plan for that from the start: made-to-measure units for the galley, alcove cupboards in the living room, and larger pieces built in sections so they fit up the stairs.",
        "In Barton Seagrave and the new homes at Hanwood Park, most of our work is replacing developer kitchens, fitting wardrobes in empty bedrooms and building media walls in open-plan living rooms."],
 sty="A galley kitchen in a Victorian terrace, alcove units in a Barton Seagrave living room or wardrobes at Hanwood Park: each piece is drawn for its room.",
 proc_lead="Making takes four to six weeks once you approve the design. Kettering is around 45 minutes from the workshop on the A14 and A605, inside our regular area.",
 steps=[["Design visit", "We visit your Kettering home, measure up and look at the walls, alcoves and access before anything is designed. Free, with no obligation."],
        ["3D design &amp; quote", "You see the room in 3D before anything is made, with a quote that lists every item."],
        ["Made in Peterborough", "Every piece is built to order in our Brassey Close workshop."],
        ["Fitted by our team", "Our own fitters install it in Kettering, backed by our 12-month guarantee."]],
 bk="Send a few photos on WhatsApp or book a visit. We" + R + "ll come to your Kettering home, measure up and send you a 3D design with an itemised quote. It" + R + "s free and there" + R + "s no obligation.",
 det="Our showroom and workshop are in Peterborough, about 30 miles from Kettering. As well as Kettering itself, we design and fit in Barton Seagrave, Burton Latimer, Rothwell, Desborough, Geddington and Broughton. We cover homes up to 80 miles from Peterborough, so if you" + R + "re further out, <a href=\"tel:01733686767\">call 01733 686767</a> and we" + R + "ll tell you straight away.",
 faqs=[["Do you cover Kettering, Barton Seagrave and Burton Latimer?", "Yes. Kettering is about 30 miles from our workshop, around 45 minutes on the A14 and A605, and we fit across Barton Seagrave, Burton Latimer, Rothwell, Desborough and Geddington."],
       ["Can you make a narrow terrace kitchen work better?", "Usually, yes. Made-to-measure units, full-height storage and a better layout make a real difference in a galley kitchen. If moving services would give you a much better kitchen, we" + R + "ll explain the trade-off at the survey."],
       ["Do you fit kitchens and wardrobes in new homes at Hanwood Park?", "Yes. Replacing developer kitchens and fitting wardrobes and media walls in new homes is a big part of our work, and we plan around the existing plumbing and sockets where we can."],
       ["How much does a fitted kitchen cost?", COST],
       ["Can I see your kitchens and wardrobes in person?", "Yes. Our showroom is at 3 Brassey Close, Peterborough PE1 2AZ, about 45 minutes from Kettering. Call 01733 686767 before you travel."]])


def plain(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s))


def build(slug, d):
    c = (HERE / "pages" / "area-template.html").read_text()
    c = c.replace('"slug":"area-template","title":"Area page","nav":"/"', '"slug":"%s","title":"%s","nav":"%s"' % (slug, d["town"], d["dev_url"]))
    local = "".join("<p>%s</p>" % p for p in d["local"])
    faq = "".join("\n  <details><summary>%s</summary><p>%s</p></details>" % (q, a) for q, a in d["faqs"])
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Service", "name": "Fitted kitchens, wardrobes and bedrooms in " + d["town"], "serviceType": "Bespoke fitted kitchens, wardrobes, bedrooms and media walls",
         "areaServed": {"@type": "City", "name": d["town"]}, "provider": {"@id": "https://abjkitchensandbedrooms.co.uk/#business"}},
        {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": plain(q), "acceptedAnswer": {"@type": "Answer", "text": plain(a)}} for q, a in d["faqs"]]}]}
    for k, v in {"H1": d["h1"], "LEAD": d["lead"], "MILES": d["miles"], "DISTTXT": d["disttxt"], "INTRO1": d["intro1"], "INTRO2": d["intro2"],
                 "LOCAL": local, "VILLAGES": d["det"], "FAQ": faq,
                 "LD": '<script type="application/ld+json">%s</script>' % json.dumps(ld, ensure_ascii=False)}.items():
        assert c.count("%%" + k + "%%") == 1, k
        c = c.replace("%%" + k + "%%", v)
    c = c.replace("%%TOWN%%", d["town"])
    # town-specific "What we make" line, steps and booking text (as abjTownCopy does on the other town pages)
    n = 0
    c, k = re.subn(r'(<h2 style="margin-top:16px">What we make</h2></div><div class="rv" style="display:flex;align-items:flex-end;gap:40px"><p>)[\s\S]*?(</p>)', lambda m: m.group(1) + d["sty"] + m.group(2), c); n += k
    steps = "".join('\n  <div class="rv"><i>0%d</i><h3>%s</h3><p>%s</p></div>' % (i + 1, a, b) for i, (a, b) in enumerate(d["steps"]))
    c, k = re.subn(r'(<section class="proc">[\s\S]*?<p>)[\s\S]*?(</p></div>\n <div class="ps">)[\s\S]*?(\n </div>\n</div></section>)', lambda m: m.group(1) + d["proc_lead"] + m.group(2) + steps + m.group(3), c); n += k
    c, k = re.subn(r'(<h2>Book your free design visit in [^<]*</h2>\s*<p>)[\s\S]*?(</p>)', lambda m: m.group(1) + d["bk"] + m.group(2), c); n += k
    c = c.replace("What we make</h2>", "What we make in %s</h2>" % d["town"], 1)
    assert n == 3 and "%%" not in c, (slug, n)
    (HERE / "pages" / (slug + ".html")).write_text(c)
    return slug


if __name__ == "__main__":
    for s, d in T.items():
        print(build(s, d))
