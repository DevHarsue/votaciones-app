'use client';

import { useEffect} from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useUser } from '@/context/user-context';

export default function AuthProvider({children}: {children: React.ReactNode;}) {

    const router = useRouter();
    const { setUser } = useUser(); 

    useEffect(() => {
        const validateToken = async () => {
            const token = Cookies.get('auth_token');
            if (!token) return;

            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'validate_token', {
                    headers: { Authorization: `Bearer ${token}` },
                    
                });
                
                if (!response.ok) throw new Error('Token inválido');
                const data = await response.json()
                setUser(data);
            } catch (error) {
                console.log(error)
                Cookies.remove('auth_token');
                router.push('/login');
            }
        };

        validateToken();
    }, [router,setUser]);

    return <>{children}</>
}