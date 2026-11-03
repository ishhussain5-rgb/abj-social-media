# ABJ service pages (DEV) layer

Calm, editorial layout for the 12 DEV service pages (Nordiska Kök inspired, ABJ brand).
- `slim.js`: the layout layer. It runs only on the DEV service-page paths listed in its `MAP`.
- `media.js`: per-page media (hero reel, film reel, tile photo swaps) and film copy.
- `media/`: web reels (no audio, about 2–3 MB each), posters and tile photos.
- `build.py`: bundles `media.js` + `slim.js` into `abj-slim.js`.

The DEV pages load the bundle through jsDelivr, pinned to a commit:
`https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@<commit>/web/service-pages/abj-slim.js`
After changing anything here: run `build.py`, commit, push, then update the commit in the page loader.
Do not delete `media/` while any page still points at it.
