"use client";

import { useEffect, useState } from "react";

import { KaneAccountSummary } from "../KaneAccountSummary";
import { DashboardViewColumn } from "./DashboardViewColumn";

export function DashboardAccountView() {
  const [refreshNonce, setRefreshNonce] = useState(0);

  useEffect(() => {
    const fn = () => setRefreshNonce((n) => n + 1);
    window.addEventListener("provl:account-refresh", fn);
    return () => window.removeEventListener("provl:account-refresh", fn);
  }, []);

  return (
    <DashboardViewColumn>
      <KaneAccountSummary refreshNonce={refreshNonce} showSignOut={false} />
    </DashboardViewColumn>
  );
}