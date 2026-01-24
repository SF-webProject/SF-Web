//src/app/api/auth/comments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function toIso(dt: Date) {
    return dt.toISOString();
}

function authorLabel(author: { name: string | null; email: string }) {
    return author.name ?? author.email;
}

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user)
            return NextResponse.json({ ok: false, message: "로그인 필요" }, { status: 401 });
        if (user.status !== "APPROVED")
            return NextResponse.json({ ok: false, message: "승인된 사용자만 접근 가능" }, { status: 403 });

        const url = new URL(req.url);
        const target = url.searchParams.get("target"); // "post" | "resource"
        const idStr = url.searchParams.get("id");

        const id = Number(idStr);
        if (!target || !idStr || !id || Number.isNaN(id)) {
            return NextResponse.json({ ok: false, message: "target, id가 필요합니다." }, { status: 400 });
        }

        // 열람 권한은 기존 규칙 그대로:
        // - 게시글/자료 자체를 볼 수 있으면 댓글도 볼 수 있음
        if (target === "post") {
            const post = await prisma.post.findFirst({
                where: { id, deletedAt: null },
                select: { id: true },
            });
            if (!post) {
                return NextResponse.json({ ok: false, message: "게시글을 찾을 수 없습니다." }, { status: 404 });
            }

            const comments = await prisma.comment.findMany({
                where: { postId: id, deletedAt: null },
                orderBy: { createdAt: "asc" },
                take: 200,
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    authorId: true,
                    author: { select: { name: true, email: true } },
                },
            });

            return NextResponse.json({
                ok: true,
                comments: comments.map((c) => ({
                    id: c.id,
                    content: c.content,
                    author: authorLabel(c.author),
                    authorId: c.authorId,
                    createdAt: toIso(c.createdAt),
                })),
            });
        }

        if (target === "resource") {
            const r = await prisma.resource.findFirst({
                where: { id },
                select: { id: true },
            });
            if (!r) {
                return NextResponse.json({ ok: false, message: "자료를 찾을 수 없습니다." }, { status: 404 });
            }

            const comments = await prisma.comment.findMany({
                where: { resourceId: id, deletedAt: null },
                orderBy: { createdAt: "asc" },
                take: 200,
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    authorId: true,
                    author: { select: { name: true, email: true } },
                },
            });

            return NextResponse.json({
                ok: true,
                comments: comments.map((c) => ({
                    id: c.id,
                    content: c.content,
                    author: authorLabel(c.author),
                    authorId: c.authorId,
                    createdAt: toIso(c.createdAt),
                })),
            });
        }

        return NextResponse.json({ ok: false, message: "target은 post 또는 resource만 가능합니다." }, { status: 400 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user)
            return NextResponse.json({ ok: false, message: "로그인 필요" }, { status: 401 });
        if (user.status !== "APPROVED")
            return NextResponse.json({ ok: false, message: "승인된 사용자만 댓글 작성 가능" }, { status: 403 });

        const body = await req.json().catch(() => ({}));
        const target = String(body.target ?? "");
        const id = Number(body.id);
        const content = String(body.content ?? "").trim();

        if (!target || !id || Number.isNaN(id) || !content) {
            return NextResponse.json({ ok: false, message: "target, id, content가 필요합니다." }, { status: 400 });
        }
        if (content.length > 2000) {
            return NextResponse.json({ ok: false, message: "댓글은 2000자 이하만 가능합니다." }, { status: 400 });
        }

        if (target === "post") {
            const post = await prisma.post.findFirst({
                where: { id, deletedAt: null },
                select: { id: true },
            });
            if (!post) return NextResponse.json({ ok: false, message: "게시글이 없습니다." }, { status: 404 });

            const created = await prisma.comment.create({
                data: {
                    content,
                    postId: id,
                    authorId: user.id,
                },
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    authorId: true,
                    author: { select: { name: true, email: true } },
                },
            });

            return NextResponse.json({
                ok: true,
                comment: {
                    id: created.id,
                    content: created.content,
                    author: authorLabel(created.author),
                    authorId: created.authorId,
                    createdAt: toIso(created.createdAt),
                },
            });
        }

        if (target === "resource") {
            const r = await prisma.resource.findFirst({
                where: { id },
                select: { id: true },
            });
            if (!r) return NextResponse.json({ ok: false, message: "자료가 없습니다." }, { status: 404 });

            const created = await prisma.comment.create({
                data: {
                    content,
                    resourceId: id,
                    authorId: user.id,
                },
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    authorId: true,
                    author: { select: { name: true, email: true } },
                },
            });

            return NextResponse.json({
                ok: true,
                comment: {
                    id: created.id,
                    content: created.content,
                    author: authorLabel(created.author),
                    authorId: created.authorId,
                    createdAt: toIso(created.createdAt),
                },
            });
        }

        return NextResponse.json({ ok: false, message: "target은 post 또는 resource만 가능합니다." }, { status: 400 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user)
            return NextResponse.json({ ok: false, message: "로그인 필요" }, { status: 401 });
        if (user.status !== "APPROVED")
            return NextResponse.json({ ok: false, message: "승인된 사용자만 삭제 가능" }, { status: 403 });

        const body = await req.json().catch(() => ({}));
        const id = Number(body.id);

        if (!id || Number.isNaN(id)) {
            return NextResponse.json({ ok: false, message: "유효하지 않은 id 입니다." }, { status: 400 });
        }

        const comment = await prisma.comment.findFirst({
            where: { id, deletedAt: null },
            select: { id: true, authorId: true },
        });

        if (!comment) {
            return NextResponse.json({ ok: false, message: "댓글을 찾을 수 없습니다." }, { status: 404 });
        }

        const isStaff = user.role === "STAFF" || user.role === "ADMIN";
        if (!isStaff && comment.authorId !== user.id) {
            return NextResponse.json({ ok: false, message: "삭제 권한이 없습니다." }, { status: 403 });
        }

        await prisma.comment.update({
            where: { id: comment.id },
            data: { deletedAt: new Date() },
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
    }
}