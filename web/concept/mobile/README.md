# Phone layer + desktop polish (`mobile.html`)

One self-contained snippet (styles + one small script) appended to the end of each page's main new-standard block,
between `<!-- ABJ MOBILE (phone layer ...` and `<!-- /ABJ MOBILE -->`. Phones only (max-width 760px); desktop is unchanged.

What it does on phones:
- Footer: link groups fold behind tap-to-open +; the big "Let's design your ..." footer call to action is hidden when the
  page already has the "Free design visit" block (the sticky Call / WhatsApp / Book bar is always on screen).
- Free design visit block: short photo, one full-width primary button, Call and WhatsApp as two equal buttons on one line.
- Cost guide: full-width "Show my guide price", example prompts on one swipeable line.
- "In detail" (and long `.sec .copy` text): first paragraph with Read more; related links on one swipeable line.
- Long card lists (`.three`, `.tmg` team, `.why` home types) taller than ~1 screen become one swipeable row with a counter.
- Tighter, consistent section spacing; grids can never grow wider than the screen.

Also (13 Nov, later):
- "How it works" steps (`.ps` with numbered `<i>`, in `.proc` and the homepage `.ws`) become a journey: numbered stops on a
  line that fills gold as you scroll and lights each stop in turn (horizontal on desktop, vertical on phones).
- Desktop: film sections fit one window under the 86px header (frame height from the window height, same video file);
  footer compacted (one-line heading with phone + button, consistent gold column headings, tighter spacing).

Handlers are delegated from `#kc` and set-up runs again after `load`, because older site-head scripts re-render the
footer (which dropped directly attached listeners).

Applying it: in a Tilda page editor (Claude in Chrome) run `abjPatch({pid, sha, mobile:true})` from `patch.js`
(optionally `film:'<name>', filmAnchors:[...]` and `guarantee:true`). It picks the longest switched-on block containing
`id="kc"`, removes any previous copy, appends the new one, saves and publishes that one page.
Rollback: delete everything between the two markers and publish the page.

Also (14 Nov, brochures):
- Every page offers a PDF brochure: a band before the "Free design visit" block (cover thumbnail, "Open the brochure",
  "Download PDF") and a small "PDF Open the ... brochure" link under the intro's fact tiles. `BR()` picks the file from the
  page path: town pages get their own town brochure, kitchen / worktop pages the kitchen collection, bedroom / wardrobe
  pages the bedroom collection, media wall / alcove / wall panelling pages the media wall collection, everything else the
  main ABJ brochure. Terms, privacy, payment terms and the booking form have none.
- The PDFs and cover thumbnails live on the `web-media-s` branch (`brochures/`), served through jsDelivr pinned to a
  commit (`BRB` in the script). They are built by `web/concept/brochure/make_all.py`; after a rebuild, push the branch and
  update the commit in `BRB`.
