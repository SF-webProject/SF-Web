import styles from "../../sf.module.css";

export default function AboutOrgPage() {
  return (
    <main className={styles.container} style={{ paddingTop: 110 }}>
      <section className={styles.sfSection}>
        <div className={styles.aboutOrg__title}>
          <h2>SecurityFACT 2학기 운영진 소개</h2>
          <p>조직 운영을 책임지는 운영진을 소개합니다</p>
        </div>

        <div className={styles.aboutOrg__chartWrap} aria-label="Organization Chart">
          <div className={styles.aboutOrg__grid}>
            <div className={`${styles.aboutOrg__person} ${styles.aboutOrg__top}`}>
              <div className={styles.aboutOrg__role}>회장</div>
              <div className={styles.aboutOrg__card}>
                <div className={styles.aboutOrg__avatar} aria-hidden="true" />
                <div className={styles.aboutOrg__name}>노민영</div>
              </div>
            </div>

            <div className={`${styles.aboutOrg__person} ${styles.aboutOrg__top}`}>
              <div className={styles.aboutOrg__role}>부회장</div>
              <div className={styles.aboutOrg__card}>
                <div className={styles.aboutOrg__avatar} aria-hidden="true" />
                <div className={styles.aboutOrg__name}>김휘성</div>
              </div>
            </div>

            <div className={styles.aboutOrg__person}>
              <div className={styles.aboutOrg__role}>총무</div>
              <div className={styles.aboutOrg__card}>
                <div className={styles.aboutOrg__avatar} aria-hidden="true" />
                <div className={styles.aboutOrg__name}>남유찬</div>
              </div>
            </div>

            <div className={styles.aboutOrg__person}>
              <div className={styles.aboutOrg__role}>기획</div>
              <div className={styles.aboutOrg__card}>
                <div className={styles.aboutOrg__avatar} aria-hidden="true" />
                <div className={styles.aboutOrg__name}>송현준</div>
              </div>
            </div>

            <div className={styles.aboutOrg__person}>
              <div className={styles.aboutOrg__role}>디자인</div>
              <div className={styles.aboutOrg__card}>
                <div className={styles.aboutOrg__avatar} aria-hidden="true" />
                <div className={styles.aboutOrg__name}>김가겸</div>
              </div>
            </div>

            <div className={styles.aboutOrg__person}>
              <div className={styles.aboutOrg__role}>12기 기장</div>
              <div className={styles.aboutOrg__card}>
                <div className={styles.aboutOrg__avatar} aria-hidden="true" />
                <div className={styles.aboutOrg__name}>안동기</div>
              </div>
            </div>
          </div>

          <div className={styles.aboutOrg__vision}>
            각 분야의 전문성을 바탕으로 끊임없이 정진하여
            <br />
            <span>미래의 보안 전문가로 성장합니다.</span>
          </div>
        </div>
      </section>
    </main>
  );
}