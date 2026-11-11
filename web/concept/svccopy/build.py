import json
R="&rsquo;"
def F(s): return s.replace("'",R).replace("&amp;","&").replace("&","&amp;").replace("&amp;rsquo;","&rsquo;").replace("&amp;pound;","&pound;")
D={}
def p(slug,live,proc,steps,book_h=None,book_p=None): D[slug]=dict(slug=slug,live=live,proc_p=proc,steps=steps,book_h=book_h,book_p=book_p)
p('wardrobes',73280437,"Wardrobes take four to six weeks to make once you approve the design, and we agree the fitting day with you.",
 [["Design visit","We measure the wall and ask what you need to hang, fold and store, so the inside is planned before the doors."],
  ["3D design & quote","You see the doors and the interior in 3D, with a quote that lists every rail, drawer and shelf."],
  ["Made in Peterborough","Carcasses, doors and fillers are cut to your room in our workshop, so the wardrobe runs wall to wall."],
  ["Fitted by our team","We scribe it to your walls and ceiling and fit the handles before we leave. It's covered by our 12-month guarantee."]],
 "Let's plan your wardrobe","Book a visit or send us a photo of the wall on WhatsApp. We'll measure up, plan the inside around what you own and send you a 3D design with an itemised quote.")
p('bedrooms',73297487,"A fitted bedroom usually takes four to six weeks to make after you sign off the design.",
 [["Design visit","We measure the whole room, including slopes, chimney breasts and box sections, and talk through how you use it."],
  ["3D design & quote","You see wardrobes, bedside units and any dressing table together in 3D, with a quote that lists each piece."],
  ["Made in Peterborough","Every piece is made to your room's measurements in our workshop, so the finishes match across the room."],
  ["Fitted by our team","Our fitters install the whole room and finish it to the walls and ceiling, backed by our 12-month guarantee."]],
 "Let's design your bedroom","Tell us about the room and what needs to fit in it. We'll visit, measure everything and send a 3D design of the finished bedroom with an itemised quote.")
p('mediawalls',73279037,"Most media walls take four to six weeks to make once the design is approved.",
 [["Design visit","We measure the wall and check your TV size, sockets, aerial point and where the cables need to go."],
  ["3D design & quote","You see the wall in 3D, with any fire, lighting and storage in place, and a quote that lists every part."],
  ["Made in Peterborough","The frame, panels and cabinets are made to your wall in our workshop, with cable routes planned in."],
  ["Fitted by our team","We install the wall and leave it ready for your TV, covered by our 12-month guarantee."]],
 "Let's plan your media wall","Send us a photo of the wall and your TV size on WhatsApp, or book a visit. We'll measure up and send you a 3D design with an itemised quote.")
p('worktops',73545333,"Worktops are made once your kitchen layout is fixed, and we agree the fitting date with you.",
 [["Design visit","We look at your kitchen, talk through materials and check the sink, hob and tap positions."],
  ["Samples & quote","You choose from real samples at home, and the quote lists every cut-out, upstand and edge."],
  ["Measured precisely","Each worktop is measured so the joints, cut-outs and edges sit exactly where they should."],
  ["Fitted by our team","Our fitters install the worktops and seal the joints, covered by our 12-month guarantee."]])
p('decors',73195791,"Panelling usually takes four to six weeks to make after you approve the design.",
 [["Design visit","We measure the wall, mark the sockets and switches, and look at the furniture around it."],
  ["3D design & quote","You see the panelling, slats or mouldings in 3D in your room, with a quote that lists every piece."],
  ["Made in Peterborough","Every panel is cut to your wall in our workshop, with the sockets and switches allowed for."],
  ["Fitted by our team","We fit and finish the panelling so it looks part of the house, backed by our 12-month guarantee."]],
 "Let's design your feature wall","Send a photo of the wall on WhatsApp or book a visit. We'll measure it, mark the sockets and switches, and send a 3D design with an itemised quote.")
