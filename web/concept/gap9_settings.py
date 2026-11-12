"""Page settings for the 9 gap pages (12 Nov 2026): DEV settings now, live settings at go-live.
python3 gap9_settings.py  ->  gap9_settings.json"""
import json, pathlib

SITE = "https://abjkitchensandbedrooms.co.uk"
P = [
    # slug, Tilda page id, DEV alias, live alias, DEV label, canonical while on DEV, meta title, meta description, social title
    ("kitchen-design", "381329803", "kitchen-design-peterborough-dev-d4k8", "kitchen-design-peterborough", "Kitchen Design Service",
     "/bespoke-kitchens", "Kitchen Design Service Peterborough | Free 3D Design | ABJ",
     "Free home design visit and 3D kitchen design from ABJ in Peterborough. We measure, design and quote, then make and fit your kitchen ourselves.",
     "Kitchen Design Service in Peterborough | ABJ"),
    ("kitchen-cabinets", "381331203", "kitchen-cabinets-peterborough-dev-c5u2", "kitchen-cabinets-peterborough", "Kitchen Cabinets & Units",
     "/bespoke-kitchens", "Kitchen Cabinets & Units Made in Peterborough | ABJ",
     "Made-to-measure kitchen cabinets and units, built rigid in our Peterborough workshop with soft-close hinges and drawers. Free design visit.",
     "Made-to-Measure Kitchen Cabinets & Units | ABJ"),
    ("supply-only", "381331303", "supply-only-kitchens-dev-s7q3", "supply-only-kitchens-peterborough", "Supply-Only Kitchens",
     "/bespoke-kitchens", "Supply-Only Kitchens Peterborough | Made to Measure | ABJ",
     "Bespoke kitchens made in our Peterborough workshop and supplied for you or your fitter to install. Rigid, assembled cabinets, made to your measurements.",
     "Supply-Only Bespoke Kitchens | ABJ Peterborough"),
    ("utility-boot", "381331403", "utility-boot-rooms-dev-u3b9", "utility-boot-rooms-peterborough", "Utility & Boot Rooms",
     "/bespoke-storage-solutions", "Utility Rooms & Boot Rooms Peterborough | Bespoke | ABJ",
     "Bespoke utility rooms and boot rooms made in Peterborough: laundry storage, boot benches and coat storage built to fit your space. Free design visit.",
     "Bespoke Utility & Boot Rooms | ABJ Peterborough"),
    ("showroom", "381331503", "kitchen-showroom-peterborough-dev-r8m4", "kitchen-showroom-peterborough", "Kitchen Showroom",
     "/", "Kitchen & Bedroom Showroom Peterborough | ABJ, PE1 2AZ",
     "Visit our kitchen and bedroom showroom at 3 Brassey Close, Peterborough PE1 2AZ. See door styles, worktops and fittings next to the workshop.",
     "Visit Our Kitchen Showroom in Peterborough | ABJ"),
    ("bespoke-vs", "381331603", "bespoke-vs-off-the-shelf-kitchens-dev-v6g2", "bespoke-vs-off-the-shelf-kitchens", "Bespoke vs Off-the-Shelf Guide",
     "/bespoke-kitchens", "Bespoke vs Off-the-Shelf Kitchens: An Honest Guide | ABJ",
     "Bespoke or off-the-shelf kitchen? How they differ on fit, materials, price and lead time, from a Peterborough kitchen maker.",
     "Bespoke vs Off-the-Shelf Kitchens | ABJ Guide"),
    ("st-neots", "381331703", "fitted-kitchens-bedrooms-st-neots-dev-n3s7", "fitted-kitchens-bedrooms-st-neots", "Fitted Kitchens & Bedrooms St Neots",
     "/", "Fitted Kitchens & Bedrooms St Neots | ABJ",
     "Bespoke kitchens, fitted wardrobes and bedrooms for homes in St Neots and nearby villages, made in our Peterborough workshop. Free design visit.",
     "Fitted Kitchens & Bedrooms in St Neots | ABJ"),
    ("corby", "381331803", "fitted-kitchens-bedrooms-corby-dev-c9r2", "fitted-kitchens-bedrooms-corby", "Fitted Kitchens & Bedrooms Corby",
     "/", "Fitted Kitchens & Bedrooms Corby | ABJ",
     "Bespoke kitchens, fitted wardrobes and bedrooms for homes in Corby and nearby villages, made in our Peterborough workshop. Free design visit.",
     "Fitted Kitchens & Bedrooms in Corby | ABJ"),
    ("kettering", "381331903", "fitted-kitchens-bedrooms-kettering-dev-k4t6", "fitted-kitchens-bedrooms-kettering", "Fitted Kitchens & Bedrooms Kettering",
     "/", "Fitted Kitchens & Bedrooms Kettering | ABJ",
     "Bespoke kitchens, fitted wardrobes and bedrooms for homes in Kettering and nearby villages, made in our Peterborough workshop. Free design visit.",
     "Fitted Kitchens & Bedrooms in Kettering | ABJ"),
]

out = []
for slug, pid, dev, live, label, canon, mt, md, ft in P:
    assert len(mt) <= 60, (slug, len(mt)); assert len(md) <= 155, (slug, len(md))
    crumb = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
        {"@type": "ListItem", "position": 2, "name": label, "item": SITE + "/" + live}]}
    out.append({"slug": slug, "pageid": pid, "dev": {
        "title": label + " DEV (private test - do not delete)", "alias": dev, "meta_title": mt, "meta_descr": md,
        "descr": md, "fb_title": ft, "fb_descr": md, "link_canonical": SITE + canon},
        "live": {"alias": live, "canonical": SITE + "/" + live,
                 "head": "<!-- ABJ %s: breadcrumb (Service and FAQ schema are in the page block) -->\n<script type=\"application/ld+json\">%s</script>\n"
                         "<meta name=\"twitter:title\" content=\"%s\">\n<meta name=\"twitter:description\" content=\"%s\">\n"
                         % (label, json.dumps(crumb), ft.replace("&", "&amp;"), md)}})
pathlib.Path(__file__).with_name("gap9_settings.json").write_text(json.dumps(out, indent=1, ensure_ascii=False))
print(len(out), "pages")
