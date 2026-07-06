"use client";

import { usePathname, useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import './globals.css';
import { useUiStore } from '@/store/useUiStore';
import ModalLayout from '@/components/Modal/ModalLayout';
import { useWelcomeStore } from '@/store/useWelcomeStore';
import { useEffect, useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() || "";
    const isStorageSubPage = pathname.startsWith('/storage/');
    const isWelcomePage = pathname.startsWith('/welcome');
    
    const { isOpen } = useUiStore();
    const { user, fetchUserInfo } = useWelcomeStore();
    const router = useRouter();
    
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            await fetchUserInfo(); 
            setIsLoading(false);
        };
        init();
    }, []);

    useEffect(() => {
        if (isLoading) return; 

        if (!user && !isWelcomePage) {
            router.push("/welcome/login");
        }
    }, [user, isWelcomePage, isLoading, router]);

    if (isLoading) {
        return <html lang="ko"><body><div className="loading">로딩 중...</div></body></html>;
    }

    return (
        <html className="min-h-screen" lang="ko">
            <body className="min-h-screen">
                {isOpen && <ModalLayout />}
                <div className="wrap">
                    {!isStorageSubPage && !isWelcomePage && <Nav />}
                    <main>{children}</main>
                </div>
            </body>
        </html>
    );
}