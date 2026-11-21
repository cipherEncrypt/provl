/**
 * Local scheduler: hits POST /api/cron/run-watches every 5 minutes.
 * Requires npm run dev and CRON_SECRET in .env.
 */
import cron from "node-cron";

const base =
  process.env.PROVL_PUBLIC_URL?.replace(/\/$/, "") ??
  process.env.PROVL_DEMO_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";
const secret = process.env.CRON_SECRET?.trim();

if (!secret) {
  console.error("CRON_SECRET is required in .env");
  process.exit(1);
}

async function tick() {
  const url = `${base}/api/cron/run-watches`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}` },
    });
    const body = await res.json().catch(() => ({}));
    console.info(
      `[dev-cron] ${res.status}`,
      JSON.stringify(body),
    );
  } catch (err) {
    console.error("[dev-cron] request failed", err);
  }
}

console.info(`[dev-cron] watching ${base} (every 5 min)`);
void tick();
cron.schedule("*/5 * * * *", () => {
  void tick();
});