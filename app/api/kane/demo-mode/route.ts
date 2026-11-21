import { NextResponse } from "next/server";

import {
  disableMachineDemo,
  enableMachineDemo,
  isMachineDemoEnabled,
} from "@/lib/provl/demoSession";
import { ensureSessionId } from "@/lib/provl/session";

export async function GET() {
  await ensureSessionId();
  return NextResponse.json({ demoMode: await isMachineDemoEnabled() });
}

export async function POST() {
  await ensureSessionId();
  await enableMachineDemo();
  return NextResponse.json({ demoMode: true });
}

export async function DELETE() {
  await disableMachineDemo();
  return NextResponse.json({ demoMode: false });
}