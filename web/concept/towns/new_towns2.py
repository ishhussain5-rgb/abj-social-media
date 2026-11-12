#!/usr/bin/env python3
"""Two more town pages (12 Nov 2026): Fenland (March, Whittlesey, Chatteris) and King's Lynn.
Same template and build as new_towns.py. Then: python3 build.py fenland kings-lynn"""
from new_towns import build, COST, R

T = {}
T["fenland"] = dict(
 town="Fenland", dev_url="/fitted-kitchens-bedrooms-fenland-dev-f8m3", miles="6 miles",
 disttxt="from our Peterborough workshop to Whittlesey, about 15 miles to March and 25 to Chatteris",
 h1="Fitted kitchens, wardrobes &amp; bedrooms in March, Whittlesey &amp; Chatteris",
 lead="Bespoke kitchens, wardrobes, bedrooms and media walls for homes in March, Whittlesey, Chatteris and the Fenland villages, made in our Peterborough workshop and fitted by our own team.",
 intro1="Whittlesey is just down the A605 from our workshop, and March and Chatteris are a short drive further across the Fens. Wherever you are, we make your furniture to measure.",
 intro2="Each kitchen, wardrobe and bedroom is designed around your room, so older cottages with uneven walls and newer homes with square rooms both get furniture that fits properly. We measure at your home and build everything in Peterborough.",
 local=["Many homes in the old centres of March, Whittlesey and Chatteris are Victorian terraces and cottages, with narrow kitchens, chimney breasts and alcoves. We build larger pieces in sections so they get up older stairs, and scribe panels to the walls so there are no gaps.",
        "On the newer estates on the edges of each town, the starting point is usually a basic builder" + R + "s kitchen and bedrooms with no built-in storage. A new kitchen planned around the existing plumbing, fitted wardrobes or a media wall make the biggest difference there."],
 sty="A galley kitchen in a March terrace, wardrobes for a new home in Whittlesey, a media wall in Chatteris. We measure and draw each one for its own room.",
 proc_lead="Making takes four to six weeks once you approve the design. Whittlesey is about 15 minutes from the workshop and March around half an hour, so visits and fitting days are easy to arrange.",
 steps=[["Design visit", "We visit your home in March, Whittlesey or Chatteris, measure up and talk through how you use the room. Free, with no obligation."],
        ["3D design &amp; quote", "You see the room in 3D before anything is made, with a quote that lists every cabinet, door and fitting."],
        ["Made in Peterborough", "Every piece is built to your measurements in our Brassey Close workshop."],
        ["Fitted by our team", "Our own fitters install it, backed by our 12-month guarantee."]],
 bk="Send a few photos on WhatsApp or book a visit. We" + R + "ll come to your home, measure up and send you a 3D design with an itemised quote, free and with no obligation.",
 det="Our showroom and workshop are in Peterborough, about 6 miles from Whittlesey, 15 miles from March and 25 miles from Chatteris. We also design and fit in Coates, Eastrea, Turves, Wimblington, Doddington and Manea. We cover homes up to 80 miles from Peterborough, so if you" + R + "re further out, <a href=\"tel:01733686767\">call 01733 686767</a> and we" + R + "ll tell you straight away.",
 faqs=[["Do you cover March, Whittlesey and Chatteris?", "Yes. Whittlesey is about 6 miles from our workshop, March about 15 and Chatteris about 25, and we cover the villages around them, including Coates, Eastrea, Wimblington, Doddington and Manea."],
       ["Can you fit furniture in an older terrace with uneven walls?", "Yes. We measure carefully, build larger runs in sections so they fit up narrow stairs, and scribe panels to the walls on site so there are no gaps."],
       ["Can you replace the kitchen in a newer home?", "Yes. We plan the new kitchen around the existing plumbing and sockets where we can, which keeps the cost down, and we can measure for wardrobes or a media wall at the same visit."],
       ["How much does a fitted kitchen cost?", COST],
       ["Can I visit your showroom?", "Yes. Our showroom is at 3 Brassey Close, Peterborough PE1 2AZ, about 15 minutes from Whittlesey. We" + R + "re open Monday to Friday 8am to 6pm and Saturday 10am to 2pm. Call 01733 686767 before you travel."]])

