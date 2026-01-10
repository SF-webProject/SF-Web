// src/app/(sf)/page.tsx
import styles from "./sf.module.css";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroImageContainer}>
          <img
            src="/securityfact_logo_mid.png"
            alt="Hero Icon"
            className={styles.heroTopImg}
          />
        </div>

        <h1>SECURITY FACT</h1>
        <p>건국대학교 공과대학 정보보안 학술 동아리</p>
      </section>

      {/* ABOUT */}
      <main className={styles.container}>
        <h2 className={styles.sectionTitle}>About Us</h2>

        <div className={styles.aboutContent}>
          <p className={styles.aboutLeadTitle}>
            <strong>SecurityFACT (Security Family Against Cyber Terror)</strong>
          </p>

          <p className={styles.aboutLeadDesc}>
            2010년 최초 설립되었으며, 해킹 및 정보보안에 열정을 가진 건국대학교 학우분들로
            이루어진 공과대학 및 컴퓨터공학부 소속 동아리입니다.
          </p>

          <h3 className={styles.aboutSubTitle}>
            <span>2025년 1학기 주요 활동 현황</span>
          </h3>

          <div className={styles.activityList}>
            <div className={styles.activityItem}>다양한 스터디 (웹해킹, 시스템 해킹 등)</div>
            <div className={styles.activityItem}>연합 프로젝트 진행</div>
            <div className={styles.activityItem}>
              IFF-Securify 연합 세미나 (한양대 ICEWALL x 순천향대 SecurityFirst)
            </div>
            <div className={styles.activityItem}>
              국제 및 국내 해킹 방어 대회 출전 (핵테온 세종 본선 진출 등)
            </div>
            <div className={styles.activityItem}>외부 교육 참여 (Best of the Best, Whitehat)</div>
            <div className={styles.activityItem}>국내 대학 연합 컨퍼런스 발표 및 기술 교류</div>
          </div>

          <p className={styles.aboutNote}>
            정보보안은 굉장히 많은 분야를 지니고 있습니다. 저희는 그 본질을 탐구합니다.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Our Mission</h3>
            <p>
              단순한 기술 습득을 넘어 <em>보안의 &apos;진실(Fact)&apos;</em>을 규명합니다.
              화이트햇 해커로서의 윤리 의식을 바탕으로, 사이버 위협으로부터 세상을 보호하는
              강력한 방패가 되는 것이 우리의 사명입니다.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Major Awards</h3>
            <p>
              핵테온 세종 본선 진출을 비롯하여 국내외 유수의 CTF 대회에서 우수한 성적을 거두며
              팀의 기술력을 매년 입증하고 있습니다.
            </p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        &copy; 2025 Security Fact. All Rights Reserved. <br />
        Konkuk University College of Engineering
      </footer>
    </>
  );
}