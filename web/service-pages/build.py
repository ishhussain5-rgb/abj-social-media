"""Bundle media.js + slim.js into abj-slim.js (served via jsDelivr). Media paths become absolute from the bundle's own URL."""
import os, subprocess
R = os.path.dirname(os.path.abspath(__file__))
# media lives on branches web-media-a / web-media-b (each under jsDelivr's 50 MB package limit),
# served from the exact commit of each branch (immutable URLs)
import json
MAP = {}
for g in ('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'):
    ref = f'origin/web-media-{g}'
    sha = subprocess.run(['git', 'rev-parse', ref], cwd=R, capture_output=True, text=True).stdout.strip()
    files = subprocess.run(['git', 'ls-tree', '--name-only', ref, 'media/'], cwd=os.path.join(R, '..', '..'), capture_output=True, text=True).stdout.split()
    for f in files:
        MAP[f.split('/')[-1]] = f'https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@{sha}/{f}'
pre = 'window.__ABJ_MEDIA_MAP=' + json.dumps(MAP, separators=(',', ':')) + ';\n'
fix = ("(function(){var MM=window.__ABJ_MEDIA_MAP||{},M=window.ABJ_SLIM_MEDIA||{},abs=function(u){return /^https?:/.test(u)?u:(MM[u]||u)};"
       "Object.keys(M).forEach(function(k){var m=M[k];['wide','tall'].forEach(function(t){(m[t]||[]).forEach(function(c){c.v=abs(c.v);if(c.p)c.p=abs(c.p)})});"
       "if(m.img)Object.keys(m.img).forEach(function(t){m.img[t]=abs(m.img[t])});if(m.film){m.film.v=abs(m.film.v);if(m.film.p)m.film.p=abs(m.film.p)}})})();\n")
out = pre + open(os.path.join(R, 'media.js')).read() + fix + open(os.path.join(R, 'slim.js')).read()
open(os.path.join(R, 'abj-slim-bundle.js'), 'w').write(out)
print('abj-slim-bundle.js', len(out), 'bytes')
