"use client";

import { useCallback, useEffect, useState } from "react";

const LT_KEY_HELP =
  "https://www.testmuai.com/support/docs/kane-cli-authentication";
const LT_BILLING = "https://billing.lambdatest.com/billing/credits";

type AccountStatus = {
  connected: boolean;
  username: string | null;
  availableCredits: number | null;
  creditsSpentSession: number;
  billingMode: "user" | "machine";
};

type ConnectResponse = {
  connected?: boolean;
  username?: string;
  availableCredits?: number;
  error?: string;
};

export function KaneAccount() {
  const [status, setStatus] = useState<AccountStatus | null>(null);
  const [username, setUsername] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const refreshAccount = useCallback(async () => {
    try {
      const res = await fetch("/api/kane/account", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as AccountStatus;
      setStatus(data);
      if (data.connected && data.username) {
        setUsername(data.username);
      }
    } catch {
      /* ignore — run form still works */
    }
  }, []);

  useEffect(() => {
    void refreshAccount();
  }, [refreshAccount]);

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    const u = username.trim();
    const k = accessKey.trim();
    if (!u || !k) return;

    setLoading(true);
    setConnectError(null);

    try {
      const res = await fetch("/api/kane/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, accessKey: k }),
      });
      const data = (await res.json()) as ConnectResponse;

      if (!res.ok || data.error) {
        setConnectError(data.error ?? "Could not connect Kane account.");
        setAccessKey("");
        return;
      }

      setAccessKey("");
      await refreshAccount();
      setExpanded(false);
    } catch {
      setConnectError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    setLoading(true);
    setConnectError(null);
    try {
      await fetch("/api/kane/connect", { method: "DELETE" });
      setAccessKey("");
      await refreshAccount();
    } finally {
      setLoading(false);
    }
  }

  const connected = status?.connected ?? false;
  const billingMode = status?.billingMode ?? "machine";

  return (
    <section
      className="surface-card w-full text-left"
      aria-label="Kane account"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink">Kane account</p>
          {connected && status?.username ? (
            <p className="mt-1 text-sm text-steel">
              Connected as{" "}
              <span className="font-medium text-ink">{status.username}</span>
            </p>
          ) : (
            <p className="mt-1 text-sm text-steel">
              Using this machine&apos;s Kane login{" "}
              <span className="text-steel-soft">(demo fallback)</span>
            </p>
          )}
        </div>
        <button
          type="button"
          className="btn-secondary text-sm"
          onClick={() => setExpanded((v) => !v)}
          disabled={loading}
        >
          {expanded
            ? "Close"
            : connected
              ? "Manage"
              : "Connect your Kane account"}
        </button>
      </div>

      {(status?.connected ||
        (status?.creditsSpentSession ?? 0) > 0 ||
        status?.availableCredits != null) && (
        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-steel-line/80 pt-4 text-sm">
          <div>
            <dt className="text-steel-soft">Available credits</dt>
            <dd className="font-medium tabular-nums text-ink">
              {status?.availableCredits != null
                ? status.availableCredits.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-steel-soft">Spent this session</dt>
            <dd className="font-medium tabular-nums text-ink">
              {(status?.creditsSpentSession ?? 0).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </dd>
          </div>
        </dl>
      )}

      {billingMode === "user" && (
        <p className="mt-3 text-xs text-steel-soft">
          Runs bill your LambdaTest credits via your connected key.
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-3">
        <a
          href={LT_BILLING}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-ink underline decoration-steel-line underline-offset-2 hover:decoration-ink"
        >
          Top up credits
        </a>
        <a
          href={LT_KEY_HELP}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-steel underline decoration-steel-line underline-offset-2 hover:text-ink"
        >
          Where to find your access key
        </a>
      </div>

      {expanded && (
        <div className="mt-5 border-t border-steel-line/80 pt-5">
          {connected ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-steel">
                Your access key stays on the server, encrypted. We only show your
                username and balance here.
              </p>
              <button
                type="button"
                className="btn-secondary w-full sm:w-auto"
                onClick={() => void handleDisconnect()}
                disabled={loading}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <form onSubmit={handleConnect} className="flex flex-col gap-4" autoComplete="off">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-ink">LambdaTest username</span>
                <input
                  type="text"
                  name="lt-username"
                  required
                  autoComplete="off"
                  disabled={loading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="field-input"
                  spellCheck={false}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-ink">Access key</span>
                <input
                  type="password"
                  name="lt-access-key"
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="field-input"
                  spellCheck={false}
                />
              </label>

              {connectError && (
                <p className="text-sm text-ink" role="alert">
                  {connectError}
                </p>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Checking balance…" : "Connect & validate"}
              </button>

              <p className="text-xs leading-relaxed text-steel-soft">
                Copy your key from the LambdaTest / TestMu dashboard{" "}
                <a
                  href={LT_KEY_HELP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  Credentials
                </a>
                . Provl never sends the key back to the browser after you connect.
              </p>
            </form>
          )}
        </div>
      )}
    </section>
  );
}