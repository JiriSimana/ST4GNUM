/* ============================================================
   STAGNUM — for better living
   GSAP + ScrollTrigger + Lenis
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 1024px)').matches;

/* ------------------------------------------------------------
   Plynulý scroll (Lenis)
------------------------------------------------------------ */
let lenis = null;
if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
  lenis = new Lenis({ duration: 0.85, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -64 });
        nav.classList.remove('menu-open');
      }
    });
  });
}

/* ------------------------------------------------------------
   Izometrický dům — loader + scroll sekce
------------------------------------------------------------ */
const loaderLayers = window.renderIsoHouse(document.getElementById('loaderHouse'));
const buildLayers = window.renderIsoHouse(document.getElementById('buildHouse'));

/* ------------------------------------------------------------
   Build fáze — dřevostavba / zděný dům
------------------------------------------------------------ */
const PHASES = {
  drevo: [
    ['Základová deska', 'Připravíme pozemek a založíme stavbu na přesné betonové desce.'],
    ['Podlahový rošt', 'Izolovaná dřevěná podlaha drží teplo tam, kde má být — uvnitř.'],
    ['Stěnové panely', 'Nosné stěny stavíme stojku po stojce, přesně podle projektu.'],
    ['Příčky a rozvody', 'Vnitřní stěny a instalace vody, topení i elektřiny.'],
    ['Krov', 'Tesařská konstrukce střechy z poctivého dřeva.'],
    ['Střecha', 'Krytina, okapy a klempířina. Dům je pod střechou — a my v termínu.'],
    ['Okna a dveře', 'Osazení oken a vstupních dveří. Stavba je uzavřená.'],
    ['Dokončení a předání', 'Fasáda, detaily, úklid. Přebíráte klíče od hotového domova.'],
  ],
  zdeny: [
    ['Základová deska', 'Vybetonujeme základové pasy a nosnou desku.'],
    ['Hydroizolace', 'Ochrana stavby proti vlhkosti a radonu.'],
    ['Obvodové zdivo', 'Vyzdíme nosné obvodové stěny z kvalitních cihel.'],
    ['Příčky a rozvody', 'Vnitřní zdivo a instalace vody, topení i elektřiny.'],
    ['Stropy a krov', 'Stropní konstrukce a tesařský krov střechy.'],
    ['Střecha', 'Krytina, okapy a klempířina. Dům je pod střechou.'],
    ['Okna a dveře', 'Osazení oken a vstupních dveří. Stavba je uzavřená.'],
    ['Dokončení a předání', 'Omítky, fasáda, úklid. Přebíráte klíče.'],
  ],
};

const phasesEl = document.getElementById('buildPhases');
let phaseItems = [];

function renderPhases(mode) {
  phasesEl.innerHTML = PHASES[mode]
    .map(([t, d], i) => `<li data-phase="${i}"><strong>${t}</strong><span>${d}</span></li>`)
    .join('');
  phaseItems = phasesEl.querySelectorAll('li');
}
function setPhase(n) {
  phaseItems.forEach((li, i) => li.classList.toggle('is-active', i === n));
}
renderPhases('drevo');

const buildToggle = document.getElementById('buildToggle');
buildToggle.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  buildToggle.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
  btn.classList.add('is-active');
  renderPhases(btn.dataset.mode);
  setPhase(currentPhase);
});

let currentPhase = 0;

/* ------------------------------------------------------------
   Loading screen + hero intro
------------------------------------------------------------ */
const preloader = document.getElementById('preloader');
const nav = document.getElementById('nav');

function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('#uvod .hero__title .line > span', { yPercent: 110, duration: 0.7, stagger: 0.1, ease: 'power4.out' }, 0);
  tl.from(['#uvod .hero__eyebrow', '#uvod .hero__sub', '#uvod .hero__cta', '#uvod .hero__features'],
    { y: 22, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.25);
  tl.from('.nav__inner', { y: -22, opacity: 0, duration: 0.5 }, 0.15);
  tl.from('#uvod .hero__scroll', { opacity: 0, duration: 0.4 }, 0.9);
  /* pomalý Ken Burns na hero fotce */
  gsap.fromTo('#uvod .svc-hero__img', { scale: 1.08 }, { scale: 1, duration: 6, ease: 'power1.out' });
}

(function startLoader() {
  if (prefersReducedMotion) { preloader.style.display = 'none'; heroIntroStatic(); return; }
  const tl = gsap.timeline();
  gsap.set(loaderLayers, { y: -240, opacity: 0 });
  tl.to(loaderLayers, { y: 0, opacity: 1, duration: 0.48, stagger: 0.085, ease: 'back.out(1.6)' }, 0.05)
    .from('.preloader__text', { opacity: 0, y: 12, duration: 0.4 }, '-=0.55')
    .to(preloader, { yPercent: -100, duration: 0.65, ease: 'power4.inOut', delay: 0.12, onComplete: () => { preloader.style.display = 'none'; } })
    .add(heroIntro, '-=0.35');
})();
function heroIntroStatic() {}

