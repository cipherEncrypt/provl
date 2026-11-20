# Provl

**Provl is a consumer agent that does a web task you describe in plain English, then returns proof that it actually did it, a pass or fail verdict plus a replay of the real browser run.**

Not "done" written in prose. Evidence you can see.

---

## Quick start for judges

Follow these steps on a clean machine from clone to a working run. No guesswork.

### Prerequisites

- **Node.js 18+** (`node -v`)
- **Google Chrome** installed (Kane drives local Chrome)
- A free **[TestMu AI](https://www.testmuai.com)** account with Kane credits ([claim credits](https://www.testmuai.com/kane-cli/) if prompted)

### 1. Clone and install

```bash
git clone <your-repo-url> provl
cd provl
npm install
```

### 2. Sign in to Kane (one time per machine)

Provl runs Kane through `npx` — no global install required.

```bash
npx @testmuai/kane-cli login --oauth
```

Complete sign-in in the browser. Confirm:

```bash
npx @testmuai/kane-cli whoami
npx @testmuai/kane-cli balance
```

You should see **Authenticated** and available credits. The first `npx` invocation may take ~30s while it downloads `@testmuai/kane-cli`.

### 3. Environment (optional)

```bash
cp .env.example .env
```

Leave `.env` empty if you use OAuth above. Only set `LT_USERNAME` / `LT_ACCESS_KEY` if you prefer API keys instead of OAuth.

### 4. Start Provl

```bash
npm run dev
```

Open **http://localhost:3000** (use another port with `PORT=3001 npm run dev` if 3000 is busy).

Keep this terminal running. The **cancel subscription** demo talks to this same server.

### 5. Try the two demo presets (one click each)

On the home screen, use the two preset buttons. **Each run takes about 1–3 minutes** — wait for the loading state to finish.

| Button | Expected card | What Kane does |
|--------|---------------|----------------|
| **Demo: cancel subscription** | **DONE** | Opens the local sandbox at `/demo/subscription`, clicks cancel, confirms, and **verifies** “Subscription canceled” is shown. |
| **Demo: honest NOT DONE** | **NOT DONE** | Opens [the-internet login](https://the-internet.herokuapp.com/login) and **verifies** a “Sign up with Google” button exists (it does not). Provl reports where it stopped — **no false success**, **one Kane attempt** (no credit-burning retries on honest failures). |

Each finished run shows a **replay link** (Test Manager) and a **shareable proof page** link.

### 6. What Kane verifies (one line)

**Kane drives real Chrome on your objective and returns pass or fail only when the page state matches what you asked it to verify** — Provl displays that verdict, the replay URL, and readable proof fields from Kane’s `run_end` event.

### Optional: CLI acceptance (no UI)

With `npm run dev` still up:

```bash
npm run phase-a:acceptance
```

---

## 1. What we are building

People now ask AI agents to do things on the web for them: cancel a subscription, check if an order shipped, fill a form, confirm a booking. The agent replies "done." But there is no proof it really happened, so you cannot trust it. Every consumer browser agent has this same gap.

Provl closes that gap. You give it a task in plain words. It performs the task in a **real browser** using Kane CLI, and because Kane returns a verdict backed by evidence, Provl hands you back a **result card**: done or not done, proof fields from the run, and a replay link of the actual run.

If Provl cannot finish the task, it tells you exactly where it stopped. It never claims a success it cannot prove. That honesty is the point of the product.

**In one sentence:** a user types a task like "cancel my subscription on this site," Provl runs it in a real browser through Kane, and returns a card showing done or not done, proof fields, and a replay link.

---

## 2. Who it is for

Anyone with a web chore. Non-technical. The user types a task and gets a result card with proof. No code, no selectors, no setup beyond typing what they want.

---

## 3. Why Kane CLI is central

Kane is the engine of Provl, not a feature bolted on the side. Kane is a browser agent that drives a real Chrome browser from a plain-English goal and returns a pass or fail backed by real evidence. Provl is the product wrapped around that engine.

- Provl calls Kane in **agent mode** via `npx @testmuai/kane-cli run "<task>" --agent --headless` (and `--url` when the user gives a site).
- `--agent` streams **NDJSON**, one JSON event per line. The final `run_end` event carries the verdict and replay link. Provl parses that event.
- **Exit code 0 and `run_end.status: "passed"` mean done.** Anything else is not done.
- Provl **does not retry** honest `run_end` failures (e.g. impossible assertions). It only retries on timeout or missing `run_end`.

Docs:

- https://www.testmuai.com/support/docs/kane-cli-introduction/
- https://www.testmuai.com/kane-cli/agents.md

---

## 4. The two phases

### Phase A — The Build phase (the engine)

Backend: run Kane, parse NDJSON, honest stop, selective retry. See `lib/kane/` and `npm run phase-a:acceptance`.

### Phase B — The Live phase (what the user sees)

Next.js UI at `/`: input, loading state, result card, shareable `/proof/[id]`.

---

## 5. Scope

### Shipped in v1

- Kane agent runs via `npx`, NDJSON parser, honest stop, selective retry
- Home UI, result card, shareable proof pages
- Local cancel sandbox at `/demo/subscription`
- One-click judge demo presets (DONE + honest NOT DONE)

### Won't have (v1)

- Real user accounts, payments, mobile, or storing anyone's real credentials
- Inline screenshots from `.evidence` packs (replay link + `final_state` only)

---

## 6. Tech stack

- **Frontend:** Next.js + Tailwind
- **Backend:** `POST /api/kane/run` shells out to `npx @testmuai/kane-cli`
- **Storage:** `.provl/runs/*.json` for shareable proof pages

---

## 7. Development commands

```bash
npm run dev                    # UI + API
npm run build                  # production build check
npm run kane:run -- "<task>" --url <url>   # CLI run with retry loop
npm run phase-a:parse-fixtures   # parser tests against artifacts/
npm run phase-a:retry-policy     # honest-fail must not retry
npm run phase-a:acceptance       # cancel flow on local demo (dev server required)
```

---

## 8. Demo and submission

- **Video:** preset **DONE**, then preset **NOT DONE** (~3–5 minutes including wait time).
- **Repo:** public GitHub, this README, TestMu Kane login for judges (or document fallback recording).
- **Deadline:** Nov 26.

---

## 9. Project rules (for contributors)

- Never hardcode secrets; use `.env` / `.env.example`.
- Build the parser from real Kane NDJSON, not assumptions.
- The Live phase only shows what the API returned from Kane.