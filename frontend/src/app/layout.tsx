import Nav from './components/Nav/page';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
          <div className="wrap">
            <Nav />
            <main>
              {children}
            </main>
          </div>
      </body>
    </html>
  );
}