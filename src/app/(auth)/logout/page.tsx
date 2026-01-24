// src/app/(auth)/logout/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../auth.module.css";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      } finally {
        router.replace("/login");
        router.refresh();
      }
    })();
  }, [router]);

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <div className={styles.loginHead}>
          <h1>LOGOUT</h1>
          <p>로그아웃 처리 중입니다...</p>
        </div>
      </div>
    </div>
  );
}