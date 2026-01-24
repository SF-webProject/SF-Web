//src/app/(sf)/boards/resources/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../boards.module.css";

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

type Resource = {
  id: number;
  type: string;
  name: string;
  desc: string;
  sizeBytes: number; // DB에서 숫자(byte)로 오는 걸 가정
  updated: string;   // YYYY-MM-DD
};

function formatBytes(n: number) {
  if (!Number.isFinite(n) || n < 0) return "-";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let v = n;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  const fixed = i === 0 ? String(Math.floor(v)) : v.toFixed(1);
  return `${fixed}${units[i]}`;
}

export default function BoardResourcesPage() {
  const router = useRouter();

  const [me, setMe] = useState<Me | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [resourcesError, setResourcesError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("all");

  // 1) me 조회
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

  // 2) 권한 OK면 자료 목록 조회
  useEffect(() => {
    if (me === null) return;

    const user = me.ok ? me.user : null;
    if (!user) {
      setLoadingResources(false);
      setResourcesError(null);
      return;
    }
    if (user.status !== "APPROVED") {
      setLoadingResources(false);
      setResourcesError(null);
      return;
    }

    setLoadingResources(true);
    setResourcesError(null);

    (async () => {
      try {
        const res = await fetch("/api/auth/boards/resources", { cache: "no-store" });
        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.ok) {
          setResourcesError(data?.message ?? "자료를 불러오지 못했습니다.");
          return;
        }

        setResources((data.resources ?? []) as Resource[]);
      } catch (e) {
        console.error(e);
        setResourcesError("자료를 불러오지 못했습니다.");
      } finally {
        setLoadingResources(false);
      }
    })();
  }, [me]);

  const user = me?.ok ? me.user : null;
  const isApproved = user?.status === "APPROVED";

  // 업로드는 운영진/관리자만
  const canUpload = !!user && isApproved && (user.role === "ADMIN" || user.role === "STAFF");

  // type 옵션을 서버 데이터 기반으로 동적으로 만들기
  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    for (const r of resources) {
      const t = (r.type ?? "").trim();
      if (t) set.add(t);
    }
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [resources]);

  // 선택된 type이 더 이상 존재하지 않으면 all로 되돌리기
  useEffect(() => {
    if (type === "all") return;
    if (!typeOptions.includes(type)) setType("all");
  }, [typeOptions, type]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return resources.filter((r) => {
      if (type !== "all" && r.type !== type) return false;
      if (!q) return true;
      return (r.name + " " + r.desc + " " + r.type).toLowerCase().includes(q);
    });
  }, [resources, search, type]);

  // me 로딩
  if (loadingMe) {
    return (
      <main className={styles.main}>
        <div className={styles.pageTitle}>
          <h1 className={styles.pageTitleH1}>자료게시판</h1>
          <p className={styles.pageTitleP}>권한 확인 중...</p>
        </div>
      </main>
    );
  }

  // 비로그인
  if (!user) {
    return (
      <main className={styles.main}>
        <div className={styles.pageTitle}>
          <h1 className={styles.pageTitleH1}>자료게시판</h1>
          <p className={styles.pageTitleP}>이 페이지는 로그인 후 이용 가능합니다.</p>
        </div>
      </main>
    );
  }

  // 미승인
  if (user.status !== "APPROVED") {
    return (
      <main className={styles.main}>
        <div className={styles.pageTitle}>
          <h1 className={styles.pageTitleH1}>자료게시판</h1>
          <p className={styles.pageTitleP}>
            승인된 계정만 게시판을 열람할 수 있습니다. (현재: {user.status})
          </p>
        </div>
      </main>
    );
  }

  // 자료 로딩
  if (loadingResources) {
    return (
      <main className={styles.main}>
        <div className={styles.pageTitle}>
          <h1 className={styles.pageTitleH1}>자료게시판</h1>
          <p className={styles.pageTitleP}>자료 불러오는 중...</p>
        </div>
      </main>
    );
  }

  // 자료 로딩 실패
  if (resourcesError) {
    return (
      <main className={styles.main}>
        <div className={styles.pageTitle}>
          <h1 className={styles.pageTitleH1}>자료게시판</h1>
          <p className={styles.pageTitleP}>{resourcesError}</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.pageTitle}>
        <h1 className={styles.pageTitleH1}>자료게시판</h1>
        <p className={styles.pageTitleP}>동아리 운영 자료 및 프로젝트 관련 자료를 공유합니다.</p>
      </div>

      <div className={styles.sectionHeader}>
        <h2>자료 검색</h2>
        <div className={styles.sectionMeta}>유형 필터 · 검색</div>
      </div>

      <div className={styles.boardWrap}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <div className={styles.field} title="파일명/설명/유형 검색">
              <i className={`fa-solid fa-magnifying-glass ${styles.fieldIcon}`} />
              <input
                className={styles.fieldInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="자료 검색 (파일명/설명/유형)"
              />
            </div>

            <select
              className={styles.select}
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-label="자료 유형 필터"
            >
              {typeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "all" ? "전체" : opt}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.toolbarRight}>
            <button
              className={styles.btn}
              onClick={() => router.push("/boards/resources/upload")}
              disabled={!canUpload}
              style={!canUpload ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
              type="button"
            >
              <i className="fa-solid fa-cloud-arrow-up" /> 자료 업로드
            </button>
          </div>
        </div>

        <section className={styles.grid} style={{ padding: 16 }} aria-label="Resources">
          {filtered.map((r) => (
            <div key={r.id} className={styles.itemCard} style={{ cursor: "default" }}>
              <div className={styles.cardImage}>
                <div className={styles.imgPlaceholder}>
                  <i className="fa-solid fa-file" />
                </div>
              </div>

              <div className={styles.cardContent}>
                <span className={styles.cardTag}>
                  <span className={styles.dot} />
                  {r.type || "기타"}
                </span>

                <div className={styles.cardTitle}>{r.name}</div>
                <p className={styles.cardDesc}>{r.desc}</p>
                <p className={styles.cardMeta}>
                  크기: {formatBytes(r.sizeBytes)} · 업데이트: {r.updated}
                </p>

                <div className={styles.cardActions}>
                  <button
                    className={styles.btn}
                    onClick={() => {
                      window.location.href = `/api/auth/boards/resources/download/${r.id}`;
                    }}
                    type="button"
                  >
                    <i className="fa-solid fa-download" /> 다운로드
                  </button>

                  <button
                    className={`${styles.btn} ${styles.btnGhost}`}
                    onClick={() => router.push(`/boards/resources/${r.id}`)}
                    type="button"
                  >
                    <i className="fa-solid fa-circle-info" /> 상세
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {!filtered.length && <div className={styles.empty}>조건에 맞는 자료가 없습니다.</div>}
      </div>
    </main>
  );
}