import type {
  HonestStop,
  KaneRunEnd,
  KaneStepEvent,
  KaneStreamEvent,
  ProvlRunResult,
} from "./types";
import { extractEvidencePackFromStderr } from "./runKane";

function parseLine(line: string): KaneStreamEvent | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed) as KaneStreamEvent;
  } catch {
    return null;
  }
}

export function parseNdjsonStream(stdout: string): {
  events: KaneStreamEvent[];
  runEnd: KaneRunEnd | null;
  failedSteps: KaneStepEvent[];
  coveragePack: string | null;
} {
  const events: KaneStreamEvent[] = [];
  const failedSteps: KaneStepEvent[] = [];
  let runEnd: KaneRunEnd | null = null;
  let coveragePack: string | null = null;

  for (const line of stdout.split("\n")) {
    const event = parseLine(line);
    if (!event) continue;
    events.push(event);

    if ("type" in event && event.type === "run_end") {
      runEnd = event as KaneRunEnd;
    }
    if ("type" in event && event.type === "coverage") {
      const pack = (event as { pack?: string }).pack;
      if (pack) coveragePack = pack;
    }
    if (!("type" in event) && event.status === "failed") {
      failedSteps.push(event as KaneStepEvent);
    }
  }

  return { events, runEnd, failedSteps, coveragePack };
}

export function buildHonestStop(
  runEnd: KaneRunEnd | null,
  failedSteps: KaneStepEvent[],
): HonestStop | null {
  if (!runEnd && failedSteps.length === 0) {
    return {
      message: "Run did not start or produced no verdict (no run_end).",
      failedStepRemark: null,
      reason: null,
    };
  }

  const lastFailed = failedSteps.at(-1);
  if (runEnd?.status === "passed") return null;

  const reason = runEnd?.reason ?? null;
  const summary = runEnd?.summary ?? runEnd?.one_liner ?? null;
  const failedStepRemark = lastFailed?.remark ?? null;

  const parts = [
    summary,
    failedStepRemark ? `Stopped at: ${failedStepRemark}` : null,
    reason,
  ].filter(Boolean);

  return {
    message: parts.join("\n") || "Task could not be completed.",
    failedStepRemark,
    reason,
  };
}

export function buildProvlResult(
  exitCode: number,
  stdout: string,
  stderr: string,
  attempts = 1,
): ProvlRunResult {
  const { runEnd, failedSteps, coveragePack } = parseNdjsonStream(stdout);
  const evidenceFromStderr = extractEvidencePackFromStderr(stderr);

  const passed =
    runEnd?.status === "passed" && exitCode === 0;

  const honestStop = passed
    ? null
    : buildHonestStop(runEnd, failedSteps);

  return {
    done: passed,
    exitCode,
    runEnd,
    replayUrl: runEnd?.test_url ?? null,
    summary: runEnd?.summary ?? null,
    oneLiner: runEnd?.one_liner ?? null,
    finalState: runEnd?.final_state ?? {},
    duration: runEnd?.duration ?? null,
    creditsConsumed: runEnd?.credits_consumed ?? null,
    sessionDir: runEnd?.session_dir ?? null,
    evidencePackPath: coveragePack ?? evidenceFromStderr,
    honestStop,
    attempts,
    rawStdout: stdout,
    rawStderr: stderr,
  };
}