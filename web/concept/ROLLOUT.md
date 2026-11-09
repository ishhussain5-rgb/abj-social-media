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
| Upholstery | /upholstery-dev-u5h9 | 352693603 | rec5644317103 | live on DEV (photo hero; no video until there is footage from a home we may show) |
| HMO | /hmo-makeover-dev-m2x5 | 352714603 | rec5644319403 | live on DEV |
| Info, booking, area and legal pages | see plan doc | | | to do |

All room-page H1s now lead with the service and "Peterborough" (e.g. "Fitted wardrobes in Peterborough, built to make every inch count"). Page titles, descriptions, URLs and FAQs carried over from the old DEV pages.
Media for batch 2-3 pages: branch web-media-l (c9b6a43), plus images already on the Tilda CDN.
