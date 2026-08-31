/* ============================================================
   STAGNUM — hlavní skript (page-aware: vše běží jen když prvky existují)
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = (n) => String(n).padStart(2, '0');

/* ---------- scroll ---------- */
/* Slow-scroll (Lenis) vypnutý — čistý nativní scroll. Kotvy řeší CSS
   scroll-behavior:smooth + scroll-margin-top. lenis necháváme null (null-safe). */
const lenis = null;
$$('a[href^="#"]').forEach((aEl) => aEl.addEventListener('click', () => { const n = $('#nav'); n && n.classList.remove('menu-open'); }));

/* ---------- fáze stavby (sdílené pro dřevo i zděný) ---------- */
const PHASES = {
  drevo: [
    ['Základová deska', 'Připravíme pozemek a založíme stavbu na přesné betonové desce.'],
    ['Hydroizolace', 'Tenká černá vrstva chrání stavbu proti vlhkosti a radonu.'],
    ['Stěnové panely', 'Nosné stěny stavíme stojku po stojce, přesně podle projektu.'],
    ['Příčky a rozvody', 'Vnitřní stěny a instalace vody, topení i elektřiny.'],
    ['Krov', 'Tesařská konstrukce střechy z poctivého dřeva.'],
    ['Střecha', 'Krytina, okapy a klempířina. Dům je pod střechou.'],
    ['Okna a dveře', 'Osazení oken a vstupních dveří. Stavba je uzavřená.'],
    ['Dokončení a předání', 'Fasáda, detaily, úklid. Přebíráte klíče.'],
  ],
  'drevo-pasy': [
    ['Základové pasy', 'Suchá skladba — dva pruhy základů po stranách domu.'],
    ['Podlahový rošt', 'Dřevěný rošt položený na základové pasy.'],
    ['Stěnové panely', 'Nosné stěny stavíme stojku po stojce, přesně podle projektu.'],
    ['Příčky a rozvody', 'Vnitřní stěny a instalace vody, topení i elektřiny.'],
    ['Krov', 'Tesařská konstrukce střechy z poctivého dřeva.'],
    ['Střecha', 'Krytina, okapy a klempířina. Dům je pod střechou.'],
    ['Okna a dveře', 'Osazení oken a vstupních dveří. Stavba je uzavřená.'],
    ['Dokončení a předání', 'Fasáda, detaily, úklid. Přebíráte klíče.'],
  ],
  zdeny: [
    ['Základová deska', 'Vybetonujeme základové pasy a nosnou desku.'],
    ['Hydroizolace', 'Tenká černá vrstva chrání stavbu proti vlhkosti a radonu.'],
    ['Obvodové zdivo', 'Vyzdíme nosné obvodové stěny z kvalitních cihel.'],
    ['Příčky a rozvody', 'Vnitřní zdivo a instalace vody, topení i elektřiny.'],
    ['Stropy a krov', 'Stropní konstrukce a tesařský krov střechy.'],
    ['Střecha', 'Krytina, okapy a klempířina. Dům je pod střechou.'],
    ['Okna a dveře', 'Osazení oken a vstupních dveří. Stavba je uzavřená.'],
    ['Dokončení a předání', 'Omítky, fasáda, úklid. Přebíráte klíče.'],
  ],
};

/* ---------- Loading screen + hero intro (jen kde jsou) ---------- */
const preloader = $('#preloader');
const loaderSvg = $('#loaderHouse');
if (loaderSvg) window.renderIsoHouse(loaderSvg, 'drevo');

