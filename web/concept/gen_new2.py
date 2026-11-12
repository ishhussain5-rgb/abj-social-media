import pathlib, svc, new_pages_data2 as N
HERE = pathlib.Path(__file__).parent
for p in N.PAGES:
    (HERE / "pages" / (p["slug"] + ".html")).write_text(svc.page(p)); print(p["slug"])
