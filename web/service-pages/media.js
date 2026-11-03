/* ABJ service pages: per-page media (hero reel, film reel, tile photos) and film copy. Paths are relative to media/. */
(function(){
function C(k,x,f){return {v:'abj-'+k+'-'+x+'-'+f+'.mp4',p:'abj-'+k+'-'+x+'-'+f+'-poster.webp'}}
/* two long, slow clips per page that crossfade, exactly like the homepage hero */
function H(k,a,b){return {wide:[C(k,'A','wide'),C(k,'B','wide')],tall:[C(k,'A','v'),C(k,'B','v')],caps:[a,b]}}
function F(k,o){o.v='abj-'+k+'-film-v.mp4';o.p='abj-'+k+'-film-v-poster.webp';return o}
var M={};
M.kitchens=H('kitchens','Navy handleless kitchen','Marble-effect worktops & wine cooler');
M.kitchens.img={'Shaker Kitchens':'abj-kitchens-tile-shaker.webp','Traditional & In-Frame':'abj-kitchens-tile-traditional.webp'};
M.kitchens.film={v:'abj-kitchens-feature-v.mp4',p:'abj-kitchens-feature-v-poster.webp',label:'Sage Shaker kitchen',kicker:'Made in Peterborough',title:'Built in our own workshop, fitted by our own team',
 text:'Every cabinet is measured, designed and made here in Peterborough, then installed by the same team that drew it. One point of contact from first sketch to final handover.'};

M.wardrobes=H('wardrobes','Fitted hinged wardrobes','Fluted doors & wardrobe interiors');
M.wardrobes.img={'Fitted Wardrobes':'abj-wardrobes-tile-fitted.webp','Sliding Wardrobes':'abj-wardrobes-tile-sliding.webp','Walk-In Dressing Rooms':'abj-wardrobes-tile-walkin.webp',
 'Door styles & finishes':'abj-wardrobes-tile-fitted.webp','Purposeful interiors':'abj-wardrobes-tile-walkin.webp','Mirrors & integrated lighting':'abj-wardrobes-tile-sliding.webp'};
M.wardrobes.film=F('wardrobes',{label:'Wardrobe interiors',kicker:'Inside the doors',title:'Planned around what you actually own',
 text:'Drawers, trays, shoe racks and hanging heights are set out around your clothes before anything is made. Every wardrobe is built to the millimetre in our Peterborough workshop.'});

M.bedrooms=H('bedrooms','Arched dressing area with LED lighting','LED dressing table');
M.bedrooms.img={'Contemporary Bedrooms':'abj-bedrooms-tile-contemporary.webp','Classic Bedrooms':'abj-bedrooms-tile-classic.webp','Luxury Master Suites':'abj-bedrooms-tile-luxury.webp',
 'Feature headboard walls':'abj-bedrooms-tile-classic.webp','Integrated lighting':'abj-bedrooms-tile-luxury.webp'};
M.bedrooms.film=F('bedrooms',{label:'LED dressing table',kicker:'Made in Peterborough',title:'One room, designed as a whole',
 text:'Wardrobes, dressing tables, bedside units and lighting are drawn together so the room feels calm and complete. We make it all in our own workshop and fit it ourselves.'});

M.mediawalls=H('mediawalls','Media wall with integrated lighting','Slatted media wall with fire');
M.mediawalls.film=F('mediawalls',{label:'Slatted media wall with fire',kicker:'Made in Peterborough',title:'A media wall that hides everything but the view',
 text:'Cables, consoles and soundbars are planned in from the start, with the fire, lighting and storage built around your screen. Made in our workshop and fitted by our own team.'});

M.storage=H('storage','Hidden drinks cabinet','Made-to-measure drawers');
M.storage.film=F('storage',{label:'Hidden drinks cabinet',kicker:'Made to measure',title:'Storage that disappears into the room',
 text:'From under-stair drawers to a drinks cabinet behind tall doors, every unit is measured on site and built around the space, so it looks like it was always meant to be there.'});

M.worktops=H('worktops','Marble-effect waterfall island','Marble-effect worktops');
M.worktops.film=F('worktops',{label:'Waterfall island',kicker:'Templated and fitted',title:'The surface you touch every day',
 text:'We help you choose the material, then template, supply and fit it as part of your project, with the cut-outs, edges and upstands all finished properly.'});

M.bathroom=H('bathroom','Freestanding bath & fitted vanity','Fluted double vanity');
M.bathroom.film=F('bathroom',{label:'Fluted double vanity',kicker:'Peterborough workshop',title:'Finished by hand, made for daily use',
 text:'Every vanity unit is measured, cut and finished by hand in our Peterborough workshop, then fitted by the same team, so it sits perfectly around your basin, pipework and walls.'});

M.office=H('office','Built-in home office','Desk & shelving');
M.office.film=F('office',{label:'Home office shelving',kicker:'Made to measure',title:'A workspace that fits the room, not the other way round',
 text:'Desks, shelving and storage are planned around how you work, then built in our Peterborough workshop and fitted by our own team.'});

M.decors=H('decors','Panelled living room','Slatted feature walls');
M.decors.film=F('decors',{label:'Slatted feature wall',kicker:'Made in Peterborough',title:'Walls with texture, light and purpose',
 text:'Slatted, panelled and lit feature walls designed around the room, often combined with storage, shelving or a dressing area so the wall works as hard as it looks.'});

M.upholstery=H('upholstery','Upholstered wall panels','Upholstered headboard');
M.hallways=H('hallways','Slatted hallway storage','Hallway storage & coat hooks');
M.hmo=H('hmo','Practical, hard-wearing fit-outs','Shared kitchen');
window.ABJ_SLIM_MEDIA=M;
})();
