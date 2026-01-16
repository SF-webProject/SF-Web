"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../boards.module.css";

type Me = {
  ok: boolean;
  user?: {
    id: string;
    email: string;
    name: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED" | null;
    role: "MEMBER" | "STAFF" | "ADMIN" | null;
  };
};

type ResourceType = "지원서" | "프로젝트" | "OT" | "양식";
type Resource = {
  id: number;
  type: ResourceType;
  name: string;
  desc: string;
  size: string;
  updated: string;
};

export default function BoardResourcesPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const [search, setSearch] = useState("");
  const [type, setType] = useState<"all" | ResourceType>("all");

  const [resources] = useState<Resource[]>([
    { id: 1, type: "지원서", name: "동아리 지원서.docx", desc: "25-2 지원서 양식 (서명 포함)", size: "64KB", updated: "2026-01-08" },
    { id: 2, type: "프로젝트", name: "프로젝트 소개.zip", desc: "25-2 프로젝트 소개 자료 일괄", size: "18.2MB", updated: "2026-01-09" },
    { id: 3, type: "OT", name: "OT 자료.pdf", desc: "OT 안내/커리큘럼/규칙", size: "3.4MB", updated: "2026-01-10" },
    { id: 4, type: "양식", name: "동아리 PPT 템플릿.pptx", desc: "대외 발표/내부 공유 공통 템플릿", size: "2.1MB", updated: "2026-01-06" },
  ]);

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

  const user = me?.ok ? me.user : null;
  const isApproved = user?.status === "APPROVED";

  // 일단 자료 업로드는 운영진/관리자만 허용
  const canUpload = !!user && isApproved && (user.role === "ADMIN" || user.role === "STAFF");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return resources.filter((r) => {
      if (type !== "all" && r.type !== type) return false;
      if (!q) return true;
      return (r.name + " " + r.desc).toLowerCase().includes(q);
    });
  }, [resources, search, type]);

  const iconByType = (t: ResourceType) => {
    if (t === "지원서") return "fa-file-signature";
    if (t === "프로젝트") return "fa-file-zipper";
    if (t === "OT") return "fa-file-pdf";
    return "fa-file-powerpoint";
  };

  if (!loadingMe) {
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
    if (user.status !== "APPROVED") {
      return (
        <main className={styles.main}>
          <div className={styles.pageTitle}>
            <h1 className={styles.pageTitleH1}>자료게시판</h1>
            <p className={styles.pageTitleP}>승인된 계정만 게시판을 열람할 수 있습니다. (현재: {user.status})</p>
          </div>
        </main>
      );
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.pageTitle}>
        <h1 className={styles.pageTitleH1}>자료게시판</h1>
        <p className={styles.pageTitleP}>동아리 운영 자료 및 프로젝트 소개 자료를 공유합니다.</p>
      </div>

      <div className={styles.sectionHeader}>
        <h2>자료 검색</h2>
        <div className={styles.sectionMeta}>지원서 · OT · 프로젝트 소개 · 양식</div>
      </div>

      <div className={styles.boardWrap}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <div className={styles.field} title="파일명/설명 검색">
              <i className={`fa-solid fa-magnifying-glass ${styles.fieldIcon}`} />
              <input
                className={styles.fieldInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="자료 검색 (파일명/설명)"
              />
            </div>

            <select className={styles.select} value={type} onChange={(e) => setType(e.target.value as any)} aria-label="자료 유형 필터">
              <option value="all">전체</option>
              <option value="지원서">지원서</option>
              <option value="프로젝트">프로젝트</option>
              <option value="OT">OT</option>
              <option value="양식">양식</option>
            </select>
          </div>

          <div className={styles.toolbarRight}>
            <button
              className={styles.btn}
              onClick={() => alert("데모 화면입니다. 실제 구현 시 파일 업로드/권한/바이러스 검사/저장소 연동이 필요합니다.")}
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
                  <i className={`fa-solid ${iconByType(r.type)}`} />
                </div>
              </div>

              <div className={styles.cardContent}>
                <span className={styles.cardTag}>
                  <span className={styles.dot} />
                  {r.type}
                </span>

                <div className={styles.cardTitle}>{r.name}</div>
                <p className={styles.cardDesc}>{r.desc}</p>
                <p className={styles.cardMeta}>크기: {r.size} · 업데이트: {r.updated}</p>

                <div className={styles.cardActions}>
                  <button className={styles.btn} onClick={() => alert("데모: 다운로드 링크를 실제 파일로 연결하세요.")} type="button">
                    <i className="fa-solid fa-download" /> 다운로드
                  </button>
                  <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => alert("데모: 상세/버전 히스토리 페이지를 연결하세요.")} type="button">
                    <i className="fa-solid fa-circle-info" /> 상세
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {!filtered.length && <div className={styles.empty}>조건에 맞는 자료가 없습니다.</div>}
      </div>

      <div className={styles.sectionHeader} id="templates" style={{ marginTop: 38 }}>
        <h2>자주 쓰는 양식</h2>
        <div className={styles.sectionMeta}>PPT · 문서 템플릿</div>
      </div>

      <div className={styles.boardWrap} style={{ padding: 16 }}>
        <p style={{ margin: 0, color: "rgba(154,164,178,.92)" }}>
          PPT 양식/문서 템플릿은 최신 버전만 유지되도록 관리하세요. 구버전은 혼선을 방지하기 위해 운영진이 정리(삭제/교체)할 수 있습니다.
        </p>
      </div>
    </main>
  );
}