p('storage',73372439,"Most storage jobs take four to six weeks to make once you approve the design.",
 [["Design visit","We measure the space, whether it's under the stairs, an alcove or a utility, and ask what needs to live there."],
  ["3D design & quote","You see the drawers, shelves and cupboards in 3D, with a quote that lists each one."],
  ["Made in Peterborough","Everything is built to the exact size of the space in our workshop, so nothing is wasted."],
  ["Fitted by our team","We fit it so doors close flush and drawers run smoothly, covered by our 12-month guarantee."]],
 "Show us the space","Send us a photo of the space on WhatsApp or book a visit. We'll measure it, ask what you need to store and send a 3D design with an itemised quote.")
p('office',73279381,"A fitted home office usually takes four to six weeks to make after design sign-off.",
 [["Design visit","We measure the room and list your screens, files and equipment, and where every cable needs to go."],
  ["3D design & quote","You see the desk, shelving and storage in 3D, with a quote that lists every piece."],
  ["Made in Peterborough","Every piece is made to your room in our workshop, with cable routes built in."],
  ["Fitted by our team","We install the office ready to work in, covered by our 12-month guarantee."]],
 "Let's plan your home office","Tell us how you work and what needs to fit in the room. We'll visit, measure up and send a 3D design with an itemised quote.")
p('hallways',73340083,"Hallway storage usually takes four to six weeks to make once you approve the design.",
 [["Design visit","We measure the hall, the stairs and any boot room, and ask about coats, shoes and bags."],
  ["3D design & quote","You see the storage in 3D, including any under-stairs drawers or bench seat, with an itemised quote."],
  ["Made in Peterborough","Every piece is made to fit your hall exactly in our workshop."],
  ["Fitted by our team","We fit it tight to the walls and stairs, backed by our 12-month guarantee."]],
 "Let's sort out your hallway","Send a photo of your hall on WhatsApp or book a visit. We'll measure up and send you a 3D design with an itemised quote.")
p('bathroom',152105513,"Bathroom furniture usually takes four to six weeks to make after you approve the design.",
 [["Design visit","We measure the room and check the pipework, basin and toilet positions before we design anything."],
  ["3D design & quote","You see the vanity units and storage in 3D, with a quote that lists every cabinet and worktop."],
  ["Made in Peterborough","Every cabinet is built to your room in our workshop from materials suited to steam and splashes."],
  ["Fitted by our team","We fit the furniture around your plumbing, covered by our 12-month guarantee."]],
 "Let's plan your bathroom furniture","Send us a photo of the bathroom on WhatsApp or book a visit. We'll measure up and send a 3D design with an itemised quote.")
p('upholstery',146924323,"Upholstered pieces are made to order once you've chosen your design and fabric.",
 [["Design visit","We measure the bed and wall and bring fabric samples so you can see them in your own room."],
  ["Design & quote","We agree the shape, size and fabric with you, and the quote lists everything included."],
  ["Made to order","Each headboard or piece is made to your measurements in the fabric you chose."],
  ["Fitted by our team","We fit it in place, covered by our 12-month guarantee."]],
 "Choose your fabric at home","Book a visit and we'll bring fabric samples to your home, measure up and send you a clear quote.")
p('hmo',73279797,"Once the design is agreed, we plan making and fitting around your project programme.",
 [["Site visit","We walk the property with your plans or room list and check what each room needs."],
  ["Design & quote","You get a layout for every room and a quote that lists each item, room by room."],
  ["Made in Peterborough","Furniture is made to each room's measurements in our workshop."],
  ["Fitted by our team","We fit room by room, working alongside your builder, agent or architect."]])
p('sloping-wardrobes',377674203,"Loft wardrobes take four to six weeks to make once you approve the design.",
 [["Design visit","We measure the pitch of your ceiling and the height at every point along the wall."],
  ["3D design & quote","You see the wardrobe following your roofline in 3D, with a quote that lists every part."],
  ["Made in Peterborough","Each carcass and door is cut to the angle of your ceiling in our workshop."],
  ["Fitted by our team","We fit it tight to the slope so there are no gaps, backed by our 12-month guarantee."]])
