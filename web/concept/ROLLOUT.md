# New-standard rollout tracker (DEV)

Generator: `svc.py` + `services_data.py` write `pages/<slug>.html` for room pages; `build.py` builds `out/<slug>.html`.
Tilda update method (no UI clicks except Publish): in the page editor run
`tp__fetch({url:'/page/submit/',body:{comm:'addnewrecord',...}})` or reuse a duplicated block, then
`tp__fetch({url:'/page/submit/',body:{comm:'saverecord',pageid,recordid,onlythisfield:'code',code:html}})`,
`comm:'offrecord'` for each old block, and finally a real click on the Publish icon (single page only).

| Page | DEV URL | Tilda page | New block | Status |
|---|---|---|---|---|
| Homepage | /home-dev-r7m3k | 350369803 | rec5643988903 | live on DEV |
| Kitchens | /bespoke-kitchens-dev-k7q2 | 352648603 | rec5644015603 | live on DEV |
| Wardrobes | /bespoke-wardrobes-dev-w4m8 | 352674603 | rec5644232003 | live on DEV |
| Bedrooms | /bespoke-bedrooms-dev-b3n6 | 352674703 | rec5644237603 | live on DEV |
| Media walls | /media-walls-dev-m9t5 | 352685103 | rec5644238303 | live on DEV |
| Worktops | /luxury-worktops-dev-t6p3 | 352693403 | rec5644290603 | live on DEV |
| Wall panelling | /decors-dev-d8r4 | 352693503 | rec5644298303 | live on DEV |
| Storage | /bespoke-storage-dev-s2k7 | 352693303 | rec5644302703 | live on DEV |
| Home offices | /office-renovations-dev-o3f7 | 352693703 | rec5644307403 | live on DEV |
| Hallways | /bespoke-hallways-dev-h4j8 | 352714403 | rec5644309203 | live on DEV |
| Bathroom cabinetry | /bathroom-cabinetry-dev-c6v2 | 352714503 | rec5644313603 | live on DEV |
| Upholstery | /upholstery-dev-u5h9 | 352693603 | rec5644317103 | live on DEV (C clip from headboard photos; replace when better footage exists) |
| HMO | /hmo-makeover-dev-m2x5 | 352714603 | rec5644319403 | live on DEV |
| About | /about-abj-dev-a5b9 | 354002803 | rec5644393503 | live on DEV |
| Finance | /flexible-finance-dev-f3n7 | 354002603 | rec5644398003 | live on DEV |
| Booking | /bookingform-dev-k9b4 | 354003303 | rec5644399403 | live on DEV (web3forms key filled in the editor, not stored in the repo) |
| Offers | /offers-dev-o8f2 | 354002703 | rec5644423903 | live on DEV (November offers; update monthly) |
| FAQs | /faq-abj-dev-q4z6 | 354003103 | rec5644425603 | live on DEV |
| Gallery | /gallery-dev-g7l3 | 354003003 | rec5644426903 | live on DEV (gallery.py + gallery_data.txt) |
| Products we use | /products-we-use-dev-u2a5 | 354170803 | rec5644428803 | live on DEV |
| Blog & guides | /abjfeeds-dev-b2f8 | 354003203 | rec5644431103 | live on DEV (Tilda CMS block 3271 kept on and moved into the page) |
| Terms | /terms-and-conditions-dev-v9c7 | 354171103 | rec5644434203 | live on DEV (text carried over from the old block in the editor) |
| Payment terms | /payment-terms-abj-dev-h4e2 | 354170903 | rec5644436303 | live on DEV |
| Privacy | /privacypolicy-dev-b1c4 | 354171203 | rec5644437003 | live on DEV |
| Stamford, Oundle, Market Deeping, Bourne, Spalding, Grantham, Huntingdon, St Ives, Ely, Wisbech | /fitted-kitchens-bedrooms-<town>-dev-xxxx | 354171303, 354171403, 354171603, 354171703, 354171803, 354172003, 354172103, 354172203, 354172303, 354172403 | rec5644439903, 5644440803, 5644441703, 5644442703, 5644443703, 5649047003, 5649047603, 5649055803, 5649056903, 5649057503 | live on DEV (area-template.html filled from each old page in the editor) |
| Oakham | /fitted-kitchens-bedrooms-oakham-dev-e4y6 | 354171903 | rec5649232103 | live on DEV (bespoke layout, landmarks added in the editor: patch only) |
| Cambridge | /fitted-kitchens-bedrooms-cambridge-dev-s4w2 | 354172603 | rec5649232503 | live on DEV (bespoke layout, landmarks added in the editor: patch only) |
| Case study: Kings Road | /case-study-kings-road-kitchen-peterborough-dev-c3k8 | 373659003 | rec5649275103 | live on DEV (patch only) |
| Case study: Handleless island | /case-study-handleless-island-kitchen-dev-h6w2 | 373659103 | rec5649275303 | live on DEV (patch only) |
| Bespoke furniture near me | /near-me-peterborough-dev-n7p4 | 373659203 | rec5649275503 | live on DEV (patch only; FAQPage JSON-LD added; meta title fixed, see 404 note) |
| Cut & Edge | none | 373659303 (unpublished copy) | | not needed: the live page is archived and 301s to cutandedgexpress.com |

All room-page H1s now lead with the service and "Peterborough" (e.g. "Fitted wardrobes in Peterborough, built to make every inch count"). Page titles, descriptions, URLs and FAQs carried over from the old DEV pages.
Media for batch 2-3 pages: branch web-media-l (c9b6a43), plus images already on the Tilda CDN.
Hero clips for storage, office, hallways, bathroom, upholstery and HMO: branch web-media-m (c622e97), stills-based Ken Burns
"C" clips (two photos per wide frame, 0.6 s dissolves, no slow-motion or frame blending). Room pages republished from 45dafb9.

Editor helper: tilda_swap.js (load from jsDelivr in the page editor, then `await abjSwap({src, must, mode})`).
Never run it before the records have loaded; it now waits and refuses if no records are found (a race on the About page once
overwrote the old block; it was restored from the published page before publishing).

Updating a page that has placeholders filled in the editor (booking, terms, payment, privacy, area pages): patch the saved
block code in the editor (read `#record<id> pre code`, change it, saverecord) instead of re-sending out/<slug>.html,
so the form key and the carried-over text stay in place.

## Landmarks on area pages (Nov 2026)
All 12 town pages have a photo hero of a local landmark plus a "A few of <town>'s landmarks" section with two more photos and
Wikimedia Commons credits (author + licence links). Source list: `landmarks.json`. Images were converted to webp and uploaded
to the Tilda CDN from the editor; `abjLandmarks({rec,town,imgs})` in tilda_update.js applied them. Area pages are now
**patch mode only**: `abjUpdate({rec,mode:'patch',base})` swaps the theme `<style>` and rewrites case-study links, nothing else.

## Republishing everything
`abjUpdate` (tilda_update.js): mode `direct` for room and info pages (home, kitchens ... blog), mode `patch` for booking, legal,
the 12 town pages, both case studies and near-me. Then a real click on the Publish icon. Full republish done 10 Nov from ba043d3.
QA: load qa.js on the site origin and run `abjQARun([...paths])` (desktop 1905 and phone 390).

## Blog articles (/abjfeeds/tpost/...)
Tilda CMS renders these outside our blocks and they are shared with the live site. `post-skin.js` re-renders an article in the
new design. Preview: add `?preview=new` to any article URL (`?preview=old` to stop). At go-live add to the site head
(Site settings > More > HTML code for the HEAD), pinned to a commit:
`<script>window.ABJ_POST_SKIN=true</script><script src="https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@<commit>/web/concept/post-skin.js" defer></script>`

