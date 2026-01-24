// src/components/AuthHeader.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./AuthHeader.module.css";
import Image from "next/image";
import type React from "react";

type MeUser = {
    id: string;
    email: string;
    name?: string | null;
    status?: "PENDING" | "APPROVED" | "REJECTED" | null;
    role?: "MEMBER" | "STAFF" | "ADMIN" | null;
};

function getDisplayName(u: MeUser) {
    if (u.name && u.name.trim()) return u.name.trim();
    const at = u.email.indexOf("@");
    return at > 0 ? u.email.slice(0, at) : u.email;
}

function getBadgeText(u: MeUser) {
    if (u.status === "PENDING") return "승인대기";
    if (u.status === "REJECTED") return "승인거절";

    // APPROVED(또는 status가 없을 때)에는 role로 표시
    if (u.role === "ADMIN") return "관리자";
    if (u.role === "STAFF") return "운영진";
    if (u.role === "MEMBER") return "부원";

    // 정보가 덜 내려오는 경우 fallback
    return "부원";
}

export default function AuthHeader() {
    const pathname = usePathname() ?? "";
    // pathname이 바뀌면 리마운트 -> openKey가 초기값(null)로 자동 초기화
    return <AuthHeaderInner key={pathname} />;
}

function AuthHeaderInner() {
    const headerRef = useRef<HTMLElement | null>(null);
    const [openKey, setOpenKey] = useState<string | null>(null);
    const [me, setMe] = useState<MeUser | null>(null);

    const toggleDropdown =
        (key: string, _href: string) => (e: React.MouseEvent) => {
            void _href; // lint unused 방지

            // 1번째 클릭: 드롭다운 열기
            // 2번째 클릭(이미 열려있을 때): 그대로 링크 이동(모바일 UX용)
            if (openKey === key) return; // 링크 이동을 원하면 아래 2줄로 교체
            // if (openKey === key) { window.location.href = _href; return; }

            e.preventDefault();
            setOpenKey((prev) => (prev === key ? null : key));
        };

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            const target = e.target as Node | null;
            if (!target) return;

            if (headerRef.current && !headerRef.current.contains(target)) {
                setOpenKey(null);
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpenKey(null);
        };

        document.addEventListener("click", onDocClick);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("click", onDocClick);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                const res = await fetch("/api/auth/me", { cache: "no-store" });
                if (!alive) return;

                if (!res.ok) {
                    setMe(null);
                    return;
                }

                const data = await res.json();
                setMe((data?.user as MeUser) ?? null);
            } catch {
                if (!alive) return;
                setMe(null);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    return (
        <header ref={headerRef} className={styles.header}>
            <div className={styles.logoContainer}>
                <Link href="/" className={styles.logoLink} aria-label="SecurityFACT 홈">
                    <Image
                        src="/securityfact_logo.png"
                        alt="SF Logo"
                        width={843} // 원본 비율용(실제 픽셀값에 맞추는 게 제일 안전)
                        height={460} // 원본 비율용
                        priority
                        className={styles.logoImg}
                    />
                </Link>
            </div>

            <div className={styles.navContainer}>
                <ul className={styles.navMenu}>
                    <li
                        className={`${styles.navItem} ${openKey === "about" ? styles.open : ""
                            }`}
                    >
                        <Link href="/about" onClick={toggleDropdown("about", "/about")}>
                            ABOUT
                        </Link>
                        <ul className={styles.dropdown}>
                            <li>
                                <Link href="/about/intro">동아리 소개</Link>
                            </li>
                            <li>
                                <Link href="/about/org">조직도</Link>
                            </li>
                            <li>
                                <Link href="/about/history">연혁</Link>
                            </li>
                        </ul>
                    </li>

                    <li
                        className={`${styles.navItem} ${openKey === "ctf" ? styles.open : ""
                            }`}
                    >
                        <Link href="/ctf" onClick={toggleDropdown("ctf", "/ctf")}>
                            CTF
                        </Link>
                        <ul className={styles.dropdown}>
                            <li>
                                <Link href="/ctf/writeup">Write-up</Link>
                            </li>
                        </ul>
                    </li>

                    <li className={`${styles.navItem} ${openKey === "boards" ? styles.open : ""}`}>
                        <Link href="/boards" onClick={toggleDropdown("boards", "/boards")}>
                            BOARD
                        </Link>

                        <ul className={styles.dropdown}>
                            <li>
                                <Link href="/boards/notice">공지사항</Link>
                            </li>
                            <li>
                                <Link href="/boards/resources">자료게시판</Link>
                            </li>
                            <li>
                                <Link href="/boards/general">일반게시판</Link>
                            </li>
                        </ul>
                    </li>


                    <li
                        className={`${styles.navItem} ${openKey === "recruit" ? styles.open : ""
                            }`}
                    >
                        <Link
                            href="/recruit"
                            onClick={toggleDropdown("recruit", "/recruit")}
                        >
                            RECRUIT
                        </Link>
                        <ul className={styles.dropdown}>
                            <li>
                                <Link href="/recruit/notice">모집 공고</Link>
                            </li>
                            <li>
                                <Link href="/recruit/faq">FAQ</Link>
                            </li>
                        </ul>
                    </li>
                </ul>

                {me ? (
                    <div className={styles.userMenu}>
                        <button type="button" className={styles.userButton}>
                            <span className={styles.userName}>{getDisplayName(me)}</span>
                            <span className={styles.userBadge}>{getBadgeText(me)}</span>
                        </button>

                        <div className={styles.userDropdown}>
                            <Link href="/mypage" className={styles.userDropdownItem}>
                                마이페이지
                            </Link>

                            <Link href="/logout" className={styles.userDropdownItem}>
                                로그아웃
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className={styles.authButtons}>
                        <Link href="/login">로그인</Link>
                        <Link href="/register">회원가입</Link>
                    </div>
                )}
            </div>
        </header>
    );
}