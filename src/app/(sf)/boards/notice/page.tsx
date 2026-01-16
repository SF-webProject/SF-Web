//src/app/(sf)/boards/notice/page.tsx

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

type Notice = {
  id: number;
  type: string;
  title: string;
  content: string;
  author: string;
  date: string;
  pinned?: boolean;
};

export default function BoardNoticePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [q, setQ] = useState("");

  const [pinnedNotices, setPinnedNotices] = useState<Notice[]>([
    {
      id: 1,
      type: "규칙",
      title: "게시판 이용 규칙 (필독)",
      content: "욕설/비방/불법자료 업로드 금지. 기술 글은 출처/재현환경을 명시해주세요.",
      author: "운영진",
      date: "2026-01-02",
      pinned: true,
    },
    {
      id: 2,
      type: "시스템",
      title: "계정/권한 정책 안내",
      content: "운영진/관리자는 모든 게시글 삭제 권한이 있습니다. 본인 글은 본인이 삭제할 수 있습니다.",
      author: "관리자",
      date: "2026-01-03",
      pinned: true,
    },
  ]);

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 11,
      type: "모집",
      title: "25-2 신입 부원 모집 공고",
      content: "지원서 제출: 2/10(화) 23:59까지. 면접: 2/15(일) 예정.",
      author: "운영진",
      date: "2026-01-08",
    },
    {
      id: 12,
      type: "안내",
      title: "OT 일정 및 장소 안내",
      content: "OT: 2/20(금) 19:00, 공학관 3층 세미나실.",
      author: "운영진",
      date: "2026-01-10",
    },
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

  const roleLabel = useMemo(() => {
    if (!user) return "비로그인";
    if (user.role === "ADMIN") return "관리자";
    if (user.role === "STAFF") return "운영진";
    return "일반";
  }, [user]);

  const isApproved = user?.status === "APPROVED";
  const canWriteNotice = !!user && isApproved && (user.role === "ADMIN" || user.role === "STAFF");

  const canDelete = (post: Notice) => {
    if (!user || !isApproved) return false;
    if (user.role === "ADMIN" || user.role === "STAFF") return true;
    const myName = user.name ?? user.email;
    return post.author === myName;
  };

  const match = (n: Notice) => {
    const qq = q.trim().toLowerCase();
    if (!qq) return true;
    return (n.title + " " + n.content).toLowerCase().includes(qq);
  };

  const pinnedFiltered = useMemo(() => pinnedNotices.filter(match), [pinnedNotices, q]);
  const noticesFiltered = useMemo(() => notices.filter(match), [notices, q]);

  const onDelete = (id: number, pinned: boolean) => {
    const list = pinned ? pinnedNotices : notices;
    const target = list.find((x) => x.id === id);
    if (!target) return;
    if (!canDelete(target)) return;

    const ok = confirm("정말로 이 공지를 삭제할까요?");
    if (!ok) return;

    if (pinned) setPinnedNotices((prev) => prev.filter((x) => x.id !== id));
    else setNotices((prev) => prev.filter((x) => x.id !== id));
  };

  if (!loadingMe) {
    if (!user) {
      return (
        <main className={styles.main}>
          <div className={styles.pageTitle}>
            <h1 className={styles.pageTitleH1}>공지사항</h1>
            <p className={styles.pageTitleP}>이 페이지는 로그인 후 이용 가능합니다.</p>
          </div>
        </main>
      );
    }
    if (user.status !== "APPROVED") {
      return (
        <main className={styles.main}>
          <div className={styles.pageTitle}>
            <h1 className={styles.pageTitleH1}>공지사항</h1>
            <p className={styles.pageTitleP}>승인된 계정만 게시판을 열람할 수 있습니다. (현재: {user.status})</p>
          </div>
        </main>
      );
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.pageTitle}>
        <h1 className={styles.pageTitleH1}>공지사항</h1>
        <p className={styles.pageTitleP}>게시판 규칙 및 안내용 공지를 게시합니다.</p>
      </div>

      <div className={styles.sectionHeader} id="pinned">
        <h2>고정 공지</h2>
        <div className={styles.sectionMeta}>상단 고정 · 규칙/필수 안내</div>
      </div>

      <div className={styles.boardWrap} id="rules">
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <div className={styles.field} title="제목/내용 검색">
              <i className={`fa-solid fa-magnifying-glass ${styles.fieldIcon}`} />
              <input
                className={styles.fieldInput}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="공지사항 검색 (제목/내용)"
              />
            </div>
            <span className={styles.pill}>
              권한: <b className={styles.pillStrong}>{roleLabel}</b>
            </span>
          </div>

          <div className={styles.toolbarRight}>
            <button
              className={styles.btn}
              onClick={() => alert("데모 화면입니다. 실제 구현 시 글쓰기/권한 검증을 백엔드와 연동하세요.")}
              disabled={!canWriteNotice}
              style={!canWriteNotice ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
              type="button"
            >
              <i className="fa-solid fa-plus" /> 공지 작성
            </button>
          </div>
        </div>

        <table className={styles.list} aria-label="Pinned Notices">
          <thead>
            <tr>
              <th className={styles.listHeadTh} style={{ width: 140 }}>구분</th>
              <th className={styles.listHeadTh}>제목</th>
              <th className={styles.listHeadTh} style={{ width: 160 }}>작성자</th>
              <th className={styles.listHeadTh} style={{ width: 120 }}>작성일</th>
              <th className={styles.listHeadTh} style={{ width: 130, textAlign: "right" }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {pinnedFiltered.map((n) => (
              <tr key={n.id} className={styles.listRow}>
                <td className={styles.listBodyTd}>
                  <span className={`${styles.tag} ${styles.tagPin}`}>
                    <i className="fa-solid fa-thumbtack" /> 고정
                  </span>
                </td>
                <td className={styles.listBodyTd}>
                  <a className={styles.titleLink} href="#">
                    {n.title}
                  </a>
                  <div className={styles.subtext}>{n.content}</div>
                </td>
                <td className={styles.listBodyTd}>{n.author}</td>
                <td className={styles.listBodyTd}>{n.date}</td>
                <td className={styles.listBodyTd}>
                  <div className={styles.actions}>
                    {canDelete(n) ? (
                      <button
                        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                        onClick={() => onDelete(n.id, true)}
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

        {!pinnedFiltered.length && <div className={styles.empty}>고정 공지가 없습니다.</div>}
      </div>

      <div className={styles.sectionHeader} style={{ marginTop: 38 }}>
        <h2>안내 공지</h2>
        <div className={styles.sectionMeta}>모집 공고 · 프로그램 안내</div>
      </div>

      <div className={styles.boardWrap}>
        <table className={styles.list} aria-label="Announcements">
          <thead>
            <tr>
              <th className={styles.listHeadTh} style={{ width: 140 }}>구분</th>
              <th className={styles.listHeadTh}>제목</th>
              <th className={styles.listHeadTh} style={{ width: 160 }}>작성자</th>
              <th className={styles.listHeadTh} style={{ width: 120 }}>작성일</th>
              <th className={styles.listHeadTh} style={{ width: 130, textAlign: "right" }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {noticesFiltered.map((n) => (
              <tr key={n.id} className={styles.listRow}>
                <td className={styles.listBodyTd}>
                  <span className={`${styles.tag} ${styles.tagNotice}`}>
                    <i className="fa-solid fa-bullhorn" /> {n.type}
                  </span>
                </td>
                <td className={styles.listBodyTd}>
                  <a className={styles.titleLink} href="#">
                    {n.title}
                  </a>
                  <div className={styles.subtext}>{n.content}</div>
                </td>
                <td className={styles.listBodyTd}>{n.author}</td>
                <td className={styles.listBodyTd}>{n.date}</td>
                <td className={styles.listBodyTd}>
                  <div className={styles.actions}>
                    {canDelete(n) ? (
                      <button
                        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                        onClick={() => onDelete(n.id, false)}
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

        {!noticesFiltered.length && <div className={styles.empty}>표시할 공지가 없습니다.</div>}
      </div>
    </main>
  );
}
