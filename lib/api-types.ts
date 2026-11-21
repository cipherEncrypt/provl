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

export type KaneAccountStatus = {
  connected: boolean;
  username: string | null;
  availableCredits: number | null;
  creditsSpentSession: number;
  billingMode: "user" | "machine";
  demoMode: boolean;
};

export type KaneConnectResponse = {
  connected?: boolean;
  username?: string;
  availableCredits?: number;
  error?: string;
};