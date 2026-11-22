import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";

function hostedPlatform(): "vercel" | "render" | null {
  if (process.env.VERCEL === "1") return "vercel";
  if (process.env.RENDER === "true") return "render";
  return null;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell hostedPlatform={hostedPlatform()}>
      {children}
    </DashboardShell>
  );
}