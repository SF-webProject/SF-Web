//src/app/api/auth/admin/delete-user/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const me = await getCurrentUser();
        if (!me) {
            return NextResponse.json({ ok: false, message: "로그인이 필요합니다." }, { status: 401 });
        }
        if (me.status !== "APPROVED" || me.role !== "ADMIN") {
            return NextResponse.json({ ok: false, message: "접근 권한이 없습니다." }, { status: 403 });
        }

        const body = await req.json().catch(() => ({}));
        const userId = typeof body.userId === "string" ? body.userId : "";

        if (!userId) {
            return NextResponse.json({ ok: false, message: "userId가 필요합니다." }, { status: 400 });
        }

        // 자기 자신 삭제 방지
        if (userId === me.id) {
            return NextResponse.json({ ok: false, message: "자기 자신은 삭제할 수 없습니다." }, { status: 400 });
        }

        const target = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, status: true },
        });

        if (!target) {
            return NextResponse.json({ ok: false, message: "사용자를 찾을 수 없습니다." }, { status: 404 });
        }

        // APPROVED 등 다른 상태 삭제 방지(오직 PENDING만)
        if (target.status !== "PENDING") {
            return NextResponse.json({ ok: false, message: "PENDING 계정만 삭제할 수 있습니다." }, { status: 400 });
        }

        await prisma.user.delete({ where: { id: userId } });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
    }
}