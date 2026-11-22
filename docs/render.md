# Deploy Provl on Render (free tier)

Use this with the **New Web Service** flow: connect `cipherEncrypt/provl` on GitHub, **Node**, branch **main**.

**Kane still does not run on Render Free** — no Chrome, 512 MB RAM, no persistent disk, and the instance **spins down** when idle. Deploy for the **public UI**; run real tasks locally with `npm run dev`.

---

## Form values (match Render’s Next.js autofill)

| Field | Value |
|-------|--------|
| **Name** | `provl` (your URL becomes `https://provl.onrender.com` if available) |
| **Language** | Node |
| **Branch** | `main` |
| **Region** | Oregon (or your preference) |
| **Root Directory** | *(leave empty)* |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Instance type** | **Free** ($0 — 0.1 CPU, 512 MB) |

Optional: add a **[Blueprint](https://render.com/docs/blueprint-spec)** from repo root — `render.yaml` in this project.

---

## Environment variables

Render → your service → **Environment**:

| Variable | Required | Value |
|----------|----------|--------|
| `NODE_VERSION` | Recommended | `20` (matches `.node-version`) |
| `PROVL_ENC_KEY` | If using Connect / encrypted secrets | Same as local: `openssl rand -base64 32` |
| `PROVL_PUBLIC_URL` | Recommended | `https://provl.onrender.com` (your real `*.onrender.com` URL, no trailing slash) |
| `MONGODB_URI` | Optional | Atlas URI for history / monitors metadata |
| `CRON_SECRET` | Optional | Random string for `/api/cron/run-watches` |
| `RESEND_*` | Optional | Monitor email (see `.env.example`) |

If **`PROVL_PUBLIC_URL`** is unset, the app falls back to **`RENDER_EXTERNAL_URL`** when Render injects it.

Do **not** put Kane OAuth tokens on Render for “run in cloud” — runs will still fail without Kane + Chrome on the host.

---

## After deploy

1. Open `https://<your-service>.onrender.com` — first load may take **30–60s** (free spin-up).
2. Dashboard shows a **hosted** banner when `RENDER=true`.
3. Set `PROVL_PUBLIC_URL` to the exact public URL if proof links look wrong, then **Manual Deploy** → Clear build cache & deploy (only if needed).

---

## Monitors cron

`vercel.json` crons apply only on Vercel. On Render, either:

- Skip automated watches in production, or
- Use [Render Cron Jobs](https://render.com/docs/cronjobs) (separate job) to `curl -H "Authorization: Bearer $CRON_SECRET" https://provl.onrender.com/api/cron/run-watches` — **watch runs still won’t execute Kane** on Free Web Service.

---

## Free tier limits (relevant to Provl)

| Topic | Free behavior |
|-------|----------------|
| RAM | 512 MB — fine for UI; not for browser automation |
| Disk | Ephemeral — `.provl/` proofs **do not persist** across redeploys |
| Spin-down | ~15 min idle → cold start on next visit |
| SSH / disk | Not on Free |

---

## Hackathon pitch

- **Live URL:** Render → judges click through landing + dashboard.
- **Real proofs:** local demo or video; clone repo + `npm run dev`.
- **MCP:** local only (`docs/mcp.md`).

See also: [vercel.md](./vercel.md) if you compare hosts.