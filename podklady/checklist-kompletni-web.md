# STAGNUM web — co chybí ke kompletnímu webu

Master přehled. Legenda: ✅ hotovo · 🟡 placeholder / rozpracováno · ⬜ chybí
Zdroj sloupců: **K** = dodá klient · **M** = uděláme my (Jiří) · **D** = rozhodnout/probrat osobně

---

## A) VIZUALIZACE — 3 scroll-animace (ve stylu, co už na webu je)
*Směr po podkladech klienta: 1) Dřevostavba (skládání domu), 2) Zděný dům (skládání domu),
3) Skladba stěn a podlah (vrstvy). Rekonstrukce = budoucí videa, NE animace. Pozadí = styl z koláže.*
- ✅ **M** Skladba stěn a podlah — animace hotová (difuzně otevřená/uzavřená/podlaha), vlastní vzhled
- 🟡 **M** Skladba — 🟡 vrstvy jsou zatím generický placeholder (`js/wall.js`), aby nevypadaly od Easy Homes
- ⬜ **K** Stavební postup (pořadí fází) — dřevostavba i zděný dům (pro skládání domu)
- ⬜ **K** Vlastní skladby stěn/podlah (názvy, tloušťky) — volitelné; jinak necháme obecnou
- ⬜ **K** Které domy na pozadí (z koláže / vlastní) + ideálně půdorys/3D u 1–2
- 🟡 **M** Pozadí hero sekcí — zatím výřezy z koláže + stock; finál = rendery v tom stylu / vlastní fotky
- ⬜ **K** Rekonstrukce — videa (natočíme později)
- ⬜ **K** Logo ve vektoru (SVG/AI/EPS) + potvrzení barev + font Visby CF
- ⬜ **D** Jak vyrobit finální skládání domu (zůstat u SVG stylu / Lottie / 3D) — viz `vizualizace-technicke-reseni.md`

## B) PRÁVNÍ A POVINNÉ NÁLEŽITOSTI (aby web působil kompletně a byl v souladu)
- ⬜ **M+D** **Zásady ochrany osobních údajů (GDPR)** — web sbírá data formulářem → povinné.
  Musí obsahovat: správce (STAGNUM s.r.o., IČO, sídlo, kontakt), jaké údaje, účel (poptávka),
  právní základ, doba uchování, **příjemci dat**, práva subjektu, cookies.
- ⬜ **M** **Souhlas se zpracováním u formuláře** — checkbox + odkaz na zásady.
- 🟡 **M+D** **⚠️ Předávání leadů partnerům** (realitka / finanční poradce přes checkboxy „pozemek"/„financování")
  = předání osobních údajů třetí straně → **nutný výslovný souhlas** a uvedení partnerů v zásadách. Právně ošetřit.
- ⬜ **M** **Cookie lišta + Zásady cookies** — jakmile nasadíme Google Analytics / Meta Pixel
  (souhlas PŘED načtením marketing/analytics cookies dle ePrivacy).
- ⬜ **M+D** **Podmínky užití webu** — autorská práva k obsahu, vyloučení odpovědnosti.
- 🟡 **M** **Disclaimer u kalkulačky** — „orientační cena není závaznou nabídkou" (částečně máme, doladit).
- ✅ Identifikace firmy (IČO, DIČ, sídlo) v patičce.
> Doporučení: texty GDPR/podmínek připravíme jako návrh, finálně ať schválí klient (popř. jeho právník/účetní).

## C) OBSAH OD KLIENTA (nahradit placeholdery)
- 🟡 **K** Reálné texty o firmě / „O nás" / příběh (po rozhovoru)
- 🟡 **K** Reálná čísla (roky praxe, počet realizací, dojezd/region)
- 🟡 **K** Reálné fotky a videa (focení ~měsíc) — hero, realizace, případně tým
- 🟡 **K** Reference / recenze zákazníků **+ jejich souhlas se zveřejněním** (GDPR)
- 🟡 **K** Loga partnerů (DEK, Senesi, KV Elektro, Ptáček) **+ souhlas s použitím**
- ⬜ **K** Sazby a parametry do kalkulačky (cenotvorba)
- ⬜ **K** FAQ — časté dotazy zákazníků
- ⬜ **K** Certifikace, pojištění odpovědnosti, záruky (zvyšuje důvěru)

## D) FUNKCE A TECHNIKA (my)
- 🟡 **M** Napojení formuláře → odeslání na **info@stagnum.cz** + automatický potvrzovací e-mail zákazníkovi
  (klient zmínil aplikaci ~do 500 Kč/měs)
- ⬜ **M** Logika checkboxů pozemek/financování → předání partnerům (+ GDPR souhlas, viz B)
- ⬜ **M** Cookie consent nástroj + **Google Analytics 4** + **Meta Pixel** (kvůli FB/IG kampaním)
- ⬜ **M+K** **Doména stagnum.cz** — registrace + DNS na Vercel + HTTPS
- ⬜ **M+K** Firemní schránka **info@stagnum.cz** (mailbox / přesměrování)
- ⬜ **M** SEO: OG náhledový obrázek, `sitemap.xml`, `robots.txt`, strukturovaná data **LocalBusiness**
  (firma + adresa + telefon → Google), favicon
- ⬜ **M+K** **Google Business Profile** (firma na Mapách) + embed mapy v kontaktu
- ⬜ **M** Stránka 404, kontrola výkonu (Lighthouse) a přístupnosti
- ⬜ **M+K** Napojení odkazů **FB / IG** (až vzniknou profily)
- ⬜ **K+M** Finální font **Visby CF** (licence) místo náhrady Poppins/Inter

---

## Co řešíme HNED vs. POZDĚJI
- **Teď (email klientovi):** sekce **A** — vstupy pro vizualizace. Ať může začít rozjet výrobu vizualizací.
- **Osobně na zkoušce:** sekce **B, C, D** — právní náležitosti, obsah, napojení, analytika, doména.
- **Finálně:** doplnit reálný obsah + vizualizace → spustit kompletní web.
