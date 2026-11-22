#!/usr/bin/env npx tsx
/**
 * Spawns the Provl MCP server and calls verify_web_task (real MCP JSON-RPC over stdio).
 * Usage: npm run mcp:prove
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const SAUCEDEMO_TASK =
  "Add the Sauce Labs Backpack to the shopping cart and verify the cart shows the backpack.";

async function main() {
  const transport = new StdioClientTransport({
    command: "npm",
    args: ["run", "mcp"],
    cwd: process.cwd(),
    stderr: "inherit",
    env: {
      ...process.env,
      PROVL_PUBLIC_URL:
        process.env.PROVL_PUBLIC_URL?.trim() || "http://localhost:3000",
    },
  });

  const client = new Client(
    { name: "provl-prove-client", version: "1.0.0" },
    { capabilities: {} },
  );

  console.error("[mcp:prove] connecting to Provl MCP server…");
  await client.connect(transport);

  const { tools } = await client.listTools();
  const names = tools.map((t) => t.name);
  console.error("[mcp:prove] tools:", names.join(", ") || "(none)");
  if (!names.includes("verify_web_task")) {
    throw new Error("verify_web_task not registered");
  }

  console.error("[mcp:prove] calling verify_web_task (Kane run, ~1–3 min)…");
  const result = await client.callTool(
    {
      name: "verify_web_task",
      arguments: {
        task: SAUCEDEMO_TASK,
        url: "https://www.saucedemo.com/",
      },
    },
    undefined,
    { timeout: 600_000 },
  );

  await client.close();

  const blocks = Array.isArray(result.content) ? result.content : [];
  const textBlock = blocks.find(
    (c): c is { type: "text"; text: string } =>
      typeof c === "object" && c !== null && "type" in c && c.type === "text",
  );

  if (result.isError) {
    console.error("[mcp:prove] tool isError:", textBlock?.text ?? result);
    process.exit(1);
  }

  console.log(textBlock?.text ?? JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error("[mcp:prove] failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});