// src/app/api/auth/logout/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function POST(req: Request) {
  const token = getCookieValue(req.headers.get("cookie"), "session");

  if (token) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    await prisma.session.deleteMany({ where: { tokenHash } });
  }

  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("session", "", { path: "/", expires: new Date(0) });
  return res;
}