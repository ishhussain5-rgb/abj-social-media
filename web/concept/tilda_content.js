/* 12 Nov 2026 (Ish approved): extra "In detail" sections on live pages for searches the site did not answer.
   Each entry adds <h3> + <p> blocks to the "In detail" copy, just before its link row (div.rel). Insert-only; idempotent
   (skips a page whose block already contains the first heading). Runs with abjLinkRun-style loop in the Tilda projects page. */
window.ABJ_CONTENT = {
  '/bespoke-kitchens': [
    ['Renovating your kitchen', 'If you are replacing an existing kitchen, we design the new one around what stays: the walls, windows, plumbing and sockets. Keeping the sink and hob roughly where they are now usually keeps the cost down. Once the kitchen is made, fitting usually takes one to two weeks, so it is worth setting up a temporary kitchen corner for that time.'],
    ['Kitchen islands with seating', 'An island needs space around it to work well. As a rough guide, allow about 100cm between the island and the units opposite. We can put the hob or sink in the island, add an overhang for bar stools, and fit deep drawers or bins underneath. At the design visit we will tell you whether your room suits an island or a peninsula.'],
    ['Kitchens for extensions and open-plan rooms', 'Building an extension? We can design the kitchen from your architect&rsquo;s or builder&rsquo;s drawings, so the plumbing, sockets and lighting go in the right places, then measure again once the walls are up. In an open-plan kitchen diner, the same doors and finishes can carry on into the dining and living space. See our <a href="/kitchen-design-peterborough">kitchen design service</a> for how the design visit works.']
  ],
  '/media-walls': [
    ['TV wall units, TV cabinets and TV units with a fireplace', 'Not everyone wants a full media wall. We also make TV wall units, low TV cabinets and floating TV units, and TV units with an electric fire set into the joinery. Each one is made to fit your wall, your screen size and everything you need to store, with the cables hidden.'],
    ['Home bars', 'A media wall or alcove can include a home bar: lit glass shelves, a wine rack, a drinks cupboard and a small worktop for serving. Our <a href="/case-study-kings-road-kitchen-peterborough">Kings Road project</a> in Peterborough has a dark bar wall next to the kitchen.']
  ],
  '/alcove-units': [
    ['Bookcases and library walls', 'For a bigger statement, we can run bookcases across a whole wall, even over a doorway, to make a library wall, with cupboards below and lighting in the shelves. Bookcases are made to your measurements, so they fit wall to wall and floor to ceiling.'],
    ['Window seats and bay windows', 'A window seat turns a bay or a deep window into somewhere to sit, with drawers or lift-up storage underneath. We make the seat to the exact shape of the bay, and our <a href="/upholstery">upholstery team</a> can make the cushion in a fabric you choose.']
  ],
  '/bespoke-bedrooms-abj': [
    ['Children&rsquo;s and teenagers&rsquo; bedrooms', 'Children&rsquo;s rooms need storage that keeps up as they grow. We make wardrobes with shelves and hanging rails that can be moved up later, built-in desks for homework, and plenty of drawer space for toys and clothes. In smaller box rooms and rooms under the eaves, everything is made to fit the space you have.']
  ],
  '/sliding-wardrobes': [
    ['Replacement wardrobe doors', 'If your wardrobe frame is still sound, you may only need new doors. We can make replacement sliding doors in mirror, glass, woodgrain or painted panels to fit your existing opening, or replace the whole front for a new look. Send us a photo and the size of the opening on WhatsApp and we will tell you what is possible.']
  ],
  '/near-me-peterborough': [
    ['Fitted wardrobes and media walls near you', 'As well as kitchens, we make <a href="/bespoke-wardrobes">fitted wardrobes</a>, <a href="/sliding-wardrobes">sliding wardrobes</a>, <a href="/walk-in-wardrobes">walk-in wardrobes</a> and <a href="/media-walls">media walls</a> for homes across Peterborough, all designed at your home and made in our workshop.'],
    ['Areas of Peterborough we cover', 'We work in every part of the city, including Hampton, Orton, Werrington, Bretton, Stanground, Cardea and Great Haddon, and in nearby places such as Yaxley, Thorney, Ramsey, Crowland and Holbeach.'],
    ['New-build homes', 'New homes in Hampton, Cardea and Great Haddon often come with a basic kitchen and empty bedrooms. We fit wardrobes into new bedrooms, build media walls in open-plan living rooms and replace developer kitchens, planning around the plumbing and sockets that are already there.']
  ]
};
window.ABJ_REPLACE = {
  '/fitted-kitchens-bedrooms-grantham': [['Great Gonerby, Barrowby, Harlaxton and Londonthorpe.', 'Great Gonerby, Barrowby, Harlaxton and Londonthorpe, and across to Sleaford.']]
};
window.abjContent = function (c, alias) {
  const add = window.ABJ_CONTENT[alias], rep = window.ABJ_REPLACE[alias], done = [];
  if (add) {
    if (c.includes('>' + add[0][0] + '</h3>')) done.push('content:already');
    else {
      const di = c.indexOf('<section class="det"'); if (di < 0) return { code: c, done: ['no det'] };
      const ri = c.indexOf('<div class="rel">', di); const de = c.indexOf('</section>', di);
      if (ri < 0 || ri > de) return { code: c, done: ['no rel in det'] };
      const H = 'style="font-size:clamp(24px,1.9vw,32px);margin:34px 0 14px"';
      const html = add.map(([h, p]) => '<h3 ' + H + '>' + h + '</h3>\n  <p>' + p + '</p>\n  ').join('');
      c = c.slice(0, ri) + html + c.slice(ri); done.push('content+' + add.length);
    }
  }
  if (rep) for (const [a, b] of rep) {
    if (c.includes(b)) { done.push('replace:already'); continue; }
    const n = c.split(a).length - 1; if (n < 1) { done.push('replace:not found'); continue; }
    c = c.split(a).join(b); done.push('replace x' + n);
  }
  return { code: c, done };
};