**LIVE since 10 Nov 2026.** The site HEAD box holds at most 65,535 bytes (Tilda silently cuts anything longer, which would
leave a broken half tag), and it was already at 65,388. So the live line is the compact form, last line of the site HEAD:
`<!--blog skin 10.11.26--><script src="https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@113f662a2c80b48186b9d3759fce0da63ff998ca/web/concept/post-skin.js?on" defer></script>`
(`?on` switches the skin on, same as ABJ_POST_SKIN=true). To make room, the wording of our own 10 Nov comment around the old
X tags was shortened; the old X tags themselves are untouched inside it. Site HEAD is now 65,498 bytes: **37 bytes free**, so
any new site-wide code needs space made first (or goes in per-page HEAD code instead). Backups in the Tilda tab's localStorage:
`abj_sitehead_backup_20261110_blogskin` (before) and `abj_sitehead_intended_20261110_blogskin` (after).
Turn off: delete that last line in Site settings > More > HTML code for the HEAD, then republish /abjfeeds (72969701).
Turn on/refresh: articles pick up a site HEAD change when /abjfeeds is republished. Other pages pick the line up on their next
publish; it does nothing there (exits straight away when the address has no /tpost/).
Checked 10 Nov on all 8 articles at 390 and 1440: new header/footer, 1 H1, article text identical in length to the original,
no broken images, no sideways scroll, no DEV links, canonical and X/OG tags unchanged.

## Go-live checklist
- Every internal `-dev-xxxx` link must point at the live URL (e.g. /home-dev-r7m3k -> /, /bespoke-kitchens-dev-k7q2 -> /bespoke-kitchens,
  /bookingform-dev-k9b4 -> /bookingform, /abjfeeds-dev-b2f8 -> /abjfeeds). Do it in build.py and the patch helper, then republish.
- Live /near-me-peterborough (123982426) is also the site's 404 page (meta title "Page Not Found"). Decide: keep it as the 404, or
  make a separate new-design 404 page and point Site settings > 404 at it.
