function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildMailto(to, subject, body) {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  const to = String(req.query.to || "");
  const subject = String(req.query.subject || "Ihre Anfrage bei E&E Digital");
  const body = String(req.query.body || "");
  const mailto = buildMailto(to, subject, body);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(`<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Antwortentwurf - E&E Digital</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #090812;
      --panel: #11101d;
      --ink: #f5f3ff;
      --muted: #a8a1c4;
      --line: #2c2941;
      --accent: #8b5cf6;
      --accent-2: #ec4899;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: radial-gradient(circle at 20% 0%, rgba(139,92,246,.22), transparent 34%), var(--bg);
      color: var(--ink);
      line-height: 1.55;
    }
    main {
      max-width: 900px;
      margin: 0 auto;
      padding: 38px 18px 52px;
    }
    .brand {
      font-size: 28px;
      font-weight: 850;
      margin-bottom: 24px;
    }
    .brand span { color: var(--accent); }
    .card {
      background: rgba(17, 16, 29, .94);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 22px 70px rgba(0,0,0,.28);
    }
    h1 {
      margin: 0 0 8px;
      font-size: 30px;
      letter-spacing: 0;
      line-height: 1.12;
    }
    .meta {
      display: grid;
      grid-template-columns: 100px minmax(0, 1fr);
      gap: 8px 14px;
      padding: 14px 0 18px;
      border-bottom: 1px solid var(--line);
      margin-bottom: 18px;
    }
    .meta span { color: var(--muted); }
    .meta strong { overflow-wrap: anywhere; }
    pre {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      background: #0b0a14;
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 16px;
      min-height: 260px;
      font: inherit;
      color: var(--ink);
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 16px;
    }
    button, a.button {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 11px 14px;
      min-height: 44px;
      color: var(--ink);
      background: #181629;
      font: inherit;
      font-weight: 760;
      text-decoration: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .primary {
      border-color: transparent;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
    }
    .hint {
      color: var(--muted);
      font-size: 14px;
      margin-top: 14px;
    }
  </style>
</head>
<body>
  <main>
    <div class="brand">E&E<span>Digital</span></div>
    <section class="card">
      <h1>Antwortentwurf</h1>
      <p class="hint">Prüfen, bei Bedarf anpassen und dann senden.</p>
      <div class="meta">
        <span>An</span><strong id="to">${escapeHtml(to)}</strong>
        <span>Betreff</span><strong id="subject">${escapeHtml(subject)}</strong>
      </div>
      <pre id="draft">${escapeHtml(body)}</pre>
      <div class="actions">
        <a class="button primary" href="${escapeHtml(mailto)}">Mail-Entwurf öffnen</a>
        <button id="copyDraft">Antwort kopieren</button>
        <button id="copyAll">Alles kopieren</button>
      </div>
      <p class="hint" id="status">Wenn der Mail-Button nicht funktioniert, kopieren Sie den Text und antworten manuell.</p>
    </section>
  </main>
  <script>
    const draft = ${JSON.stringify(body)};
    const to = ${JSON.stringify(to)};
    const subject = ${JSON.stringify(subject)};
    const status = document.querySelector("#status");
    document.querySelector("#copyDraft").addEventListener("click", async () => {
      await navigator.clipboard.writeText(draft);
      status.textContent = "Antwort kopiert.";
    });
    document.querySelector("#copyAll").addEventListener("click", async () => {
      await navigator.clipboard.writeText("An: " + to + "\\nBetreff: " + subject + "\\n\\n" + draft);
      status.textContent = "Empfänger, Betreff und Antwort kopiert.";
    });
  </script>
</body>
</html>`);
};
