"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { KaneConnectResponse } from "@/lib/api-types";
import { LT_KEY_HELP } from "@/lib/kane/constants";

type KaneConnectFormProps = {
  onConnected?: () => void;
};

export function KaneConnectForm({ onConnected }: KaneConnectFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const u = username.trim();
    const k = accessKey.trim();
    if (!u || !k) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/kane/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, accessKey: k }),
      });
      const data = (await res.json()) as KaneConnectResponse;

      if (!res.ok || data.error) {
        setError(data.error ?? "Could not connect Kane account.");
        setAccessKey("");
        return;
      }

      setAccessKey("");
      onConnected?.();
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  async function continueMachineDemo() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/kane/demo-mode", { method: "POST" });
      if (!res.ok) {
        setError("Could not start demo mode.");
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="surface-card w-full text-left">
      <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
        Connect your Kane account
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-steel">
        Sign in with your LambdaTest username and access key. Provl runs tasks on
        your credits and keeps your key encrypted on the server.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4"
        autoComplete="off"
      >
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

        {error && (
          <p className="text-sm text-ink" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Checking balance…" : "Connect & sign in"}
        </button>
      </form>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-steel-line/80 pt-5 text-sm">
        <a
          href={LT_KEY_HELP}
          target="_blank"
          rel="noopener noreferrer"
          className="text-steel underline decoration-steel-line underline-offset-2 hover:text-ink"
        >
          Where to find your access key
        </a>
        <a
          href="https://billing.lambdatest.com/billing/credits"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-ink underline decoration-steel-line underline-offset-2 hover:decoration-ink"
        >
          Top up credits
        </a>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-steel-soft">
        Your key is never echoed back after connect. Need to try Provl without
        billing your account?{" "}
        <button
          type="button"
          disabled={loading}
          onClick={() => void continueMachineDemo()}
          className="font-medium text-ink underline underline-offset-2 hover:no-underline disabled:opacity-50"
        >
          Continue with this machine&apos;s Kane login (demo)
        </button>
        .
      </p>
    </div>
  );
}