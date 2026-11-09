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
| Wardrobes | /bespoke-wardrobes-dev-w4m8 | 352674603 | | built |
| Bedrooms | /bespoke-bedrooms-dev-b3n6 | 352674703 | | built |
| Media walls | /media-walls-dev-m9t5 | 352685103 | | built |
| Worktops | /luxury-worktops-dev-t6p3 | 352693403 | | to do |
| Wall panelling | /decors-dev-d8r4 | 352693503 | | to do |
| Storage | /bespoke-storage-dev-s2k7 | 352693303 | | to do |
| Home offices | /office-renovations-dev-o3f7 | 352693703 | | to do |
| Hallways | /bespoke-hallways-dev-h4j8 | 352714403 | | to do |
| Bathroom cabinetry | /bathroom-cabinetry-dev-c6v2 | 352714503 | | to do |
| Upholstery | /upholstery-dev-u5h9 | 352693603 | | to do (drop clip B: Eye property) |
| HMO | /hmo-makeover-dev-m2x5 | 352714603 | | to do |
| Info, booking, area and legal pages | see plan doc | | | to do |
