# ST4GNUM — Dřevostavby Plzeňsko (v1 landing page)

One-page prezentační web pro ST4GNUM s.r.o. — dřevostavby na klíč, rekonstrukce bytů a zděné stavby.
Čisté HTML + CSS + vanilla JS (GSAP pro animace), žádný build krok.

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
js/iso-house.js     – izometrický SVG dům (8 vrstev = fází stavby)
js/main.js          – animace (GSAP), kalkulačka, formulář, video
media/rekonstrukce-bytu.mp4    – plné video před/po (H.264 540p, hraje v lightboxu)
media/rekonstrukce-nahled.mp4  – odlehčený náhled do karty (6 MB)
media/poster.jpg               – poster náhledu (video se načítá až při zobrazení)
```

## TODO-KLIENT (placeholdery — hledej komentář `TODO-KLIENT` v kódu)

- [ ] Čísla v trust stripu (roky zkušeností, počet realizací, dojezd km)
- [ ] Fotky realizací (dřevostavba, zděná stavba) — zatím gradientové placeholdery
- [ ] Sazba kalkulačky — konstanta `RATE_PER_M2` v `js/main.js` (teď ilustračních 38 000 Kč/m²)
- [ ] Napojení formuláře — `js/main.js`, sekce „Formulář → toast" (lead tabulka / e-mail / serverless)
- [ ] Odkazy FB/IG ve footeru (profily se zakládají)
- [ ] Finální texty o firmě (po rozhovoru s klientem)
- [ ] Produkčně dokoupit font **Visby CF** (logomanuál) — teď náhrada Poppins/Inter

## Poznámky k výkonu

- Video je 540p H.264 (~36 MB) konvertované přes macOS `avconvert` — **pro produkci
  překódovat přes ffmpeg** na ~5 MB: `ffmpeg -i in.mov -vf scale=540:-2 -c:v libx264 -crf 26 -preset slow -an out.mp4`
- Video se nenačítá automaticky (`preload="metadata"`), spouští se kliknutím
- Animace respektují `prefers-reduced-motion`
