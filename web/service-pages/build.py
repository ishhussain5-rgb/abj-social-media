"""Bundle media.js + slim.js into abj-slim.js (served via jsDelivr). Media paths become absolute from the bundle's own URL."""
import os, subprocess
R = os.path.dirname(os.path.abspath(__file__))
# media is served from the last commit that touched media/ (immutable URLs, no stale-cache surprises)
sha = subprocess.run(['git', 'log', '-1', '--format=%H', '--', 'media'], cwd=R, capture_output=True, text=True).stdout.strip()
base = f'https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@{sha}/web/service-pages/media/'
pre = f"window.__ABJ_MEDIA_BASE='{base}';\n" 
fix = ("(function(){var b=window.__ABJ_MEDIA_BASE||'',M=window.ABJ_SLIM_MEDIA||{},abs=function(u){return /^https?:/.test(u)?u:b+u};"
       "Object.keys(M).forEach(function(k){var m=M[k];['wide','tall'].forEach(function(t){(m[t]||[]).forEach(function(c){c.v=abs(c.v);if(c.p)c.p=abs(c.p)})});"
       "if(m.img)Object.keys(m.img).forEach(function(t){m.img[t]=abs(m.img[t])});if(m.film){m.film.v=abs(m.film.v);if(m.film.p)m.film.p=abs(m.film.p)}})})();\n")
out = pre + open(os.path.join(R, 'media.js')).read() + fix + open(os.path.join(R, 'slim.js')).read()
open(os.path.join(R, 'abj-slim-bundle.js'), 'w').write(out)
print('abj-slim-bundle.js', len(out), 'bytes')
