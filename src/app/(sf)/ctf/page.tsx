import Link from "next/link";
import styles from "../sf.module.css";

export default function CtfPage() {
  return (
    <main className={styles.container} style={{ paddingTop: 110 }}>
      <h1 className={styles.sectionTitle}>CTF</h1>

      <div className={styles.grid} style={{ marginTop: 20 }}>
        <div className={styles.card}>
          <h3>수상 실적</h3>
          <p>대회 성과 정리</p>
          <p style={{ marginTop: 12 }}>
            <Link href="/ctf/awards">바로가기 →</Link>
          </p>
        </div>

        <div className={styles.card}>
          <h3>Write-up</h3>
          <p>문제 풀이 공유</p>
          <p style={{ marginTop: 12 }}>
            <Link href="/ctf/writeup">바로가기 →</Link>
          </p>
        </div>
      </div>
    </main>
  );
}