function heroIntro() {
  if (!$('#uvod')) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('#uvod .hero__title .line > span', { yPercent: 110, duration: 0.7, stagger: 0.1, ease: 'power4.out' }, 0);
  tl.from(['#uvod .hero__eyebrow', '#uvod .hero__sub', '#uvod .hero__cta', '#uvod .hero__proof', '#uvod .svc-hero__feats'].filter((s) => $(s)),
    { y: 22, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.25);
}

if (preloader && !prefersReducedMotion && loaderSvg) {
  const loaderLayers = $$('#loaderHouse [data-layer]');
  const tl = gsap.timeline();
  gsap.set(loaderLayers, { y: -240, opacity: 0 });
  tl.to(loaderLayers, { y: 0, opacity: 1, duration: 0.46, stagger: 0.08, ease: 'back.out(1.6)' }, 0.05)
    .from('.preloader__text', { opacity: 0, y: 12, duration: 0.4 }, '-=0.5')
    .to(preloader, { yPercent: -100, duration: 0.6, ease: 'power4.inOut', delay: 0.1, onComplete: () => preloader.remove() })
    .add(heroIntro, '-=0.3');
} else {
  if (preloader) preloader.remove();
  heroIntro();
}
/* pojistka: preloader nikdy nesmí zůstat viset (i kdyby animace selhala) */
if (preloader) setTimeout(() => { const p = document.getElementById('preloader'); if (p) p.remove(); }, 2600);

/* ---------- Nav (po injektáži z layout.js) ---------- */
const nav = $('#nav');
const header = $('#header');
if (nav) {
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const burger = $('#navBurger');
  burger && burger.addEventListener('click', () => nav.classList.toggle('menu-open'));
  const subToggle = $('.nav__sub-toggle');
  const hasSub = $('.nav__has-sub');
  if (subToggle) subToggle.addEventListener('click', (e) => {
    if (window.matchMedia('(max-width: 640px)').matches) { e.preventDefault(); hasSub.classList.toggle('is-open'); }
  });
  $$('.nav__links a').forEach((aEl) => aEl.addEventListener('click', () => nav.classList.remove('menu-open')));
}

/* Reveal/scroll animace záměrně vypnuté — čistý, svižný web (feedback klienta).
   Necháváme jen: intro hero, ruční stavbu, počítadla. */

/* ---------- počítadla ---------- */
$$('.counter').forEach((el) => {
  const target = parseInt(el.dataset.target, 10);
  if (prefersReducedMotion) { el.textContent = target; return; }
  const obj = { val: 0 };
  gsap.to(obj, { val: target, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%' }, onUpdate: () => { el.textContent = Math.round(obj.val); } });
});

/* ---------- KALKULAČKA ---------- */
(function calc() {
  const areaInput = $('#areaInput'); if (!areaInput) return;
  const RATE = 38000; // Kč/m² — TODO-KLIENT
  const areaOut = $('#areaOut'), priceOut = $('#calcPrice');
  const typeSeg = $('#typeSeg'), stdSeg = $('#standardSeg'), finSeg = $('#finishSeg'), hint = $('#levelHint');
  const HINTS = { 'Základ': 'Základ — kvalitní standardní provedení připravené k bydlení.', 'Comfort': 'Comfort — nadstandardní vybavení a materiály.', 'Premium': 'Premium — prémiové materiály a řešení na míru.' };
  const mult = (seg) => parseFloat(seg.querySelector('.is-active').dataset.mult);
  const fmt = (n) => n.toLocaleString('cs-CZ').replace(/ /g, ' ') + ' Kč';
  function recalc(anim = true) {
    const m2 = +areaInput.value; areaOut.textContent = m2 + ' m²';
    areaInput.style.setProperty('--fill', ((m2 - 60) / 140) * 100 + '%');
    const raw = m2 * RATE * mult(typeSeg) * mult(stdSeg) * mult(finSeg);
    const r = Math.round(raw / 50000) * 50000;
    if (anim && !prefersReducedMotion) { const o = { v: +(priceOut.dataset.value || r) }; gsap.to(o, { v: r, duration: 0.5, ease: 'power2.out', onUpdate: () => priceOut.textContent = fmt(Math.round(o.v / 50000) * 50000) }); }
    else priceOut.textContent = fmt(r);
    priceOut.dataset.value = r;
  }
  areaInput.addEventListener('input', () => recalc(false));
  [typeSeg, stdSeg, finSeg].forEach((seg) => seg.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    seg.querySelectorAll('button').forEach((x) => x.classList.remove('is-active')); b.classList.add('is-active');
    if (seg === stdSeg && hint) hint.textContent = HINTS[b.textContent.trim()] || '';
    recalc();
  }));
  recalc(false);
})();

/* ---------- obecný KARUSEL (recenze, benefity) ---------- */
$$('[data-carousel]').forEach((root) => {
  const track = root.querySelector('[data-track]'); if (!track) return;
  const slides = [...track.children];
  const dots = root.querySelector('.carousel__dots');
  let idx = 0;
  if (dots) slides.forEach((_, i) => { const b = document.createElement('button'); b.addEventListener('click', () => go(i)); dots.appendChild(b); });
  function go(n) {
    idx = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    if (dots) [...dots.children].forEach((d, i) => d.classList.toggle('is-active', i === idx));
  }
  root.querySelectorAll('.carousel__btn').forEach((b) => b.addEventListener('click', () => go(idx + (+b.dataset.dir))));
  let x0 = null;
  track.addEventListener('touchstart', (e) => x0 = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1)); x0 = null; });
  go(0);
});

