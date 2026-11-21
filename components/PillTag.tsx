type PillTagProps = {
  label: string;
  className?: string;
};

/** Small chip with a geometric mark + uppercase label */
export function PillTag({ label, className = "" }: PillTagProps) {
  return (
    <span className={`pill-tag ${className}`}>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="1" y="1" width="4" height="4" fill="currentColor" />
        <rect x="7" y="1" width="4" height="4" fill="currentColor" opacity="0.35" />
        <rect x="1" y="7" width="4" height="4" fill="currentColor" opacity="0.35" />
        <rect x="7" y="7" width="4" height="4" fill="currentColor" />
      </svg>
      {label}
    </span>
  );
}