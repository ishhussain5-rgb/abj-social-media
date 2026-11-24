"""Build the ABJ D3CTA blocks (service pages) and the ABJ CHOOSER block (homepage) into tools/out/.
Usage: python3 blocks.py <commit-hash>   (hash = the commit that holds tools/abjtools.js and tools/img/*.webp)
Links are written as live links; abjtools.js points /design-your-room and /bookingform at their DEV copies on DEV pages."""
import sys, os, html
H = sys.argv[1]
CDN = f'https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@{H}/web/concept/tools/'
OUT = os.path.join(os.path.dirname(__file__), 'out'); os.makedirs(OUT, exist_ok=True)
SCRIPT = f'<script src="{CDN}abjtools.js" defer></script>'
I3D = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/></svg>'
ICAM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>'

CTA_CSS = """<style>
#kc .d3c{background:var(--lin2);padding:clamp(56px,6vw,104px) 0}
#kc .d3c-g{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:clamp(32px,5vw,96px);align-items:center}
#kc .d3c-im{position:relative;display:block;border-radius:4px;overflow:hidden;background:#E9E3D8;box-shadow:0 34px 60px -34px rgba(14,27,26,.45)}
#kc .d3c-im img{width:100%;height:auto;aspect-ratio:4/3;object-fit:cover;transition:transform .9s cubic-bezier(.2,.7,.2,1)}
#kc .d3c-im:hover img,#kc .d3c-im:focus-visible img{transform:scale(1.03)}
#kc .d3c-tag{position:absolute;left:16px;bottom:16px;display:inline-flex;align-items:center;gap:9px;background:rgba(14,27,26,.86);color:var(--lin);font:500 10.5px/1 var(--sans);letter-spacing:.2em;text-transform:uppercase;padding:11px 15px;border-radius:99px;backdrop-filter:blur(4px)}
#kc .d3c-tag svg{width:16px;height:16px;color:var(--go)}
#kc .d3c .kick{color:var(--gd)}
#kc .d3c h2{margin:14px 0 18px}#kc .d3c h2 em{font-style:italic;color:var(--gd)}
#kc .d3c-l{max-width:34em;color:var(--mut)}
#kc .d3c-f{list-style:none;display:flex;flex-wrap:wrap;gap:8px 22px;margin:20px 0 30px;font-size:14px;color:var(--ink)}
#kc .d3c-f li{display:flex;align-items:center;gap:9px}#kc .d3c-f li:before{content:"";width:6px;height:6px;border-radius:50%;background:var(--go)}
#kc .d3c-a{display:flex;flex-wrap:wrap;align-items:center;gap:14px 28px}
#kc .d3c-a .bt svg{width:17px;height:17px;color:var(--go)}
#kc .d3c-ph{display:inline-flex;align-items:center;gap:10px;font:500 11.5px/1 var(--sans);letter-spacing:.2em;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid currentColor;transition:gap .3s}
#kc .d3c-ph:hover{gap:16px}#kc .d3c-ph svg{width:17px;height:17px}
#kc .d3c-q{display:block;margin-top:24px;background:none;border:0;padding:0;font:400 15px/1.4 var(--sans);color:var(--ink);text-decoration:underline;text-underline-offset:5px;text-decoration-color:rgba(27,35,33,.3);cursor:pointer;text-align:left}
#kc .d3c-q:hover{text-decoration-color:var(--gd)}
#kc .d3c .mb{display:none}
@media(max-width:760px){
#kc .d3c{padding:44px 0}
#kc .d3c-g{grid-template-columns:1fr;gap:22px}
#kc .d3c-im img{aspect-ratio:16/10}
#kc .d3c-tag{left:10px;bottom:10px;padding:9px 12px;font-size:9.5px}
#kc .d3c h2{font-size:34px;margin:10px 0 12px}
#kc .d3c-l{font-size:15px;line-height:1.6}
#kc .d3c-f{display:none}
#kc .d3c-a{flex-wrap:nowrap;gap:8px;margin-top:20px}
#kc .d3c-a .bt{flex:1 1 0;height:50px;padding:0 10px;letter-spacing:.14em;font-size:10.5px}
#kc .d3c-ph{flex:1 1 0;justify-content:center;height:50px;padding:0 10px;border:1px solid rgba(27,35,33,.35);letter-spacing:.14em;font-size:10.5px}
#kc .d3c .dk{display:none}#kc .d3c .mb{display:inline}
#kc .d3c-q{margin-top:16px;font-size:14px}
}
@media(prefers-reduced-motion:reduce){#kc .d3c-im img{transition:none}}
</style>"""

