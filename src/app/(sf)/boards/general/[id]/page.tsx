//src/app/(sf)/boards/general/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../boards.module.css";
import Comments from "../../_components/Comments";

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

type Post = {
    id: number;
    category: "기술 글" | "질문 글" | "기타";
    title: string;
    content: string;
    author: string;
    date: string;
};

export default function BoardGeneralDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const idStr = params?.id;

    const [me, setMe] = useState<Me | null>(null);
    const [loadingMe, setLoadingMe] = useState(true);

    const [post, setPost] = useState<Post | null>(null);
    const [loadingPost, setLoadingPost] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1) me 조회
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

    // 2) 권한 OK면 단건 조회
    useEffect(() => {
        if (me === null) return;

        const user = me.ok ? me.user : null;
        if (!user) {
            setLoadingPost(false);
            setError("이 페이지는 로그인 후 이용 가능합니다.");
            return;
        }
        if (user.status !== "APPROVED") {
            setLoadingPost(false);
            setError(`승인된 계정만 게시글을 열람할 수 있습니다. (현재: ${user.status})`);
            return;
        }

        const id = Number(idStr);
        if (!id || Number.isNaN(id)) {
            setLoadingPost(false);
            setError("유효하지 않은 게시글 id 입니다.");
            return;
        }

        setLoadingPost(true);
        setError(null);

        (async () => {
            try {
                const res = await fetch(`/api/auth/boards/general/${id}`, { cache: "no-store" });
                const data = await res.json().catch(() => null);

                if (!res.ok || !data?.ok) {
                    setError(data?.message ?? "게시글을 불러오지 못했습니다.");
                    return;
                }

                setPost(data.post as Post);
            } catch (e) {
                console.error(e);
                setError("게시글을 불러오지 못했습니다.");
            } finally {
                setLoadingPost(false);
            }
        })();
    }, [me, idStr]);

    if (loadingMe) {
        return (
            <main className={styles.main}>
                <div className={styles.pageTitle}>
                    <h1 className={styles.pageTitleH1}>게시글</h1>
                    <p className={styles.pageTitleP}>권한 확인 중...</p>
                </div>
            </main>
        );
    }

    if (loadingPost) {
        return (
            <main className={styles.main}>
                <div className={styles.pageTitle}>
                    <h1 className={styles.pageTitleH1}>게시글</h1>
                    <p className={styles.pageTitleP}>게시글 불러오는 중...</p>
                </div>
            </main>
        );
    }

    if (error || !post) {
        return (
            <main className={styles.main}>
                <div className={styles.pageTitle}>
                    <h1 className={styles.pageTitleH1}>게시글</h1>
                    <p className={styles.pageTitleP}>{error ?? "게시글이 없습니다."}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                    <button className={styles.btn} onClick={() => router.push("/boards/general")} type="button">
                        목록으로
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.pageTitle}>
                <h1 className={styles.pageTitleH1}>{post.title}</h1>
                <p className={styles.pageTitleP}>
                    {post.category} · {post.author} · {post.date}
                </p>
            </div>

            <div className={styles.boardWrap} style={{ padding: 18 }}>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, color: "rgba(230,237,246,0.92)" }}>
                    {post.content}
                </div>
            </div>
            <div className={styles.commentsSection}>
                <Comments target="post" id={post.id} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18 }}>
                <button className={styles.btn} onClick={() => router.push("/boards/general")} type="button">
                    목록으로
                </button>
            </div>
        </main>
    );
}