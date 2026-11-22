type RowSkeletonProps = { rows?: number };

function Bar({ className }: { className: string }) {
  return <div className={`animate-pulse ${className}`} />;
}

export function CreditsPillSkeleton() {
  return (
    <span
      className="inline-flex h-9 min-w-[7.5rem] animate-pulse rounded-full border border-steel-line bg-mist"
      aria-hidden="true"
    />
  );
}

export function DashboardListSkeleton({ rows = 4 }: RowSkeletonProps) {
  return (
    <ul
      className="divide-y divide-steel-line rounded-card border border-steel-line bg-paper shadow-soft"
      aria-hidden="true"
    >
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="space-y-2 px-4 py-4">
          <div className="flex gap-2">
            <Bar className="h-5 w-16 rounded-full bg-mist" />
            <Bar className="h-4 w-24 rounded bg-mist/80" />
          </div>
          <Bar className="h-4 w-full max-w-md rounded bg-mist" />
        </li>
      ))}
    </ul>
  );
}

export function AccountCardSkeleton() {
  return (
    <div className="surface-card w-full min-w-0 space-y-4" aria-hidden="true">
      <Bar className="h-4 w-24 rounded bg-mist" />
      <Bar className="h-6 w-40 rounded bg-mist" />
      <div className="grid grid-cols-2 gap-3 border-t border-steel-line/80 pt-4">
        <Bar className="h-12 rounded bg-mist" />
        <Bar className="h-12 rounded bg-mist" />
      </div>
    </div>
  );
}