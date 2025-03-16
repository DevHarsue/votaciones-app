import './ui/globals.css';
import { NotificationProvider } from '@/context/NotificationContext';
import AuthProvider from '@/components/authProvider';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}){
    return (
        <html lang="es">
        <body className='bg-custoom-beige'>
            <NotificationProvider>
            <AuthProvider>{children}</AuthProvider>
            </NotificationProvider>
        </body>
        </html>
    );
}