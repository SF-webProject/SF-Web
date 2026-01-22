//src/app/api/auth/boards/resources/download/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import path from "path";
import { promises as fs } from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "resources");

function safeFilename(name: string) {
    // 헤더용 파일명 간단 정리 (따옴표/개행 제거)
    return name.replace(/[\r\n"]/g, "").trim() || "download";
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();

        if (!user)
            return NextResponse.json({ ok: false, message: "로그인 필요" }, { status: 401 });
        if (user.status !== "APPROVED")
            return NextResponse.json({ ok: false, message: "승인된 사용자만 다운로드 가능" }, { status: 403 });
        if (!["MEMBER", "STAFF", "ADMIN"].includes(user.role))
            return NextResponse.json({ ok: false, message: "다운로드 권한 없음" }, { status: 403 });

        const { id: idStr } = await ctx.params;
        const id = Number(idStr);
        if (!id || Number.isNaN(id)) {
            return NextResponse.json({ ok: false, message: "유효하지 않은 id 입니다." }, { status: 400 });
        }

        const r = await prisma.resource.findFirst({
            where: { id },
            select: {
                storedName: true,
                originalName: true,
                mimeType: true,
            },
        });

        if (!r) {
            return NextResponse.json({ ok: false, message: "자료를 찾을 수 없습니다." }, { status: 404 });
        }

        // 저장 파일은 무조건 UPLOAD_DIR 하위의 storedName으로만 접근
        const filePath = path.join(UPLOAD_DIR, r.storedName);

        const buf = await fs.readFile(filePath).catch(() => null);
        if (!buf) {
            return NextResponse.json({ ok: false, message: "파일이 서버에 존재하지 않습니다." }, { status: 404 });
        }

        const filename = safeFilename(r.originalName);

        return new NextResponse(buf, {
            status: 200,
            headers: {
                "Content-Type": r.mimeType || "application/octet-stream",
                "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
            },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, message: "서버 오류" }, { status: 500 });
    }
}