/* ------------------------------------------------------------
   Scroll sekce: dům se skládá
------------------------------------------------------------ */
if (!prefersReducedMotion) {
  buildLayers.forEach((layer, i) => { if (i > 0) gsap.set(layer, { y: -90, opacity: 0 }); });
  setPhase(0);

  const buildTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#buildStage',
      start: isMobile ? 'top 70%' : 'top 12%',
      end: isMobile ? '+=850' : '+=1250',
      scrub: 0.35,
      pin: !isMobile,
      snap: { snapTo: 1 / 7, duration: { min: 0.15, max: 0.4 }, ease: 'power1.inOut' },
      onUpdate: (self) => { currentPhase = Math.min(7, Math.floor(self.progress * 8)); setPhase(currentPhase); },
    },
  });
  for (let i = 1; i <= 7; i++) {
    buildTl.to(buildLayers[i], { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)' }, (i - 1) * 0.85);
    if (i === 3) buildTl.to(buildLayers[3], { opacity: 0, duration: 0.3, ease: 'none' }, i * 0.85 + 0.45);
  }
  buildTl.to('#buildHouse', { scale: 1.02, transformOrigin: 'center', duration: 0.4, yoyo: true, repeat: 1 }, 6.0);
} else {
  gsap.set(buildLayers[3], { opacity: 0 });
  setPhase(7);
}

/* ------------------------------------------------------------
   Skladba stěn a podlah (3. signature vizualizace)
------------------------------------------------------------ */
const wallSvg = document.getElementById('wallSvg');
const wallPhasesEl = document.getElementById('wallPhases');
const wallNote = document.getElementById('wallNote');
const wallToggle = document.getElementById('wallToggle');
let wallItems = [];
let wallTl = null;

function setWallPhase(k) { wallItems.forEach((li, i) => li.classList.toggle('is-active', i === k)); }

function setupWall(mode) {
  const layers = window.renderWall(wallSvg, mode);
  const set = window.wallData[mode];
  wallNote.textContent = set.note;
  wallPhasesEl.innerHTML = set.layers
    .map((l) => `<li><strong>${l.n}</strong><span>${l.d}</span></li>`).join('');
  wallItems = wallPhasesEl.querySelectorAll('li');

  if (wallTl) { if (wallTl.scrollTrigger) wallTl.scrollTrigger.kill(); wallTl.kill(); wallTl = null; }

  if (prefersReducedMotion) {
    layers.forEach((g) => gsap.set(g, { opacity: 1, y: 0 }));
    setWallPhase(layers.length - 1);
    return;
  }
  layers.forEach((g) => gsap.set(g, { opacity: 0, y: -40 }));
  setWallPhase(0);
  const n = layers.length;
  wallTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#wallStage',
      start: isMobile ? 'top 78%' : 'top 70%',
      end: isMobile ? 'bottom 90%' : 'bottom 80%',
      scrub: 0.4,
      onUpdate: (self) => setWallPhase(Math.min(n - 1, Math.floor(self.progress * n))),
    },
  });
  layers.forEach((g, i) => wallTl.to(g, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.3)' }, i * 0.7));
}

if (wallSvg) {
  setupWall('stena-otevrena');
  wallToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    wallToggle.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    setupWall(btn.dataset.mode);
    ScrollTrigger.refresh();
  });
}

/* ------------------------------------------------------------
   Nav: scrolled + dropdown + mobilní menu
------------------------------------------------------------ */
const burger = document.getElementById('navBurger');
function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 40); }
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

burger.addEventListener('click', () => nav.classList.toggle('menu-open'));

/* dropdown "Služby" — na mobilu klik, na desktopu hover (CSS) */
const subToggle = document.querySelector('.nav__sub-toggle');
const hasSub = document.querySelector('.nav__has-sub');
if (subToggle) {
  subToggle.addEventListener('click', (e) => {
    if (window.matchMedia('(max-width: 640px)').matches) {
      e.preventDefault();
      hasSub.classList.toggle('is-open');
    }
  });
}

