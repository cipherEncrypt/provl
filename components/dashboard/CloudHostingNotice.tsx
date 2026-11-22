type CloudHostingNoticeProps = {
  platform: "vercel" | "render";
};

const LABEL: Record<CloudHostingNoticeProps["platform"], string> = {
  vercel: "Vercel",
  render: "Render",
};

export function CloudHostingNotice({ platform }: CloudHostingNoticeProps) {
  const host = LABEL[platform];
  return (
    <div
      className="rounded-card border border-steel-line bg-mist px-4 py-3 text-sm leading-relaxed text-steel"
      role="status"
    >
      <p className="font-medium text-ink">Hosted on {host}</p>
      <p className="mt-1">
        Kane runs need Chrome on a real machine. Clone the repo, run{" "}
        <code className="text-xs text-ink">npm run dev</code>, and sign in with{" "}
        <code className="text-xs text-ink">kane-cli login --oauth</code> to
        execute tasks. This deployment is for the product UI and docs. On Free
        Render, the service may sleep when idle (slow first load).
      </p>
    </div>
  );
}