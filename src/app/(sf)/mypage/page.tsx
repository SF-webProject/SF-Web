// src/app/(sf)/mypage/page.tsx
import styles from "../sf.module.css";
import my from "./mypage.module.css";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { BoardType, PostCategory } from "@prisma/client";

function boardText(board: BoardType) {
    if (board === "NOTICE") return "공지사항";
    if (board === "RESOURCE") return "자료게시판";
    if (board === "GENERAL") return "일반게시판";
    return "게시판";
}

function categoryText(category: PostCategory | null | undefined) {
    if (category === "TECH") return "기술글";
    if (category === "QNA") return "질문글";
    return null;
}

function postHref(board: BoardType, id: number) {
    if (board === "NOTICE") return `/boards/notice/${id}`;
    if (board === "RESOURCE") return `/boards/resources/${id}`;
    return `/boards/general/${id}`;
}

function resourceHref(id: number) {
    return `/boards/resources/${id}`;
}

function formatDate(d: Date) {
    return new Intl.DateTimeFormat("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    }).format(d);
}

export default async function MyPage() {
    const me = await getCurrentUser();
    if (!me) redirect("/login");

    const canSeeResources = me.role === "ADMIN" || me.role === "STAFF";

    const [postCount, commentCount] = await Promise.all([
        prisma.post.count({ where: { authorId: me.id, deletedAt: null } }),
        prisma.comment.count({ where: { authorId: me.id, deletedAt: null } }),
    ]);

    const resourceCount = canSeeResources
        ? await prisma.resource.count({ where: { uploaderId: me.id } })
        : 0;

    const [recentPosts, recentComments] = await Promise.all([
        prisma.post.findMany({
            where: { authorId: me.id, deletedAt: null },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: { id: true, title: true, board: true, category: true, createdAt: true },
        }),
        prisma.comment.findMany({
            where: { authorId: me.id, deletedAt: null },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                content: true,
                createdAt: true,
                post: { select: { id: true, title: true, board: true, category: true } },
                resource: { select: { id: true, title: true, type: true } },
            },
        }),
    ]);

    const recentResources = canSeeResources
        ? await prisma.resource.findMany({
            where: { uploaderId: me.id },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: { id: true, title: true, type: true, createdAt: true },
        })
        : [];

    const statusText = me.status === "PENDING" ? "승인대기" : "승인완료";
    const roleText = me.role === "ADMIN" ? "관리자" : me.role === "STAFF" ? "운영진" : "부원";

    return (
        <main className={styles.container} style={{ paddingTop: 110 }}>
            <h1 className={styles.sectionTitle}>마이페이지</h1>

            {/* 승인 대기 안내 */}
            {me.status === "PENDING" && (
                <div className={my.panel} style={{ marginTop: 18 }}>
                    <div className={my.panelHead}>
                        <div>
                            <h2 className={my.panelTitle}>계정 상태</h2>
                            <p className={my.panelSub}>관리자 승인이 완료되면 정식 기능을 이용할 수 있습니다.</p>
                        </div>
                        <div className={my.badgeRow}>
                            <span className={`${my.badge} ${my.badgeDanger}`}>승인 대기</span>
                        </div>
                    </div>
                </div>
            )}

            {/* 프로필 */}
            <div className={my.panel} style={{ marginTop: 18 }}>
                <div className={my.panelHead}>
                    <div>
                        <h2 className={my.panelTitle}>내 정보</h2>
                        <p className={my.panelSub}>로그인 계정과 권한 정보를 확인합니다.</p>
                    </div>
                    <div className={my.badgeRow}>
                        <span className={my.badge}>{statusText}</span>
                        <span className={my.badge}>{roleText}</span>
                    </div>
                </div>

                <div className={my.profileLine}>
                    <div className={my.profileName}>{me.name ?? "이름 없음"}</div>
                    <div className={my.profileEmail}>{me.email}</div>
                </div>
            </div>

            {/* 활동 요약 */}
            <div className={my.statsGrid}>
                <div className={my.statCard}>
                    <p className={my.statLabel}>작성 글</p>
                    <p className={my.statValue}>{postCount}</p>
                </div>

                <div className={my.statCard}>
                    <p className={my.statLabel}>작성 댓글</p>
                    <p className={my.statValue}>{commentCount}</p>
                </div>

                {/* 부원은 업로드 권한이 없으니, 운영진/관리자에게만 보이게 */}
                {canSeeResources && (
                    <div className={my.statCard}>
                        <p className={my.statLabel}>업로드 자료</p>
                        <p className={my.statValue}>{resourceCount}</p>
                    </div>
                )}
            </div>

            {/* 최근 활동 */}
            <div className={my.activityGrid}>
                {/* 최근 작성 글 */}
                <div className={`${my.panel} ${my.col6}`}>
                    <div className={my.panelHead}>
                        <div>
                            <h2 className={my.panelTitle}>최근 작성 글</h2>
                            <p className={my.panelSub}>게시판/카테고리 기준으로 정리됩니다.</p>
                        </div>
                    </div>

                    <ul className={my.list}>
                        {recentPosts.map((p) => {
                            const b = boardText(p.board);
                            const cat = p.board === "GENERAL" ? categoryText(p.category) : null;
                            const date = formatDate(p.createdAt);
                            const href = postHref(p.board, p.id);

                            return (
                                <li key={p.id} className={my.item}>
                                    <div className={my.itemTop}>
                                        <div className={my.pills}>
                                            <span className={`${my.pill} ${my.pillAccent}`}>{b}</span>
                                            {cat && <span className={`${my.pill} ${my.pillBlue}`}>{cat}</span>}
                                        </div>
                                        <span className={my.date}>{date}</span>
                                    </div>

                                    <div className={my.title}>
                                        <Link href={href} style={{ textDecoration: "none" }}>
                                            {p.title}
                                        </Link>
                                    </div>
                                </li>
                            );
                        })}
                        {recentPosts.length === 0 && <div className={my.empty}>없음</div>}
                    </ul>
                </div>

                {/* 최근 댓글 */}
                <div className={`${my.panel} ${my.col6}`}>
                    <div className={my.panelHead}>
                        <div>
                            <h2 className={my.panelTitle}>최근 댓글</h2>
                            <p className={my.panelSub}>댓글이 달린 대상(게시판)을 함께 표시합니다.</p>
                        </div>
                    </div>

                    <ul className={my.list}>
                        {recentComments.map((c) => {
                            const date = formatDate(c.createdAt);

                            // 댓글 대상 라벨 + 링크 구성
                            let targetBoardLabel = "대상 없음";
                            let targetTitle = "대상 없음";
                            let targetCategory: string | null = null;
                            let href: string | null = null;

                            if (c.post) {
                                targetBoardLabel = boardText(c.post.board);
                                targetTitle = c.post.title;
                                targetCategory = c.post.board === "GENERAL" ? categoryText(c.post.category) : null;
                                href = postHref(c.post.board, c.post.id);
                            } else if (c.resource) {
                                targetBoardLabel = "자료게시판";
                                targetTitle = c.resource.title;
                                href = resourceHref(c.resource.id);
                            }

                            return (
                                <li key={c.id} className={my.item}>
                                    <div className={my.itemTop}>
                                        <div className={my.pills}>
                                            <span className={`${my.pill} ${my.pillAccent}`}>{targetBoardLabel}</span>
                                            {targetCategory && (
                                                <span className={`${my.pill} ${my.pillBlue}`}>{targetCategory}</span>
                                            )}
                                        </div>
                                        <span className={my.date}>{date}</span>
                                    </div>

                                    <div className={my.title}>
                                        {href ? (
                                            <Link href={href} style={{ textDecoration: "none" }}>
                                                {targetTitle}
                                            </Link>
                                        ) : (
                                            targetTitle
                                        )}
                                    </div>

                                    <div className={my.snippet}>{c.content}</div>
                                </li>
                            );
                        })}
                        {recentComments.length === 0 && <div className={my.empty}>없음</div>}
                    </ul>
                </div>

                {/* 최근 업로드 자료: 운영진/관리자만 */}
                {canSeeResources && (
                    <div className={`${my.panel} ${my.col12}`}>
                        <div className={my.panelHead}>
                            <div>
                                <h2 className={my.panelTitle}>최근 업로드 자료</h2>
                                <p className={my.panelSub}>운영진/관리자 권한 사용자에게만 표시됩니다.</p>
                            </div>
                        </div>

                        <ul className={my.list}>
                            {recentResources.map((r) => (
                                <li key={r.id} className={my.item}>
                                    <div className={my.itemTop}>
                                        <div className={my.pills}>
                                            <span className={`${my.pill} ${my.pillAccent}`}>자료게시판</span>
                                            <span className={`${my.pill} ${my.pillBlue}`}>{r.type}</span>
                                        </div>
                                        <span className={my.date}>{formatDate(r.createdAt)}</span>
                                    </div>

                                    <div className={my.title}>
                                        <Link href={resourceHref(r.id)} style={{ textDecoration: "none" }}>
                                            {r.title}
                                        </Link>
                                    </div>
                                </li>
                            ))}
                            {recentResources.length === 0 && <div className={my.empty}>없음</div>}
                        </ul>
                    </div>
                )}
            </div>
        </main>
    );
}