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

## Go-live checklist
- Every internal `-dev-xxxx` link must point at the live URL (e.g. /home-dev-r7m3k -> /, /bespoke-kitchens-dev-k7q2 -> /bespoke-kitchens,
  /bookingform-dev-k9b4 -> /bookingform, /abjfeeds-dev-b2f8 -> /abjfeeds). Do it in build.py and the patch helper, then republish.
- Live /near-me-peterborough (123982426) is also the site's 404 page (meta title "Page Not Found"). Decide: keep it as the 404, or
  make a separate new-design 404 page and point Site settings > 404 at it.
- Turn on the blog post skin (head snippet above).
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
