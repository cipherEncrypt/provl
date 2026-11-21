import { cookies } from "next/headers";

export const DEMO_COOKIE = "provl_machine_demo";

const DEMO_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function isMachineDemoEnabled(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(DEMO_COOKIE)?.value === "1";
}

export async function enableMachineDemo(): Promise<void> {
  const jar = await cookies();
  jar.set(DEMO_COOKIE, "1", DEMO_COOKIE_OPTIONS);
}

export async function disableMachineDemo(): Promise<void> {
  const jar = await cookies();
  jar.delete(DEMO_COOKIE);
}