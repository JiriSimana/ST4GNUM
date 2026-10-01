/* ============================================================
   STAGNUM — sdílené prvky (nav, patička, lightbox, toast)
   Injektuje se do všech stránek → jeden zdroj pravdy.
   <body data-page="home|drevostavby|zdene-domy|rekonstrukce|...">
   ============================================================ */
(function () {
  const page = document.body.dataset.page || 'home';
  const home = page === 'home';
  // kotva na sekci: na Domů #x, jinde index.html#x
  const a = (id) => (home ? '#' + id : 'index.html#' + id);
  // kontakt/poptávka = samostatná podstránka (kvůli měření konverzí)
  const kontaktHref = 'kontakt.html';

  const logo = '<svg viewBox="0 0 200 190" aria-hidden="true"><use href="#puzzleHouse"></use></svg>';

  const nav = `
  <div class="header" id="header">
  <div class="topbar">
    <div class="topbar__inner container">
      <div class="topbar__links">
        <a href="drevostavby.html">Dřevostavby</a>
        <a href="zdene-domy.html">Zděné domy</a>
        <a href="rekonstrukce.html">Rekonstrukce</a>
        <a href="${a('instalace')}" class="topbar__mini">Voda · topení · elektro</a>
      </div>
      <div class="topbar__right">
        <a href="mailto:info@stagnum.cz" class="topbar__contact">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>info@stagnum.cz</a>
        <a href="tel:+420733420275" class="topbar__contact">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>733 420 275</a>
        <a href="${a('kalkulacka')}" class="topbar__cta">Spočítat cenu online</a>
      </div>
    </div>
  </div>
  <header class="nav" id="nav">
    <div class="nav__inner">
      <a href="index.html" class="nav__brand">
        <svg viewBox="0 0 200 190" class="nav__logo" aria-hidden="true"><use href="#puzzleHouse"></use></svg>
        <span class="nav__name">STAGNUM<small>for better living</small></span>
      </a>
      <nav class="nav__links" id="navLinks">
        <div class="nav__has-sub">
          <button class="nav__sub-toggle" aria-expanded="false">Služby
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="nav__dropdown">
            <a href="drevostavby.html"><strong>Dřevostavby na klíč</strong><span>Moderní, zdravé a úsporné bydlení</span></a>
            <a href="zdene-domy.html"><strong>Zděné domy na klíč</strong><span>Pevný základ na celý život</span></a>
            <a href="rekonstrukce.html"><strong>Rekonstrukce bytů</strong><span>Nový domov bez starostí</span></a>
            <a href="${a('instalace')}" class="nav__dropdown-mini"><strong>Voda · topení · elektro</strong><span>Instalatérské práce</span></a>
          </div>
        </div>
        <a href="${a('realizace')}">Realizace</a>
        <a href="${a('proc-my')}">Proč my</a>
        <a href="${kontaktHref}">Kontakt</a>
      </nav>
      <a href="${kontaktHref}" class="nav__cta">Nezávazná poptávka</a>
      <button class="nav__burger" id="navBurger" aria-label="Otevřít menu"><span></span><span></span><span></span></button>
    </div>
  </header>
  </div>`;

  const footer = `
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__col footer__col--brand">
        <div class="footer__brand">
          <svg viewBox="0 0 200 190" class="footer__logo" aria-hidden="true"><use href="#puzzleHouse"></use></svg>
          <div><strong>STAGNUM s.r.o.</strong><span>for better living</span></div>
        </div>
        <p class="footer__desc">Rodinná stavební firma z&nbsp;Plzně. Dřevostavby a&nbsp;zděné domy na klíč, kompletní rekonstrukce bytů — od první myšlenky po předání klíčů.</p>
      </div>
      <div class="footer__col">
        <strong class="footer__h">Služby</strong>
        <a href="drevostavby.html">Dřevostavby na klíč</a>
        <a href="zdene-domy.html">Zděné domy na klíč</a>
        <a href="rekonstrukce.html">Rekonstrukce bytů</a>
        <a href="${a('instalace')}">Voda · topení · elektro</a>
      </div>
      <div class="footer__col">
        <strong class="footer__h">Kontakt</strong>
        <a href="tel:+420733420275">733 420 275</a>
        <a href="tel:+420604528704">604 528 704</a>
        <a href="mailto:info@stagnum.cz">info@stagnum.cz</a>
        <a href="${kontaktHref}">Nezávazná poptávka →</a>
      </div>
      <div class="footer__col">
        <strong class="footer__h">Firma</strong>
        <span>Slovanská 1404/191, Plzeň</span>
        <span>IČO: 10914340</span>
        <span>DIČ: CZ10914340</span>
        <span>Po–Pá 8–18</span>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© 2026 STAGNUM s.r.o. — Plzeň a&nbsp;okolí · www.stagnum.cz</span>
      <div class="footer__legal">
        <a href="obchodni-podminky.html">Obchodní podmínky</a>
        <a href="ochrana-osobnich-udaju.html">Ochrana osobních údajů</a>
        <a href="#" aria-label="Facebook">Facebook</a>
        <a href="#" aria-label="Instagram">Instagram</a>
      </div>
    </div>
  </footer>`;

  const lightbox = `
  <div class="lightbox" id="lightbox" aria-hidden="true">
    <button class="lightbox__close" id="lightboxClose" aria-label="Zavřít video">✕</button>
    <div class="lightbox__inner">
      <video id="lightboxVideo" src="media/rekonstrukce-bytu.mp4" controls playsinline preload="none"></video>
      <p>Naše realizace — video</p>
    </div>
  </div>`;

  const toast = '<div class="toast" id="toast" role="status">✓ Děkujeme, ozveme se do 48 hodin.</div>';

  function inject(sel, html) { const n = document.querySelector(sel); if (n) n.innerHTML = html; }
  inject('[data-layout="nav"]', nav);
  inject('[data-layout="footer"]', footer);

  /* pravá rozjížděcí nabídka — rychlé přepnutí služby / poptávka (jen podstránky služeb) */
  const SVC = {
    'drevostavby': ['drevostavby.html', 'Dřevostavby'],
    'zdene-domy': ['zdene-domy.html', 'Zděné domy'],
    'rekonstrukce': ['rekonstrukce.html', 'Rekonstrukce'],
  };
  if (SVC[page] || home) {
    const ic = {
      drevostavby: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-6h6v6"/></svg>',
      zdeny: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="1"/><path d="M3 11V7h6v4M9 7V3h6v8M15 11V7h6v4"/></svg>',
      reno: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18M19 21V11l-6-4"/></svg>',
      mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
    };
    const items = [
      ['drevostavby.html', 'Dřevostavby', ic.drevostavby, 'drevostavby'],
      ['zdene-domy.html', 'Zděné domy', ic.zdeny, 'zdene-domy'],
      ['rekonstrukce.html', 'Rekonstrukce', ic.reno, 'rekonstrukce'],
    ];
    const rail = '<nav class="siderail" aria-label="Rychlé přepnutí služby">'
      + items.map(([h, l, i, k]) => `<a href="${h}" class="siderail__item${k === page ? ' is-current' : ''}">${i}<span>${l}</span></a>`).join('')
      + `<a href="${kontaktHref}" class="siderail__item siderail__cta">${ic.mail}<span>Poptávka</span></a>`
      + '</nav>';
    document.body.insertAdjacentHTML('beforeend', rail);
  }
  // lightbox + toast přidat na konec body, pokud ještě nejsou
  if (!document.getElementById('lightbox')) document.body.insertAdjacentHTML('beforeend', lightbox);
  if (!document.getElementById('toast')) document.body.insertAdjacentHTML('beforeend', toast);
})();
