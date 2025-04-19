"use client";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import Spin from "./spin";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const { user } = useUser();
    const router = useRouter();
    
    if (user == null) return <Spin />;

    return (
        <>
            {/* Versión mobile (header) - Estilo específico solicitado */}
            <div className="md:hidden flex flex-col items-center bg-blue-800 w-full">
                {/* Logo de CNU */}
                <Link href="/">
                    <div className="mb-4 mt-1">
                        <Image
                            width={100}
                            height={100}
                            src="/animals-logo1.png"
                            alt="CNU Logo"
                            className="w-20 h-20 rounded-full overflow-hidden cursor-pointer"
                        />
                    </div>
                </Link>

                {/* Título */}
                <h1 className="text-4xl font-bold text-custom-beige mb-6">CNU</h1>

                {/* Botones en columna para mobile */}
                <div className="w-full flex flex-col">
                    <Link href="/dashboard" className="flex-grow">
                        <div className="w-full text-white py-3 px-4 text-center border-t border-blue-700 bg-blue-900 hover:bg-blue-800 transition-colors">
                            Inicio
                        </div>
                    </Link>
                    
                    {user.rol == "ADMIN" && (
                        <Link href="/dashboard/usuarios" className="flex-grow">
                            <div className="w-full text-white py-3 px-4 text-center border-t border-blue-700 bg-blue-900 hover:bg-blue-800 transition-colors">
                                Usuarios
                            </div>
                        </Link>
                    )}

                    <Link href="/dashboard/artistas" className="flex-grow">
                        <div className="w-full text-white py-3 px-4 text-center border-t border-blue-700 bg-blue-900 hover:bg-blue-800 transition-colors">
                            Artistas
                        </div>
                    </Link>
                </div>
            </div>

            {/* Versión desktop (sidebar) - Se muestra en pantallas medianas/grandes */}
            <div className="hidden md:flex h-screen fixed left-0 top-0 z-10">
                <div className="flex flex-col w-64 bg-white shadow-lg relative">
                    {/* Encabezado con logo y título */}
                    <div className="bg-blue-800 p-4 flex flex-col items-center">
                        <Link href="/" className="mb-2">
                            <Image
                                width={80}
                                height={80}
                                src="/animals-logo1.png"
                                alt="CNU Logo"
                                className="w-16 h-16 rounded-full cursor-pointer border-2 border-white"
                            />
                        </Link>
                        <h1 className="text-2xl font-bold text-white">CNU</h1>
                    </div>
                    {/* Contenedor de botones */}
                    <div className="flex flex-col border-t border-gray-200 flex-1">
                        <Link href="/dashboard" className="w-full">
                            <div className="flex items-center justify-center h-14 px-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                <span className="text-gray-800 font-medium">Inicio</span>
                            </div>
                        </Link>
                        
                        {user.rol == "ADMIN" && (
                            <Link href="/dashboard/usuarios" className="w-full">
                                <div className="flex items-center justify-center h-14 px-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <span className="text-gray-800 font-medium">Usuarios</span>
                                </div>
                            </Link>
                        )}

                        <Link href="/dashboard/artistas" className="w-full">
                            <div className="flex items-center justify-center h-14 px-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                <span className="text-gray-800 font-medium">Artistas</span>
                            </div>
                        </Link>
                    </div>

                    {/* Botón de salir (solo redirecciona) */}
                    <button 
                        onClick={() => router.push("/")}
                        className="absolute bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md transition-colors">
                        Salir
                    </button>
                </div>
            </div>
        </>
    );
}