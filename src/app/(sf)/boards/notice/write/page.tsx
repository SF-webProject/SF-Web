//src/app/(sf)/boards/notice/write/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../boards.module.css";

export default function NoticeWritePage() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) throw new Error("로그인 필요");

        const data = await res.json();
        if (!data.ok || !data.user) throw new Error("로그인 필요");

        const user = data.user;
        if (user.status !== "APPROVED")
          throw new Error("승인된 사용자만 작성 가능");
        if (!["STAFF", "ADMIN"].includes(user.role))
          throw new Error("공지 작성 권한 없음");

        setLoadingAuth(false);
      } catch (err) {
        alert(err instanceof Error ? err.message : "인증 오류");
        router.replace("/boards/notice");
      }
    })();
  }, [router]);

  if (loadingAuth) return <p className={styles.loading}>권한 확인 중...</p>;

  // 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/boards/notice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          pinned,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        alert(data.message || "공지 작성 실패");
        setSubmitting(false);
        return;
      }

      router.push("/boards/notice");
    } catch (err) {
      console.error(err);
      alert("서버 오류");
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.pageTitle}>
        <h1 className={styles.pageTitleH1}>공지사항 작성</h1>
        <p className={styles.pageTitleP}>
          운영진 / 관리자 전용 공지 작성
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.writeForm}>
        <div className={styles.field}>
          <label>제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="공지 제목"
            required
          />
        </div>

        <div className={styles.field}>
          <label>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="공지 내용"
            rows={10}
            required
          />
        </div>

        <div className={styles.fieldInline}>
          <label>
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
            />
            상단 고정 공지
          </label>
        </div>

        <div className={styles.actions}>

          <button type="submit" disabled={submitting}>
            {submitting ? "작성 중..." : "공지 등록"}
          </button>
        </div>
      </form>
    </main>
  );
}
