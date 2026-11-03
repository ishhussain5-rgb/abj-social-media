# ABJ service pages (DEV) layer

Calm, editorial layout for the 12 DEV service pages (Nordiska Kök inspired, ABJ brand).
- `slim.js`: the layout layer. It runs only on the DEV service-page paths listed in its `MAP`.
- `media.js`: per-page media (hero reel, film reel, tile photo swaps) and film copy.
- Media lives on branches, under `media/`: `web-media-a`/`web-media-b` hold the second reels (films) and tile photos; `web-media-c`/`d`/`e` hold the hero clips (two long, slow clips per page, A and B, made with `mkweb2.py`-style settings: 2 shots of about 5 s, slowed to 0.85x, steadied, 1.2 s dissolves). Each branch must stay under jsDelivr's 50 MB package limit, so start a new branch rather than letting one grow, and add it to the list in `build.py`. `build.py` maps every file name in `media.js` to its branch commit.
- `build.py`: bundles `media.js` + `slim.js` into `abj-slim.js`.

How it loads on the DEV pages:
- Each DEV service page has a small loader (in its "page-level head code" T123 block, between the `ABJ SLIM SERVICE PAGES (DEV)` markers) that loads `abj-slim.js` from jsDelivr `@main`.
- `abj-slim.js` is a stable bootstrap. It reads `version.txt` from GitHub and loads `abj-slim-bundle.js` pinned to that commit.
- Media URLs are pinned to the commit of each media branch.

Releasing a change:
1. Add any new media to a media branch and push it; fetch it locally (`git fetch origin +refs/heads/web-media-a:refs/remotes/origin/web-media-a`, same for each media branch). Edit `slim.js` / `media.js`, run `python3 build.py`, commit and push.
   Keep the main branch under 50 MB too (no media on main).
2. Write that commit's full SHA into `version.txt`, commit and push. DEV pages pick it up within about 5 minutes.
Do not change `abj-slim.js` unless you must: jsDelivr can take hours to refresh `@main`.
Do not delete the media branches while any page still points at them.
