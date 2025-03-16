"use client"; // Necesario para manejar estados y eventos en Next.js

import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

import { NormalButton } from '../../../ui/components/buttons';
import Link from 'next/link';
import { useState } from 'react';
import Spin from "@/app/ui/components/spin";
import { useNotification } from '@/context/NotificationContext';


export default function LoginPage() {
    // Estados para manejar los datos del formulario
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const {showNotification} = useNotification()

    // Función para manejar el envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        setError("");
        const formData = "username="+username+"&password="+password
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'token', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData,
            });
            
            const data = await response.json();
            if (response.status==401){
                showNotification( { message: 'Usuario o Contraseña Invalida', type: 'error' } )
                return
            }
            if (!response.ok) throw new Error(data.error || 'Error de autenticación');
            Cookies.set('auth_token', data.access_token, { secure: true, sameSite: 'strict' });
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 py-4">
            {loading &&(<Spin />)}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-10">
                    INICIAR SESION
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campo: Nombre de usuario */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nombre de Usuario
                        </label>
                            <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            />
                    </div>

                    {/* Campo: Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            />
                    </div>


                    <NormalButton
                        text='Iniciar Sesion'
                        color='bg-custom-green-400'
                        hoverClass='hover:bg-custom-green-500'
                        extraClass='w-full text-white py-2 px-4 rounded-md md:w-full transition-colors'
                        type='submit'
                    />
                </form>
                {/* Botón: Volver a Inicio */}
                <div className='mt-5'>
                    <Link href="/">
                        <NormalButton
                            text='Volver a Inicio'
                            color='text-blue-600'
                            hoverClass='hover:text-blue-400'
                            extraClass='w-full py-2 px-4 rounded-md md:w-full transition-colors'
                            type='button'
                        />
                    </Link>
                </div>  
            </div>
        </main>
    );
}