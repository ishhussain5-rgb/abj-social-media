# ABJ brochures (PDF)

21 A4 PDFs, about 1.3 MB each, with clickable Book / Call / WhatsApp buttons on the back cover.

- `build.py`: layout, page parts and the location brochure. Photos are cropped to their slot; a photo (or another crop of
  the same shot) can only be used once per brochure, and every page is checked for text running off the page.
- `data/towns*.json`: copy for each town, taken from the live location pages. `specs/<slug>.json` overrides for a town
  written by hand (Stamford). `peterborough` is the main ABJ brochure (`abj-brochure.pdf`).
- `catalogues.py`: the kitchen, bedroom and media wall collections (copy and prices from the live product and cost pages).
- `make_all.py <outdir>`: builds everything, plus `covers/<name>.jpg` and `manifest.json`.

```
export ABJ_IMG=<folder of source photos> ABJ_FONTS=<node_modules/@fontsource> ABJ_LOGO=assets/abj-logo-roundel-web-512.png
python3 make_all.py out/
```

Source photos are the web photos from the `web-media-*` branches (`<name>.webp`). The finished PDFs are published on the
`web-media-s` branch under `brochures/` and linked from the page layer (`web/concept/mobile/mobile.html`, `BRB`).

Prices: kitchens and media walls are ABJ's own published guide prices. Wardrobes, bedrooms and storage are UK market
averages (Which?, Checkatrade, Hammonds price guide) and should be confirmed by ABJ; home offices are "priced at your visit".
Reviews are word for word from the website, without names.
