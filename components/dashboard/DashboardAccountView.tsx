"use client";

import { useEffect, useState } from "react";

import { KaneAccountSummary } from "../KaneAccountSummary";
import { DashboardIntro } from "./DashboardStates";
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
      <DashboardIntro>
        Your Kane connection and credits for this session. Connect here to track
        usage in the dashboard; or use machine OAuth without connecting.
      </DashboardIntro>
      <KaneAccountSummary refreshNonce={refreshNonce} showSignOut={false} />
    </DashboardViewColumn>
  );
}