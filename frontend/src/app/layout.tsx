"use client";

import { usePathname } from 'next/navigation';
import Nav from '@/components/Nav';
import './globals.css';
import { useUiStore } from '@/store/useUiStore';
import ModalLayout from '@/components/Modal/ModalLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname() || "";

	const isDetailPage = pathname.startsWith('/storage');
	const isWelcomePage = pathname.startsWith('/welcome');
 	const { isOpen } = useUiStore();

  return (
    <html>
      	<body>
			{isOpen && <ModalLayout />}

			<div className="wrap">
				{!isDetailPage && !isWelcomePage && <Nav />}
				<main>
					{children}
				</main>
			</div>
		</body>
    </html>
  );
}