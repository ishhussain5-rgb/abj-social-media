# ABJ project packs

Two A4 landscape PDFs built from one project file:

- **Customer pack** (`*-customer-pack.pdf`): cover, design at a glance, floor plan, wall views, everything included (sizes in cm), the journey from survey to handover, getting ready for fitting, aftercare and guarantee, FAQs, payment and design sign-off, and the full terms and conditions word for word.
- **Fitter's pack** (`*-fitter-pack.pdf`): job sheet, delivery check, numbered plans per stage (base and tall, wall, island), elevations, appliances, worktops, finishing, installer notes, snagging and handover sign-off (sizes in mm).

## Make a pack for a client

1. Copy `projects/sample-kitchen.json` and fill in the real design (all sizes in mm). Set `"sample": false` to remove the SAMPLE tags.
2. Run:
   ```
   ABJ_IMG=<photo folder> ABJ_FONTS=<node_modules/@fontsource> ABJ_LOGO=../../../assets/abj-logo-roundel-web-512.png \
   python3 build.py projects/<client>.json <outdir>
   ```
   Needs Python with Pillow, segno and Playwright. The build stops with a list if anything runs off a page.
3. **Never commit a real client's project file or pack here: this repository is public.** Keep them in Google Drive.

## Adding the quotation and 3D views

- `"quote"`: the quotation Alex sends, typed in exactly as written (sections, line items, totals, summary, notice). It becomes a "Your quotation" page, and the build checks that the lines add up to the totals.
- `"renders"`: paths to the designer's 3D views. The first goes on the cover; the next three or four go on a "Your design in 3D" page.
- No `"units"` (no unit-by-unit design yet)? The pack skips the plan, wall and item pages and the fitter's pack, and still builds the customer pack from the quote.

## Wording sources

- `data/terms.txt`: the live Terms and Conditions page, word for word (check it still matches the site before each batch).
- `data/faq.json`: answers from the website FAQ, word for word.
- `sample/`: the two sample PDFs from the sample project.
