/* ============================================================
   STAGNUM — izometrický dům (SVG, vrstvy = fáze stavby)
   renderIsoHouse(svg, style) — style: 'drevo' | 'zdeny'
   Vrstvy v pořadí fází 0–7:
   0 deska · 1 podlaha · 2 stěny · 3 příčky · 4 krov · 5 střecha · 6 okna/dveře · 7 detaily
   ============================================================ */

(function () {
  const NS = 'http://www.w3.org/2000/svg';

  /* sdílené barvy */
  const BASE = {
    concrete: '#C7D1D9', concreteL: '#ABB8C2', concreteR: '#97A6B1',
    floor: '#E9CFA0', floorL: '#D8B57E', floorR: '#C7A067',
    partition: '#F4E8CF',
    teal: '#64CCC9', glass: '#C5EBE9', door: '#0A4576',
    chimney: '#9AA8B2', chimneyTop: '#B9C5CD',
    leaf: '#86B68B', trunk: '#8A6238',
  };

  /* styly stavby */
  const STYLES = {
    drevo: {
      wallLit: '#EAD3A6', wallShade: '#D6BC85', wallLine: '#BE9A66',
      beam: '#A8763E', roof: '#2C3A45', roofEdge: '#46545F',
      cladding: 'vertical', base: null,
    },
    zdeny: {
      wallLit: '#F2F1EC', wallShade: '#E1DFD7', wallLine: '#D3CBBE',
      beam: '#8A949C', roof: '#A6503A', roofEdge: '#BE6A54',
      cladding: 'brick', base: '#B6634A',
    },
  };

  function el(tag, attrs) {
    const node = document.createElementNS(NS, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }
  function poly(points, fill, extra) { return el('polygon', Object.assign({ points, fill }, extra || {})); }
  function line(x1, y1, x2, y2, stroke, w) { return el('line', { x1, y1, x2, y2, stroke, 'stroke-width': w, 'stroke-linecap': 'round' }); }

  window.renderIsoHouse = function (svg, style) {
    const S = Object.assign({}, BASE, STYLES[style] || STYLES.drevo);
    svg.innerHTML = '';
    const layers = [];

    /* 0 · ZÁKLADOVÁ DESKA */
    const g0 = el('g', { 'data-layer': 0 });
    g0.appendChild(poly('240,135 390,210 240,285 90,210', S.concrete));
    g0.appendChild(poly('90,210 240,285 240,301 90,226', S.concreteL));
    g0.appendChild(poly('240,285 390,210 390,226 240,301', S.concreteR));
    layers.push(g0);

    /* 1 · PODLAHA */
    const g1 = el('g', { 'data-layer': 1 });
    g1.appendChild(poly('240,125 390,200 240,275 90,200', S.floor));
    g1.appendChild(poly('90,200 240,275 240,285 90,210', S.floorL));
    g1.appendChild(poly('240,275 390,200 390,210 240,285', S.floorR));
    for (let i = 1; i < 5; i++) { const t = i / 5; g1.appendChild(line(240 - 150 * t, 125 + 75 * t, 390 - 150 * t, 200 + 75 * t, S.floorR, 1.2)); }
    layers.push(g1);

    /* 3 · PŘÍČKY (uvnitř) */
    const g3 = el('g', { 'data-layer': 3 });
    g3.appendChild(poly('180,222.5 285,170 285,125 180,177.5', S.partition));
    g3.appendChild(poly('300,230 232.5,196.25 232.5,151.25 300,185', S.partition));
    g3.appendChild(line(180, 222.5, 285, 170, S.wallLine, 1));
    layers.push(g3);

    /* 2 · STĚNY (štít vlevo + stěna vpravo) + textura dle stylu */
    const g2 = el('g', { 'data-layer': 2 });
    g2.appendChild(poly('240,275 90,200 90,120 165,107.5 240,195', S.wallLit));   // levý štít
    g2.appendChild(poly('240,275 390,200 390,120 240,195', S.wallShade));         // pravá stěna
    if (S.cladding === 'vertical') {
      // dřevěné svislé latě
      [120, 150, 180, 210].forEach((x) => g2.appendChild(line(x, 200 + (x - 90) * 0.5, x, 120 + (x - 90) * 0.5, S.wallLine, 1.3)));
      [270, 300, 330, 360].forEach((x) => g2.appendChild(line(x, 275 - (x - 240) * 0.5, x, 195 - (x - 240) * 0.5, S.wallLine, 1.3)));
    } else {
      // cihlové vodorovné řádky (rovnoběžné s okapem)
      for (let k = 1; k <= 6; k++) { const t = k / 7;
        g2.appendChild(line(90, 200 - t * 80, 240, 275 - t * 80, S.wallLine, 1));   // levý štít
        g2.appendChild(line(240, 275 - t * 80, 390, 200 - t * 80, S.wallLine, 1));  // pravá stěna
      }
      // kamenný/cihlový sokl
      g2.appendChild(poly('240,275 90,200 90,188 240,263', S.base));
      g2.appendChild(poly('240,275 390,200 390,188 240,263', S.base));
    }
    layers.push(g2);

    /* 4 · KROV */
    const g4 = el('g', { 'data-layer': 4 });
    g4.appendChild(line(165, 107.5, 315, 32.5, S.beam, 5));
    g4.appendChild(line(240, 195, 165, 107.5, S.beam, 4));
    g4.appendChild(line(90, 120, 165, 107.5, S.beam, 4));
    g4.appendChild(line(165, 151.25, 165, 107.5, S.beam, 3.5));
    g4.appendChild(line(215, 82.5, 290, 170, S.beam, 3.5));
    g4.appendChild(line(265, 57.5, 340, 145, S.beam, 3.5));
    g4.appendChild(line(315, 32.5, 390, 120, S.beam, 4));
    layers.push(g4);

    /* 5 · STŘECHA */
    const g5 = el('g', { 'data-layer': 5 });
    g5.appendChild(poly('159.6,110.2 320.4,29.8 398,129.5 248,204.5', S.roof));
    g5.appendChild(line(159.6, 110.2, 320.4, 29.8, S.roofEdge, 4));
    g5.appendChild(line(248, 204.5, 398, 129.5, '#fff', 2.5));
    layers.push(g5);

    /* 6 · OKNA A DVEŘE */
    const g6 = el('g', { 'data-layer': 6 });
    g6.appendChild(poly('267,261.5 297,246.5 297,186.5 267,201.5', S.door));
    g6.appendChild(poly('270,258.6 294,246.6 294,190.5 270,202.5', '#10568e'));
    g6.appendChild(el('circle', { cx: 291, cy: 226, r: 2.2, fill: S.teal }));
    g6.appendChild(poly('322.5,198.75 367.5,176.25 367.5,151.25 322.5,173.75', S.teal));
    g6.appendChild(poly('326,194.6 364,175.6 364,155.4 326,174.4', S.glass));
    g6.appendChild(poly('195,222.5 135,192.5 135,154.5 195,184.5', S.teal));
    g6.appendChild(poly('191,217.4 139,191.4 139,159.6 191,185.6', S.glass));
    g6.appendChild(line(165, 201.5, 165, 172, '#fff', 2));
    layers.push(g6);

    /* 7 · DETAILY (komín, strom) */
    const g7 = el('g', { 'data-layer': 7 });
    g7.appendChild(poly('265.5,61 277.5,55 289.5,61 289.5,31 277.5,25 265.5,31', S.chimney));
    g7.appendChild(poly('265.5,31 277.5,25 289.5,31 277.5,37', S.chimneyTop));
    g7.appendChild(el('rect', { x: 52, y: 232, width: 6, height: 22, rx: 2, fill: S.trunk }));
    g7.appendChild(el('circle', { cx: 55, cy: 220, r: 17, fill: S.leaf }));
    g7.appendChild(el('circle', { cx: 43, cy: 230, r: 11, fill: S.leaf, opacity: 0.85 }));
    layers.push(g7);

    [g0, g1, g3, g2, g4, g5, g6, g7].forEach((g) => svg.appendChild(g));
    return [g0, g1, g2, g3, g4, g5, g6, g7];
  };
})();
