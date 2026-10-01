/**
 * STAGNUM — poptávkový formulář → e-mail přes Resend
 *
 * Vercel serverless funkce: POST /api/lead
 * Env proměnné (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY  – API klíč z resend.com (povinné)
 *   CONTACT_TO      – kam chodí poptávky (default info@stagnum.cz)
 *   CONTACT_FROM    – odesílatel (default STAGNUM <info@stagnum.cz>,
 *                     doména musí být ověřená v Resend)
 */

const esc = (s) => String(s || '').slice(0, 2000)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(500).json({ ok: false, error: 'Email service not configured' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const { name, phone, email, service, message, plot, finance, website } = body || {};

  // honeypot – skryté pole, boti ho vyplní
  if (website) return res.status(200).json({ ok: true });

  if (!name || !phone) return res.status(400).json({ ok: false, error: 'Chybí jméno nebo telefon' });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Neplatný e-mail' });
  }

  const TO = process.env.CONTACT_TO || 'info@stagnum.cz';
  const FROM = process.env.CONTACT_FROM || 'STAGNUM <info@stagnum.cz>';

  const rows = [
    ['Jméno', name], ['Telefon', phone], ['E-mail', email || '—'],
    ['Zájem o', service || '—'], ['Vlastní pozemek', plot ? 'ANO' : 'ne'],
    ['Chce financování', finance ? 'ANO' : 'ne'], ['Zpráva', message || '—'],
  ].map(([k, v]) => `<tr><td style="padding:6px 14px 6px 0;color:#5b7287;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 0;color:#16344f"><strong>${esc(v)}</strong></td></tr>`).join('');

  const send = (payload) => fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  try {
    // 1) poptávka do firmy
    const r = await send({
      from: FROM, to: [TO],
      reply_to: email || undefined,
      subject: `Nová poptávka z webu — ${esc(name)}${service ? ' · ' + esc(service) : ''}`,
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">
        <h2 style="color:#003A70;margin:0 0 14px">Nová poptávka z webu stagnum.cz</h2>
        <table style="border-collapse:collapse">${rows}</table>
        <p style="margin-top:18px;color:#5b7287;font-size:13px">Odesláno z poptávkového formuláře.</p></div>`,
    });
    if (!r.ok) {
      const detail = await r.text();
      console.error('Resend error:', r.status, detail);
      return res.status(502).json({ ok: false, error: 'Odeslání se nezdařilo' });
    }

    // 2) potvrzení zákazníkovi (jen když uvedl e-mail; selhání neblokuje)
    if (email) {
      send({
        from: FROM, to: [email],
        subject: 'STAGNUM — vaši poptávku jsme přijali',
        html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#16344f">
          <h2 style="color:#003A70;margin:0 0 14px">Děkujeme za vaši poptávku</h2>
          <p>Dobrý den${name ? ' ' + esc(name) : ''},</p>
          <p>vaši nezávaznou poptávku jsme v pořádku přijali a <strong>ozveme se vám do 48 hodin</strong> (v pracovní dny).</p>
          <p>Potřebujete-li cokoli dřív, zavolejte nám na <strong>733 420 275</strong> nebo <strong>604 528 704</strong>.</p>
          <p style="margin-top:22px">S pozdravem<br><strong>STAGNUM s.r.o.</strong><br>
          <span style="color:#5b7287;font-size:13px">Slovanská 1404/191, Plzeň · www.stagnum.cz</span></p></div>`,
      }).catch((e) => console.error('Confirm mail failed:', e));
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Lead error:', e);
    return res.status(500).json({ ok: false, error: 'Odeslání se nezdařilo' });
  }
};
