// src/app/(sf)/boards/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./boards.module.css";

type Card = {
  tag: "NOTICE" | "RESOURCES" | "GENERAL";
  title: string;
  desc: string;
  href: string;
  iconClass: string; // font-awesome class
  actions: { label: string; href: string; iconClass: string; ghost?: boolean }[];
};

const cards: Card[] = [
  {
    tag: "NOTICE",
    title: "공지사항",
    desc: "시스템 공지/규칙 및 모집 공고, 프로그램 안내 등 공식 안내를 게시합니다.",
    href: "/boards/notice",
    iconClass: "fa-solid fa-bullhorn",
    actions: [
      { label: "이동", href: "/boards/notice", iconClass: "fa-solid fa-arrow-right" },
      { label: "고정공지", href: "/boards/notice#pinned", iconClass: "fa-solid fa-thumbtack", ghost: true },
    ],
  },
  {
    tag: "RESOURCES",
    title: "자료게시판",
    desc: "동아리 지원서, 프로젝트 소개.zip, OT 자료, 동아리 PPT 양식 등 운영 자료를 공유합니다.",
    href: "/boards/resources",
    iconClass: "fa-solid fa-folder-open",
    actions: [
      { label: "이동", href: "/boards/resources", iconClass: "fa-solid fa-arrow-right" },
      { label: "양식", href: "/boards/resources#templates", iconClass: "fa-solid fa-file-lines", ghost: true },
    ],
  },
  {
    tag: "GENERAL",
    title: "일반게시판",
    desc: "기술 글(취약점/Write-up)과 질문 글(Q&A/CTF 팀 모집 등)을 카테고리로 분류하고 검색·필터링합니다.",
    href: "/boards/general",
    iconClass: "fa-solid fa-comments",
    actions: [
      { label: "이동", href: "/boards/general", iconClass: "fa-solid fa-arrow-right" },
      { label: "필터", href: "/boards/general#filters", iconClass: "fa-solid fa-filter", ghost: true },
    ],
  },
];

export default function BoardsHomePage() {
  const router = useRouter();

  const go = (href: string) => {
    router.push(href);
  };

  return (
    <main className={styles.main}>
      <div className={styles.pageTitle}>
        <h1 className={styles.pageTitleH1}>BOARD</h1>
        <p className={styles.pageTitleP}>아래 메뉴에서 원하는 게시판으로 이동하세요.</p>
      </div>

      <div className={styles.sectionHeader}>
        <h2>Board 안내</h2>
        <div className={styles.sectionMeta}>.</div>
      </div>

      <section className={styles.grid} aria-label="Board List">
        {cards.map((c) => (
          <div
            key={c.tag}
            className={styles.itemCard}
            role="link"
            tabIndex={0}
            onClick={() => go(c.href)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                go(c.href);
              }
            }}
          >
            <div className={styles.cardImage}>
              <div className={styles.imgPlaceholder}>
                <i className={c.iconClass} aria-hidden />
              </div>
            </div>

            <div className={styles.cardContent}>
              <span className={styles.cardTag}>
                <span className={styles.dot} />
                {c.tag}
              </span>

              <div className={styles.cardTitle}>{c.title}</div>
              <p className={styles.cardDesc}>{c.desc}</p>

              <div className={styles.cardActions}>
                {c.actions.map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className={`${styles.btn} ${a.ghost ? styles.btnGhost : ""}`}
                    onClick={(e) => e.stopPropagation()} // 카드 전체 클릭과 충돌 방지
                  >
                    <i className={a.iconClass} aria-hidden />
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className={styles.sectionHeader}>
        <h2>권한 정책</h2>
        <div className={styles.sectionMeta}>삭제/관리 권한 안내</div>
      </div>

      <div className={styles.policyWrap}>
        <p className={styles.policyText}>
          • 본인 글: 본인이 수정/삭제 가능
          <br />
          • 운영진/관리자: 모든 게시글 삭제 가능(관리 목적)
          <br />
          • 공지사항의 규칙 공지는 상단 고정으로 운영됩니다.
        </p>
      </div>
    </main>
  );
}
