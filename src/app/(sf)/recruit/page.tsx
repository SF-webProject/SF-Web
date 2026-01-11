import Link from "next/link";
import styles from "../sf.module.css";

export default function RecruitPage() {
  return (
    <main className={styles.container} style={{ paddingTop: 110 }}>
      <h1 className={styles.sectionTitle}>RECRUIT</h1>

      <div className={styles.grid} style={{ marginTop: 20 }}>
        <div className={styles.card}>
          <h3>모집 공고</h3>
          <p>지원 자격/일정/유의사항</p>
          <p style={{ marginTop: 12 }}>
            <Link href="/recruit/notice">바로가기 →</Link>
          </p>
        </div>

        <div className={styles.card}>
          <h3>FAQ</h3>
          <p>자주 묻는 질문</p>
          <p style={{ marginTop: 12 }}>
            <Link href="/recruit/faq">바로가기 →</Link>
          </p>
        </div>
      </div>
    </main>
  );
}