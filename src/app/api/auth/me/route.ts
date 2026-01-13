// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

type MeUser = {
  id: string;
  email: string;
  name?: string | null;
  status?: "PENDING" | "APPROVED" | "REJECTED" | null;
  role?: "MEMBER" | "STAFF" | "ADMIN" | null;
};

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const u = user as unknown as MeUser;

  return NextResponse.json({
    ok: true,
    user: {
      id: u.id,
      email: u.email,
      name: u.name ?? null,
      status: u.status ?? null,
      role: u.role ?? null,
    },
  });
}