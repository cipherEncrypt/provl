# Provl

**Provl is a consumer agent that does a web task you describe in plain English, then returns proof that it actually did it, a pass or fail verdict plus a replay of the real browser run.**

Not "done" written in prose. Evidence you can see.

---

## 1. What we are building

People now ask AI agents to do things on the web for them: cancel a subscription, check if an order shipped, fill a form, confirm a booking. The agent replies "done." But there is no proof it really happened, so you cannot trust it. Every consumer browser agent has this same gap.

Provl closes that gap. You give it a task in plain words. It performs the task in a **real browser** using Kane CLI, and because Kane returns a verdict backed by evidence, Provl hands you back a **result card**: done or not done, the key screen as proof, and a replay link of the actual run.

If Provl cannot finish the task, it tells you exactly where it stopped. It never claims a success it cannot prove. That honesty is the point of the product.

**In one sentence:** a user types a task like "cancel my subscription on this site," Provl runs it in a real browser through Kane, and returns a card showing done or not done, a proof screenshot, and a replay link.

---

## 2. Who it is for

Anyone with a web chore. Non-technical. The user types a task and gets a result card with proof. No code, no selectors, no setup beyond typing what they want.

---

## 3. Why Kane CLI is central

Kane is the engine of Provl, not a feature bolted on the side. Kane is a browser agent that drives a real Chrome browser from a plain-English goal and returns a pass or fail backed by real evidence. Provl is the product wrapped around that engine.

- Provl calls Kane in **agent mode**: `kane-cli run "<task>" --agent --headless` (add `--url` when the user gives a site).
- `--agent` streams **NDJSON**, one JSON event per line. The final event carries the verdict, an evidence summary, and a dashboard/replay link. Provl parses that final event.
- **Exit code 0 means pass.** Provl uses the exit code to decide the card's result.
- On a failure event, Provl feeds Kane's own output back and retries, tightly. This is the closed loop: Provl acts, Kane verifies, the result feeds back.

Before wiring any of this, read the live docs and follow the real flags and output shape there, not assumptions:
- Docs: https://www.testmuai.com/support/docs/kane-cli-introduction/
- Agent guide: https://www.testmuai.com/kane-cli/agents.md

---

## 4. The two phases

Provl has two phases. Think of them as two halves of the same loop. Understand both before writing code, then build them in order.

### Phase A — The Build phase (the engine)

This is the backend spine: turn a plain-English task into a real browser run and a parsed result. No pretty UI yet. The goal of this phase is a working command that proves the whole idea end to end.

What this phase must produce:
1. A backend routine that runs `kane-cli` in agent mode on a task string and captures the NDJSON stream.
2. A parser that reads the final event and extracts: the verdict (done / not done), the replay link, and a key evidence screenshot.
3. The exit code read correctly so the verdict is trustworthy.
4. The closed loop: when the run fails, re-prompt Kane once or twice with its own failure output before giving up.
5. The honest stop: when it genuinely cannot finish, capture where it stopped, so the product can report that instead of faking success.

A single real task (for example, cancel on a safe demo site) must run end to end through this phase before moving on.

### Phase B — The Live phase (what the user sees)

This is the face of the product: the screen a person uses and the proof they walk away with.

What this phase must produce:
1. One input screen: a text box for the task, an optional site URL, and a Run button.
2. A **result card**: done or not done, the proof screenshot, and the replay link.
3. A shareable proof page: the same card at its own link, so the proof can be sent to someone.
4. The honest-stop state shown clearly in the card ("stopped here, no cancel option found"), never a false "done."

Phase B sits on top of Phase A. The Live phase only shows what the Build phase proved.

---

## 5. Scope

### Must have (build in this order)
1. Run Kane in agent mode on a task, capture NDJSON. *(Phase A)*
2. Parse the final event: verdict, replay link, evidence screenshot. *(Phase A)*
3. Closed loop: on failure, re-prompt Kane with its own output. *(Phase A)*
4. Honest stop: capture and report where it stopped. *(Phase A)*
5. Input screen: task box, optional URL, Run button. *(Phase B)*
6. Result card: done / not done, proof image, replay link. *(Phase B)*
7. Shareable proof page per run. *(Phase B)*

### Should have
- A second demo task preloaded for the video.
- A clean empty and loading state on the card.

### Won't have (v1)
- Real user accounts, payments, mobile, or storing anyone's real credentials.

---

## 6. Tech stack

- **Frontend:** Next.js + Tailwind. One screen: input plus result card.
- **Backend:** a Next.js route (or a thin Node server) that shells out to `kane-cli`, captures the NDJSON, parses the verdict and replay link, and returns it to the UI.
- **Runtime:** Node runs `kane-cli` as a child process.
- **Storage:** none needed for v1. Keep runs in memory or a local JSON file.

---

## 7. Rules for Cursor

- The user is the planner and the brain. You are the builder. Explain each step in plain language.
- Build **one must-have at a time** and tell the user how to test it before starting the next.
- Before wiring Kane, run it once and show the user the **real NDJSON output**. Build the parser around what you actually see, not assumptions. If the output later surprises us, re-read the docs and show the real output before changing the parser.
- **Never** hardcode secrets or credentials. Use a `.env` file and commit a `.env.example` with names only. For demos, use test accounts and safe demo sites only, never a real login.
- Create a git commit after each feature that works, with a clear message.
- Explain any error in plain words before fixing it.
- Keep the two phases separate and clear: the Live phase only ever shows what the Build phase has actually proved.

---

## 8. Demo and submission (what the build must support)

- A 3 to 5 minute video: run a task, show Provl acting in a real browser, return the proof card; then show a task it **cannot** finish, reported honestly.
- Judges must be able to run it: ship test credentials and a fallback recording.
- Public GitHub repo (initialized on or after Nov 12), a YouTube demo, and at least two public posts about the project.

---

## 9. First step

Read this whole README. Say back in a few sentences what you understood and ask anything unclear. Then do **not** write app code yet. First verify the riskiest thing: run `kane-cli` in agent mode on a simple task against a safe demo site, capture the raw NDJSON, and show the user the exact shape of the final verdict event and the replay link. Once we see the real output, plan the parser around it. Walk the user through anything to install or sign into, one step at a time.
