import pathlib, svc, new_pages_data3 as N
HERE = pathlib.Path(__file__).parent
for p in N.PAGES:
    (HERE / "pages" / (p["slug"] + ".html")).write_text(svc.page(p).replace('<span class="kick">Styles</span>', '<span class="kick">Cost guide</span>')); print(p["slug"])