/* ------------------------------------------------------------
   Service hero — reveal + Ken Burns
------------------------------------------------------------ */
if (!prefersReducedMotion) {
  document.querySelectorAll('#drevostavby, #zdene-domy, #rekonstrukce').forEach((sec) => {
    gsap.from(sec.querySelectorAll('.svc-hero__eyebrow, .svc-hero__title, .svc-hero__sub, .svc-hero__cta, .svc-hero__feats > *'), {
      y: 30, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out',
      scrollTrigger: { trigger: sec, start: 'top 55%' },
    });
    gsap.fromTo(sec.querySelector('.svc-hero__img'),
      { scale: 1.14 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ------------------------------------------------------------
   Obecné scroll reveals
------------------------------------------------------------ */
function reveal(targets, opts = {}) {
  gsap.utils.toArray(targets).forEach((el, i) => {
    gsap.from(el, {
      y: 34, opacity: 0, duration: 0.7, ease: 'power3.out',
      delay: (opts.stagger || 0) * (i % (opts.group || 4)),
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });
}
if (!prefersReducedMotion) {
  reveal('.section__head');
  reveal('.step', { stagger: 0.09, group: 4 });
  reveal('.reno__video');
  reveal('.reno__quote');
  reveal('.stat', { stagger: 0.1, group: 3 });
  reveal('.calc');
  reveal('.why__content');
  reveal('.why__visual');
  reveal('.partners');
  reveal('.ref-card', { stagger: 0.08, group: 3 });
  reveal('.banner__inner');
  reveal('.contact__info');
  reveal('.contact__form');

  gsap.to('#processLineFill', {
    width: '100%', ease: 'none',
    scrollTrigger: { trigger: '.reno__steps', start: 'top 75%', end: 'bottom 60%', scrub: 0.6 },
  });
  gsap.to('.banner__house', { y: -10, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
}

/* ------------------------------------------------------------
   Počítadla
------------------------------------------------------------ */
document.querySelectorAll('.counter').forEach((el) => {
  const target = parseInt(el.dataset.target, 10);
  if (prefersReducedMotion) { el.textContent = target; return; }
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target, duration: 1.6, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 92%' },
    onUpdate: () => { el.textContent = Math.round(obj.val); },
  });
});

/* ------------------------------------------------------------
   KALKULAČKA
   TODO-KLIENT: sazba a násobky jsou ilustrační — doplnit z cenotvorby
------------------------------------------------------------ */
const RATE_PER_M2 = 38000; // Kč/m² — TODO-KLIENT

const areaInput = document.getElementById('areaInput');
const areaOut = document.getElementById('areaOut');
const priceOut = document.getElementById('calcPrice');
const typeSeg = document.getElementById('typeSeg');
const standardSeg = document.getElementById('standardSeg');
const finishSeg = document.getElementById('finishSeg');
const levelHint = document.getElementById('levelHint');

const LEVEL_HINTS = {
  'Základ': 'Základ — kvalitní standardní provedení připravené k bydlení.',
  'Comfort': 'Comfort — nadstandardní vybavení a materiály pro pohodlnější bydlení.',
  'Premium': 'Premium — prémiové materiály a řešení na míru bez kompromisů.',
};

function activeMult(seg) { return parseFloat(seg.querySelector('.is-active').dataset.mult); }
function formatCZK(n) { return n.toLocaleString('cs-CZ').replace(/ /g, ' ') + ' Kč'; }

function recalc(animate = true) {
  const m2 = parseInt(areaInput.value, 10);
  areaOut.textContent = m2 + ' m²';
  areaInput.style.setProperty('--fill', ((m2 - 60) / (200 - 60)) * 100 + '%');

  const raw = m2 * RATE_PER_M2 * activeMult(typeSeg) * activeMult(standardSeg) * activeMult(finishSeg);
  const rounded = Math.round(raw / 50000) * 50000;

  if (animate && !prefersReducedMotion) {
    const start = parseInt(priceOut.dataset.value || rounded, 10);
    const obj = { val: start };
    gsap.to(obj, { val: rounded, duration: 0.5, ease: 'power2.out',
      onUpdate: () => { priceOut.textContent = formatCZK(Math.round(obj.val / 50000) * 50000); } });
  } else {
    priceOut.textContent = formatCZK(rounded);
  }
  priceOut.dataset.value = rounded;
}

areaInput.addEventListener('input', () => recalc(false));
[typeSeg, standardSeg, finishSeg].forEach((seg) => {
  seg.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    seg.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    if (seg === standardSeg && levelHint) levelHint.textContent = LEVEL_HINTS[btn.textContent.trim()] || '';
    recalc();
  });
});
recalc(false);

/* ------------------------------------------------------------
   Video — náhled + lightbox se zvukem
------------------------------------------------------------ */
(function videoLightbox() {
  const card = document.getElementById('videoCard');
  const preview = document.getElementById('refVideo');
  const lightbox = document.getElementById('lightbox');
  const lbVideo = document.getElementById('lightboxVideo');
  const lbClose = document.getElementById('lightboxClose');
  if (!card || !lightbox) return;

  function open() {
    lightbox.classList.add('is-open'); lightbox.setAttribute('aria-hidden', 'false');
    preview.pause(); lbVideo.currentTime = 0; lbVideo.muted = false; lbVideo.play();
    if (lenis) lenis.stop();
  }
  function close() {
    lightbox.classList.remove('is-open'); lightbox.setAttribute('aria-hidden', 'true');
    lbVideo.pause(); if (lenis) lenis.start();
  }
  card.addEventListener('click', open);
  card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  lbClose.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close(); });

  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) preview.play().catch(() => {}); else preview.pause();
  }, { threshold: 0.35 });
  io.observe(preview);
})();

/* ------------------------------------------------------------
   Formulář → toast
   TODO-KLIENT: napojit lead na e-mail info@stagnum.cz / aplikaci.
------------------------------------------------------------ */
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const toast = document.getElementById('toast');
  toast.classList.add('is-visible');
  setTimeout(() => toast.classList.remove('is-visible'), 4200);
  e.target.querySelectorAll('input, textarea').forEach((f) => { if (f.type === 'checkbox') f.checked = false; else f.value = ''; });
});
