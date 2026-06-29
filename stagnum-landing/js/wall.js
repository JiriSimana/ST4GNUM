/* ============================================================
   STAGNUM — Skladba stěn a podlah (řez, vrstvy se skládají při scrollu)
   POZOR: vrstvy jsou GENERICKÉ placeholdery (standardní stavební
   skladby), NE kopie konkrétního dodavatele.
   TODO-KLIENT: nahradit skutečnými skladbami STAGNUM (názvy, materiály,
   tloušťky) — musí vypadat jako vlastní řešení.
   ============================================================ */

(function () {
  const NS = 'http://www.w3.org/2000/svg';

  /* hatch = typ výplně: solid / wood / insul / film / concrete / screed / floor */
  const SETS = {
    'stena-otevrena': {
      label: 'Stěna — difuzně otevřená',
      note: 'Stěna „dýchá" — vlhkost prochází ven, bez klasické parozábrany.',
      dir: ['Interiér', 'Exteriér'],
      layers: [
        { n: 'Sádrokarton', d: 'Vnitřní opláštění a finální povrch.', t: 1.0, c: '#EAEEF1', h: 'solid' },
        { n: 'Instalační předstěna', d: 'Prostor pro rozvody bez narušení vzduchotěsnosti.', t: 1.6, c: '#DEE7ED', h: 'gap' },
        { n: 'Parobrzda (variabilní)', d: 'Reguluje prostup vlhkosti — řízeně, oběma směry.', t: 0.4, c: '#7FB7D9', h: 'film' },
        { n: 'Dřevovláknitá deska', d: 'Ztužení konstrukce, difuzně otevřená.', t: 0.9, c: '#CDA06A', h: 'wood' },
        { n: 'Sloupek + dřevovláknitá izolace', d: 'Nosný rošt vyplněný přírodní izolací.', t: 4.4, c: '#F4DBA8', h: 'insul' },
        { n: 'Dřevovláknitá deska (DHF)', d: 'Vnější záklop odolný proti povětrnosti.', t: 0.9, c: '#C18E54', h: 'wood' },
        { n: 'Provětrávaná mezera + rošt', d: 'Odvětrání fasády, ochrana před vlhkostí.', t: 1.4, c: '#E6EEE9', h: 'gap' },
        { n: 'Fasádní obklad / omítka', d: 'Finální vzhled — dřevo nebo omítka.', t: 0.8, c: '#B9C6CE', h: 'solid' },
      ],
    },
    'stena-uzavrena': {
      label: 'Stěna — difuzně uzavřená',
      note: 'Vzduchotěsná parozábrana na teplé straně konstrukce.',
      dir: ['Interiér', 'Exteriér'],
      layers: [
        { n: 'Sádrokarton', d: 'Vnitřní opláštění a finální povrch.', t: 1.0, c: '#EAEEF1', h: 'solid' },
        { n: 'Instalační předstěna', d: 'Prostor pro rozvody bez narušení vzduchotěsnosti.', t: 1.6, c: '#DEE7ED', h: 'gap' },
        { n: 'Parozábrana', d: 'Vzduchotěsná fólie chrání izolaci před vlhkostí.', t: 0.4, c: '#F2C879', h: 'film' },
        { n: 'OSB deska', d: 'Ztužení a vzduchotěsná rovina.', t: 0.9, c: '#D7A86A', h: 'wood' },
        { n: 'Sloupek + minerální izolace', d: 'Nosný rošt vyplněný tepelnou izolací.', t: 4.4, c: '#FBE7BB', h: 'insul' },
        { n: 'Dřevovláknitá deska (DHF)', d: 'Vnější záklop odolný proti povětrnosti.', t: 0.9, c: '#C18E54', h: 'wood' },
        { n: 'Fasádní izolace', d: 'Kontaktní zateplení pro nízké náklady na provoz.', t: 2.0, c: '#EAF2EC', h: 'insul' },
        { n: 'Tenkovrstvá omítka', d: 'Finální fasádní povrch.', t: 0.6, c: '#C7D2D9', h: 'solid' },
      ],
    },
    'podlaha': {
      label: 'Podlaha na terénu',
      note: 'Skladba odspodu nahoru — od podloží po nášlapnou vrstvu.',
      dir: ['Spodek', 'Nášlap'],
      layers: [
        { n: 'Základová deska', d: 'Únosný betonový podklad stavby.', t: 3.0, c: '#C3CBD1', h: 'concrete' },
        { n: 'Hydroizolace', d: 'Ochrana proti zemní vlhkosti a radonu.', t: 0.5, c: '#5C6B75', h: 'film' },
        { n: 'Tepelná izolace (EPS)', d: 'Zabraňuje úniku tepla do země.', t: 3.4, c: '#EFF3F0', h: 'insul' },
        { n: 'Separační fólie', d: 'Odděluje izolaci od betonové mazaniny.', t: 0.3, c: '#9FB6C4', h: 'film' },
        { n: 'Mazanina + podlahové topení', d: 'Roznášecí vrstva s topnými trubkami.', t: 2.2, c: '#D8DEE2', h: 'screed' },
        { n: 'Lepidlo / podložka', d: 'Podklad pod finální vrstvu.', t: 0.4, c: '#E2D2BB', h: 'solid' },
        { n: 'Nášlapná vrstva', d: 'Vinyl, dlažba nebo dřevo dle výběru.', t: 1.0, c: '#B98A57', h: 'floor' },
      ],
    },
  };

  function el(tag, attrs) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  /* jednorázové vzory (hatch) */
  function defs() {
    const d = el('defs', {});
    // diagonální šrafování pro izolaci
    const insul = el('pattern', { id: 'pInsul', width: 9, height: 9, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' });
    insul.appendChild(el('line', { x1: 0, y1: 0, x2: 0, y2: 9, stroke: 'rgba(0,58,112,0.18)', 'stroke-width': 1.4 }));
    d.appendChild(insul);
    // vodorovné linky pro dřevo/OSB
    const wood = el('pattern', { id: 'pWood', width: 14, height: 6, patternUnits: 'userSpaceOnUse' });
    wood.appendChild(el('line', { x1: 0, y1: 5.5, x2: 14, y2: 5.5, stroke: 'rgba(90,50,15,0.22)', 'stroke-width': 1 }));
    d.appendChild(wood);
    // tečky pro beton
    const conc = el('pattern', { id: 'pConc', width: 10, height: 10, patternUnits: 'userSpaceOnUse' });
    conc.appendChild(el('circle', { cx: 3, cy: 3, r: 1.1, fill: 'rgba(0,40,80,0.18)' }));
    conc.appendChild(el('circle', { cx: 8, cy: 8, r: 1.1, fill: 'rgba(0,40,80,0.18)' }));
    d.appendChild(conc);
    // mazanina — drobné body
    const screed = el('pattern', { id: 'pScreed', width: 7, height: 7, patternUnits: 'userSpaceOnUse' });
    screed.appendChild(el('circle', { cx: 2, cy: 2, r: 0.8, fill: 'rgba(0,40,80,0.14)' }));
    d.appendChild(screed);
    // podlaha — prkna
    const floor = el('pattern', { id: 'pFloor', width: 22, height: 8, patternUnits: 'userSpaceOnUse' });
    floor.appendChild(el('line', { x1: 0, y1: 7.5, x2: 22, y2: 7.5, stroke: 'rgba(90,50,15,0.28)', 'stroke-width': 1 }));
    floor.appendChild(el('line', { x1: 11, y1: 0, x2: 11, y2: 8, stroke: 'rgba(90,50,15,0.2)', 'stroke-width': 1 }));
    d.appendChild(floor);
    return d;
  }
  const HATCH = { insul: 'url(#pInsul)', wood: 'url(#pWood)', concrete: 'url(#pConc)', screed: 'url(#pScreed)', floor: 'url(#pFloor)' };

  /* vykreslí řez do SVG, vrátí pole skupin (vrstev) v pořadí skládání */
  window.renderWall = function (svg, mode) {
    svg.innerHTML = '';
    svg.appendChild(defs());
    const set = SETS[mode];
    const X0 = 54, X1 = 426, Y0 = 54, Y1 = 300;
    const totalT = set.layers.reduce((s, l) => s + l.t, 0);
    const W = X1 - X0;
    const groups = [];
    let x = X0;
    set.layers.forEach((l, i) => {
      const w = (l.t / totalT) * W;
      const g = el('g', { 'data-i': i });
      const rect = el('rect', { x: x, y: Y0, width: w, height: Y1 - Y0, fill: l.c, stroke: 'rgba(0,42,82,0.28)', 'stroke-width': 1, rx: 1 });
      g.appendChild(rect);
      if (HATCH[l.h]) g.appendChild(el('rect', { x: x, y: Y0, width: w, height: Y1 - Y0, fill: HATCH[l.h], rx: 1 }));
      groups.push(g);
      svg.appendChild(g);
      x += w;
    });
    // popisky stran (interiér / exteriér)
    const lab = el('g', { 'data-fixed': '1' });
    const tA = el('text', { x: X0, y: Y1 + 26, fill: '#5b7287', 'font-size': 13, 'font-family': 'Poppins, sans-serif', 'font-weight': 600 });
    tA.textContent = '← ' + set.dir[0];
    const tB = el('text', { x: X1, y: Y1 + 26, fill: '#5b7287', 'font-size': 13, 'font-family': 'Poppins, sans-serif', 'font-weight': 600, 'text-anchor': 'end' });
    tB.textContent = set.dir[1] + ' →';
    lab.appendChild(tA); lab.appendChild(tB);
    svg.appendChild(lab);
    return groups;
  };

  /* data pro boční seznam vrstev */
  window.wallData = SETS;
})();
