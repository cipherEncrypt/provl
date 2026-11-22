# Provl

Provl is a consumer web agent with a proof layer: you describe a task in plain English, it runs in **real Chrome** through [Kane CLI](https://www.testmuai.com/kane-cli/), and you get back **DONE** or **NOT DONE**, evidence fields, a replay link, and a shareable proof page. Agents often say “done” with no evidence. Provl does not claim success unless Kane’s `run_end` verdict backs it.

**Submission repo:** replace with your public clone URL before judging.

```bash
git clone https://github.com/YOUR_ORG/provl.git provl
cd provl
```

---

## Quick start (judges)

### Prerequisites

- **Node.js 18+**
- **Google Chrome** (Kane drives local Chrome)
- Free **[TestMu AI](https://www.testmuai.com)** account with Kane credits

### 1. Install

```bash
npm install
```

### 2. Sign in to Kane (recommended)

```bash
npx @testmuai/kane-cli login --oauth
npx @testmuai/kane-cli whoami
npx @testmuai/kane-cli balance
```

The first `npx` call may take ~30s while Kane downloads. Provl shells out to `npx @testmuai/kane-cli` on each run.

### 3. Environment

```bash
cp .env.example .env
```

| Variable | Required? | Purpose |
|----------|-----------|---------|
| `PROVL_ENC_KEY` | For **Connect** + monitor sign-in secrets | 32+ char secret; encrypts stored Kane keys and monitor passwords at rest |
| `MONGODB_URI` | Optional | Atlas connection for run history and monitors when reachable; falls back to `.provl/` files |
| `CRON_SECRET` | Optional | Protects `POST /api/cron/run-watches` when scheduled monitors run on Vercel |
| `RESEND_API_KEY` | Optional | Automatic email when a monitor returns NOT DONE |
| `RESEND_FROM` | Optional | Sender for Resend (use a verified domain in production) |
| `RESEND_ALERT_OVERRIDE` | Optional | Sandbox only: deliver alerts to your Resend signup email |
| `PROVL_PUBLIC_URL` | Optional | Absolute proof links (emails, MCP); defaults to `http://localhost:3000` |
| `LT_USERNAME` / `LT_ACCESS_KEY` | Optional | Rare; OAuth is the default path |

Minimal local demo: **Kane OAuth only**, empty or nearly empty `.env`.

### 4. Start the app

```bash
npm run dev
```

Open **http://localhost:3000** → **Run** at **http://localhost:3000/dashboard** (`/app` redirects here).

### 5. Demo presets (Run tab)

Each preset takes about **1–3 minutes**.

| Preset | Expected verdict | What it does |
|--------|------------------|--------------|
| **Demo: cancel subscription** | **DONE** | Local sandbox `/demo/subscription`; cancels and verifies canceled state |
| **Demo: honest NOT DONE** | **NOT DONE** | [the-internet login](https://the-internet.herokuapp.com/login); looks for a button that does not exist; honest stop, no false DONE |

Results include **replay** and **proof** links.

---

## Connect your Kane account

1. Open **/connect** or **Dashboard → Account**.
2. **Connect** with TestMu username + access key, **or** choose **Use machine login** (same OAuth as step 2 above).
3. Credits and session spend appear on **Account** when connected.

---

## Monitors

**Dashboard → Monitors:** save a task and schedule (hourly/daily). **Run now** works without waiting for cron.

- Pass/fail shows **in the list** (no email setup required).
- **Email this proof** uses your mail app (`mailto:`).
- Optional **Resend** for automatic failure email (`RESEND_*` in `.env`).
- Optional cron: set `CRON_SECRET`, deploy with `vercel.json`, or `npm run cron:dev` locally.

---

## MCP (other agents)

Provl exposes one MCP tool, **`verify_web_task`**, on stdio (same `executeRunAndSaveProof` path as the web app).

```bash
npm run mcp
npm run mcp:prove   # terminal smoke (Sauce Demo)
```

Copy **`mcp.json.example`** → **`.cursor/mcp.json`**. Full steps: **[docs/mcp.md](docs/mcp.md)**.

---

## Production check

```bash
npm run build
npm start
```

---

## Development commands

```bash
npm run dev
npm run build
npm run kane:run -- "<task>" --url <url>
npm run phase-a:parse-fixtures
npm run phase-a:retry-policy
npm run phase-a:acceptance   # needs dev server
npm run mcp
```

---

## How Kane fits in

- `npx @testmuai/kane-cli run "<task>" --agent --headless` (+ `--url` when given).
- Agent mode streams **NDJSON**; Provl parses `run_end` for verdict and replay.
- **Honest NOT DONE** is not retried; retries are only for timeout / missing `run_end` (see `lib/kane/retryPolicy.ts`).

Docs: [Kane CLI](https://www.testmuai.com/support/docs/kane-cli-introduction/) · [agents.md](https://www.testmuai.com/kane-cli/agents.md)

---

## What's next (roadmap)

- Mid-run credential prompt (Kane agent mode does not support dynamic pause/resume today)
- Cross-device history via hosted DB (Mongo/Atlas) as the default store
- Domain-verified email alerts (Resend production senders)
- HTTP / Streamable MCP transport for remote agents
- Per-user MCP auth (API keys tied to Kane accounts)

---

## Submission demo video (suggested)

1. Preset **DONE** (cancel subscription).
2. Preset **NOT DONE** (honest failure).
3. Optional: **Monitors → Run now** or MCP `verify_web_task`.

**Deadline:** Nov 26.

---

## Security

- Never commit `.env`, `.provl/`, or local `mcp.json` / `.cursor/mcp.json`.
- Parser and UI are built from real Kane NDJSON, not guessed shapes.