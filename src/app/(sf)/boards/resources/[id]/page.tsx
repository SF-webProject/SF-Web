//src/app/(sf)/boards/resources/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../boards.module.css";

type Me = {
  ok: boolean;
  user?: {
    id: string;
    email: string;
    name: string | null;
    status: "PENDING" | "APPROVED" | null;
    role: "MEMBER" | "STAFF" | "ADMIN" | null;
  };
};

type ResourceDetail = {
  id: number;
  type: string;
  title: string;
  description: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  created: string;
  updated: string;
  uploader: string;
};

function formatBytes(n: number) {
  if (!Number.isFinite(n) || n < 0) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let v = n;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  const fixed = i === 0 ? String(Math.floor(v)) : v.toFixed(1);
  return `${fixed}${units[i]}`;
}

export default function ResourceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [me, setMe] = useState<Me | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) {
          setMe({ ok: false });
          return;
        }
        const data = (await res.json()) as Me;
        setMe(data);
      } finally {
        setLoadingMe(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (me === null) return;

    const user = me.ok ? me.user : null;
    if (!user) {
      setLoading(false);
      setError("이 페이지는 로그인 후 이용 가능합니다.");
      return;
    }
    if (user.status !== "APPROVED") {
      setLoading(false);
      setError(`승인된 계정만 열람할 수 있습니다. (현재: ${user.status})`);
      return;
    }

    const id = Number(params?.id);
    if (!id || Number.isNaN(id)) {
      setLoading(false);
      setError("유효하지 않은 접근입니다.");
      return;
    }

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`/api/auth/boards/resources/${id}`, { cache: "no-store" });
        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.ok) {
          setError(data?.message ?? "자료를 불러오지 못했습니다.");
          return;
        }

        setResource(data.resource as ResourceDetail);
      } catch (e) {
        console.error(e);
        setError("자료를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [me, params?.id]);

  if (loadingMe || loading) {
    return (
      <main className={styles.main}>
        <div className={styles.pageTitle}>
          <h1 className={styles.pageTitleH1}>자료게시판</h1>
          <p className={styles.pageTitleP}>불러오는 중...</p>
        </div>
      </main>
    );
  }

  if (error || !resource) {
    return (
      <main className={styles.main}>
        <div className={styles.pageTitle}>
          <h1 className={styles.pageTitleH1}>자료게시판</h1>
          <p className={styles.pageTitleP}>{error ?? "자료가 없습니다."}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <button className={styles.btn} onClick={() => router.push("/boards/resources")} type="button">
            목록으로
          </button>
        </div>
      </main>
    );
  }

  const onDownload = () => {
    window.location.href = `/api/auth/boards/resources/download/${resource.id}`;
  };

  return (
    <main className={styles.main}>
      <div className={styles.pageTitle}>
        <h1 className={styles.pageTitleH1}>자료게시판</h1>
        <p className={styles.pageTitleP}>자료 상세</p>
      </div>

      <div className={styles.boardWrap} style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "1.35rem", fontWeight: 1000, color: "rgba(230, 237, 246, 0.96)" }}>
              {resource.title}
            </div>
            <div style={{ marginTop: 8, color: "rgba(154, 164, 178, 0.92)", fontSize: "0.95rem" }}>
              {resource.type} · 업로더: {resource.uploader} · 업데이트: {resource.updated}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className={styles.btn} onClick={onDownload} type="button">
              <i className="fa-solid fa-download" /> 다운로드
            </button>
            <button className={styles.btn} onClick={() => router.push("/boards/resources")} type="button">
              목록으로
            </button>
          </div>
        </div>

        <div style={{ marginTop: 18, height: 1, background: "rgba(255, 255, 255, 0.10)" }} />

        <div style={{ marginTop: 14, color: "rgba(230, 237, 246, 0.90)", lineHeight: 1.7 }}>
          <div style={{ color: "rgba(154, 164, 178, 0.92)", fontSize: "0.92rem" }}>설명</div>
          <div style={{ marginTop: 6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {resource.description || "설명이 없습니다."}
          </div>

          <div style={{ marginTop: 18, color: "rgba(154, 164, 178, 0.92)", fontSize: "0.92rem" }}>파일 정보</div>
          <div style={{ marginTop: 6 }}>
            원본 파일명: {resource.originalName}
            <br />
            MIME: {resource.mimeType}
            <br />
            크기: {formatBytes(resource.sizeBytes)}
          </div>
        </div>
      </div>
    </main>
  );
}