import { ContentBox } from './ContentBox'
import { recentViewPlan } from '@/type/Mypage'
import Link from 'next/link'
import { IoDocumentTextOutline } from 'react-icons/io5'
import NoPlan from '../Planner/NoPlan'
import { useMypageStore } from '@/store/useMypageStore'
import { LoadingSkeleton } from '../Loading/LoadingSkeleton'

export default function MyRecentViewList() {
    const { isRecentLoading, recentViewPlans } = useMypageStore();
    // console.log(recentViewPlans)
    // console.log(isRecentLoading, recentViewPlans)

    return (
        <ContentBox title="최근 조회한 계획안">
            {isRecentLoading 
            ? (
                <LoadingSkeleton />
            ) 
            : (
                recentViewPlans.length >= 1
                ? (
                    <ul>
                        {recentViewPlans.slice(0, 4).map((p, idx) => (
                            <li key={`${p}-${idx}`} className="relative flex flex-wrap flex-row items-center w-full p-[1.4rem_1.2rem]">
                                <div className="w-[5rem] h-[5rem] flex items-center justify-center bg-act4 rounded-[1.2rem] mr-[1.6rem]">
                                    <IoDocumentTextOutline className="text-act4-text text-[3rem]" />
                                </div>
                                <div className="w-[calc(100%-6.6rem)]">
                                    <Link href={`/storage/${p.planId}`}>
                                        <p className="font-bold text-[1.6rem] mb-[.4rem]">{p.mainTheme}</p>
                                    </Link>
                                    <div className="flex font-semibold text-textMuted">
                                        <p className="text-[1.4rem] after:content-['•'] after:mx-[.4rem] flex after:text-textMuted after:block">{p.age}</p>
                                        <Link href={`/storage?author=${p.author}`} className="text-[1.4rem] !text-blue-500">@{p.author}</Link> 
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )
                : (
                    <NoPlan txt="최근 조회한 계획안이 없습니다." />
                )
            )}
        </ContentBox>
    )
}
