import type { ReactNode } from "react";

type DashboardViewColumnProps = {
  children: ReactNode;
};

/** Centered dashboard content column (~640px) with consistent vertical rhythm. */
export function DashboardViewColumn({ children }: DashboardViewColumnProps) {
  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[40rem] flex-col gap-6">
      {children}
    </div>
  );
}