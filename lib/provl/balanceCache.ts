/** In-process balance cache per browser session (not shared across server instances). */
const TTL_MS = 45_000;

type Entry = { credits: number; fetchedAt: number };

const bySession = new Map<string, Entry>();

export function getCachedBalance(sessionId: string): number | null {
  const entry = bySession.get(sessionId);
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > TTL_MS) {
    bySession.delete(sessionId);
    return null;
  }
  return entry.credits;
}

export function setCachedBalance(sessionId: string, credits: number): void {
  bySession.set(sessionId, { credits, fetchedAt: Date.now() });
}