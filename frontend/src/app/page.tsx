import * as S from './main.css';

function page() {
    return (
        <div className={S.MainContainer}>
            <div className={S.TopSection}>
                <p className={S.BigTit}>현직 교사를 위한<br />AI 교육 플랫폼, NuriAI</p>
                <p className={S.SmTit}>AI 기술을 활용하여 교육의 질을 높이고, 교사들의 업무 부담을 줄여드리는 서비스입니다.</p>

                <button className={S.StartBtn}>지금 바로 시작하기</button>
            </div>
        </div>
    )
}

export default page