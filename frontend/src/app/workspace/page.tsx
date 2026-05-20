"use client";

import { useState } from "react";

function page() {
    const [plan, setPlan] = useState(null);

    return (
        <>
            <div className="control-panel">
                <p className="tit">설정</p>

                <div className="input-wrap">
                    <label htmlFor="topic" className="label">
                        주제 <span className="required">*</span>
                    </label>
                    <input type="text" id="topic" placeholder="주제를 입력해주세요." />
                </div>

                <div className="input-wrap">
                    <label htmlFor="activity-form" className="label">
                        활동 형태 <span className="required">*</span>
                    </label>
                    <button type="button" id="activity-form">대집단</button>
                    <button type="button" id="activity-form">소집단</button>
                </div>

                <div className="input-wrap">
                    <label htmlFor="activity-type" className="label">
                        활동 유형 (중복 선택 가능)<span className="required">*</span>
                    </label>
                    
                    <div className="type-btns" data-tab-id="1">
                        <button>이야기 나누기</button>
                        <button>동화·동시 감상</button>
                        <button>새 노래</button>
                        <button>게임</button>
                        <button>요리</button>
                    </div>
                    <div className="type-btns" data-tab-id="2">
                        <button>기본생활</button>
                        <button>신체운동</button>
                        <button>의사소통</button>
                        <button>사회관계</button>
                        <button>예술경험</button>
                        <button>자연탐구</button>
                    </div>
                </div>

                <button className="btn-start">AI 계획안 생성하기</button>

                <div className="note-box">
                    <p className="note-tit">사용 팁</p>
                    <ul className="note-list">
                        <li>만 0-2세는 소집단 영역 활동만 가능합니다.</li>
                        <li>만 3-5세는 대집단/소집단 선택 가능합니다.</li>
                        <li>여러 항목 선택 시 통합 활동 세트 생성</li>
                        <li>생성 후 각 활동 클릭으로 직접 수정 가능</li>
                    </ul>
                </div>
            </div>
            
            <div className="plan-container">
                {plan ? (
                    <div>fds</div>
                ) : (
                    <div>AI 계획안을 생성해주세요.</div>
                )}
            </div>
        </>
    )
}
export default page