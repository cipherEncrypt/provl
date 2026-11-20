"use client";

import { DEMO_PRESETS, resolvePresetUrl, type DemoPreset } from "@/lib/demoPresets";

type DemoPresetsProps = {
  disabled?: boolean;
  onRunPreset: (task: string, url: string) => void;
};

export function DemoPresets({ disabled, onRunPreset }: DemoPresetsProps) {
  function run(preset: DemoPreset) {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    onRunPreset(preset.task, resolvePresetUrl(preset, origin));
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-sm font-medium text-slate-400">Try a demo (one click)</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {DEMO_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={disabled}
            onClick={() => run(preset)}
            className={`rounded-xl border px-4 py-3 text-left transition disabled:opacity-50 ${
              preset.expect === "done"
                ? "border-emerald-800/60 bg-emerald-950/20 hover:border-emerald-600/80"
                : "border-amber-800/50 bg-amber-950/15 hover:border-amber-600/70"
            }`}
          >
            <span className="block text-sm font-semibold text-slate-100">
              {preset.label}
            </span>
            <span className="mt-1 block text-xs text-slate-400">
              {preset.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}