- ~~Turn on the blog post skin (head snippet above).~~ Done 10 Nov 2026.
- Search Console, 10 Nov 2026: sitemap.xml and sitemap-feeds.xml resubmitted; new 404 validation started (67 URLs; of the 65 shown,
  60 now 301 to live pages and 5 stay 404 on purpose: two old /tpost/ posts Tilda can't redirect and three Tilda template placeholders like
  /{{link@url}}); indexing requested for /, /bespoke-kitchens, /bespoke-wardrobes, /bespoke-bedrooms-abj, /media-walls,
  /luxury-worktops-abj, /bespoke-decors-peterborough, /about-abj, /gallery, /abjfeeds (Google's daily limit is about 10).
- The site head shows a "Sorry, we couldn't find that page" banner on any page whose canonical is /near-me-peterborough but whose
  URL is not. The DEV near-me copy's canonical was cleared for that reason (10 Nov). The live page keeps its own canonical.

## Go-live (from 10 Nov 2026)
Method: `abjCapture(<DEV rec>)` in the DEV page editor, then `abjGoLive({base, expect})` in the LIVE page editor (tilda_golive.js).
The new block is added as a new record; the old blocks are only switched off (never edited or deleted). Their codes are also kept
privately in that browser's IndexedDB (`abj_golive` on tilda.cc). Undo: `abjRollback()` in the live editor, then publish.
Live links come from `linkmap.json` (all 39 checked: no DEV links left, every target page returns 200).

| Live page | Live Tilda page | DEV page / rec | New live rec | Old recs switched off | Status |
|---|---|---|---|---|---|
| /products-we-use | 333106403 | 354170803 / 5644428803 | 5653872103 | 5129201203 | LIVE 10 Nov (pilot) |
| /terms-and-conditions | 82695596 | (captured from DEV) | 5657521403 | 1375663731 | LIVE 10 Nov |
| /payment-terms-abj | 84863476 | (captured from DEV) | 5657524703 | 1454796151, 1408567331 | LIVE 10 Nov |
| /privacypolicy | 70795693 | (captured from DEV) | 5657527203 | 1454563181 | LIVE 10 Nov |
| /bespoke-kitchens | 73297273 | (captured from DEV) | 5657531303 | 1278191031 (1993983471 was already off) | LIVE 10 Nov |
| /bespoke-wardrobes | 73280437 | (captured from DEV) | 5657532803 | 1291093181 (1993990101 was already off) | LIVE 10 Nov |
| /bespoke-bedrooms-abj | 73297487 | (captured from DEV) | 5657534703 | 1448848451 (1993992071 was already off) | LIVE 10 Nov |
| /media-walls | 73279037 | (captured from DEV) | 5657536503 | 1448933701 (1994007311 was already off) | LIVE 10 Nov |
| /luxury-worktops-abj | 73545333 | (captured from DEV) | 5657537203 | 1448863051 (1994002551 was already off) | LIVE 10 Nov |
| /bespoke-decors-peterborough | 73195791 | (captured from DEV) | 5657538603 | 1448931661 (1994004111 was already off) | LIVE 10 Nov |
| /bespoke-storage-solutions | 73372439 | (captured from DEV) | 5657540503 | 1448954911 (1994010151 was already off) | LIVE 10 Nov |
| /bespoke-office-renovations | 73279381 | (captured from DEV) | 5657545803 | 1449578951 (1994017681 was already off) | LIVE 10 Nov |
| /bespoke-hallways | 73340083 | (captured from DEV) | 5657547203 | 1448859141 (1993998411 was already off) | LIVE 10 Nov |
| /bathroom-cabinetry | 152105513 | (captured from DEV) | 5657550603 | 2436256093, 2436285593, 2436285963 | LIVE 10 Nov |
| /upholstery | 146924323 | (captured from DEV) | 5657552903 | 2353737813 (2353737823 was already off) | LIVE 10 Nov |
| /hmo-makeover | 73279797 | (captured from DEV) | 5657563103 | 1449632171 | LIVE 10 Nov |
| /about-abj | 112290576 | (captured from DEV) | 5657563503 | 2462587463, 5250489903 (5250461703 was already off) | LIVE 10 Nov |
| /flexible-finance | 108529576 | (captured from DEV) | 5657564103 | 2373816383 | LIVE 10 Nov |
| /offers | 343764303 | (captured from DEV) | 5657564603 | 5259514203 (5259514303 was already off) | LIVE 10 Nov |
| /faq-abj | 107787436 | (captured from DEV) | 5657568403 | 1752229531 | LIVE 10 Nov |
| /gallery | 74160025 | (captured from DEV) | 5657569603 | 1306655851 | LIVE 10 Nov |
| /abjfeeds | 72969701 | (captured from DEV) | 5657639303 | 1332791091 (CMS feed block 4905431403 kept ON) | LIVE 10 Nov |
| /fitted-kitchens-bedrooms-stamford | 150457663 | (captured from DEV) | 5657580503 | 2409389263, 4634077903 | LIVE 10 Nov |
| /fitted-kitchens-bedrooms-oundle | 150775693 | (captured from DEV) | 5657582203 | 2414441003, 4634136503 | LIVE 10 Nov |
| /fitted-kitchens-bedrooms-market-deeping | 150780073 | (captured from DEV) | 5657592803 | 2414452603, 4634148103 | LIVE 10 Nov |
| /fitted-kitchens-bedrooms-bourne | 150783143 | (captured from DEV) | 5657595203 | 2414457943, 4634161503 | LIVE 10 Nov |
| /fitted-kitchens-bedrooms-spalding | 150784123 | (captured from DEV) | 5657603903 | 2414459263, 4634166903 | LIVE 10 Nov |
| /fitted-kitchens-bedrooms-grantham | 150787653 | (captured from DEV) | 5657604403 | 2414600663, 4642729103 | LIVE 10 Nov |
| /fitted-kitchens-bedrooms-huntingdon | 150784883 | (captured from DEV) | 5657605503 | 2414460823, 4634461203 | LIVE 10 Nov |
| /fitted-kitchens-bedrooms-st-ives | 150785703 | (captured from DEV) | 5657607203 | 2414463403, 4634463603 | LIVE 10 Nov |
| /fitted-kitchens-bedrooms-ely | 150786283 | (captured from DEV) | 5657610303 | 2414464713, 4642707703 | LIVE 10 Nov |
| /fitted-kitchens-bedrooms-wisbech | 150786943 | (captured from DEV) | 5657613103 | 2414466953, 4642714903 | LIVE 10 Nov |
| /fitted-kitchens-bedrooms-oakham | 204575403 | (captured from DEV) | 5657616703 | 3283452703 | LIVE 10 Nov |
| /fitted-kitchens-bedrooms-cambridge | 241181303 | (captured from DEV) | 5657622403 | 3850669703, 3850707203 | LIVE 10 Nov |
| /case-study-kings-road-kitchen-peterborough | 343215603 | (captured from DEV) | 5657625703 | 5250674903 (5250675103 was already off) | LIVE 10 Nov |
| /case-study-handleless-island-kitchen | 343217603 | (captured from DEV) | 5657627903 | 5250683803 (5250684003 was already off) | LIVE 10 Nov |
| /near-me-peterborough (404 page) | 123982426 | (captured from DEV) | 5657633603 | 1991934101, 2003941381 | LIVE 10 Nov |
| /bookingform | 74327267 | (captured from DEV) | 5657643903 | 2276598863 (6 older blocks were already off) | LIVE 10 Nov |
| / (homepage) | 30601906 | (captured from DEV) | 5657646303 | 2355676343, 5259604203, 5121863303, 2462487293 | LIVE 10 Nov |

Live Tilda page ids: / 30601906, /bespoke-kitchens 73297273, /bespoke-wardrobes 73280437, /bespoke-bedrooms-abj 73297487,
/media-walls 73279037, /luxury-worktops-abj 73545333, /bespoke-decors-peterborough 73195791, /bespoke-storage-solutions 73372439,
/bespoke-office-renovations 73279381, /bespoke-hallways 73340083, /bathroom-cabinetry 152105513, /upholstery 146924323,
/hmo-makeover 73279797, /about-abj 112290576, /flexible-finance 108529576, /bookingform 74327267, /offers 343764303,
/faq-abj 107787436, /gallery 74160025, /products-we-use 333106403, /abjfeeds 72969701, /terms-and-conditions 82695596,
/payment-terms-abj 84863476, /privacypolicy 70795693, /case-study-kings-road-kitchen-peterborough 343215603,
/case-study-handleless-island-kitchen 343217603, /near-me-peterborough 123982426 (also the 404 page), town pages:
stamford 150457663, oundle 150775693, market-deeping 150780073, bourne 150783143, spalding 150784123, grantham 150787653,
huntingdon 150784883, st-ives 150785703, ely 150786283, wisbech 150786943, oakham 204575403, cambridge 241181303.

Live publish 10 Nov 2026 07:35-07:59 from commit 7836ecc (current theme incl. tighter phone spacing + folding phone footer).
To undo one page: open its LIVE editor, load tilda_golive.js, `await abjRollback()` (uses the browser's saved list), or by hand:
switch the new block off and switch the listed old blocks back on, then publish. Old blocks were never edited.

### SEO pass (10 Nov 2026, after the SEO checker fell from 98 to 90)
- Every live page now has "Don't use footer for this page" ticked in Page settings, so the old global footer
  (page 346585603) no longer prints under the new design. The footer page itself is untouched.
  Its two scripts the new pages still need (web3forms -> ABJ Factory lead hand-off, conversion de-duplication) are copied
  into each page's new block (`abjRefresh({footerScripts:true})`). Undo: untick the setting and publish that page.
- Logo text moved out of `<b>` (class `lgt`), menu photos have alt text, menu button has `aria-label="Open menu"`.
- Header is `<div class="hd" role="banner">`, not `<header>`: the old site's head scripts (left in place) restyle the first
  `<header>` on desktop and add an extra burger. The block also sets `data-abj-links` on `<html>` so the old link script
  stops adding "Project Gallery", "FAQs" and a second "Privacy Policy" link. Refreshed from commit 8264aad.

### Screaming Frog pass (10 Nov 2026, ~10:00)
- Every image in the new blocks has its real width/height (from `imgdims.json`, built from the SF export plus a browser
  check), with `data-wh` and `:where(#kc img[data-wh]){height:auto}` so no image changes size. Checked on all 39 pages
  at 1440 and 390 wide: 0 images changed size.
- Town pages: H2 "What we make" -> "What we make in <town>". Booking page background photo alt "Handleless kitchen".
- X cards: site-wide twitter:title/description in Site Settings > HEAD are wrapped in an HTML comment (not deleted);
  each live page's own HEAD code has its own twitter:title/description appended (old head code kept; a copy of each
  page's previous HEAD code is in this browser's localStorage `abj_headbak_<pageid>`, the site HEAD in
  `abj_sitehead_backup_20261110`). Undo: remove the appended lines / the comment markers and republish.
- og:description set in Page settings for /about-abj (was empty) and /flexible-finance (was the homepage's).
- Publishing from script: `tp__fetch({url:'/page/publish/',body:{comm:'pagepublish',pageid,csrf:getCSRF(),returnjson:'yes'}})`.
- 301 added (Site Settings > SEO > 301 Redirects): /shop/851184866934-apples -> /. Old /tpost/<slug> URLs can't be
  redirected there (Tilda's blog router answers /tpost/* with its own 404 before the redirect list is checked).

## Google titles and descriptions (11 Nov 2026)
Changed in Page settings (SEO title / SEO description; Facebook title/description for the booking page only), each page
published on its own and checked live. Why: Search Console shows Google uses the HOMEPAGE for kitchen searches (about 4th for
"fitted kitchens peterborough", "kitchen design peterborough", 3rd for "kitchen installation peterborough", almost no clicks),
while /bespoke-kitchens sits around 29th for the same searches. "10-year guarantee" left out of new wording until the T&Cs match.

| Page (id) | Old | New |
|---|---|---|
| / (30601906) title | Fitted Kitchens, Bedrooms & Design in Peterborough \| ABJ | Fitted Kitchens Peterborough \| Design & Installation \| ABJ |
| / description | Kitchen design and installation in Peterborough, plus fitted bedrooms, wardrobes and media walls made in our workshop. 4.9-star rated, free 3D design. | Independent Peterborough kitchen company: we design, make and fit kitchens, wardrobes and media walls. Free 3D design visit. Rated 4.9★ on Google. |
| /bespoke-kitchens (73297273) title | Bespoke Kitchens Peterborough \| Design & Installation \| ABJ | Bespoke Kitchens Peterborough \| Handleless, Shaker & Islands |
| /bespoke-kitchens description | Bespoke kitchens designed, made and installed by our own fitters in Peterborough. Free 3D design visit, 10-year guarantee, 0% finance (subject to status). | Handleless, Shaker and island kitchens made in our Peterborough workshop and fitted by our own team. Free 3D design visit, 0% finance (subject to status). |
| /media-walls (73279037) title | Media Wall Ideas \| Bespoke TV Walls Made in Peterborough | Media Walls Peterborough \| Bespoke TV Wall Units \| ABJ |
| /media-walls description | Bespoke Peterborough media walls with built-in TV recess, fireplace and storage. 4.9-star rated, 10-year guarantee. Book a free design visit | Bespoke TV media wall units made in Peterborough, with TV recess, fireplace, LED lighting and hidden storage. Free design visit. 4.9★ on Google. |
| /bookingform (74327267) Facebook title | (empty, so the page title "ABJ Kitchens and Bedrooms \| Booking Form" was used) | Book a Free Design Visit \| ABJ Kitchens & Bedrooms |
| /bookingform Facebook description | (empty, so Tilda's template text "An online form to collect contact information, number of guests..." was used) | Book a free design visit for a kitchen, bedroom, wardrobe or media wall. We come to you across Peterborough and up to 80 miles away. |

Rollback: paste the old text back into Page settings and publish that one page. Compare clicks for these searches after 4 weeks.

## 7 new service pages LIVE (11 Nov 2026)
Built to catch searches the site had no page for (Search Console gaps). Each live page is a duplicate of its private DEV page
(the DEV pages stay as they were: private, noindex). Block code = `out-live/<slug>.html` at 4cbf91a + theme/footer/SEO fixes
from `tilda_golive.js` + the two site-footer scripts (lead hand-off, conversion de-duplication). Page settings and HEAD code
come from `golive_new7.json` (title, description, social title/description/image, canonical; HEAD = BreadcrumbList +
twitter:title/description; Service + FAQPage schema sit in the block). Each published on its own and checked live: 200,
index allowed, canonical correct, one H1, no DEV links, all images sized, no repeated photos, footer scripts present,
43 internal links all 200, no sideways scroll at 390 px.

| Live address | Tilda page id | DEV page it came from |
|---|---|---|
| /fitted-wardrobes-sloping-ceilings | 377674203 | /sloping-ceiling-wardrobes-dev-s5e2 |
| /under-stairs-storage | 377674303 | /under-stairs-storage-dev-u7s3 |
| /sliding-wardrobes | 377674503 | /sliding-wardrobes-dev-s3w8 |
| /walk-in-wardrobes | 377674603 | /walk-in-wardrobes-dev-w2d6 |
| /office-fit-out-peterborough | 377674703 | /office-fit-out-dev-o8c4 |
| /cabinet-makers-peterborough | 377674803 | /bespoke-joinery-dev-j4c9 |
| /alcove-units | 377674903 | /alcove-units-dev-a6c1 |

Existing live pages given links to them (only the `.rel` related-links line changed in each block, then published):
wardrobes 73280437, bedrooms 73297487, storage 73372439, hallways 73340083, office 73279381, media walls 73279037.
Search Console: sitemap.xml resubmitted 11 Nov (read the same day, 45 pages). Indexing requests: daily quota used on 11 Nov,
so request the 7 addresses from 12 Nov. Rollback for a page: tick "Hide from search engines" and unpublish that page only.

## Town pages: own copy for each town (11 Nov 2026)
Why: the 10 template town pages shared about half their text word for word (intro, How it works, booking text, "Serving"
text, 4 of 5 FAQs). Near-identical location pages are what Google's scaled-content policy targets. Each now has copy written
from its own local facts in `towns/<slug>.json`, applied by `towns/towns_apply.js` (`abjTownCopy(code, data)`), which only
touches those 5 sections plus the FAQPage schema and checks nothing else in the block changed. The headline-size intro line
was also cut to one sentence (it had grown to ~80 words). Extra "10-year guarantee" mentions were left out of the new copy
until the T&Cs question is settled (the facts strip still shows it). Shared text across town pages: ~49% -> 10-21%.
Backups: the old block code of each live town page is in Chrome's IndexedDB on tilda.cc (database `abj_town_bak`, key
`p<pageid>`); to roll back a page, save that code back into its block and publish. Stamford DEV (354171303) has the same copy.
New service-page descriptions were rewritten by hand the same day (golive_new7.json, commit 8a2a01c).

## Guarantee wording (11 Nov 2026)
Ish confirmed ABJ's own guarantee is 12 months (T&Cs 8.1); longer warranties on doors, cabinets and fittings are the
manufacturers' and depend on what the customer chooses (T&Cs 8.2). Every live page's block, page settings (title,
descriptions, social text) and head code were changed with `guarantee.js` (`abjG.fix`), then each page was published on its
own: 36 pages (home, all service pages, FAQ, about, booking, offers, upholstery, bathroom, 12 town pages, 7 new pages).
Badges now read "12-month guarantee"; FAQ answers say longer manufacturer warranties can apply depending on what you choose.
Live sweep of 53 addresses afterwards: no "10-year" left except the T&Cs manufacturer list, finance terms (3-10 years) and
"handles that still look right in ten years". The repo sources (pages/, out/, out-live/, services_data.py, towns/) match.
Not on the website: check Google Business Profile, social bios and any ads for "10-year guarantee".

## Service pages and last stock phrases (11 Nov 2026)
The 18 service pages shared the same "How it works" steps, intro line and booking heading/text word for word. Each now has
its own (`svccopy/<slug>.json`, applied with `svccopy/svc_apply.js`; `services_data.py` carries the same per-page steps,
proc_p, book_h and book_p so a rebuild matches). Pages with their own booking text already (worktops, HMO, sloping,
under-stairs, office fit-out) only had the steps changed. Old block code: Chrome IndexedDB `abj_svc_bak` on tilda.cc.
`tidy.js` then removed the last stock phrases (About "The ABJ journey" -> "Our story", Cambridge "Your journey" -> "How it
works", case studies "Ready to transform your home?" -> "Planning something similar?") and the dash in each town hero line.
Final sweep of 45 live pages: all 200, one H1 each, valid schema, no stock phrases, no "10-year"; repeated text 0-12% a page.

## Visual review fixes (11 Nov 2026)
From an independent visual review, agreed with Ish. `fixes_1111.js` (abjFix.projects / gallery / booking / ihTop):
- "Projects" in the header and menu now opens /gallery on every live page (46 pages); the footer's old Projects link is now
  "Case study" (still Kings Road). build.py NAV/MENU/footer match. Blog articles take their header from out-live/post-chrome.html
  via the site HEAD pin, moved from 113f662 to 87f5b2d (same length; HEAD still 65,486 chars), and /abjfeeds republished.
- Gallery: photos now mixed round-robin by room type (the first screen was 16 kitchens); the bordered photo with the old
  "Made by" watermark is last among the kitchens. gallery.py does the same.
- Booking page: the postcode result line had picked up the white product-card style (#kc .pc) and showed as an empty 80px white
  box; now hidden until there is a result, then plain small text. theme.css fixed too.
- Gallery, FAQ, offers, finance, products, blog list: the old site head's .kd-first rule (padding-top:48px !important, desktop)
  pushed the intro label under the fixed header. Override added in each block and theme.css.
Homepage (`homefix.js`, abjHome): featured project moved straight after the four main rooms, "Everywhere else in your home"
after it, and a slightly darker fade behind the hero text (video and wording unchanged). Done and checked on the test homepage
(350369803, desktop + 390 px). Live homepage published 11 Nov ~11:44 after Ish's OK (old block code in Chrome IndexedDB `abj_home_bak`, key
`home-20261111`). Site HEAD: the last two "10-year guarantee" texts (a commented-out twitter tag and the old mobile-menu
note) changed to 12-month (HEAD now 65,500 bytes of 65,535); pages pick this up on their next publish (home republished).

## Visual review 2: phone menu and homepage on phones (11 Nov 2026)
- Phone menu: "Projects" moved from 11th to 5th (after Media walls) on all 46 live pages (`fixes_1111b.js` abjMenu,
  `run_menu.js`), numbers, animation delays and hover photos renumbered; site HEAD pin moved to b44b379 for blog articles.
- Homepage on phones only (max-width 760px, `abjHomeMobile`): stronger bottom fade behind the hero text, the small label above
  the headline hidden (it repeated "Peterborough"), headline 32px. Checked on the test homepage, approved by Ish, live
  homepage (block 5657646303) published 11 Nov ~12:31. Old block code in IndexedDB `abj_home_bak`, key `home-20261111-mobile`.
  Desktop unchanged (checked: label shown, headline 73px, side fade). out-live/home.html matches.
- Phone hero re-cuts (`phoneclips.js`, files on branch web-media-o @ ba414cd; stills approved by Ish 11 Nov):
  - Kitchens (live, block 5657531303, published ~13:03): phone clip 2 is now the sage drinks cabinet opening (IMG_5758
    73.2-79.6s, half speed, vidstab) instead of the dining room/sunburst light; phone caption via `data-capm`, phone poster via
    `data-mp`. Desktop clip, poster and caption unchanged. Old block in IndexedDB `abj_svc_bak`, key `kitchens-phoneclips-20261111`.
  - Homepage: phone montage ends on a fitted wardrobe wall (n05 3.6-6.9s) instead of the Hisense wine-fridge logo and worktop
    corner; phone caption list via `data-capsm`. Live homepage published 11 Nov ~13:10 after Ish's OK (old block in `abj_home_bak`, key `home-20261111-phoneclip`).
  - Other pages' phone clips checked: all show furniture. Worktops clip A ends on the dining table/sunburst light (offered a re-cut).

## Site scan fixes (11 Nov 2026, afternoon)
- Text: meta descriptions trimmed under 985px (Kitchens, Oakham, Office fit-out; Office and Oakham head-code schema text matched),
  Office fit-out H1 "Office fit-outs &amp; refurbishment, made in our Peterborough workshop", first H2 "What we fit in offices".
- Images: the 53 jsDelivr images over 100 kB re-encoded under 100 kB (Pillow WebP method 6; long side capped at 1800; scaled
  only where needed, never below the size shown on the page; PSNR at display size median 44 dB, lowest 36 dB). Files on
  branch web-media-p @ f58f336 (media/l/<source commit>-<name>). `lighten.js` (abjLight) swaps the URLs; `run_light.js`
  (abjRunLight) saved and published all 46 live pages one at a time (~300 links). Site HEAD post-skin pin moved
  b44b379 -> 3a321ec (post-chrome menu images), /abjfeeds republished. Rescan: 0 jsDelivr images over 100 kB, 0 broken.
- Still flagged: 44 Tilda-hosted images (36 town landmark photos, gallery thumbnails, a few on the new pages). Waiting for
  Ish's decision (browser re-encode + Tilda upload, before/after sheet first).
- Tilda-hosted images (afternoon, Ish approved "go live"): 53 phone-sized copies made in the browser and uploaded with
  Tilda's own uploader (`tilda_imgs.js`, abjTI; map in Chrome IndexedDB `abj_ti` key `map` on tilda.cc - localStorage there
  is full). Applied to 19 live pages (12 towns, gallery, worktops, sloping, under-stairs, sliding, walk-in, cabinet makers):
  town photos 2/3 and new-page cards keep the original in srcset (browser uses the copy only when sharp enough);
  six town heroes (Deeping, Huntingdon, Ely, St Ives, Wisbech, Cambridge) use <picture style="display:contents"> with a
  phone crop at full detail for <=480px; gallery thumbnails swapped to WebP copies. The six heavy heroes (Stamford, Bourne,
  Spalding, Grantham, Oakham, Oundle) left as they are (Ish's choice). Rescan: 98% of 298 images under 100 kB, the only
  ones over are those six, no JPG/PNG warnings, 0 broken. An earlier run's 53 uploads are unused duplicates in the Tilda
  image library (map lost to full localStorage).
  NOTE: out-live/ for the gallery and the town blocks does NOT include these swaps - always transform the live block.

## Seobility follow-ups (11 Nov 2026, ~15:40, Ish asked for all four)
`site_polish.js` (abjPolish) on 44 live pages + blog chrome (HEAD pin 3a321ec -> 38e6be3, /abjfeeds republished):
- No page shows the same photo twice: each phone-menu hover photo swapped page by page for a same-room photo not on that page
  (Hallways/Bathrooms now show hallway/bathroom photos); the booking-section photo on Wardrobes and Media walls no longer
  repeats a style card.
- Footer titles (Rooms, More, ABJ, Visit, Areas we cover) are <div class="fh">, styled and accordion-wired exactly as before.
- Doubled link wording varied: menu "Arrange a free design visit" / "WhatsApp us"; footer CTA "Request a free design visit";
  footer links "Bespoke kitchens/wardrobes/bedrooms", "Media wall units", "Storage & pantries", "Home office furniture",
  "Project gallery", "Finance options"; cookie banner "How we use your data". Left alone: logo, phone number, town names.
- Homepage (live 11 Nov ~15:55 after Ish's OK; old block in abj_home_bak 'home-20261111-before-polish'): the same, plus hero facts <b> -> span.fk (same look; "2,500+"
  bold once), body CTA "Start with a design visit", "bespoke media walls". Test homepage block was replaced with the live
  block + these changes (old test block in IndexedDB abj_home_bak 'homedev-20261111-before-polish').
Check: 0 repeated photos on 44 pages, 0 footer H4s, 0 broken images. PageSpeed (Ish): 98/100/100/100 mobile and desktop.

## Kitchen cost guide (11 Nov 2026, DEV only)
`calc/kitchen_calc.html` (self-contained section, scoped CSS + JS) inserted before "How it works" with `calc/insert.js`.
DEV Kitchens (352648603, rec 5644015603) was first replaced with the current LIVE Kitchens block (so the preview is exact);
old DEV block in IndexedDB abj_svc_bak 'kitchens-dev-before-calc-20261111'. Four picks (size / style / worktop / extras)
plus a plain-English box that reads a description and sets the picks (runs in the browser; no AI service, no cost).
Prices in the P object are Claude's rough placeholders anchored to the site's "from around £5,000" - NOT approved:
Ish/Alex must confirm before it goes live. GA event 'kitchen_cost_guide' fires only after cookie consent.
- 11 Nov evening, Ish's idea: describe-first flow. The section opens with just the description box ("Show my guide price",
  Enter, three tappable examples, "or choose the options yourself"); the price and pre-set options appear after. On phones and
  tablets the price card sits straight under the description and the options follow. DEV updated (calc @ ed2058c).
- 11 Nov ~20:20: prices recalibrated against Checkatrade 2026 (avg new kitchen ~£10.5k; quartz fitted £200-550/m2) and the
  site's own "from around £5,000" and £8k/£12k offer tiers: worktop and appliance extras lowered, breakfast bar added
  (£1.2k-2.4k). More everyday phrases understood ("decent sized", "family", "breakfast bar", "massive"...). Desktop stage 2
  fits one screen (tested 1280x720 to 1920x911); on reveal the section lines up under the header. insert.js now replaces any
  version. DEV @ 34f775f.
- 11 Nov: bespoke recalibration (base compact 5–8k, medium 8.5–13.5k, large 13–20k, statement 19–30k; Shaker x1.1; island 3–5.5k; larder 1.5–2.8k) and "made to measure in our own workshop, not off the shelf" wording. DEV @ af0dd6c. Still needs Alex/surveyor to check the ranges before LIVE.

## Cost guides on 7 DEV service pages (11 Nov 2026)
One template, `calc/build_calc.py` (CSS `calc/calc.css.part`, engine `calc/calc_engine.js.part`), builds
`calc/<key>_calc.html` for kitchen, wardrobe, bedroom, mediawall, sloping, sliding and walkin. Edit prices in SERVICES, run
`python3 build_calc.py`, then insert before "How it works" on the DEV block (same as `abjCalcInsert`).
Prices are calibrated from Alex's real quotes (Nov 2026): every real quote tested lands inside the range shown
(kitchens 8 quotes, wardrobes 3, sliding 1, walk-in 1, sloping 1, media walls 4). Model = cabinets by size x finish factor
+ worktops (kitchens) + extras + delivery & fitting, matching how Alex lays out a quote.
Estimates with no quote behind them yet: kitchen solid-wood worktops and in-frame (x1.35), kitchen island, walk-in dressing
island, bedroom bedside pair and headboard wall, wardrobe drawer unit.
DEV pages = current LIVE block + guide (commit 758b23a): kitchens 352648603/5644015603, wardrobes 352674603/5644232003,
bedrooms 352674703/5644237603, media walls 352685103/5644238303, sloping 377339703/5698354303, sliding 377441303/5698620103,
walk-in 377441403/5698620803. Old DEV block codes: IndexedDB `abj_svc_bak` keys `<page>-dev-before-calc-20261111`;
live codes used: `live-<livepageid>-20261111`. Checked on the published DEV pages at 1920x911: guide works, fits one window, noindex.
VAT: Ish confirmed (11 Nov) Alex's grand totals include VAT, so the small print says "Prices include VAT" (DEV @ 3315235).
Open before LIVE: the Kitchens page says "from £5,000"
but real fitted compact kitchens come out at about £2,350-£4,000; Alex/surveyor to approve the ranges.
- 11 Nov (later): 8 more guides on DEV (@f3a93e4), worked out from the same per-metre rates in Alex's quotes (no direct quote
  for these yet): alcoves 377446503/5698633203, under-stairs 377438103/5698610503, storage 352693303/5644302703,
  home office 352693703/5644307403, hallways 352714403/5644309203, bathroom 352714503/5644313603,
  worktops 352693403/5644290603 (kitchen worktop figures), feature walls 352693503/5644298303. Small print says "worked out from
  our recent quotes". Not built: office fit-out, HMO, upholstery, cabinet makers (priced per project / no data).
  LIVE recs for go-live: kitchens 73297273/5657531303, wardrobes 73280437/5657532803, bedrooms 73297487/5657534703,
  media 73279037/5657536503, sloping 377674203/5699149203, sliding 377674503/5699150703, walk-in 377674603/5699151403,
  alcoves 377674903/5699153503, under-stairs 377674303/5699149903, storage 73372439/5657540503, office 73279381/5657545803,
  hallways 73340083/5657547203, bathroom 152105513/5657550603, worktops 73545333/5657537203, decors 73195791/5657538603.
- 11 Nov 21:00-ish: ALL 15 guides LIVE (Ish: "yes please go for it"), calc files @f3a93e4, inserted before "How it works"
  in each live block, each page published on its own. Backups: IndexedDB `abj_svc_bak` key `live-<pageid>-before-guide-20261111`
  (Kitchens HEAD: `head-73297273-before-guide-20261111`). Checked every live URL at 1920x911: one guide, price works, fits one
  window, indexable, canonical correct, one H1, no DEV links.
  Kitchens FAQ (visible + FAQPage schema in the page HEAD) changed from "typically start from £5,000" to "A compact bespoke
  kitchen, made and fitted, starts from around £2,500, and a typical medium kitchen with quartz worktops comes to around
  £7,000 to £9,500..." so it matches the guide (Ish left the choice to me). Still saying "from around £5,000": homepage FAQ
  schema, handleless and Kings Road case studies. Rollback for a page: save the backup code into its block, publish that page.

## New gap pages (12 Nov 2026) - on Tilda DEV (private, noindex), not live
From the AI-search gap analysis. Source: `new_pages_data.py` + `gen_new.py` (6 service pages), `towns/new_towns.py` (3 town pages), then `build.py`.
DEV-ready block code is in `out-new/<slug>.html` (abjLight + abjMenuImgs + abjBkDedupe + abjFootFh applied; no photo repeats on any page, logo excepted).
`abjAnchors` (link-text rewording) is NOT applied yet: it expects live URLs, so run the full `abjPolish` after the linkmap swap at go-live.
| slug | DEV url | planned live url |
|---|---|---|
| kitchen-design | /kitchen-design-peterborough-dev-d4k8 | /kitchen-design-peterborough |
| kitchen-cabinets | /kitchen-cabinets-peterborough-dev-c5u2 | /kitchen-cabinets-peterborough |
| supply-only | /supply-only-kitchens-dev-s7q3 | /supply-only-kitchens-peterborough |
| utility-boot | /utility-boot-rooms-dev-u3b9 | /utility-boot-rooms-peterborough |
| showroom | /kitchen-showroom-peterborough-dev-r8m4 | /kitchen-showroom-peterborough |
| bespoke-vs | /bespoke-vs-off-the-shelf-kitchens-dev-v6g2 | /bespoke-vs-off-the-shelf-kitchens |
| st-neots | /fitted-kitchens-bedrooms-st-neots-dev-n3s7 | /fitted-kitchens-bedrooms-st-neots |
| corby | /fitted-kitchens-bedrooms-corby-dev-c9r2 | /fitted-kitchens-bedrooms-corby |
| kettering | /fitted-kitchens-bedrooms-kettering-dev-k4t6 | /fitted-kitchens-bedrooms-kettering |
On Tilda DEV 12 Nov: each page is a duplicate of Sloping-Ceiling Wardrobes DEV (377339703) with the block code replaced (old blocks stay off),
settings from `gap9_settings.json` (noindex on, canonical to the nearest live page), HEAD = preview-links script only.
Tilda page / block: kitchen-design 381329803/5747229203, kitchen-cabinets 381331203/5747233003, supply-only 381331303/5747233703,
utility-boot 381331403/5747234503, showroom 381331503/5747235203, bespoke-vs 381331603/5747235903, st-neots 381331703/5747236703,
corby 381331803/5747237403, kettering 381331903/5747238103. Checked: noindex, 1 H1, 0 broken images, 0 repeated photos, 0 bad links,
no sideways scroll at 1440 and 390 px. Copy pass for natural wording (claims we can't back up removed). Hero photos 1600px except
utility (1080 square) and showroom (1200) - replace if bigger originals turn up.
Still to do: town landmark photos later; add to linkmap.json and link from existing pages at go-live (needs Ish's approval). Showroom opening hours not given yet - copy says "during our opening hours, call before you travel".
- 12 Nov (later): Ish's desktop review. `desktop_compact.css` (added by `polish_gap.js`) on the 9 gap pages: booking buttons on one line
  from 1101px, footer fits one screen (618px at 1536x695, was 1017; tablets 950, was 1388), menu button and legal links get bigger
  tap areas on phones. Kitchen design booking photo was a 3D render, now a real kitchen; booking photos at 1600px, cards at 1200px.
  The same footer height and wrapping buttons are on every other new-design page (live and DEV) - roll out only with Ish's approval.

## 9 gap pages LIVE (12 Nov 2026, Ish approved)
Each live page is a duplicate of its DEV page (DEV pages stay private/noindex). Block = `out-live/<slug>.html` from `golive_gap.js`
(linkmap + abjAnchors + abjSeoFix) + the two site-footer scripts copied from the sloping-wardrobes live block. Settings from
`gap9_settings.json` live.settings (index on, canonical to itself, social image), HEAD = breadcrumb + twitter tags.
| Live address | Tilda page / block |
|---|---|
| /kitchen-design-peterborough | 381512303 / 5751775203 |
| /kitchen-cabinets-peterborough | 381512403 / 5751776003 |
| /supply-only-kitchens-peterborough | 381512503 / 5751776703 |
| /utility-boot-rooms-peterborough | 381512603 / 5751777403 |
| /kitchen-showroom-peterborough | 381512703 / 5751778103 |
| /bespoke-vs-off-the-shelf-kitchens | 381512803 / 5751778803 |
| /fitted-kitchens-bedrooms-st-neots | 381512903 / 5751779503 |
| /fitted-kitchens-bedrooms-corby | 381513003 / 5751780203 |
| /fitted-kitchens-bedrooms-kettering | 381513103 / 5751780903 |
Checked live: 200, index allowed, canonical correct, 1 H1, no DEV links, footer scripts present, 0 broken images, 0 repeated photos,
all internal links 200, booking buttons on one line, footer 618px at 1536x695, no sideways scroll at 390px. sitemap.xml lists all 9.
Search Console (URL-prefix property): sitemap.xml resubmitted, indexing requested for all 9. The 10 pages from the 11 Nov list
(sloping, under-stairs, sliding, walk-in, office fit-out, cabinet makers, alcove, Stamford, Huntingdon, Ely) are already indexed.
Not yet done: links to the new pages from existing pages (nav/footer/areas) - needs Ish's go-ahead; town landmark photos.

## Internal links + landmarks (12 Nov 2026, Ish approved)
- `tilda_links.js` run on every page with a switched-on new-design block (live and DEV, one page at a time, published singly):
  footer "Areas we cover" + St Neots, Corby, Kettering; Rooms + "Kitchen design"; More + "Utility & boot rooms"; Visit
  "Showroom & workshop" now links to the showroom page; kitchens page "In detail" row + kitchen design, cabinets, supply-only,
  bespoke-vs, showroom; storage and hallways rows + utility & boot rooms. Homepage done on the test page first, checked, then live.
  Old block code per page: IndexedDB abj_svc_bak '<pageid>-before-links-20261112'. build.py footer updated to match.
- Landmarks (abjLandmarks, `landmarks.json`): St Neots (Market Square, St Mary's Church, Riverside Park), Corby (Kirby Hall,
  Rockingham Castle, Corby Cube), Kettering (Market Place, Boughton House, Wicksteed Park); Wikimedia Commons, credited with
  author + licence. Hero 1680px, section photos 1100px, webp q0.8, uploaded with Tilda's uploader. On DEV and live.
  Note: out-live/<town>.html in the repo is the pre-landmark version; the Tilda blocks are the current ones.
- 12 Nov: showroom page (DEV 381331503 + live 381512703) now shows the Google Business Profile hours: Mon-Fri 8am-6pm, Sat 10am-2pm, Sun closed (booking text + 'Do I need an appointment?' FAQ and its schema).

## Missing-search batch 2 (12 Nov 2026, Ish: "please action")
- Live pages, extra "In detail" sections (`tilda_content.js`, backups IndexedDB '<page>-before-content-20261112'): kitchens
  (renovating, islands with seating, extensions/open-plan), media walls (TV wall units/cabinets/TV unit with fireplace, home bars),
  alcoves (bookcases/library walls, window seats), bedrooms (children's/teens), sliding wardrobes (replacement doors), near-me
  (wardrobes + media walls, Peterborough areas incl. Orton/Werrington/Bretton/Stanground/Yaxley/Thorney/Ramsey/Crowland/Holbeach,
  new builds in Hampton/Cardea/Great Haddon). Grantham now names Sleaford; Oakham already named Uppingham.
- Prices: homepage (test page first, then live), both case studies (live + DEV) and the 11 older live town pages now say
  "compact from around £2,500, typical medium with quartz £7,000-£9,500". DEV town pages still carry their older wording.
- New DEV pages (private, noindex; not live): Shaker & in-frame 381697803 /shaker-kitchens-peterborough-dev-s4h8,
  handleless 381698003 /handleless-kitchens-peterborough-dev-h5d2, Fenland 381698103 /fitted-kitchens-bedrooms-fenland-dev-f8m3,
  King's Lynn 381698203 /fitted-kitchens-bedrooms-kings-lynn-dev-k2l7 (landmarks added). Settings: gap5_settings.json; linkmap updated.
  Style pages use real photos only (gallery has some 3D renders: navy-sha, white-sh, grey-sha - avoid them).
- Listings + review pack: Claude Doc https://claude.ai/artifact/CCMGVGPJvmpv5XmzD93Ucs (accounts must be created by Ish).

## 4 more pages LIVE (12 Nov 2026, Ish approved: "go live on the four pages")
| Live address | Tilda page / block |
|---|---|
| /shaker-kitchens-peterborough | 381737303 / 5752262103 |
| /handleless-kitchens-peterborough | 381737403 / 5752262803 |
| /fitted-kitchens-bedrooms-march-whittlesey-chatteris | 381737503 / 5752263503 (+ landmarks) |
| /fitted-kitchens-bedrooms-kings-lynn | 381738003 / 5752264203 (+ landmarks) |
Same method as the 9 (golive_gap.js, gap5_settings.json, footer scripts copied from a live block). Checked live: index on,
canonical, 1 H1, no DEV links, footer scripts, 0 broken/repeated photos, links 200, buttons one line, footer 618px, no phone scroll.
Sitemap resubmitted (54 pages). Indexing requested: Shaker, handleless, Fenland; King's Lynn hit the daily quota (follow-up 13 Nov).
`tilda_links2.js` on every page: footer areas + "March & Whittlesey", "King's Lynn"; kitchens page row + Shaker / handleless.
Backups: IndexedDB '<page>-before-links2-20261112'. Homepage test page first.
- 12 Nov 13:25: homepage footer compacted on LIVE (Ish: "put the homepage footer live immediately", no test page this time).
  `desktop_compact.css` @129c015 inserted before the first `</style>` of live home block 5657646303 (page 30601906), insert only.
  Footer 944px -> 616px at 1536x639 (656px at 1280); areas one line; booking buttons one row on desktop; no sideways scroll at
  390/900/1280. Old block code: IndexedDB abj_svc_bak 'home-30601906-before-footer-20261112'. Home test page not yet updated.
- 12 Nov 13:40: homepage DEV only (350369803 / 5643988903), Ish's desktop screenshots: `home_desktop_fit.css` + intro photo
  (figure.ix, kc-kr-detail, caption "Made in our Peterborough workshop", desktop only, hidden under 1101px) in the empty left
  column; workshop section 808 -> 635px and booking 796 -> 653px at 1904 wide (buttons one row). Phone unchanged.
  Backup 'homedev-350369803-before-fit-20261112'. Waiting for Ish to check before live.
- 12 Nov 14:40: Ish: workshop section "still not fitting" (his Chrome is 1707x~775 CSS px at 112.5% scaling, and he counts the
  4 steps row as part of it). Whole workshop section (photo block + steps) now 696px at 1707x775, 718 at 1904x877, 662 at
  1536x695, 643 at 1280x720: stats in one row of 4, smaller headline/stats, tighter padding, compact steps. DEV only.
- 12 Nov 14:50: featured project section (fp) fits one screen on DEV: 1138 -> 694px at 1707x775 (711 at 1904x877, 660 at
  1536x695, 612 at 1280x720). Tighter padding, big photo matches the text height, smaller headline/list, small photos 2:1.
  Remaining over 775px at 1707x775: "Rooms made around you" 857, long "In detail" text 956.
- 12 Nov 14:55: Ish disliked the 2:1 crop of the two small featured-project photos. Back to full squares (original crop); their size now follows the screen height (225px at 1707x775, 327 at 1904x877, 170 at 1536x695) so the section still fits one window.
- 12 Nov 15:05: featured project photos open in a viewer on DEV (fp_lightbox.html @a707867, inserted at the end of the fp section): click/Enter opens, arrows + keys move 1-3, Esc / x / background close, focus returns, page scroll locked while open; phone: close top-right, arrows at the bottom. Tested by real clicks at 1536 and in a 390px frame; no console errors. Backup 'homedev-350369803-before-lightbox-20261112'.
- 12 Nov 15:00: LIVE homepage (30601906 / 5657646303), Ish: "that's perfect, please make live". Same three inserts as DEV @bf21f41 (intro photo, home_desktop_fit.css, fp_lightbox.html); insert only (+7,264 chars, matches expected). Checked live at 1707x775, 1904x877, 1536x695, 1280x720, 390: same heights as DEV, 1 H1, footer scripts present, viewer tested by real clicks, no console errors. Backup 'home-30601906-before-homefit-20261112'.
- 12 Nov 17:10: DEV only: 'Rooms made around you' panels fit one screen (panel height follows screen height): 857 -> 731px at 1707x775, 942 -> 838 at 1904x877, 777 -> 636 at 1536x695. Hover-to-open panels unchanged; 'Everywhere else' section and phone untouched. Backup 'homedev-350369803-before-rooms-20261112'. Waiting for Ish before live.
- 12 Nov 17:15: LIVE homepage: room panels rule (Ish: "sublime, please make live"), insert only (+387). Live matches DEV at all five sizes; hover panels checked; 1 H1. Backup 'home-30601906-before-rooms-20261112'.

## AI files + structure check (12 Nov 2026, Ish: "sort the whole lot out")
- Audit of all 58 live pages: 1 H1 each, titles/descriptions in range, canonical correct, no noindex, main/nav landmarks,
  schema on every page (LocalBusiness 58, Service 55, FAQPage 46, BreadcrumbList 44), robots.txt open, sitemap 58 pages.
- llms.txt / llms-full.txt (Tilda: Site Settings > SEO > Manage llms.txt, /projects/llms-txt/?projectid=6121364) rewritten:
  removed "established 2006", "10-year guarantee", "from £5,000"; now 2017 incorporation + ~20 years' team experience,
  12-month guarantee, £2,500 / £7,000-£9,500 price guide, finance £6,000 + 50% deposit, all 58 pages + 8 guides (67 links,
  all 200). Source: web/concept/llms/. Old text: tilda.cc IndexedDB abj_svc_bak 'llms-before-20261112'.
- Photo viewer placeholder <img alt=""> -> alt="Enlarged project photo" (script still sets the real alt on open) on /gallery,
  both case studies and their DEV copies. Re-crawl: 0 images without alt on 58 pages. Backups '<pageid>-before-lbalt-20261112'.
- Cloudflare AI Crawl Control: no crawler blocked (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Googlebot etc. all allowed),
  Bot fight mode off, AI Labyrinth off. No change made. 4xx seen by crawlers are mostly hack probes (.env etc.) and old
  URLs that now 404 (/soham-abj, old /tpost/... posts, /shop/..., /sitemap_index.xml) - redirect candidates.
- 12 Nov 18:10 (Ish: "action the lot"): Tilda 301s (Site Settings > SEO > 301 Redirects) 214 -> 234: +30 new (soham, stilton,
  near-me-kettering/spalding, bespoke-sofas, blog, news, testhomepage, sitemap_index/sitemap-index.xml, 20 old
  bespoke-<service>-<village> pages -> matching service page), 27 retargeted to the new pages (Corby, Kettering incl.
  Wellingborough/Market Harborough/Northampton, St Neots, March-Whittlesey-Chatteris, classic/traditional -> Shaker,
  modern/contemporary -> handleless), 10 dormant '/fitted-kitchens-bedrooms-<town> > /bespoke-kitchens' removed.
  Old list: tilda.cc IndexedDB abj_svc_bak 'redirects301-before-20261112'. Tilda cannot redirect /tpost/ addresses.
- Cloudflare Single Redirects (8 of 10 used): the 6 old-post rules now also match /tpost/<id> (not only /abjfeeds/tpost/<id>);
  new 'Old blog posts (/tpost/) -> Design Journal' (https://*abjkitchensandbedrooms.co.uk/tpost/* -> /abjfeeds, last);
  new '/calculatorcutlist*' -> https://www.cutandedgexpress.com/cutting-list-peterborough/. Dashboard API writes are blocked
  (403) - edits done in the dashboard form. Tested: all 10 /tpost/ cases + cutting list OK, live posts unaffected,
  all 15 town pages 200. New Tilda entries still propagating across Tilda servers at 18:10 (215/228 tries OK).
- 12 Nov 19:07 recheck: all 30 new Tilda redirects OK on every try (150/150), no re-save needed.

## Health score + Screaming Frog clean-up (12 Nov 2026 evening, Ish: "score needs to be back to high 90")
- Site health checker (/abj-site-health-x7k2q9, page 347729303, block rec5305637903) upgraded, insert/replace only
  (health_extra_chunk.js + sitehealth/health_patch*.json, applied @4cc21df and @7d58e7f). Old code: tilda.cc IndexedDB
  abj_svc_bak '347729303-5305637903-before-checks-20261112'.
  New area "Business facts & AI search": out-of-date facts (2006, 10-year guarantee, from £5,000; maker warranties ignored),
  schema facts (phone, PE1 2AZ, 2017, hours), unexpected tel/WhatsApp/email links (Ideal4Finance 020 3617 4647 allowed),
  NAP and booking/tap-to-call present (blog posts count the post-skin footer), tracking markers vs homepage (lead hand-off
  only where a form exists), FAQ schema questions visible, llms.txt / llms-full.txt present, complete and current, robots.txt
  AI crawler blocks, US spellings. New SEO checks: 46 old addresses still redirect, DEV links/canonicals, placeholders,
  orphan and >3-click pages, near-duplicate text (5-word shingles, 50%+), footer gaps vs homepage, www/http internal links,
  skipped heading levels, unlabelled fields/buttons/embeds (GTM noscript ignored), duplicate X card title/description,
  second-H2 duplicates. Images: same photo twice on a page, share images over 300 kB. Accuracy: phone load time is now the
  page's own load time (the old figure included a fixed 2.5 s wait), and a photo that didn't load in the phone check is only
  reported if it also fails 3 fresh requests.
- Fixes from the first run of the new checks:
  - /fitted-kitchens-bedrooms-oakham FAQ schema (page HEAD) said "from around £5,000": now matches the visible answer
    (£2,500 / £7,000-£9,500). Backup '204575403-head-before-pricefix-20261112'.
  - Blog "What happens at a free kitchen design survey": same old price sentence corrected in the Feeds editor (the editor
    ignores scripted typing; the save request was rewritten in flight, then checked live).
  - /bespoke-wardrobes FAQ schema finance answer now gives the real terms (£6,000+, 50% deposit, Ideal4Finance);
    visible FAQ item added to match (see below). Backup '73280437-head-before-faqfin-20261112'.
  - /abjfeeds page HEAD: its twitter:title/description wrapped in an HTML comment (not deleted) because all 8 blog posts
    inherited them (Screaming Frog "duplicate X title/description"); X now uses each post's own og tags.
    Backup '72969701-head-before-xcard-20261112'.
  - Site HEAD twitter:image (Pembridge webp, 114 kB) -> 1200x630 JPG copy, 90 kB (og-Pembridge-Ki.jpg). Backup
    'sitehead-before-ximg-20261112'. Site HEAD now 65,494 bytes.
  - Share images: 18 og:image files over 100 kB (up to 1.15 MB) -> 1200x630 JPG copies under 100 kB (og_fix.js @ddb5db6),
    set in Page settings > Facebook (fb_img) on 30 pages. Previous fb_img values (where set) are in the run log; page
    thumbnails untouched.
  - Orphan: /kitchen-design-peterborough now links to the design-survey article ("For a step-by-step account of the day...").
    Backup '381512303-5751775203-before-guidelink-20261112'.
  - /bespoke-wardrobes: visible FAQ item "Do you offer finance for fitted wardrobes?" added (same text as the schema).
    Backup '73280437-5657532803-before-faqfin-20261112'.
  - /gallery: the two case-study cards used the same photos as the gallery grid; now other photos from the same projects
    (Kings Road island hob, handleless waterfall island + gold pendant), same 1067x1600 size, new alt text.
    Backup '74160025-5657569603-before-cardphotos-20261112'.
- abjImgFix full run (12 Nov ~19:30-20:30): 57 live pages, no errors; pages with changes saved + published one by one.
- 20:33-20:36: all 58 live pages republished one at a time (site HEAD X image, fb_img and /abjfeeds head changes go out).
  Checked live: og:image = new JPG copies, 0 <img> without width/height except the photo viewer's empty placeholder,
  blog posts have no twitter:title (X falls back to og), phone-free desktop check of supply-only page: 0 broken/stretched.
- 20:41-20:46 full health check (all 5 areas incl. phone layout, 66 URLs): **99/100** (was 56 earlier this evening with the new
  checks, 71 in Ish's run). Only item left: 4 homepage room-panel video posters (1656-1920px) shown at 219px on phones
  (Low). Homepage rule = DEV first, so left for Ish to OK. Images under 100 kB: 100% of 339; phone-friendly 100%.
  Normal/Tilda only: several H2s per page, external links in the footer, Tilda's blog back-button with no text.

## AI search test (12 Nov 2026, 22:00) + Crawler Hints
- Cloudflare Caching > Configuration > Crawler Hints switched ON (flags: crawlhints_enabled true). Sends IndexNow pings to
  Bing/Yandex etc. when cached pages change.
- 12 prompts run in ChatGPT (temporary chat, Unpersonalized) and Perplexity (signed out). Copilot needs a Microsoft sign-in;
  Gemini blocked page reading for the extension. ABJ 1st: media walls (both), wardrobes (both), sloping wardrobes (both),
  finance (Perplexity). ABJ 3rd-4th: best kitchen makers (ChatGPT 4/5), showroom (ChatGPT 3/8), cost (ChatGPT 3/4, Perplexity
  1st and quotes our price guide), finance (ChatGPT 4/4 + table). Missing: Stamford kitchens (both), Huntingdon wardrobes
  (both), Perplexity 'best kitchen makers' (Küchen Kraft only). Competitors named most: Martin Thompson Joinery, S&E United
  Joinery, Willowbrook, Acorn Joinery, Ultimate Kitchens, Hurford & Tebbutt, Fitzgeralds, Hammonds.
- Guarantee: both tools report "10-year manufacturer guarantee" next to 12 months. Sources: (1) the site's 404 page is the old
  /near-me-peterborough page (200 there, noindex, also served on every 404) and still says "10-year manufacturer guarantee"
  three times; (2) /terms-and-conditions lists maker warranties (10 yrs cabinets, 6 doors, lifetime Blum). (1) to fix when
  Tilda is signed in again (Chrome was signed out of Tilda 22:07); (2) is Alex's legal text - ask before changing.
- Health checker gap: its "10-year" rule skips text near "manufacturer", and it doesn't crawl the 404 page. To tighten.
