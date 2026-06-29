# STAGNUM — stavební firma Plzeň (landing page)

One-page prezentační web pro STAGNUM s.r.o. — dřevostavby a zděné domy na klíč,
rekonstrukce bytů (+ instalatérské práce). Čisté HTML + CSS + vanilla JS
(GSAP + Lenis pro animace), žádný build krok. Vše lokálně → funguje offline.

Každá hlavní služba má vlastní hero na celoplošné vizualizaci (dle feedbacku klienta),
menu „Služby" je rozbalovací (dřevostavby / zděné domy / rekonstrukce / instalatérina).

## Lokální spuštění

```bash
npx http-server . -p 4173 -c-1
# → http://localhost:4173
```

(Funguje i obyčejné otevření `index.html`, ale kvůli videu je server lepší.)

## Nasazení na Vercel

```bash
# jednorázově
npm i -g vercel

# ze složky stagnum-landing
vercel --prod
```

Nebo standardní flow GitHub → Vercel:
1. Repo pushnout na GitHub
2. Vercel → Add New Project → import repa
3. Framework preset: **Other** (statický web, žádný build command, output = kořen)

## Struktura

```
index.html          – celý web (sekce s kotvami)
css/style.css       – styly (brand: navy #003A70, teal #64CCC9, tlačítka #2BA8A1)
css/fonts.css       – lokální @font-face (Poppins + Inter, latin + latin-ext)
fonts/              – woff2 soubory (web funguje offline)
js/vendor/          – GSAP, ScrollTrigger, Lenis (lokálně, bez CDN)
js/iso-house.js     – izometrický SVG dům (8 vrstev = fází stavby), přepínač dřevo/zděný
js/wall.js          – skladba stěn a podlah (řez, vrstvy se skládají; otevřená/uzavřená/podlaha)
js/main.js          – animace, kalkulačka, dropdown menu, přepínače, formulář, video
media/viz/          – vizualizace na pozadí hero sekcí (výřezy z koláže klienta + stock)
media/rekonstrukce-bytu.mp4    – plné video před/po klienta (hraje v lightboxu)
media/rekonstrukce-nahled.mp4  – odlehčený náhled do karty (6 MB)
media/poster.jpg               – poster náhledu (video se načítá až při zobrazení)
```

## Struktura (multi-page)

- **`index.html`** — krátká přehledová domovská: hero (+ social proof) → **3 karty služeb** → proč my + partneři → stat strip → recenze (karusel) → realizace → kalkulačka → FAQ → instalace strip (voda/topení/elektro) → kontakt.
- **`drevostavby.html` · `zdene-domy.html` · `rekonstrukce.html`** — podstránky služeb (šablona): hero → karusel benefitů → **ruční animace stavby** (dřevo/zděný, klik na fáze + šipky) / video (rekonstrukce) → skladba stěn/podlah → galerie → CTA.
- **`obchodni-podminky.html` · `ochrana-osobnich-udaju.html`** — právní (návrhy).
- **Sdílené nav + patička** injektuje `js/layout.js` (jeden zdroj). `js/main.js` je page-aware (běží jen co existuje). Nav bez „Domů" (logo = domů).
- **Animace domu**: `iso-house.js` má styl `drevo` (antracit + svislé latě) / `zdeny` (terakota + cihlový sokl), ovládá se ručně (žádný scroll/autoplay). Skladba: `wall.js` (statický řez, hover propojení).

## Sekce webu (legacy popis jednostránky)

Hero → Služby intro → **Dřevostavby** (hero, tmavá) → **Zděné domy** (hero, světlá) →
**Rekonstrukce** (hero + postup + video před/po + reference) → Kalkulačka →
**Jak a z čeho stavíme** (jedna sekce s taby) → Proč my + partneři → Realizace →
**FAQ** → Kontakt (formulář + souhlas GDPR) → Instalace.

**Sekce „Jak a z čeho stavíme"** (`#stavime`) sloučila do jedné kompaktní sekce dřívější
dvě dlouhé scroll-animace. Taby: Stavba dřevostavby / Stavba zděného domu (dům se přehraje
po výběru, `iso-house.js`) · Skladba stěny / podlahy (statický čitelný řez s číslovanými
vrstvami + hover propojení řez↔seznam, `wall.js`). Rekonstrukce = video, ne animace.

**Právní stránky:** `obchodni-podminky.html`, `ochrana-osobnich-udaju.html` (styl `css/legal.css`),
odkazované z patičky. **Pracovní návrhy — nutná kontrola a doplnění dat (viz `[DOPLNIT]`).**

## TODO-KLIENT (placeholdery — hledej `TODO-KLIENT` / štítky „doplníme" v kódu)

- [ ] Sazby kalkulačky — `RATE_PER_M2` a násobky v `js/main.js` (teď ilustračních 38 000 Kč/m²)
- [ ] Reálné fotky/videa — hero sekce běží na stock fotkách v `media/viz/` (focení ~měsíc po schůzce)
- [ ] Loga partnerů (DEK, Senesi, KV Elektro, Ptáček) — zatím textová
- [ ] Reference/recenze — zatím vymyšlené
- [ ] Napojení formuláře → info@stagnum.cz / aplikace s potvrzovacím mailem (`js/main.js`)
- [ ] Odkazy FB/IG ve footeru (profily se zakládají)
- [ ] Doména stagnum.cz (zatím st4gnum.vercel.app)
- [ ] Produkčně dokoupit font **Visby CF** (teď náhrada Poppins/Inter)

## Poznámky k výkonu

- Video je 540p H.264 (~36 MB) konvertované přes macOS `avconvert` — **pro produkci
  překódovat přes ffmpeg** na ~5 MB: `ffmpeg -i in.mov -vf scale=540:-2 -c:v libx264 -crf 26 -preset slow -an out.mp4`
- Video se nenačítá automaticky (`preload="metadata"`), spouští se kliknutím
- Animace respektují `prefers-reduced-motion`
