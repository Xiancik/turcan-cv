// Cloudflare Worker: turcan-cv visit notifier.
//
// Receives POST /notify from the site and forwards a summarised message
// to a Telegram chat via the Bot API. Keeps the bot token server-side.
//
// Secrets (set with: wrangler secret put <NAME>)
//   TELEGRAM_BOT_TOKEN  Bot token from @BotFather
//   TELEGRAM_CHAT_ID    Chat id to receive notifications
//
// Vars (in wrangler.toml)
//   ALLOWED_ORIGINS     Comma-separated list, e.g. "https://turcan.nl,https://www.turcan.nl"

const JSON_HEADERS = { "content-type": "application/json" };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    if (request.method !== "POST" || url.pathname !== "/notify") {
      return new Response("not found", { status: 404 });
    }

    const origin = request.headers.get("origin") || "";
    if (!isAllowedOrigin(origin, env)) {
      return new Response("forbidden", { status: 403 });
    }

    // Best-effort bot filter based on User-Agent.
    const ua = request.headers.get("user-agent") || "";
    if (looksLikeBot(ua)) {
      return json({ skipped: "bot" }, 200, request, env);
    }

    let payload = {};
    try {
      payload = await request.json();
    } catch {
      // sendBeacon uses text/plain; parse the body ourselves.
      try {
        const text = await request.text();
        payload = text ? JSON.parse(text) : {};
      } catch {
        return json({ error: "bad payload" }, 400, request, env);
      }
    }

    const message = formatMessage(payload, request, ua);
    const token = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return json({ error: "not configured" }, 500, request, env);
    }

    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!tg.ok) {
      const body = await tg.text();
      return json({ error: "telegram failed", detail: body }, 502, request, env);
    }
    return json({ ok: true }, 200, request, env);
  },
};

function isAllowedOrigin(origin, env) {
  const list = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.includes(origin);
}

function corsHeaders(request, env) {
  const origin = request.headers.get("origin") || "";
  const allow = isAllowedOrigin(origin, env) ? origin : "";
  return {
    "access-control-allow-origin": allow,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    vary: "origin",
  };
}

function json(body, status, request, env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...corsHeaders(request, env) },
  });
}

function looksLikeBot(ua) {
  if (!ua) return true;
  return /bot|crawler|spider|preview|slurp|facebookexternalhit|whatsapp|telegrambot|headless|monitor|uptimerobot|pingdom|semrush|ahrefs|dataforseo|petalbot|bytespider/i.test(
    ua,
  );
}

function formatMessage(payload, request, ua) {
  const cf = request.cf || {};
  const path = safeStr(payload.path, 200) || "/";
  const referrer = safeStr(payload.referrer, 200);
  const title = safeStr(payload.title, 120);
  const screen = safeStr(payload.screen, 40);
  const lang = safeStr(payload.lang, 20);
  const country = safeStr(cf.country, 4);
  const city = safeStr(cf.city, 60);
  const region = safeStr(cf.region, 60);
  const asn = safeStr(cf.asOrganization, 80);

  const location = [city, region, country].filter(Boolean).join(", ");
  const lines = [
    `<b>turcan.nl visit</b>`,
    `<b>Page:</b> ${escapeHtml(path)}${title ? ` — ${escapeHtml(title)}` : ""}`,
  ];
  if (referrer) lines.push(`<b>From:</b> ${escapeHtml(referrer)}`);
  if (location) lines.push(`<b>Where:</b> ${escapeHtml(location)}`);
  if (asn) lines.push(`<b>Network:</b> ${escapeHtml(asn)}`);
  if (screen || lang) {
    const bits = [screen, lang].filter(Boolean).join(" · ");
    lines.push(`<b>Client:</b> ${escapeHtml(bits)}`);
  }
  if (ua) lines.push(`<b>UA:</b> ${escapeHtml(ua.slice(0, 200))}`);
  return lines.join("\n");
}

function safeStr(v, max) {
  if (v == null) return "";
  const s = String(v);
  return s.length > max ? s.slice(0, max) : s;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
