# Provl MCP server

Provl exposes **one tool** for other agents (Cursor, Claude Desktop, etc.): run a web task through the same Kane-verified path as the web app and get back `DONE` / `NOT_DONE` plus a proof URL.

## Prerequisites

- Node 18+ and this repo installed (`npm install`)
- Google Chrome
- Kane signed in on this machine:

```bash
npx @testmuai/kane-cli login --oauth
npx @testmuai/kane-cli whoami
```

Optional: `npm run dev` so `http://localhost:3000/proof/...` opens in the browser.

## Run the server (stdio)

```bash
npm run mcp
```

The process waits on stdio. **Do not** write to stdout except MCP messages (the server logs to stderr only).

## Tool: `verify_web_task`

| Argument | Required | Description |
|----------|----------|-------------|
| `task` | yes | Plain-English goal Kane should verify |
| `url` | no | Starting URL |

**Result (successful call, including NOT_DONE):**

```json
{
  "verdict": "DONE",
  "summary": "…",
  "proofUrl": "http://localhost:3000/proof/<uuid>",
  "replayUrl": "https://…",
  "durationSec": 47.8,
  "creditsConsumed": 20.25
}
```

Infrastructure failures (Kane not installed, spawn error) return `isError: true` with a short message and **no secrets**.

`PROVL_PUBLIC_URL` defaults to `http://localhost:3000` when unset.

## Cursor

1. Copy `mcp.json.example` to **`.cursor/mcp.json`** in this project (or merge into `~/.cursor/mcp.json`).
2. Use `${workspaceFolder}` so the server starts with the repo as cwd.
3. Restart Cursor (or toggle the server under **Customize → MCPs**).
4. Check **Output → MCP Logs** if the server does not start.

Example:

```json
{
  "mcpServers": {
    "provl": {
      "type": "stdio",
      "command": "npm",
      "args": ["run", "mcp"],
      "env": {
        "PROVL_PUBLIC_URL": "http://localhost:3000"
      },
      "envFile": "${workspaceFolder}/.env"
    }
  }
}
```

## Claude Desktop

Config file:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Settings → Developer → Edit Config**, then add:

```json
{
  "mcpServers": {
    "provl": {
      "command": "/bin/sh",
      "args": [
        "-c",
        "cd /ABSOLUTE/PATH/TO/Provl && npm run mcp"
      ],
      "env": {
        "PROVL_PUBLIC_URL": "http://localhost:3000"
      }
    }
  }
}
```

Replace `/ABSOLUTE/PATH/TO/Provl`. Fully quit and reopen Claude Desktop.

Logs: `~/Library/Logs/Claude/mcp-server-provl.log` (macOS).

## Prove from the terminal (MCP client)

Spawns the server and calls the Sauce Demo task:

```bash
npm run mcp:prove
```

## Sample agent prompt

> Use Provl `verify_web_task` to check that I can add the Sauce Labs Backpack to the cart on Sauce Demo, starting at https://www.saucedemo.com/

Approve the tool call when the client asks. Expect ~1–3 minutes, then `verdict` and `proofUrl` in the result.