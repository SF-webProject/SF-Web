//src/app/(sf)/boards/_components/Comments.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "../boards.module.css";

type Me = {
    ok: boolean;
    user?: {
        id: string;
        email: string;
        name: string | null;
        status: "PENDING" | "APPROVED" | null;
        role: "MEMBER" | "STAFF" | "ADMIN" | null;
    };
};

type CommentItem = {
    id: number;
    content: string;
    author: string;
    authorId: string;
    createdAt: string; // ISO
};

function ymdhm(iso: string) {
    const d = new Date(iso);
    if (!Number.isFinite(d.getTime())) return iso;
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${yy}-${mm}-${dd} ${hh}:${mi}`;
}

export default function Comments(props: { target: "post" | "resource"; id: number }) {
    const { target, id } = props;

    const [me, setMe] = useState<Me | null>(null);
    const [loadingMe, setLoadingMe] = useState(true);

    const [items, setItems] = useState<CommentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const user = me?.ok ? me.user : null;
    const isApproved = user?.status === "APPROVED";
    const canWrite = !!user && isApproved;

    const isStaff = user?.role === "STAFF" || user?.role === "ADMIN";
    const canDelete = (c: CommentItem) => {
        if (!user || !isApproved) return false;
        if (isStaff) return true;
        return c.authorId === user.id;
    };

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/auth/me", { cache: "no-store" });
                if (!res.ok) {
                    setMe({ ok: false });
                    return;
                }
                const data = (await res.json()) as Me;
                setMe(data);
            } finally {
                setLoadingMe(false);
            }
        })();
    }, []);

    const load = useCallback(async () => {
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch(`/api/auth/comments?target=${target}&id=${id}`, { cache: "no-store" });
            const data = await res.json().catch(() => null);

            if (!res.ok || !data?.ok) {
                setErr(data?.message ?? "댓글을 불러오지 못했습니다.");
                return;
            }

            setItems((data.comments ?? []) as CommentItem[]);
        } catch (e) {
            console.error(e);
            setErr("댓글을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    }, [target, id]);

    useEffect(() => {
        if (me === null) return;
        const u = me.ok ? me.user : null;
        if (!u || u.status !== "APPROVED") {
            setLoading(false);
            setItems([]);
            setErr(null);
            return;
        }
        load();
    }, [me, load]);

    const onSubmit = async () => {
        if (!canWrite) return;
        const text = content.trim();
        if (!text) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/auth/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ target, id, content: text }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok || !data?.ok) {
                alert(data?.message ?? "댓글 작성 실패");
                return;
            }

            setContent("");
            setItems((prev) => [...prev, data.comment as CommentItem]);
        } finally {
            setSubmitting(false);
        }
    };

    const onDelete = async (commentId: number) => {
        const targetItem = items.find((x) => x.id === commentId);
        if (!targetItem) return;
        if (!canDelete(targetItem)) return;

        const ok = confirm("댓글을 삭제할까요?");
        if (!ok) return;

        const res = await fetch("/api/auth/comments", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: commentId }),
        });

        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok) {
            alert(data?.message ?? "삭제 실패");
            return;
        }

        setItems((prev) => prev.filter((x) => x.id !== commentId));
    };

    const countLabel = useMemo(() => `댓글 (${items.length})`, [items.length]);

    if (loadingMe) return null; // 상세 페이지에서 me 체크를 이미 하고 있으니 조용히

    // 열람 권한 없는 경우는 상세 페이지에서 막히는 구조라 여기선 최소 UI만
    if (!user || user.status !== "APPROVED") return null;

    return (
        <div className={`${styles.boardWrap} ${styles.commentsWrap}`}>
            <div className={styles.commentsHeader}>
                <div className={styles.commentsTitle}>{countLabel}</div>
                <button className={styles.iconBtn} onClick={load} type="button" disabled={loading} title="새로고침">
                    <i className="fa-solid fa-rotate" />
                </button>
            </div>

            <div style={{ marginTop: 12 }}>
                {loading ? (
                    <div className={styles.empty}>댓글 불러오는 중...</div>
                ) : err ? (
                    <div className={styles.empty}>{err}</div>
                ) : !items.length ? (
                    <div className={styles.empty}>첫 댓글을 남겨보세요.</div>
                ) : (
                    <div className={styles.commentsList}>
                        {items.map((c) => (
                            <div key={c.id} className={styles.commentItem}>
                                <div className={styles.commentTop}>
                                    <div className={styles.commentAuthor}>
                                        {c.author}
                                        <span className={styles.commentMeta}>{ymdhm(c.createdAt)}</span>
                                    </div>

                                    {canDelete(c) ? (
                                        <button
                                            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                                            onClick={() => onDelete(c.id)}
                                            title="삭제"
                                            type="button"
                                        >
                                            <i className="fa-solid fa-trash" />
                                        </button>
                                    ) : (
                                        <button className={`${styles.iconBtn} ${styles.iconBtnDisabled}`} disabled title="삭제 권한 없음" type="button">
                                            <i className="fa-solid fa-trash" />
                                        </button>
                                    )}
                                </div>

                                <div className={styles.commentBody}>{c.content}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.commentsForm}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    rows={2}
                    className={styles.commentsTextarea}
                />
                <button
                    className={`${styles.btn} ${styles.commentsSubmitBtn}`}
                    onClick={onSubmit}
                    disabled={!canWrite || submitting}
                    type="button"
                >
                    <i className="fa-solid fa-paper-plane" /> {submitting ? "등록 중..." : "댓글 등록"}
                </button>
            </div>
        </div>
    );
}