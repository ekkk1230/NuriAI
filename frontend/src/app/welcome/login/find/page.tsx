"use client";

import FindForm from "@/components/Login/FindForm";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function page() {
    const searchParam = useSearchParams();
    const findType = searchParam.get('findType');
    // console.log(findType)

    if (!findType) {
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <h2 className="text-[2rem] font-bold text-gray-800 mb-[1rem]">잘못된 접근입니다</h2>
            <p className="text-[1.4rem] text-textMuted mb-[2rem]">
              요청하신 페이지 정보를 찾을 수 없습니다. <br />
              다시 로그인 페이지로 돌아가 시도해주세요.
            </p>
            <Link 
              href="/welcome/login" 
              className="bg-main-gradient mt-[2rem] rounded-[.8rem] p-[1rem] w-[80%] block !text-textLight font-semibold text-[1.8rem]"
            >
              로그인 페이지로 돌아가기
            </Link>
          </div>
        );
      }
    
    return (
        <FindForm findType={findType} />
    )
}
