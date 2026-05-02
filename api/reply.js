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
  const name = String(req.query.name || "Lead");
  const score = String(req.query.score || "-");
  const status = String(req.query.status || "-");
  const priority = String(req.query.priority || "-");
  const action = String(req.query.action || "-");
  const project = String(req.query.project || "-");
  const followup = String(req.query.followup || "-");
  const message = String(req.query.message || "");
  const mailto = buildMailto(to, subject, body);
  const doneKey = `ee-reply-done:${to}:${subject}`;

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
      --panel-2: #151326;
      --ink: #f5f3ff;
      --muted: #a8a1c4;
      --line: #2c2941;
      --accent: #8b5cf6;
      --accent-2: #ec4899;
      --good: #22c55e;
      --warn: #f59e0b;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: radial-gradient(circle at 20% 0%, rgba(139,92,246,.22), transparent 34%), var(--bg);
      color: var(--ink);
      line-height: 1.5;
    }
    main {
      max-width: 1180px;
      margin: 0 auto;
      padding: 30px 18px 52px;
    }
    .brand {
      font-size: 28px;
      font-weight: 850;
      margin-bottom: 18px;
    }
    .brand span { color: var(--accent); }
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 360px;
      gap: 16px;
      align-items: start;
    }
    .card {
      background: rgba(17, 16, 29, .94);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 18px;
      box-shadow: 0 22px 70px rgba(0,0,0,.28);
    }
    h1, h2 {
      margin: 0 0 8px;
      letter-spacing: 0;
      line-height: 1.12;
    }
    h1 { font-size: 30px; }
    h2 { font-size: 18px; }
    .hint {
      color: var(--muted);
      font-size: 14px;
      margin: 0 0 14px;
    }
    .meta {
      display: grid;
      grid-template-columns: 92px minmax(0, 1fr);
      gap: 8px 14px;
      padding: 12px 0 16px;
      border-bottom: 1px solid var(--line);
      margin-bottom: 16px;
    }
    .meta span, .field span { color: var(--muted); }
    .meta strong { overflow-wrap: anywhere; }
    .badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 12px 0 16px;
    }
    .badge {
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 13px;
      font-weight: 800;
      background: #211c3a;
      border: 1px solid var(--line);
    }
    .badge.good { background: rgba(34,197,94,.16); border-color: rgba(34,197,94,.42); }
    .badge.warn { background: rgba(245,158,11,.14); border-color: rgba(245,158,11,.4); }
    textarea {
      width: 100%;
      min-height: 390px;
      resize: vertical;
      background: #0b0a14;
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 16px;
      font: inherit;
      color: var(--ink);
      line-height: 1.5;
    }
    pre {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      background: #0b0a14;
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 14px;
      font: inherit;
      color: var(--ink);
      max-height: 300px;
      overflow: auto;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 14px;
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
    .done {
      border-color: rgba(34,197,94,.5);
      background: rgba(34,197,94,.13);
    }
    .field-grid {
      display: grid;
      gap: 10px;
    }
    .field {
      background: var(--panel-2);
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 11px;
    }
    .field strong {
      display: block;
      margin-top: 3px;
      overflow-wrap: anywhere;
    }
    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main>
    <div class="brand">E&E<span>Digital</span></div>
    <div class="layout">
      <section class="card">
        <h1>Antwortentwurf</h1>
        <p class="hint">Bearbeiten, prüfen und dann als Mail-Entwurf öffnen.</p>
        <div class="meta">
          <span>An</span><strong id="to">${escapeHtml(to)}</strong>
          <span>Betreff</span><strong id="subject">${escapeHtml(subject)}</strong>
        </div>
        <textarea id="draft">${escapeHtml(body)}</textarea>
        <div class="actions">
          <button class="primary" id="openMail">Mail-Entwurf öffnen</button>
          <button id="copyDraft">Antwort kopieren</button>
          <button id="copyAll">Alles kopieren</button>
          <button id="markDone">Als erledigt markieren</button>
        </div>
        <p class="hint" id="statusText">Wenn der Mail-Button nicht funktioniert, kopieren Sie den Text und antworten manuell.</p>
      </section>

      <aside class="card">
        <h2>Lead-Übersicht</h2>
        <p class="hint">${escapeHtml(name)}</p>
        <div class="badges">
          <span class="badge good">Score ${escapeHtml(score)}</span>
          <span class="badge">${escapeHtml(priority)}</span>
          <span class="badge warn">${escapeHtml(status)}</span>
        </div>
        <div class="field-grid">
          <div class="field"><span>Projekt</span><strong>${escapeHtml(project)}</strong></div>
          <div class="field"><span>Nächste Aktion</span><strong>${escapeHtml(action)}</strong></div>
          <div class="field"><span>Follow-up</span><strong>${escapeHtml(followup)}</strong></div>
          <div class="field"><span>Originalnachricht</span><pre>${escapeHtml(message)}</pre></div>
        </div>
      </aside>
    </div>
  </main>
  <script>
    const to = ${JSON.stringify(to)};
    const subject = ${JSON.stringify(subject)};
    const doneKey = ${JSON.stringify(doneKey)};
    const draftInput = document.querySelector("#draft");
    const statusText = document.querySelector("#statusText");
    const markDone = document.querySelector("#markDone");

    function currentDraft() {
      return draftInput.value;
    }

    function mailto() {
      return "mailto:" + encodeURIComponent(to) + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(currentDraft());
    }

    function refreshDoneState() {
      if (localStorage.getItem(doneKey) === "1") {
        markDone.textContent = "Erledigt";
        markDone.classList.add("done");
        statusText.textContent = "Dieser Lead wurde in diesem Browser als erledigt markiert.";
      }
    }

    document.querySelector("#openMail").addEventListener("click", () => {
      window.location.href = mailto();
    });
    document.querySelector("#copyDraft").addEventListener("click", async () => {
      await navigator.clipboard.writeText(currentDraft());
      statusText.textContent = "Antwort kopiert.";
    });
    document.querySelector("#copyAll").addEventListener("click", async () => {
      await navigator.clipboard.writeText("An: " + to + "\\nBetreff: " + subject + "\\n\\n" + currentDraft());
      statusText.textContent = "Empfänger, Betreff und Antwort kopiert.";
    });
    markDone.addEventListener("click", () => {
      localStorage.setItem(doneKey, "1");
      refreshDoneState();
    });
    refreshDoneState();
  </script>
</body>
</html>`);
};
