import styles from "../../sf.module.css";
import my from "../mypage.module.css";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ProfileEditClient from "./profileEditClient";

export default async function ProfileEditPage() {
    const me = await getCurrentUser();
    if (!me) redirect("/login");

    return (
        <main className={styles.container} style={{ paddingTop: 110 }}>
            <h1 className={styles.sectionTitle}>프로필 수정</h1>

            <div className={my.panel} style={{ marginTop: 18 }}>
                <div className={my.panelHead}>
                    <div>
                        <h2 className={my.panelTitle}>이름 변경</h2>
                        <p className={my.panelSub}>표시 이름만 변경됩니다.</p>
                    </div>
                </div>

                <ProfileEditClient
                    mode="name"
                    initialName={me.name ?? ""}
                />
            </div>

            <div className={my.panel} style={{ marginTop: 18 }}>
                <div className={my.panelHead}>
                    <div>
                        <h2 className={my.panelTitle}>비밀번호 변경</h2>
                        <p className={my.panelSub}>변경 후에는 보안상 자동 로그아웃됩니다.</p>
                    </div>
                </div>

                <ProfileEditClient mode="password" />
            </div>
        </main>
    );
}