//src/app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../auth.module.css";

type ApiResult = {
    ok: boolean;
    message?: string;
    resetUrl?: string; // 임시.. 링크를 위함..
};

export default function ForgotPasswordPage() {
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [resetUrl, setResetUrl] = useState<string | null>(null);

    return (
        <div className={styles.loginWrap}>
            <div className={styles.loginCard}>
                <div className={styles.loginHead}>
                    <h1>RESET</h1>
                    <p>비밀번호 재설정 링크를 요청합니다</p>
                </div>

                <form
                    className={styles.form}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setError(null);
                        setInfo(null);
                        setResetUrl(null);

                        const form = e.currentTarget;
                        const formData = new FormData(form);

                        const r = await fetch("/api/auth/forgot-password", {
                            method: "POST",
                            body: formData,
                            credentials: "include",
                        });

                        const data = (await r.json().catch(() => null)) as ApiResult | null;

                        if (!r.ok || !data?.ok) {
                            setError(data?.message ?? "요청에 실패했습니다.");
                            return;
                        }

                        setInfo(data?.message ?? "요청이 접수되었습니다.");
                        if (data?.resetUrl) setResetUrl(data.resetUrl);

                        // 입력값 정리(안하고 싶으면 삭제해도 됨)
                        form.reset();
                    }}
                >
                    {error && <p className={styles.noticeError}>{error}</p>}
                    {info && <p className={styles.noticeInfo}>{info}</p>}

                    <div className={styles.field}>
                        <label htmlFor="email">EMAIL</label>
                        <input
                            id="email"
                            name="email"
                            className={styles.input}
                            type="email"
                            placeholder="가입한 이메일"
                            required
                        />
                    </div>

                    {resetUrl && (
                        <div className={styles.devBox}>
                            <div className={styles.devTitle}>개발환경 링크</div>
                            <a className={styles.devLink} href={resetUrl}>
                                {resetUrl}
                            </a>
                        </div>
                    )}

                    <button className={styles.btn} type="submit">
                        REQUEST LINK
                    </button>

                    <div className={styles.foot} style={{ borderTop: 0, background: "transparent" }}>
                        <Link className={styles.link} href="/login">
                            로그인으로 돌아가기
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}