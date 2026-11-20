export type KaneStepEvent = {
  step?: number;
  status: "running" | "done" | "failed";
  remark?: string;
  type?: undefined;
};

export type KaneRunEnd = {
  type: "run_end";
  status: "passed" | "failed" | string;
  summary?: string;
  one_liner?: string;
  reason?: string;
  final_state?: Record<string, string>;
  duration?: number;
  credits_consumed?: number;
  session_dir?: string;
  test_url?: string;
  result_code?: number;
  reason_code?: string;
};

export type KaneStreamEvent =
  | KaneRunEnd
  | KaneStepEvent
  | { type: string; [key: string]: unknown };

export type ProvlRunResult = {
  /** True only when run_end.status is "passed" AND process exit code is 0 */
  done: boolean;
  exitCode: number;
  runEnd: KaneRunEnd | null;
  replayUrl: string | null;
  summary: string | null;
  oneLiner: string | null;
  finalState: Record<string, string>;
  duration: number | null;
  creditsConsumed: number | null;
  sessionDir: string | null;
  evidencePackPath: string | null;
  /** Where the run stopped (honest stop) */
  honestStop: HonestStop | null;
  attempts: number;
  rawStdout: string;
  rawStderr: string;
};

export type HonestStop = {
  message: string;
  failedStepRemark: string | null;
  reason: string | null;
};

export type RunKaneOptions = {
  task: string;
  url?: string;
  headless?: boolean;
  timeoutSeconds?: number;
};