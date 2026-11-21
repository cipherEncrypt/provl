import { spawn } from "node:child_process";

import { buildKaneVariablesArg } from "./secrets";
import type { RunKaneOptions } from "./types";

const KANE_PKG = "@testmuai/kane-cli";

export type KaneProcessResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
};

/**
 * Runs Kane in agent mode via npx and captures stdout (NDJSON) and stderr.
 */
export function runKane(options: RunKaneOptions): Promise<KaneProcessResult> {
  const { task, url, headless = true, timeoutSeconds = 180 } = options;

  const args = [
    "--yes",
    KANE_PKG,
    "run",
    task,
    "--agent",
    "--timeout",
    String(timeoutSeconds),
  ];
  if (headless) args.push("--headless");
  if (url) args.push("--url", url);

  if (options.basicAuth) {
    args.push(
      "--username",
      options.basicAuth.username,
      "--access-key",
      options.basicAuth.accessKey,
    );
  }
  // else: no auth flags — Kane CLI uses this machine's ~/.testmuai profile (demo fallback).

  const variablesJson = options.variables
    ? buildKaneVariablesArg(options.variables)
    : null;
  if (variablesJson) {
    args.push("--variables", variablesJson);
  }

  return new Promise((resolve, reject) => {
    const child = spawn("npx", args, {
      env: {
        ...process.env,
        KANE_CLI_USER_AGENT: process.env.KANE_CLI_USER_AGENT ?? "provl",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });

    child.on("error", reject);
    child.on("close", (code) => {
      resolve({
        exitCode: code ?? 2,
        stdout,
        stderr,
      });
    });
  });
}

/** Extract `.evidence` pack path from stderr (`evidence: view locally with ...`) */
export function extractEvidencePackFromStderr(stderr: string): string | null {
  const match = stderr.match(
    /evidence serve\s+(\S+\.evidence)/,
  );
  return match?.[1] ?? null;
}