PAGES = {
    # key: (room for designer, look, image, quiz room, h2 html, lead, room word, alt)
    'kitchens': ('kitchen', 0, 'kitchens', 'k', 'See your kitchen <em>before it&rsquo;s made.</em>',
                 'Choose the layout, doors, colours and worktop, spin it round, or put it on a photo of your own kitchen wall. When you love it, book a free design visit and bring your design with you.', 'kitchen',
                 '3D design of a sage green L-shaped kitchen with a walnut island, made in the ABJ room designer'),
    'kdesign': ('kitchen', 2, 'kdesign', 'k', 'Sketch your ideas <em>in 3D first.</em>',
                'Try layouts, islands, door styles and worktops in a few taps, then save it or put it on a photo of your own room. Our designer starts from your ideas at the free design visit.', 'kitchen',
                '3D design of a graphite handleless kitchen with an oak and stone waterfall island'),
    'shaker': ('kitchen', 1, 'shaker', 'k', 'Try Shaker doors <em>in your colour.</em>',
               'Navy, sage, cream or something bolder: change the door colour, handles and worktop and spin your Shaker kitchen round in 3D. Then book a free design visit with your design.', 'kitchen',
               '3D design of a navy Shaker kitchen with brass handles and an oak island'),
    'handleless': ('kitchen', 4, 'handleless', 'k', 'Try handleless <em>in 3D.</em>',
                   'Matt or gloss, light or dark: see your handleless kitchen take shape as you choose the layout, colours and worktop. Then book a free design visit with your design.', 'kitchen',
                   '3D design of a white gloss handleless U-shaped kitchen with a dark worktop'),
    'wardrobes': ('wardrobe', 0, 'wardrobes', 'b', 'See your wardrobes <em>before they&rsquo;re made.</em>',
                  'Choose the doors, colour, handles and what goes inside, open the doors to check the layout, then see it on a photo of your own wall. When you love it, book a free design visit.', 'wardrobe',
                  '3D design of sage green Shaker fitted wardrobes with lit open shelving'),
    'sliding': ('wardrobe', 2, 'sliding', 'b', 'Try sliding doors <em>in 3D.</em>',
                'Mirror, wood or painted: switch to sliding doors, watch them glide, and plan what goes inside. Then see it on a photo of your own wall and book a free design visit.', 'wardrobe',
                '3D design of a fitted wardrobe with mirrored sliding doors'),
    'walkin': ('wardrobe', 1, 'walkin', 'b', 'Plan your storage <em>in 3D.</em>',
               'Try door styles, colours and the hanging, shelving and drawer layout for a run of fitted wardrobes, then bring it to your free design visit and we&rsquo;ll plan the full walk-in with you.', 'wardrobe',
               '3D design of walnut fluted fitted wardrobes with lit shelving'),
    'bedrooms': ('bedroom', 0, 'bedrooms', 'b', 'See your bedroom <em>before it&rsquo;s made.</em>',
                 'Choose the bed size, headboard, wardrobes, bedside units and colours, then see it on a photo of your own room. When you love it, book a free design visit with your design.', 'bedroom',
                 '3D design of a cashmere fitted bedroom with a fluted headboard and bridging wardrobes'),
    'media': ('mediawall', 0, 'media', 'm', 'See your media wall <em>before it&rsquo;s made.</em>',
              'Choose the TV size, fire, shelving and finish, then put it on a photo of your own wall to see how it fits. When you love it, book a free design visit with your design.', 'media wall',
              '3D design of a walnut slat media wall with a fire and lit floating shelves'),
}

