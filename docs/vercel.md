# Deploy Provl on Vercel

Provl is a **Next.js 15** app and deploys to Vercel like any other Next project. Read this first: **Kane CLI drives real Chrome on the machine that runs the API**. Vercel serverless functions do not have Chrome or your Kane OAuth profile, so **task runs, Monitors execution, and MCP are for local use**, not for production API routes on Vercel.

**What Vercel is good for:** public landing page, marketing README flow, sharing **existing** proof links if proofs are reachable (file store does not persist on Vercel; use Mongo for history metadata only today).

**What stays local:** `npm run dev`, Kane runs, `npm run mcp`, judges running the demo presets.

---

## 1. Connect the repo

1. Push `main` to GitHub (`cipherEncrypt/provl` or your fork).
2. [vercel.com/new](https://vercel.com/new) → Import the repository.
3. Framework: **Next.js** (auto-detected).
4. Root directory: `.`
5. Build command: `npm run build` (default)
6. Output: Next default

Or CLI:

```bash
npm i -g vercel
vercel login
cd provl
vercel link
vercel --prod
```

---

## 2. Environment variables (Vercel → Project → Settings → Environment Variables)

Set for **Production** (and Preview if you want):

| Variable | Required on Vercel | Notes |
|----------|-------------------|--------|
| `PROVL_ENC_KEY` | Yes, if you use Connect / monitor secrets | `openssl rand -base64 32` |
| `PROVL_PUBLIC_URL` | **Yes** | `https://YOUR-PROJECT.vercel.app` (no trailing slash) |
| `MONGODB_URI` | Recommended | History + monitors metadata; proofs still file-based unless you add Mongo proofs later |
| `CRON_SECRET` | For scheduled monitors cron | Random string; must match `Authorization: Bearer ...` |
| `RESEND_*` | Optional | Automatic monitor emails |

Do **not** add Kane credentials to Vercel for running tasks; Connect can store user keys but **runs will not succeed** without Kane on the host.

After first deploy, copy the production URL into `PROVL_PUBLIC_URL` and **redeploy**.

---

## 3. Cron (Monitors)

`vercel.json` registers hourly `GET/POST` to `/api/cron/run-watches`. Requires **Vercel Cron** (Pro plan). Even with cron, **each watch still calls Kane** and will fail on Vercel unless you change architecture.

For hackathon demo: use **Run now** locally or show pre-recorded proofs.

---

## 4. Limits

| Topic | Limit |
|-------|--------|
| Serverless duration | Hobby ~60s, Pro up to 300s (routes request 600s; Vercel may cap lower) |
| Filesystem | Ephemeral; `.provl/` on disk is **not** durable |
| Kane / Chrome | Not available in serverless |

---

## 5. Recommended hackathon story

1. **Live URL on Vercel** → landing + product walkthrough.
2. **Video or local demo** → actual Kane DONE / NOT DONE runs.
3. **MCP** → `npm run mcp` on judge's machine (see [mcp.md](./mcp.md)).

---

## 6. Post-deploy checklist

- [ ] `PROVL_PUBLIC_URL` matches production domain
- [ ] `npm run build` passes (Vercel runs this automatically)
- [ ] Open `/` and `/dashboard` — hosting banner appears if `VERCEL=1`
- [ ] Proof pages for runs created **locally** only work on Vercel if you copy proof JSON to durable storage (not shipped in v1)