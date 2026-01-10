import styles from "../../sf.module.css";

export default function AboutIntroPage() {
  return (
    <main className={styles.container} style={{ paddingTop: 110 }}>
      <section className={styles.sfSection}>
        <div className={styles.aboutIntro__header}>
          <h2>SecurityFACT란?</h2>
          <p>
            SecurityFact는 2010년 최초 설립되어 <strong>해킹 및 정보보안</strong>에 열정을 가진
            <br />
            건국대학교 학우분들로 이루어진 공과대학 및 컴퓨터공학부 소속 동아리입니다.
          </p>
        </div>

        <h3 className={styles.sfBlockTitle}>주요 기술 분야</h3>
        <div className={styles.aboutIntro__techGrid}>
          <div className={styles.aboutIntro__techItem}>Pwnable</div>
          <div className={styles.aboutIntro__techItem}>Web Hacking</div>
          <div className={styles.aboutIntro__techItem}>Reversing</div>
          <div className={styles.aboutIntro__techItem}>Digital Forensic</div>
          <div className={styles.aboutIntro__techItem}>BlockChain Security</div>
          <div className={styles.aboutIntro__techItem}>CS</div>
        </div>

        <h3 className={styles.sfBlockTitle}>수상 실적 (Awards)</h3>
        <div className={styles.aboutIntro__awards}>
          <ul className={styles.aboutIntro__awardList}>
            <li className={styles.aboutIntro__awardItem}>
              <span className={styles.aboutIntro__awardTag}>BoB 13기</span>
              <span className={styles.aboutIntro__awardTitle}>Whitehat 10</span>
            </li>

            <li className={styles.aboutIntro__awardItem}>
              <span className={styles.aboutIntro__awardTag}>Midnight Flag CTF 2025</span>
              <span className={styles.aboutIntro__awardTitle}>본선 진출</span>
              <span className={styles.aboutIntro__awardRank}>Finalist</span>
            </li>

            <li className={styles.aboutIntro__awardItem}>
              <span className={styles.aboutIntro__awardTag}>2025 핵테온 세종</span>
              <span className={styles.aboutIntro__awardTitle}>
                국제 대학생 사이버보안 경진대회 (beginner, advanced)
              </span>
              <span className={styles.aboutIntro__awardRank}>본선 진출</span>
            </li>

            <li className={styles.aboutIntro__awardItem}>
              <span className={styles.aboutIntro__awardTag}>Forensic Challenge 2024</span>
              <span className={styles.aboutIntro__awardTitle}>Digital Forensic Challenge</span>
              <span className={styles.aboutIntro__awardRank}>학생부 3위 (통합 11위)</span>
            </li>

            <li className={styles.aboutIntro__awardItem}>
              <span className={styles.aboutIntro__awardTag}>INCOGNITO 2024 CTF</span>
              <span className={styles.aboutIntro__awardTitle}>동아리 대항전</span>
              <span className={styles.aboutIntro__awardRank}>장려상</span>
            </li>

            <li className={styles.aboutIntro__awardItem}>
              <span className={styles.aboutIntro__awardTag}>금융보안 위협분석 대회</span>
              <span className={styles.aboutIntro__awardTitle}>FIESTA 2024</span>
              <span className={styles.aboutIntro__awardRank}>3위</span>
            </li>

            <li className={styles.aboutIntro__awardItem}>
              <span className={styles.aboutIntro__awardTag}>사이버공격방어대회</span>
              <span className={styles.aboutIntro__awardTitle}>CCE 2024</span>
              <span className={styles.aboutIntro__awardRank}>준우승</span>
            </li>

            <li className={styles.aboutIntro__awardItem}>
              <span className={styles.aboutIntro__awardTag}>제10회 디지털 범인을 찾아라</span>
              <span className={styles.aboutIntro__awardTitle}>디지털 포렌식 경진대회</span>
              <span className={styles.aboutIntro__awardRank}>동상</span>
            </li>

            <li className={styles.aboutIntro__awardItem}>
              <span className={styles.aboutIntro__awardTag}>화이트햇 콘테스트 2024</span>
              <span className={styles.aboutIntro__awardTitle}>국방부 주관 보안 경진대회</span>
              <span className={styles.aboutIntro__awardRank}>우수상</span>
            </li>

            <li className={styles.aboutIntro__awardItem}>
              <span className={styles.aboutIntro__awardTag}>SCAN</span>
              <span className={styles.aboutIntro__awardTitle}>대학 정보보호 연합회 CTF</span>
              <span className={styles.aboutIntro__awardRank}>예선 2위 · 본선 6위</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}