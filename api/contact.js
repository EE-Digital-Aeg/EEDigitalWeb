const FORMSPREE_ENDPOINT = "https://formspree.io/f/xeeropao";

function includesAny(text, words) {
  const lower = String(text || "").toLowerCase();
  return words.some((word) => lower.includes(word));
}

function detectProjectType(service, message) {
  const text = `${service || ""} ${message || ""}`.toLowerCase();
  if (includesAny(text, ["landing", "campaign", "kampagne"])) return "Landing Page";
  if (includesAny(text, ["seo", "google", "ranking"])) return "SEO Optimisation";
  if (includesAny(text, ["shop", "ecommerce", "e-commerce", "woocommerce", "shopify"])) return "Online Shop";
  if (includesAny(text, ["redesign", "modernise", "modernize", "neu machen", "refresh"])) return "Website Redesign";
  if (includesAny(text, ["maintenance", "support", "updates", "wartung"])) return "Ongoing Support";
  if (includesAny(text, ["development", "web app", "portal", "dashboard", "booking"])) return "Web Development";
  return service || "Website Design";
}

function detectTimeline(message) {
  const text = String(message || "").toLowerCase();
  if (includesAny(text, ["urgent", "asap", "dringend", "so schnell", "next week", "naechste woche", "nächste woche"])) return "urgent";
  if (includesAny(text, ["2 weeks", "two weeks", "2 wochen", "14 days", "14 tage"])) return "2 weeks";
  if (includesAny(text, ["month", "monat"])) return "1 month+";
  return "not mentioned";
}

function detectBusiness(message) {
  const match = String(message || "").match(/(?:for|fuer|für|we are|wir sind)\s+(?:a|an|eine[nr]?|ein)?\s*([^.,\n]{4,70})/i);
  return match ? match[1].trim() : "not mentioned";
}

function buildAnalysis(payload) {
  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim();
  const phone = String(payload.phone || "").trim();
  const budget = String(payload.budget || "").trim() || "not mentioned";
  const service = String(payload.service || "").trim();
  const message = String(payload.message || "").trim();
  const projectType = detectProjectType(service, message);
  const timeline = detectTimeline(message);
  const business = detectBusiness(message);
  const missing = [];

  if (!name) missing.push("name");
  if (!email) missing.push("email");
  if (!message) missing.push("project description");
  if (budget === "not mentioned") missing.push("budget");
  if (timeline === "not mentioned") missing.push("timeline");
  if (business === "not mentioned") missing.push("business / audience");
  if (!includesAny(message, ["goal", "goals", "customers", "leads", "sales", "bookings", "inquiries", "anfragen", "umsatz"])) {
    missing.push("main goal");
  }

  let score = 45;
  if (email) score += 10;
  if (phone) score += 5;
  if (budget !== "not mentioned") score += 12;
  if (timeline !== "not mentioned") score += 10;
  if (business !== "not mentioned") score += 8;
  if (!missing.length) score += 10;
  if (budget.includes("£2,500") || budget.includes("£5,000")) score += 10;
  if (timeline === "urgent") score += 8;
  score = Math.min(score, 99);

  const status = missing.length ? "Info needed" : "Offer discovery call";
  const priority = score >= 80 ? "High" : score >= 60 ? "Medium" : "Normal";
  const nextAction = missing.length ? "Send clarification questions" : "Suggest a 15-minute call";
  const followUpDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const analysis = {
    projectType,
    business,
    timeline,
    missing,
    score,
    status,
    priority,
    nextAction,
    followUpDate
  };

  const replyDraft = buildReplyDraft({ name, budget, ...analysis });

  return {
    ...analysis,
    replyDraft,
    internalNote: buildInternalNote({ name, email, phone, budget, service, replyDraft, ...analysis })
  };
}

function greeting(name) {
  if (!name) return "Hi,";
  return `Hi ${name.split(" ")[0]},`;
}

function buildReplyDraft(lead) {
  if (lead.missing.length) {
    return `${greeting(lead.name)}

thanks for reaching out to E&E Digital.

Your project sounds interesting. To prepare a useful recommendation and quote, I would need a few quick details:

${lead.missing.map((item) => `- ${item}`).join("\n")}

After that, I can suggest the best next step and give you a clearer estimate.

Best regards
Ebu Bekir Yel
E&E Digital`;
  }

  return `${greeting(lead.name)}

thanks for reaching out to E&E Digital.

Based on your message, this looks like a ${lead.projectType} project. The budget range is ${lead.budget}, the timeline is ${lead.timeline}, and the target business/context seems to be: ${lead.business}.

The best next step would be a short discovery call so I can understand your goals, content, design direction and launch timeline.

Would you have 15 minutes this week or next week?

Best regards
Ebu Bekir Yel
E&E Digital`;
}

function buildInternalNote(lead) {
  return `Lead Agent Summary

Name: ${lead.name || "-"}
Email: ${lead.email || "-"}
Phone: ${lead.phone || "-"}
Service selected: ${lead.service || "-"}
Project type: ${lead.projectType}
Budget: ${lead.budget}
Timeline: ${lead.timeline}
Business/context: ${lead.business}
Score: ${lead.score}
Priority: ${lead.priority}
Status: ${lead.status}
Next action: ${lead.nextAction}
Follow-up date: ${lead.followUpDate}
Missing: ${lead.missing.length ? lead.missing.join(", ") : "nothing major"}

Suggested reply:
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
    const enrichedPayload = {
      ...payload,
      lead_score: analysis.score,
      lead_status: analysis.status,
      lead_priority: analysis.priority,
      lead_next_action: analysis.nextAction,
      lead_follow_up_date: analysis.followUpDate,
      lead_project_type: analysis.projectType,
      lead_missing_info: analysis.missing.join(", ") || "nothing major",
      internal_note: analysis.internalNote,
      suggested_reply: analysis.replyDraft
    };

    const forwardRes = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(enrichedPayload)
    });

    if (!forwardRes.ok) {
      return res.status(502).json({ ok: false, error: "Could not forward the form submission." });
    }

    return res.status(200).json({ ok: true, analysis });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Unexpected contact form error." });
  }
};
