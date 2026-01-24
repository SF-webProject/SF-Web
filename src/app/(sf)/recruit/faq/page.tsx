import styles from "../../sf.module.css";

export default function RecruitFaqPage() {
  return (
    <main className={styles.container} style={{ paddingTop: 110 }}>
      <section className={`${styles.sfSection} ${styles.recruit__faqSection}`}>
        <div className={styles.recruit__sectionTitle}>자주 묻는 질문 (FAQ)</div>

        <div className={styles.recruit__contentBox}>
          <div className={styles.recruit__faqList}>
            <details className={styles.recruit__faqItem}>
              <summary>보안 지식이 전혀 없어도 지원 가능한가요?</summary>
              <div className={styles.recruit__faqAnswer}>
                네, 열정만 있다면 가능합니다! SecurityFACT는 신입 부원을 위한 기초 스터디와 커리큘럼을 운영하고 있어,
                기초부터 차근차근 배우며 성장할 수 있습니다.
              </div>
            </details>

            <details className={styles.recruit__faqItem}>
              <summary>면접은 어떤 방식으로 진행되나요?</summary>
              <div className={styles.recruit__faqAnswer}>
                서류 합격자에 한해 대면 면접이 진행됩니다. 기술적인 질문보다는 동아리 활동에 대한 의지, 협업 능력,
                그리고 정보보안에 대한 관심을 위주로 편안한 분위기에서 진행될 예정입니다.
              </div>
            </details>

            <details className={styles.recruit__faqItem}>
              <summary>학기 중에 활동 시간은 어떻게 되나요?</summary>
              <div className={styles.recruit__faqAnswer}>
                정기 세미나와 부서별 스터디는 부원들의 시간표를 취합하여 가장 가능한 시간에 진행됩니다.
                유의사항에 명시된 대로 정기 활동 불참 시 퇴출 조치가 있을 수 있으니 일정을 잘 확인해 주세요.
              </div>
            </details>

            <details className={styles.recruit__faqItem}>
              <summary>디자인 가산점은 구체적으로 어떤 건가요?</summary>
              <div className={styles.recruit__faqAnswer}>
                동아리 홍보물 제작, 웹사이트 UI 개선, 발표 자료 시각화 등에 도움을 주실 수 있는 분을 찾고 있습니다.
                After Effect나 Illustrator 활용 능력이 있다면 가산점이 부여됩니다.
              </div>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}