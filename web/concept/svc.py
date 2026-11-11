#!/usr/bin/env python3
"""Service-page generator for the new standard (DEV).

Each entry in services_data.py describes one room page. This script turns it into
pages/<slug>.html in the same layout as the Kitchens page, then build.py wraps it with the
shared header, menu, footer and script. Usage: python3 svc.py && python3 build.py
"""
import html, json, pathlib, importlib.util

HERE = pathlib.Path(__file__).parent
spec = importlib.util.spec_from_file_location("services_data", HERE / "services_data.py")
D = importlib.util.module_from_spec(spec); spec.loader.exec_module(D)
J = "https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@%s/media/"
E = lambda s: html.escape(s, quote=True)


def img(ref):
    """'k:abj-w-walkin-oak.webp' -> full URL on that media commit; full URLs pass through."""
    if ref.startswith("http"):
        return ref
    b, name = ref.split(":", 1)
    return J % D.MEDIA[b] + name


def hero(p):
    vids = []
    for i, (wide, tall, cap) in enumerate(p["videos"]):
        attrs = ' class="on" autoplay' if i == 0 else ''
        pre = 'auto' if i == 0 else 'none'
        vids.append(' <video%s data-cap="%s" data-mp="%s" muted playsinline preload="%s" poster="%s"><source media="(max-width:760px)" src="%s"><source src="%s"></video>'
                    % (attrs, E(html.unescape(cap)), img(tall.replace('.mp4', '-poster.webp')), pre, img(wide.replace('.mp4', '-poster.webp')), img(tall), img(wide)))
    if not vids and p.get("hero_img"):
        vids.append(' <img class="hi" src="%s" alt="%s" fetchpriority="high">' % (img(p["hero_img"][0]), E(p["hero_img"][1])))
    cap = p["videos"][0][2] if p["videos"] else p.get("hero_cap", "")
    return ('<section class="hero hm" aria-label="%s">\n%s\n <div class="w">\n  <span class="kick">%s</span>\n  <h1>%s</h1>\n  <p>%s</p>\n'
            '  <div class="acts"><a class="bt" href="{BOOK}">Book a free design visit</a><a class="lnk" href="#kc-styles">%s</a></div>\n </div>\n <span class="cap">%s</span>\n</section>'
            % (E(p["name"]), "\n".join(vids), p["kicker"], p["h1"], p["lead"], p.get("explore", "Explore the styles"), cap))


def intro(p):
    facts = "".join("<span>%s</span>" % f for f in p["facts"])
    return ('<section class="intro"><div class="w">\n <span class="kick rv">%s</span>\n <div class="rv">\n  <p class="big">%s</p>\n  <div class="facts">%s</div>\n </div>\n</div></section>'
            % (p["intro_kick"], p["statement"], facts))


def styles(p):
    cards = []
    for i, st in enumerate(p["styles"]):
        im, alt, t, d = st[:4]
        pos = (' style="object-position:%s"' % st[4]) if len(st) > 4 else ''
        cards.append('  <a class="card" href="{BOOK}"><figure><img loading="lazy" src="%s" alt="%s"%s></figure><span class="n">(%02d)</span><h3>%s</h3><p>%s</p></a>' % (img(im), E(alt), pos, i + 1, t, d))
    cards.append('  <a class="card cta" href="{BOOK}"><span class="kick" style="color:rgba(243,238,230,.7);margin-bottom:18px">Not sure yet?</span><h3>%s</h3><span class="lnk">Book a design visit</span></a>' % p["cta_card"])
    return ('<section class="sty" id="kc-styles">\n <div class="w sh"><div class="rv"><span class="kick">Styles</span><h2 style="margin-top:16px">%s</h2></div>'
            '<div class="rv" style="display:flex;align-items:flex-end;gap:40px"><p>%s</p><div class="arw" data-for="kc-rail"><button type="button" data-d="-1" aria-label="Previous">&larr;</button>'
            '<button type="button" data-d="1" aria-label="Next">&rarr;</button></div></div></div>\n <div class="rail" id="kc-rail">\n%s\n </div>\n</section>'
            % (p["styles_h"], p["styles_p"], "\n".join(cards)))


