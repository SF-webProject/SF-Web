//src/app/(sf)/admin/approvals/page.tsx
import styles from "../../sf.module.css";
import my from "../../mypage/mypage.module.css";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ApprovalsClient from "./approvalsClient";

export default async function ApprovalsPage() {
    const me = await getCurrentUser();
    if (!me) redirect("/login");

    if (me.status !== "APPROVED" || me.role !== "ADMIN") {
        redirect("/mypage");
    }

    const users = await prisma.user.findMany({
        where: { status: "PENDING" },
        orderBy: { email: "asc" },
        select: { id: true, email: true, name: true, status: true, role: true },
    });

    return (
        <main className={styles.container} style={{ paddingTop: 110 }}>
            <h1 className={styles.sectionTitle}>가입 승인</h1>

            <div className={my.panel} style={{ marginTop: 18 }}>
                <div className={my.panelHead}>
                    <div>
                        <h2 className={my.panelTitle}>승인 대기 계정</h2>
                        <p className={my.panelSub}>ADMIN만 승인할 수 있습니다.</p>
                    </div>
                </div>

                <ApprovalsClient initialUsers={users} />
            </div>
        </main>
    );
}