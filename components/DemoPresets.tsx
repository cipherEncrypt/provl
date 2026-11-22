"use client";

import { DEMO_PRESETS, resolvePresetUrl, type DemoPreset } from "@/lib/demoPresets";

type DemoPresetsProps = {
  disabled?: boolean;
  onRunPreset: (task: string, url: string) => void;
};

const SHORT_LABEL: Record<string, string> = {
  cancel: "Try: cancel a subscription",
  "honest-fail": "Try: honest fail",
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
    <div className="flex w-full flex-col items-center gap-3">
      <p className="text-sm text-steel">Or try a one-click demo</p>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        {DEMO_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={disabled}
            onClick={() => run(preset)}
            title={preset.description}
            className="btn-secondary w-full rounded-full px-5 sm:w-auto"
          >
            {SHORT_LABEL[preset.id] ?? preset.label}
          </button>
        ))}
      </div>
      <p className="max-w-sm text-center text-xs leading-relaxed text-steel-soft">
        Each run uses a real Chrome session and takes 1-3 minutes.
      </p>
    </div>
  );
}