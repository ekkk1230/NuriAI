// page.tsx
import { BsStars, BsSliders, BsGlobe, BsCheck2Circle } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";
import * as styles from './styles/main.css';

function page() {
  const features = [
    {
      icon: <BsStars />,
      tit: "AI 기반 계획안 생성",
      cont: "AI가 교육 트렌드와 창의적 활동을 반영한 맞춤형 수업 계획안을 자동으로 생성합니다. 준비 과정은 더 가볍게, 수업은 더 풍성하게 만들어 보세요."
    },
    {
      icon: <BsSliders />,
      tit: "내 교실 맞춤형 커스텀",
      cont: "우리 반 아이들의 관심사와 발달 수준에 맞춰 키워드나 활동 형태(대·소집단, 자유놀이)를 몇 번의 클릭만으로 손쉽게 조정하고 현장에 바로 적용할 수 있습니다."
    },
    {
      icon: <BsGlobe />,
      tit: "트렌디한 시사·생태 교육 반영",
      cont: "다문화, 탄소중립, 기후변화, 미디어 리터러시 등 급변하는 사회적 트렌드와 생태 전환 교육에 맞춘 최신 놀이 소스들을 빠르게 만나보세요."
    },
    {
      icon: <BsCheck2Circle />,
      tit: "만 0세부터 5세 전 연령 가이드",
      cont: "걸음마 단계의 영아 표준보육과정부터 유아 누리과정까지 완벽히 이해합니다. 클릭 한 번으로 각 연령별 발달 수준에 딱 맞춘 단어와 규칙을 정밀하게 패치합니다."
    }
  ];

  return (
    <div className={styles.inner}>
      {/* 히어로 영역 */}
      <section className={styles.sectionTop}>
        <p className={styles.bigTitle}>현직 교사를 위한<br />AI 교육 플랫폼, NuriAI</p>
        <p className={styles.smallTitle}>AI 기술을 활용하여 교육의 질을 높이고, 교사들의 업무 부담을 줄여드리는 서비스입니다.</p>
        <button className={styles.btnStartSty1}>지금 바로 시작하기 <FaArrowRight /></button>
      </section>

      {/* 샘플 미리보기 영역 */}
      <section className={styles.sectionPlan}>
        <div className={styles.sectionTitArea}>
          <p className={styles.sectionTit}>AI가 생성한 계획안 미리보기</p>
          <p className={styles.sectionSubTit}>로그인 없이도 고퀄리티 교육 계획안 샘플을 확인해보세요.</p>
        </div>

        <div className={styles.planPreview}>
          <div className={styles.planBox}>
            <p className={styles.planTit}>나비의 한살이</p>

            <ul className={styles.planCategory}>
                <li>
                    <span className={styles.badgeStyles.age4}>만 4세</span>
                </li>
                <li>
                    <span className={styles.badgeStyles.cate5}>자연탐구</span>
                </li>
            </ul>

            <ul className={styles.planItemList}>
              <li>
                <span className="tit">활동 목표: </span>
                <span className="cont">나비의 성장 과정을 관찰하며 생명의 신비로움을 느낀다.</span>
              </li>
              <li>
                <span className="tit">준비물: </span>
                <span className="cont">나비 그림 자료, 돋보기, 관찰 기록지</span>
              </li>
            </ul>
            <p className={styles.planNote}>더 많은 내용은 워크스페이스에서 확인하세요.</p>
          </div>

          <button className={styles.btnStartFull}>나만의 계획안 만들어보기 <FaArrowRight /></button>
        </div>
      </section>

      {/* 특장점 영역 (배열 반복문을 돌려 인덱스로 그라디언트를 동적 매핑) */}
      <section className={styles.sectionFeature}>
        <div className={styles.sectionTitArea}>
          <p className={styles.sectionTit}>NuriAI의 특장점</p>
          <p className={styles.sectionSubTit}>현직 교사를 위한 똑똑한 AI 교육 플랫폼</p>
        </div>

        <ul className={styles.sectionFeatureList}>
          {features.map((item, index) => (
            <li key={index} className={styles.featureCard}>
              <div className={styles.featureIconStyles[index]}>{item.icon}</div>
              <p className="tit">{item.tit}</p>
              <p className="cont">{item.cont}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 하단 시작하기 배너 */}
      <section className={styles.sectionStart}>
        <div className={styles.sectionTitArea}>
          <p className={styles.sectionTit}>지금 바로 시작해보세요!</p>
          <p className={styles.sectionSubTit}>회원가입 없이도 AI 교육 계획안 생성을 체험할 수 있습니다.</p>
        </div>
        <button className={styles.btnStartSty1}>계획안 만들기 시작하기 <FaArrowRight /></button>
      </section>
    </div>
  );
}

export default page;