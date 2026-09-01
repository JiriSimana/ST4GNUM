# stagnum.cz — DNS, e-maily (Email Profi) a Resend

Aktuální stav (ověřeno 1. 9. 2026): doména je u **Active24/Websupport**
(NS: ns1/ns2.websupport.cz), web míří na Active24 parking (A 37.9.175.164),
MX jsou výchozí Active24. → Vše níže se nastavuje v **administraci Active24
(Websupport) → doména stagnum.cz → DNS záznamy**.

---

## KROK 1 — Napojit doménu na web (Vercel)

1. Vercel dashboard → projekt **st4gnum** → Settings → **Domains** → Add → `stagnum.cz` (a `www.stagnum.cz`).
2. V DNS u Active24:

| Typ | Název (host) | Hodnota | TTL |
|---|---|---|---|
| A | `@` | `76.76.21.21` | 3600 |
| CNAME | `www` | `cname.vercel-dns.com.` | 3600 |

3. Smazat původní A záznam na 37.9.175.164 (parking). Vercel pak sám vystaví HTTPS certifikát.

## KROK 2 — E-mailové schránky (Email Profi od Seznamu)

1. Založit službu na **emailprofi.seznam.cz** → „Napojit existující doménu" → `stagnum.cz`.
2. Administrace Email Profi vypíše **ověřovací TXT** a **MX záznamy** — zadat přesně ty, co vypíše
   (standardně jde o `mx1.seznam.cz` prio 10 a `mx2.seznam.cz` prio 20).
3. V DNS u Active24 — **smazat staré MX** (mx10/mx20.active24.cz) a nastavit:

| Typ | Název | Hodnota | Priorita |
|---|---|---|---|
| MX | `@` | `mx1.seznam.cz.` | 10 |
| MX | `@` | `mx2.seznam.cz.` | 20 |
| TXT | `@` | (ověřovací kód z administrace Email Profi) | — |

4. **SPF** — nahradit stávající TXT `v=spf1 a mx include:_spf.websupport.cz -all` za:

| Typ | Název | Hodnota |
|---|---|---|
| TXT | `@` | `v=spf1 include:spf.seznam.cz ~all` |

   (Na doméně smí být jen JEDEN SPF záznam. Resend root SPF nepotřebuje — používá subdoménu, viz krok 3.)

5. **DKIM** (od 4/2026 tři CNAME):

| Typ | Název | Hodnota |
|---|---|---|
| CNAME | `szn1._domainkey` | `szn1._domainkey.seznam.cz.` |
| CNAME | `szn2._domainkey` | `szn2._domainkey.seznam.cz.` |
| CNAME | `szn3._domainkey` | `szn3._domainkey.seznam.cz.` |

6. **DMARC** (doporučeno, začít mírně):

| Typ | Název | Hodnota |
|---|---|---|
| TXT | `_dmarc` | `v=DMARC1; p=none; adkim=r; aspf=r;` |

   (Po pár týdnech bez problémů přepnout na `p=quarantine`.)

7. V Email Profi založit schránky: **info@stagnum.cz** (hlavní) + případně osobní (tomas@, jan@).

## KROK 3 — Resend (odesílání formuláře z webu)

1. Založit účet na **resend.com** → Domains → **Add Domain** → `stagnum.cz` (region EU — Ireland).
2. Resend vypíše 3 záznamy (hodnoty jsou unikátní pro účet — opsat z dashboardu):

| Typ | Název | Hodnota (vzor) |
|---|---|---|
| MX | `send` | `feedback-smtp.eu-west-1.amazonses.com.` prio 10 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` |
| TXT | `resend._domainkey` | `p=MIGfMA0...` (DKIM klíč z dashboardu) |

   → Tyto záznamy jsou na SUBdoménách, s Email Profi se nijak netlučou.
3. V Resend → API Keys → **Create API key** (Sending access stačí).
4. Vercel dashboard → projekt st4gnum → Settings → **Environment Variables** → přidat:
   - `RESEND_API_KEY` = (klíč z Resendu) — prostředí Production
   - volitelně `CONTACT_TO` (default je info@stagnum.cz) a `CONTACT_FROM` (default `STAGNUM <poptavka@stagnum.cz>`)
5. **Redeploy** projektu (Deployments → ⋯ → Redeploy), aby si funkce načetla env proměnné.

## Co už je hotové v kódu (nasazeno)

- `api/lead.js` — serverless funkce: pošle poptávku na info@stagnum.cz a zákazníkovi
  potvrzení (pokud vyplnil e-mail). Honeypot proti botům, validace.
- Formulář na kontakt.html — přidán nepovinný e-mail, odesílá na `/api/lead`,
  stavy „Odesílám… / ✓ přijato / chyba + telefon".
- GDPR — doplněni zpracovatelé (Resend, Seznam.cz).

## Ověření po nastavení

```bash
dig +short A stagnum.cz          # → 76.76.21.21
dig +short MX stagnum.cz         # → mx1/mx2.seznam.cz
dig +short TXT stagnum.cz        # → v=spf1 include:spf.seznam.cz ~all
dig +short TXT resend._domainkey.stagnum.cz   # → p=...
```
Pak poslat testovací poptávku z webu a zkontrolovat info@stagnum.cz (i spam).
DNS se může propisovat až ~1 hod (dle TTL).
