import styles from "../sf.module.css";

export default function BoardsHomePage() {
  return (
    <main className={styles.container} style={{ paddingTop: 120, paddingBottom: 90 }}>
      <h1 className={styles.sectionTitle} style={{ textAlign: "center" }}>
        준비중입니다
      </h1>
      <p style={{ textAlign: "center", color: "var(--muted)", marginTop: 12 }}>
        게시판은 현재 제작 중입니다.
      </p>
    </main>
  );
}