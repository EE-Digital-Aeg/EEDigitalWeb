function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function textToHtml(text) {
  return `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#111827;">${escapeHtml(text).replaceAll("\n", "<br>")}</div>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return res.status(500).json({
      ok: false,
      error: "Direktversand ist noch nicht eingerichtet. In Vercel fehlen RESEND_API_KEY oder RESEND_FROM_EMAIL."
    });
  }

  try {
    const to = String(req.body?.to || "").trim();
    const subject = String(req.body?.subject || "").trim();
    const body = String(req.body?.body || "").trim();

    if (!to || !subject || !body) {
      return res.status(400).json({ ok: false, error: "Empfänger, Betreff und Text sind erforderlich." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return res.status(400).json({ ok: false, error: "Ungültige Empfänger-Adresse." });
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text: body,
        html: textToHtml(body)
      })
    });

    const data = await resendRes.json().catch(() => ({}));

    if (!resendRes.ok) {
      return res.status(502).json({
        ok: false,
        error: data.message || "Resend konnte die Mail nicht senden."
      });
    }

    return res.status(200).json({ ok: true, id: data.id });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Unerwarteter Fehler beim Direktversand." });
  }
};
