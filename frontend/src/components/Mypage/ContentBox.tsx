import React from 'react'

export function ContentBox({ title, subTitle, children }: { title: string, subTitle?: string, children: React.ReactNode }) {
    return (
        <div className="w-full h-[40rem] bg-white p-[2rem] rounded-2xl shadow-sm border border-gray-100 relative">
            <div className="mb-6">
                <h2 className="text-[2rem] font-semibold">{title}</h2>
                {subTitle && <p className="text-[1.4rem] font-semibold text-textMuted mb-[1.8rem]">{subTitle}</p>}
            </div>

            {children}
        </div>
    )
}