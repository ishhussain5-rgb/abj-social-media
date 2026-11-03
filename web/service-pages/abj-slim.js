/* ABJ service pages (DEV) bootstrap. Keep this file stable: it reads version.txt (fresh from GitHub)
   and loads the bundle pinned to that commit, so updates never wait on CDN branch caching. */
(function(){var R='https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@',P='/web/service-pages/abj-slim-bundle.js';
function go(v){var s=document.createElement('script');s.src=R+v+P;document.head.appendChild(s)}
fetch('https://raw.githubusercontent.com/ishhussain5-rgb/abj-social-media/main/web/service-pages/version.txt',{cache:'no-cache'})
 .then(function(r){return r.ok?r.text():Promise.reject()}).then(function(t){t=t.trim();go(/^[0-9a-f]{7,40}$/.test(t)?t:'main')},function(){go('main')});
})();
