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

  return (
    <nav className={S.navContainer}>
      <div className={S.logoContainer}>
        <img src="/logo.png" alt="Logo" />
        <p className={S.logoTxt}>교사 맞춤형 AI 조력자, NuriAI</p>
      </div>

      <ul className={S.navList}>
        <li className={S.navItem}>
          <Link href="/" className={`${S.navLink} ${pathname === '/' ? S.active : ''}`}>
            <span className={S.Icon}><IoMdHome /></span>
            메인
          </Link>
        </li>
        
        <li className={S.navItem}>
          <Link href="/main" className={`${S.navLink} ${pathname === '/main' ? S.active : ''}`}>
            <span className={S.Icon}><AiFillBulb /></span>
            워크스페이스
          </Link>
        </li>
        
        <li className={S.navItem}>
          <Link href="/storage" className={`${S.navLink} ${pathname === '/storage' ? S.active : ''}`}>
            <span className={S.Icon}><IoIosListBox /></span>
            보관함
          </Link>
        </li>
        
        <li className={S.navItem}>
          <Link href="/mypage" className={`${S.navLink} ${pathname === '/mypage' ? S.active : ''}`}>
            <span className={S.Icon}><FaUser /></span>
            마이페이지
          </Link>
        </li>
      </ul>

      <div className={S.logoBottom}>
        <div className={S.bottomBox}>
          <img src="/nav-bottom.png" alt="" />
        </div>
      </div>
    </nav>
  );
}

export default Nav;