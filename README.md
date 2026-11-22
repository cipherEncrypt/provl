# Provl

**Tell Provl a web task in plain English. It does the task in a real browser and hands you proof it actually happened — a pass/fail verdict you can replay and share, verified by Kane CLI.**

Not "done" written in prose. Evidence you can see.

> Built for the Kane CLI Online Hackathon (TestMu AI).

---

## The problem

AI agents can do things on the web for you now — cancel a subscription, check an order, fill a form. But when an agent says "done," you have no way to know if it's true. You click around to double-check, or you just trust it and hope. Every AI agent has the same gap: it tells you it worked, with nothing to back it up.

Provl closes that gap. It performs the task in a real browser using Kane CLI, and because Kane returns a verdict backed by real evidence, Provl gives you a result you can watch and share — and if it can't finish, it tells you exactly where it stopped instead of pretending.

---

## What Provl does

- **Verify any web task** — Describe it in plain English; Kane runs it in real Chrome and returns DONE or NOT DONE with proof.
- **Shareable proof** — Every run gets its own proof page with the verdict, readable proof fields, and a replay link.
- **Honest failure** — If a task can't be completed, Provl shows NOT DONE and where it stopped. It never claims a success it can't prove.
- **Monitors (watchdog)** — Save a task and Provl re-runs it on a schedule, alerting you the moment a flow breaks, with the proof.
- **Bring your own account** — Connect your own Kane/LambdaTest account; runs bill your own credits, with a one-click top-up link.
- **Secure logins** — Supply credentials for login tasks as redacted variables (Kane `--variables`) that never touch the task text, history, or proof.
- **Run history** — Your past runs are saved and follow your account across devices.
- **MCP server** — Any AI agent (Claude Desktop, Cursor) can call Provl as a tool (`verify_web_task`) and get back a verified verdict with a proof link.

---

## How Kane CLI is central

Kane is the engine of Provl, not a bolt-on. Kane is a browser agent that drives a real Chrome browser from a plain-English goal and returns a pass or fail backed by evidence.

- Provl calls Kane in agent mode: `kane-cli run "<task>" --agent --headless` (with `--url` when a site is given).
- `--agent` streams NDJSON; the final `run_end` event carries the verdict, evidence, and a replay link, which Provl parses.
- Exit code 0 means pass. On a genuine error (not an honest "failed" verdict), Kane's output feeds back and Provl retries — the closed loop.

Everything on a result card comes straight from that real Kane run.

---

## Quick start

### Prerequisites
- Node.js 18+
- Google Chrome installed
- A TestMu AI account with Kane CLI credits ([claim free credits](https://www.testmuai.com/kane-cli/#creditOffer))

### 1. Clone and install
```bash
git clone https://github.com/cipherEncrypt/provl.git provl
cd provl
npm install
```

### 2. Sign in to Kane
```bash
npx @testmuai/kane-cli login --oauth
npx @testmuai/kane-cli whoami   # confirm "Authenticated"
```

### 3. Configure environment
Copy the example and fill in what you need:
```bash
cp .env.example .env
```

| Variable | Required? | Purpose |
|----------|-----------|---------|
| `PROVL_ENC_KEY` | Yes | Encrypts connected Kane credentials at rest. Generate with `openssl rand -base64 32`. |
| `PROVL_PUBLIC_URL` | Recommended | Base URL for absolute proof links (default `http://localhost:3000`). |
| `MONGODB_URI` | Optional | Enables database-backed, cross-device run history. Without it, Provl uses a local file store. |
| `CRON_SECRET` | Optional | Protects the Monitors cron endpoint. |
| `RESEND_API_KEY` / `RESEND_FROM` | Optional | Enables automatic email alerts for Monitors. Without it, failures show in-app. |

### 4. Run
```bash
npm run dev
```
Open http://localhost:3000.

> Runs take about 1–3 minutes each — that's a real browser doing real work.

### Deploy on Render or Vercel (optional)

**Render (free):** [New Web Service](https://dashboard.render.com/) → GitHub `cipherEncrypt/provl`, **Build** `npm install && npm run build`, **Start** `npm run start`, **Free** instance. Set **`NODE_VERSION=20`**, **`PROVL_ENC_KEY`**, and **`PROVL_PUBLIC_URL=https://YOUR-SERVICE.onrender.com`**. Full checklist: **[docs/render.md](docs/render.md)**.

**Vercel:** [vercel.com/new](https://vercel.com/new) — **[docs/vercel.md](docs/vercel.md)**.

**Kane task runs do not work on either host** (no Chrome); use the live URL for UI and run tasks locally.

---

## Try it (demo presets)

On the app, use the one-click presets, or enter your own:

- **DONE (real site):** Task — `Log in with {{username}} and {{password}}, add the Sauce Labs Backpack to the cart, and verify the cart shows 1 item`; URL — `https://www.saucedemo.com`; secrets — `username` = `standard_user`, `password` = `secret_sauce`.
- **DONE (sandbox):** Task — `Click "Cancel subscription", confirm "Yes, cancel", then verify "Subscription canceled" is shown`; URL — `http://localhost:3000/demo/subscription`.
- **NOT DONE (honest fail):** Task — `Verify a "Sign up with Google" button is visible on the page`; URL — `https://the-internet.herokuapp.com/login`.

Each finished run has a shareable proof page at `/proof/<id>`.

---

## Connect your own Kane account

In the app, open the account panel and enter your LambdaTest **username** and **access key**. Runs then bill your own credits, and the app shows your available balance and spend, with a top-up link to LambdaTest billing. Credentials are encrypted at rest and never returned to the browser or written to the repo.

## Monitors (scheduled verification)

Save a task as a Monitor with a schedule (hourly/daily). Provl re-runs it and shows the latest verdict and proof. A failed run surfaces an in-app alert instantly (no setup needed); optional email alerts can be enabled with Resend, and any run's proof can be sent with one click via a `mailto:` button. Scheduled tasks are login-free in this version.

## MCP server (use Provl from any AI agent)

Provl exposes an MCP tool, `verify_web_task`, so agents like Claude Desktop and Cursor can call it and get back a verified verdict.

```bash
npm run mcp
```

See [docs/mcp.md](docs/mcp.md) for the exact Claude Desktop and Cursor config. Example prompt from an agent:

> Use Provl `verify_web_task` to verify I can add the Sauce Labs Backpack to the cart on Sauce Demo. Start at https://www.saucedemo.com/

It returns `{ verdict, summary, proofUrl, replayUrl }`.

---

## How it's built

- **Next.js + Tailwind** — landing page, dashboard (Run / Monitors / History / Account), proof pages.
- **Kane CLI** (`@testmuai/kane-cli`) — the real-browser verification engine.
- **MongoDB (optional)** — cross-device run history, with a local file-store fallback.
- **MCP** (`@modelcontextprotocol/sdk`) — the `verify_web_task` tool over stdio.

The run → parse → proof core is shared by the app, Monitors, and the MCP server.

---

## What's next (roadmap)

- **Mid-run credential prompt** — the agent pauses at a login wall and asks for exactly what the page needs, then resumes (as Kane's `run`-mode pause/resume matures).
- **Hosted multi-user** — a deployed Provl where each user runs on their own account and credits across devices.
- **Domain-verified email alerts** — send Monitor alerts to any address, not just your own.
- **HTTP MCP transport + per-user MCP auth** — call Provl remotely and as a specific user.

---

## Author

Built by @dex_cipher (CipherEncrypt).