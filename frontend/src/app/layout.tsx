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
        return (
            <html className="min-h-screen" lang="ko">
            <body className="min-h-screen">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-screen bg-[rgba(0,0,0,.6)]">
                        <div className="w-[5rem] h-[5rem] border-[.6rem] border-[#eee] border-t-[#ad46ff] rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {isOpen && <ModalLayout />}
                        <div className="wrap">
                            {!isStorageSubPage && !isWelcomePage && <Nav />}
                            <main>{children}</main>
                        </div>
                    </>
                )}
            </body>
        </html>
        )
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