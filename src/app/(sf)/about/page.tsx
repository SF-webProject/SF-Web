import Link from "next/link";
import styles from "../sf.module.css";

export default function AboutPage() {
  return (
    <main className={styles.container} style={{ paddingTop: 110 }}>
      <h1 className={styles.sectionTitle}>About</h1>

      <div className={styles.grid} style={{ marginTop: 20 }}>
        <div className={styles.card}>
          <h3>동아리 소개</h3>
          <p>SecurityFACT 소개 및 주요 기술 분야</p>
          <p style={{ marginTop: 12 }}>
            <Link href="/about/intro">바로가기 →</Link>
          </p>
        </div>

        <div className={styles.card}>
          <h3>조직도</h3>
          <p>운영진 및 조직 구성</p>
          <p style={{ marginTop: 12 }}>
            <Link href="/about/org">바로가기 →</Link>
          </p>
        </div>

        <div className={styles.card}>
          <h3>연혁</h3>
          <p>SecurityFACT가 걸어온 기록</p>
          <p style={{ marginTop: 12 }}>
            <Link href="/about/history">바로가기 →</Link>
          </p>
        </div>
      </div>
    </main>
  );
}