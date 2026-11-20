import type { HonestStop } from "@/lib/kane/types";

export type RunApiResponse = {
  done: boolean;
  exitCode: number;
  replayUrl: string | null;
  oneLiner: string | null;
  summary: string | null;
  finalState: Record<string, string>;
  duration: number | null;
  creditsConsumed: number | null;
  honestStop: HonestStop | null;
  attempts: number;
  proofId?: string;
  proofUrl?: string;
  error?: string;
};