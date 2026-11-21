import type { WatchPublic, WatchRecord } from "./types";

export function toPublicWatch(watch: WatchRecord): WatchPublic {
  const { secretsEnc, ...rest } = watch;
  return {
    ...rest,
    hasSecrets: Boolean(secretsEnc?.trim()),
  };
}