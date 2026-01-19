// src/lib/auth.ts
import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return null;

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const session = await prisma.session.findUnique({
        where: { tokenHash },
        include: { user: true },
    });

    if (!session) return null;

    // 만료 처리
    if (session.expiresAt.getTime() < Date.now()) {
        await prisma.session.deleteMany({ where: { tokenHash } });
        return null;
    }

    return session.user;
}