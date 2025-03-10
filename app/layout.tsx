import './ui/globals.css';
import { NotificationProvider } from '@/context/NotificationContext';
import { Providers } from './providers';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}){
    return (
        <html lang="es">
        <body className='bg-custoom-beige'>
            <NotificationProvider>
            <Providers>{children}</Providers>
            </NotificationProvider>
        </body>
        </html>
    );
}