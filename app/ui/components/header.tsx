"use client"; // Necesario para manejar estados y eventos en Next.js
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { NormalButton } from "./buttons";
import Link from "next/link";
import Cookies from "js-cookie";
import { useUser } from "@/context/user-context";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState("Usuario"); // Nombre del usuario
    const [userImage, setUserImage] = useState("/default-user.png"); // Imagen del usuario
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { user } = useUser();

    // Verificar autenticación al cargar el componente
    useEffect(() => {
        const token = Cookies.get('auth_token');
        const user = JSON.parse(localStorage.getItem('user') || '{}'); // Obtener datos del usuario
        if (token && user) {
            setIsAuthenticated(true);
            setUserName(user.name || "Usuario");
            setUserImage(user.image || "/default-user.png");
        }
    }, []);

    // Cerrar menú al hacer clic fuera
    const handleClickOutside = (event: Event) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
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
                <h1 className="text-4xl font-bold text-custom-beige">CNU</h1>
            </div>

            {/* Botones sesion iniciada */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                {isAuthenticated && user? (
                    <div className="flex items-center space-x-8 md:pr-10">
                        <Link href="/dashboard">
                            <div className="flex items-center space-x-2">
                                <Image
                                    src={process.env.NEXT_PUBLIC_API_URL+user?.image}
                                    width={40}
                                    height={40}
                                    alt="User Image"
                                    className="w-10 h-10 rounded-full bg-red-200"
                                />
                                <span className="text-white cursor:pointer hover:text-blue-400 px-2">{user.name}</span>
                            </div>

                        </Link>
                        <NormalButton
                            text="CERRAR SESIÓN 🔒 "
                            color="bg-transparent"
                            hoverClass="hover:bg-red-700"
                            extraClass="text-white py-2 px-4 rounded-md border "
                            type="button"
                            onClick={handleLogout}
                        />
                    </div>
                ) : (
                    // {/* Botones sin iniciar sesion */}
                    <div className="flex flex-col md:flex-row justify-center items-start space-x-2 md:pr-10 w-auto text-1xl">
                        <Link href="/login">
                            <NormalButton
                                text="INICIAR SESIÓN 🔓 "
                                color="bg-transparent"
                                hoverClass="hover:text-blue-400"
                                extraClass="text-white py-2 px-4 rounded-md"
                                type="button"
                            />
                        </Link>
                        <Link href="/registro">
                            <NormalButton
                                text="REGISTRARSE 👤 "
                                color="bg-transparent"
                                hoverClass="hover:text-blue-400"
                                extraClass="text-white py-2 px-2 rounded-md w-full"
                                type="button"
                            />
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}