p('understairs',377674303,"Under-stairs storage takes four to six weeks to make once you approve the design.",
 [["Design visit","We measure the stairs, including the angle and how deep the space goes at the back."],
  ["3D design & quote","You see the pull-outs, drawers and cupboards in 3D, with a quote that lists each one."],
  ["Made in Peterborough","Every drawer and door is made to your staircase in our workshop."],
  ["Fitted by our team","We fit it so the drawers run smoothly and the doors sit flush, covered by our 12-month guarantee."]])
p('sliding-wardrobes',377674503,"Sliding wardrobes take four to six weeks to make once the design is signed off.",
 [["Design visit","We measure the opening and check the floor and ceiling are level enough for the track."],
  ["3D design & quote","You choose mirror, glass, wood-effect or painted doors and see them in 3D, with an itemised quote."],
  ["Made in Peterborough","The doors and the interior are made to your opening in our workshop."],
  ["Fitted by our team","We fit the tracks and adjust the doors so they glide, backed by our 12-month guarantee."]],
 "Let's design your sliding wardrobe","Send a photo of the wall on WhatsApp or book a visit. We'll measure the opening and send a 3D design with an itemised quote.")
p('walkin',377674603,"A walk-in wardrobe usually takes four to six weeks to make after you approve the design.",
 [["Design visit","We measure the room and go through what you own: long hanging, short hanging, shoes, bags and drawers."],
  ["3D design & quote","You walk through the room in 3D before anything is made, with a quote that lists every section."],
  ["Made in Peterborough","Every section is made to your room in our workshop, including any lighting runs."],
  ["Fitted by our team","We fit the whole room and finish it to the walls, covered by our 12-month guarantee."]],
 "Let's plan your dressing room","Tell us about the room and what you want to keep in it. We'll visit, measure up and send a 3D design with an itemised quote.")
p('office-fitout',377674703,"Once the design is agreed, we plan making and installation around your timetable.",
 [["Site visit","We measure the space, look at how your team works and check services such as power and data."],
  ["3D layout & quote","You see the reception, meeting rooms and storage in 3D, with a quote that lists every item."],
  ["Made in Peterborough","Desks, storage and panelling are made to your measurements in our workshop."],
  ["Installed by our team","We install the joinery and can work alongside your builder, electrician and flooring contractor."]])
p('joinery',377674803,"Most jobs take four to six weeks to make once you approve the drawings.",
 [["Design visit","We measure the room and talk through what you want made, from one alcove unit to a whole house."],
  ["3D design & quote","You see the piece in 3D before anything is cut, with an itemised quote."],
  ["Made in Peterborough","Our cabinet makers build it to the millimetre in our own workshop."],
  ["Fitted by our team","The people who made it fit it, covered by our 12-month guarantee."]],
 "Tell us what you'd like made","Send us a photo or a sketch on WhatsApp, or book a visit. We'll measure up and send a 3D design with an itemised quote.")
p('alcoves',377674903,"Alcove units take four to six weeks to make once you approve the design.",
 [["Design visit","We measure both alcoves and note the skirting, sockets and any radiator."],
  ["3D design & quote","You see the cupboards and shelving in 3D, with a quote that lists each unit."],
  ["Made in Peterborough","Each unit is made to its own alcove in our workshop, as the two sides are rarely the same."],
  ["Fitted by our team","We scribe the edges tight to the wall and ceiling, backed by our 12-month guarantee."]],
 "Show us your alcoves","Send a photo of the alcoves on WhatsApp or book a visit. We'll measure both sides and send a 3D design with an itemised quote.")
for k,d in D.items():
  d['proc_p']=F(d['proc_p']); d['steps']=[[F(a),F(b)] for a,b in d['steps']]
  if d['book_h']: d['book_h']=F(d['book_h'])
  if d['book_p']: d['book_p']=F(d['book_p'])
  json.dump(d,open(k+'.json','w'),ensure_ascii=False,indent=1)
print(len(D))
# shared-sentence check
from collections import Counter
c=Counter(s for d in D.values() for st in d['steps'] for s in [st[1]])
print([x for x,n in c.items() if n>1])
