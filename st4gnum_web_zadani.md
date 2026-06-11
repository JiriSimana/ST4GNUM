# ZADÁNÍ: Web ST4GNUM — Dřevostavby (v1 na schůzku 12. 6. 2026)

Cíl: jednostránkový (one-page, sekce s kotvami) prezentační web, který zítra "odpálí" klienta na schůzce. Musí vypadat prémiově, fungovat perfektně na mobilu a obsahovat funkční kalkulačku + scroll/loading animaci domu. Texty a fotky jsou částečně placeholdery — označit jasně `[DOPLNÍME]`.

---

## 1. O FIRMĚ (reálná data — použít)

- **Název:** ST4GNUM s.r.o.
- **Tagline:** FOR BETTER LIVING (používat — je v logomanuálu)
- **Obor:** dřevostavby na klíč; dále rekonstrukce a zděné stavby (ukázat šíři řemesla)
- **Region:** Plzeňsko a okolí
- **Sídlo:** Slovanská 1404/191, Plzeň
- **IČO:** 10914340 · **DIČ:** CZ10914340
- **Telefony:** 733 420 275 · 604 528 704
- **E-mail:** stagnum@post.cz · **Doména:** www.stagnum.cz
- **Kontaktní osoba klienta:** Koželuh
- **Byznys cíl webu:** generovat poptávky, naplnit kapacitu ~4 dřevostavby/rok
- **Hotové realizace k portfoliu:** rekonstruované byty (před/po fotky, video z iPhonu) + vlastní zděná stavba. Fotky zatím nemám → použít stylové placeholdery s popiskem.

## 2. BRAND (z logomanuálu — závazné)

- **Barvy:**
  - Primární tmavá: Pantone 2955 ≈ `#003A70` (navy) — pozadí hero, footer, nadpisy
  - Akcent: Pantone 325C ≈ `#64CCC9` (světlý teal); pro tlačítka použít tmavší odvozený teal `#2BA8A1` kvůli kontrastu s bílým textem
  - Bílá `#FFFFFF`; podkladová světlá `#F7FAFB`; jemná teal podkladová `#E2F2F1`
- **Písmo:** Visby CF Bold (placené — na webu nahradit **Poppins** 600–800 pro nadpisy, **Inter** pro text; do kódu komentář, že produkčně se dokoupí Visby CF)
- **Logo:** mám PDF logomanuál, do v1 stačí textové logo `ST4GNUM.` + malý tagline "For Better Living"
- **Vždy světlé pozadí obsahu**, tmavé jen hero/footer/akcentové bloky

## 3. KONKURENCE A POZICOVÁNÍ (z průzkumu 11. 6.)

Konkurence v kraji: PALIS Plzeň (od 1991, 300+ domů, "od stromu po dům"), EasyHomes ("od A do Z", vlastní výroba), Dřevostavby-Juha (nízkoenergetické). Všichni komunikují totéž: na klíč, zkušenosti, kvalita. **Nikdo nemá cenovou kalkulačku.**

**Naše pozice (promítnout do copy):**
1. Osobní rodinná firma — jednáte přímo s tím, kdo staví, žádné call centrum
2. Transparentní cena — orientační cena za minutu z kalkulačky, pevná před podpisem
3. Reálné stavby k vidění naživo + průběžné foto-reporty ze stavby

Tón copy: sebevědomý, lidský, krátké věty, žádné korporátní fráze. Čeština, vykání zákazníkovi.

## 4. STRUKTURA WEBU (sekce shora dolů)

