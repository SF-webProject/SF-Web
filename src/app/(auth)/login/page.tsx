// src/app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import styles from "../auth.module.css";

export default function LoginPage() {
  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <div className={styles.loginHead}>
          <h1>LOGIN</h1>
          <p>SecurityFACT 계정으로 로그인하세요</p>
        </div>

        <form action="/api/auth/login" method="post" className={styles.form}>
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

            <a className={styles.link} href="#">
              비밀번호 찾기
            </a>
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