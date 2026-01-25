//src/app/(sf)/admin/approvals/approvalsClient.tsx
"use client";

import { useState } from "react";
import styles from "./approvalsClient.module.css";

type Row = {
    id: string;
    email: string;
    name: string | null;
    status: string | null;
    role: string | null;
};

export default function ApprovalsClient(props: { initialUsers: Row[] }) {
    const [rows, setRows] = useState<Row[]>(props.initialUsers);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [msg, setMsg] = useState<string | null>(null);

    async function refresh() {
        const res = await fetch("/api/auth/admin/pending-users", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data?.ok) setRows(data.users ?? []);
    }

    async function approve(userId: string) {
        setMsg(null);
        setLoadingId(userId);

        try {
            const res = await fetch("/api/auth/admin/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data?.ok) {
                setMsg(data?.message ?? "승인 실패");
                return;
            }

            await refresh();
            setMsg("승인 완료");
        } catch {
            setMsg("서버 오류");
        } finally {
            setLoadingId(null);
        }
    }

    async function remove(userId: string) {
        setMsg(null);
        setLoadingId(userId);

        try {
            const res = await fetch("/api/auth/admin/delete-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data?.ok) {
                setMsg(data?.message ?? "삭제 실패");
                return;
            }

            await refresh();
            setMsg("삭제 완료");
        } catch {
            setMsg("서버 오류");
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <div className={styles.wrap}>
            {rows.length === 0 ? (
                <div className={styles.empty}>승인 대기 계정이 없습니다.</div>
            ) : (
                <ul className={styles.list}>
                    {rows.map((u) => (
                        <li key={u.id} className={styles.item}>
                            <div className={styles.left}>
                                <div className={styles.name}>{u.name ?? "이름 없음"}</div>
                                <div className={styles.email}>{u.email}</div>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    className={styles.button}
                                    disabled={loadingId === u.id}
                                    onClick={() => approve(u.id)}
                                >
                                    {loadingId === u.id ? "처리중..." : "승인"}
                                </button>

                                <button
                                    className={`${styles.button} ${styles.dangerButton}`}
                                    disabled={loadingId === u.id}
                                    onClick={() => {
                                        const ok = confirm("정말 삭제하시겠습니까? (되돌릴 수 없습니다)");
                                        if (ok) remove(u.id);
                                    }}
                                >
                                    {loadingId === u.id ? "처리중..." : "삭제"}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {msg && <div className={styles.msg}>{msg}</div>}
        </div>
    );
}