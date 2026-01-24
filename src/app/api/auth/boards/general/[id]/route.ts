//src/app/api/auth/boards/general/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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

        const post = await prisma.post.findFirst({
            where: { id, board: "GENERAL" },
            select: {
                id: true,
                title: true,
                content: true,
                category: true,
                createdAt: true,
                author: { select: { name: true, email: true } },
            },
        });

        if (!post) {
            return NextResponse.json({ ok: false, message: "게시글을 찾을 수 없습니다." }, { status: 404 });
        }

        const result = {
            id: post.id,
            title: post.title,
            content: post.content,
            category: post.category === "TECH" ? "기술 글" : post.category === "QNA" ? "질문 글" : "기타",
            author: post.author.name ?? post.author.email,
            date: post.createdAt.toISOString().slice(0, 10),
        };

        return NextResponse.json({ ok: true, post: result });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
    }
}