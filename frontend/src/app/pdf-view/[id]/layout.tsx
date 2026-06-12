export default function PdfLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="pdf-wrapper">
            {children}
        </div>
    );
}