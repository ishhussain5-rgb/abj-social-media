import json, sys
S = json.load(open('schedule2.json'))
ids = {}
for f in ('ids.txt', 'ids2.txt'):
    for l in open(f):
        n, i = l.split(); ids[n] = i
for l in open('vids.txt'):
    n, i = l.split(); ids['abj_tt_' + n + '.mp4'] = i
link = lambda i: f"https://drive.google.com/file/d/{i}/view?usp=drivesdk"
def info(s):
    if s['kind'] == 'photo':
        media = [link(ids[f"abj_tt_{s['id']}_{k:02d}.jpg"]) for k in range(1, s['n'] + 1)]
    else:
        media = [link(ids[f"abj_tt_{s['id']}.mp4"])]
    d = {"autoPublish": True, "draft": False, "descendants": [], "firstCommentText": "", "hasNotReadNotes": False,
         "media": media, "mediaAltText": [], "providers": [{"network": "tiktok"}],
         "publicationDate": {"dateTime": s['date'], "timezone": "Europe/London"}, "shortener": False,
         "smartLinkData": {"ids": []}, "text": s['text'],
         "tiktokData": {"disableComment": False, "disableDuet": False, "disableStitch": False, "privacyOption": "PUBLIC_TO_EVERYONE",
                        "commercialContentThirdParty": False, "commercialContentOwnBrand": False, "title": s['title'],
                        "autoAddMusic": s['kind'] == 'photo', "photoCoverIndex": 0, "isAigc": False}}
    if s['kind'] == 'video': d["videoCoverMilliseconds"] = 1200
    return d
if __name__ == '__main__':
    for a in sys.argv[1:]:
        s = S[int(a)]
        try: print(s['date'] + '+00:00', s['id']); print(json.dumps(info(s), ensure_ascii=False))
        except KeyError as e: print('MISSING', s['id'], e)