/* ---------- RUČNÍ STAVBA DOMU (podstránky) ---------- */
(function manualBuild() {
  const root = $('[data-build]'); if (!root) return;
  const svg = root.querySelector('svg'); const list = $('#buildList'); const label = $('#buildStepLabel');
  let L = [], items = [], step = 0;

  function show(n) {
    step = Math.max(0, Math.min(L.length - 1, n));
    L.forEach((g, i) => gsap.set(g, { opacity: i <= step ? 1 : 0, y: 0 }));
    if (step > 3) gsap.set(L[3], { opacity: 0 }); // příčky schované, jakmile stojí stěny+
    items.forEach((li, i) => li.classList.toggle('is-active', i === step));
    if (label) label.textContent = (step + 1) + ' / ' + L.length;
  }
  function setup(mode) {
    L = window.renderIsoHouse(svg, mode);
    list.innerHTML = PHASES[mode].map(([n, d], i) => `<li data-i="${i}"><span class="stavime__n">${pad(i + 1)}</span><div><strong>${n}</strong><span>${d}</span></div></li>`).join('');
    items = [...list.children];
    items.forEach((li, i) => li.addEventListener('click', () => show(i)));
    show(L.length - 1);
  }

  setup(root.dataset.build);
  $$('[data-step]').forEach((b) => b.addEventListener('click', () => show(step + (+b.dataset.step))));

  /* volitelný přepínač varianty založení (deska / pasy) */
  const variant = $('#buildVariant');
  if (variant) variant.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    variant.querySelectorAll('button').forEach((x) => x.classList.remove('is-active'));
    b.classList.add('is-active');
    setup(b.dataset.mode);
  });

  /* animované „postavení" při prvním zobrazení (jednorázově, ne scroll) */
  if (!prefersReducedMotion) {
    let played = false;
    new IntersectionObserver(([en], io) => {
      if (en.isIntersecting && !played) {
        played = true;
        L.forEach((g, i) => gsap.set(g, i === 0 ? { opacity: 1 } : { opacity: 0, y: -60 }));
        const tl = gsap.timeline();
        for (let i = 1; i < L.length; i++) tl.to(L[i], { opacity: i === 3 ? 0 : 1, y: 0, duration: 0.45, ease: 'back.out(1.3)', onStart: () => items.forEach((li, k) => li.classList.toggle('is-active', k === i)) }, i * 0.34);
        tl.add(() => show(L.length - 1));
        io.disconnect();
      }
    }, { threshold: 0.4 }).observe(root);
  }
})();

/* ---------- SKLADBA STĚN/PODLAH (podstránky) ---------- */
(function wallBlock() {
  const svg = $('#wallSvg'); if (!svg || typeof window.renderWall !== 'function') return;
  const list = $('#wallList'), note = $('#wallNote'), sw = $('#wallSwitch');
  function setup(mode) {
    const layers = window.renderWall(svg, mode);
    const set = window.wallData[mode];
    if (note) note.textContent = set.note;
    list.innerHTML = set.layers.map((l, i) => `<li data-i="${i}"><span class="stavime__n">${pad(i + 1)}</span><div><strong>${l.n}</strong><span>${l.d}</span></div></li>`).join('');
    const items = [...list.children];
    const badges = $$('.wall-badge', svg);
    const hl = (i, on) => { layers[i] && layers[i].classList.toggle('is-hl', on); badges[i] && badges[i].classList.toggle('is-hl', on); items[i] && items[i].classList.toggle('is-hl', on); };
    const bind = (els) => els.forEach((e, i) => { e.addEventListener('mouseenter', () => hl(i, true)); e.addEventListener('mouseleave', () => hl(i, false)); });
    bind(layers); bind(badges); bind(items);
  }
  if (sw) sw.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; sw.querySelectorAll('button').forEach((x) => x.classList.remove('is-active')); b.classList.add('is-active'); setup(b.dataset.mode); });
  setup('stena-otevrena');
})();

/* ---------- reálné řezy skladeb (přepínač obrázků) ---------- */
(function rezy() {
  const root = $('[data-rezy]'); if (!root) return;
  const img = $('#rezyImg'), cap = $('#rezyCap');
  root.querySelector('.rezy__toggle').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    root.querySelectorAll('button').forEach((x) => x.classList.remove('is-active'));
    b.classList.add('is-active');
    img.src = b.dataset.img;
    if (cap) cap.textContent = b.dataset.cap || '';
  });
})();

/* ---------- VIDEO lightbox ---------- */
(function video() {
  const card = $('#videoCard'), preview = $('#refVideo'), lb = $('#lightbox'), lbV = $('#lightboxVideo'), close = $('#lightboxClose');
  if (!card || !lb) return;
  const open = () => { lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); preview && preview.pause(); lbV.currentTime = 0; lbV.muted = false; lbV.play(); lenis && lenis.stop(); };
  const shut = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); lbV.pause(); lenis && lenis.start(); };
  card.addEventListener('click', open);
  card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  close && close.addEventListener('click', shut);
  lb.addEventListener('click', (e) => { if (e.target === lb) shut(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb.classList.contains('is-open')) shut(); });
  if (preview) new IntersectionObserver(([en]) => { en.isIntersecting ? preview.play().catch(() => {}) : preview.pause(); }, { threshold: 0.35 }).observe(preview);
})();

/* ---------- formulář ---------- */
(function form() {
  const f = $('#contactForm'); if (!f) return;
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const toast = $('#toast'); if (toast) { toast.classList.add('is-visible'); setTimeout(() => toast.classList.remove('is-visible'), 4200); }
    f.querySelectorAll('input, textarea').forEach((el) => { if (el.type === 'checkbox') el.checked = false; else el.value = ''; });
  });
})();
