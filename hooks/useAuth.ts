'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';


export const useAuth = () => {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = Cookies.get('auth_token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'validate_token', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (!response.ok) throw new Error('Token inválido');
                
            } catch (error) {
                Cookies.remove('auth_token');
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);
};