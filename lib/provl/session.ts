import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";

export const SESSION_COOKIE = "provl_sid";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 90,
};

export async function getSessionId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value ?? null;
}

/** Returns existing session id or creates one and sets the cookie. */
export async function ensureSessionId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(SESSION_COOKIE)?.value;
  if (existing) return existing;

  const sid = randomUUID();
  jar.set(SESSION_COOKIE, sid, COOKIE_OPTIONS);
  return sid;
}