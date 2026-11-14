#!/usr/bin/env python3
"""Build every ABJ brochure and catalogue: python3 make_all.py <outdir>
Writes <name>.pdf, covers/<name>.jpg (page 1, 480 px wide) and manifest.json (name, pages, MB). Exits 1 on any layout warning."""
import sys, os, json, subprocess
import build as B, catalogues as C
from playwright.sync_api import sync_playwright

out = sys.argv[1]; os.makedirs(os.path.join(out, 'covers'), exist_ok=True)
jobs = []
T = B.towns()
for i, (slug, t) in enumerate(T.items()):
    s = B.town_spec(slug, t, i); jobs.append((s['file'], (lambda s=s: B.build(s))))
jobs += list(C.CATALOGUES.items())
man = {}; bad = 0
with sync_playwright() as pw:
    br = pw.chromium.launch()
    for name, fn in jobs:
        pdf = os.path.join(out, name + '.pdf'); r = B.render(fn(), pdf, br)
        subprocess.run(['pdftoppm', '-f', '1', '-l', '1', '-scale-to-x', '480', '-scale-to-y', '-1', '-jpeg', '-jpegopt', 'quality=80', '-singlefile', pdf, os.path.join(out, 'covers', name)], check=True)
        man[name] = {'pages': r['pages'], 'mb': r['mb']}; bad += len(r['bad'])
        print(name, r['pages'], r['mb'], r['bad'] or 'ok')
    br.close()
json.dump(man, open(os.path.join(out, 'manifest.json'), 'w'), indent=1)
print(len(man), 'files', round(sum(v['mb'] for v in man.values()), 1), 'MB', 'warnings:', bad)
sys.exit(1 if bad else 0)
