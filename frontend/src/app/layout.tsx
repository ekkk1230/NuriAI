"use client";

import { usePathname } from 'next/navigation';
import Nav from './components/Nav/page';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDetailPage = /^\/storage\/.+/.test(pathname);
  return (
    <html>
      <body>
          <div className="wrap">
            { !isDetailPage && <Nav />}
            <main>
              {children}
            </main>
          </div>
      </body>
    </html>
  );
}