function includesAny(text, words) {
  const lower = String(text || "").toLowerCase();
  return words.some((word) => lower.includes(word));
}

function normalizeService(service) {
  const value = String(service || "").toLowerCase();
  if (includesAny(value, ["landing"])) return "Landing Page";
  if (includesAny(value, ["seo"])) return "SEO-Optimierung";
  if (includesAny(value, ["support", "laufender", "maintenance", "wartung"])) return "Laufender Support";
  if (includesAny(value, ["entwicklung", "development"])) return "Web-Entwicklung";
  if (includesAny(value, ["design"])) return "Website Design";
  if (includesAny(value, ["other", "sonstiges", "nicht sicher"])) return "Noch nicht sicher";
  return service || "Website Design";
}

function detectProjectType(service, message) {
  const selected = normalizeService(service);
  const text = String(message || "").toLowerCase();

  if (selected && selected !== "Noch nicht sicher") return selected;
  if (includesAny(text, ["shop", "ecommerce", "e-commerce", "woocommerce", "shopify"])) return "Online Shop";
  if (includesAny(text, ["landing", "kampagne", "campaign"])) return "Landing Page";
  if (includesAny(text, ["redesign", "modernisieren", "modernise", "modernize", "neu machen", "refresh"])) return "Website Redesign";
  if (includesAny(text, ["seo", "google", "ranking"])) return "SEO-Optimierung";
  if (includesAny(text, ["wartung", "maintenance", "support", "updates"])) return "Laufender Support";
  if (includesAny(text, ["entwicklung", "development", "web app", "portal", "dashboard", "booking"])) return "Web-Entwicklung";
  return "Website Design";
}

function detectTimeline(message) {
  const text = String(message || "").toLowerCase();
  if (includesAny(text, ["dringend", "urgent", "asap", "so schnell", "next week", "naechste woche", "nächste woche"])) return "dringend";
  if (includesAny(text, ["2 weeks", "two weeks", "2 wochen", "14 days", "14 tage"])) return "2 Wochen";
  if (includesAny(text, ["month", "monat"])) return "1 Monat+";
  return "nicht genannt";
}

function detectBusiness(message) {
  const text = String(message || "");
  const patterns = [
    /(?:wir sind|we are)\s+(?:eine[nr]?|ein|a|an)?\s*([^.,\n]{4,80})/i,
    /(?:für|fuer|for)\s+(?:eine[nr]?|ein|a|an)?\s*([^.,\n]{4,80})/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return cleanupBusiness(match[1]);
  }

  return "nicht genannt";
}

function cleanupBusiness(value) {
  return String(value || "")
    .replace(/\bund brauchen\b.*$/i, "")
    .replace(/\band need\b.*$/i, "")
    .replace(/\bwith\b.*$/i, "")
    .trim() || "nicht genannt";
}

function detectGoal(message) {
  const text = String(message || "").toLowerCase();
  if (includesAny(text, ["mehr kundenanfragen", "kundenanfragen", "leads", "anfragen"])) return "mehr Kundenanfragen";
  if (includesAny(text, ["umsatz", "sales", "verkaufen"])) return "mehr Umsatz";
  if (includesAny(text, ["booking", "buchungen", "termine"])) return "mehr Buchungen/Termine";
  if (includesAny(text, ["modern", "professioneller", "vertrauen", "trust"])) return "professioneller Auftritt";
  return "nicht genannt";
}

function getBudgetValue(budget) {
  const text = String(budget || "");
  if (includesAny(text, ["6.000", "6000", "£5,000", "5000+"])) return 4;
  if (includesAny(text, ["3.000", "3000", "£2,500", "2500"])) return 3;
  if (includesAny(text, ["1.500", "1500", "£1,000", "1000"])) return 2;
  if (includesAny(text, ["nicht sicher", "not sure"])) return 1;
  return 0;
}

