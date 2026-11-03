# ABJ service pages (DEV) layer

Calm, editorial layout for the 12 DEV service pages (Nordiska Kök inspired, ABJ brand).
- `slim.js`: the layout layer. It runs only on the DEV service-page paths listed in its `MAP`.
- `media.js`: per-page media (hero reel, film reel, tile photo swaps) and film copy.
- `media/`: web reels (no audio, about 2–3 MB each), posters and tile photos.
- `build.py`: bundles `media.js` + `slim.js` into `abj-slim.js`.

How it loads on the DEV pages:
- Each DEV service page has a small loader (in its "page-level head code" T123 block, between the `ABJ SLIM SERVICE PAGES (DEV)` markers) that loads `abj-slim.js` from jsDelivr `@main`.
- `abj-slim.js` is a stable bootstrap. It reads `version.txt` from GitHub and loads `abj-slim-bundle.js` pinned to that commit.
- Media URLs are pinned to the last commit that touched `media/`.

Releasing a change:
1. Edit `slim.js` / `media.js` (add new media to `media/`), run `python3 build.py`, commit and push.
2. Write that commit's full SHA into `version.txt`, commit and push. DEV pages pick it up within about 5 minutes.
Do not change `abj-slim.js` unless you must: jsDelivr can take hours to refresh `@main`.
Do not delete `media/` while any page still points at it.
