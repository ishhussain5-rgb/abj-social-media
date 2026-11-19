"""Room-matched Google reviews for the service pages (19 Nov 2026).

Real 5-star Google reviews of ABJ Kitchens and Bedrooms, read from the public Google Maps listing on 19 Nov 2026.
Excerpts keep the reviewer's own words; "..." marks where words were left out. Names: first name + initial.
Prints one HTML block per room (section + shared CSS) for insertion before the booking band (#kc-book).
"""
import html, json, sys

LINK = "https://share.google/wadbR4QCwRXxM5fcm"

ROOMS = {
    "kitchens": ("What our kitchen customers say", [
        ("They designed the most beautiful kitchen and provided fantastic guidance along the way. ... Exceptional price and quality kitchen, we can’t thank you enough!", "Ellen-Louise L.", "Kitchen"),
        ("The guys at abj were able to create the perfect kitchen for us. ... In terms of service, the quality of units & quartz worktops & kitchen fitting there is no comparison.", "Sumeet O.", "Kitchen"),
        ("We are very pleased with our new kitchen, everything from design, quotation and date of installation was carried out efficiently and promptly.", "Kristina B.", "Kitchen"),
    ]),
    "wardrobes": ("What our wardrobe customers say", [
        ("They designed, manufactured and installed our fitted wardrobes, and we're delighted with the finished product. They listened to what we wanted and then came up with sensible suggestions to correct all the things we'd not considered.", "Daniel", "Fitted wardrobes"),
        ("ABJ recently completed a bedroom wardrobe install. It was complicated due to the rooms slanted ceilings. They did a fabulous job, we are so pleased with it.", "James L.", "Sloping-ceiling wardrobes"),
        ("Ordered 2 built in wardrobes and both were fitted installed and designed within 10 days all in house. ... Very impressed amazing quality.", "Tayyab A.", "Built-in wardrobes"),
    ]),
    "bedrooms": ("What our bedroom customers say", [
        ("The quality of the wardrobes is excellent and a special shout out to the fitter Kestutis who worked so hard. ... We are extremely happy with our new bedroom.", "Anita W.", "Bedroom"),
        ("The team designed and built bedroom furniture exactly the way we envisioned it. The highlight is the extendable bed — it’s beautifully made, super practical, and saves so much room space.", "Nelly A.", "Bedroom furniture"),
        ("ABJ transformed our master bedroom with their sliding wardrobes. ... Professional installation and they cleaned up perfectly afterward!", "Ervins S.", "Master bedroom"),
    ]),
    "mediawalls": ("What our media wall customers say", [
        ("They came to measure the space beforehand and made the unit to fit perfectly, which made a huge difference. The quality is excellent and it fits in seamlessly with my room and décor.", "Lana F.", "TV media unit"),
        ("ABJ Kitchens & Bedrooms recently installed a stunning bespoke TV media wall in our living room, and we couldn’t be happier! The craftsmanship is top-notch, with hidden storage, LED lighting, and a sleek, modern design.", "Arturas A.", "Media wall"),
        ("ABJ Kitchens and Bedrooms Ltd designed and installed bespoke TV media units and two fitted wardrobes for us. The quality is excellent, prices were reasonable, and the whole process was smooth from start to finish.", "Maksim M.", "TV units & wardrobes"),
    ]),
}

CSS = """<style>/* Undo: delete from the ABJ ROOMREVIEWS marker to /ABJ ROOMREVIEWS (section and style) and publish. */
#kc .rvx{padding:clamp(48px,7vh,88px) 0;background:var(--lin2,#ECE5DA)}
#kc .rvx .sh{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap}
#kc .rvx h2{margin:12px 0 0}
#kc .rvx .rvxg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(14px,1.6vw,24px);margin-top:clamp(22px,3vh,36px)}
#kc .rvx .rvc{margin:0;padding:clamp(20px,2.2vw,28px);background:var(--lin,#F3EEE6);border-top:2px solid var(--go,#C9A96E);display:flex;flex-direction:column}
#kc .rvx .st{color:var(--go,#C9A96E);letter-spacing:.18em;font-size:13px}
#kc .rvx blockquote{margin:12px 0 16px;font:italic 400 clamp(17px,1.25vw,19px)/1.5 var(--serif);flex:1}
#kc .rvx figcaption{font:500 11px/1.4 var(--sans);letter-spacing:.16em;text-transform:uppercase;opacity:.8}
#kc .rvx figcaption b{font-weight:600}
@media (max-width:760px){
#kc .rvx{padding:40px 0}
#kc .rvx .rvxg{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;margin-right:-20px;padding-right:20px;gap:12px}
#kc .rvx .rvxg::-webkit-scrollbar{display:none}
#kc .rvx .rvc{flex:0 0 84%;scroll-snap-align:start}
#kc .rvx blockquote{font-size:16.5px}
}
</style>"""


def block(room):
    title, revs = ROOMS[room]
    cards = "".join(
        '<figure class="rvc"><span class="st" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>'
        '<blockquote>&ldquo;%s&rdquo;</blockquote><figcaption><b>%s</b> &middot; Google review &middot; %s</figcaption></figure>'
        % (html.escape(q, quote=False).replace("...", "&hellip;"), html.escape(n), html.escape(k)) for q, n, k in revs)
    return ('<!-- ABJ ROOMREVIEWS (3 real Google reviews matched to this room; 19 Nov 2026) -->\n' + CSS +
            '\n<section class="rvx" aria-label="Customer reviews"><div class="w"><div class="sh rv"><div><span class="kick">Google reviews</span>'
            '<h2>%s</h2></div><a class="lnk" href="%s" target="_blank" rel="noopener">Read all our Google reviews</a></div>'
            '<div class="rvxg">%s</div></div></section>\n<!-- /ABJ ROOMREVIEWS -->\n' % (html.escape(title), LINK, cards))


if __name__ == "__main__":
    print(json.dumps({r: block(r) for r in ROOMS}))
