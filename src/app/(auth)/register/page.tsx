// src/app/(auth)/register/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../auth.module.css";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    return (
        <div className={styles.signupWrap}>
            <div className={styles.signupCard}>
                <div className={styles.signupHead}>
                    <h1>JOIN US</h1>
                    <p>SecurityFACT 계정을 생성하세요</p>
                </div>

                <form
                    className={styles.form}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setError(null);

                        const form = e.currentTarget;
                        const formData = new FormData(form);

                        const r = await fetch("/api/auth/register", {
                            method: "POST",
                            body: formData,
                            credentials: "include",
                        });

                        const data = await r.json().catch(() => ({} as any));

                        if (!r.ok || !data.ok) {
                            setError(data.message ?? "회원가입에 실패했습니다.");
                            return;
                        }

                        router.replace("/login");
                    }}
                >
                    {error && (
                        <p
                            style={{
                                margin: "0 26px 12px",
                                color: "rgba(255,90,95,.95)",
                                fontWeight: 800,
                            }}
                        >
                            {error}
                        </p>
                    )}

                    <div className={styles.field}>
                        <label htmlFor="name">NAME</label>
                        <input
                            id="name"
                            name="name"
                            className={styles.input}
                            type="text"
                            placeholder="이름(또는 닉네임)"
                            autoComplete="name"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="email">EMAIL</label>
                        <input
                            id="email"
                            name="email"
                            className={styles.input}
                            type="email"
                            placeholder="example@security.com"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password">PASSWORD</label>
                        <input
                            id="password"
                            name="password"
                            className={styles.input}
                            type="password"
                            placeholder="비밀번호"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="passwordConfirm">PASSWORD CHECK</label>
                        <input
                            id="passwordConfirm"
                            name="passwordConfirm"
                            className={styles.input}
                            type="password"
                            placeholder="비밀번호 확인"
                            required
                        />
                    </div>

                    <button className={styles.btn} type="submit">
                        CREATE ACCOUNT
                    </button>
                </form>

                <p className={styles.hint}>
                    가입 신청 후 관리자의 승인을 거쳐
                    <br />
                    정식 회원으로 활동이 가능합니다.
                </p>

                <div className={styles.foot}>
                    이미 계정이 있으신가요? <Link href="/login">로그인</Link>
                </div>
            </div>
        </div>
    );
}