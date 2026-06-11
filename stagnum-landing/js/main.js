/* ============================================================
   ST4GNUM — for better living · Dřevostavby Plzeňsko
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
   Loading screen (~1.8 s) + hero intro
------------------------------------------------------------ */
const preloader = document.getElementById('preloader');

function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero__title .line > span', {
    yPercent: 110, duration: 0.7, stagger: 0.08, ease: 'power4.out',
  }, 0);
  tl.from(['.hero__eyebrow', '.hero__sub', '.hero__cta', '.hero__phones'], {
    y: 22, opacity: 0, duration: 0.6, stagger: 0.07,
  }, 0.25);
  tl.from('.calc', { y: 34, opacity: 0, scale: 0.97, duration: 0.7, ease: 'power3.out' }, 0.35);
  tl.from('.nav__inner', { y: -22, opacity: 0, duration: 0.5 }, 0.2);
  tl.from('.hero__scroll', { opacity: 0, duration: 0.4 }, 0.9);
}

/* start hned po parsování DOM — nečekáme na window.load (fonty/médiá),
   loader sám o sobě maskuje dotažení zdrojů */
(function startLoader() {
  if (prefersReducedMotion) {
    preloader.style.display = 'none';
    return;
  }

  /* vrstvy přiletí shora s bounce, pak loader odjede (~1.8 s celkem) */
  const tl = gsap.timeline();
  gsap.set(loaderLayers, { y: -240, opacity: 0 });

  tl.to(loaderLayers, {
    y: 0, opacity: 1,
    duration: 0.48,
    stagger: 0.085,
    ease: 'back.out(1.6)',
  }, 0.05)
    .from('.preloader__text', { opacity: 0, y: 12, duration: 0.4 }, '-=0.55')
    .to(preloader, {
      yPercent: -100, duration: 0.65, ease: 'power4.inOut', delay: 0.12,
      onComplete: () => { preloader.style.display = 'none'; },
    })
    .add(heroIntro, '-=0.35');
})();

/* ------------------------------------------------------------
   Scroll sekce: dům se skládá podle scroll pozice
------------------------------------------------------------ */
const phaseItems = document.querySelectorAll('#buildPhases li');

function setPhase(n) {
  phaseItems.forEach((li, i) => li.classList.toggle('is-active', i === n));
}

if (!prefersReducedMotion) {
  /* výchozí stav: jen základová deska */
  buildLayers.forEach((layer, i) => {
    if (i > 0) gsap.set(layer, { y: -90, opacity: 0 });
  });
  setPhase(0);

  const buildTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#buildStage',
      start: isMobile ? 'top 70%' : 'top 12%',
      end: isMobile ? '+=850' : '+=1250',
      scrub: 0.35,
      pin: !isMobile,
      snap: { snapTo: 1 / 7, duration: { min: 0.15, max: 0.4 }, ease: 'power1.inOut' },
      onUpdate: (self) => {
        const n = Math.min(7, Math.floor(self.progress * 8));
        setPhase(n);
      },
    },
  });

  /* fáze 1–7 přilétají postupně, svižně a s docvaknutím (fáze 0 = deska už stojí) */
  for (let i = 1; i <= 7; i++) {
    buildTl.to(buildLayers[i], {
      y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)',
    }, (i - 1) * 0.85);
    /* příčky (fáze 3) po usazení „zmizí" dovnitř domu za stěnami */
    if (i === 3) {
      buildTl.to(buildLayers[3], { opacity: 0, duration: 0.3, ease: 'none' }, i * 0.85 + 0.45);
    }
  }
  /* jemné dýchnutí na konci */
  buildTl.to('#buildHouse', { scale: 1.02, transformOrigin: 'center', duration: 0.4, yoyo: true, repeat: 1 }, 6.0);
} else {
  /* reduced motion: složený dům, příčky skryté (jsou uvnitř) */
  gsap.set(buildLayers[3], { opacity: 0 });
  setPhase(7);
}

/* ------------------------------------------------------------
   Nav + mobilní menu
------------------------------------------------------------ */
const nav = document.getElementById('nav');
const burger = document.getElementById('navBurger');

