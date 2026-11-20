#!/usr/bin/env npx tsx
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { parseNdjsonStream } from "../lib/kane/parseNdjson";
import { shouldRetryKaneRun } from "../lib/kane/retryPolicy";

const root = join(process.cwd(), "artifacts");

function loadExit(name: string): number {
  const stderr = readFileSync(join(root, `${name}.stderr.txt`), "utf8");
  const m = stderr.match(/exit=(\d+)/);
  return m ? Number(m[1]) : 2;
}

const failStdout = readFileSync(
  join(root, "the-internet-login-fail.ndjson"),
  "utf8",
);
const { runEnd: failRunEnd } = parseNdjsonStream(failStdout);
const failExit = loadExit("the-internet-login-fail");

const errors: string[] = [];

if (failRunEnd?.status !== "failed") {
  errors.push("fail fixture should have run_end.status failed");
}
if (failRunEnd?.reason_code !== "assertion_error.step_not_achievable") {
  errors.push("expected step_not_achievable on fail fixture");
}
if (shouldRetryKaneRun(failExit, failRunEnd)) {
  errors.push("should NOT retry honest run_end failed (assertion_error)");
}

if (!shouldRetryKaneRun(3, null)) {
  errors.push("should retry exit 3 with no run_end");
}

if (shouldRetryKaneRun(2, null)) {
  errors.push("should NOT retry exit 2 did-not-start");
}
if (shouldRetryKaneRun(1, null) !== true) {
  errors.push("should retry exit 1 with no run_end (crash)");
}

if (errors.length) {
  console.error("Retry policy checks FAILED:");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

console.log("Retry policy OK: honest run_end failed → no retry; timeout/no run_end → retry.");