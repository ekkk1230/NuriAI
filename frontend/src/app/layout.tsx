"use client";

import { usePathname, useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import './globals.css';
import { useUiStore } from '@/store/useUiStore';
import ModalLayout from '@/components/Modal/ModalLayout';
import { useWelcomeStore } from '@/store/useWelcomeStore';
import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname() || "";

	const isStorageSubPage = pathname.startsWith('/storage/');
	const isWelcomePage = pathname.startsWith('/welcome');
 	const { isOpen } = useUiStore();
	const { user, fetchUserInfo } = useWelcomeStore();

	const router = useRouter();

	useEffect(() => {
		if (!user) router.push("/welcome/login");
		// if (!user) router.push("/plans");
	}, []);

	useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

  return (
    <html>
      	<body>
			{isOpen && <ModalLayout />}

			<div className="wrap">
				{!isStorageSubPage && !isWelcomePage && <Nav />}
				<main>
					{children}
				</main>
			</div>
		</body>
    </html>
  );
}