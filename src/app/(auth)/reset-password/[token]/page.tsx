//src/app/(auth)/reset-password/[token]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import styles from "../../auth.module.css";

type ApiResult = {
    ok: boolean;
    message?: string;
};

export default function ResetPasswordTokenPage() {
    const params = useParams<{ token: string }>();
    const token = params?.token ?? "";
    const router = useRouter();

    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    return (
        <div className={styles.loginWrap}>
            <div className={styles.loginCard}>
                <div className={styles.loginHead}>
                    <h1>NEW PASSWORD</h1>
                    <p>새 비밀번호를 설정합니다</p>
                </div>

                <form
                    className={styles.form}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setError(null);
                        setInfo(null);

                        const form = e.currentTarget;
                        const formData = new FormData(form);

                        const newPassword = String(formData.get("newPassword") ?? "");
                        const newPasswordConfirm = String(formData.get("newPasswordConfirm") ?? "");

                        const r = await fetch("/api/auth/reset-password", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ token, newPassword, newPasswordConfirm }),
                            credentials: "include",
                        });

                        const data = (await r.json().catch(() => null)) as ApiResult | null;

                        if (!r.ok || !data?.ok) {
                            setError(data?.message ?? "재설정에 실패했습니다.");
                            return;
                        }

                        setInfo("비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.");

                        // 0.8초 정도 텀 두고 이동(줄이거나 없애도 무관하긴 함)
                        setTimeout(() => {
                            router.replace("/login");
                            router.refresh();
                        }, 800);
                    }}
                >
                    {error && <p className={styles.noticeError}>{error}</p>}
                    {info && <p className={styles.noticeInfo}>{info}</p>}

                    <div className={styles.field}>
                        <label htmlFor="newPassword">NEW PASSWORD</label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            className={styles.input}
                            type="password"
                            placeholder="8자 이상"
                            required
                            minLength={8}
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="newPasswordConfirm">CONFIRM</label>
                        <input
                            id="newPasswordConfirm"
                            name="newPasswordConfirm"
                            className={styles.input}
                            type="password"
                            placeholder="비밀번호 확인"
                            required
                            minLength={8}
                        />
                    </div>

                    <button className={styles.btn} type="submit">
                        UPDATE PASSWORD
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