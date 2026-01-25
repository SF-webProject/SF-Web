//src/app/api/auth/forgot-password/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const form = await req.formData();
        const email = String(form.get("email") ?? "").trim();

        // 존재 여부를 외부에 노출하지 않기 위해, 기본 응답은 항상 성공처럼
        const defaultRes = NextResponse.json({
            ok: true,
            message: "요청이 접수되었습니다. 가입 이메일이 맞다면 재설정 절차가 진행됩니다.",
        });

        if (!email) return defaultRes;

        const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
        if (!user) return defaultRes;

        // 토큰 발급(원문은 URL에, DB에는 해시 저장)
        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1시간

        // 기존 토큰 정리
        await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

        await prisma.passwordResetToken.create({
            data: { tokenHash, userId: user.id, expiresAt },
        });

        const origin = new URL(req.url).origin;
        const resetUrl = `${origin}/reset-password/${token}`;

        // 일단은 링크를 응답으로 내려주고, 추후 메일 발송으로 대체하면 좋을 거 같음
        if (process.env.NODE_ENV !== "production") {
            return NextResponse.json({
                ok: true,
                message: "[임시] 아래 링크로 재설정 가능합니다.",
                resetUrl,
            });
        }

        // 나중에는 여기서 이메일 발송 로직 넣으면 된다. 
        return defaultRes;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
    }
}