function onScroll() {
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

burger.addEventListener('click', () => nav.classList.toggle('menu-open'));
document.querySelectorAll('.nav__links a').forEach((a) =>
  a.addEventListener('click', () => nav.classList.remove('menu-open'))
);

/* ------------------------------------------------------------
   KALKULAČKA
   TODO-KLIENT: sazba za m² je ilustrační — doplnit z cenotvorby
------------------------------------------------------------ */
const RATE_PER_M2 = 38000; // Kč/m² — TODO-KLIENT: doplnit reálnou sazbu

const areaInput = document.getElementById('areaInput');
const areaOut = document.getElementById('areaOut');
const priceOut = document.getElementById('calcPrice');
const standardSeg = document.getElementById('standardSeg');
const finishSeg = document.getElementById('finishSeg');

function activeMult(seg) {
  return parseFloat(seg.querySelector('.is-active').dataset.mult);
}

function formatCZK(n) {
  return n.toLocaleString('cs-CZ').replace(/ /g, ' ') + ' Kč';
}

function recalc(animate = true) {
  const m2 = parseInt(areaInput.value, 10);
  areaOut.textContent = m2 + ' m²';
  /* fill efekt slideru */
  const pct = ((m2 - 60) / (200 - 60)) * 100;
  areaInput.style.setProperty('--fill', pct + '%');

  const raw = m2 * RATE_PER_M2 * activeMult(standardSeg) * activeMult(finishSeg);
  const rounded = Math.round(raw / 50000) * 50000;

  if (animate && !prefersReducedMotion) {
    const start = parseInt(priceOut.dataset.value || rounded, 10);
    const obj = { val: start };
    gsap.to(obj, {
      val: rounded, duration: 0.5, ease: 'power2.out',
      onUpdate: () => { priceOut.textContent = formatCZK(Math.round(obj.val / 50000) * 50000); },
    });
  } else {
    priceOut.textContent = formatCZK(rounded);
  }
  priceOut.dataset.value = rounded;
}

areaInput.addEventListener('input', () => recalc(false));
[standardSeg, finishSeg].forEach((seg) => {
  seg.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    seg.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    recalc();
  });
});
recalc(false);

/* ------------------------------------------------------------
   Hero dust (jemné částice)
------------------------------------------------------------ */
(function dust() {
  if (prefersReducedMotion) return;
  const canvas = document.getElementById('dust');
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = Math.min(24, Math.floor(window.innerWidth / 70));
  const dots = [];
  for (let i = 0; i < COUNT; i++) {
    dots.push({
      x: Math.random(), y: Math.random(),
      r: 1.5 + Math.random() * 5,
      speed: 0.00018 + Math.random() * 0.00045,
      drift: Math.random() * Math.PI * 2,
      alpha: 0.04 + Math.random() * 0.1,
    });
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.y -= d.speed;
      if (d.y < -0.05) { d.y = 1.05; d.x = Math.random(); }
      const wob = Math.sin(t * 0.0009 + d.drift) * 0.012;
      ctx.beginPath();
      ctx.arc((d.x + wob) * w, d.y * h, d.r * devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 204, 201, ${d.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* ------------------------------------------------------------
   Marquee
------------------------------------------------------------ */
if (!prefersReducedMotion) {
  gsap.to('#marqueeTrack', { xPercent: -33.333, duration: 24, ease: 'none', repeat: -1 });
}

/* ------------------------------------------------------------
   Scroll reveals
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
  reveal('.trust__item', { stagger: 0.09, group: 3 });
  reveal('.ref-card', { stagger: 0.08, group: 3 });
  reveal('.step', { stagger: 0.09, group: 4 });
  reveal('.why__content');
  reveal('.why__visual');
  reveal('.banner__inner');
  reveal('.contact__info');
  reveal('.contact__form');

  gsap.to('#processLineFill', {
    width: '100%', ease: 'none',
    scrollTrigger: {
      trigger: '.process__steps',
      start: 'top 75%',
      end: 'bottom 55%',
      scrub: 0.6,
    },
  });

  gsap.to('.banner__house', {
    y: -10, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut',
  });
}

/* ------------------------------------------------------------
   Počítadla (trust strip)
------------------------------------------------------------ */
document.querySelectorAll('.counter').forEach((el) => {
  const target = parseInt(el.dataset.target, 10);
  if (prefersReducedMotion) { el.textContent = target; return; }
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target, duration: 1.6, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 90%' },
    onUpdate: () => { el.textContent = Math.round(obj.val); },
  });
});

/* ------------------------------------------------------------
   Video — náhled v kartě, celé video se zvukem v lightboxu
------------------------------------------------------------ */
(function videoLightbox() {
  const card = document.getElementById('videoCard');
  const preview = document.getElementById('refVideo');
  const lightbox = document.getElementById('lightbox');
  const lbVideo = document.getElementById('lightboxVideo');
  const lbClose = document.getElementById('lightboxClose');
  if (!card || !lightbox) return;

  function open() {
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    preview.pause();
    lbVideo.currentTime = 0;
    lbVideo.muted = false;
    lbVideo.play();
    if (lenis) lenis.stop();
  }
  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbVideo.pause();
    if (lenis) lenis.start();
  }

  card.addEventListener('click', open);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
  lbClose.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });

  /* tichý náhled ve smyčce, jen když je karta vidět */
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { preview.play().catch(() => {}); }
    else { preview.pause(); }
  }, { threshold: 0.35 });
  io.observe(preview);
})();

/* ------------------------------------------------------------
   Formulář → toast
   TODO-KLIENT: napojit odeslání (lead tabulka / e-mail / Vercel
   serverless /api/lead). Zatím jen UI.
------------------------------------------------------------ */
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const toast = document.getElementById('toast');
  toast.classList.add('is-visible');
  setTimeout(() => toast.classList.remove('is-visible'), 4200);
  e.target.querySelectorAll('input, textarea').forEach((f) => (f.value = ''));
});
