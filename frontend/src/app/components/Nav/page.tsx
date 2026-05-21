'use client';

import * as S from './Nav.css';
import { IoMdHome } from "react-icons/io";
import { AiFillBulb } from "react-icons/ai";
import { IoIosListBox } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Nav() {
  	const pathname = usePathname();

	const getLinkClass = (path: string) => {
		const baseClass = "text-[1.6rem] flex items-center p-[1rem_2rem] rounded-[0.8rem] hover:bg-[rgba(114,118,124,0.1)] transition-colors duration-200";
		const activeClass = "text-[#154ea3] font-semibold bg-[rgba(21,78,163,0.1)] hover:bg-[rgba(21,78,163,0.1)]";
		return `${baseClass} ${pathname === path ? activeClass : ''}`;
	};

  return (
		<nav className="w-[30rem] h-[100vh] bg-textLight min-w-[30rem] border-r-[0.1rem] border-solid border-[#eee] px-[2rem] sticky top-0 left-0">
			<div className="w-[calc(100%_+_4rem)] relative -left-[2rem] flex flex-col items-center py-[2rem] border-b-[0.1rem] border-solid border-[#eee]">
				<img src="/logo.png" alt="Logo" className="w-[16rem] h-auto mb-[1.6rem] object-contain" />
				<p className="text-[1.6rem]">교사 맞춤형 AI 조력자, NuriAI</p>
			</div>

			<ul className="mt-[2rem] space-y-[1rem]">
				<li className="">
				<Link href="/" className={getLinkClass('/')}>
					<span className="block text-[2rem] mr-[.8rem]"><IoMdHome /></span>
					메인
				</Link>
				</li>
				
				<li className="">
				<Link href="/workspace" className={getLinkClass('/workspace')}>
					<span className="block text-[2rem] mr-[.8rem]"><AiFillBulb /></span>
					워크스페이스
				</Link>
				</li>
				
				<li className="">
				<Link href="/storage" className={getLinkClass('/storage')}>
					<span className="block text-[2rem] mr-[.8rem]"><IoIosListBox /></span>
					보관함
				</Link>
				</li>
				
				<li className="">
				<Link href="/mypage" className={getLinkClass('/mypage')}>
					<span className="block text-[2rem] mr-[.8rem]"><FaUser /></span>
					마이페이지
				</Link>
				</li>
			</ul>

			<div className="w-[calc(100% + 4rem)] absolute -left-[2rem] border-t-[0.1rem] border-solid border-[#eee] p-[2rem] bottom-0">
				<div className="w-[100%]">
				<img src="/nav-bottom.png" alt="" className="block m-[0_auto] w-[80%] h-auto object-contain" />
				</div>
			</div>
		</nav>
	);
}

export default Nav;