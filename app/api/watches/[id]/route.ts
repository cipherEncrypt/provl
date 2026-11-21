import { NextResponse } from "next/server";

import { getKaneAccount } from "@/lib/provl/kaneAccountStore";
import { ensureSessionId } from "@/lib/provl/session";
import {
  deleteWatch,
  getWatch,
  saveWatch,
  watchOwnedBySession,
} from "@/lib/watches/watchStore";

type RouteContext = { params: Promise<{ id: string }> };

async function scopeForRequest() {
  const sessionId = await ensureSessionId();
  const account = await getKaneAccount(sessionId);
  const userId = account?.username?.trim() ?? null;
  return { sessionId, userId };
}

export async function PATCH(req: Request, context: RouteContext) {
  const { id } = await context.params;
  const scope = await scopeForRequest();
  const watch = await getWatch(id);
  if (!watch || !watchOwnedBySession(watch, scope)) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  let body: { active?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.active !== "boolean") {
    return NextResponse.json({ error: "active must be a boolean" }, { status: 400 });
  }

  watch.active = body.active;
  await saveWatch(watch);
  return NextResponse.json({ watch });
}

export async function DELETE(_req: Request, context: RouteContext) {
  const { id } = await context.params;
  const scope = await scopeForRequest();
  const watch = await getWatch(id);
  if (!watch || !watchOwnedBySession(watch, scope)) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  await deleteWatch(id);
  return NextResponse.json({ ok: true });
}