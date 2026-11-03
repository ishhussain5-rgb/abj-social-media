"""Bundle media.js + slim.js into abj-slim.js (served via jsDelivr). Media paths become absolute from the bundle's own URL."""
import os
R = os.path.dirname(os.path.abspath(__file__))
pre = ("(function(){var s=document.currentScript,b=s&&s.src?s.src.replace(/[^/]*$/,'')+'media/':'';"
       "window.__ABJ_MEDIA_BASE=b})();\n")
fix = ("(function(){var b=window.__ABJ_MEDIA_BASE||'',M=window.ABJ_SLIM_MEDIA||{},abs=function(u){return /^https?:/.test(u)?u:b+u};"
       "Object.keys(M).forEach(function(k){var m=M[k];['wide','tall'].forEach(function(t){(m[t]||[]).forEach(function(c){c.v=abs(c.v);if(c.p)c.p=abs(c.p)})});"
       "if(m.img)Object.keys(m.img).forEach(function(t){m.img[t]=abs(m.img[t])});if(m.film){m.film.v=abs(m.film.v);if(m.film.p)m.film.p=abs(m.film.p)}})})();\n")
out = pre + open(os.path.join(R, 'media.js')).read() + fix + open(os.path.join(R, 'slim.js')).read()
open(os.path.join(R, 'abj-slim.js'), 'w').write(out)
print('abj-slim.js', len(out), 'bytes')
