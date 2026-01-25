//src/app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../auth.module.css";

type ApiResult = {
  ok: boolean;
  message?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <div className={styles.loginHead}>
          <h1>LOGIN</h1>
          <p>SecurityFACT 계정으로 로그인하세요</p>
        </div>

        <form
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);

            const form = e.currentTarget;
            const formData = new FormData(form);

            const r = await fetch("/api/auth/login", {
              method: "POST",
              body: formData,
              credentials: "include",
            });

            const data = (await r.json().catch(() => null)) as ApiResult | null;

            if (!r.ok || !data?.ok) {
              setError(data?.message ?? "아이디나 비밀번호를 확인해주세요");
              return;
            }

            router.replace("/");
            router.refresh();
          }}
        >
          {error && (
            <p
              style={{
                margin: "0 0 12px",
                color: "rgba(255,90,95,.95)",
                fontWeight: 800,
              }}
            >
              {error}
            </p>
          )}

          <div className={styles.field}>
            <label htmlFor="email">ID / EMAIL</label>
            <input
              id="email"
              name="email"
              className={styles.input}
              type="email"
              placeholder="아이디 또는 이메일을 입력하세요"
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
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <div className={styles.row}>
            <label className={styles.check}>
              <input type="checkbox" name="remember" />
              로그인 유지
            </label>

            <Link className={styles.link} href="/forgot-password">
              비밀번호 찾기
            </Link>
          </div>

          <button className={styles.btn} type="submit">
            SIGN IN
          </button>
        </form>

        <div className={styles.foot}>
          아직 계정이 없나요? <Link href="/register">회원가입</Link>
        </div>
      </div>
    </div>
  );
}