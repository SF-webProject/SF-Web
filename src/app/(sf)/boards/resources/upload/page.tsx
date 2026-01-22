//src/app/(sf)/boards/resources/upload/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

type ResourceType = string;

export default function ResourceUploadPage() {
    const router = useRouter();

    const [me, setMe] = useState<Me | null>(null);
    const [loadingMe, setLoadingMe] = useState(true);

    const [type, setType] = useState<string>("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const [submitting, setSubmitting] = useState(false);

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
    const canUpload = !!user && user.status === "APPROVED" && (user.role === "ADMIN" || user.role === "STAFF");

    useEffect(() => {
        if (loadingMe) return;
        if (!user) {
            alert("로그인이 필요합니다.");
            router.replace("/login");
            return;
        }
        if (user.status !== "APPROVED") {
            alert("승인된 사용자만 접근 가능합니다.");
            router.replace("/boards/resources");
            return;
        }
        if (!canUpload) {
            alert("업로드 권한이 없습니다.");
            router.replace("/boards/resources");
            return;
        }
    }, [loadingMe]); // 기존 스타일 유지(필요 시 user/canUpload/router 넣어도 되지만, 요청대로 최소 변경)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;

        if (!title.trim()) return alert("자료 이름을 입력해주세요.");
        if (!type.trim()) return alert("유형을 입력해주세요.");
        if (!file) return alert("파일을 선택해주세요.");

        setSubmitting(true);
        try {
            const form = new FormData();
            form.append("type", type);
            form.append("title", title.trim());
            form.append("description", description.trim());
            form.append("file", file);

            const res = await fetch("/api/auth/boards/resources", {
                method: "POST",
                body: form,
            });

            const data = await res.json().catch(() => null);
            if (!res.ok || !data?.ok) {
                alert(data?.message ?? "업로드에 실패했습니다.");
                return;
            }

            router.push(`/boards/resources/${data.resource.id}`);
        } catch (err) {
            console.error(err);
            alert("서버 오류");
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingMe) {
        return (
            <main className={styles.main}>
                <div className={styles.pageTitle}>
                    <h1 className={styles.pageTitleH1}>자료 업로드</h1>
                    <p className={styles.pageTitleP}>권한 확인 중...</p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.pageTitle}>
                <h1 className={styles.pageTitleH1}>자료 업로드</h1>
                <p className={styles.pageTitleP}>운영진/관리자 전용</p>
            </div>

            <div className={styles.boardWrap} style={{ padding: 16 }}>
                <form onSubmit={onSubmit} className={styles.writeForm}>
                    <div className={styles.field}>
                        <label>유형</label>
                        <input
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            placeholder="예: 지원서 / OT / 프로젝트 / 세미나자료 / 기타..."
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label>자료 이름</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: OT 자료.pdf" required />
                    </div>

                    <div className={styles.field}>
                        <label>설명</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="예: OT 안내/커리큘럼/규칙"
                            rows={6}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>파일</label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            required
                        />
                        <div style={{ marginTop: 8, color: "rgba(154, 164, 178, 0.92)", fontSize: "0.9rem" }}>
                            기본 제한(추론): 20MB 이하, pdf/docx/pptx/zip만 허용
                        </div>
                    </div>

                    <div className={styles.actions} style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                        <button type="button" className={styles.btn} onClick={() => router.push("/boards/resources")}>
                            취소
                        </button>
                        <button type="submit" disabled={submitting}>
                            {submitting ? "업로드 중..." : "업로드"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}