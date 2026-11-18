# Builds samples_section.html: the "Free door samples" section (left story + right form) for a DEV page
# made from the booking DEV page. Decors: Egger range from cutandedgexpress.co.uk (152 entries, 18 Nov 2026).
import re, html, json
rows=[l.strip() for l in open('decors.txt') if l.strip()]
seen={}
for r in rows:
    m=re.match(r'([A-Z]\d+)[ -](\S+)\s+(.*)',r)
    code,tex,name=m.group(1),m.group(2),m.group(3)
    k=(code,name)
    if k not in seen: seen[k]=[]
    if tex not in seen[k]: seen[k].append(tex)
def grp(c):
    return {'U':'plain','W':'plain','H':'wood','F':'stone'}[c[0]]
items=[{'c':c,'n':n,'g':grp(c)} for (c,n) in seen]
order={'plain':0,'wood':1,'stone':2}
items.sort(key=lambda x:(order[x['g']],x['n']))
chips=''.join('<label data-g="%s"><input type="checkbox" value="%s %s"><span>%s<small>%s</small></span></label>'%(i['g'],html.escape(i['n']),i['c'],html.escape(i['n']),i['c']) for i in items)
counts={g:sum(1 for i in items if i['g']==g) for g in order}
sec='''<section class="bkp smp" aria-label="Free door samples">
 <div class="l">
  <img src="https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@f58f336440de04a809f3750794a9529ad9469251/media/l/74e75bd-abj-worktops-t-wood.webp" alt="" loading="lazy">
  <span class="kick">Free door samples</span>
  <h1>Hold the colour before you choose it</h1>
  <p>Screens never show a finish quite right. Pick up to three from the Egger range we cut and edge in Peterborough, and see them in your own light before your design visit.</p>
  <ol>
   <li><b>Pick up to three</b><span>Plain colours, woodgrains or stone and metal effects.</span></li>
   <li><b>We send them to you</b><span>Free of charge, to the address you give us.</span></li>
   <li><b>Bring them to your visit</b><span>Your designer will build your 3D design around your favourite.</span></li>
  </ol>
  <div class="ct"><a href="tel:+441733686767">01733 686767</a><a href="https://wa.me/447479219421">WhatsApp 07479 219421</a></div>
  <p class="lng">We speak English, <span lang="pl">Polski</span>, <span lang="lt">Lietuvi&#371;</span> and <span lang="ru">&#1056;&#1091;&#1089;&#1089;&#1082;&#1080;&#1081;</span>.</p>
 </div>
 <div class="r"><div class="bf" id="kc-sf">
 <form id="abj-samples-form" novalidate aria-label="Request free door samples">
  <span class="kick">Your samples</span>
  <h2>Choose up to three finishes</h2>
  <p class="sub">Tap a finish to add it. <b id="smp-n">0</b> of 3 chosen.</p>
  <fieldset class="f" id="f-smp"><legend class="sr">Finishes</legend>
   <div class="smp-t" role="tablist"><button type="button" class="on" data-g="plain">Plain colours <i>%(plain)d</i></button><button type="button" data-g="wood">Woodgrains <i>%(wood)d</i></button><button type="button" data-g="stone">Stone &amp; metal <i>%(stone)d</i></button></div>
   <input type="search" id="smp-q" placeholder="Search, e.g. sage, walnut, cashmere" aria-label="Search finishes">
   <div class="chips smp-c" id="smp-c">%(chips)s</div>
   <span class="em">Please choose at least one finish.</span>
  </fieldset>
  <div class="g2">
   <div class="f" id="fs-name"><label for="smp-name">Your name</label><input id="smp-name" type="text" autocomplete="name" placeholder="e.g. Sarah Johnson" required><span class="em">Please enter your name.</span></div>
   <div class="f" id="fs-phone"><label for="smp-phone">Phone number</label><input id="smp-phone" type="tel" autocomplete="tel" placeholder="07700 900123" required><span class="em">Please enter a valid phone number.</span></div>
  </div>
  <div class="f" id="fs-addr"><label for="smp-addr">Address with postcode</label><input id="smp-addr" type="text" autocomplete="street-address" placeholder="e.g. 14 Main St, Stamford, PE9 2JR" required><span class="em">Please enter your address, including the postcode.</span></div>
  <div class="f" id="fs-room"><label for="smp-room">Which room are they for?</label><select id="smp-room"><option value="">Choose one (optional)</option><option>Kitchen</option><option>Bedroom / wardrobes</option><option>Media wall / living room</option><option>Home office</option><option>Other</option></select></div>
  <div class="hp"><input type="checkbox" id="smp-bot" tabindex="-1" aria-hidden="true"></div>
  <div class="send"><button type="submit" class="bt d" id="smp-submit">Send my free samples</button></div>
  <div class="se" id="smp-se" role="alert">Sorry, that didn&rsquo;t send. Please call 01733 686767 or WhatsApp 07479 219421.</div>
 </form>
 <div class="ok" id="smp-ok" tabindex="-1"><span class="kick">Thank you</span><h2>Your samples are on their way</h2><p>We&rsquo;ll post <b id="smp-okl"></b> to you and give you a call on <b id="smp-okp"></b> to arrange your free design visit.</p></div>
 </div></div>
</section>''' % dict(chips=chips, **counts)
css='''<style>/* Free door samples page, 18 Nov 2026 */
#kc .smp .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
#kc .smp .smp-t{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 12px}
#kc .smp .smp-t button{min-height:44px;padding:10px 14px;border:1px solid var(--hair);background:none;font:500 11px/1 var(--sans);letter-spacing:.16em;text-transform:uppercase;color:var(--ink);cursor:pointer}
#kc .smp .smp-t button i{font-style:normal;color:var(--mut);margin-left:4px}
#kc .smp .smp-t button.on{background:var(--g);border-color:var(--g);color:var(--lin)}
#kc .smp .smp-t button.on i{color:rgba(243,238,230,.6)}
#kc .smp #smp-q{width:100%%;height:46px;margin-bottom:12px;padding:0 14px;border:1px solid var(--hair);background:#fff;font:400 15px var(--sans)}
#kc .smp .smp-c{display:flex;flex-wrap:wrap;gap:8px;max-height:min(300px,34vh);overflow:auto;padding:2px 2px 4px;border-bottom:1px solid var(--hair)}
#kc .smp .smp-c label{cursor:pointer}
#kc .smp .smp-c label[hidden]{display:none}
#kc .smp .smp-c input{position:absolute;opacity:0;pointer-events:none}
#kc .smp .smp-c span{display:flex;flex-direction:column;justify-content:center;min-height:44px;padding:8px 12px;border:1px solid var(--hair);background:#fff;font:400 14px/1.2 var(--sans)}
#kc .smp .smp-c small{font-size:11px;letter-spacing:.08em;color:var(--mut);margin-top:3px}
#kc .smp .smp-c input:checked+span{background:var(--g);border-color:var(--g);color:var(--lin)}
#kc .smp .smp-c input:checked+span small{color:rgba(243,238,230,.65)}
#kc .smp .smp-c input:focus-visible+span{outline:2px solid var(--go);outline-offset:2px}
#kc .smp .smp-c input:disabled+span{opacity:.4;cursor:not-allowed}
#kc .smp .ok{display:none}
#kc .smp .bf.done form{display:none}
#kc .smp .bf.done .ok{display:block}
#kc .smp .lng{margin-top:14px}
</style>'''
js='''<script>(function(){var $=function(i){return document.getElementById(i)};var f=$('abj-samples-form');if(!f)return;
var W3F='{W3F}',MAIL='info@abjkitchensandbedrooms.co.uk',G='plain',box=$('smp-c'),q=$('smp-q'),L=[].slice.call(box.querySelectorAll('label'));
function sel(){return L.filter(function(l){return l.querySelector('input').checked}).map(function(l){return l.querySelector('input').value})}
function draw(){var t=(q.value||'').trim().toLowerCase();L.forEach(function(l){var v=l.textContent.toLowerCase();l.hidden=t?v.indexOf(t)<0:l.getAttribute('data-g')!==G});
 var n=sel().length;$('smp-n').textContent=n;L.forEach(function(l){var i=l.querySelector('input');i.disabled=!i.checked&&n>=3})}
[].forEach.call(document.querySelectorAll('#kc .smp-t button'),function(b){b.addEventListener('click',function(){G=b.getAttribute('data-g');q.value='';[].forEach.call(document.querySelectorAll('#kc .smp-t button'),function(x){x.classList.toggle('on',x===b)});draw()})});
q.addEventListener('input',draw);box.addEventListener('change',function(){$('f-smp').classList.remove('err');draw()});draw();
var PC=/\\b([A-PR-UWYZ][A-HK-Y]?\\d[A-Z\\d]?\\s*\\d[ABD-HJLNP-UW-Z]{2})\\b/i;
['smp-name','smp-phone','smp-addr'].forEach(function(id){$(id).addEventListener('input',function(){this.closest('.f').classList.remove('err')})});
f.addEventListener('submit',function(e){e.preventDefault();if($('smp-bot').checked)return;var ok=true,bad=function(id){$(id).classList.add('err');ok=false};
 var s=sel();if(!s.length)bad('f-smp');if($('smp-name').value.trim().length<2)bad('fs-name');if(!/^[\\d\\s+()-]{7,}$/.test($('smp-phone').value.trim()))bad('fs-phone');var a=$('smp-addr').value.trim();if(a.length<6||!PC.test(a))bad('fs-addr');
 if(!ok){var x=f.querySelector('.err');x&&x.scrollIntoView({behavior:'smooth',block:'center'});return}
 var nm=$('smp-name').value.trim(),ph=$('smp-phone').value.trim(),rm=$('smp-room').value||'Not said',b=$('smp-submit');b.disabled=true;b.textContent='Sending\\u2026';$('smp-se').classList.remove('on');
 var body=['FREE DOOR SAMPLES','Samples: '+s.join(', '),'Name: '+nm,'Phone: '+ph,'Address: '+a,'Room: '+rm].join('\\n');
 fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({access_key:W3F,subject:'Free door samples - '+s.join(', '),from_name:'ABJ Samples',replyto:MAIL,name:nm,phone:ph,address:a,projects:'Door samples ('+rm+')',samples:s.join(', '),message:body,botcheck:''})})
 .then(function(r){return r.json()}).then(function(d){if(d&&d.success===true){$('smp-okl').textContent=s.join(', ');$('smp-okp').textContent=ph;$('kc-sf').classList.add('done');var k=$('smp-ok');k.focus({preventScroll:true});k.scrollIntoView({behavior:'smooth',block:'center'});if(window.gtag)gtag('event','sample_request',{event_category:'Lead',value:s.length})}else throw 0})
 .catch(function(){b.disabled=false;b.textContent='Send my free samples';$('smp-se').classList.add('on')})})})();</script>'''
open('samples_section.html','w').write('<!-- ABJ SAMPLES -->\n'+css+'\n'+sec+'\n'+js+'\n<!-- /ABJ SAMPLES -->\n')
print(len(items), counts, len(open('samples_section.html').read()))