function formatDate(date) {
  return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function buildAnalysis(payload) {
  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim();
  const phone = String(payload.phone || "").trim();
  const budget = String(payload.budget || "").trim() || "nicht genannt";
  const service = String(payload.service || "").trim();
  const message = String(payload.message || "").trim();
  const projectType = detectProjectType(service, message);
  const timeline = detectTimeline(message);
  const business = detectBusiness(message);
  const goal = detectGoal(message);
  const missing = [];

  if (!name) missing.push("Name");
  if (!email) missing.push("E-Mail");
  if (!message) missing.push("Projektbeschreibung");
  if (budget === "nicht genannt") missing.push("Budget");
  if (timeline === "nicht genannt") missing.push("Zeitplan");
  if (business === "nicht genannt") missing.push("Branche/Zielgruppe");
  if (goal === "nicht genannt") missing.push("Projektziel");

  let score = 45;
  if (email) score += 10;
  if (phone) score += 5;
  if (getBudgetValue(budget) >= 2) score += 12;
  if (getBudgetValue(budget) >= 3) score += 8;
  if (timeline !== "nicht genannt") score += 10;
  if (business !== "nicht genannt") score += 8;
  if (goal !== "nicht genannt") score += 8;
  if (!missing.length) score += 8;
  if (timeline === "dringend") score += 5;
  score = Math.min(score, 99);

  const status = missing.length ? "Info fehlt" : "Discovery Call anbieten";
  const priority = score >= 80 ? "Hoch" : score >= 60 ? "Mittel" : "Normal";
  const nextAction = missing.length ? "Rueckfragen senden" : "15-Minuten-Call vorschlagen";
  const followUpDate = formatDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));

  const analysis = {
    projectType,
    business,
    goal,
    timeline,
    missing,
    score,
    status,
    priority,
    nextAction,
    followUpDate
  };

  const replyDraft = buildReplyDraft({ name, budget, service, ...analysis });

  return {
    ...analysis,
    replyDraft,
    internalNote: buildInternalNote({ name, email, phone, budget, service, replyDraft, ...analysis })
  };
}

function greeting(name) {
  if (!name) return "Hallo,";
  const first = name.split(" ")[0];
  return `Hallo ${first},`;
}

function buildReplyDraft(lead) {
  if (lead.missing.length) {
    return `${greeting(lead.name)}

vielen Dank für Ihre Anfrage bei E&E Digital.

Ihr Projekt klingt interessant. Damit ich Ihnen eine sinnvolle Empfehlung und eine realistische Einschätzung geben kann, bräuchte ich noch kurz ein paar Informationen:

${lead.missing.map((item) => `- ${item}`).join("\n")}

Danach kann ich Ihnen den besten nächsten Schritt vorschlagen und eine deutlich genauere Einschätzung geben.

Viele Grüße
Ebu Bekir Yel
E&E Digital`;
  }

  return `${greeting(lead.name)}

vielen Dank für Ihre Anfrage bei E&E Digital.

Nach Ihrer Nachricht klingt das nach einem Projekt im Bereich ${lead.projectType}. Das angegebene Budget liegt bei ${lead.budget}, der Zeitplan ist ${lead.timeline}, und das Ziel scheint ${lead.goal} zu sein.

Der beste nächste Schritt wäre ein kurzer Discovery Call. Dann kann ich Ihre Ziele, Inhalte, Designrichtung und den geplanten Launch kurz verstehen und Ihnen danach konkreter sagen, wie ich vorgehen würde.

Hätten Sie diese oder nächste Woche 15 Minuten Zeit?

Viele Grüße
Ebu Bekir Yel
E&E Digital`;
}

function buildInternalNote(lead) {
  return `Lead Agent Zusammenfassung

Name: ${lead.name || "-"}
E-Mail: ${lead.email || "-"}
Telefon: ${lead.phone || "-"}
Ausgewählte Leistung: ${lead.service || "-"}
Erkannter Projekttyp: ${lead.projectType}
Budget: ${lead.budget}
Zeitplan: ${lead.timeline}
Branche/Zielgruppe: ${lead.business}
Ziel: ${lead.goal}
Score: ${lead.score}
Prioritaet: ${lead.priority}
Status: ${lead.status}
Nächste Aktion: ${lead.nextAction}
Follow-up: ${lead.followUpDate}
Fehlende Informationen: ${lead.missing.length ? lead.missing.join(", ") : "keine wichtigen Lücken"}

Empfohlene Antwort:
${lead.replyDraft}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const payload = req.body || {};
    const name = String(payload.name || "").trim();
    const email = String(payload.email || "").trim();
    const message = String(payload.message || "").trim();

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "Name, email and message are required." });
    }

    const analysis = buildAnalysis(payload);
    const formspreePayload = {
      ...payload,
      "Lead Score": analysis.score,
      "Lead Status": analysis.status,
      "Prioritaet": analysis.priority,
      "Nächste Aktion": analysis.nextAction,
      "Follow-up Datum": analysis.followUpDate,
      "Erkannter Projekttyp": analysis.projectType,
      "Branche/Zielgruppe": analysis.business,
      "Erkanntes Ziel": analysis.goal,
      "Fehlende Informationen": analysis.missing.join(", ") || "keine wichtigen Lücken",
      "Interne Notiz": analysis.internalNote,
      "Antwortentwurf": analysis.replyDraft
    };

    return res.status(200).json({ ok: true, analysis, formspreePayload });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Unexpected contact form error." });
  }
};
