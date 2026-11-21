import type { ReactNode } from "react";

type DashboardViewColumnProps = {
  children: ReactNode;
};

/** Centered dashboard content column (~640px) with consistent gutters. */
export function DashboardViewColumn({ children }: DashboardViewColumnProps) {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[40rem]">{children}</div>
  );
}