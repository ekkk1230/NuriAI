'use client';
import { useEffect } from 'react';
import './pdf-only.css';
import { useParams } from 'next/navigation';
import { usePlanStore } from '@/store/usePlanStore';
import { DOMAIN_MAP } from '@/constants/activityOptions';

export default function PdfPage() {
    const params = useParams();
    const id = params.id;

    const { planStorage, fetchPlanById } = usePlanStore();
    
    useEffect(() => {
        if (!id) return;

        const processPdf = async () => {
            await fetchPlanById(Number(id));
            await new Promise((resolve) => setTimeout(resolve, 500));

            const html2pdf = (await import("html2pdf.js")).default;

            const element = document.getElementById('pdf-content');
            if (!element) return;

            const opt = {
                filename: '계획안.pdf',
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
            };

            await html2pdf().set(opt).from(element).save();
            
            // PDF 저장이 끝나면 창을 닫음
            //window.close();
        };

        processPdf();
    }, [id, fetchPlanById]);

    const plan = planStorage.find(p => p.id === Number(id));

    if (!plan) return <div>로딩 중...</div>

    return (
        <div id="pdf-content" className="pdf-container">
            {plan.plans.map((p, index) => {
                return (
                    <div key={index}>
                        <div>
                            <span className={`domain ${
                                Object.keys(DOMAIN_MAP).find(key => p.domain.includes(key)) 
                                    ? DOMAIN_MAP[Object.keys(DOMAIN_MAP).find(key => p.domain.includes(key))!] 
                                    : 'domainDefault'
                            }`}>
                                {p.domain}
                            </span>
                            <span className="paln-count">활동 {index + 1} / {plan.plans.length}</span>
                        </div>
                        <p>{p.activityName}</p>

                        <div>
                            <p>기대 효과</p>
                            <ul>
                                {p.objectives.map((obj, idx) => (
                                    <li key={idx}>{obj}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p>연계 교육과정</p>
                            <div>
                                {p.relatedCurriculum.map((curriculum,idx) => {
                                    const steps = curriculum.split(/\s*>\s*/);

                                    return (
                                        <div key={idx}>
                                            {steps.map((step, stepIdx) => (
                                                <span>
                                                    {step}
                                                </span>
                                            ))}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}