def cta(key):
    r, look, im, qr, h2, lead, word, alt = PAGES[key]
    d3 = f'/design-your-room?room={r}&amp;look={look}'
    feats = ['Tap anything to change it', 'Try it on a photo of your room', 'See it in your room on your phone']
    return f"""<!-- ABJ D3CTA -->
<section class="d3c" id="kc-d3" aria-label="Design it in 3D">
{CTA_CSS}
<div class="w"><div class="d3c-g">
<a class="d3c-im" href="{d3}" aria-label="Open the 3D room designer"><img src="{CDN}img/d3-{im}.webp" alt="{alt}" width="1200" height="900" loading="lazy" decoding="async"><span class="d3c-tag">{I3D}Tap to try it</span></a>
<div class="d3c-t">
<p class="kick">Design it in 3D &middot; free</p>
<h2>{h2}</h2>
<p class="d3c-l">{lead}</p>
<ul class="d3c-f">{''.join(f'<li>{f}</li>' for f in feats)}</ul>
<div class="d3c-a"><a class="bt d" href="{d3}">{I3D}<span class="dk">Design my {word} in 3D</span><span class="mb">Design in 3D</span></a><a class="d3c-ph" href="{d3}&amp;photo=1">{ICAM}<span class="dk">Use a photo of my room</span><span class="mb">Use my photo</span></a></div>
<button type="button" class="d3c-q" data-abj-quiz="{qr}">Not sure of your style? Take the 5-tap style quiz &rarr;</button>
</div>
</div></div>
{SCRIPT}
</section>
<!-- /ABJ D3CTA -->"""

CH_CSS = """<style>
#kc .chs{background:var(--g);color:var(--lin);padding:clamp(56px,6vw,100px) 0}
#kc .chs-g{display:grid;grid-template-columns:minmax(0,.82fr) minmax(0,1.18fr);gap:clamp(32px,5vw,96px);align-items:start}
#kc .chs .kick{color:var(--go)}
#kc .chs h2{margin:14px 0 18px}#kc .chs h2 em{font-style:italic;color:#9FD3AE}
#kc .chs-l{color:rgba(243,238,230,.74);max-width:31em}
#kc .chs-q{display:block;margin-top:24px;background:none;border:0;padding:0;color:var(--lin);font:400 15px/1.4 var(--sans);text-decoration:underline;text-underline-offset:5px;text-decoration-color:rgba(243,238,230,.35);cursor:pointer;text-align:left}
#kc .chs-q:hover{text-decoration-color:var(--go)}
#kc .ch-b{min-height:318px}
#kc .ch-st{display:flex;gap:6px;margin-bottom:22px}#kc .ch-st i{flex:0 0 42px;height:3px;background:rgba(243,238,230,.18)}#kc .ch-st i.on{background:var(--go)}
#kc .ch-q{display:flex;align-items:center;gap:14px;font:300 clamp(24px,2.2vw,34px)/1.15 var(--serif);margin:0 0 20px}
#kc .ch-q span{flex:none;width:34px;height:34px;border-radius:50%;border:1px solid var(--go);color:var(--go);font:500 13px/32px var(--sans);text-align:center}
#kc .ch-q2{margin-top:4px}
#kc .ch-c{display:flex;flex-wrap:wrap;gap:10px}
#kc .ch-c button{min-height:46px;padding:0 19px;border:1px solid rgba(243,238,230,.3);background:transparent;color:var(--lin);font:400 15px/1 var(--sans);border-radius:99px;cursor:pointer;transition:border-color .2s,background .2s}
#kc .ch-c button:hover,#kc .ch-c button:focus-visible{border-color:var(--go);background:rgba(201,169,110,.12)}
#kc .ch-c button[aria-pressed="true"]{background:var(--go);color:var(--g);border-color:var(--go)}
#kc .ch-cr{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:18px}
#kc .ch-cr b{font:500 10.5px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;padding:8px 11px;border-radius:99px;background:rgba(243,238,230,.09);color:rgba(243,238,230,.88)}
#kc .ch-cr button{background:none;border:0;color:var(--go);font:500 10.5px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;cursor:pointer;padding:8px 6px;text-decoration:underline;text-underline-offset:3px}
#kc .ch-r{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}
#kc .ch-card{position:relative;display:block;padding:18px 44px 18px 18px;border:1px solid rgba(243,238,230,.18);border-radius:4px;background:rgba(243,238,230,.04);transition:border-color .2s,background .2s}
#kc .ch-card:hover,#kc .ch-card:focus-visible{border-color:var(--go);background:rgba(201,169,110,.08)}
#kc .ch-card strong{display:block;font:400 23px/1.12 var(--serif);margin-bottom:6px}
#kc .ch-card span{display:block;font-size:13.5px;line-height:1.5;color:rgba(243,238,230,.72)}
#kc .ch-card em{position:absolute;right:16px;top:18px;font-style:normal;color:var(--go);font-size:18px;transition:transform .25s}
#kc .ch-card:hover em{transform:translateX(4px)}
#kc .ch-a{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin-top:20px}
#kc .chs .ch-a .bt.d{background:var(--lin);color:var(--ink)}#kc .chs .ch-a .bt.d:hover{background:var(--go)}
#kc .chs .ch-a .ch-o{background:none;color:var(--lin);box-shadow:inset 0 0 0 1px rgba(243,238,230,.5)}#kc .chs .ch-a .ch-o:hover{box-shadow:inset 0 0 0 1px var(--lin);background:none}
#kc .ch-lk{flex-basis:100%;text-align:left;background:none;border:0;padding:6px 0 0;color:rgba(243,238,230,.82);font:400 14.5px/1.4 var(--sans);text-decoration:underline;text-underline-offset:4px;text-decoration-color:rgba(243,238,230,.35);cursor:pointer}
#kc .ch-n{margin-top:14px;font-size:13.5px;color:#9FD3AE}
@media(max-width:760px){
#kc .chs{padding:44px 0}
#kc .chs-g{grid-template-columns:1fr;gap:22px}
#kc .chs h2{font-size:34px;margin:10px 0 12px}
#kc .chs-l{font-size:15px}
#kc .chs-q{margin-top:14px;font-size:14px}
#kc .ch-b{min-height:0}
#kc .ch-st{margin-bottom:16px}
#kc .ch-q{font-size:24px;margin-bottom:14px;gap:12px}#kc .ch-q span{width:30px;height:30px;line-height:28px;font-size:12px}
#kc .ch-c{gap:8px}#kc .ch-c button{min-height:42px;padding:0 15px;font-size:14px}
#kc .ch-r{grid-template-columns:1fr;gap:8px}#kc .ch-card strong{font-size:21px}
#kc .ch-a{gap:8px}#kc .ch-a .bt{flex:1 1 calc(50% - 4px);height:50px;padding:0 8px;font-size:10px;letter-spacing:.12em;text-align:center;line-height:1.3}
#kc .ch-card{padding:13px 40px 13px 14px}#kc .ch-card span{display:none}#kc .ch-card strong{margin:0}#kc .ch-card em{top:50%;transform:translateY(-50%)}#kc .ch-card:hover em{transform:translate(4px,-50%)}
}
</style>"""

