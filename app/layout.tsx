import './ui/globals.css';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}){
    return (
        <html lang="es">
        <body className='bg-custoom-beige'>
            {children}
        </body>
        </html>
    );
}