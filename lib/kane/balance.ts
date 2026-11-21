import { spawn } from "node:child_process";

const KANE_PKG = "@testmuai/kane-cli";

const BALANCE_LINE =
  /Available credits:\s*([\d]+(?:\.\d+)?)/;

export type KaneBalanceResult =
  | { ok: true; availableCredits: number; raw: string }
  | { ok: false; error: string };

/**
 * Validates Kane basic auth by calling `kane-cli balance`.
 * Never logs username or access key.
 */
export function runKaneBalance(
  username: string,
  accessKey: string,
): Promise<KaneBalanceResult> {
  const args = [
    "--yes",
    KANE_PKG,
    "balance",
    "--username",
    username,
    "--access-key",
    accessKey,
  ];

  return new Promise((resolve) => {
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

    child.on("error", () => {
      resolve({
        ok: false,
        error: "Could not start Kane CLI. Is Node available on the server?",
      });
    });

    child.on("close", (code) => {
      const combined = `${stdout}\n${stderr}`.trim();
      if (code !== 0) {
        resolve({
          ok: false,
          error:
            "Invalid username or access key, or Kane could not reach the account.",
        });
        return;
      }

      const match = stdout.match(BALANCE_LINE);
      if (!match) {
        resolve({
          ok: false,
          error: "Kane balance returned an unexpected response.",
        });
        return;
      }

      resolve({
        ok: true,
        availableCredits: Number.parseFloat(match[1]!),
        raw: combined,
      });
    });
  });
}