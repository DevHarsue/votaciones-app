import './ui/globals.css';
import { NotificationProvider } from '@/context/NotificationContext';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}){
    return (
        <html lang="es">
        <body className='bg-custoom-beige'>
            <NotificationProvider>
            {children}
            </NotificationProvider>
        </body>
        </html>
    );
}