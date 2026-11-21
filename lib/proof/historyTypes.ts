/** Session run history row (dashboard list + API). */
export type RunHistoryItem = {
  id: string;
  createdAt: string;
  task: string;
  done: boolean;
  creditsConsumed: number | null;
};

export type RunHistoryListScope = {
  sessionId: string;
  /** Kane username when connected; null for machine-demo / unauthenticated runs. */
  userId: string | null;
};

export type RunHistoryInsert = {
  sessionId: string;
  userId: string | null;
  proofId: string;
  task: string;
  url?: string;
  done: boolean;
  creditsConsumed: number | null;
  durationSec: number | null;
  createdAt: string;
};