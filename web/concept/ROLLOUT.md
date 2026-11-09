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
| Oakham, Cambridge | area pages | 354171903, 354172603 | | to do (bespoke layouts) |
| Case studies x2, Near me, Cut & edge | live only | | | to do (need DEV copies) |

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
