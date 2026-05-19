import { BsStars } from "react-icons/bs";
import { IoMdSchool } from "react-icons/io";
import { FaArrowRight, FaUserFriends, FaRegLightbulb  } from "react-icons/fa";


function page() {
    return (
        <>
            <div className="inner">
                <section className="section-top">
                    <p className="big-title">현직 교사를 위한<br />AI 교육 플랫폼, NuriAI</p>
                    <p className="small-title">AI 기술을 활용하여 교육의 질을 높이고, 교사들의 업무 부담을 줄여드리는 서비스입니다.</p>

                    <button className="btn-start sty1">지금 바로 시작하기 <FaArrowRight /></button>
                </section>

                <section className='section-preview'>
                    <div className="section-tit-area">
                        <p className='section-tit'>AI가 생성한 계획안 미리보기</p>
                        <p className='section-subTit'>로그인 없이도 고퀄리티 교육 계획안 샘플을 확인해보세요.</p>
                    </div>

                    <div className='plan-preview'>
                        <div className='plan-box'>
                            <p className="plan-tit">나비의 한살이</p>
                            <ul className="planItem-list">
                                <li>
                                    <span className="tit">활동 목표: </span>
                                    <span className="cont">나비의 성장 과정을 관찰하며 생명의 신비로움을 느낀다.</span>
                                </li>
                                <li>
                                    <span className="tit">준비물: </span>
                                    <span className="cont">나비 그림 자료, 돋보기, 관찰 기록지</span>
                                </li>
                            </ul>
                            <p className="plan-note">더 많은 내용은 워크스페이스에서 확인하세요.</p>
                        </div>

                        <button className="btn-start">나만의 계획안 만들어보기 <FaArrowRight /></button>
                    </div>
                </section>

                <section className='section-feature'>
                    <div className="section-tit-area">
                        <p className='section-tit'>NuriAI의 특장점</p>
                        <p className='section-subTit'>현직 교사를 위한 똑똑한 AI 교육 플랫폼</p>
                    </div>

                    <ul className='section-feature-list'>
                        <li>
                            <div className="icon-box"><BsStars /></div>
                            <p className="tit">AI 기반 계획안 생성</p>
                            <p className="cont">AI 기술을 활용하여 교사들이 시간과 노력을 절약할 수 있는 고품질의 교육 계획안을 자동으로 생성합니다.</p>
                        </li>
                        <li>
                            <div className="icon-box"><IoMdSchool /></div>
                            <p className="tit">표준보육과정 및 누리과정 완벽 반영</p>
                            <p className="cont">표준보육과정 및 누리과정의 내용을 완벽하게 반영하여 교사들이 쉽게 활용할 수 있는 교육 계획안을 제공합니다.</p>
                        </li>
                        <li>
                            <div className="icon-box"><FaUserFriends /></div>
                            <p className="tit">연령별 맞춤 활동</p>
                            <p className="cont">만 0세부터 5세까지 발달 단계에 맞는 맞춤형 활동을 추천합니다.</p>
                        </li>
                        <li>
                            <div className="icon-box"><FaRegLightbulb /></div>
                            <p className="tit">간편한 관리</p>
                            <p className="cont">생성된 계획안을 보관하고 PDF로 다운로드 하여 활용하세요.</p>
                        </li>
                    </ul>
                </section>

                <section className='section-start'>
                    <div className="section-tit-area">
                        <p className='section-tit'>지금 바로 시작해보세요!</p>
                        <p className='section-subTit'>회원가입 없이도 AI 교육 계획안 생성을 체험할 수 있습니다.</p>
                    </div>

                    <button className="btn-start sty1">계획안 만들기 시작하기 <FaArrowRight /></button>
                </section>
            </div>
        </>
    )
}

export default page