import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Provl</h1>
      <p className="text-slate-400">
        Phase A backend is wired to Kane CLI. Use the sandbox subscription demo
        for the cancel acceptance flow.
      </p>
      <Link
        href="/demo/subscription"
        className="rounded-lg bg-emerald-600 px-4 py-2 text-center font-medium text-white hover:bg-emerald-500"
      >
        Open cancel demo
      </Link>
    </main>
  );
}