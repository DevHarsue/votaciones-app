import './ui/globals.css';
import Header from "./ui/components/header";
import Footer from './ui/components/footer';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}){
    return (
        <html lang="es">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body className='bg-custoom-beige'>
            <div className="flex min-h-screen flex-col p-0">
                <Header / >
                {children}
                <Footer />
            </div>
        </body>
        </html>
    );
}