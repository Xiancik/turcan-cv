# turcan.nl visit notifier

Fires a Telegram message every time someone loads a page on turcan.nl.

Architecture:

```
browser (notify.js) --POST--> Cloudflare Worker (notify/worker.js) --POST--> Telegram Bot API
```

Bot token lives as a Worker secret so it's never in the page source.

## One-time setup

### 1. Create the Telegram bot

1. Open Telegram, message [@BotFather](https://t.me/BotFather).
2. `/newbot` — pick a name (e.g. `turcan.nl visits`) and a username ending in `bot` (e.g. `turcan_nl_visits_bot`).
3. Save the token BotFather gives you. It looks like `123456789:AAE...`.

### 2. Get your chat_id

1. Send any message to your new bot (search its username, tap Start, say hi).
2. In a browser, open:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Find `"chat":{"id":<number>,...}` in the JSON. That number is your chat_id.

### 3. Deploy the Worker

Requires Node.js and a free Cloudflare account.

```bash
npm install -g wrangler
cd notify
wrangler login
wrangler secret put TELEGRAM_BOT_TOKEN   # paste token
wrangler secret put TELEGRAM_CHAT_ID     # paste chat_id
wrangler deploy
```

Wrangler prints the deployed URL, e.g. `https://turcan-cv-notify.<your-subdomain>.workers.dev`.

### 4. Point the client at the Worker

Edit `../notify.js` and replace `YOUR-SUBDOMAIN` in the `ENDPOINT` constant with what wrangler printed. The full URL should end in `/notify`.

Commit and push — GitHub Pages will redeploy the site.

### 5. Test

Open `https://turcan.nl` in a private window. You should get a Telegram message within a second or two. If nothing arrives:

- `wrangler tail` (from `notify/`) streams live Worker logs.
- Check the browser DevTools Network tab for the POST to `/notify` — 403 means the Origin isn't in `ALLOWED_ORIGINS` (edit `wrangler.toml`, redeploy).

## Tuning

- **Dedupe:** `notify.js` skips duplicate hits to the same path within 60s per session. Change `DEDUPE_MS`.
- **Bot filter:** `looksLikeBot()` in `worker.js` drops common crawlers/link-preview fetchers by User-Agent.
- **Add domains:** edit `ALLOWED_ORIGINS` in `wrangler.toml` and `wrangler deploy` again.
- **Mute:** set `ENDPOINT` back to a placeholder (`YOUR-SUBDOMAIN`) to disable client-side without redeploying the Worker.

## Files

- `worker.js` — Cloudflare Worker source.
- `wrangler.toml` — Worker config (allowed origins, no secrets).
- `../notify.js` — client beacon loaded by every page.