T["kings-lynn"] = dict(
 town="King" + R + "s Lynn", dev_url="/fitted-kitchens-bedrooms-kings-lynn-dev-k2l7", miles="36 miles",
 disttxt="from our Peterborough workshop, about 50 minutes along the A47",
 h1="Fitted kitchens, wardrobes &amp; bedrooms in King" + R + "s Lynn",
 lead="Bespoke kitchens, wardrobes, bedrooms and media walls for King" + R + "s Lynn homes, designed at your house, made in our Peterborough workshop and fitted by our own team.",
 intro1="King" + R + "s Lynn has everything from Georgian townhouses near the Tuesday Market Place to newer homes in Gaywood and the Woottons. Whatever the house, we make the furniture to fit the room.",
 intro2="We design each kitchen, wardrobe and bedroom around the room and how you use it, then build it in our Peterborough workshop. King" + R + "s Lynn is about 36 miles away, straight along the A47.",
 local=["Older houses in the centre of King" + R + "s Lynn often have high ceilings, deep alcoves and walls that are not quite straight. We measure every alcove and wall, build tall pieces to the full ceiling height and scribe them to the walls on site.",
        "In Gaywood, South Wootton and North Wootton, many homes have a kitchen that is ready for an update and bedrooms that would benefit from fitted storage. We plan around the existing plumbing and sockets where we can, which keeps the cost down."],
 sty="A kitchen for a Gaywood semi, wardrobes for a Georgian townhouse, a media wall in South Wootton. We draw each one for the room it" + R + "s going in.",
 proc_lead="Making takes four to six weeks once you approve the design. King" + R + "s Lynn is about 50 minutes from the workshop along the A47, well within the 80 miles we cover.",
 steps=[["Design visit", "We visit your King" + R + "s Lynn home, measure up and talk through how you use the room. Free, with no obligation."],
        ["3D design &amp; quote", "You see the room in 3D, with a quote that lists every cabinet, door and fitting."],
        ["Made in Peterborough", "Every piece is built to your measurements in our Brassey Close workshop."],
        ["Fitted by our team", "Our own fitters install it in King" + R + "s Lynn, backed by our 12-month guarantee."]],
 bk="Send a few photos on WhatsApp or book a visit. We" + R + "ll come to your King" + R + "s Lynn home, measure up and send you a 3D design with an itemised quote, free and with no obligation.",
 det="Our showroom and workshop are in Peterborough, about 36 miles from King" + R + "s Lynn. As well as the town itself, we design and fit in Gaywood, South Wootton, North Wootton, West Lynn, Terrington St Clement and the villages nearby. We cover homes up to 80 miles from Peterborough, so if you" + R + "re further out, <a href=\"tel:01733686767\">call 01733 686767</a> and we" + R + "ll tell you straight away.",
 faqs=[["Do you cover King" + R + "s Lynn and the villages around it?", "Yes. King" + R + "s Lynn is about 36 miles from our workshop, around 50 minutes along the A47, and we cover Gaywood, South Wootton, North Wootton, West Lynn and Terrington St Clement."],
       ["Can you fit furniture in an older house with high ceilings?", "Yes. We build tall wardrobes and alcove units to the full ceiling height, in sections if the stairs are narrow, and scribe them to the walls so there are no gaps."],
       ["How long does a kitchen take from design to fitting?", "Once you approve the design, the kitchen takes four to six weeks to make, and fitting usually takes one to two weeks."],
       ["How much does a fitted kitchen cost?", COST],
       ["Can I see your work before I decide?", "Yes. Our showroom is at 3 Brassey Close, Peterborough PE1 2AZ, about 50 minutes from King" + R + "s Lynn. We" + R + "re open Monday to Friday 8am to 6pm and Saturday 10am to 2pm. Call 01733 686767 before you travel."]])

if __name__ == "__main__":
    for s, d in T.items():
        print(build(s, d))
