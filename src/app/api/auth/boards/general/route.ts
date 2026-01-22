// src/app/api/auth/boards/general/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import autoDelete from "@/lib/hardDelete";

type Post = {
  id: number;
  title: string;
  content: string;
  category: "TECH" | "QNA" | "NONE";
  createdAt: Date;
  author: {
    name: string | null;
    email: string;
  };
};


export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) 
      return NextResponse.json({ ok: false, message: "로그인 필요" }, { status: 401 });
    if (user.status !== "APPROVED") 
      return NextResponse.json({ ok: false, message: "승인된 사용자만 접근 가능" }, { status: 403 });
    if (!["MEMBER", "STAFF", "ADMIN"].includes(user.role)) 
      return NextResponse.json({ ok: false, message: "게시판 접근 권한 없음" }, { status: 403 });

    await autoDelete();
    const posts = await prisma.post.findMany({
      where: { board: "GENERAL", deletedAt: null, },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        createdAt: true,
        author: { select: { name: true, email: true } },
      },
    });

    const result = posts.map((p : Post) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      category: p.category === "TECH" ? "기술 글" : p.category === "QNA" ? "질문 글" : "기타",
      author: p.author.name ?? p.author.email,
      date: p.createdAt.toISOString().slice(0, 10),
    }));

    return NextResponse.json({ ok: true, posts: result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) 
      return NextResponse.json({ ok: false, message: "로그인이 필요합니다." }, { status: 401 });
    if (user.status !== "APPROVED") 
      return NextResponse.json({ ok: false, message: "승인된 사용자만 글을 작성할 수 있습니다." }, { status: 403 });
    if (!["MEMBER", "STAFF", "ADMIN"].includes(user.role))
       return NextResponse.json({ ok: false, message: "글 작성 권한이 없습니다." }, { status: 403 });

    const body = await req.json();
    const { title, content, category } = body;

    if (!title || !content) 
      return NextResponse.json({ ok: false, message: "제목과 내용을 입력해주세요." }, { status: 400 });

    const postCategory = category === "TECH" || category === "QNA" ? category : "NONE";

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        category: postCategory,
        board: "GENERAL",
        authorId: user.id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        createdAt: true,
        author: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({
      ok: true,
      post: {
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        category: newPost.category === "TECH" ? "기술 글" : newPost.category === "QNA" ? "질문 글" : "기타",
        author: newPost.author.name ?? newPost.author.email,
        date: newPost.createdAt.toISOString().slice(0, 10),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user)
      return NextResponse.json({ ok: false, message: "로그인이 필요합니다." }, { status: 401 });
    if (user.status !== "APPROVED")
      return NextResponse.json({ ok: false, message: "승인된 사용자만 삭제할 수 있습니다." }, { status: 403 });
    if (!["MEMBER", "STAFF", "ADMIN"].includes(user.role))
      return NextResponse.json({ ok: false, message: "삭제 권한이 없습니다." }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const id = Number(body.id);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ ok: false, message: "유효하지 않은 id 입니다." }, { status: 400 });
    }

    // 대상 글 조회(권한 확인용)
    const post = await prisma.post.findFirst({
      where: { id, board: "GENERAL" },
      select: { id: true, authorId: true },
    });

    if (!post) {
      return NextResponse.json({ ok: false, message: "게시글을 찾을 수 없습니다." }, { status: 404 });
    }

    // 권한: 운영진/관리자 전부 가능, 일반은 본인 글만
    const isStaff = user.role === "STAFF" || user.role === "ADMIN";
    if (!isStaff && post.authorId !== user.id) {
      return NextResponse.json({ ok: false, message: "삭제 권한이 없습니다." }, { status: 403 });
    }

    await prisma.post.update({
      where: { id: post.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
  }
}