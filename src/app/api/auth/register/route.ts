// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (!email || !password || !passwordConfirm) {
    return NextResponse.json({ ok: false, message: "모든 값을 입력해주세요" }, { status: 400 });
  }

  if (password !== passwordConfirm) {
    return NextResponse.json({ ok: false, message: "비밀번호가 다릅니다" }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ ok: false, message: "이미 존재하는 이메일입니다" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: name || null,
      // status/role은 schema default(PENDING/MEMBER)로 자동 세팅
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}