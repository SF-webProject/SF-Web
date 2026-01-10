// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (!email || !password || !passwordConfirm) {
    return NextResponse.json({ message: "모든 값을 입력해주세요" }, { status: 400 });
  }

  if (password !== passwordConfirm) {
    return NextResponse.json({ message: "비밀번호가 다릅니다" }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ message: "이미 존재하는 이메일입니다" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, passwordHash },
  });

  // POST 후에는 303으로 GET 전환
  return NextResponse.redirect(new URL("/login", req.url), 303);
}