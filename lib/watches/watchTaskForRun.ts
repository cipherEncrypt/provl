import { taskNeedsStoredSecrets } from "@/lib/run/loginHints";

/** Plain-language monitor tasks: prepend sign-in when creds exist but task omits placeholders. */
export function taskForWatchRun(
  task: string,
  secrets: Record<string, string>,
): string {
  const trimmed = task.trim();
  const hasUser = Boolean(secrets.username);
  const hasPass = Boolean(secrets.password);
  if (!hasUser || !hasPass) return trimmed;
  if (taskNeedsStoredSecrets(trimmed)) return trimmed;
  return `Sign in with {{username}} and {{password}}, then ${trimmed}`;
}