// src/components/AuthHeader.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./AuthHeader.module.css";
import Image from "next/image";
import type React from "react";

export default function AuthHeader() {
    const pathname = usePathname() ?? "";
    // pathname이 바뀌면 리마운트 -> openKey가 초기값(null)로 자동 초기화
    return <AuthHeaderInner key={pathname} />;
}

function AuthHeaderInner() {
    const headerRef = useRef<HTMLElement | null>(null);
    const [openKey, setOpenKey] = useState<string | null>(null);

    const toggleDropdown = (key: string, _href: string) => (e: React.MouseEvent) => {
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

    return (
        <header ref={headerRef} className={styles.header}>
            <div className={styles.logoContainer}>
                <Link href="/" className={styles.logoLink} aria-label="SecurityFACT 홈">
                    <Image
                        src="/securityfact_logo.png"
                        alt="SF Logo"
                        width={843}   // ✅ 원본 비율용(실제 픽셀값에 맞추는 게 제일 안전)
                        height={460}  // ✅ 원본 비율용
                        priority
                        className={styles.logoImg}
                    />
                </Link>
            </div>

            <div className={styles.navContainer}>
                <ul className={styles.navMenu}>
                    <li className={`${styles.navItem} ${openKey === "about" ? styles.open : ""}`}>
                        <Link href="/about" onClick={toggleDropdown("about", "/about")}>
                            ABOUT
                        </Link>
                        <ul className={styles.dropdown}>
                            <li><Link href="/about/intro">동아리 소개</Link></li>
                            <li><Link href="/about/org">조직도</Link></li>
                            <li><Link href="/about/history">연혁</Link></li>
                        </ul>
                    </li>

                    <li className={`${styles.navItem} ${openKey === "ctf" ? styles.open : ""}`}>
                        <Link href="/ctf" onClick={toggleDropdown("ctf", "/ctf")}>
                            CTF
                        </Link>
                        <ul className={styles.dropdown}>
                            <li><Link href="/ctf/awards">수상 실적</Link></li>
                            <li><Link href="/ctf/writeup">Write-up</Link></li>
                        </ul>
                    </li>

                    <li className={styles.navItem}>
                        <Link href="/boards">BOARD</Link>
                    </li>

                    <li className={`${styles.navItem} ${openKey === "recruit" ? styles.open : ""}`}>
                        <Link href="/recruit" onClick={toggleDropdown("recruit", "/recruit")}>
                            RECRUIT
                        </Link>
                        <ul className={styles.dropdown}>
                            <li><Link href="/recruit/notice">모집 공고</Link></li>
                            <li><Link href="/recruit/faq">FAQ</Link></li>
                        </ul>
                    </li>
                </ul>

                <div className={styles.authButtons}>
                    <Link href="/login">로그인</Link>
                    <Link href="/register">회원가입</Link>
                </div>
            </div>
        </header>
    );
}