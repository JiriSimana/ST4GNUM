# STAGNUM web — revize před odesláním + podklady na schůzku

## ČÁST A — QA revize (z naší strany hotovo)

**Technický stav: ✅ vše OK** (lokální kontrola)
- Všech 6 stránek se načítá (index, dřevostavby, zděné domy, rekonstrukce, obchodní podmínky, ochrana údajů).
- **Žádné chyby v konzoli** na žádné stránce.
- **Žádné horizontální přetečení** — desktop (1280) i mobil (375).
- Všechny odkazy v nav, patičce, side-railu a CTA míří na existující stránky.
- Všechny obrázky, fonty, skripty a video se načítají (lokálně, funguje offline).
- Funkční prvky ověřeny: ruční stavba domu (klik + šipky), skladba stěn/podlah (hover propojení), kalkulačka (živý přepočet), video před/po (lightbox se zvukem), formulář (toast), dropdown menu, mobilní menu, side-rail (rozjíždí se, na mobilu skrytý).
- Dřevo vs. zděný vizuálně odlišené (antracitová vs. terakotová střecha + cihlový sokl).
- Web je konzistentní — všechny 3 podstránky služeb sdílí stejnou prodejní šablonu.

**Struktura webu:**
- **Domů** — přehled: hero → 3 karty služeb → proč my + partneři → výsledky → recenze → realizace → kalkulačka → FAQ → instalace strip → kontakt.
- **Podstránky služeb** (dřevostavby / zděné domy / rekonstrukce) — prodejní šablona: hero + hodnocení → benefit „posty" → jak to probíhá (3 kroky) → pilíř (video slot) → [stavba domu + skladba / u rekonstrukce video před-po] → srovnání s konkurencí → galerie → recenze (skóre + graf) → CTA. Vpravo side-rail pro rychlé přepnutí služby.
- **Právní** — GDPR + obchodní podmínky (návrhy).

## ČÁST B — Co potřebujeme od klienta (placeholdery, hledej `TODO` / „doplníme")
1. **Reálná čísla** — roky praxe, počet realizací, dojezd, **délka záruky**.
2. **Reálné recenze** + souhlas zákazníků (ideálně s fotkou) → souhrnné skóre i karty.
3. **Sazby do kalkulačky** (cenotvorba) — teď ilustračních 38 000 Kč/m².
4. **Skladby stěn a podlah** — vlastní (vyjít z Easy Homes, ale odlišit).
5. **Postup stavby** (fáze) — dřevostavba i zděný dům, potvrdit texty.
6. **Loga partnerů** (DEK, Senesi, KV Elektro, Ptáček) + souhlas.
7. **Texty/claimy** o firmě (po rozhovoru), FAQ odpovědi (záruka, termíny).
8. **Endorsement** — stavbyvedoucí / certifikace / spokojený klient + foto.

## ČÁST C — Body na schůzku (co domluvíme a uděláme)
1. Projít web společně → odsouhlasit strukturu a texty.
2. Dodat reálná data (viz část B) — čísla, recenze, sazby, skladby, loga.
3. **Doména `stagnum.cz`** — registrace + nasazení.
4. **Firemní mail `info@stagnum.cz`** — zřídit + napojit poptávkový formulář (+ automatický potvrzovací e-mail zákazníkovi).
5. **GDPR + obchodní podmínky** — doplnit data a nechat zkontrolovat (právník/účetní).
6. **Google profil + Mapy**, **Facebook + Instagram** — založit, propojit.
7. **Analytika** (GA4 + Meta Pixel) + cookie lišta — nasadit PŘED spuštěním reklam.
8. **Focení/natáčení s Karmou** — domluvit termín dle seznamu níže (část D).
9. Termín spuštění (live) po doplnění reálných fotek a dat.

## ČÁST D — Seznam na focení a natáčení (pro Karmu)
> Pozn.: hero záběry na šířku 16:9 (s prostorem pro text vlevo); „posty" a benefity ideálně i ve čtvercové / na výšku verzi → dají se použít na FB/IG. Konzistentní světlo a styl. Důležitý lidský prvek (řemeslníci, rodina).

**Exteriéry domů (hero + galerie):**
- Dřevostavba — exteriér, ideálně za soumraku; detaily fasády (dřevěný obklad).
- Zděný dům — exteriér; detail zdiva / fasády.
- 3–5 fotek za každý typ pro galerii.

**Interiéry:**
- Hotové interiéry (obývák, kuchyně, koupelna) — dřevo, zděný i po rekonstrukci.

**Benefit „posty" (web + sítě):**
- Dřevo: přírodní materiál, detail izolace/skladby, zdravý interiér.
- Zděný: konstrukce/zdivo, prověřené materiály, interiér.
- Rekonstrukce: proces (bourání/práce), hotový výsledek.

**„Jak to probíhá" (3 kroky):**
- Konzultace/návrh — lidé nad projektem.
- Stavba — **řemeslníci v akci** (lidský prvek).
- Předání — hotový dům/byt + klíče.

**Video:**
- Krátké video ze stavby (průběh / timelapse) — dřevo i zděný.
- **Rekonstrukce PŘED → PO** — párové záběry stejného prostoru + sestříhané video (jedno máme, přidat další).

**Lidé a důvěra:**
- Foto bratrů Koželuhových (kontakt / „o nás" / endorsement).
- Tým při práci.
- Spokojení zákazníci k recenzím (se souhlasem).

**Dodat (ne focení):**
- Loga partnerů ve vektoru, logo STAGNUM ve vektoru, případně font Visby CF.
- Vygenerované vizualizace ze složky „DUPEC" (zatím jsme ji nenašli — poslat cestu).
