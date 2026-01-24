//src/app/api/auth/boards/resources/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import path from "path";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "resources");

// 목록에 내려줄 형태
type ResourceListItem = {
  id: number;
  type: string;
  name: string;
  desc: string;
  sizeBytes: number;
  updated: string; // YYYY-MM-DD
};

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

function toDateYMD(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user)
      return NextResponse.json({ ok: false, message: "로그인 필요" }, { status: 401 });
    if (user.status !== "APPROVED")
      return NextResponse.json({ ok: false, message: "승인된 사용자만 접근 가능" }, { status: 403 });
    if (!["MEMBER", "STAFF", "ADMIN"].includes(user.role))
      return NextResponse.json({ ok: false, message: "게시판 접근 권한 없음" }, { status: 403 });

    const rows = await prisma.resource.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        sizeBytes: true,
        updatedAt: true,
      },
    });

    const resources: ResourceListItem[] = rows.map((r) => ({
      id: r.id,
      type: r.type,
      name: r.title,
      desc: r.description,
      sizeBytes: r.sizeBytes,
      updated: toDateYMD(r.updatedAt),
    }));

    return NextResponse.json({ ok: true, resources });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
  }
}

// 업로드(운영진/관리자만)
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user)
      return NextResponse.json({ ok: false, message: "로그인 필요" }, { status: 401 });
    if (user.status !== "APPROVED")
      return NextResponse.json({ ok: false, message: "승인된 사용자만 업로드 가능" }, { status: 403 });
    if (!["STAFF", "ADMIN"].includes(user.role))
      return NextResponse.json({ ok: false, message: "업로드 권한 없음" }, { status: 403 });

    const form = await req.formData();

    const type = String(form.get("type") ?? "").trim(); // string 확장 가능
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const file = form.get("file");

    if (!type || !title)
      return NextResponse.json({ ok: false, message: "type, title은 필수입니다." }, { status: 400 });

    if (!(file instanceof File))
      return NextResponse.json({ ok: false, message: "파일이 필요합니다." }, { status: 400 });

    // 크기 제한(예: 50MB) - 필요하면 조정
    const MAX_BYTES = 50 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, message: "파일이 너무 큽니다." }, { status: 400 });
    }

    await ensureUploadDir();

    // 안전한 저장명: UUID + (원본 확장자만) 사용
    const originalName = file.name || "file";
    const ext = path.extname(originalName).slice(0, 10); // 확장자 길이 제한
    const storedName = `${randomUUID()}${ext}`;

    // 경로 탈출 방지: 항상 UPLOAD_DIR 밑으로만
    const savePath = path.join(UPLOAD_DIR, storedName);

    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(savePath, buf, { flag: "wx" }); // wx: 이미 있으면 실패(안전)

    const created = await prisma.resource.create({
      data: {
        type,
        title,
        description,
        originalName,
        storedName,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        uploaderId: user.id,
      },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        sizeBytes: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      resource: {
        id: created.id,
        type: created.type,
        name: created.title,
        desc: created.description,
        sizeBytes: created.sizeBytes,
        updated: toDateYMD(created.updatedAt),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
  }
}