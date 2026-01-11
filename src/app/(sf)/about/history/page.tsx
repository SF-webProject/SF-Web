import styles from "../../sf.module.css";

export default function AboutHistoryPage() {
  return (
    <main className={styles.container} style={{ paddingTop: 110 }}>
      <section className={styles.sfSection}>
        <div className={styles.aboutHistory__title}>
          <h2>연혁</h2>
          <p>SecurityFACT가 걸어온 보안 전문가로의 발자취입니다.</p>
        </div>

        <div className={styles.aboutHistory__wrap} aria-label="History Timeline">
          <div className={styles.aboutHistory__timeline}>
            <div className={styles.aboutHistory__item}>
              <div className={styles.aboutHistory__yearRow}>
                <div className={styles.aboutHistory__year}>2025</div>
                <div className={styles.aboutHistory__badge}>Recent</div>
              </div>
              <div className={styles.aboutHistory__card}>
                <ul className={styles.aboutHistory__list}>
                  <li><b>Midnight Flag CTF 2025</b> 본선 진출</li>
                  <li><b>2025 핵테온 세종</b> 국제 대학생 사이버보안 경진대회 본선 진출</li>
                </ul>
              </div>
            </div>

            <div className={styles.aboutHistory__item}>
              <div className={styles.aboutHistory__yearRow}>
                <div className={styles.aboutHistory__year}>2024</div>
                <div className={styles.aboutHistory__badge}>Highlights</div>
              </div>
              <div className={styles.aboutHistory__card}>
                <ul className={styles.aboutHistory__list}>
                  <li><b>사이버공격방어대회(CCE)</b> 준우승</li>
                  <li><b>금융보안 위협분석 대회 FIESTA</b> 3위</li>
                  <li><b>Digital Forensic Challenge</b> 학생부 3위</li>
                  <li><b>화이트햇 콘테스트</b> 우수상</li>
                </ul>
              </div>
            </div>

            <div className={styles.aboutHistory__item}>
              <div className={styles.aboutHistory__yearRow}>
                <div className={styles.aboutHistory__year}>2010</div>
                <div className={styles.aboutHistory__badge}>Founded</div>
              </div>
              <div className={styles.aboutHistory__card}>
                <ul className={styles.aboutHistory__list}>
                  <li><b>SecurityFACT 설립</b> (건국대학교 공과대학)</li>
                  <li>정보보안 기술 연구 및 학술 동아리 활동 시작</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}