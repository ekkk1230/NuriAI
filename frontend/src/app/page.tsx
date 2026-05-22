import { BsStars, BsSliders, BsGlobe, BsCheck2Circle } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";
function page() {
	const features = [
		{
			icon: <BsStars />,
			bgClass: "bg-feature-1",
			tit: "AI 기반 계획안 생성",
			cont: "AI가 교육 트렌드와 창의적 활동을 반영한 맞춤형 수업 계획안을 자동으로 생성합니다. 준비 과정은 더 가볍게, 수업은 더 풍성하게 만들어 보세요."
		},
		{
			icon: <BsSliders />,
			bgClass: "bg-feature-2",
			tit: "내 교실 맞춤형 커스텀",
			cont: "우리 반 아이들의 관심사와 발달 수준에 맞춰 키워드나 활동 형태(대·소집단, 자유놀이)를 몇 번의 클릭만으로 손쉽게 조정하고 현장에 바로 적용할 수 있습니다."
		},
		{
			icon: <BsGlobe />,
			bgClass: "bg-feature-3",
			tit: "트렌디한 시사·생태 교육 반영",
			cont: "다문화, 탄소중립, 기후변화, 미디어 리터러시 등 급변하는 사회적 트렌드와 생태 전환 교육에 맞춘 최신 놀이 소스들을 빠르게 만나보세요."
		},
		{
			icon: <BsCheck2Circle />,
			bgClass: "bg-feature-4",
			tit: "만 0세부터 5세 전 연령 가이드",
			cont: "걸음마 단계의 영아 표준보육과정부터 유아 누리과정까지 완벽히 이해합니다. 클릭 한 번으로 각 연령별 발달 수준에 딱 맞춘 단어와 규칙을 정밀하게 패치합니다."
		}
	];

	return (
		<div className="inner">
		
			{/* 1. 메인 상단 섹션 */}
			<section className="full-width-section bg-[url('/top-bg.png')] bg-no-repeat bg-center bg-cover !py-48">
				<p className="text-textLight text-center text-[6rem] font-bold mb-12">현직 교사를 위한<br />AI 교육 플랫폼, NuriAI</p>
				<p className="text-textLight text-center text-[3rem] leading-[1.6]">AI 기술을 활용하여 교육의 질을 높이고, 교사들의 업무 부담을 줄여드리는 서비스입니다.</p>
				<button className="btn-base mx-auto mt-16 rounded-[60rem] bg-bgCard px-16 py-8 text-[1.6rem] text-[#ad46ff] transition-transform duration-300 hover:scale-110">
					지금 바로 시작하기 <FaArrowRight />
				</button>
			</section>

			{/* 2. 샘플 미리보기 영역 */}
			<section className="py-[8rem]">
				<div className="mx-auto mb-16 text-center">
					<p className="text-[4rem] font-bold mb-6">AI가 생성한 계획안 미리보기</p>
					<p className="text-[1.8rem] text-textMuted font-medium">로그인 없이도 고퀄리티 교육 계획안 샘플을 확인해보세요.</p>
				</div>

				<div className="rounded-[2.4rem] bg-bgPreview padding-12 p-[3.2rem]">
				<div className="relative rounded-[2rem] bg-bgCard p-[2.6rem]">
					<p className="text-[2.8rem] font-bold mb-8">나비의 한살이</p>

					<ul className="absolute right-[1.4rem] top-[1.2rem] flex gap-[0.8rem]">
						<li>
							<span className="badge-base bg-age4 text-age4-text">만 4세</span>
						</li>
						<li>
							<span className="badge-base bg-cate5 text-cate5-text">자연탐구</span>
						</li>
					</ul>

					<ul className="flex flex-col gap-6">
					<li className="text-[1.6rem]">
						<span className="font-medium">활동 목표: </span>
						<span>나비의 성장 과정을 관찰하며 생명의 신비로움을 느낀다.</span>
					</li>
					<li className="text-[1.6rem]">
						<span className="font-medium">준비물: </span>
						<span>나비 그림 자료, 돋보기, 관찰 기록지</span>
					</li>
					</ul>
					<p className="mt-6 text-[1.6rem]">더 많은 내용은 워크스페이스에서 확인하세요.</p>
				</div>

				<button className="btn-base rounded-[2rem] text-[2.4rem] p-8 w-full mt-6 text-textLight bg-main-gradient">
					나만의 계획안 만들어보기 <FaArrowRight />
				</button>
				</div>
			</section>

			{/* 3. 특장점 영역 */}
			<section className="full-width-section bg-bgFeature">
				<div className="mx-auto mb-16 text-center">
					<p className="text-[4rem] font-bold mb-6">NuriAI의 특장점</p>
					<p className="text-[1.8rem] text-textMuted font-medium">현직 교사를 위한 똑똑한 AI 교육 플랫폼</p>
				</div>

				<ul className="grid grid-cols-2 gap-[2.4rem] mx-32">
				{features.map((item, index) => (
					<li key={index} className="bg-bgCard p-[3.2rem_2.8rem] rounded-[1.6rem] shadow-[0_0.8rem_2.4rem_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-3">
						<div className={`icon-box-base bg-feature-${index} ${item.bgClass}`}>{item.icon}</div>
						<p className="text-[2.6rem] font-medium mb-6">{item.tit}</p>
						<p className="text-[1.8rem] break-keep h-[5.4rem]">{item.cont}</p>
					</li>
				))}
				</ul>
			</section>

			{/* 4. 하단 시작하기 배너 */}
			<section className="full-width-section bg-main-gradient">
				<div className="mx-auto mb-16 text-center">
					<p className="text-[4rem] font-bold mb-6 text-textLight">지금 바로 시작해보세요!</p>
					<p className="text-[1.8rem] text-textLight font-medium">회원가입 없이도 AI 교육 계획안 생성을 체험할 수 있습니다.</p>
				</div>
				<button className="btn-base block mx-auto mt-16 rounded-[60rem] bg-bgCard px-16 py-8 text-[1.6rem] text-[#ad46ff] transition-transform duration-300 hover:scale-110">
					계획안 만들기 시작하기 <FaArrowRight />
				</button>
			</section>
		</div>
	);
}

export default page;