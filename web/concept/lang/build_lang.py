#!/usr/bin/env python3
"""Polish, Lithuanian and Russian DEV pages (20 Nov 2026). Writes lang/<code>.html = the <main> content for tfLang.
Facts used are only ones Ish has confirmed: Peterborough workshop, ~20 years' team experience, 2,500+ projects,
80-mile radius, 12-month guarantee, team speaks PL/LT/RU, free design visit with swatches, 3D design + itemised quote
including fitting, 4-6 weeks to make + 1-2 weeks to fit, 4.9 stars from 103 Google reviews."""
import html, pathlib
HERE = pathlib.Path(__file__).parent
S = 'https://static.tildacdn.net/'
IMG = {'k': S + 'tila3365-3536-4133-a235-656334386530/abj-kitchen-cashmere.webp',
       'w': S + 'tild3431-3065-4631-b035-386230616331/BespokeFittedWardrob.jpg',
       'b': S + 'tila3839-3466-4135-b938-353734356337/BespokeBedrooms19.webp',
       'm': S + 'tila6334-3364-4937-b632-623438633735/BespokeMediaWalls43.webp'}
BKALT = {'pl': 'Kremowa wyspa kuchenna z kwarcowym blatem i mosiężną baterią', 'lt': 'Kreminė virtuvės sala su kvarco stalviršiu ir žėlvario spalvos maišytuvu', 'ru': 'Кремовый кухонный остров с кварцевой столешницей и латунным смесителем'}
URL = {'en': '/home-dev-r7m3k', 'pl': '/pl-dev-p1l5', 'lt': '/lt-dev-l2t6', 'ru': '/ru-dev-r3u7'}
NAME = {'en': 'English', 'pl': 'Polski', 'lt': 'Lietuvių', 'ru': 'Русский'}
WA = 'https://wa.me/447479219421'
T = {
 'pl': dict(
  sw='Język strony', kick='Mówimy po polsku', h1='Kuchnie i szafy na wymiar z Peterborough',
  p='Projektujemy, produkujemy we własnym warsztacie w Peterborough i montujemy kuchnie, szafy, sypialnie i ściany telewizyjne. Nasz zespół mówi po polsku, litewsku i rosyjsku, więc cały projekt omówisz w swoim języku.',
  wa='Napisz na WhatsApp', call='Zadzwoń 01733 686767', yrs='20 lat', yrs2='doświadczenia naszego zespołu', yrs3='Ponad 2500 zrealizowanych projektów',
  mk='Co robimy', mh='Meble na wymiar do całego domu', mp='Każdy mebel powstaje na wymiar Twojego pomieszczenia, a nie z katalogu.',
  cards=[('k', 'Kuchnie', 'Kuchnie z wyspą, bez uchwytów, w stylu shaker i nie tylko.', 'Kuchnia w kolorze białym i kaszmirowym z wyspą pod świetlikiem'),
         ('w', 'Szafy', 'Szafy wnękowe, przesuwne i garderoby, także pod skosami.', 'Szafy bez uchwytów w kolorze kaszmirowym z podświetloną dębową wnęką'),
         ('b', 'Sypialnie', 'Całe sypialnie z szafami, zagłówkami i toaletkami.', 'Zielona sypialnia z ryflowanym zagłówkiem i lampami wiszącymi'),
         ('m', 'Ściany TV', 'Ściany telewizyjne z oświetleniem LED, półkami i kominkiem elektrycznym.', 'Ściana TV z lamelami z orzecha i podświetlonym panelem')],
  hk='Jak to działa', hh='Od pierwszej wizyty do gotowego wnętrza', hp='Bezpłatna wizyta, projekt 3D i jasna wycena, zanim cokolwiek zaczniemy.',
  steps=[('Bezpłatna wizyta', 'Nasz pracownik przyjeżdża, mierzy pomieszczenie i przywozi próbki kolorów.'),
         ('Projekt 3D', 'Nasi projektanci przygotowują projekt 3D ze szczegółową wyceną, łącznie z montażem.'),
         ('Produkcja', 'Meble powstają w naszym warsztacie w Peterborough, zwykle w 4–6 tygodni.'),
         ('Montaż', 'Montuje nasz własny zespół (zwykle 1–2 tygodnie), z 12-miesięczną gwarancją.')],
  facts=['4,9 ★ w 103 opiniach Google', 'Ponad 2500 projektów', 'Własny warsztat w Peterborough', 'Do 80 mil od Peterborough', '12 miesięcy gwarancji'],
  ck='Porozmawiajmy', ch='Umów bezpłatną wizytę projektową',
  cp='Zadzwoń lub napisz na WhatsApp, a odpowiemy po polsku. Możesz też wysłać zdjęcia pomieszczenia. W formularzu rezerwacji możesz pisać po polsku.',
  form='Formularz rezerwacji (po angielsku)', wamsg='Dzień dobry, chciałbym/chciałabym umówić bezpłatną wizytę projektową.',
  ft='Zaprojektujmy Twoje wnętrze'),
 'lt': dict(
  sw='Svetainės kalba', kick='Kalbame lietuviškai', h1='Virtuvės ir spintos pagal užsakymą iš Peterborough',
  p='Projektuojame, gaminame savo dirbtuvėse Peterborough mieste ir montuojame virtuves, spintas, miegamuosius ir TV sienas. Mūsų komanda kalba lietuviškai, lenkiškai ir rusiškai, todėl visą projektą galite aptarti savo kalba.',
  wa='Rašykite per WhatsApp', call='Skambinkite 01733 686767', yrs='20 metų', yrs2='mūsų komandos patirties', yrs3='Daugiau nei 2 500 įgyvendintų projektų',
  mk='Ką gaminame', mh='Baldai pagal užsakymą visiems namams', mp='Kiekvienas baldas gaminamas pagal jūsų patalpos išmatavimus, o ne renkamas iš katalogo.',
  cards=[('k', 'Virtuvės', 'Virtuvės su salomis, be rankenėlių, „shaker“ stiliaus ir kitos.', 'Balta ir kaišmyro spalvos virtuvė su sala po stoglangiu'),
         ('w', 'Spintos', 'Įmontuojamos ir slankiojančios spintos, drabužinės, taip pat po nuožulniomis lubomis.', 'Kaišmyro spalvos spintos be rankenėlių su apšviesta ąžuoline niša'),
         ('b', 'Miegamieji', 'Visi miegamieji su spintomis, galvūgaliais ir tualetiniais staliukais.', 'Žalias miegamasis su rievėtu galvūgaliu ir kabančiais šviestuvais'),
         ('m', 'TV sienos', 'TV sienos su LED apšvietimu, lentynomis ir elektriniu židiniu.', 'TV siena su riešuto lamelėmis ir apšviesta plokšte')],
  hk='Kaip tai vyksta', hh='Nuo pirmo vizito iki baigto kambario', hp='Nemokamas vizitas, 3D projektas ir aiški sąmata prieš pradedant darbus.',
  steps=[('Nemokamas vizitas', 'Mūsų darbuotojas atvyksta, išmatuoja patalpą ir atveža spalvų pavyzdžių.'),
         ('3D projektas', 'Mūsų dizaineriai paruošia 3D projektą su detalia sąmata, įskaitant montavimą.'),
         ('Gamyba', 'Baldai gaminami mūsų dirbtuvėse Peterborough, paprastai per 4–6 savaites.'),
         ('Montavimas', 'Sumontuoja mūsų pačių komanda (paprastai per 1–2 savaites), su 12 mėnesių garantija.')],
  facts=['4,9 ★ iš 103 Google atsiliepimų', 'Daugiau nei 2 500 projektų', 'Savos dirbtuvės Peterborough', 'Iki 80 mylių nuo Peterborough', '12 mėnesių garantija'],
  ck='Pasikalbėkime', ch='Užsisakykite nemokamą dizaino vizitą',
  cp='Paskambinkite arba parašykite per WhatsApp, atsakysime lietuviškai. Galite atsiųsti ir patalpos nuotraukų. Užsakymo formoje galite rašyti lietuviškai.',
  form='Užsakymo forma (anglų k.)', wamsg='Laba diena, norėčiau užsisakyti nemokamą dizaino vizitą.',
  ft='Suprojektuokime jūsų namus'),
 'ru': dict(
  sw='Язык сайта', kick='Говорим по-русски', h1='Кухни и шкафы на заказ из Питерборо',
  p='Мы проектируем, изготавливаем в собственной мастерской в Питерборо и устанавливаем кухни, шкафы, спальни и ТВ-стены. Наша команда говорит по-русски, по-польски и по-литовски, поэтому весь проект можно обсудить на вашем языке.',
  wa='Написать в WhatsApp', call='Позвонить 01733 686767', yrs='20 лет', yrs2='опыта нашей команды', yrs3='Более 2 500 выполненных проектов',
  mk='Что мы делаем', mh='Мебель на заказ для всего дома', mp='Каждый предмет мебели изготавливается по размерам вашей комнаты, а не выбирается из каталога.',
  cards=[('k', 'Кухни', 'Кухни с островом, без ручек, в стиле шейкер и другие.', 'Бело-кашемировая кухня с островом под мансардным окном'),
         ('w', 'Шкафы', 'Встроенные и раздвижные шкафы, гардеробные, в том числе под скошенным потолком.', 'Шкафы без ручек цвета кашемир с подсвеченной дубовой нишей'),
         ('b', 'Спальни', 'Спальни под ключ со шкафами, изголовьями и туалетными столиками.', 'Зелёная спальня с рифлёным изголовьем и подвесными светильниками'),
         ('m', 'ТВ-стены', 'ТВ-стены с LED-подсветкой, полками и электрокамином.', 'ТВ-стена с ореховыми рейками и подсвеченной панелью')],
  hk='Как мы работаем', hh='От первого визита до готовой комнаты', hp='Бесплатный визит, 3D-проект и понятная смета до начала работ.',
  steps=[('Бесплатный визит', 'Наш специалист приезжает, делает замеры и привозит образцы цветов.'),
         ('3D-проект', 'Наши дизайнеры готовят 3D-проект с подробной сметой, включая установку.'),
         ('Изготовление', 'Мебель изготавливается в нашей мастерской в Питерборо, обычно за 4–6 недель.'),
         ('Установка', 'Устанавливает наша собственная команда (обычно 1–2 недели), с гарантией 12 месяцев.')],
  facts=['4,9 ★ по 103 отзывам в Google', 'Более 2 500 проектов', 'Своя мастерская в Питерборо', 'До 80 миль от Питерборо', 'Гарантия 12 месяцев'],
  ck='Давайте обсудим', ch='Запишитесь на бесплатный визит дизайнера',
  cp='Позвоните или напишите в WhatsApp, мы ответим по-русски. Можно прислать фото комнаты. В форме записи можно писать по-русски.',
  form='Форма записи (на английском)', wamsg='Здравствуйте, я хочу записаться на бесплатный визит дизайнера.',
  ft='Давайте спроектируем ваш дом'),
}
CSS = '''<style>
html:not(#lg-a):not(#lg-b) #kc .lgh{padding-top:calc(86px + clamp(40px,5vw,90px))!important}
#kc .lgsw{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:clamp(18px,2vw,26px)}
#kc .lgsw a{min-height:40px;display:inline-flex;align-items:center;padding:0 14px;border:1px solid rgba(243,238,230,.3);border-radius:999px;color:rgba(243,238,230,.85);font-size:13.5px}
#kc .lgsw a[aria-current]{background:var(--lin);color:var(--g);border-color:var(--lin)}
#kc .lg4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(12px,1.4vw,22px)}
#kc .lg4 figure{margin:0}
#kc .lg4 img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover}
#kc .lg4 h3{margin:14px 0 6px;font-size:clamp(22px,1.7vw,28px)}
#kc .lg4 p{font-size:14.5px;line-height:1.5;color:var(--mut)}
#kc .lgf{display:flex;flex-wrap:wrap;gap:8px;margin-top:clamp(24px,2.6vw,36px)}
#kc .lgf span{padding:10px 14px;border:1px solid var(--hair);font-size:13.5px}
@media(max-width:760px){#kc .lg4{grid-template-columns:1fr 1fr;gap:12px}#kc .lg4 img{aspect-ratio:1/1}#kc .lg4 h3{font-size:19px;margin-top:10px}#kc .lg4 p{font-size:13px}}
</style>'''
def page(code):
    t = T[code]; e = html.escape
    sw = ''.join('<a href="%s" hreflang="%s" lang="%s"%s>%s</a>' % (URL[k], k, k, ' aria-current="page"' if k == code else '', NAME[k]) for k in ('en', 'pl', 'lt', 'ru'))
    wa = WA + '?text=' + __import__('urllib.parse').parse.quote(t['wamsg'])
    cards = ''.join('<figure class="rv"><img loading="lazy" src="%s" alt="%s"><h3>%s</h3><p>%s</p></figure>' % (IMG[k], e(alt), e(h), e(p)) for k, h, p, alt in t['cards'])
    steps = ''.join('<div class="rv"><i>0%d</i><h3>%s</h3><p>%s</p></div>' % (i + 1, e(h), e(p)) for i, (h, p) in enumerate(t['steps']))
    facts = ''.join('<span>%s</span>' % e(f) for f in t['facts'])
    return f'''<!-- ABJ LANG {code} -->
<div lang="{code}">
<section class="ih lgh" aria-label="{e(t['kick'])}">{CSS}
 <div class="w">
  <div>
   <nav class="lgsw" aria-label="{e(t['sw'])}">{sw}</nav>
   <span class="kick">{e(t['kick'])}</span>
   <h1>{e(t['h1'])}</h1>
   <p>{e(t['p'])}</p>
   <div class="acts"><a class="bt" href="{e(wa)}" target="_blank" rel="noopener">{e(t['wa'])}</a><a class="bt o" href="tel:+441733686767">{e(t['call'])}</a></div>
  </div>
  <div class="side rv"><b>{e(t['yrs'])}</b><span>{e(t['yrs2'])}</span><small>{e(t['yrs3'])}</small></div>
 </div>
</section>
<section class="sec" aria-label="{e(t['mk'])}"><div class="w">
 <div class="sh rv"><div><span class="kick">{e(t['mk'])}</span><h2 style="margin-top:16px">{e(t['mh'])}</h2></div><p>{e(t['mp'])}</p></div>
 <div class="lg4">{cards}</div>
 <div class="lgf rv">{facts}</div>
</div></section>
<section class="proc" style="background:var(--lin2)"><div class="w">
 <div class="sh rv" style="margin-bottom:0"><div><span class="kick">{e(t['hk'])}</span><h2 style="margin-top:16px">{e(t['hh'])}</h2></div><p>{e(t['hp'])}</p></div>
 <div class="ps">{steps}</div>
</div></section>
<section class="bk" id="kc-book" aria-label="{e(t['ch'])}">
 <figure><img loading="lazy" src="{S}tila3335-3465-4538-b264-316632643031/abj-kitchen-cream-is.webp" alt="{e(BKALT[code])}"></figure>
 <div class="t rv"><span class="kick">{e(t['ck'])}</span><h2>{e(t['ch'])}</h2><p>{e(t['cp'])}</p>
  <div class="acts"><a class="bt" href="{e(wa)}" target="_blank" rel="noopener">{e(t['wa'])}</a><a class="bt o" href="tel:+441733686767">{e(t['call'])}</a><a class="bt o" href="/bookingform-dev-k9b4">{e(t['form'])}</a></div>
 </div>
</section>
</div>
<!-- /ABJ LANG {code} -->
'''
for code in T:
    (HERE / (code + '.html')).write_text(page(code))
    (HERE / (code + '.ft.txt')).write_text(T[code]['ft'])
print('ok', [len((HERE / (c + '.html')).read_text()) for c in T])
