'use client';
import { useEffect } from 'react';
import './pdf-only.css';

export default function PdfPage({ params }: { params: { id: string } }) {
    useEffect(() => {
        const triggerPdf = async () => {
            const html2pdf = (await import("html2pdf.js")).default;
            const element = document.getElementById('pdf-content');
            if (!element) return;

            const opt = {
                margin: 2,
                filename: '계획안.pdf',
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
            };

            await html2pdf().set(opt).from(element).save();
            
            // PDF 저장이 끝나면 창을 닫음
            window.close();
        };

        triggerPdf();
    }, []);

    return <div id="pdf-content" className="pdf-container">...계획안 내용...</div>;
}