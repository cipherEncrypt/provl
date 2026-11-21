export type DemoPreset = {
  id: string;
  label: string;
  description: string;
  task: string;
  /** Static URL, or path resolved against the app origin at click time */
  url: string | "local-subscription";
  expect: "done" | "not-done";
};

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "cancel",
    label: "Demo: cancel subscription",
    description: "Should return DONE with proof fields and a replay link.",
    task:
      'Click "Cancel subscription", confirm by clicking "Yes, cancel" in the dialog, then verify the page shows "Subscription canceled".',
    url: "local-subscription",
    expect: "done",
  },
  {
    id: "honest-fail",
    label: "Demo: honest NOT DONE",
    description:
      "Asks for a control that does not exist - should fail honestly with one attempt.",
    task: 'Verify a "Sign up with Google" button is visible on the login page.',
    url: "https://the-internet.herokuapp.com/login",
    expect: "not-done",
  },
];

export function resolvePresetUrl(
  preset: DemoPreset,
  origin = "http://localhost:3000",
): string {
  if (preset.url === "local-subscription") {
    return `${origin.replace(/\/$/, "")}/demo/subscription`;
  }
  return preset.url;
}