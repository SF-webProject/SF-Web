// src/app/(sf)/boards/general/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../boards.module.css";

type Me = {
    ok: boolean;
    user?: {
        id: string;
        email: string;
        name: string | null;
        status: "PENDING" | "APPROVED" | "REJECTED" | null;
        role: "MEMBER" | "STAFF" | "ADMIN" | null;
    };
};

type Post = {
    id: number;
    category: "기술 글" | "질문 글";
    title: string;
    content: string;
    author: string;
    date: string; // YYYY-MM-DD
};

export default function BoardGeneralPage() {
    const [me, setMe] = useState<Me | null>(null);
    const [loadingMe, setLoadingMe] = useState(true);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<"all" | Post["category"]>("all");
    const [sort, setSort] = useState<"new" | "old">("new");

    const [posts, setPosts] = useState<Post[]>([
        { id: 101, category: "기술 글", title: "CVE-2024-XXXX 분석:", content: "Ubuntu 22.04.", author: "정정정", date: "2026-01-11" },
        { id: 102, category: "질문 글", title: "이 문제 너무 어렵습니다. 도와주세요", content: "안 먹히는데 원인이 뭘까요?", author: "김김김", date: "2026-01-10" },
        { id: 103, category: "질문 글", title: "CTF 같이 나가실 분", content: "주말 온라인 CTF 팀원 구합니다. 웹/리버싱 환영.", author: "이이이", date: "2026-01-09" },
        { id: 104, category: "기술 글", title: "취약점 기술 글 업로드 가이드", content: "요약/참고 링크를 포함해주세요.", author: "운영진", date: "2026-01-05" },
    ]);

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

    const user = me?.ok ? me.user : null;
    const isApproved = user?.status === "APPROVED";

    // Hook들은 조기 return보다 위에서 항상 호출되어야 함
    const roleLabel = useMemo(() => {
        if (!user) return "비로그인";
        if (user.role === "ADMIN") return "관리자";
        if (user.role === "STAFF") return "운영진";
        return "일반";
    }, [user]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        let arr = posts.filter((p) => {
            if (category !== "all" && p.category !== category) return false;
            if (!q) return true;
            return (p.title + " " + p.content + " " + p.author).toLowerCase().includes(q);
        });

        arr = arr.slice().sort((a, b) => {
            if (sort === "new") return b.date.localeCompare(a.date);
            return a.date.localeCompare(b.date);
        });

        return arr;
    }, [posts, search, category, sort]);

    const canWrite = !!user && isApproved; // 부원은 공지 제외 글 작성 가능 = general은 허용

    // 로딩 중: 보호된 목록을 렌더하지 않아서 깜빡임 제거
    if (loadingMe) {
        return (
            <main className={styles.main}>
                <div className={styles.pageTitle}>
                    <h1 className={styles.pageTitleH1}>일반게시판</h1>
                    <p className={styles.pageTitleP}>권한 확인 중...</p>
                </div>
            </main>
        );
    }

    // 로딩 완료 후: 로그인/승인 여부로 차단
    if (!user) {
        return (
            <main className={styles.main}>
                <div className={styles.pageTitle}>
                    <h1 className={styles.pageTitleH1}>일반게시판</h1>
                    <p className={styles.pageTitleP}>이 페이지는 로그인 후 이용 가능합니다.</p>
                </div>
            </main>
        );
    }

    if (user.status !== "APPROVED") {
        return (
            <main className={styles.main}>
                <div className={styles.pageTitle}>
                    <h1 className={styles.pageTitleH1}>일반게시판</h1>
                    <p className={styles.pageTitleP}>
                        승인된 계정만 게시판을 열람할 수 있습니다. (현재: {user.status})
                    </p>
                </div>
            </main>
        );
    }

    const canDelete = (post: Post) => {
        if (!user || !isApproved) return false;
        if (user.role === "ADMIN" || user.role === "STAFF") return true;
        const myName = user.name ?? user.email;
        return post.author === myName;
    };

    const tagForCategory = (cat: Post["category"]) => {
        if (cat === "기술 글") {
            return (
                <span className={`${styles.tag} ${styles.tagNotice}`}>
                    <i className="fa-solid fa-code" /> 기술 글
                </span>
            );
        }
        return (
            <span className={`${styles.tag} ${styles.tagQna}`}>
                <i className="fa-solid fa-circle-question" /> 질문 글
            </span>
        );
    };

    const onDelete = (id: number) => {
        const target = posts.find((p) => p.id === id);
        if (!target) return;
        if (!canDelete(target)) return;

        const ok = confirm("정말로 이 글을 삭제할까요?");
        if (!ok) return;

        setPosts((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <main className={styles.main}>
            <div className={styles.pageTitle}>
                <h1 className={styles.pageTitleH1}>일반게시판</h1>
                <p className={styles.pageTitleP}>기술 글과 질문 글을 카테고리로 구분하고 검색·필터링합니다.</p>
            </div>

            <div className={styles.sectionHeader} id="filters">
                <h2>글 목록</h2>
                <div className={styles.sectionMeta}>카테고리 필터 · 검색 · 정렬</div>
            </div>

            <div className={styles.boardWrap}>
                <div className={styles.toolbar}>
                    <div className={styles.toolbarLeft}>
                        <div className={styles.field} title="제목/내용 검색">
                            <i className={`fa-solid fa-magnifying-glass ${styles.fieldIcon}`} />
                            <input
                                className={styles.fieldInput}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="검색 (제목/내용/작성자)"
                            />
                        </div>

                        <select
                            className={styles.select}
                            value={category}
                            onChange={(e) => setCategory(e.target.value as "all" | Post["category"])}
                            aria-label="카테고리 필터">
                            <option value="all">전체 카테고리</option>
                            <option value="기술 글">기술 글</option>
                            <option value="질문 글">질문 글</option>
                        </select>

                        <select
                            className={styles.select}
                            value={sort}
                            onChange={(e) => setSort(e.target.value as "new" | "old")}
                            aria-label="정렬">
                            <option value="new">최신순</option>
                            <option value="old">오래된순</option>
                        </select>

                        <span className={styles.pill}>
                            권한: <b className={styles.pillStrong}>{roleLabel}</b>
                        </span>
                    </div>

                    <div className={styles.toolbarRight} id="write">
                        <button
                            className={styles.btn}
                            onClick={() => alert("데모 화면입니다. 실제 구현 시 글쓰기/에디터/카테고리 강제/권한 검증을 백엔드와 연동하세요.")}
                            disabled={!canWrite}
                            style={!canWrite ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                            type="button"
                        >
                            <i className="fa-solid fa-pen-to-square" /> 글쓰기
                        </button>
                    </div>
                </div>

                <table className={styles.list} aria-label="General Posts">
                    <thead>
                        <tr>
                            <th className={styles.listHeadTh} style={{ width: 160 }}>카테고리</th>
                            <th className={styles.listHeadTh}>제목</th>
                            <th className={styles.listHeadTh} style={{ width: 160 }}>작성자</th>
                            <th className={styles.listHeadTh} style={{ width: 120 }}>작성일</th>
                            <th className={styles.listHeadTh} style={{ width: 130, textAlign: "right" }}>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((p) => (
                            <tr key={p.id} className={styles.listRow}>
                                <td className={styles.listBodyTd}>{tagForCategory(p.category)}</td>
                                <td className={styles.listBodyTd}>
                                    <a className={styles.titleLink} href="#">
                                        {p.title}
                                    </a>
                                    <div className={styles.subtext}>{p.content}</div>
                                </td>
                                <td className={styles.listBodyTd}>{p.author}</td>
                                <td className={styles.listBodyTd}>{p.date}</td>
                                <td className={styles.listBodyTd}>
                                    <div className={styles.actions}>
                                        {canDelete(p) ? (
                                            <button
                                                className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                                                onClick={() => onDelete(p.id)}
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!filtered.length && <div className={styles.empty}>조건에 맞는 글이 없습니다.</div>}
            </div>
        </main>
    );
}