1. **Loading screen** — animace domu, který se "složí" z dílů (viz sekce 5), max ~2 s, pak fade out. Skip při opakované návštěvě (sessionStorage NE — použij JS proměnnou/cookie-less, klidně přehrát vždy, je krátká).
2. **Sticky nav** — logo vlevo, kotvy (Realizace · Jak stavíme · Proč my · Kontakt), CTA tlačítko "Nezávazná poptávka". Blur/transparentní pozadí.
3. **Hero** — fullscreen-ish, navy gradient. Eyebrow "For Better Living · Dřevostavby Plzeňsko". H1 typu "Postavíme vám dřevostavbu, za kterou si stojíme." Sub-text o osobním přístupu a transparentní ceně. 2 CTA: "Chci nezávaznou poptávku" (primární teal) + "Prohlédnout realizace" (ghost). Vpravo/pod tím **kalkulačka** (viz sekce 6).
4. **Trust strip** — 3 čísla: `[X] let zkušeností` · `[X] dokončených realizací` · `Plzeňsko a okolí do [X] km` (placeholdery).
5. **Realizace** — grid 3 karet s foto placeholdery (gradient + štítek "Foto: dřevostavba / rekonstrukce před–po / zděná stavba"). Hover zoom efekt.
6. **Jak stavíme** — 4 kroky: Nezávazná poptávka (ozveme se do 48 h) → Návrh a pevná cena (rozpočet bez hvězdiček) → Stavba (průběžné foto-reporty) → Předání a záruka. Scroll-reveal animace kroků.
7. **Proč my** — tmavý navy blok, 3 body z pozicování (sekce 3).
8. **Sekce animace domu** (signature) — při scrollu se izometrický dům postupně skládá/rozkládá (viz sekce 5), vedle texty fází stavby. Tohle je "wow" moment pro schůzku.
9. **Kontakt / poptávkový formulář** — jméno, telefon, select "Máte pozemek?" (Ano / Zatím hledám / Jen se rozhlížím), textarea. Submit zatím jen UI (bez backendu) — toast "Děkujeme, ozveme se do 48 hodin." + komentář v kódu, kam později napojit (sdílená lead tabulka / e-mail).
10. **Footer** — navy, plná fakturační data (sekce 1), tagline, odkazy FB/IG (zatím #, zakládáme zítra).

## 5. ANIMACE DOMU (klíčový prvek)

Místo AI videa to postav **kódem — vrstvený izometrický dům v SVG**:
- Vrstvy odspodu: základová deska → podlaha → stěnové panely → příčky → krov → střecha → okna/dveře → komín/detaily
- **Loading screen:** vrstvy postupně "přiletí" shora s easingem a mírným bounce, ~1,8 s celkem
- **Scroll sekce:** stejný dům, vrstvy se skládají podle scroll pozice (scroll-driven, IntersectionObserver nebo scroll progress), text fází stavby se synchronizovaně mění
- Barvy domu: dřevo teplé odstíny + navy/teal akcenty ať ladí s brandem
- `prefers-reduced-motion`: animace vypnout, zobrazit složený dům
- Mobil: zjednodušená verze (méně vrstev, kratší animace)

## 6. KALKULAČKA (funkční, v hero)

- Slider **užitná plocha** 60–200 m² (default 110)
- Segment **standard**: Základní (×1,0) · Komfort (×1,18) · Prémium (×1,38)
- Segment **dokončení**: Hrubá stavba (×0,78) · Na klíč (×1,0)
- Výpočet: `m² × 38 000 Kč × standard × dokončení`, zaokrouhlit na 50 000
- Sazba 38 000 Kč/m² je **ilustrační** — konstanta nahoře v kódu + komentář "doplnit z cenotvorby klienta"
- Výstup: "Orientační cena od **X Kč**" + disclaimer drobným písmem + CTA "Poslat mi přesnou kalkulaci" (scroll na formulář)
- Živý přepočet při každé změně

## 7. TECH POŽADAVKY

- **Stack:** Next.js (App Router) + Tailwind, deploy **Vercel** — můj standard (GitHub → Vercel). Pokud bude rychlejší čisté HTML/CSS/JS v jednom souboru, je to pro v1 taky OK — rozhodni podle času, priorita je hotovo dnes večer.
- **Mobile-first**, breakpointy 640 px a 1024 px (povinné — dřívější projekt měl problém s mobilní responzivitou)
- Výkon: žádné těžké knihovny, animace CSS/SVG/vanilla JS; Lighthouse mobile 90+
- SEO základ: `<title>` "Dřevostavby Plzeň a okolí | ST4GNUM — For Better Living", meta description, OG tagy, čeština `lang="cs"`, sémantické HTML, alt texty
- Klíčová slova v copy: dřevostavby Plzeň, dřevostavba na klíč, nízkoenergetický dům
- Žádný localStorage/sessionStorage
- Vše v jednom repu, README s instrukcí pro nasazení na Vercel

## 8. CO JE PLACEHOLDER (označit v kódu komentářem `TODO-KLIENT`)

- Všechna čísla v trust stripu, fotky realizací, sazba kalkulačky, reference/citace zákazníků, finální texty o firmě (zítra nahrávám rozhovor → texty doplním), odkazy na FB/IG, logo soubor z logomanuálu

## 9. DEFINITION OF DONE (na zítřejší 9:00)

- [ ] Běží na Vercelu na veřejné URL
- [ ] Loading animace domu + scroll animace fungují na mobilu i desktopu
- [ ] Kalkulačka počítá živě
- [ ] Vše v brandu (navy #003A70 / teal, Poppins)
- [ ] Žádný rozbitý layout na 375 px šířce
