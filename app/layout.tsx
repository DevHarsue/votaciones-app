import './ui/globals.css';
import { NotificationProvider } from '@/context/NotificationContext';
import AuthProvider from '@/components/authProvider';
import { UserProvider } from '@/context/user-context';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}){
    return (
        <html lang="es">
        <body className='bg-custoom-beige'>
            <NotificationProvider>
                <UserProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </UserProvider>
            </NotificationProvider>
        </body>
        </html>
    );
}