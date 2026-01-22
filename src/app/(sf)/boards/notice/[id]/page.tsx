//src/app/(sf)/boards/notice/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../boards.module.css";

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

type NoticeDetail = {
    id: number;
    title: string;
    content: string;
    author: string;
    date: string; // YYYY-MM-DD
    pinned?: boolean;
};

export default function NoticeDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();

    const [me, setMe] = useState<Me | null>(null);
    const [loadingMe, setLoadingMe] = useState(true);

    const [post, setPost] = useState<NoticeDetail | null>(null);
    const [loadingPost, setLoadingPost] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1) 내 정보 확인
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

    // 2) 공지 단건 로딩
    useEffect(() => {
        if (me === null) return;

        const user = me.ok ? me.user : null;

        // 권한 없으면 여기서 종료
        if (!user) {
            setLoadingPost(false);
            setError("이 페이지는 로그인 후 이용 가능합니다.");
            return;
        }
        if (user.status !== "APPROVED") {
            setLoadingPost(false);
            setError(`승인된 계정만 열람할 수 있습니다. (현재: ${user.status})`);
            return;
        }

        const id = params?.id;
        if (!id) {
            setLoadingPost(false);
            setError("유효하지 않은 접근입니다.");
            return;
        }

        setLoadingPost(true);
        setError(null);

        (async () => {
            try {
                const res = await fetch(`/api/auth/boards/notice/${id}`, { cache: "no-store" });
                const data = await res.json().catch(() => null);

                if (!res.ok) {
                    setError(data?.message ?? "공지를 불러오지 못했습니다.");
                    return;
                }

                if (!data?.ok || !data?.post) {
                    setError(data?.message ?? "공지를 불러오지 못했습니다.");
                    return;
                }

                setPost(data.post);
            } catch (e) {
                console.error(e);
                setError("공지를 불러오지 못했습니다.");
            } finally {
                setLoadingPost(false);
            }
        })();
    }, [me, params]);

    // me 로딩 UI
    if (loadingMe) {
        return (
            <main className={styles.main}>
                <div className={styles.pageTitle}>
                    <h1 className={styles.pageTitleH1}>공지사항</h1>
                    <p className={styles.pageTitleP}>권한 확인 중...</p>
                </div>
            </main>
        );
    }

    // 게시글 로딩 UI
    if (loadingPost) {
        return (
            <main className={styles.main}>
                <div className={styles.pageTitle}>
                    <h1 className={styles.pageTitleH1}>공지사항</h1>
                    <p className={styles.pageTitleP}>공지 불러오는 중...</p>
                </div>
            </main>
        );
    }

    // 에러 UI
    if (error) {
        return (
            <main className={styles.main}>
                <div className={styles.pageTitle}>
                    <h1 className={styles.pageTitleH1}>공지사항</h1>
                    <p className={styles.pageTitleP}>{error}</p>
                </div>

                <div className={styles.boardWrap} style={{ padding: 16 }}>
                    <button className={styles.btn} onClick={() => router.push("/boards/notice")} type="button">
                        목록으로
                    </button>
                </div>
            </main>
        );
    }

    if (!post) {
        return (
            <main className={styles.main}>
                <div className={styles.pageTitle}>
                    <h1 className={styles.pageTitleH1}>공지사항</h1>
                    <p className={styles.pageTitleP}>표시할 공지가 없습니다.</p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.pageTitle}>
                <h1 className={styles.pageTitleH1}>공지사항</h1>
                <p className={styles.pageTitleP}>공지 상세</p>
            </div>

            <div className={styles.boardWrap} style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                        <div style={{ fontSize: "1.35rem", fontWeight: 1000, color: "rgba(230, 237, 246, 0.96)" }}>
                            {post.title}
                        </div>
                        <div style={{ marginTop: 8, color: "rgba(154, 164, 178, 0.92)", fontSize: "0.95rem" }}>
                            작성자: {post.author} · 작성일: {post.date}
                            {post.pinned ? " · 고정" : ""}
                        </div>
                    </div>

                    <button className={styles.btn} onClick={() => router.push("/boards/notice")} type="button">
                        목록으로
                    </button>
                </div>

                <div style={{ marginTop: 18, height: 1, background: "rgba(255, 255, 255, 0.10)" }} />

                <div
                    style={{
                        marginTop: 18,
                        color: "rgba(230, 237, 246, 0.90)",
                        lineHeight: 1.75,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                    }}
                >
                    {post.content}
                </div>
            </div>
        </main>
    );
}