import * as S from './Nav.css';
import { IoMdHome } from "react-icons/io";
import { AiFillBulb } from "react-icons/ai";
import { IoIosListBox } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import Link from 'next/link';

function Nav() {
  return (
    <nav className={S.navContainer}>
      <div className={S.logoContainer}>
        <img src="/logo.png" alt="Logo" />
        <p className={S.logoTxt}>AI 누리과정 조력자</p>
      </div>

      <ul className={S.navList}>
      <li className={S.navItem}>
        <Link href="/" className={S.navLink}>
          <span className={S.Icon}><IoMdHome /></span>
          메인
        </Link>
      </li>
      
      <li className={S.navItem}>
        <Link href="/main" className={S.navLink}>
          <span className={S.Icon}><AiFillBulb /></span>
          워크스페이스
        </Link>
      </li>
      
      <li className={S.navItem}>
        <Link href="/storage" className={S.navLink}>
          <span className={S.Icon}><IoIosListBox /></span>
          보관함
        </Link>
      </li>
      
      <li className={S.navItem}>
        <Link href="/mypage" className={S.navLink}>
          <span className={S.Icon}><FaUser /></span>
          마이페이지
        </Link>
      </li>
    </ul>
    </nav>
  )
}

export default Nav