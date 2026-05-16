import Nav from './components/Nav/page';

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