ROOMS = [['k', 'Kitchen'], ['b', 'Bedroom'], ['w', 'Wardrobes'], ['m', 'Living room'], ['h', 'Hallway or stairs'], ['o', 'Home office'], ['u', 'Utility or boot room'], ['x', 'Bathroom'], ['r', 'Rental or HMO'], ['c', 'Office or business']]

def chooser():
    chips = ''.join(f'<button type="button" data-k="r" data-v="{k}">{html.escape(v)}</button>' for k, v in ROOMS)
    return f"""<!-- ABJ CHOOSER -->
<section class="chs" id="abj-ch" aria-label="Which service do I need?">
{CH_CSS}
<div class="w"><div class="chs-g">
<div class="chs-h">
<p class="kick">Not sure where to start?</p>
<h2>Find the right service <em>in three taps.</em></h2>
<p class="chs-l">Tell us the room, what&rsquo;s wrong with it now and when you&rsquo;d like it done. We&rsquo;ll point you to the right place, or straight to a free design visit.</p>
<button type="button" class="chs-q" data-abj-quiz="">Or find your style with the 5-tap quiz &rarr;</button>
</div>
<div class="ch-b" aria-live="polite"><div class="ch-st" aria-hidden="true"><i class="on"></i><i></i><i></i></div><p class="ch-q"><span>1</span>What would you like done?</p><div class="ch-c" role="group">{chips}</div></div>
</div></div>
{SCRIPT}
</section>
<!-- /ABJ CHOOSER -->"""

for k in PAGES:
    open(os.path.join(OUT, f'd3cta-{k}.html'), 'w').write(cta(k))
open(os.path.join(OUT, 'chooser.html'), 'w').write(chooser())
print('built', len(PAGES), 'cta blocks + chooser @', H)
