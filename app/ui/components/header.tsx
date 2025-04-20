"use client"; // Necesario para manejar estados y eventos en Next.js
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { NormalButton } from "./buttons";
import Link from "next/link";
import Cookies from "js-cookie";
import { useUser } from "@/context/user-context";

export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { user } = useUser();

    // Verificar autenticación al cargar el componente
    useEffect(() => {
        const token = Cookies.get('auth_token');
        const user = JSON.parse(localStorage.getItem('user') || '{}'); // Obtener datos del usuario
        if (token && user) {
            setIsAuthenticated(true);
        }
    }, []);

    // Cerrar menú al hacer clic fuera
    const handleClickOutside = (event: Event) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Manejar cierre de sesión
    const handleLogout = () => {
        Cookies.remove('auth_token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        window.location.href = "/"; // Redirigir a la página principal
    };

    return (
        <header className="flex flex-col md:flex-row items-center justify-between border border-blue-900 border-opacity-50 bg-blue-800 p-1 w-full shadow-lg">
            {/* Logo y nombre de la empresa */}
            <div className="flex items-center space-x-2 pl-4">
                <Link href="/">
                    <Image
                        src="/animals-logo1.png"
                        width={80}
                        height={80}
                        alt="CNU Logo"
                        className="w-16 h-16 rounded-full cursor-pointer"
                    />
                </Link>
                <Link href="/">
                    <h1 className="text-4xl font-bold text-custom-beige">CNU</h1>
                </Link>
            </div>

            {/* Botones sesion iniciada */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                {isAuthenticated && user? (
                    <div className="flex items-center space-x-8 md:pr-10">
                        <Link href="/dashboard">
    <div className="flex items-center space-x-2 group">
        <div className="w-10 h-10 rounded-full border-2 border-white border-opacity-30 group-hover:border-opacity-80 overflow-hidden transition-all duration-300">
            <Image 
                src={process.env.NEXT_PUBLIC_API_URL+user?.image_url}
                width={40} 
                height={40} 
                alt="Avatar" 
                className="object-cover"
            />
        </div>
        <span className="text-white group-hover:text-blue-200 transition-colors duration-300">
            {user.name}
        </span>
    </div>
</Link>
    <NormalButton
        text="CERRAR SESIÓN"
        color="bg-red-500"
        hoverClass="hover:bg-red-600 hover:shadow-inner"
        extraClass="text-white py-2 px-6 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)] transition-all duration-300"
        onClick={handleLogout}
/>
                    </div>
                ) : (
                    // {/* Botones sin iniciar sesion */}
                    <div className="flex flex-col md:flex-row justify-center items-start space-x-2 md:pr-10 w-auto text-1xl">
                        <Link href="/login">
    <NormalButton
        text="INICIAR SESIÓN →"
        color="bg-transparent"
        hoverClass="hover:text-blue-300"
        extraClass="text-white py-2 px-4 border-b-2 border-transparent hover:border-blue-300 transition-all duration-300"
    />
</Link>
<Link href="/registro">
    <NormalButton
        text="REGISTRARSE"
        color="bg-blue-600"
        hoverClass="hover:bg-blue-700 hover:shadow-md"
        extraClass="text-white py-2 px-6 rounded-full transition-all duration-300"
    />
</Link>
                    </div>
                )}
            </div>
        </header>
    );
}