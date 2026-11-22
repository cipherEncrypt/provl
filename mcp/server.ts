#!/usr/bin/env npx tsx
/**
 * Provl MCP server (stdio). Exposes Kane-verified web checks to other agents.
 * Logs only on stderr — stdout is the MCP JSON-RPC channel.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { verifyWebTaskForMcp } from "./verifyWebTask";

const outputSchema = z.object({
  verdict: z.enum(["DONE", "NOT_DONE"]),
  summary: z.string().nullable(),
  proofUrl: z.string(),
  replayUrl: z.string().nullable(),
  durationSec: z.number().nullable(),
  creditsConsumed: z.number().nullable(),
});

const server = new McpServer(
  {
    name: "provl",
    version: "0.1.0",
  },
  {
    instructions:
      "Provl runs plain-English web tasks in real Chrome via Kane CLI and returns a DONE or NOT_DONE verdict with a shareable proof URL. Runs often take 1–3 minutes. Requires kane-cli login on this machine.",
  },
);

server.registerTool(
  "verify_web_task",
  {
    title: "Verify a web task (Kane)",
    description:
      "Run a task in a real browser and return DONE or NOT_DONE with summary, absolute proof URL, and replay link. Use when the user wants verified evidence, not a guess.",
    inputSchema: {
      task: z
        .string()
        .min(1)
        .describe(
          "Plain-English goal to verify, e.g. add an item to cart and confirm it appears.",
        ),
      url: z
        .string()
        .url()
        .optional()
        .describe("Optional starting URL for the browser session."),
    },
    outputSchema,
  },
  async ({ task, url }) => {
    try {
      const structured = await verifyWebTaskForMcp({ task, url });
      const text = JSON.stringify(structured, null, 2);
      return {
        content: [{ type: "text", text }],
        structuredContent: structured,
      };
    } catch (err) {
      console.error("[provl-mcp] verify_web_task failed", {
        reason: err instanceof Error ? err.name : "Error",
      });
      const hint =
        "Could not complete the Kane run. Ensure Chrome is installed and run: npx @testmuai/kane-cli login --oauth";
      return {
        content: [{ type: "text", text: hint }],
        isError: true,
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[provl-mcp] listening on stdio (Provl verify_web_task)");
}

main().catch((err) => {
  console.error("[provl-mcp] fatal", err instanceof Error ? err.message : err);
  process.exit(1);
});