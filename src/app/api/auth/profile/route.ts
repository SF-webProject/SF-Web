//src/app/api/auth/profile/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
    try {
        const me = await getCurrentUser();
        if (!me) {
            return NextResponse.json({ ok: false, message: "로그인이 필요합니다." }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));

        const name = typeof body.name === "string" ? body.name.trim() : null;

        const currentPassword =
            typeof body.currentPassword === "string" ? body.currentPassword : null;
        const newPassword =
            typeof body.newPassword === "string" ? body.newPassword : null;
        const newPasswordConfirm =
            typeof body.newPasswordConfirm === "string" ? body.newPasswordConfirm : null;

        // 최소 1개는 변경해야 함
        if (!name && !newPassword) {
            return NextResponse.json({ ok: false, message: "변경할 값을 입력해주세요." }, { status: 400 });
        }

        // 이름 변경
        if (name !== null) {
            if (name.length > 30) {
                return NextResponse.json({ ok: false, message: "이름이 너무 깁니다." }, { status: 400 });
            }

            await prisma.user.update({
                where: { id: me.id },
                data: { name: name || null },
            });
        }

        // 비밀번호 변경
        if (newPassword !== null) {
            if (!currentPassword) {
                return NextResponse.json({ ok: false, message: "현재 비밀번호를 입력해주세요." }, { status: 400 });
            }
            if (!newPasswordConfirm) {
                return NextResponse.json({ ok: false, message: "새 비밀번호 확인을 입력해주세요." }, { status: 400 });
            }
            if (newPassword !== newPasswordConfirm) {
                return NextResponse.json({ ok: false, message: "새 비밀번호가 일치하지 않습니다." }, { status: 400 });
            }
            if (newPassword.length < 8) {
                return NextResponse.json({ ok: false, message: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
            }

            // DB에서 passwordHash만 안전하게 조회해서 비교
            const row = await prisma.user.findUnique({
                where: { id: me.id },
                select: { passwordHash: true },
            });

            if (!row) {
                return NextResponse.json({ ok: false, message: "사용자를 찾을 수 없습니다." }, { status: 404 });
            }

            const ok = await bcrypt.compare(currentPassword, row.passwordHash);
            if (!ok) {
                return NextResponse.json({ ok: false, message: "현재 비밀번호가 올바르지 않습니다." }, { status: 401 });
            }

            const passwordHash = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: { id: me.id },
                data: { passwordHash },
            });

            // 보안 정책: 비밀번호 변경 시 모든 세션 무효화 + 쿠키 삭제 -> 재로그인 유도
            await prisma.session.deleteMany({ where: { userId: me.id } });

            const res = NextResponse.json({ ok: true, logout: true });
            res.cookies.set("session", "", {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                path: "/",
                expires: new Date(0),
            });
            return res;
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
    }
}