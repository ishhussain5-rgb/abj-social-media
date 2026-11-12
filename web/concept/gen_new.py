#!/usr/bin/env python3
"""Writes pages/<slug>.html for the pages in new_pages_data.py (same layout as svc.py), then run build.py <slugs>."""
import pathlib, svc, new_pages_data as N
HERE = pathlib.Path(__file__).parent
for p in N.PAGES:
    (HERE / "pages" / (p["slug"] + ".html")).write_text(svc.page(p))
    print("pages/%s.html" % p["slug"])
