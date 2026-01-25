//src/app/api/auth/reset-password/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));

        const token = typeof body.token === "string" ? body.token : "";
        const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
        const newPasswordConfirm = typeof body.newPasswordConfirm === "string" ? body.newPasswordConfirm : "";

        if (!token) {
            return NextResponse.json({ ok: false, message: "유효하지 않은 토큰입니다." }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ ok: false, message: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
        }

        if (newPassword !== newPasswordConfirm) {
            return NextResponse.json({ ok: false, message: "새 비밀번호가 일치하지 않습니다." }, { status: 400 });
        }

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const row = await prisma.passwordResetToken.findUnique({
            where: { tokenHash },
            select: { userId: true, expiresAt: true, usedAt: true },
        });

        if (!row || row.usedAt || row.expiresAt.getTime() < Date.now()) {
            return NextResponse.json({ ok: false, message: "토큰이 만료되었거나 이미 사용되었습니다." }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);

        // 비밀번호 업데이트 + 토큰 사용처리 + 세션 전부 삭제
        await prisma.$transaction([
            prisma.user.update({
                where: { id: row.userId },
                data: { passwordHash },
            }),
            prisma.passwordResetToken.update({
                where: { tokenHash },
                data: { usedAt: new Date() },
            }),
            prisma.passwordResetToken.deleteMany({
                where: { userId: row.userId, tokenHash: { not: tokenHash } },
            }),
            prisma.session.deleteMany({ where: { userId: row.userId } }),
        ]);

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
    }
}