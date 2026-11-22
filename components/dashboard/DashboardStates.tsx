import type { ReactNode } from "react";

export function DashboardIntro({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-steel">{children}</p>
  );
}

export function DashboardLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <p className="text-sm text-steel" role="status">
      {label}
    </p>
  );
}

export function DashboardEmpty({ children }: { children: ReactNode }) {
  return (
    <div className="surface-card text-sm leading-relaxed text-steel">
      {children}
    </div>
  );
}

export function DashboardError({ message }: { message: string }) {
  return (
    <p
      className="rounded-card border border-steel-line bg-paper px-4 py-3 text-sm text-ink shadow-soft"
      role="alert"
    >
      {message}
    </p>
  );
}