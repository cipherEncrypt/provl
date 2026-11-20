#!/usr/bin/env npx tsx
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { buildProvlResult } from "../lib/kane/parseNdjson";

const root = join(process.cwd(), "artifacts");

function load(name: string) {
  const stdout = readFileSync(join(root, `${name}.ndjson`), "utf8");
  const stderr = readFileSync(join(root, `${name}.stderr.txt`), "utf8");
  const exitMatch = stderr.match(/exit=(\d+)/);
  const exitCode = exitMatch ? Number(exitMatch[1]) : 2;
  return buildProvlResult(exitCode, stdout, stderr);
}

const pass = load("the-internet-login");
const fail = load("the-internet-login-fail");

const errors: string[] = [];

if (!pass.done) errors.push("expected pass fixture to be done=true");
if (pass.exitCode !== 0) errors.push("expected pass exit 0");
if (!pass.replayUrl) errors.push("expected pass test_url");
if (!pass.finalState.login_form_visible)
  errors.push("expected pass final_state fields");

if (fail.done) errors.push("expected fail fixture to be done=false");
if (fail.exitCode !== 1) errors.push(`expected fail exit 1, got ${fail.exitCode}`);
if (fail.runEnd?.status !== "failed")
  errors.push("expected run_end.status failed");
if (!fail.honestStop) errors.push("expected honestStop on failure");
if (!fail.replayUrl) errors.push("expected test_url even on failure");

if (errors.length) {
  console.error("Parser fixture checks FAILED:");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

console.log("Parser fixture checks OK (pass + fail artifacts).");
console.log(
  JSON.stringify(
    {
      pass: {
        done: pass.done,
        oneLiner: pass.oneLiner,
        replayUrl: pass.replayUrl?.slice(0, 60) + "…",
      },
      fail: {
        done: fail.done,
        honestStop: fail.honestStop?.message?.slice(0, 80) + "…",
        failedStep: fail.honestStop?.failedStepRemark,
      },
    },
    null,
    2,
  ),
);