/* 20 Nov 2026 live roll-out: ABJ A11Y (tfA11y) + footer links to the new pages.
   ABJ column: "Design your room" and "3D designs" after "Budget planner". Visit column: Polski / Lietuviu / Russkiy after
   "Send an enquiry". Each insert happens once and only where its anchor exists. */
window.tfLiveRound = function (c) {
  var n = window.tfA11y(c) || c;
  var A = '<li><a href="/budget-planner">Budget planner</a></li>';
  if (n.indexOf('<a href="/3d-designs">3D designs</a></li>') < 0 && n.split(A).length === 2)
    n = n.replace(A, A + '<li><a href="/design-your-room">Design your room</a></li><li><a href="/3d-designs">3D designs</a></li>');
  var V = '<a href="/bookingform">Send an enquiry</a>';
  if (n.indexOf('hreflang="pl">Polski</a> &middot;') < 0 && n.split(V).length === 2)
    n = n.replace(V, V + '<br><a href="/pl" lang="pl" hreflang="pl">Polski</a> &middot; <a href="/lt" lang="lt" hreflang="lt">Lietuvių</a> &middot; <a href="/ru" lang="ru" hreflang="ru">Русский</a>');
  return n === c ? null : n;
};
