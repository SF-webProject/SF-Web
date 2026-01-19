// src/app/api/auth/boards/notice/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type Notice = {
    id: number;
    type: string;
    title: string;
    content: string;
    author: string;
    date: string;
    pinned?: boolean;
};


export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) 
      return NextResponse.json({ ok: false, message: "로그인 필요" }, { status: 401 });
    if (user.status !== "APPROVED") 
      return NextResponse.json({ ok: false, message: "승인된 사용자만 접근 가능" }, { status: 403 });
    if (!["MEMBER","STAFF", "ADMIN"].includes(user.role)) 
      return NextResponse.json({ ok: false, message: "게시판 접근 권한 없음" }, { status: 403 });


   const posts = await prisma.post.findMany({
      where: { board: "NOTICE",category: "NONE" },
      orderBy: [
        { pinned: "desc" },     
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        pinned: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

     const result: Notice[] = posts.map((p) => ({
      id: p.id,
      type: p.category, 
      title: p.title,
      content: p.content,
      author: p.author.name ?? p.author.email,
      date: p.createdAt.toISOString().slice(0, 10),
      pinned: p.pinned,
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
    if (![ "STAFF", "ADMIN"].includes(user.role))
       return NextResponse.json({ ok: false, message: "글 작성 권한이 없습니다." }, { status: 403 });

    
    const body = await req.json();
    const { title, content, category,pinned } = body;

    if (!title || !content) 
      return NextResponse.json({ ok: false, message: "제목과 내용을 입력해주세요." }, { status: 400 });


     const newPost = await prisma.post.create({
      data: {
        title,
        content,
        board: "NOTICE",
        category: "NONE", 
        pinned: Boolean(pinned),
        authorId: user.id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        pinned: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      post: {
        id: newPost.id,
        type: newPost.category, 
        title: newPost.title,
        content: newPost.content,
        author: newPost.author.name ?? newPost.author.email,
        date: newPost.createdAt.toISOString().slice(0, 10),
        pinned: newPost.pinned,
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

    const post = await prisma.post.findFirst({
      where: { id, board: "NOTICE" },
      select: { id: true, authorId: true },
    });

    if (!post) {
      return NextResponse.json({ ok: false, message: "공지글을 찾을 수 없습니다." }, { status: 404 });
    }

    const isStaff = user.role === "STAFF" || user.role === "ADMIN";
    if (!isStaff && post.authorId !== user.id) {
      return NextResponse.json({ ok: false, message: "삭제 권한이 없습니다." }, { status: 403 });
    }

    await prisma.post.delete({ where: { id: post.id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
  }
}