
import { DOMAIN_STYLES } from '@/constants/activityOptions';
import { Activity } from '@/type/Activity';
import { Plan } from '@/type/Plan';

export default function PlanDetail({ item, idx, plan }: { item: Activity, idx: number, plan: Plan }) {
    return (
        <div 
            key={idx}
            style={{ '--domain-line-color': `var(--color-cate${item.domain === "기본생활" || item.domain === "기본생활·신체" ? 0 : item.domain === "신체운동" || item.domain === "신체운동·건강" ? 1 : item.domain === "의사소통" ? 2 : item.domain === "사회관계" ? 3 : item.domain === "예술경험" ? 4 : 5})` } as React.CSSProperties}
            className="relative bg-bgCard rounded-[1.2rem] mb-[10rem] shadow-sm p-[3rem_3rem_3rem_4.5rem] before:content-[''] before:absolute before:top-0 before:left-0 before:w-[.8rem] before:h-[100%] before:rounded-[1.2rem_0_0_1.2rem] before:rounded-l-[1.2rem] before:bg-[var(--domain-line-color)]"
        >
            <div className="flex gap-[1rem] items-center mb-[1rem]">
                <p className={`text-[1.2rem] inline-block p-[.8rem_1.2rem] font-semibold rounded-[60rem] ${DOMAIN_STYLES[item.domain as keyof typeof DOMAIN_STYLES]}`}>
                    {item.domain}
                </p>

                <span className="text-textMuted text-[1.2rem] font-semibold">활동 {idx + 1} / {plan.plans.length}</span>
            </div>

            <p className="text-[2.4rem] my-[2rem] font-bold">{item.activityName}</p>

            <div className="mb-[2rem]">
                <p className="text-[2rem] font-semibold mb-[1rem]">기대 효과</p>
                <ul className="space-y-1 pl-[1rem] mb-[2.4rem]"> 
                    {item.objectives.map((obj, idx) => (
                        <li className="before:content-['•'] before:text-main before:mr-[.8rem] text-[1.6rem]" key={idx}>
                            {obj}
                        </li>
                    ))}
                </ul>

                <p className="text-[2rem] font-semibold mb-[1.2rem]">연계 교육과정</p>
                
                <div className="flex flex-col gap-[1.2rem] pl-[0.4rem]">
                    {item.relatedCurriculum.map((curriculum, idx) => {
                        const steps = curriculum.split(/\s*>\s*/); 

                        return (
                            <div key={idx} className="flex flex-wrap items-center gap-[0.8rem] text-[1.4rem]">
                                {steps.map((step, stepIdx) => (
                                    <div key={stepIdx} className="flex items-center gap-[0.8rem]">
                                        <span className={`p-[0.4rem_1.2rem] rounded-[0.8rem] font-semibold tracking-tight ${
                                            stepIdx === 0 
                                                ? 'bg-blueActive/10 text-blueActive'
                                                : 'bg-[#f8f9fa] border border-solid border-[#eee] text-textMuted font-medium' 
                                        }`}>
                                            {step}
                                        </span>
                                        
                                        {stepIdx < steps.length - 1 && (
                                            <span className="text-[#bbb] text-[1.2rem] font-normal font-mono select-none">▶</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mb-[2rem]">
                <p className="text-[2rem] font-semibold mb-[1.6rem]">활동 방법</p>
                
                <div className="flex flex-col gap-[2.4rem] pl-[0.4rem] relative before:content-[''] before:absolute before:left-[1.5rem] before:top-[1rem] before:w-[0.2rem] before:h-[calc(100%-2rem)] before:bg-[#eee]">
                    
                    {/* 도입 */}
                    {item.introduction && (
                        <div className="relative pl-[3.6rem] mb-[2rem]">
                            <div className="absolute left-[0.5rem] top-[0.4rem] w-[1.6rem] h-[1.6rem] rounded-full bg-blueActive border-[4px] border-solid border-white shadow-sm z-10" />
                            
                            <div className="flex flex-col gap-[0.8rem]">
                                <span className="text-[1.4rem] font-bold text-blueActive">도입</span>
                                                                                    
                                <div className="bg-white border border-[#e9ecef] p-[2rem] rounded-[1.6rem] shadow-sm flex flex-col gap-[1.6rem]">
                                    {/* 활동 내용 섹션 */}
                                    <div className="flex flex-col gap-[0.6rem]">
                                        <h4 className="text-[1.4rem] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-[0.6rem]">
                                            <span className="w-[0.8rem] h-[0.8rem] rounded-full bg-blueActive"></span>
                                            활동 내용
                                        </h4>
                                        <p className="text-[1.6rem] text-[#333] leading-relaxed whitespace-pre-line bg-[#f8f9fa] p-[1.2rem] rounded-[0.8rem]">
                                            {item.introduction.description}
                                        </p>
                                    </div>

                                    {/* 교사 발문 섹션 */}
                                    <div className="flex flex-col gap-[0.6rem]">
                                        <h4 className="text-[1.4rem] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-[0.6rem]">
                                            <span className="w-[0.8rem] h-[0.8rem] rounded-full bg-secondary"></span>
                                            교사 발문
                                        </h4>
                                        <div className="text-[1.6rem] text-[#444] leading-relaxed whitespace-pre-line border-l-4 border-secondary pl-[1.6rem] py-[0.4rem] italic bg-[#fffaf0]">
                                            "{item.introduction.teacherTalk}"
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 전개 */}
                    {item.development && (
                        <div className="relative pl-[3.6rem] mb-[2rem]">
                            <div className="absolute left-[0.5rem] top-[0.4rem] w-[1.6rem] h-[1.6rem] rounded-full bg-main border-[4px] border-solid border-white shadow-sm z-10" />
                            
                            <div className="flex flex-col gap-[0.6rem]">
                                <span className="text-[1.4rem] font-bold text-main">전개</span>
                                
                                <div className="bg-white border border-[#e9ecef] p-[2rem] rounded-[1.6rem] shadow-sm flex flex-col gap-[1.6rem]">
                                    {/* 활동 내용 섹션 */}
                                    <div className="flex flex-col gap-[0.6rem]">
                                        <h4 className="text-[1.4rem] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-[0.6rem]">
                                            <span className="w-[0.8rem] h-[0.8rem] rounded-full bg-main"></span>
                                            활동 내용
                                        </h4>
                                        <p className="text-[1.6rem] text-[#333] leading-relaxed whitespace-pre-line bg-[#f8f9fa] p-[1.2rem] rounded-[0.8rem]">
                                            {item.development.description}
                                        </p>
                                    </div>

                                    {/* 교사 발문 섹션 */}
                                    <div className="flex flex-col gap-[0.6rem]">
                                        <h4 className="text-[1.4rem] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-[0.6rem]">
                                            <span className="w-[0.8rem] h-[0.8rem] rounded-full bg-secondary"></span>
                                            교사 발문
                                        </h4>
                                        <div className="text-[1.6rem] text-[#444] leading-relaxed whitespace-pre-line border-l-4 border-secondary pl-[1.6rem] py-[0.4rem] italic bg-[#fffaf0]">
                                            "{item.development.teacherTalk}"
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 마무리 */}
                    {item.conclusion && (
                        <div className="relative pl-[3.6rem]">
                            <div className="absolute left-[0.5rem] top-[0.4rem] w-[1.6rem] h-[1.6rem] rounded-full bg-gray-400 border-[4px] border-solid border-white shadow-sm z-10" />
                            <div className="flex flex-col gap-[0.6rem]">
                                <span className="text-[1.4rem] font-bold text-gray-500">마무리</span>
                                
                                <div className="bg-white border border-[#e9ecef] p-[2rem] rounded-[1.6rem] shadow-sm flex flex-col gap-[1.6rem]">
                                    {/* 활동 내용 섹션 */}
                                    <div className="flex flex-col gap-[0.6rem]">
                                        <h4 className="text-[1.4rem] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-[0.6rem]">
                                            <span className="w-[0.8rem] h-[0.8rem] rounded-full bg-gray-500"></span>
                                            활동 내용
                                        </h4>
                                        <p className="text-[1.6rem] text-[#333] leading-relaxed whitespace-pre-line bg-[#f8f9fa] p-[1.2rem] rounded-[0.8rem]">
                                            {item.conclusion.description}
                                        </p>
                                    </div>

                                    {/* 교사 발문 섹션 */}
                                    <div className="flex flex-col gap-[0.6rem]">
                                        <h4 className="text-[1.4rem] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-[0.6rem]">
                                            <span className="w-[0.8rem] h-[0.8rem] rounded-full bg-secondary"></span>
                                            교사 발문
                                        </h4>
                                        <div className="text-[1.6rem] text-[#444] leading-relaxed whitespace-pre-line border-l-4 border-secondary pl-[1.6rem] py-[0.4rem] italic bg-[#fffaf0]">
                                            "{item.conclusion.teacherTalk}"
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <div className="flex gap-[1.6rem] my-[1.6rem]">
                <div className="flex-1 border-solid border-[.2rem] bg-[#ddeaf9] border-[#86bcff] p-[2rem] rounded-[1.2rem]">
                    <p className="text-[1.8rem] font-bold text-[#1e40af] mb-[1.2rem]"><span className="text-[2rem]">🎒</span> 준비물</p>

                    <ul className="flex flex-wrap gap-[0.8rem]">
                        {item.materials.map((data, idx) => (
                            <li 
                                className="text-[1.4rem] font-semibold rounded-[60rem] bg-bgCard p-[0.6rem_1.4rem] border-[#86bcff] border-solid border text-[#2563eb] shadow-sm" 
                                key={idx}
                            >
                                {data}
                            </li>
                        ))}
                    </ul>
                </div>

                {item.precautions && item.precautions.length > 0 && (
                    <div className="flex-1 border-solid border-[.2rem] bg-[#fff5f5] border-[#feb2b2] p-[2rem] rounded-[1.2rem]">
                        <p className="text-[1.8rem] font-bold text-[#9b2c2c] mb-[1rem] flex items-center gap-[0.6rem]">
                            <span className="text-[2rem]">⚠️</span> 유의 사항
                        </p>
                        <ul className="space-y-1.5 pl-[0.4rem]">
                            {item.precautions.map((pre, idx) => (
                                <li 
                                    className="text-[1.5rem] text-[#4a5568] font-medium leading-relaxed before:content-['•'] before:text-[#e53e3e] before:mr-[0.8rem]" 
                                    key={idx}
                                >
                                    {pre}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {item.extensionActivity && (
                    <div className="flex-1 border-solid border-[.2rem] bg-[#f3f0ff] border-[#d6bbfb] p-[2rem] rounded-[1.2rem]">
                        <p className="text-[1.8rem] font-bold text-[#5b21b6] mb-[1rem] flex items-center gap-[0.6rem]">
                            <span className="text-[2rem]">✨</span> 확장 활동
                        </p>
                        <div className="pl-[0.4rem] text-[1.5rem] text-[#4a5568] font-medium leading-relaxed">
                            {item.extensionActivity}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
