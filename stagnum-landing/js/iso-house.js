/* ============================================================
   ST4GNUM — izometrický dům (SVG, vrstvy = fáze stavby)
   Vykreslí stejný dům do libovolného <svg> elementu.
   Vrstvy (data-layer 0–7):
   0 základová deska · 1 podlaha · 2 stěnové panely
   3 příčky · 4 krov · 5 střecha · 6 okna a dveře · 7 detaily
   ============================================================ */

(function () {
  const NS = 'http://www.w3.org/2000/svg';

  /* Barvy: dřevo + brand navy/teal */
  const C = {
    concrete: '#C7D1D9', concreteL: '#ABB8C2', concreteR: '#97A6B1',
    floor: '#E9CFA0', floorL: '#D8B57E', floorR: '#C7A067',
    wallLit: '#EFD9B0', wallShade: '#DCBE8D', wallLine: '#C8A472',
    partition: '#F4E8CF',
    beam: '#A8763E',
    roof: '#003A70', roofEdge: '#0E5288',
    teal: '#64CCC9', glass: '#C5EBE9', door: '#0A4576',
    chimney: '#9AA8B2', chimneyTop: '#B9C5CD',
    leaf: '#86B68B', trunk: '#8A6238',
  };

  function el(tag, attrs) {
    const node = document.createElementNS(NS, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }
  function poly(points, fill, extra) {
    return el('polygon', Object.assign({ points, fill }, extra || {}));
  }
  function line(x1, y1, x2, y2, stroke, w) {
    return el('line', { x1, y1, x2, y2, stroke, 'stroke-width': w, 'stroke-linecap': 'round' });
  }

  /* Izometrická síť (2:1):
     půdorys: B(240,285) R(390,210) T(240,135) L(90,210)
     z → posun nahoru po ose y                                     */
  window.renderIsoHouse = function (svg) {
    svg.innerHTML = '';
    const layers = [];

    /* --- 0 · ZÁKLADOVÁ DESKA --- */
    const g0 = el('g', { 'data-layer': 0 });
    g0.appendChild(poly('240,135 390,210 240,285 90,210', C.concrete));
    g0.appendChild(poly('90,210 240,285 240,301 90,226', C.concreteL));
    g0.appendChild(poly('240,285 390,210 390,226 240,301', C.concreteR));
    layers.push(g0);

    /* --- 1 · PODLAHA --- */
    const g1 = el('g', { 'data-layer': 1 });
    g1.appendChild(poly('240,125 390,200 240,275 90,200', C.floor));
    g1.appendChild(poly('90,200 240,275 240,285 90,210', C.floorL));
    g1.appendChild(poly('240,275 390,200 390,210 240,285', C.floorR));
    /* prkna */
    for (let i = 1; i < 5; i++) {
      const t = i / 5;
      g1.appendChild(line(240 - 150 * t, 125 + 75 * t, 390 - 150 * t, 200 + 75 * t, C.floorR, 1.2));
    }
    layers.push(g1);

    /* --- 3 · PŘÍČKY (kreslí se před stěnami, jsou uvnitř) --- */
    const g3 = el('g', { 'data-layer': 3 });
    g3.appendChild(poly('180,222.5 285,170 285,125 180,177.5', C.partition));
    g3.appendChild(poly('300,230 232.5,196.25 232.5,151.25 300,185', C.partition));
    g3.appendChild(line(180, 222.5, 285, 170, C.wallLine, 1));
    layers.push(g3);

    /* --- 2 · STĚNOVÉ PANELY (štít vlevo + stěna vpravo) --- */
    const g2 = el('g', { 'data-layer': 2 });
    /* štítová stěna (pětiúhelník se štítem) */
    g2.appendChild(poly('240,275 90,200 90,120 165,107.5 240,195', C.wallLit));
    /* pravá stěna */
    g2.appendChild(poly('240,275 390,200 390,120 240,195', C.wallShade));
    /* spáry panelů */
    g2.appendChild(line(140, 225, 140, 145, C.wallLine, 1.4));
    g2.appendChild(line(190, 250, 190, 170, C.wallLine, 1.4));
    g2.appendChild(line(290, 250, 290, 170, C.wallLine, 1.4));
    g2.appendChild(line(340, 225, 340, 145, C.wallLine, 1.4));
    layers.push(g2);

    /* --- 4 · KROV --- */
    const g4 = el('g', { 'data-layer': 4 });
    g4.appendChild(line(165, 107.5, 315, 32.5, C.beam, 5));           /* hřebenová vaznice */
    g4.appendChild(line(240, 195, 165, 107.5, C.beam, 4));            /* štítová krokev P */
    g4.appendChild(line(90, 120, 165, 107.5, C.beam, 4));             /* štítová krokev L */
    g4.appendChild(line(165, 151.25, 165, 107.5, C.beam, 3.5));       /* sloupek štítu */
    g4.appendChild(line(215, 82.5, 290, 170, C.beam, 3.5));           /* krokev 1 */
    g4.appendChild(line(265, 57.5, 340, 145, C.beam, 3.5));           /* krokev 2 */
    g4.appendChild(line(315, 32.5, 390, 120, C.beam, 4));             /* krajní krokev */
    layers.push(g4);

    /* --- 5 · STŘECHA --- */
    const g5 = el('g', { 'data-layer': 5 });
    g5.appendChild(poly('159.6,110.2 320.4,29.8 398,129.5 248,204.5', C.roof));
    g5.appendChild(line(159.6, 110.2, 320.4, 29.8, C.roofEdge, 4));   /* hřeben */
    g5.appendChild(line(248, 204.5, 398, 129.5, '#fff', 2.5));        /* okapová hrana */
    layers.push(g5);

    /* --- 6 · OKNA A DVEŘE --- */
    const g6 = el('g', { 'data-layer': 6 });
    /* dveře (pravá stěna) */
    g6.appendChild(poly('267,261.5 297,246.5 297,186.5 267,201.5', C.door));
    g6.appendChild(poly('270,258.6 294,246.6 294,190.5 270,202.5', '#10568e'));
    g6.appendChild(el('circle', { cx: 291, cy: 226, r: 2.2, fill: C.teal }));
    /* okno (pravá stěna) */
    g6.appendChild(poly('322.5,198.75 367.5,176.25 367.5,151.25 322.5,173.75', C.teal));
    g6.appendChild(poly('326,194.6 364,175.6 364,155.4 326,174.4', C.glass));
    /* okno (štít) */
    g6.appendChild(poly('195,222.5 135,192.5 135,154.5 195,184.5', C.teal));
    g6.appendChild(poly('191,217.4 139,191.4 139,159.6 191,185.6', C.glass));
    g6.appendChild(line(165, 201.5, 165, 172, '#fff', 2));
    layers.push(g6);

    /* --- 7 · DETAILY (komín, strom) --- */
    const g7 = el('g', { 'data-layer': 7 });
    g7.appendChild(poly('265.5,61 277.5,55 289.5,61 289.5,31 277.5,25 265.5,31', C.chimney));
    g7.appendChild(poly('265.5,31 277.5,25 289.5,31 277.5,37', C.chimneyTop));
    g7.appendChild(el('rect', { x: 52, y: 232, width: 6, height: 22, rx: 2, fill: C.trunk }));
    g7.appendChild(el('circle', { cx: 55, cy: 220, r: 17, fill: C.leaf }));
    g7.appendChild(el('circle', { cx: 43, cy: 230, r: 11, fill: C.leaf, opacity: 0.85 }));
    layers.push(g7);

    /* pořadí kreslení: deska, podlaha, příčky, stěny, krov, střecha, okna, detaily */
    [g0, g1, g3, g2, g4, g5, g6, g7].forEach((g) => svg.appendChild(g));

    /* pro animace vracíme vrstvy v POŘADÍ FÁZÍ 0–7 */
    return [g0, g1, g2, g3, g4, g5, g6, g7];
  };
})();
