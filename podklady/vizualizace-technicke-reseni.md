# Vizualizace skládající se při scrollu — návrh technického řešení

> **AKTUÁLNÍ ROZHODNUTÍ (po podkladech klienta):** zůstáváme u **současného SVG stylu** animace
> (metoda 1 níže). 3 scroll-animace = dřevostavba, zděný dům, **skladba stěn a podlah** (ta je už hotová).
> Rekonstrukce = budoucí videa (ne animace). Higgsfield/AI zvážíme jen na generování **pozadí** ve stylu
> koláže nebo na before/after videa. Sekce níže slouží jako přehled možností do budoucna.


3 typy vizualizací (každá pro jednu službu), které se „skládají" podle pozice scrollu:
1. **Dřevostavba** — dům roste fáze po fázi (deska → rošt → stěny → strop → krov → střecha → okna → fasáda)
2. **Zděný dům** — totéž v cihlové logice (základy → zdivo → stropy → krov → střecha → omítky)
3. **Rekonstrukce bytu** — proměna prostoru PŘED → PO (rozbité → hotové)

Bonus, který klient na schůzce chtěl: **skladba stěny** — vrstvy (omítka / izolace / OSB / stojka + vata / parozábrana / sádrokarton) se naskládají na sebe.

---

## Možnosti, jak to vyrobit (od nejlevnějšího po nejdražší)

### 1) SVG vrstvy — *už běží, nejlevnější*
Současná animace izometrického domu. Lehké (kB), plně řízené scrollem, ostré na všech displejích, funguje i offline.
- ➕ Hotové, zdarma, plná kontrola pořadí fází, skvělé i pro „skladbu stěny"
- ➖ Stylizované (vektorová ilustrace), ne fotorealistické
- **Vhodné jako:** okamžitý základ a fallback; dá se povýšit lepší ilustrací

### 2) Lottie (After Effects → JSON) — *doporučeno pro řízenou animaci*
Designer animuje skládání domu / vrstvení stěny v After Effects, export do Lottie.
- ➕ Vektorové, lehké (desítky kB), ostré, plynulý scrub podle scrollu, snadné úpravy, plná kontrola pořadí fází
- ➖ Ilustrativní (ne fotoreal), potřeba designer + AE
- **Vhodné jako:** hlavní řešení pro skládání domu i stěny, pokud chceme stylizovaný, ale prémiový vzhled

### 3) Obrázková sekvence z 3D renderu — *doporučeno pro fotorealismus („Apple styl")*
Dům se v Blenderu (nebo z architektova 3D modelu) vyrenderuje fáze po fázi → 60–120 snímků (WebP), které se přehrávají podle scrollu.
- ➕ Fotorealistické, plynulé, plná kontrola, drží se reálného domu klienta, funguje i na mobilu (přednačtené WebP)
- ➖ Potřeba 3D model domu + čas na render; větší datový objem (řešitelné kompresí)
- **Vhodné jako:** vlajkové řešení, pokud existuje (nebo vznikne) 3D model typového domu

### 4) Higgsfield / AI video (img2video) — *experimentální, cílené použití*
Higgsfield a podobné nástroje umí vygenerovat krátké video/GIF „růstu" domu nebo morf před→po.
- ➕ Rychlé, efektní, levné na vyzkoušení; výborné na **atmosféru** a **proměnu**
- ➖ **Špatně se řídí přesné stavební fáze** — AI „halucinuje" konstrukci, nepostaví stěnu ve správném pořadí (stojka → vata → OSB). Pro technicky korektní skládání rizikové.
- **Vhodné jako:**
  - **Rekonstrukce PŘED → PO** (plynulá proměna prostoru) — tady Higgsfield exceluje
  - Atmosférické hero smyčky / rychlý koncept pro klienta
  - Případně: Higgsfield video → vyextrahovat snímky → scroll-scrub (kombinace s metodou 3)

### 5) 3D v prohlížeči (Three.js / model-viewer) — *max wow, max náročnost*
Reálný 3D model domu, který se skládá při scrollu a jde i otáčet.
- ➕ Nejpůsobivější, interaktivní
- ➖ Nejdražší, nejnáročnější na výkon a mobil, potřeba 3D modely
- **Vhodné jako:** fáze 2, až bude web zaběhnutý

---

## Doporučení (poměr efekt / cena / kontrola)

| Vizualizace | Primární řešení | Alternativa |
|---|---|---|
| **Dřevostavba** (skládání) | Lottie *(řízené)* nebo obrázková sekvence z 3D *(fotoreal)* | vylepšené SVG vrstvy |
| **Zděný dům** (skládání) | totéž co dřevostavba | vylepšené SVG vrstvy |
| **Skladba stěny** (vrstvy) | Lottie nebo SVG vrstvy | — |
| **Rekonstrukce** (před→po) | **Higgsfield / AI morf** nebo reálné video před/po *(už máme)* | crossfade fotek |

**Jednoduše:** Higgsfield použít na **rekonstrukci** (proměna) a na rychlé koncepty. Na **skládání domu/stěny** jít přes **Lottie** (levnější, ilustrativní) nebo **3D render sekvenci** (dražší, fotoreal) — kvůli kontrole pořadí fází. Volba mezi Lottie a 3D = otázka rozpočtu a toho, jestli existuje 3D model domu.

> Ať zvolíme kteroukoliv metodu, **vstupy od klienta jsou stejné** (stavební postup, skladba stěny, typový dům, před/po) — proto je můžeme poptat hned, viz email.
