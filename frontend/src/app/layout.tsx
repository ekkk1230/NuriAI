"use client";

import { usePathname } from 'next/navigation';
import Nav from '@/components/Nav';
import './globals.css';
import { useUiStore } from '@/store/useUiStore';
import ModalLayout from '@/components/Modal/ModalLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname() || "";

	const isDetailPage = pathname.startsWith('/storage');
	const isLoginPage = pathname.startsWith('/login');
	const isJoinPage = pathname.startsWith('/join');
 	const { isOpen } = useUiStore();

  return (
    <html>
      	<body>
			{isOpen && <ModalLayout />}
			
			<div className="wrap">
				{!isDetailPage && !isLoginPage && !isJoinPage && <Nav />}
				<main>
					{children}
				</main>
			</div>
		</body>
    </html>
  );
}