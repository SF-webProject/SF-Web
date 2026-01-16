"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../boards.module.css"; // 필요시 스타일

export default function BoardWritePage() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"TECH" | "QNA" | "NONE">("NONE");
  const [submitting, setSubmitting] = useState(false);

  // 인증 확인
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) throw new Error("로그인 필요");

        const data = await res.json();
        if (!data.ok || !data.user) throw new Error("로그인 필요");

        const user = data.user;
        if (user.status !== "APPROVED") throw new Error("승인된 사용자만 작성 가능");
        if (!["MEMBER", "STAFF", "ADMIN"].includes(user.role)) throw new Error("권한 없음");

        setLoadingAuth(false);
      } catch (err: any) {
        alert(err.message || "인증 오류");
        router.replace("/login");
      }
    })();
  }, [router]);

  if (loadingAuth) return <p>인증 확인 중...</p>;

  // 글 작성 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/boards/general", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category }),
      });

      const data = await res.json();

      if (!data.ok) {
        alert(data.message || "글 작성 실패");
        setSubmitting(false);
        return;
      }

      // 작성 성공 시 일반게시판으로 이동
      router.push("/boards/general");
    } catch (err) {
      console.error(err);
      alert("서버 오류");
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <h1>일반게시판 글쓰기</h1>
      <form onSubmit={handleSubmit} className={styles.writeForm}>
        <div>
          <input
            name="title"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <textarea
            name="content"
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as "TECH" | "QNA" | "NONE")}
          >
            <option value="NONE">카테고리 선택</option>
            <option value="TECH">기술 글</option>
            <option value="QNA">질문 글</option>
          </select>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "작성중..." : "제출"}
        </button>
      </form>
    </main>
  );
}
