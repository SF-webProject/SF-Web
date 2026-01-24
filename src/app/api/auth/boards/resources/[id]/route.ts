//src/app/api/auth/boards/resources/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function toDateYMD(d: Date) {
    return d.toISOString().slice(0, 10);
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();

        if (!user)
            return NextResponse.json({ ok: false, message: "로그인 필요" }, { status: 401 });
        if (user.status !== "APPROVED")
            return NextResponse.json({ ok: false, message: "승인된 사용자만 접근 가능" }, { status: 403 });
        if (!["MEMBER", "STAFF", "ADMIN"].includes(user.role))
            return NextResponse.json({ ok: false, message: "게시판 접근 권한 없음" }, { status: 403 });

        const { id: idStr } = await ctx.params;
        const id = Number(idStr);
        if (!id || Number.isNaN(id)) {
            return NextResponse.json({ ok: false, message: "유효하지 않은 id 입니다." }, { status: 400 });
        }

        const r = await prisma.resource.findFirst({
            where: { id },
            select: {
                id: true,
                type: true,
                title: true,
                description: true,
                originalName: true,
                mimeType: true,
                sizeBytes: true,
                createdAt: true,
                updatedAt: true,
                uploader: { select: { name: true, email: true } },
            },
        });

        if (!r) {
            return NextResponse.json({ ok: false, message: "자료를 찾을 수 없습니다." }, { status: 404 });
        }

        return NextResponse.json({
            ok: true,
            resource: {
                id: r.id,
                type: r.type,
                title: r.title,
                description: r.description,
                originalName: r.originalName,
                mimeType: r.mimeType,
                sizeBytes: r.sizeBytes,
                created: toDateYMD(r.createdAt),
                updated: toDateYMD(r.updatedAt),
                uploader: r.uploader.name ?? r.uploader.email,
            },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
    }
}