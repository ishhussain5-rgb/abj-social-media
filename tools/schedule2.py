import json, datetime
CTA = ("\n\n📩 info@abjkitchensandbedrooms.co.uk\n"
       "💬 Or message us right here for a free, no-obligation quote\n"
       "📞 01733 686767 | WhatsApp 07479 219421\n"
       "🌐 https://abjkitchensandbedrooms.co.uk/\n"
       "📅 Book a consultation: https://abjkitchensandbedrooms.co.uk/bookingform\n"
       "📍 3 Brassey Close, Peterborough, PE1 2AZ")
V = {  # id -> (title, caption body, hashtags)
 'n06_drinks_cabinet': ("Wait for the hidden drinks cabinet 🥂", "Shaker doors on the outside, a fully lit drinks bar on the inside ✨ Made to measure in our Peterborough workshop.", "#kitchendesign #hiddenbar #peterborough"),
 'r16_kings_road': ("Handleless, bright & full of secrets 🤫", "Clean white runs, a roof lantern pouring in daylight ☀️ and storage hiding behind every push-to-open door.", "#handlelesskitchen #kitchenextension #peterborough"),
 'g2_led': ("One click and the whole room glows 💡", "A dressing table with a remote-controlled LED mirror and soft-close drawers ✨ Getting ready just got an upgrade.", "#dressingtable #ledmirror #peterborough"),
 'n03_waterfall_island': ("A waterfall island, gold veins and all ✨", "A gold-veined worktop running right down to the floor, wrapped around oak slats with a soft LED glow 🤍", "#kitchenisland #bespokekitchen #peterborough"),
 'p1_dark_kitchen': ("Dark timber under a roof lantern 🖤", "Moody timber, a brass feature wall and daylight pouring down from above ☀️ Proof that dark kitchens can still feel bright.", "#darkkitchen #rooflantern #peterborough"),
 'r11_abj_reel': ("Bedroom by night, office by day 💻", "A fitted desk, open shelving and a full wardrobe, all in one room 🛏️ Clock off and close the doors.", "#homeoffice #fittedfurniture #peterborough"),
 'n04_statement_island': ("This island steals the whole room 😍", "A statement marble island with a range cooker. Bold, beautiful and built to last 💪", "#kitchenisland #marblekitchen #peterborough"),
 'g4_drawers': ("Oddly satisfying soft-close drawers 😌", "Pull, glide, close 🔁 Deep drawers, cutlery inserts and soft-close runners in every room we fit.", "#satisfying #kitchendrawers #peterborough"),
 'r10_abj_media_wall': ("Oak slats, soft light, cinema nights 🍿", "Backlit slats and floating storage turn a plain wall into the centrepiece of the room 🎬", "#mediawall #tvwall #peterborough"),
 'n05_fluted_wardrobes': ("Fluted wardrobes, floor to ceiling 🤍", "Fluted doors, long black handles and not an inch of wall wasted 📏", "#fittedwardrobes #bedroomdesign #peterborough"),
 'p4_open_plan': ("Open-plan living, done properly 🏡", "Kitchen, dining and living in one flowing space 🛋️ Dark cabinetry, warm timber and room for everyone.", "#openplanliving #kitchendesign #peterborough"),
 'r04_kitchen_1': ("Watch how much this kitchen hides 👀", "Pull-outs, larders and hidden storage behind every handleless door 🙌", "#kitchenstorage #bespokekitchen #peterborough"),
 'n12_led_dressing': ("A dressing table that lights up the room 💄", "LED mirror, soft-close drawers and everything within reach ✨", "#dressingtable #bedroomdesign #peterborough"),
 'g3_bath': ("The bathroom you'd never leave 🛁", "Freestanding bath, brass taps, a stone-topped vanity and storage made to measure 🤍 Total calm.", "#bathroomdesign #bathroomgoals #peterborough"),
 'r19_0908_reel': ("Wait for the hidden coffee station ☕", "Daylight from the roof lantern, a sleek island and a coffee bar that disappears behind the doors when you're done 😍", "#coffeestation #kitchenextension #peterborough"),
 'n10_display_cabinet': ("Built to display. Made to be admired. ✨", "Glazed doors, warm lighting and handcrafted shelving for the things you love 🤍", "#displaycabinet #bespokefurniture #peterborough"),
 'p3_loft': ("A loft where every inch works 📐", "Wardrobes under the eaves, deep drawers, an LED mirror and even lift-up bed storage 🛏️ Awkward space, sorted.", "#loftconversion #fittedwardrobes #peterborough"),
 'r06_kitchen_4': ("Every corner earns its keep 🙌", "Corner drawers, a plate rack, a built-in wine rack and a patterned splashback full of character 🍷", "#shakerkitchen #kitchenstorage #peterborough"),
 'n13_dressing_room': ("From spare room to dressing room 👗", "Fluted doors, lit shelves and drawers for everything ✨ Your own walk-in, made to measure.", "#dressingroom #walkinwardrobe #peterborough"),
 'g1_navy15': ("Our navy kitchen in 15 seconds ⚡", "Navy handleless units, a gold-veined waterfall island, oak slats and brass taps 💙 Every inch designed, made and fitted by our own team.", "#navykitchen #kitchentour #peterborough"),
 'r14_abjreel': ("Dark kitchens just hit different 🖤", "Black cabinetry, warm timber and lighting that sets the mood 🔥", "#darkkitchen #kitchendesign #peterborough"),
 'n09_wardrobe_interior': ("It's what's inside that counts 💎", "Jewellery trays, pull-out shoe racks and drawers inside drawers 👠", "#wardrobeinterior #fittedwardrobes #peterborough"),
 'p2_oak_wall': ("Backlit oak, film night sorted 🎬", "Warm oak slats, hidden LED strips and floating storage around the TV 🍿 A media wall that makes the room.", "#mediawall #livingroomideas #peterborough"),
 'r01_abj_bedroom': ("Lift the bed. Find the storage. 🛏️", "Lift-up bed storage, a fitted desk and wardrobes that slide shut 🙌 Small bedroom, zero clutter.", "#bedroomstorage #smallbedroomideas #peterborough"),
 'n02_sage_kitchen_tour': ("The sage kitchen everyone asks about 🌿", "Sage green shaker doors, a marble island and a breakfast nook. Take the tour 👇", "#sagegreenkitchen #shakerkitchen #peterborough"),
 'g5_wardrobes': ("Wardrobes that go all the way up ⬆️", "Fluted doors, long black handles and brushed brass, fitted wall to wall and floor to ceiling 🤍", "#fittedwardrobes #bedroominspo #peterborough"),
 'r12_tims_house_2': ("Roof lantern, island, pure wow 🤩", "Daylight pouring over a handleless island ☀️ This is what kitchen dreams are made of.", "#kitchenextension #kitchenisland #peterborough"),
 'n07_bath': ("Freestanding bath, brass taps, total calm 🛁", "Bathroom cabinetry and a vanity made to measure around a freestanding bath 🤍", "#bathroomdesign #bathroomvanity #peterborough"),
 'p5_office': ("The home office hiding in a bedroom 🤫", "A fitted desk, warm oak shelves and sliding wardrobes 💻 Work all day, then close the doors.", "#homeoffice #wfh #peterborough"),
 'r15_favourite_features': ("Features we'd put in every kitchen ⭐", "Our favourite little upgrades that make a big difference every single day 🙌", "#kitchenideas #kitchendesign #peterborough"),
 'n08_breakfast_nook': ("Breakfast nook goals, made to measure 🥐", "A built-in bench, a round table and the best seat in the house ☕", "#breakfastnook #kitcheninspo #peterborough"),
 'g6_house': ("One house. Every room, ABJ. 🏠", "Kitchen, dressing room, bathroom and bedrooms, all designed, made and fitted by our own Peterborough team 🙌", "#homerenovation #bespokefurniture #peterborough"),
 'r07_laillas_kitchen': ("Marble, brass & a boiling-water tap ✨", "The little luxuries that make Laila's kitchen a joy to cook in 👩‍🍳", "#kitchendesign #luxurykitchen #peterborough"),
 'n01_navy_kitchen': ("Navy, brass & not a handle in sight 💙", "A navy handleless kitchen with brass details and a quartz worktop. Designed, made and fitted by our own team 🔨", "#navykitchen #handlelesskitchen #peterborough"),
 'p6_dining': ("Built-in seating for Sunday dinners 🍽️", "A fitted bench, a chunky timber table and a kitchen right alongside ❤️ The spot everyone fights over.", "#diningnook #kitcheninspo #peterborough"),
 'r17_kitchen_features_we_love': ("Small details, big difference ✨", "The finishing touches we love fitting in every kitchen 🔨", "#kitchendetails #bespokekitchen #peterborough"),
 'n11_vanity': ("A fluted vanity worth getting up for 🪞", "Fluted doors, a stone top and brushed brass 🤍 Bathroom cabinetry, made to measure.", "#bathroomvanity #flutedvanity #peterborough"),
 'n14_drawers': ("Every drawer exactly where you need it 🍳", "Deep pan drawers, soft-close runners and a place for everything 🙌", "#kitchendrawers #kitchenstorage #peterborough"),
}
C = {  # id -> (slides, title, body, hashtags)
 'c13_process': (6, "How it works, start to finish 🛠️", "From your free design visit to the final fit, it's all done by our own Peterborough team 🙌 Swipe through the 4 steps 👉", "#bespokekitchen #howitsmade #peterborough"),
 'c7_lantern': (6, "Kitchens under a roof lantern ☀️", "Daylight from above changes everything ✨ Which one's your favourite?", "#rooflantern #kitchenextension #peterborough"),
 'c3_details': (7, "5 details that make a kitchen feel expensive 💎", "Which one would you add to yours? Swipe through 👉", "#kitchenideas #luxurykitchen #peterborough"),
 'c16_dark_light': (4, "Dark or light? You decide 🖤🤍", "A or B? Drop your vote in the comments 👇", "#kitchendesign #kitcheninspo #peterborough"),
 'c2_which': (5, "Which kitchen would you choose? 🤔", "A, B or C? Tell us in the comments 👇", "#kitchendesign #kitcheninspo #peterborough"),
 'c8_bedroom_office': (6, "Bedroom meets home office 💻", "One room, two jobs, zero clutter 🙌 Swipe to see how it works.", "#homeoffice #bedroomdesign #peterborough"),
 'c1_reviews': (5, "Don't take our word for it ⭐⭐⭐⭐⭐", "Real words from real customers across Peterborough 🙏 Thank you to everyone who has trusted us with their home.", "#customerreviews #bespokekitchen #peterborough"),
 'c18_tips': (5, "5 questions to ask before you buy a kitchen 📝", "Save this one for your kitchen search 📌 And yes, we're happy to answer all five.", "#kitchenadvice #kitchenideas #peterborough"),
 'c15_living': (6, "Living rooms that feel finished 🛋️", "TV walls, floating storage and warm oak details ✨ Which would you go for?", "#livingroomideas #mediawall #peterborough"),
 'c10_hallway': (6, "First impressions start at the door 🚪", "Hallway and under-stair storage that keeps the clutter out of sight 🙌", "#hallwayideas #understairsstorage #peterborough"),
 'c4_mediawalls': (6, "Media walls, the room's centrepiece 📺", "Storage, lighting and a home for every cable ✨ Which would you go for?", "#mediawall #livingroomideas #peterborough"),
 'c12_myths': (5, "3 myths about bespoke kitchens 🙅", "Let's clear a few things up 👇 Got another question? Ask away in the comments.", "#bespokekitchen #kitchenadvice #peterborough"),
 'c17_dressing': (6, "A dressing table just for you 💄", "Lit display shelves, glass and brass details ✨ Your own space to get ready.", "#dressingtable #dressingroom #peterborough"),
 'c5_bedrooms': (6, "Bedrooms, built around you 🛏️", "Wardrobes and bedroom furniture fitted to the millimetre 📏", "#bedroomdesign #fittedwardrobes #peterborough"),
 'c9_loft': (6, "Loft storage, sorted 📐", "Awkward eaves turned into fitted wardrobes, drawers and a dressing area ✨", "#loftconversion #loftstorage #peterborough"),
 'c6_storage': (6, "Storage you'd never notice 👀", "Under the stairs, in the hallway and hiding in plain sight 🙌", "#understairsstorage #storageideas #peterborough"),
 'c11_charcoal': (6, "Charcoal, copper & oak 🔥", "A kitchen with real presence: handleless runs, a hidden pantry and ovens at eye level 👌", "#darkkitchen #handlelesskitchen #peterborough"),
 'c14_wardrobes': (6, "Wardrobes with a wow 😍", "Fitted wall to wall and floor to ceiling, planned inside and out around you ✨", "#fittedwardrobes #bedroomstorage #peterborough"),
}
videos = list(V)  # order already mixed
car_slots = {1: 'c13_process', 5: 'c7_lantern', 8: 'c3_details', 12: 'c16_dark_light', 17: 'c2_which', 20: 'c8_bedroom_office',
             22: 'c1_reviews', 25: 'c18_tips', 29: 'c15_living', 32: 'c10_hallway', 36: 'c4_mediawalls', 40: 'c12_myths',
             42: 'c17_dressing', 45: 'c5_bedrooms', 48: 'c9_loft', 50: 'c6_storage', 53: 'c11_charcoal', 55: 'c14_wardrobes'}
assert len(car_slots) == len(C) and len(videos) == 38
out = []; vi = 0; start = datetime.date(2026, 11, 3)
for s in range(56):
    d = start + datetime.timedelta(days=s // 2); t = '10:00:00' if s % 2 == 0 else '18:00:00'
    if s in car_slots:
        cid = car_slots[s]; n, title, body, tags = C[cid]
        out.append({'slot': s, 'date': f'{d}T{t}', 'kind': 'photo', 'id': cid, 'n': n, 'title': title, 'text': f'{title}\n\n{body}{CTA}\n\n{tags}'})
    else:
        vid = videos[vi]; vi += 1; title, body, tags = V[vid]
        out.append({'slot': s, 'date': f'{d}T{t}', 'kind': 'video', 'id': vid, 'title': title, 'text': f'{title}\n\n{body}{CTA}\n\n{tags}'})
json.dump(out, open('schedule2.json', 'w'), indent=1, ensure_ascii=False)
print(len(out), vi, max(len(o['text']) for o in out), max(len(o['title']) for o in out))
for o in out: print(o['date'], o['kind'], o['id'])