def feature(p):
    f = p["feature"]
    lis = "".join("<li><i>%02d</i>%s</li>" % (i + 1, x) for i, x in enumerate(f["points"]))
    sm = "".join('<figure><img loading="lazy" src="%s" alt="%s"><figcaption>%s</figcaption></figure>' % (img(a), E(b), c) for a, b, c in f["small"])
    link = '<a class="lnk" href="%s">%s</a>' % f["link"] if f.get("link") else ""
    return ('<section class="fp" aria-label="%s"><div class="w">\n <figure class="big rv"><img loading="lazy" src="%s" alt="%s"%s></figure>\n <div class="tx">\n'
            '  <div class="rv"><span class="kick">%s</span><h2>%s</h2><p>%s</p>\n   <ul>%s</ul>\n   %s</div>\n  <div class="sm2 rv">%s</div>\n </div>\n</div></section>'
            % (E(f["h"]), img(f["big"][0]), E(f["big"][1]), (' style="object-position:%s"' % f["big"][2]) if len(f["big"]) > 2 else "",
               f["kick"], f["h"], f["p"], lis, link, sm))


def quote(p):
    q = p["quote"]
    return ('<section class="q1" aria-label="Client review"><div class="w rv">\n <span class="sr" aria-label="5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>\n'
            ' <blockquote>&ldquo;%s&rdquo;</blockquote>\n <cite><b>%s</b> &middot; Google review &middot; %s<a href="https://share.google/wadbR4QCwRXxM5fcm" target="_blank" rel="noopener">4.9 from 100+ reviews</a></cite>\n</div></section>'
            % (q[0], q[1], q[2]))


def process(p):
    steps = p.get("steps") or D.STEPS
    s = "".join('\n  <div class="rv"><i>%02d</i><h3>%s</h3><p>%s</p></div>' % (i + 1, a, b) for i, (a, b) in enumerate(steps))
    return ('<section class="proc"><div class="w">\n <div class="sh rv" style="margin-bottom:0"><div><span class="kick">How it works</span><h2 style="margin-top:16px">From first visit to final fitting</h2></div><p>%s</p></div>\n <div class="ps">%s\n </div>\n</div></section>'
            % (p.get("proc_p", D.PROC_P), s))


def book(p):
    b = p["book"]
    return ('<section class="bk" id="kc-book" aria-label="Book a design visit">\n <figure><img loading="lazy" src="%s" alt="%s" style="object-position:%s"></figure>\n <div class="t rv">\n'
            '  <span class="kick">Free design visit</span>\n  <h2>%s</h2>\n  <p>%s</p>\n'
            '  <div class="acts"><a class="bt" href="{BOOK}">Book a design visit</a><a class="bt o" href="tel:+441733686767">Call 01733 686767</a><a class="bt o" href="https://wa.me/447479219421">WhatsApp photos</a></div>\n'
            '  <p class="fin"><b>Interest-free finance</b> is available on projects over &pound;6,000 with a 50%% deposit, subject to status. <a href="/flexible-finance-dev-f3n7" style="border-bottom:1px solid rgba(243,238,230,.5)">How finance works</a><small>%s</small></p>\n </div>\n</section>'
            % (img(b[0]), E(b[1]), b[2] if len(b) > 2 else "50% 50%", p.get("book_h", "Start with a conversation at home"), p.get("book_p", D.BOOK_P), D.FIN))


def detail(p):
    paras = "".join("\n  <p>%s</p>" % x for x in p["seo"])
    rel = "".join('<a href="%s">%s</a>' % r for r in p["related"])
    faqs = "".join("\n  <details><summary>%s</summary><p>%s</p></details>" % (E(q), E(a)) for q, a in p["faqs"])
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Service", "name": p["service_name"], "serviceType": p["service_type"], "areaServed": "Peterborough and surrounding areas",
         "provider": {"@id": "https://abjkitchensandbedrooms.co.uk/#business"}},
        {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in p["faqs"]]}]}
    return ('<section class="det"><div class="w">\n <div class="copy rv">\n  <span class="kick">In detail</span>\n  <h2>%s</h2>%s\n  <div class="rel">%s</div>\n </div>\n <div class="rv">%s\n </div>\n</div></section>\n'
            '<script type="application/ld+json">%s</script>' % (p["seo_h"], paras, rel, faqs, json.dumps(ld, ensure_ascii=False)))


def page(p):
    meta = {"slug": p["slug"], "title": p["name"], "nav": p["url"], "ft": p["footer"]}
    parts = [hero(p), intro(p), styles(p)]
    if p.get("feature"): parts.append(feature(p))
    if p.get("quote"): parts.append(quote(p))
    parts += [process(p), book(p), detail(p)]
    return "<!--META %s -->\n%s\n" % (json.dumps(meta), "\n\n".join(parts))


if __name__ == "__main__":
    for p in D.PAGES:
        (HERE / "pages" / (p["slug"] + ".html")).write_text(page(p))
        print("pages/%s.html" % p["slug"])
