"use client";

import { useState } from "react";
import styles from "./profileEditClient.module.css";

export default function ProfileEditClient(props: {
    mode: "name" | "password";
    initialName?: string;
}) {
    const { mode } = props;

    const [name, setName] = useState(props.initialName ?? "");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    async function submit() {
        setMsg(null);
        setLoading(true);

        try {
            const payload: any = {};
            if (mode === "name") payload.name = name;
            if (mode === "password") {
                payload.currentPassword = currentPassword;
                payload.newPassword = newPassword;
                payload.newPasswordConfirm = newPasswordConfirm;
            }

            const res = await fetch("/api/auth/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data?.ok) {
                setMsg(data?.message ?? "실패했습니다.");
                return;
            }

            if (data?.logout) {
                // 비밀번호 변경 성공 -> 로그아웃 처리됨 (쿠키 삭제됨)
                window.location.href = "/login";
                return;
            }

            setMsg("변경 완료");
        } catch {
            setMsg("서버 오류");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.wrap}>
            {mode === "name" ? (
                <>
                    <div className={styles.row}>
                        <label className={styles.label}>이름</label>
                        <input
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="변경할 이름"
                            maxLength={30}
                        />
                    </div>

                    <button className={styles.button} disabled={loading} onClick={submit}>
                        {loading ? "처리중..." : "이름 변경"}
                    </button>
                </>
            ) : (
                <>
                    <div className={styles.row}>
                        <label className={styles.label}>현재 비밀번호</label>
                        <input
                            className={styles.input}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            type="password"
                            placeholder="현재 비밀번호"
                        />
                    </div>

                    <div className={styles.row}>
                        <label className={styles.label}>새 비밀번호</label>
                        <input
                            className={styles.input}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            type="password"
                            placeholder="새 비밀번호(8자 이상)"
                        />
                    </div>

                    <div className={styles.row}>
                        <label className={styles.label}>새 비밀번호 확인</label>
                        <input
                            className={styles.input}
                            value={newPasswordConfirm}
                            onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            type="password"
                            placeholder="새 비밀번호 확인"
                        />
                    </div>

                    <button className={styles.button} disabled={loading} onClick={submit}>
                        {loading ? "처리중..." : "비밀번호 변경"}
                    </button>
                </>
            )}

            {msg && <div className={styles.msg}>{msg}</div>}
        </div>
    );
}