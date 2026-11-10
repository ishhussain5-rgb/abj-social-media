"""Make the live versions of the new-design blocks: every DEV link (/xxx-dev-abcd) becomes the live address from linkmap.json.
   python3 golive.py            -> writes out-live/<slug>.html for every out/<slug>.html and reports anything left over.
   The same rewrite runs in the Tilda editor (tilda_golive.js) for pages whose block was filled in the editor."""
import json, os, re, sys
H = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(H, 'linkmap.json')))
KEYS = sorted(M, key=len, reverse=True)
RX = re.compile('(' + '|'.join(re.escape(k) for k in KEYS) + r')(?![A-Za-z0-9_-])')
def live(html):
    html = RX.sub(lambda m: M[m.group(1)], html)
    html = html.replace('https://abjkitchensandbedrooms.co.uk//', 'https://abjkitchensandbedrooms.co.uk/')
    return html
def left(html):
    return sorted(set(re.findall(r'[\w/.:-]*-dev-[a-z0-9]{4,5}\b', html)))
if __name__ == '__main__':
    os.makedirs(os.path.join(H, 'out-live'), exist_ok=True)
    bad = 0
    for f in sorted(os.listdir(os.path.join(H, 'out'))):
        if not f.endswith('.html') or f == 'area-template.html': continue
        src = open(os.path.join(H, 'out', f)).read(); dst = live(src)
        open(os.path.join(H, 'out-live', f), 'w').write(dst)
        l = left(dst); n = len(RX.findall(src))
        print('%-18s %4d links changed%s' % (f, n, ('  LEFT: ' + ', '.join(l)) if l else ''))
        bad += bool(l)
    sys.exit(1 if bad else 0)
