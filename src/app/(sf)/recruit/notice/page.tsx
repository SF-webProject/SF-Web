import styles from "../../sf.module.css";

export default function RecruitNoticePage() {
  return (
    <main className={styles.container} style={{ paddingTop: 110 }}>
      <section className={styles.sfSection}>
        <div className={styles.recruit__title}>
          <h2>RECRUIT</h2>
          <p>미래의 보안 전문가가 될 여러분을 기다립니다</p>
        </div>

        <div className={styles.recruit__section}>
          <div className={styles.recruit__sectionTitle}>모집 요강</div>
          <div className={styles.recruit__contentBox}>
            <ul className={styles.recruit__infoList}>
              <li>
                <span className={styles.recruit__highlight}>모집 일정:</span> 2026.00.00 (화) ~ 2026.00.00 (금) 23:59까지
              </li>
              <li>
                <span className={styles.recruit__highlight}>지원 자격:</span> 건국대학교 공과대학 &amp; 자유전공학부 학생 누구나
              </li>
              <li>
                <span className={styles.recruit__highlight}>지원 방법:</span> 상단의 QR 코드를 통해 지원서 작성 후 제출
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.recruit__section}>
          <div className={styles.recruit__sectionTitle}>SecurityFACT에서 다루는 기술</div>
          <div className={styles.recruit__contentBox}>
            <div className={styles.recruit__techGrid}>
              <div className={styles.recruit__techTag}>Pwnable</div>
              <div className={styles.recruit__techTag}>Web Hacking</div>
              <div className={styles.recruit__techTag}>Reversing</div>
              <div className={styles.recruit__techTag}>Digital Forensic</div>
              <div className={styles.recruit__techTag}>BlockChain Security</div>
              <div className={styles.recruit__techTag}>CS</div>
            </div>
          </div>
        </div>

        <div className={styles.recruit__section}>
          <div className={styles.recruit__sectionTitle}>유의사항을 꼭! 확인해주세요</div>
          <div className={styles.recruit__contentBox}>
            <ul className={styles.recruit__infoList}>
              <li>1년 활동 필수</li>
              <li>최종합격 이후에도, OT 불참 시 퇴출</li>
              <li>지원서 주의사항 필독</li>
              <li>서류합격 이후 대면 면접진행, 일정 조정 필요</li>
              <li>
                <span className={styles.recruit__highlight}>디자인</span>을 다룰 수 있으면 가산점! (After Effect, Illustrator)
              </li>
              <li>교육 및 세미나를 3회 이상 불참 시 퇴출 조치 (사유서 및 증빙자료 제출 필수)</li>
            </ul>
          </div>
        </div>

        <div className={styles.recruit__section}>
          <div className={styles.recruit__sectionTitle}>문의사항은 여기로 주세요!</div>
          <div className={styles.recruit__contactWrap}>
            <div className={styles.recruit__contactCard}>
              <h4>1. Phone Number</h4>
              <p style={{ margin: 0, fontSize: "1.1rem" }}><b>회장 노민영</b></p>
              <p className={styles.recruit__contactAccent} style={{ margin: "6px 0 0" }}>010-0000-0000</p>
            </div>

            <div className={styles.recruit__contactCard}>
              <h4>2. Instagram DM</h4>
              <p style={{ margin: 0, fontSize: "1.05rem" }}><b>@KU_SECURITY.FACT</b></p>
              <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>인스타그램 메시지를 통해 문의</p>
            </div>
          </div>
        </div>

        <div className={styles.recruit__applyArea}>
          <a href="#" className={styles.recruit__applyBtn}>지금 지원하기</a>
        </div>
      </section>
    </main>
  );
}