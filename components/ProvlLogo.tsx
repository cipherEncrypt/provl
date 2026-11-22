type ProvlLogoProps = {
  /** Icon + wordmark, or icon only */
  variant?: "full" | "mark";
  /** For dark backgrounds (inverts to white) */
  onDark?: boolean;
  className?: string;
};

const INK = "#0A0A0A";
const PAPER = "#FFFFFF";

/** Concept A: geometric P with proof check (recommended). */
export function ProvlLogo({
  variant = "full",
  onDark = false,
  className,
}: ProvlLogoProps) {
  const fill = onDark ? PAPER : INK;
  const size = variant === "mark" ? 32 : 152;
  const height = 32;

  return (
    <svg
      width={variant === "mark" ? 32 : undefined}
      height={height}
      viewBox={variant === "mark" ? "0 0 32 32" : "0 0 152 32"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={variant === "mark"}
      role={variant === "mark" ? undefined : "img"}
    >
      {variant === "full" ? (
        <title>Provl</title>
      ) : null}
      <path fill={fill} d="M7 6h4v20H7V6z" />
      <path fill={fill} d="M11 6h5.8c4.2 0 4.2 7.6 0 7.6H11V6z" />
      <path
        d="M9.5 17.2 12.4 20 21.5 10.2"
        stroke={fill}
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {variant === "full" ? (
        <text
          x="40"
          y="22.5"
          fill={fill}
          fontFamily="var(--font-geist-sans), Geist, Inter, ui-sans-serif, system-ui, sans-serif"
          fontSize="19"
          fontWeight="600"
          letterSpacing="-0.03em"
        >
          Provl
        </text>
      ) : null}
    </svg>
  );
}

export function ProvlMark({ onDark = false, className }: Omit<ProvlLogoProps, "variant">) {
  return <ProvlLogo variant="mark" onDark={onDark} className={className} />;
}