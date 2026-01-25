//src/app/api/auth/admin/pending-users/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const me = await getCurrentUser();
        if (!me) {
            return NextResponse.json({ ok: false, message: "로그인이 필요합니다." }, { status: 401 });
        }
        if (me.status !== "APPROVED" || me.role !== "ADMIN") {
            return NextResponse.json({ ok: false, message: "접근 권한이 없습니다." }, { status: 403 });
        }

        const users = await prisma.user.findMany({
            where: { status: "PENDING" },
            orderBy: { email: "asc" },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                role: true,
            },
        });

        return NextResponse.json({ ok: true, users });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
    }
}